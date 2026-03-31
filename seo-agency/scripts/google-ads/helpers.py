"""Shared helpers for Google Ads scripts."""

import os
import logging
import argparse
from google.ads.googleads.client import GoogleAdsClient

DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config", "google-ads.yaml")
DEFAULT_CUSTOMER_ID = "5309454449"
DEFAULT_LOGIN_CUSTOMER_ID = "5309454449"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("google-ads-scripts")


def get_config_path() -> str:
    """Resolve config path from env var or default."""
    return os.environ.get("GOOGLE_ADS_CONFIG_PATH", DEFAULT_CONFIG_PATH)


def get_client(config_path: str | None = None) -> GoogleAdsClient:
    """Create a GoogleAdsClient from yaml config."""
    path = config_path or get_config_path()
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Config not found at {path}. "
            f"Copy config/google-ads.yaml.example to config/google-ads.yaml and fill in credentials."
        )
    return GoogleAdsClient.load_from_storage(path, version="v18")


def base_argparser(description: str) -> argparse.ArgumentParser:
    """Create a base argument parser with common flags."""
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument("--config", type=str, default=None, help="Path to google-ads.yaml config file")
    parser.add_argument("--customer-id", type=str, default=DEFAULT_CUSTOMER_ID, help="Google Ads customer ID")
    parser.add_argument("--login-customer-id", type=str, default=DEFAULT_LOGIN_CUSTOMER_ID, help="Login customer ID (MCC)")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without executing")
    return parser


def format_micros(micros: int) -> str:
    """Format micros amount to human-readable currency."""
    return f"${micros / 1_000_000:,.0f}"
