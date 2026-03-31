---
name: content-optimization
description: >
  Optimización on-page de contenido para SEO. Mejora titles, meta descriptions, 
  headings, estructura, y elementos de ranking.
  Trigger: When optimizing page content for SEO, fixing on-page issues, or improving rankings.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Optimización de landing pages existentes
- Mejora de rankings para keywords específicas
- Corrección de issues on-page detectados
- Preparación de contenido para campañas Ads
- Optimización de blog posts

## Critical Patterns

### Elementos On-Page Críticos

| Elemento | Longitud Ideal | Keyword | Prioridad |
|----------|---------------|---------|-----------|
| **Title Tag** | 50-60 chars | Sí, al inicio | ALTA |
| **Meta Description** | 150-160 chars | Sí | ALTA |
| **H1** | 1 por página | Sí | ALTA |
| **H2-H6** | Estructura clara | Varias | MEDIA |
| **URL** | Corta, descriptiva | Sí | ALTA |
| **Alt Text** | Descriptivo | Contextual | MEDIA |

### Checklist de Optimización

```markdown
- [ ] Title tag: 50-60 caracteres, keyword al inicio
- [ ] Meta description: 150-160 caracteres, CTA incluido
- [ ] H1 único, incluye keyword principal
- [ ] H2s incluyen keywords secundarias
- [ ] URLs cortas y limpias
- [ ] Imágenes con alt text descriptivo
- [ ] Internal links relevantes
- [ ] Structured data (Schema.org)
- [ ] Contenido original y valioso
- [ ] Mobile-friendly
```

### Template de Optimización

```markdown
## Página: /{pagina}

### Antes
- Title: [Título actual]
- Meta: [Descripción actual]
- H1: [H1 actual]

### Después
- Title: {Keyword Principal} - {Beneficio} | {Marca} (55 chars)
- Meta: {Descripción con keyword y CTA}. {Beneficio adicional}. (155 chars)
- H1: {Keyword Principal de forma natural}

### Cambios Requeridos
- [ ] Actualizar title tag
- [ ] Actualizar meta description
- [ ] Revisar heading structure
- [ ] Agregar/improvar alt texts
- [ ] Agregar internal links
- [ ] Implementar structured data
```

### Structured Data - Tipos Relevantes

```json
// LocalBusiness para concesionarias
{
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "name": "Motos Honda Concesionarios",
  "image": "https://motoshondaconcesionarios.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AR"
  },
  "telephone": "+54-XXX-XXXX",
  "url": "https://motoshondaconcesionarios.com"
}

// Product para motos
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Honda CB 190",
  "brand": {
    "@type": "Brand",
    "name": "Honda"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "ARS",
    "price": "XXXXX"
  }
}
```

## Commands

```bash
# Instalar PageSpeed para análisis
npm install -g @anthropic-ai/mcp-lighthouse

# Ejecutar análisis on-page
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&category=seo"
```

## Resources

- **Templates**: See [assets/](assets/) for optimization checklists
- **Schema.org**: https://schema.org/docs
- **Google**: Search Central documentation
