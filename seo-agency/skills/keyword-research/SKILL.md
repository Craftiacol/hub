---
name: keyword-research
description: >
  Investigación estratégica de keywords para SEO y Google Ads. Analiza volúmenes, 
  competencia, intención de búsqueda y oportunidades.
  Trigger: When researching keywords, planning content strategy, or setting up ad campaigns.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Planificación de campañas Google Ads
- Estrategia de contenido para SEO
- Análisis de competencia
- Optimización de campañas existentes
- Investigación de nicho para nuevos clientes

## Critical Patterns

### Flujo de Investigación

1. **Seed Keywords** → Keywords iniciales del cliente
2. **Expansion** → Variaciones, long-tail, sinónimos
3. **Analysis** → Volumen, competencia, KD
4. **Clustering** → Agrupar por intención
5. **Selection** → Elegir para targeting

### Herramientas MCP Habilitadas

```bash
# Google Ads Keyword Planner (vía MCP)
npx @channel47/google-ads-mcp

# Search Console (keywords existentes)
npx search-console-mcp
```

### Matriz de Keyword Research

| Keyword | Vol/Mes | KD | CPC | Intención | Prioridad |
|---------|---------|----|----|-----------|-----------|
| concesionaria honda | 1000 | 45 | $2.50 | Transaccional | ALTA |
| moto honda argentina | 500 | 30 | $1.80 | Transaccional | ALTA |
| precios motos honda | 800 | 40 | $3.00 | Comercial | ALTA |
| honda cb 190 | 300 | 25 | $1.50 | Navegacional | MEDIA |

### Tipos de Intención de Búsqueda

| Intención | Palabras Clave | Tipo de Contenido |
|-----------|---------------|-------------------|
| **Informativa** | qué es, cómo, cuándo | Blog posts, guías |
| **Navegacional** | marca + producto | Landing pages |
| **Transaccional** | comprar, precio, oferta | Productos, servicios |
| **Comercial** | comparar, review, mejor | Reviews, comparativas |

### Scripts de Análisis

```bash
# Google Ads Keyword Planner API
# Obtener volúmenes de búsqueda
npx @channel47/google-ads-mcp keyword-ideas \
  --keywords "moto honda, concesionaria honda" \
  --location "Argentina"

# Search Console - Keywords orgánicos actuales
npx search-console-mcp query \
  --property "https://motoshondaconcesionarios.com" \
  --startDate "2026-02-01" \
  --endDate "2026-03-23"
```

## Keyword Clustering

### Cluster 1: Marca Honda
- concesionaria honda
- honda motos argentina
- honda oficiales
- concesionario honda cercano

### Cluster 2: Modelos
- honda cb 190
- honda wave
- honda tornado
- honda crf

### Cluster 3: Intención Compra
- precio moto honda
- comprar moto honda
- moto honda cuotas
- oferta moto honda

## Commands

```bash
# Instalar herramientas
npm install -g @channel47/google-ads-mcp search-console-mcp

# Research keywords
npx @channel47/google-ads-mcp keyword-ideas --keywords "tus keywords"
npx search-console-mcp query --property "https://tusitio.com"
```

## Resources

- **Templates**: See [assets/](assets/) for keyword research templates
- **Google Ads**: Keyword Planner API reference
- **SEO**: Ahrefs/SEMrush alternative scripts
