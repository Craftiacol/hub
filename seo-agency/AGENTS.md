# SEO Agency - Agent Configuration

## Available Skills

| Skill | Description | Location |
|-------|-------------|----------|
| `seo-audit` | Auditoría técnica completa de sitios web | [skills/seo-audit/SKILL.md](skills/seo-audit/SKILL.md) |
| `keyword-research` | Investigación estratégica de keywords | [skills/keyword-research/SKILL.md](skills/keyword-research/SKILL.md) |
| `content-optimization` | Optimización on-page para SEO | [skills/content-optimization/SKILL.md](skills/content-optimization/SKILL.md) |
| `google-ads-manager` | Gestión de campañas Google Ads | [skills/google-ads-manager/SKILL.md](skills/google-ads-manager/SKILL.md) |
| `rank-tracker` | Seguimiento de posiciones en buscadores | [skills/rank-tracker/SKILL.md](skills/rank-tracker/SKILL.md) |
| `seo-report` | Generación de reportes ejecutivos | [skills/seo-report/SKILL.md](skills/seo-report/SKILL.md) |

## MCP Servers Available

| Server | Package | Status |
|--------|---------|--------|
| Google Ads | `@channel47/google-ads-mcp` | ✅ Installed |
| Google Analytics | `@toolsdk.ai/google-analytics-mcp` | ✅ Installed |
| Search Console | `search-console-mcp` | ✅ Installed |
| PageSpeed Insights | `@anthropic-ai/mcp-lighthouse` | ⚠️ Needs auth |

## Project Structure

```
seo-agency/
├── clients/                    # Client projects
│   └── motoshondaconcesionarios/  # First client
│       ├── src/                # Source code
│       ├── public/             # Static assets
│       ├── CLIENT-README.md    # Client documentation
│       └── GOOGLE-ADS-CHECKLIST.md
├── skills/                     # Agent skills
│   ├── seo-audit/
│   ├── keyword-research/
│   ├── content-optimization/
│   ├── google-ads-manager/
│   ├── rank-tracker/
│   └── seo-report/
├── templates/                  # Reusable templates
├── tools/                      # Automation scripts
├── docs/                       # Documentation
├── .mcp.json                   # MCP server configuration
├── .env.example                # Environment variables template
├── ENV-CONFIG.md               # Environment setup guide
├── IMPLEMENTATION_PLAN.md      # Implementation roadmap
└── README.md                   # Project overview
```

## Current Client: Motos Honda Concesionarios

- **Website**: https://motoshondaconcesionarios.com
- **Google Ads ID**: 530-945-4449
- **Status**: Campaign inactive (needs activation)
- **Technology**: Angular 19+, deployed on Vercel

## Quick Commands

```bash
# Navigate to project
cd /home/asepulvedadev/Documentos/sepulveda/hub/seo-agency/clients/motoshondaconcesionarios

# Install dependencies
npm install

# Start dev server
npm run dev

# Run MCP servers
npx @channel47/google-ads-mcp
npx @toolsdk.ai/google-analytics-mcp
npx search-console-mcp
```

## Google Ads Activation

Current issue: Campaign shows "Incompleta" status.

**Next steps:**
1. Complete billing setup
2. Verify identity
3. Check campaign configuration
4. Create ad groups and ads
5. Set up conversion tracking

See `clients/motoshondaconcesionarios/GOOGLE-ADS-CHECKLIST.md` for detailed checklist.
