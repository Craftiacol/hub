---
name: rank-tracker
description: >
  Seguimiento de posiciones en buscadores. Monitorea rankings, detecta cambios 
  y envía alertas de oportunidades o problemas.
  Trigger: When tracking keyword rankings, monitoring SERP changes, or reporting position changes.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Monitoreo semanal/mensual de rankings
- Detectar caídas o mejoras significativas
- Reportar progreso a clientes
- Identificar oportunidades de mejora
- Alertar sobre cambios de algoritmo

## Critical Patterns

### Herramientas MCP Habilitadas

```bash
# Search Console - Rankings orgánicos
npx search-console-mcp query

# Google Ads - Posiciones de anuncios
npx @channel47/google-ads-mcp campaign-performance
```

### Tracking de Keywords

```markdown
## Keywords a Monitorear: Motos Honda

### Brand (Prioridad ALTA)
| Keyword | Pos Actual | Pos Anterior | Cambio | URL |
|---------|------------|--------------|--------|-----|
| concesionaria honda | #5 | #8 | ↑3 | / |
| honda motos argentina | #12 | #15 | ↑3 | / |

### Modelos (Prioridad MEDIA)
| Keyword | Pos Actual | Pos Anterior | Cambio | URL |
|---------|------------|--------------|--------|-----|
| honda cb 190 | #8 | #10 | ↑2 | /cb-190 |
| honda wave | #15 | #18 | ↑3 | /wave |

### Intención Compra (Prioridad ALTA)
| Keyword | Pos Actual | Pos Anterior | Cambio | URL |
|---------|------------|--------------|--------|-----|
| precio moto honda | #20 | #25 | ↑5 | /precios |
| comprar moto honda | #18 | #22 | ↑4 | /comprar |
```

### Configuración de Alertas

```yaml
# rank-tracker/config.yaml
alerts:
  - type: "position_change"
    threshold: 5
    direction: "both"
    notify: ["email", "slack"]
    
  - type: "new_page_one"
    keywords: "all"
    notify: ["email"]
    
  - type: "drop_below_top20"
    keywords: "high_priority"
    notify: ["email", "slack"]
    
tracking:
  frequency: "daily"
  keywords:
    - group: "brand"
      keywords: ["concesionaria honda", "honda motos"]
    - group: "models"
      keywords: ["honda cb 190", "honda wave", "honda tornado"]
    - group: "commercial"
      keywords: ["precio moto honda", "comprar moto honda"]
```

### Scripts de Tracking

```bash
# Search Console API - Keywords orgánicos
npx search-console-mcp query \
  --property "https://motoshondaconcesionarios.com" \
  --startDate "2026-02-01" \
  --endDate "2026-03-23" \
  --dimensions "query,page"

# Exportar a CSV para tracking histórico
npx search-console-mcp export \
  --property "https://motoshondaconcesionarios.com" \
  --output "./rankings/$(date +%Y-%m).csv"
```

## Reporte de Rankings

### Resumen Ejecutivo
- Total keywords monitoreadas: X
- En primera página: X (X%)
- Mejoraron posición: X
- Empeoraron posición: X
- Nuevas en top 10: X

### Top Movers

**Mejoras Significativas:**
1. "precio moto honda" - #25 → #20 (↑5)
2. "concesionaria honda" - #8 → #5 (↑3)

**Caídas Significativas:**
1. [Si hay caídas]

## Commands

```bash
# Instalar herramientas
npm install -g search-console-mcp @channel47/google-ads-mcp

# Ejecutar tracking
npx search-console-mcp query --property "https://tusitio.com"
npx @channel47/google-ads-mcp campaign-performance
```

## Resources

- **Templates**: See [assets/](assets/) for tracking templates
- **Search Console**: Google Search Console API
- **Screaming Frog**: Para tracking local
