#!/usr/bin/env python3
"""Campaign management operations for Google Ads."""

import sys
from google.api_core import protobuf_helpers
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger, format_micros


def create_campaign(
    client,
    customer_id: str,
    name: str,
    budget_micros: int,
    bidding_strategy: str = "MAXIMIZE_CLICKS",
    channel_type: str = "SEARCH",
    dry_run: bool = False,
) -> str | None:
    """Create a new campaign with a dedicated budget.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        name: Campaign name.
        budget_micros: Daily budget in micros.
        bidding_strategy: One of MAXIMIZE_CLICKS, MAXIMIZE_CONVERSIONS,
                          MAXIMIZE_CONVERSION_VALUE, TARGET_CPA, TARGET_ROAS.
        channel_type: SEARCH, PERFORMANCE_MAX, DISPLAY, etc.
        dry_run: If True, only log what would happen.

    Returns:
        Campaign resource name or None on dry run.
    """
    logger.info(
        "CREATE CAMPAIGN: name=%s, budget=%s, bidding=%s, channel=%s",
        name, format_micros(budget_micros), bidding_strategy, channel_type,
    )
    if dry_run:
        logger.info("[DRY RUN] Would create campaign '%s'", name)
        return None

    # Step 1: Create campaign budget
    budget_service = client.get_service("CampaignBudgetService")
    budget_op = client.get_type("CampaignBudgetOperation")
    budget_resource = budget_op.create
    budget_resource.name = f"{name} Budget"
    budget_resource.amount_micros = budget_micros
    budget_resource.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD

    budget_response = budget_service.mutate_campaign_budgets(
        customer_id=customer_id, operations=[budget_op]
    )
    budget_rn = budget_response.results[0].resource_name
    logger.info("Created budget: %s", budget_rn)

    # Step 2: Create campaign
    campaign_service = client.get_service("CampaignService")
    campaign_op = client.get_type("CampaignOperation")
    campaign = campaign_op.create
    campaign.name = name
    campaign.campaign_budget = budget_rn
    campaign.status = client.enums.CampaignStatusEnum.PAUSED

    # Set channel type
    channel_enum = client.enums.AdvertisingChannelTypeEnum
    campaign.advertising_channel_type = getattr(channel_enum, channel_type)

    # Set bidding strategy
    _set_bidding_strategy(campaign, bidding_strategy)

    # Network settings for Search campaigns
    if channel_type == "SEARCH":
        campaign.network_settings.target_google_search = True
        campaign.network_settings.target_search_network = True

    response = campaign_service.mutate_campaigns(
        customer_id=customer_id, operations=[campaign_op]
    )
    campaign_rn = response.results[0].resource_name
    logger.info("Created campaign: %s", campaign_rn)
    return campaign_rn


def _set_bidding_strategy(campaign, strategy: str, target_cpa: int | None = None, target_roas: float | None = None, max_cpc_micros: int | None = None):
    """Set bidding strategy on a campaign resource."""
    match strategy:
        case "MAXIMIZE_CLICKS":
            campaign.maximize_clicks.CopyFrom(
                protobuf_helpers.get_messages_from_type(type(campaign.maximize_clicks))
                if False else campaign.maximize_clicks.__class__()
            )
            if max_cpc_micros:
                campaign.maximize_clicks.cpc_bid_ceiling_micros = max_cpc_micros
        case "MAXIMIZE_CONVERSIONS":
            campaign.maximize_conversions.CopyFrom(campaign.maximize_conversions.__class__())
            if target_cpa:
                campaign.maximize_conversions.target_cpa_micros = target_cpa
        case "MAXIMIZE_CONVERSION_VALUE":
            campaign.maximize_conversion_value.CopyFrom(campaign.maximize_conversion_value.__class__())
            if target_roas:
                campaign.maximize_conversion_value.target_roas = target_roas
        case "TARGET_CPA":
            campaign.maximize_conversions.target_cpa_micros = target_cpa or 0
        case "TARGET_ROAS":
            campaign.maximize_conversion_value.target_roas = target_roas or 0.0
        case _:
            raise ValueError(f"Unknown bidding strategy: {strategy}")


def update_campaign_budget(
    client, customer_id: str, campaign_id: str, new_budget_micros: int, dry_run: bool = False
):
    """Update the daily budget for a campaign.

    Finds the campaign's budget resource and updates its amount.
    """
    logger.info(
        "UPDATE BUDGET: campaign=%s, new_budget=%s",
        campaign_id, format_micros(new_budget_micros),
    )
    if dry_run:
        logger.info("[DRY RUN] Would update budget for campaign %s", campaign_id)
        return

    # Find current budget resource name
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT campaign.campaign_budget
        FROM campaign
        WHERE campaign.id = {campaign_id}
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    budget_rn = None
    for row in response:
        budget_rn = row.campaign.campaign_budget
        break

    if not budget_rn:
        raise ValueError(f"Campaign {campaign_id} not found or has no budget")

    # Update budget
    budget_service = client.get_service("CampaignBudgetService")
    budget_op = client.get_type("CampaignBudgetOperation")
    budget = budget_op.update
    budget.resource_name = budget_rn
    budget.amount_micros = new_budget_micros

    field_mask = client.get_type("FieldMask")
    field_mask.paths.append("amount_micros")
    budget_op.update_mask.CopyFrom(field_mask)

    budget_service.mutate_campaign_budgets(
        customer_id=customer_id, operations=[budget_op]
    )
    logger.info("Budget updated to %s", format_micros(new_budget_micros))


def update_campaign_bidding(
    client, customer_id: str, campaign_id: str, strategy: str,
    target_cpa: int | None = None, target_roas: float | None = None,
    max_cpc_micros: int | None = None, dry_run: bool = False,
):
    """Update bidding strategy for a campaign."""
    logger.info("UPDATE BIDDING: campaign=%s, strategy=%s", campaign_id, strategy)
    if dry_run:
        logger.info("[DRY RUN] Would update bidding for campaign %s to %s", campaign_id, strategy)
        return

    campaign_service = client.get_service("CampaignService")
    campaign_op = client.get_type("CampaignOperation")
    campaign = campaign_op.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)

    _set_bidding_strategy(campaign, strategy, target_cpa, target_roas, max_cpc_micros)

    # Build field mask based on strategy
    field_mask = client.get_type("FieldMask")
    match strategy:
        case "MAXIMIZE_CLICKS":
            field_mask.paths.append("maximize_clicks")
        case "MAXIMIZE_CONVERSIONS" | "TARGET_CPA":
            field_mask.paths.append("maximize_conversions")
        case "MAXIMIZE_CONVERSION_VALUE" | "TARGET_ROAS":
            field_mask.paths.append("maximize_conversion_value")

    campaign_op.update_mask.CopyFrom(field_mask)

    campaign_service.mutate_campaigns(
        customer_id=customer_id, operations=[campaign_op]
    )
    logger.info("Bidding updated to %s", strategy)


def update_campaign_name(
    client, customer_id: str, campaign_id: str, new_name: str, dry_run: bool = False
):
    """Rename a campaign."""
    logger.info("RENAME CAMPAIGN: campaign=%s, new_name='%s'", campaign_id, new_name)
    if dry_run:
        logger.info("[DRY RUN] Would rename campaign %s to '%s'", campaign_id, new_name)
        return

    campaign_service = client.get_service("CampaignService")
    campaign_op = client.get_type("CampaignOperation")
    campaign = campaign_op.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    campaign.name = new_name

    field_mask = client.get_type("FieldMask")
    field_mask.paths.append("name")
    campaign_op.update_mask.CopyFrom(field_mask)

    campaign_service.mutate_campaigns(
        customer_id=customer_id, operations=[campaign_op]
    )
    logger.info("Campaign renamed to '%s'", new_name)


def pause_campaign(client, customer_id: str, campaign_id: str, dry_run: bool = False):
    """Pause a campaign."""
    _set_campaign_status(client, customer_id, campaign_id, "PAUSED", dry_run)


def enable_campaign(client, customer_id: str, campaign_id: str, dry_run: bool = False):
    """Enable a campaign."""
    _set_campaign_status(client, customer_id, campaign_id, "ENABLED", dry_run)


def _set_campaign_status(client, customer_id: str, campaign_id: str, status: str, dry_run: bool):
    """Set campaign status."""
    logger.info("SET STATUS: campaign=%s, status=%s", campaign_id, status)
    if dry_run:
        logger.info("[DRY RUN] Would set campaign %s to %s", campaign_id, status)
        return

    campaign_service = client.get_service("CampaignService")
    campaign_op = client.get_type("CampaignOperation")
    campaign = campaign_op.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    campaign.status = getattr(client.enums.CampaignStatusEnum, status)

    field_mask = client.get_type("FieldMask")
    field_mask.paths.append("status")
    campaign_op.update_mask.CopyFrom(field_mask)

    campaign_service.mutate_campaigns(
        customer_id=customer_id, operations=[campaign_op]
    )
    logger.info("Campaign %s set to %s", campaign_id, status)


def main():
    parser = base_argparser("Google Ads Campaign Manager")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Create
    create_parser = subparsers.add_parser("create", help="Create a new campaign")
    create_parser.add_argument("--name", required=True, help="Campaign name")
    create_parser.add_argument("--budget", type=int, required=True, help="Daily budget in micros")
    create_parser.add_argument("--bidding", default="MAXIMIZE_CLICKS", help="Bidding strategy")
    create_parser.add_argument("--channel", default="SEARCH", help="Channel type (SEARCH, PERFORMANCE_MAX, etc.)")

    # Pause
    pause_parser = subparsers.add_parser("pause", help="Pause a campaign")
    pause_parser.add_argument("--campaign-id", required=True, help="Campaign ID")

    # Enable
    enable_parser = subparsers.add_parser("enable", help="Enable a campaign")
    enable_parser.add_argument("--campaign-id", required=True, help="Campaign ID")

    # Update budget
    budget_parser = subparsers.add_parser("update-budget", help="Update campaign budget")
    budget_parser.add_argument("--campaign-id", required=True, help="Campaign ID")
    budget_parser.add_argument("--budget", type=int, required=True, help="New daily budget in micros")

    # Update bidding
    bidding_parser = subparsers.add_parser("update-bidding", help="Update bidding strategy")
    bidding_parser.add_argument("--campaign-id", required=True, help="Campaign ID")
    bidding_parser.add_argument("--strategy", required=True, help="Bidding strategy")
    bidding_parser.add_argument("--target-cpa", type=int, default=None, help="Target CPA in micros")
    bidding_parser.add_argument("--max-cpc", type=int, default=None, help="Max CPC in micros")

    # Rename
    rename_parser = subparsers.add_parser("rename", help="Rename a campaign")
    rename_parser.add_argument("--campaign-id", required=True, help="Campaign ID")
    rename_parser.add_argument("--name", required=True, help="New campaign name")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "create":
                create_campaign(client, args.customer_id, args.name, args.budget, args.bidding, args.channel, args.dry_run)
            case "pause":
                pause_campaign(client, args.customer_id, args.campaign_id, args.dry_run)
            case "enable":
                enable_campaign(client, args.customer_id, args.campaign_id, args.dry_run)
            case "update-budget":
                update_campaign_budget(client, args.customer_id, args.campaign_id, args.budget, args.dry_run)
            case "update-bidding":
                update_campaign_bidding(
                    client, args.customer_id, args.campaign_id, args.strategy,
                    target_cpa=args.target_cpa, max_cpc_micros=args.max_cpc, dry_run=args.dry_run,
                )
            case "rename":
                update_campaign_name(client, args.customer_id, args.campaign_id, args.name, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        for error in ex.failure.errors:
            logger.error("  Error: %s", error.message)
            logger.error("  Error code: %s", error.error_code)
        sys.exit(1)


if __name__ == "__main__":
    main()
