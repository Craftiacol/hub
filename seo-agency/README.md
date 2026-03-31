# SEO Agency

> **Infraestructura profesional para gestión de proyectos SEO y Google Ads**

## Propósito

Este espacio está dedicado a la operación de servicios de **SEO técnico**, **content marketing** y **Google Ads management** para clientes de Craftia.

## Estructura

```
seo-agency/
├── clients/          # Proyectos por cliente
├── templates/        # Plantillas reutilizables
├── tools/           # Scripts y automatizaciones
├── docs/            # Documentación y procesos
├── skills/          # Skills especializadas
└── IMPLEMENTATION_PLAN.md  # Plan completo de implementación
```

## Quick Start

### 1. Instalar MCP Servers

```bash
# Google Ads (oficial)
pip install google-ads-mcp

# Google Analytics 4
pip install google-analytics-mcp

# Search Console + Bing Webmaster
npm install -g @saurabhsharma2u/search-console-mcp
```

### 2. Configurar Credenciales

Copiar `.env.example` (en la raíz) a `.env` y completar con tus credenciales de Google APIs.

### 3. Skills Disponibles

| Skill | Propósito |
|-------|-----------|
| `seo-audit` | Auditoría técnica de sitios |
| `keyword-research` | Investigación de keywords |
| `content-optimization` | Optimización on-page |
| `google-ads-manager` | Gestión de campañas Ads |
| `rank-tracker` | Seguimiento de posiciones |
| `seo-report` | Generación de reportes |

## Flujo de Trabajo

1. **Onboarding**: Auditoría inicial + baseline de rankings
2. **Optimización**: Sprint semanal de mejoras técnicas y de contenido
3. **Google Ads**: Gestión y optimización continua de campañas
4. **Reporting**: Reporte mensual ejecutivo con métricas clave

## Documentación

- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — Plan completo de infraestructura
- [`docs/processes/`](./docs/processes/) — SOPs y flujos de trabajo
- [`docs/best-practices/`](./docs/best-practices/) — Guías de mejores prácticas

## Herramientas Principales

| Categoría | Herramienta | MCP Disponible |
|-----------|-------------|----------------|
| **Search** | Google Search Console | ✅ |
| **Analytics** | Google Analytics 4 | ✅ |
| **Ads** | Google Ads | ✅ (oficial) |
| **Performance** | PageSpeed Insights | ⚠️ (experimental) |
| **SEO Suite** | Ahrefs / SEMrush | ❌ (API directa) |

## Contacto

Para preguntas sobre esta estructura, contactar al equipo de Craftia.

---

**Creado**: 2026-03-23  
**Versión**: 1.0
