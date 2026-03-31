#!/usr/bin/env python3
"""Keyword management operations for Google Ads."""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger


def add_keywords(
    client,
    customer_id: str,
    ad_group_id: str,
    keywords_list: list[dict],
    dry_run: bool = False,
) -> list[str]:
    """Add keywords to an ad group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        ad_group_id: Target ad group ID.
        keywords_list: List of dicts with 'text' and 'match_type' keys.
                       match_type: EXACT, PHRASE, BROAD.
        dry_run: If True, only log what would happen.

    Returns:
        List of created criterion resource names.
    """
    logger.info("ADD KEYWORDS: ad_group=%s, count=%d", ad_group_id, len(keywords_list))
    for kw in keywords_list:
        logger.info("  [%s] %s", kw["match_type"], kw["text"])

    if dry_run:
        logger.info("[DRY RUN] Would add %d keywords to ad group %s", len(keywords_list), ad_group_id)
        return []

    ad_group_service = client.get_service("AdGroupService")
    criterion_service = client.get_service("AdGroupCriterionService")
    operations = []

    for kw in keywords_list:
        op = client.get_type("AdGroupCriterionOperation")
        criterion = op.create
        criterion.ad_group = ad_group_service.ad_group_path(customer_id, ad_group_id)
        criterion.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
        criterion.keyword.text = kw["text"]
        criterion.keyword.match_type = getattr(
            client.enums.KeywordMatchTypeEnum, kw["match_type"]
        )
        operations.append(op)

    response = criterion_service.mutate_ad_group_criteria(
        customer_id=customer_id, operations=operations
    )
    results = [r.resource_name for r in response.results]
    logger.info("Added %d keywords", len(results))
    return results


def remove_keyword(
    client,
    customer_id: str,
    ad_group_id: str,
    criterion_id: str,
    dry_run: bool = False,
):
    """Remove a keyword criterion from an ad group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        ad_group_id: Ad group containing the keyword.
        criterion_id: The criterion ID to remove.
        dry_run: If True, only log what would happen.
    """
    logger.info("REMOVE KEYWORD: ad_group=%s, criterion=%s", ad_group_id, criterion_id)
    if dry_run:
        logger.info("[DRY RUN] Would remove keyword criterion %s", criterion_id)
        return

    criterion_service = client.get_service("AdGroupCriterionService")
    op = client.get_type("AdGroupCriterionOperation")
    op.remove = criterion_service.ad_group_criterion_path(
        customer_id, ad_group_id, criterion_id
    )

    criterion_service.mutate_ad_group_criteria(
        customer_id=customer_id, operations=[op]
    )
    logger.info("Keyword criterion %s removed", criterion_id)


def add_negative_keywords(
    client,
    customer_id: str,
    campaign_id: str,
    keywords_list: list[str],
    dry_run: bool = False,
) -> list[str]:
    """Add negative keywords at the campaign level.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        campaign_id: Target campaign ID.
        keywords_list: List of negative keyword strings (added as EXACT match).
        dry_run: If True, only log what would happen.

    Returns:
        List of created criterion resource names.
    """
    logger.info("ADD NEGATIVE KEYWORDS: campaign=%s, count=%d", campaign_id, len(keywords_list))
    for kw in keywords_list:
        logger.info("  [NEGATIVE] %s", kw)

    if dry_run:
        logger.info("[DRY RUN] Would add %d negative keywords to campaign %s", len(keywords_list), campaign_id)
        return []

    campaign_service = client.get_service("CampaignService")
    criterion_service = client.get_service("CampaignCriterionService")
    operations = []

    for kw_text in keywords_list:
        op = client.get_type("CampaignCriterionOperation")
        criterion = op.create
        criterion.campaign = campaign_service.campaign_path(customer_id, campaign_id)
        criterion.negative = True
        criterion.keyword.text = kw_text
        criterion.keyword.match_type = client.enums.KeywordMatchTypeEnum.EXACT
        operations.append(op)

    response = criterion_service.mutate_campaign_criteria(
        customer_id=customer_id, operations=operations
    )
    results = [r.resource_name for r in response.results]
    logger.info("Added %d negative keywords", len(results))
    return results


def main():
    parser = base_argparser("Google Ads Keyword Manager")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Add keywords
    add_parser = subparsers.add_parser("add", help="Add keywords to an ad group")
    add_parser.add_argument("--ad-group-id", required=True, help="Target ad group ID")
    add_parser.add_argument(
        "--keywords", nargs="+", required=True,
        help="Keywords in format 'text:MATCH_TYPE' (e.g. 'honda motos:PHRASE')",
    )

    # Remove keyword
    remove_parser = subparsers.add_parser("remove", help="Remove a keyword")
    remove_parser.add_argument("--ad-group-id", required=True, help="Ad group ID")
    remove_parser.add_argument("--criterion-id", required=True, help="Criterion ID to remove")

    # Add negative keywords
    neg_parser = subparsers.add_parser("add-negatives", help="Add campaign-level negative keywords")
    neg_parser.add_argument("--campaign-id", required=True, help="Target campaign ID")
    neg_parser.add_argument("--keywords", nargs="+", required=True, help="Negative keyword texts")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "add":
                keywords = []
                for kw_str in args.keywords:
                    parts = kw_str.rsplit(":", 1)
                    if len(parts) != 2:
                        logger.error("Invalid keyword format: '%s'. Use 'text:MATCH_TYPE'", kw_str)
                        sys.exit(1)
                    keywords.append({"text": parts[0], "match_type": parts[1]})
                add_keywords(client, args.customer_id, args.ad_group_id, keywords, args.dry_run)

            case "remove":
                remove_keyword(client, args.customer_id, args.ad_group_id, args.criterion_id, args.dry_run)

            case "add-negatives":
                add_negative_keywords(client, args.customer_id, args.campaign_id, args.keywords, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        sys.exit(1)


if __name__ == "__main__":
    main()
