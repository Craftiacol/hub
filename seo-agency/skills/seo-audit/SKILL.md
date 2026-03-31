---
name: seo-audit
description: >
  Auditoría técnica completa de sitios web. Analiza SEO on-page, Core Web Vitals, 
  estructura técnica, meta tags, sitemaps, y más.
  Trigger: When performing SEO audits, checking site health, or diagnosing technical SEO issues.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Cliente nuevo necesita auditoría inicial
- Diagnóstico técnico de problemas de SEO
- Antes de iniciar campaña de Google Ads
- Revisión periódica de salud del sitio
- Optimización de Core Web Vitals

## Critical Patterns

### Herramientas MCP Habilitadas

```bash
# PageSpeed Insights (Core Web Vitals)
npx @anthropic-ai/mcp-lighthouse

# Search Console (Indexación, errores)
npx search-console-mcp

# Google Analytics (tráfico, comportamiento)
npx @toolsdk.ai/google-analytics-mcp
```

### Checklist de Auditoría

| Categoría | Items | Prioridad |
|-----------|-------|-----------|
| **Technical** | robots.txt, sitemap.xml, canonical, robots directives | CRÍTICO |
| **Performance** | LCP, FID, CLS, TTFB, PageSpeed Score | ALTA |
| **On-Page** | Title, H1, meta description, structured data | ALTA |
| **Mobile** | Mobile-first, responsive, touch targets | ALTA |
| **Security** | HTTPS, mixed content, security headers | MEDIA |
| **Internal Links** | Orphan pages, broken links, link depth | MEDIA |

### Quick Audit Script

```bash
# PageSpeed Insights API
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&key=${API_KEY}&strategy=mobile&category=performance&category=seo&category=accessibility"

# Sitemap validation
curl -s "https://${DOMAIN}/sitemap.xml" | xmllint --format -

# robots.txt check
curl -s "https://${DOMAIN}/robots.txt"
```

## Audit Report Template

### Executive Summary
- Overall Score: X/100
- Critical Issues: X
- Warnings: X
- Opportunities: X

### Technical SEO
- [ ] HTTPS enabled
- [ ] robots.txt valid
- [ ] sitemap.xml exists and valid
- [ ] Canonical tags set
- [ ] No duplicate content issues
- [ ] Proper redirects (301, no chains)

### Core Web Vitals
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| LCP | <2.5s | Xs | ✅/⚠️/❌ |
| FID | <100ms | Xms | ✅/⚠️/❌ |
| CLS | <0.1 | X | ✅/⚠️/❌ |

### On-Page SEO
| Page | Title Length | Meta Desc Length | H1 Count | Images without Alt |
|------|--------------|------------------|----------|-------------------|
| / | X chars | X chars | X | X |
| /servicios | X chars | X chars | X | X |

## Commands

```bash
# Instalar herramientas
npm install -g search-console-mcp @toolsdk.ai/google-analytics-mcp

# Ejecutar auditoría completa
# 1. PageSpeed Insights
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=mobile"

# 2. Validar sitemap
curl -s "https://${DOMAIN}/sitemap.xml" | xmllint --format -

# 3. Check robots.txt
curl -s "https://${DOMAIN}/robots.txt"
```

## Resources

- **Templates**: See [assets/](assets/) for report templates
- **Google**: PageSpeed Insights API documentation
- **Search Console**: Google Search Console API reference
