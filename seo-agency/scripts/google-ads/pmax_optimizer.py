#!/usr/bin/env python3
"""Performance Max specific optimization operations."""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger
from asset_manager import (
    create_text_assets_batch,
    create_image_asset,
    add_assets_to_group_batch,
    add_asset_to_group,
    update_business_name,
)


def add_headlines_to_pmax(
    client,
    customer_id: str,
    asset_group_id: str,
    headlines_list: list[str],
    dry_run: bool = False,
) -> list[str]:
    """Add headline assets to a PMax asset group.

    Creates text assets and links them as HEADLINE field type.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        headlines_list: List of headline strings (max 30 chars each).
        dry_run: If True, only log what would happen.

    Returns:
        List of created asset resource names.
    """
    logger.info("ADD PMAX HEADLINES: group=%s, count=%d", asset_group_id, len(headlines_list))
    for h in headlines_list:
        status = "OK" if len(h) <= 30 else "WARNING: OVER 30 CHARS"
        logger.info("  '%s' (%d chars) [%s]", h, len(h), status)

    if dry_run:
        logger.info("[DRY RUN] Would add %d headlines to asset group %s", len(headlines_list), asset_group_id)
        return []

    # Create text assets in batch
    asset_rns = create_text_assets_batch(client, customer_id, headlines_list)

    # Link them as HEADLINE
    add_assets_to_group_batch(client, customer_id, asset_group_id, asset_rns, "HEADLINE")

    logger.info("Added %d headlines to asset group %s", len(asset_rns), asset_group_id)
    return asset_rns


def add_descriptions_to_pmax(
    client,
    customer_id: str,
    asset_group_id: str,
    descriptions_list: list[str],
    dry_run: bool = False,
) -> list[str]:
    """Add description assets to a PMax asset group.

    Creates text assets and links them as DESCRIPTION field type.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        descriptions_list: List of description strings (max 90 chars each).
        dry_run: If True, only log what would happen.

    Returns:
        List of created asset resource names.
    """
    logger.info("ADD PMAX DESCRIPTIONS: group=%s, count=%d", asset_group_id, len(descriptions_list))
    for d in descriptions_list:
        status = "OK" if len(d) <= 90 else "WARNING: OVER 90 CHARS"
        logger.info("  '%s' (%d chars) [%s]", d, len(d), status)

    if dry_run:
        logger.info("[DRY RUN] Would add %d descriptions to asset group %s", len(descriptions_list), asset_group_id)
        return []

    asset_rns = create_text_assets_batch(client, customer_id, descriptions_list)
    add_assets_to_group_batch(client, customer_id, asset_group_id, asset_rns, "DESCRIPTION")

    logger.info("Added %d descriptions to asset group %s", len(asset_rns), asset_group_id)
    return asset_rns


def add_long_headlines_to_pmax(
    client,
    customer_id: str,
    asset_group_id: str,
    long_headlines_list: list[str],
    dry_run: bool = False,
) -> list[str]:
    """Add long headline assets to a PMax asset group.

    Creates text assets and links them as LONG_HEADLINE field type.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        long_headlines_list: List of long headline strings (max 90 chars each).
        dry_run: If True, only log what would happen.

    Returns:
        List of created asset resource names.
    """
    logger.info("ADD PMAX LONG HEADLINES: group=%s, count=%d", asset_group_id, len(long_headlines_list))
    for h in long_headlines_list:
        status = "OK" if len(h) <= 90 else "WARNING: OVER 90 CHARS"
        logger.info("  '%s' (%d chars) [%s]", h, len(h), status)

    if dry_run:
        logger.info("[DRY RUN] Would add %d long headlines to asset group %s", len(long_headlines_list), asset_group_id)
        return []

    asset_rns = create_text_assets_batch(client, customer_id, long_headlines_list)
    add_assets_to_group_batch(client, customer_id, asset_group_id, asset_rns, "LONG_HEADLINE")

    logger.info("Added %d long headlines to asset group %s", len(asset_rns), asset_group_id)
    return asset_rns


def restore_logo(
    client,
    customer_id: str,
    asset_group_id: str,
    logo_path: str,
    dry_run: bool = False,
) -> str | None:
    """Restore/add a logo image to a PMax asset group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        logo_path: Path to the logo image file.
        dry_run: If True, only log what would happen.

    Returns:
        Asset resource name or None on dry run.
    """
    logger.info("RESTORE LOGO: group=%s, path='%s'", asset_group_id, logo_path)
    if dry_run:
        logger.info("[DRY RUN] Would restore logo for asset group %s", asset_group_id)
        return None

    # Create image asset
    asset_rn = create_image_asset(client, customer_id, logo_path, "Logo")

    # Link as LOGO
    add_asset_to_group(client, customer_id, asset_group_id, asset_rn, "LOGO")

    logger.info("Logo restored for asset group %s", asset_group_id)
    return asset_rn


def restore_business_name(
    client,
    customer_id: str,
    asset_group_id: str,
    name: str,
    dry_run: bool = False,
) -> str | None:
    """Restore/update business name for a PMax asset group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        name: Business name text.
        dry_run: If True, only log what would happen.

    Returns:
        Asset resource name or None on dry run.
    """
    return update_business_name(client, customer_id, asset_group_id, name, dry_run)


def main():
    parser = base_argparser("Google Ads PMax Optimizer")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Add headlines
    hl_parser = subparsers.add_parser("add-headlines", help="Add headlines to PMax asset group")
    hl_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    hl_parser.add_argument("--headlines", nargs="+", required=True, help="Headline texts (max 30 chars each)")

    # Add descriptions
    desc_parser = subparsers.add_parser("add-descriptions", help="Add descriptions to PMax asset group")
    desc_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    desc_parser.add_argument("--descriptions", nargs="+", required=True, help="Description texts (max 90 chars each)")

    # Add long headlines
    lh_parser = subparsers.add_parser("add-long-headlines", help="Add long headlines to PMax asset group")
    lh_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    lh_parser.add_argument("--long-headlines", nargs="+", required=True, help="Long headline texts (max 90 chars each)")

    # Restore logo
    logo_parser = subparsers.add_parser("restore-logo", help="Restore logo for PMax asset group")
    logo_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    logo_parser.add_argument("--logo-path", required=True, help="Path to logo image file")

    # Restore business name
    biz_parser = subparsers.add_parser("restore-business-name", help="Restore business name")
    biz_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    biz_parser.add_argument("--name", required=True, help="Business name")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "add-headlines":
                add_headlines_to_pmax(client, args.customer_id, args.asset_group_id, args.headlines, args.dry_run)
            case "add-descriptions":
                add_descriptions_to_pmax(client, args.customer_id, args.asset_group_id, args.descriptions, args.dry_run)
            case "add-long-headlines":
                add_long_headlines_to_pmax(client, args.customer_id, args.asset_group_id, args.long_headlines, args.dry_run)
            case "restore-logo":
                restore_logo(client, args.customer_id, args.asset_group_id, args.logo_path, args.dry_run)
            case "restore-business-name":
                restore_business_name(client, args.customer_id, args.asset_group_id, args.name, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        sys.exit(1)


if __name__ == "__main__":
    main()
