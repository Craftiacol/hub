#!/usr/bin/env python3
"""Asset management operations for Google Ads (Performance Max assets)."""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger


def create_text_asset(
    client, customer_id: str, text: str, dry_run: bool = False
) -> str | None:
    """Create a text asset.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        text: Asset text content.
        dry_run: If True, only log what would happen.

    Returns:
        Asset resource name or None on dry run.
    """
    logger.info("CREATE TEXT ASSET: '%s'", text)
    if dry_run:
        logger.info("[DRY RUN] Would create text asset")
        return None

    asset_service = client.get_service("AssetService")
    op = client.get_type("AssetOperation")
    asset = op.create
    asset.text_asset.text = text

    response = asset_service.mutate_assets(customer_id=customer_id, operations=[op])
    rn = response.results[0].resource_name
    logger.info("Created text asset: %s", rn)
    return rn


def create_text_assets_batch(
    client, customer_id: str, texts: list[str], dry_run: bool = False
) -> list[str]:
    """Create multiple text assets in a single batch request.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        texts: List of text strings for assets.
        dry_run: If True, only log what would happen.

    Returns:
        List of asset resource names.
    """
    logger.info("CREATE TEXT ASSETS BATCH: %d assets", len(texts))
    for t in texts:
        logger.info("  '%s' (%d chars)", t, len(t))

    if dry_run:
        logger.info("[DRY RUN] Would create %d text assets", len(texts))
        return []

    asset_service = client.get_service("AssetService")
    operations = []
    for text in texts:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = text
        operations.append(op)

    response = asset_service.mutate_assets(customer_id=customer_id, operations=operations)
    results = [r.resource_name for r in response.results]
    logger.info("Created %d text assets", len(results))
    return results


def create_image_asset(
    client, customer_id: str, image_path: str, name: str, dry_run: bool = False
) -> str | None:
    """Create an image asset from a file.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        image_path: Path to the image file.
        name: Asset name.
        dry_run: If True, only log what would happen.

    Returns:
        Asset resource name or None on dry run.
    """
    logger.info("CREATE IMAGE ASSET: name='%s', path='%s'", name, image_path)
    if dry_run:
        logger.info("[DRY RUN] Would create image asset '%s'", name)
        return None

    with open(image_path, "rb") as f:
        image_data = f.read()

    asset_service = client.get_service("AssetService")
    op = client.get_type("AssetOperation")
    asset = op.create
    asset.name = name
    asset.type_ = client.enums.AssetTypeEnum.IMAGE
    asset.image_asset.data = image_data

    response = asset_service.mutate_assets(customer_id=customer_id, operations=[op])
    rn = response.results[0].resource_name
    logger.info("Created image asset: %s", rn)
    return rn


def add_asset_to_group(
    client,
    customer_id: str,
    asset_group_id: str,
    asset_resource_name: str,
    field_type: str,
    dry_run: bool = False,
) -> str | None:
    """Link an asset to an asset group with a specific field type.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        asset_resource_name: The asset resource name to link.
        field_type: Asset field type (HEADLINE, DESCRIPTION, LONG_HEADLINE,
                    MARKETING_IMAGE, LOGO, BUSINESS_NAME, etc.)
        dry_run: If True, only log what would happen.

    Returns:
        Asset group asset resource name or None on dry run.
    """
    logger.info(
        "ADD ASSET TO GROUP: group=%s, field=%s, asset=%s",
        asset_group_id, field_type, asset_resource_name,
    )
    if dry_run:
        logger.info("[DRY RUN] Would link asset to group %s as %s", asset_group_id, field_type)
        return None

    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    asset_group_service = client.get_service("AssetGroupService")
    op = client.get_type("AssetGroupAssetOperation")

    link = op.create
    link.asset_group = asset_group_service.asset_group_path(customer_id, asset_group_id)
    link.asset = asset_resource_name
    link.field_type = getattr(client.enums.AssetFieldTypeEnum, field_type)

    response = asset_group_asset_service.mutate_asset_group_assets(
        customer_id=customer_id, operations=[op]
    )
    rn = response.results[0].resource_name
    logger.info("Linked asset: %s", rn)
    return rn


def add_assets_to_group_batch(
    client,
    customer_id: str,
    asset_group_id: str,
    asset_resource_names: list[str],
    field_type: str,
    dry_run: bool = False,
) -> list[str]:
    """Link multiple assets to an asset group in a single batch.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        asset_resource_names: List of asset resource names to link.
        field_type: Asset field type for all assets.
        dry_run: If True, only log what would happen.

    Returns:
        List of asset group asset resource names.
    """
    logger.info(
        "ADD ASSETS BATCH: group=%s, field=%s, count=%d",
        asset_group_id, field_type, len(asset_resource_names),
    )
    if dry_run:
        logger.info("[DRY RUN] Would link %d assets to group %s", len(asset_resource_names), asset_group_id)
        return []

    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    asset_group_service = client.get_service("AssetGroupService")
    operations = []

    for asset_rn in asset_resource_names:
        op = client.get_type("AssetGroupAssetOperation")
        link = op.create
        link.asset_group = asset_group_service.asset_group_path(customer_id, asset_group_id)
        link.asset = asset_rn
        link.field_type = getattr(client.enums.AssetFieldTypeEnum, field_type)
        operations.append(op)

    response = asset_group_asset_service.mutate_asset_group_assets(
        customer_id=customer_id, operations=operations
    )
    results = [r.resource_name for r in response.results]
    logger.info("Linked %d assets", len(results))
    return results


def remove_asset_from_group(
    client,
    customer_id: str,
    asset_group_id: str,
    asset_id: str,
    field_type: str,
    dry_run: bool = False,
):
    """Remove an asset from an asset group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Asset group ID.
        asset_id: Asset ID to remove.
        field_type: The field type of the asset link.
        dry_run: If True, only log what would happen.
    """
    logger.info(
        "REMOVE ASSET FROM GROUP: group=%s, asset=%s, field=%s",
        asset_group_id, asset_id, field_type,
    )
    if dry_run:
        logger.info("[DRY RUN] Would remove asset %s from group %s", asset_id, asset_group_id)
        return

    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    op = client.get_type("AssetGroupAssetOperation")
    op.remove = asset_group_asset_service.asset_group_asset_path(
        customer_id, asset_group_id, asset_id, field_type
    )

    asset_group_asset_service.mutate_asset_group_assets(
        customer_id=customer_id, operations=[op]
    )
    logger.info("Asset %s removed from group %s", asset_id, asset_group_id)


def update_business_name(
    client,
    customer_id: str,
    asset_group_id: str,
    business_name: str,
    dry_run: bool = False,
) -> str | None:
    """Create a text asset for business name and link it to an asset group.

    Args:
        client: GoogleAdsClient instance.
        customer_id: Target customer ID.
        asset_group_id: Target asset group ID.
        business_name: The business name text.
        dry_run: If True, only log what would happen.

    Returns:
        Asset resource name or None on dry run.
    """
    logger.info("UPDATE BUSINESS NAME: group=%s, name='%s'", asset_group_id, business_name)
    if dry_run:
        logger.info("[DRY RUN] Would set business name to '%s' for group %s", business_name, asset_group_id)
        return None

    # Create text asset for business name
    asset_rn = create_text_asset(client, customer_id, business_name)

    # Link it as BUSINESS_NAME
    add_asset_to_group(client, customer_id, asset_group_id, asset_rn, "BUSINESS_NAME")

    logger.info("Business name updated to '%s'", business_name)
    return asset_rn


def main():
    parser = base_argparser("Google Ads Asset Manager")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # Create text asset
    text_parser = subparsers.add_parser("create-text", help="Create a text asset")
    text_parser.add_argument("--text", required=True, help="Asset text content")

    # Create image asset
    image_parser = subparsers.add_parser("create-image", help="Create an image asset")
    image_parser.add_argument("--path", required=True, help="Path to image file")
    image_parser.add_argument("--name", required=True, help="Asset name")

    # Link asset to group
    link_parser = subparsers.add_parser("link", help="Link asset to asset group")
    link_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    link_parser.add_argument("--asset-rn", required=True, help="Asset resource name")
    link_parser.add_argument(
        "--field-type", required=True,
        help="Field type (HEADLINE, DESCRIPTION, LONG_HEADLINE, MARKETING_IMAGE, LOGO, BUSINESS_NAME)",
    )

    # Remove asset from group
    unlink_parser = subparsers.add_parser("unlink", help="Remove asset from asset group")
    unlink_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    unlink_parser.add_argument("--asset-id", required=True, help="Asset ID")
    unlink_parser.add_argument("--field-type", required=True, help="Field type")

    # Update business name
    biz_parser = subparsers.add_parser("business-name", help="Set business name for asset group")
    biz_parser.add_argument("--asset-group-id", required=True, help="Asset group ID")
    biz_parser.add_argument("--name", required=True, help="Business name")

    args = parser.parse_args()

    try:
        client = get_client(args.config)

        match args.action:
            case "create-text":
                create_text_asset(client, args.customer_id, args.text, args.dry_run)
            case "create-image":
                create_image_asset(client, args.customer_id, args.path, args.name, args.dry_run)
            case "link":
                add_asset_to_group(
                    client, args.customer_id, args.asset_group_id,
                    args.asset_rn, args.field_type, args.dry_run,
                )
            case "unlink":
                remove_asset_from_group(
                    client, args.customer_id, args.asset_group_id,
                    args.asset_id, args.field_type, args.dry_run,
                )
            case "business-name":
                update_business_name(client, args.customer_id, args.asset_group_id, args.name, args.dry_run)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error: %s", ex.failure.errors[0].message if ex.failure.errors else ex)
        sys.exit(1)


if __name__ == "__main__":
    main()
