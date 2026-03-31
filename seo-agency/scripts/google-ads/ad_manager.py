#!/usr/bin/env python3
"""Ad management operations for Google Ads (Responsive Search Ads)."""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger


def create_responsive_search_ad(
    client,
    customer_id: str,
    ad_group_id: str,
    headlines: list[str],
    descriptions: list[str],
    final_urls: list[str],
    path1: str | None = None,
    path2: str | None = None,
    dry_run: bool = False,
) -> str | None:
    """Create a Responsive Search Ad (RSA) in an ad group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        ad_group_id: Target ad group ID.
        headlines: List of headline strings (min 3, max 15, each max 30 chars).
        descriptions: List of description strings (min 2, max 4, each max 90 chars).
        final_urls: List of landing page URLs.
        path1: First URL path (max 15 chars). Optional.
        path2: Second URL path (max 15 chars). Optional.
        dry_run: If True, only log what would happen.

    Returns:
        Ad group ad resource name or None on dry run.
    """
    logger.info(
        "CREATE RSA: ad_group=%s, headlines=%d, descriptions=%d",
        ad_group_id, len(headlines), len(descriptions),
    )
    for i, h in enumerate(headlines, 1):
        logger.info("  Headline %d (%d chars): %s", i, len(h), h)
    for i, d in enumerate(descriptions, 1):
        logger.info("  Description %d (%d chars): %s", i, len(d), d)

    # Validate
    if len(headlines) < 3:
        raise ValueError(f"RSA requires at least 3 headlines, got {len(headlines)}")
    if len(headlines) > 15:
        raise ValueError(f"RSA allows max 15 headlines, got {len(headlines)}")
    if len(descriptions) < 2:
        raise ValueError(f"RSA requires at least 2 descriptions, got {len(descriptions)}")
    if len(descriptions) > 4:
        raise ValueError(f"RSA allows max 4 descriptions, got {len(descriptions)}")

    for h in headlines:
        if len(h) > 30:
            logger.warning("Headline exceeds 30 chars (%d): '%s'", len(h), h)
    for d in descriptions:
        if len(d) > 90:
            logger.warning("Description exceeds 90 chars (%d): '%s'", len(d), d)

    if dry_run:
        logger.info("[DRY RUN] Would create RSA in ad group %s", ad_group_id)
        return None

    ad_group_service = client.get_service("AdGroupService")
    ad_group_ad_service = client.get_service("AdGroupAdService")
    op = client.get_type("AdGroupAdOperation")

    ad_group_ad = op.create
    ad_group_ad.ad_group = ad_group_service.ad_group_path(customer_id, ad_group_id)
    ad_group_ad.status = client.enums.AdGroupAdStatusEnum.ENABLED

    ad = ad_group_ad.ad
    ad.final_urls.append(final_urls[0])
    for url in final_urls[1:]:
        ad.final_urls.append(url)

    # Set headlines
    for text in headlines:
        headline = client.get_type("AdTextAsset")
        headline.text = text
        ad.responsive_search_ad.headlines.append(headline)

    # Set descriptions
    for text in descriptions:
        desc = client.get_type("AdTextAsset")
        desc.text = text
        ad.responsive_search_ad.descriptions.append(desc)

    # Optional URL paths
    if path1:
        ad.responsive_search_ad.path1 = path1
    if path2:
        ad.responsive_search_ad.path2 = path2

    response = ad_group_ad_service.mutate_ad_group_ads(
        customer_id=customer_id, operations=[op]
    )
    rn = response.results[0].resource_name
    logger.info("Created RSA: %s", rn)
    return rn


def update_ad(
    client,
    customer_id: str,
    ad_id: str,
    headlines: list[str] | None = None,
    descriptions: list[str] | None = None,
    dry_run: bool = False,
):
    """Update an existing ad's headlines and/or descriptions.

    Note: For RSA, updating creates a new ad version.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        ad_id: Ad ID to update.
        headlines: New headlines list. Optional.
        descriptions: New descriptions list. Optional.
        dry_run: If True, only log what would happen.
    """
    logger.info("UPDATE AD: id=%s", ad_id)
    if headlines:
        logger.info("  New headlines: %d", len(headlines))
    if descriptions:
        logger.info("  New descriptions: %d", len(descriptions))

    if dry_run:
        logger.info("[DRY RUN] Would update ad %s", ad_id)
        return

    ad_service = client.get_service("AdService")
    op = client.get_type("AdOperation")
    ad = op.update
    ad.resource_name = ad_service.ad_path(customer_id, ad_id)

    field_mask = client.get_type("FieldMask")

    if headlines:
        del ad.responsive_search_ad.headlines[:]
        for text in headlines:
            headline = client.get_type("AdTextAsset")
            headline.text = text
            ad.responsive_search_ad.headlines.append(headline)
        field_mask.paths.append("responsive_search_ad.headlines")

    if descriptions:
        del ad.responsive_search_ad.descriptions[:]
        for text in descriptions:
            desc = client.get_type("AdTextAsset")
            desc.text = text
            ad.responsive_search_ad.descriptions.append(desc)
        field_mask.paths.append("responsive_search_ad.descriptions")

    op.update_mask.CopyFrom(field_mask)

    ad_service.mutate_ads(customer_id=customer_id, operations=[op])
    logger.info("Ad %s updated", ad_id)


def main():
    parser = base_argparser("Google Ads Ad Manager (RSA)")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Create RSA
    create_parser = subparsers.add_parser("create-rsa", help="Create a Responsive Search Ad")
    create_parser.add_argument("--ad-group-id", required=True, help="Target ad group ID")
    create_parser.add_argument("--headlines", nargs="+", required=True, help="Headline texts (min 3, max 15)")
    create_parser.add_argument("--descriptions", nargs="+", required=True, help="Description texts (min 2, max 4)")
    create_parser.add_argument("--urls", nargs="+", required=True, help="Final URLs")
    create_parser.add_argument("--path1", default=None, help="URL path 1")
    create_parser.add_argument("--path2", default=None, help="URL path 2")

    # Update
    update_parser = subparsers.add_parser("update", help="Update an existing ad")
    update_parser.add_argument("--ad-id", required=True, help="Ad ID to update")
    update_parser.add_argument("--headlines", nargs="+", default=None, help="New headlines")
    update_parser.add_argument("--descriptions", nargs="+", default=None, help="New descriptions")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "create-rsa":
                create_responsive_search_ad(
                    client, args.customer_id, args.ad_group_id,
                    args.headlines, args.descriptions, args.urls,
                    args.path1, args.path2, args.dry_run,
                )
            case "update":
                update_ad(client, args.customer_id, args.ad_id, args.headlines, args.descriptions, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        sys.exit(1)


if __name__ == "__main__":
    main()
