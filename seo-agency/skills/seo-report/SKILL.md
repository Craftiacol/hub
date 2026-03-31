---
name: seo-report
description: >
  Generación de reportes ejecutivos de SEO y Google Ads para clientes. 
  Incluye métricas, KPIs, recomendaciones y plan de acción.
  Trigger: When creating client reports, summarizing campaign performance, or presenting SEO results.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Reportes mensuales para clientes
- Presentaciones de resultados
- Resúmenes ejecutivos
- Planes de acción y roadmap
- Documentación de progreso

## Critical Patterns

### Estructura de Reporte Ejecutivo

```markdown
# Reporte SEO/Monthly - [Cliente] - [Mes/Año]

## 📊 Resumen Ejecutivo

| Métrica | Mes Anterior | Este Mes | Cambio |
|---------|--------------|----------|--------|
| Tráfico Orgánico | X | X | +X% |
| Palabras Clave Top 10 | X | X | +X |
| Tráfico de Google Ads | X | X | +X% |
| Conversiones | X | X | +X% |
| Costo por Lead | $X | $X | -X% |

## 🎯 KPIs Principales

### SEO Orgánico
- Tráfico orgánico: X visitas (+X% mes anterior)
- Keywords en Top 10: X (+X nuevas)
- Click-through rate: X%
- Posición promedio: X

### Google Ads
- Impresiones: X
- Clicks: X
- CTR: X%
- CPC promedio: $X
- Conversiones: X
- Costo total: $X

## 📈 Análisis Detallado

### Tráfico por Canal
| Canal | Sesiones | % Total | Cambio |
|-------|----------|---------|--------|
| Orgánico | X | X% | +X% |
| Google Ads | X | X% | +X% |
| Directo | X | X% | +X% |
| Social | X | X% | +X% |

### Top Keywords (Organic)
| Keyword | Posición | Clicks | Impressions | CTR |
|---------|----------|--------|-------------|-----|
| concesionaria honda | #5 | X | X | X% |
| honda cb 190 | #8 | X | X | X% |

### Campañas Google Ads
| Campaña | Impresiones | Clicks | CTR | Conv. | Costo |
|---------|-------------|--------|-----|-------|-------|
| Brand Honda | X | X | X% | X | $X |
| Modelos | X | X | X% | X | $X |

## 🔍 Oportunidades Detectadas

1. **SEO**: [Keyword] está en posición X, optimizando podría llegar a Top 5
2. **Ads**: [Campaña] tiene CTR bajo, recomiendo mejorar ad copy
3. **Contenido**: [Página] necesita actualización con nuevo contenido

## ✅ Acciones Completadas Este Mes

- [ ] Auditoría técnica inicial
- [ ] Optimización de [X] páginas
- [ ] Configuración de Google Ads
- [ ] Creación de [X] campañas

## 📋 Plan de Acción Próximo Mes

### SEO
- [ ] Optimizar landing page de [keyword]
- [ ] Crear contenido para [keyword]
- [ ] Mejorar Core Web Vitals en [página]

### Google Ads
- [ ] Optimizar [campaña] - mejorar CTR
- [ ] Agregar nuevas keywords a [grupo]
- [ ] Implementar remarketing

## 💰 ROI y Métricas de Negocio

| Métrica | Valor |
|---------|-------|
| Inversión Total | $X |
| Leads Generados | X |
| Costo por Lead | $X |
| Tasa de Conversión | X% |
| Valor Estimado por Lead | $X |
| ROI Estimado | X% |

---
*Reporte generado automáticamente por SEO Agency*
*Fecha: [Fecha]*
```

### Generación Automática

```bash
# Recolectar datos de todas las fuentes
npx search-console-mcp query --property "https://tusitio.com" --startDate "2026-02-01" --endDate "2026-03-23"
npx @channel47/google-ads-mcp campaign-performance --customerId "5309454449"
npx @toolsdk.ai/google-analytics-mcp report --property-id "XXXXX"

# Generar reporte
node scripts/generate-report.js --client motoshonda --period monthly
```

## Commands

```bash
# Instalar herramientas
npm install -g search-console-mcp @channel47/google-ads-mcp @toolsdk.ai/google-analytics-mcp

# Generar datos para reporte
npx search-console-mcp query --property "https://tusitio.com"
npx @channel47/google-ads-mcp campaign-performance
npx @toolsdk.ai/google-analytics-mcp report --property-id "XXXXX"
```

## Resources

- **Templates**: See [assets/](assets/) for report templates
- **Data Sources**: Search Console, Google Ads, Analytics APIs
- **Output**: PDF, Markdown, Google Docs
