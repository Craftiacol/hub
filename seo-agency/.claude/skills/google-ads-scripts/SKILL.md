---
name: google-ads-scripts
description: >
  Execute Google Ads campaign changes via Python scripts using the google-ads library.
  Trigger: When user wants to make changes to Google Ads campaigns (create, update, delete campaigns/ad groups/keywords/ads/assets).
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

## When to Use

- Creating new campaigns (Search, PMax, Display, etc.)
- Updating campaign settings (budget, bidding, name, status)
- Managing ad groups (create, update, pause)
- Adding/removing keywords and negative keywords
- Creating/updating Responsive Search Ads (RSA)
- Managing assets for Performance Max campaigns (headlines, descriptions, images, logos)
- Applying optimization plans with multiple changes

## Critical Patterns

### Config Loading

All scripts load `google-ads.yaml` from:
1. `GOOGLE_ADS_CONFIG_PATH` env var
2. `--config` CLI arg
3. Default: `./config/google-ads.yaml`

### Dry Run First

ALWAYS use `--dry-run` before applying changes in production. Every script supports it.

### Customer ID

- Default Customer ID: `5309454449`
- Default Login Customer ID: `5309454449`
- Override via `--customer-id` and `--login-customer-id` CLI args

### Script Location

All scripts live in: `scripts/google-ads/`

| Script | Purpose |
|--------|---------|
| `campaign_manager.py` | Create, update, pause/enable campaigns |
| `ad_group_manager.py` | Create, update ad groups |
| `keyword_manager.py` | Add/remove keywords and negatives |
| `ad_manager.py` | Create/update RSA ads |
| `asset_manager.py` | Manage text/image assets |
| `pmax_optimizer.py` | Performance Max specific operations |
| `apply_optimization.py` | Apply full optimization plan |
| `create_search_campaign.py` | Create complementary Search campaign |

### Workflow

1. Run `setup.sh` to install dependencies
2. Copy `config/google-ads.yaml.example` to `config/google-ads.yaml` and fill in credentials
3. Use individual scripts for specific changes, or `apply_optimization.py` for bulk changes
4. ALWAYS `--dry-run` first

## Commands

```bash
# Setup
cd scripts/google-ads && bash setup.sh

# Apply optimization plan (dry run first)
python apply_optimization.py --dry-run
python apply_optimization.py

# Create search campaign (dry run first)
python create_search_campaign.py --dry-run
python create_search_campaign.py

# Individual operations
python campaign_manager.py create --name "My Campaign" --budget 30000000000
python campaign_manager.py pause --campaign-id 123456
python keyword_manager.py add --ad-group-id 123 --keywords "honda motos:PHRASE" "honda bogota:EXACT"
python ad_manager.py create-rsa --ad-group-id 123 --headlines "H1" "H2" "H3" --descriptions "D1" "D2" --urls "https://example.com"
```

## Resources

- **Config template**: See `scripts/google-ads/config/google-ads.yaml.example`
- **Setup**: Run `scripts/google-ads/setup.sh` to install dependencies
- **README**: See `scripts/google-ads/README.md` for full usage guide
