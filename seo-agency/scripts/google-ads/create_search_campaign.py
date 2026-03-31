#!/usr/bin/env python3
"""Create a complementary Search campaign for Honda Bogota.

Campaign: "Honda Bogota - Search - Intencion Compra"
Budget: $20,000 COP/day
Bidding: MAXIMIZE_CLICKS

Ad Groups:
  1. Brand Honda - brand-related keywords
  2. Modelos Honda - model-specific keywords
  3. Compra Motos - purchase-intent keywords

Each group gets a full RSA ad and targeted keywords.
Negative keywords applied at campaign level.
"""

import sys
from google.ads.googleads.errors import GoogleAdsException

from helpers import base_argparser, get_client, logger

# ─── Campaign Config ────────────────────────────────────────────────
CAMPAIGN_NAME = "Honda Bogotá - Search - Intención Compra"
BUDGET_MICROS = 20_000_000_000  # $20,000 COP/day
BIDDING_STRATEGY = "MAXIMIZE_CLICKS"
MAX_CPC_MICROS = 2_000_000_000  # $2,000 COP max CPC cap

LANDING_URL = "https://www.honda.com.co"  # Update with actual URL

# ─── Negative Keywords (campaign-level) ─────────────────────────────
NEGATIVE_KEYWORDS = [
    "yamaha", "suzuki", "kawasaki", "bajaj", "tvs",
    "usado", "segunda mano",
    "tutorial", "youtube",
]

# ─── Ad Group Definitions ──────────────────────────────────────────
AD_GROUPS = {
    "Brand Honda": {
        "cpc_bid_micros": 1_500_000_000,  # $1,500 COP
        "keywords": [
            {"text": "concesionaria honda bogotá", "match_type": "EXACT"},
            {"text": "honda motos bogotá", "match_type": "EXACT"},
            {"text": "concesionario honda bogotá", "match_type": "EXACT"},
            {"text": "honda motos colombia", "match_type": "PHRASE"},
            {"text": "honda motos bogota", "match_type": "PHRASE"},
            {"text": "distribuidor honda motos", "match_type": "PHRASE"},
            {"text": "honda motos sucursal bogota", "match_type": "PHRASE"},
        ],
        "ad": {
            "headlines": [
                "Honda Motos Bogotá",
                "Concesionario Oficial Honda",
                "Modelos Honda 2026",
                "Test Ride Gratis Honda",
                "Honda Colombia Oficial",
                "Visítanos en Bogotá",
                "Financiación Disponible",
                "Asesoría Personalizada",
            ],
            "descriptions": [
                "Concesionario Honda oficial en Bogotá. Todos los modelos 2026 disponibles con financiación.",
                "Visitanos y agenda tu test ride gratis. Más de 20 modelos Honda disponibles en stock.",
                "Servicio técnico especializado Honda. Repuestos originales y garantía de fábrica.",
            ],
            "path1": "Honda",
            "path2": "Bogota",
        },
    },
    "Modelos Honda": {
        "cpc_bid_micros": 1_800_000_000,  # $1,800 COP
        "keywords": [
            {"text": "honda cb 190 precio", "match_type": "EXACT"},
            {"text": "honda navi precio colombia", "match_type": "EXACT"},
            {"text": "honda xr 190 precio", "match_type": "EXACT"},
            {"text": "honda cb 190r bogota", "match_type": "PHRASE"},
            {"text": "honda navi colombia", "match_type": "PHRASE"},
            {"text": "honda xr 190 colombia", "match_type": "PHRASE"},
            {"text": "honda dio precio colombia", "match_type": "PHRASE"},
            {"text": "honda click 125 precio", "match_type": "PHRASE"},
        ],
        "ad": {
            "headlines": [
                "Honda CB 190R Disponible",
                "Honda Navi Desde $5.990.000",
                "Honda XR 190 en Stock",
                "Precios Honda 2026",
                "Honda Motos Desde $4.490.000",
                "Cotiza Tu Modelo Honda",
                "20+ Modelos Disponibles",
                "Financiamos Tu Honda",
            ],
            "descriptions": [
                "Encuentra tu modelo Honda ideal. CB 190R, XR 190, Navi y más. Precios desde $4.490.000.",
                "Todos los modelos Honda 2026 con financiación inmediata. Aprobación en 24 horas.",
                "Honda Navi, CB 190R, XR 190, Dio y más. Stock disponible en Bogotá. Cotiza ahora.",
            ],
            "path1": "Modelos",
            "path2": "Honda",
        },
    },
    "Compra Motos": {
        "cpc_bid_micros": 2_000_000_000,  # $2,000 COP (highest intent)
        "keywords": [
            {"text": "comprar moto honda", "match_type": "EXACT"},
            {"text": "precio motos honda bogotá", "match_type": "EXACT"},
            {"text": "comprar moto honda bogota", "match_type": "PHRASE"},
            {"text": "motos honda baratas bogota", "match_type": "PHRASE"},
            {"text": "financiar moto honda", "match_type": "PHRASE"},
            {"text": "moto honda nueva bogota", "match_type": "PHRASE"},
            {"text": "venta motos honda bogota", "match_type": "PHRASE"},
            {"text": "donde comprar honda bogota", "match_type": "PHRASE"},
        ],
        "ad": {
            "headlines": [
                "Comprá Tu Honda Hoy",
                "Motos Honda Desde $4.490.000",
                "Financiamos Sin Codeudor",
                "Aprobación en 24 Horas",
                "Stock Inmediato Honda",
                "Agenda Tu Test Ride",
                "Concesionario Bogotá",
                "WhatsApp: Cotiza Ya",
            ],
            "descriptions": [
                "Estrená tu moto Honda hoy. Financiación inmediata sin codeudor. Aprobación en 24 horas.",
                "Motos Honda desde $4.490.000 con financiación. Más de 20 modelos en stock en Bogotá.",
                "Compra tu moto Honda en el concesionario oficial de Bogotá. Test ride gratis en todos los modelos.",
            ],
            "path1": "Comprar",
            "path2": "Honda",
        },
    },
}


def main():
    parser = base_argparser("Create Honda Bogota Search Campaign")
    parser.add_argument(
        "--landing-url", default=LANDING_URL,
        help="Landing page URL for all ads",
    )
    args = parser.parse_args()

    try:
        client = get_client(args.config)
        customer_id = args.customer_id

        logger.info("=" * 60)
        logger.info("CREATE SEARCH CAMPAIGN: %s", CAMPAIGN_NAME)
        logger.info("Customer ID: %s", customer_id)
        logger.info("Budget: $%d COP/day", BUDGET_MICROS // 1_000_000)
        logger.info("Bidding: %s (max CPC: $%d COP)", BIDDING_STRATEGY, MAX_CPC_MICROS // 1_000_000)
        logger.info("Ad Groups: %d", len(AD_GROUPS))
        logger.info("Landing URL: %s", args.landing_url)
        logger.info("Dry Run: %s", args.dry_run)
        logger.info("=" * 60)

        # ─── Step 1: Create Campaign ────────────────────────────────
        logger.info("")
        logger.info("STEP 1: Create Campaign")
        logger.info("-" * 40)

        from campaign_manager import create_campaign
        campaign_rn = create_campaign(
            client, customer_id, CAMPAIGN_NAME, BUDGET_MICROS,
            BIDDING_STRATEGY, "SEARCH", args.dry_run,
        )

        if args.dry_run:
            campaign_id = "<dry-run>"
        else:
            # Extract campaign ID from resource name
            campaign_id = campaign_rn.split("/")[-1]

        # ─── Step 2: Add Negative Keywords ──────────────────────────
        logger.info("")
        logger.info("STEP 2: Add Negative Keywords (%d)", len(NEGATIVE_KEYWORDS))
        logger.info("-" * 40)

        from keyword_manager import add_negative_keywords
        add_negative_keywords(client, customer_id, campaign_id, NEGATIVE_KEYWORDS, args.dry_run)

        # ─── Step 3: Create Ad Groups with Keywords and Ads ─────────
        for group_name, group_config in AD_GROUPS.items():
            logger.info("")
            logger.info("STEP 3: Create Ad Group '%s'", group_name)
            logger.info("-" * 40)

            from ad_group_manager import create_ad_group
            ag_rn = create_ad_group(
                client, customer_id, campaign_id, group_name,
                cpc_bid_micros=group_config["cpc_bid_micros"],
                dry_run=args.dry_run,
            )

            if args.dry_run:
                ad_group_id = "<dry-run>"
            else:
                ad_group_id = ag_rn.split("/")[-1]

            # Add keywords
            logger.info("  Adding %d keywords...", len(group_config["keywords"]))
            from keyword_manager import add_keywords
            add_keywords(
                client, customer_id, ad_group_id,
                group_config["keywords"], args.dry_run,
            )

            # Create RSA
            ad_config = group_config["ad"]
            logger.info("  Creating RSA ad...")
            from ad_manager import create_responsive_search_ad
            create_responsive_search_ad(
                client, customer_id, ad_group_id,
                headlines=ad_config["headlines"],
                descriptions=ad_config["descriptions"],
                final_urls=[args.landing_url],
                path1=ad_config.get("path1"),
                path2=ad_config.get("path2"),
                dry_run=args.dry_run,
            )

        # ─── Summary ────────────────────────────────────────────────
        logger.info("")
        logger.info("=" * 60)
        logger.info("SEARCH CAMPAIGN %s", "PREVIEWED (dry run)" if args.dry_run else "CREATED")
        logger.info("Campaign: %s", CAMPAIGN_NAME)
        logger.info("Campaign ID: %s", campaign_id)
        logger.info("Ad Groups: %d", len(AD_GROUPS))
        total_keywords = sum(len(g["keywords"]) for g in AD_GROUPS.values())
        logger.info("Total Keywords: %d", total_keywords)
        logger.info("Negative Keywords: %d", len(NEGATIVE_KEYWORDS))
        logger.info("RSA Ads: %d", len(AD_GROUPS))
        logger.info("=" * 60)

        if not args.dry_run:
            logger.info("")
            logger.info("IMPORTANT: Campaign created in PAUSED state.")
            logger.info("Enable it when ready: python campaign_manager.py enable --campaign-id %s", campaign_id)

    except GoogleAdsException as ex:
        logger.error("Google Ads API error:")
        for error in ex.failure.errors:
            logger.error("  %s", error.message)
            logger.error("  Error code: %s", error.error_code)
        sys.exit(1)


if __name__ == "__main__":
    main()
