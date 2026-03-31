#!/usr/bin/env python3
"""Ad Group management operations for Google Ads."""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger, format_micros


def create_ad_group(
    client,
    customer_id: str,
    campaign_id: str,
    name: str,
    cpc_bid_micros: int | None = None,
    dry_run: bool = False,
) -> str | None:
    """Create a new ad group within a campaign.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        campaign_id: Parent campaign ID.
        name: Ad group name.
        cpc_bid_micros: Default CPC bid in micros (optional).
        dry_run: If True, only log what would happen.

    Returns:
        Ad group resource name or None on dry run.
    """
    logger.info(
        "CREATE AD GROUP: campaign=%s, name='%s', cpc_bid=%s",
        campaign_id, name, format_micros(cpc_bid_micros) if cpc_bid_micros else "auto",
    )
    if dry_run:
        logger.info("[DRY RUN] Would create ad group '%s' in campaign %s", name, campaign_id)
        return None

    campaign_service = client.get_service("CampaignService")
    ad_group_service = client.get_service("AdGroupService")
    ad_group_op = client.get_type("AdGroupOperation")

    ad_group = ad_group_op.create
    ad_group.name = name
    ad_group.campaign = campaign_service.campaign_path(customer_id, campaign_id)
    ad_group.status = client.enums.AdGroupStatusEnum.ENABLED
    ad_group.type_ = client.enums.AdGroupTypeEnum.SEARCH_STANDARD

    if cpc_bid_micros:
        ad_group.cpc_bid_micros = cpc_bid_micros

    response = ad_group_service.mutate_ad_groups(
        customer_id=customer_id, operations=[ad_group_op]
    )
    rn = response.results[0].resource_name
    logger.info("Created ad group: %s", rn)
    return rn


def update_ad_group(
    client,
    customer_id: str,
    ad_group_id: str,
    status: str | None = None,
    bid: int | None = None,
    dry_run: bool = False,
):
    """Update an ad group's status and/or bid.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        ad_group_id: Ad group ID to update.
        status: New status (ENABLED, PAUSED, REMOVED). Optional.
        bid: New CPC bid in micros. Optional.
        dry_run: If True, only log what would happen.
    """
    changes = []
    if status:
        changes.append(f"status={status}")
    if bid:
        changes.append(f"bid={format_micros(bid)}")

    logger.info("UPDATE AD GROUP: id=%s, changes=%s", ad_group_id, ", ".join(changes))
    if dry_run:
        logger.info("[DRY RUN] Would update ad group %s", ad_group_id)
        return

    ad_group_service = client.get_service("AdGroupService")
    ad_group_op = client.get_type("AdGroupOperation")
    ad_group = ad_group_op.update
    ad_group.resource_name = ad_group_service.ad_group_path(customer_id, ad_group_id)

    field_mask = client.get_type("FieldMask")

    if status:
        ad_group.status = getattr(client.enums.AdGroupStatusEnum, status)
        field_mask.paths.append("status")

    if bid:
        ad_group.cpc_bid_micros = bid
        field_mask.paths.append("cpc_bid_micros")

    ad_group_op.update_mask.CopyFrom(field_mask)

    ad_group_service.mutate_ad_groups(
        customer_id=customer_id, operations=[ad_group_op]
    )
    logger.info("Ad group %s updated", ad_group_id)


def main():
    parser = base_argparser("Google Ads Ad Group Manager")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Create
    create_parser = subparsers.add_parser("create", help="Create a new ad group")
    create_parser.add_argument("--campaign-id", required=True, help="Parent campaign ID")
    create_parser.add_argument("--name", required=True, help="Ad group name")
    create_parser.add_argument("--cpc-bid", type=int, default=None, help="Default CPC bid in micros")

    # Update
    update_parser = subparsers.add_parser("update", help="Update an ad group")
    update_parser.add_argument("--ad-group-id", required=True, help="Ad group ID")
    update_parser.add_argument("--status", choices=["ENABLED", "PAUSED", "REMOVED"], default=None)
    update_parser.add_argument("--bid", type=int, default=None, help="New CPC bid in micros")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "create":
                create_ad_group(client, args.customer_id, args.campaign_id, args.name, args.cpc_bid, args.dry_run)
            case "update":
                update_ad_group(client, args.customer_id, args.ad_group_id, args.status, args.bid, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        sys.exit(1)


if __name__ == "__main__":
    main()
