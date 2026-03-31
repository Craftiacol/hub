#!/usr/bin/env python3
"""Apply the full PMax optimization plan for Honda Bogota campaign.

This script executes all optimization changes:
1. Re-enable Logo asset for asset group 6690237908
2. Re-enable Business Name asset
3. Change bidding from MAXIMIZE_CONVERSION_VALUE to MAXIMIZE_CLICKS
4. Add new headlines (11 new, to reach 15 total)
5. Add new descriptions (2 new, to reach 5 total)
6. Update budget to $50,000 COP/day (50,000,000,000 micros)
7. Rename campaign to "Honda Bogota - PMax - Principal"
"""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger

# ─── Campaign & Asset Group IDs ────────────────────────────────────
# These are specific to the Honda Bogota account
CAMPAIGN_ID = None  # Will be resolved from asset group
ASSET_GROUP_ID = "6690237908"

# ─── New Headlines (max 30 chars each) ─────────────────────────────
NEW_HEADLINES = [
    "Motos Honda Desde $4.490.000",
    "Repuestos Honda Originales",
    "Honda XR 190 en Stock",
    "Agenda Tu Test Ride Hoy",
    "Servicio Técnico Honda",
    "Honda Navi Desde $5.990.000",
    "Financiamos Sin Codeudor",
    "20+ Modelos Honda 2026",
    "Concesionario Honda Oficial",
    "WhatsApp: Cotiza Tu Honda",
    "Honda CB 190R Disponible",
]

# ─── New Descriptions (max 90 chars each) ──────────────────────────
NEW_DESCRIPTIONS = [
    "Concesionario Honda oficial en Bogotá. Test ride gratis en todos los modelos 2026.",
    "Financiación inmediata sin codeudor. Aprobación en 24 horas. Estrená tu Honda hoy.",
]

# ─── Budget ─────────────────────────────────────────────────────────
NEW_BUDGET_MICROS = 50_000_000_000  # $50,000 COP/day

# ─── New Campaign Name ─────────────────────────────────────────────
NEW_CAMPAIGN_NAME = "Honda Bogotá - PMax - Principal"

# ─── Business Name ─────────────────────────────────────────────────
BUSINESS_NAME = "Honda Motos Bogotá"


def resolve_campaign_id(client, customer_id: str, asset_group_id: str) -> str:
    """Find the campaign ID that owns a given asset group."""
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT asset_group.campaign, campaign.id
        FROM asset_group
        WHERE asset_group.id = {asset_group_id}
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    for row in response:
        return str(row.campaign.id)
    raise ValueError(f"Asset group {asset_group_id} not found")


def step_1_restore_logo(client, customer_id: str, dry_run: bool):
    """Step 1: Re-enable Logo asset for asset group."""
    logger.info("=" * 60)
    logger.info("STEP 1: Restore Logo Asset")
    logger.info("=" * 60)

    from pmax_optimizer import restore_logo

    # NOTE: You need to provide the actual logo file path.
    # If the logo already exists as an asset, use add_asset_to_group instead.
    # For now, we check if there's an existing logo asset to re-link.
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT asset.id, asset.name, asset.image_asset.full_size.url
        FROM asset
        WHERE asset.type = IMAGE
        AND asset.name LIKE '%logo%'
        LIMIT 5
    """
    if dry_run:
        logger.info("[DRY RUN] Would search for existing logo assets and re-link to group %s", ASSET_GROUP_ID)
        return

    response = ga_service.search(customer_id=customer_id, query=query)
    logo_asset_rn = None
    for row in response:
        logger.info("Found logo asset: id=%s, name='%s'", row.asset.id, row.asset.name)
        logo_asset_rn = f"customers/{customer_id}/assets/{row.asset.id}"
        break

    if logo_asset_rn:
        from asset_manager import add_asset_to_group
        add_asset_to_group(client, customer_id, ASSET_GROUP_ID, logo_asset_rn, "LOGO")
        logger.info("Logo re-linked to asset group %s", ASSET_GROUP_ID)
    else:
        logger.warning("No existing logo asset found. Upload a logo image manually.")
        logger.warning("Usage: python asset_manager.py create-image --path logo.png --name 'Honda Logo'")


def step_2_restore_business_name(client, customer_id: str, dry_run: bool):
    """Step 2: Re-enable Business Name asset."""
    logger.info("=" * 60)
    logger.info("STEP 2: Restore Business Name")
    logger.info("=" * 60)

    from pmax_optimizer import restore_business_name
    restore_business_name(client, customer_id, ASSET_GROUP_ID, BUSINESS_NAME, dry_run)


def step_3_update_bidding(client, customer_id: str, campaign_id: str, dry_run: bool):
    """Step 3: Change bidding to MAXIMIZE_CLICKS."""
    logger.info("=" * 60)
    logger.info("STEP 3: Update Bidding Strategy")
    logger.info("=" * 60)

    from campaign_manager import update_campaign_bidding
    update_campaign_bidding(
        client, customer_id, campaign_id,
        strategy="MAXIMIZE_CLICKS",
        dry_run=dry_run,
    )


def step_4_add_headlines(client, customer_id: str, dry_run: bool):
    """Step 4: Add 11 new headlines to reach 15 total."""
    logger.info("=" * 60)
    logger.info("STEP 4: Add New Headlines (%d)", len(NEW_HEADLINES))
    logger.info("=" * 60)

    from pmax_optimizer import add_headlines_to_pmax
    add_headlines_to_pmax(client, customer_id, ASSET_GROUP_ID, NEW_HEADLINES, dry_run)


def step_5_add_descriptions(client, customer_id: str, dry_run: bool):
    """Step 5: Add 2 new descriptions to reach 5 total."""
    logger.info("=" * 60)
    logger.info("STEP 5: Add New Descriptions (%d)", len(NEW_DESCRIPTIONS))
    logger.info("=" * 60)

    from pmax_optimizer import add_descriptions_to_pmax
    add_descriptions_to_pmax(client, customer_id, ASSET_GROUP_ID, NEW_DESCRIPTIONS, dry_run)


def step_6_update_budget(client, customer_id: str, campaign_id: str, dry_run: bool):
    """Step 6: Update daily budget to $50,000 COP."""
    logger.info("=" * 60)
    logger.info("STEP 6: Update Budget to $50,000 COP/day")
    logger.info("=" * 60)

    from campaign_manager import update_campaign_budget
    update_campaign_budget(client, customer_id, campaign_id, NEW_BUDGET_MICROS, dry_run)


def step_7_rename_campaign(client, customer_id: str, campaign_id: str, dry_run: bool):
    """Step 7: Rename campaign to descriptive name."""
    logger.info("=" * 60)
    logger.info("STEP 7: Rename Campaign")
    logger.info("=" * 60)

    from campaign_manager import update_campaign_name
    update_campaign_name(client, customer_id, campaign_id, NEW_CAMPAIGN_NAME, dry_run)


def main():
    parser = base_argparser("Apply Honda Bogota PMax Optimization Plan")
    parser.add_argument(
        "--step", type=int, default=None,
        help="Run only a specific step (1-7). If omitted, run all steps.",
    )
    parser.add_argument(
        "--campaign-id", dest="campaign_id_override", default=None,
        help="Override campaign ID (auto-resolved from asset group if omitted)",
    )
    args = parser.parse_args()

    try:
        client = get_client(args.config)
        customer_id = args.customer_id

        # Resolve campaign ID
        if args.campaign_id_override:
            campaign_id = args.campaign_id_override
        else:
            logger.info("Resolving campaign ID from asset group %s...", ASSET_GROUP_ID)
            if args.dry_run:
                logger.info("[DRY RUN] Would resolve campaign ID from asset group")
                campaign_id = "<auto-resolved>"
            else:
                campaign_id = resolve_campaign_id(client, customer_id, ASSET_GROUP_ID)
                logger.info("Resolved campaign ID: %s", campaign_id)

        logger.info("")
        logger.info("=" * 60)
        logger.info("OPTIMIZATION PLAN - Honda Bogota PMax")
        logger.info("Customer ID: %s", customer_id)
        logger.info("Campaign ID: %s", campaign_id)
        logger.info("Asset Group ID: %s", ASSET_GROUP_ID)
        logger.info("Dry Run: %s", args.dry_run)
        logger.info("=" * 60)
        logger.info("")

        steps = {
            1: lambda: step_1_restore_logo(client, customer_id, args.dry_run),
            2: lambda: step_2_restore_business_name(client, customer_id, args.dry_run),
            3: lambda: step_3_update_bidding(client, customer_id, campaign_id, args.dry_run),
            4: lambda: step_4_add_headlines(client, customer_id, args.dry_run),
            5: lambda: step_5_add_descriptions(client, customer_id, args.dry_run),
            6: lambda: step_6_update_budget(client, customer_id, campaign_id, args.dry_run),
            7: lambda: step_7_rename_campaign(client, customer_id, campaign_id, args.dry_run),
        }

        if args.step:
            if args.step not in steps:
                logger.error("Invalid step %d. Valid: 1-7", args.step)
                sys.exit(1)
            steps[args.step]()
        else:
            for step_num, step_fn in steps.items():
                try:
                    step_fn()
                    logger.info("")
                except Exception as e:
                    logger.error("Step %d failed: %s", step_num, e)
                    logger.error("Continuing with next step...")
                    logger.info("")

        logger.info("=" * 60)
        logger.info("OPTIMIZATION PLAN %s", "PREVIEWED (dry run)" if args.dry_run else "APPLIED")
        logger.info("=" * 60)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error:")
        for error in ex.failure.errors:
            logger.error("  %s", error.message)
            logger.error("  Error code: %s", error.error_code)
        sys.exit(1)


if __name__ == "__main__":
    main()
