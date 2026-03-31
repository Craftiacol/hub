# SEO Agency — Plan de Implementación

> **Estado**: Draft  
> **Última actualización**: 2026-03-23  
> **Propósito**: Infraestructura profesional para gestión de proyectos SEO + Google Ads

---

## Resumen Ejecutivo

Este documento define la infraestructura completa para operar una agencia SEO profesional dentro del ecosistema Craftia Hub. Incluye:

- **Estructura de carpetas** para gestión de clientes y proyectos
- **MCP servers** para integración con APIs de Google y herramientas SEO
- **Skills** especializadas para auditorías, optimización y reporting
- **Flujo de trabajo** estandarizado desde onboarding hasta reporting

### Estado del Ecosistema MCP para SEO/Ads

| Categoría | Estado | Conclusión |
|-----------|--------|------------|
| Google Ads | ✅ Maduro | MCP oficial de Google + alternativas community |
| Google Analytics 4 | ✅ Maduro | Múltiples implementaciones disponibles |
| Google Search Console | ✅ Disponible | Integrado en servidores de marketing digital |
| PageSpeed Insights | ⚠️ Limitado | 1 implementación experimental |
| SEO Tools (Ahrefs, SEMrush) | ❌ No existe | Requiere API REST directa o custom MCP |

---

## Fase 1: Estructura y Convenciones

### 1.1 Estructura de Carpetas

```
seo-agency/
├── clients/              # Proyectos por cliente
│   └── {client-name}/
│       ├── config/       # Configuraciones específicas (API keys, settings)
│       ├── audits/       # Auditorías técnicas
│       ├── keywords/     # Investigación de keywords
│       ├── content/      # Optimizaciones on-page
│       ├── campaigns/    # Campañas Google Ads
│       ├── reports/      # Reportes periódicos
│       └── README.md     # Contexto del cliente
├── templates/            # Plantillas reutilizables
│   ├── audit/            # Templates de auditoría técnica
│   ├── keyword-research/ # Templates de investigación
│   ├── content-brief/    # Briefs de contenido
│   ├── campaign/         # Estructuras de campaña Ads
│   └── reports/          # Templates de reportes
├── tools/                # Scripts y herramientas
│   ├── seo-audit.sh      # Script de auditoría automatizada
│   ├── rank-tracker.py   # Seguimiento de posiciones
│   └── report-gen.js     # Generador de reportes
├── docs/                 # Documentación y procesos
│   ├── processes/        # SOPs y flujos de trabajo
│   ├── best-practices/   # Guías de mejores prácticas
│   └── api-reference/    # Documentación de APIs
├── skills/               # Skills especializadas (se crearán en Fase 3)
└── README.md             # Overview del propósito
```

### 1.2 Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Carpeta cliente | kebab-case | `pelvibiz`, `tech-store-mx` |
| Archivos de auditoría | `audit-{date}-{type}.md` | `audit-2026-03-technical.md` |
| Reportes | `report-{client}-{period}.md` | `report-pelvibiz-2026-03.md` |
| Campañas Ads | `{goal}-{audience}-{date}` | `leads-local-mx-2026-q1` |
| Keywords | `{intent}-{topic}` | `commercial-running-shoes` |


---

## Fase 2: MCP Servers a Instalar y Configurar

### 2.1 MCP Servers Disponibles (Priorizados)

#### 🟢 CRÍTICOS — Instalar Inmediatamente

---

### 1. Google Ads MCP Server (Oficial)

**Propósito**: Gestión completa de campañas Google Ads

- **Repositorio**: [`google-marketing-solutions/google_ads_mcp`](https://github.com/google-marketing-solutions/google_ads_mcp)
- **Estado**: ✅ Oficial (Google Marketing Solutions)
- **Lenguaje**: Python
- **Stars**: 134+
- **Última actualización**: 5 días atrás (activo)

**Instalación**:
```bash
# Opción 1: pip
pip install google-ads-mcp

# Opción 2: desde GitHub
git clone https://github.com/google-marketing-solutions/google_ads_mcp.git
cd google_ads_mcp
pip install -e .
```

**Configuración**:
```bash
# Variables de entorno requeridas
export GOOGLE_ADS_DEVELOPER_TOKEN="tu_developer_token"
export GOOGLE_ADS_CLIENT_ID="tu_client_id"
export GOOGLE_ADS_CLIENT_SECRET="tu_client_secret"
export GOOGLE_ADS_REFRESH_TOKEN="tu_refresh_token"
export GOOGLE_ADS_LOGIN_CUSTOMER_ID="tu_customer_id"
```

**Capabilities**:
- ✅ Crear, leer, actualizar, pausar campañas
- ✅ Gestión de grupos de anuncios y keywords
- ✅ Consulta de métricas de rendimiento (impresiones, clicks, CTR, conversiones)
- ✅ Gestión de pujas y presupuestos
- ✅ Análisis de competencia y auction insights
- ✅ Creación y gestión de anuncios responsive search ads
- ✅ Negative keywords management
- ✅ Performance Max campaign support

**Comando MCP**:
```json
{
  "mcpServers": {
    "google-ads": {
      "command": "python",
      "args": ["-m", "google_ads_mcp.server"],
      "env": {
        "GOOGLE_ADS_DEVELOPER_TOKEN": "...",
        "GOOGLE_ADS_CLIENT_ID": "...",
        "GOOGLE_ADS_CLIENT_SECRET": "...",
        "GOOGLE_ADS_REFRESH_TOKEN": "...",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "..."
      }
    }
  }
}
```

---

### 2. Google Analytics 4 MCP Server

**Propósito**: Acceso a métricas de tráfico, comportamiento y conversiones

- **Repositorio**: [`surendranb/google-analytics-mcp`](https://github.com/surendranb/google-analytics-mcp)
- **Estado**: ✅ Community (más popular, 193 stars)
- **Lenguaje**: Python
- **Stars**: 193
- **Última actualización**: 10 días atrás

**Instalación**:
```bash
pip install google-analytics-mcp
# o
git clone https://github.com/surendranb/google-analytics-mcp.git
cd google-analytics-mcp
pip install -e .
```

**Configuración**:
```bash
export GA4_PROPERTY_ID="G-XXXXXXXXXX"
export GOOGLE_CLIENT_EMAIL="tu-service-account@project.iam.gserviceaccount.com"
export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

**Capabilities**:
- ✅ Consulta de métricas personalizadas (sessions, users, pageviews, bounce rate)
- ✅ Segmentación por dimensión (dispositivo, país, fuente, medium)
- ✅ Análisis de embudos de conversión
- ✅ Eventos personalizados y e-commerce tracking
- ✅ Real-time data access
- ✅ Comparison with previous periods

**Alternativa**: [`ruchernchong/mcp-server-google-analytics`](https://github.com/ruchernchong/mcp-server-google-analytics) (70 stars, archived pero funcional)

---

### 3. Search Console + Bing Webmaster MCP

**Propósito**: Datos de búsqueda orgánica, queries, posiciones y indexación

- **Repositorio**: [`saurabhsharma2u/search-console-mcp`](https://github.com/saurabhsharma2u/search-console-mcp)
- **Estado**: ✅ Community activo
- **Lenguaje**: TypeScript
- **Stars**: 70
- **Última actualización**: 7 días atrás

**Instalación**:
```bash
npx @saurabhsharma2u/search-console-mcp
# o
npm install -g @saurabhsharma2u/search-console-mcp
```

**Configuración**:
```bash
export GSC_SITE_URL="https://tudominio.com"
export GOOGLE_CLIENT_ID="..."
export GOOGLE_CLIENT_SECRET="..."
export GOOGLE_REFRESH_TOKEN="..."
```

**Capabilities**:
- ✅ Search Analytics API (queries, páginas, países, dispositivos)
- ✅ Index Coverage (páginas indexadas, errores, warnings)
- ✅ Sitemap status
- ✅ Core Web Vitals data
- ✅ Mobile Usability report
- ✅ Bing Webmaster Tools integration (bonus)

---

### 🟡 IMPORTANTES — Instalar en Semana 2

---

### 4. Google Tag Manager MCP

**Propósito**: Gestión de tags, triggers y variables de GTM

- **Repositorio**: [`pouyanafisi/gtm-mcp`](https://github.com/pouyanafisi/gtm-mcp)
- **Estado**: ✅ Community
- **Lenguaje**: TypeScript
- **Stars**: 11
- **Última actualización**: Dec 31, 2025

**Instalación**:
```bash
npx @pouyanafisi/gtm-mcp
```

**Capabilities**:
- ✅ Leer tags, triggers, variables del contenedor
- ✅ Publicar cambios en contenedor
- ✅ Audit de cambios (version history)
- ✅ Preview mode management

---

### 5. PageSpeed Insights / Lighthouse MCP

**Propósito**: Auditoría de performance web

- **Repositorio**: [`adamsilverstein/lighthouse-mcp-server`](https://github.com/adamsilverstein/lighthouse-mcp-server)
- **Estado**: ⚠️ Experimental (0 stars)
- **Lenguaje**: TypeScript
- **Última actualización**: Feb 14, 2026

**Instalación**:
```bash
git clone https://github.com/adamsilverstein/lighthouse-mcp-server.git
cd lighthouse-mcp-server
npm install
```

**Configuración**:
```bash
export PAGESPEED_API_KEY="tu_api_key"
# Obtener en: https://developers.google.com/speed/docs/insights/v5/about
```

**Capabilities**:
- ✅ Performance score (0-100)
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Opportunities y diagnostics
- ✅ Mobile vs Desktop comparison

**Alternativa si no funciona**: Usar API REST directa de PageSpeed Insights

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://tudominio.com&key=YOUR_API_KEY&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO"
```

---

### 🔵 NICE TO HAVE — Fase 3

---

### 6. Multi-Ads Platform MCP

**Propósito**: Gestión unificada de múltiples plataformas de ads

- **Repositorio**: [`amekala/ads-mcp`](https://github.com/amekala/ads-mcp)
- **Estado**: ✅ Community activo
- **Lenguaje**: Shell + Python
- **Stars**: 22
- **Última actualización**: 13 horas atrás

**Plataformas soportadas**:
- Google Ads
- Meta Ads (Facebook/Instagram)
- LinkedIn Ads
- TikTok Ads

**Instalación**:
```bash
git clone https://github.com/amekala/ads-mcp.git
cd ads-mcp
./install.sh
```

---

### 7. YouTube Analytics MCP

**Propósito**: Analytics para canales de YouTube (si clientes tienen video)

- **Repositorio**: [`pauling-ai/youtube-mcp-server`](https://github.com/pauling-ai/youtube-mcp-server)
- **Stars**: 5
- **Capabilities**: 40 tools para channel analytics, video publishing, tracking


---

### 2.2 Herramientas SIN MCP Server — Alternativas

| Herramienta | MCP Disponible | Alternativa Recomendada |
|-------------|----------------|------------------------|
| **Ahrefs** | ❌ No | API REST directa + script custom |
| **SEMrush** | ❌ No | API REST directa + script custom |
| **Moz** | ❌ No | API REST directa (Mozscape API) |
| **Screaming Frog** | ❌ No | CLI mode + parsing de exports |
| **SimilarWeb** | ❌ No | API REST (plan enterprise) |

### Scripts Custom Recomendados

Crear en `seo-agency/tools/`:

1. **`ahrefs-keyword-extractor.py`**
   - Usa Ahrefs API para extraer keywords de dominios competidores
   - Exporta a CSV para importar en templates

2. **`semrush-position-tracker.py`**
   - Track diario de posiciones para keywords objetivo
   - Genera alerts de cambios significativos (>3 posiciones)

3. **`moz-domain-analysis.sh`**
   - Consulta Domain Authority, Page Authority, spam score
   - Útil para link building y competitor analysis

---

## Fase 3: Skills a Crear

> **Importante**: Usar `skill-creator` para cada skill. Cargar el skill antes de crear.

### 3.1 Skill: `seo-audit`

**Propósito**: Auditoría técnica completa de sitios web

**Descripción**:
Realiza auditorías técnicas SEO on-page y off-page. Analiza estructura del sitio, performance, indexación, meta tags, schema markup, internal linking, y más.

**Capabilities**:
- [ ] Crawleo y análisis de estructura de URLs
- [ ] Verificación de meta tags (title, description, canonicals)
- [ ] Análisis de schema markup (JSON-LD validation)
- [ ] Detección de errores 4xx/5xx
- [ ] Análisis de robots.txt y sitemap.xml
- [ ] Verificación de Core Web Vitals
- [ ] Auditoría de internal linking
- [ ] Detección de contenido duplicado
- [ ] Análisis de velocidad de carga
- [ ] Mobile-friendliness check

**Prompt base para skill-creator**:
```
Eres un experto SEO técnico con 10+ años de experiencia. Tu rol es realizar auditorías técnicas exhaustivas de sitios web.

Cuando recibas una URL:
1. Analiza la estructura del sitio (crawl depth, URL structure)
2. Verifica todos los meta tags (title length, description, canonicals, robots meta)
3. Valida schema markup usando Google Rich Results Test
4. Identifica errores de rastreo (404, 500, redirect chains)
5. Revisa robots.txt y sitemap.xml
6. Evalúa Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
7. Analiza internal linking (orphan pages, link equity distribution)
8. Detecta contenido duplicado o thin content
9. Verifica mobile-friendliness
10. Genera un reporte priorizado (Critical, High, Medium, Low)

Formato de output:
- Executive Summary (3-5 bullets)
- Critical Issues (acción inmediata requerida)
- High Priority (esta semana)
- Medium Priority (este sprint)
- Low Priority (backlog)
- Recomendaciones de mejora continua
```

---

### 3.2 Skill: `keyword-research`

**Propósito**: Investigación estratégica de keywords

**Descripción**:
Identifica oportunidades de keywords basadas en search volume, dificultad, intención de búsqueda y relevancia comercial.

**Capabilities**:
- [ ] Análisis de intención de búsqueda (informacional, comercial, transaccional, navigacional)
- [ ] Keyword clustering por tópico
- [ ] Long-tail keyword discovery
- [ ] Competitor keyword gap analysis
- [ ] Search volume y tendencia estimation
- [ ] Keyword difficulty assessment
- [ ] SERP feature analysis (featured snippets, PAA, local pack)
- [ ] Content gap identification

**Prompt base**:
```
Eres un especialista en keyword research con experiencia en SEO para e-commerce y SaaS.

Tu proceso:
1. Identifica el nicho y audiencia objetivo del cliente
2. Analiza la intención de búsqueda para cada keyword
3. Clasifica keywords por funnel stage (TOFU, MOFU, BOFU)
4. Realiza competitor gap analysis (qué keywords rankea la competencia que nosotros no)
5. Identifica long-tail opportunities (bajo competition, high intent)
6. Clusteriza keywords por tópico para content planning
7. Prioriza por: search volume, difficulty, relevance, commercial intent

Output:
- Keyword Master List (CSV-ready: keyword, volume, difficulty, intent, priority)
- Content Cluster Map (tópicos principales + subtópicos)
- Quick Wins (low difficulty, decent volume)
- Strategic Bets (high value, requiere esfuerzo)
- SERP Features a targetear (featured snippets, PAA)
```

---

### 3.3 Skill: `content-optimization`

**Propósito**: Optimización on-page de contenido existente

**Descripción**:
Optimiza contenido existente para mejorar rankings, CTR y engagement. Analiza y mejora title tags, meta descriptions, heading structure, keyword usage, internal links, y más.

**Capabilities**:
- [ ] Title tag optimization (length, keyword placement, CTR)
- [ ] Meta description optimization
- [ ] Heading structure (H1-H6 hierarchy)
- [ ] Keyword density y placement analysis
- [ ] LSI keywords y semantic enrichment
- [ ] Internal linking recommendations
- [ ] Image alt text optimization
- [ ] Readability improvement (Flesch-Kincaid)
- [ ] Content freshness updates
- [ ] Featured snippet optimization

**Prompt base**:
```
Eres un experto en optimización on-page y content SEO.

Para cada página/contento:
1. Analiza el title tag actual (longitud, keyword placement, power words)
2. Revisa meta description (CTR potential, call-to-action)
3. Verifica heading structure (H1 único, jerarquía lógica H2-H6)
4. Evalúa keyword usage (densidad 1-2%, placement en primeros 100 words)
5. Identifica oportunidades para LSI/semantic keywords
6. Sugiere internal links relevantes (anchor text optimizado)
7. Revisa image alt texts (descriptivos, con keywords cuando aplique)
8. Analiza readability (párrafos cortos, bullet points, transiciones)
9. Identifica oportunidades para featured snippets (definiciones, listas, tablas)
10. Recomienda actualizaciones de freshness (datos actualizados, ejemplos recientes)

Output:
- Before/After para title y meta description
- Heading structure recomendado
- Keyword placement map
- Internal linking suggestions (source → target + anchor)
- Featured snippet opportunities
- Readability score improvement plan
```

---

### 3.4 Skill: `google-ads-manager`

**Propósito**: Gestión y optimización de campañas Google Ads

**Descripción**:
Crea, gestiona y optimiza campañas Google Ads. Incluye keyword research para ads, ad copy creation, bid management, y performance analysis.

**Capabilities**:
- [ ] Campaign structure planning (SKAGs, STAGs, temáticas)
- [ ] Keyword research para Ads (commercial intent focus)
- [ ] Ad copy creation (RSA con múltiples headlines/descriptions)
- [ ] Bid strategy recommendations
- [ ] Quality Score optimization
- [ ] Negative keyword management
- [ ] A/B testing de ads
- [ ] Conversion tracking setup
- [ ] ROAS analysis y optimization
- [ ] Competitor ad analysis

**Prompt base**:
```
Eres un Google Ads expert con certificación Google y 8+ años gestionando presupuestos de $50k+/mes.

Para cada campaña:
1. Define el objetivo (leads, ventas, brand awareness, traffic)
2. Estructura campañas (SKAGs para high-intent, temáticas para discovery)
3. Investiga keywords (commercial intent, competitor keywords, long-tail)
4. Crea RSAs con 15 headlines y 4 descriptions (variedad de angles)
5. Configura negative keywords (exclude irrelevantes, competitor names si aplica)
6. Recomienda bid strategy (Manual CPC para start, Smart Bidding con data)
7. Optimiza Quality Score (ad relevance, landing page experience, expected CTR)
8. Setup conversion tracking (Google Tag Manager, GA4 integration)
9. Analiza ROAS por campaña/ad group/keyword
10. Recomienda budget allocation basado en performance

Output:
- Campaign structure diagram
- Keyword list con match types y bids sugeridos
- RSA ad copy (headlines + descriptions)
- Negative keyword list
- Bid strategy recommendation
- Conversion tracking checklist
- Weekly optimization checklist
```

---

### 3.5 Skill: `rank-tracker`

**Propósito**: Seguimiento de posiciones y alertas de cambios

**Descripción**:
Monitorea posiciones de keywords objetivo, detecta cambios significativos y genera alerts. Integra datos de Search Console y herramientas externas.

**Capabilities**:
- [ ] Daily/weekly rank tracking
- [ ] Change detection (>3 posiciones)
- [ ] SERP feature tracking (featured snippets, local pack)
- [ ] Competitor rank comparison
- [ ] Historical trend analysis
- [ ] Alert generation (drops significativos)
- [ ] Correlation con actualizaciones de Google
- [ ] Local pack tracking (si aplica)

**Prompt base**:
```
Eres un especialista en rank tracking y SERP analysis.

Tu flujo:
1. Define keyword set objetivo (prioritarias por valor comercial)
2. Establece baseline de posiciones actuales
3. Monitorea diariamente (o semanalmente según volumen)
4. Detecta cambios >3 posiciones (up o down)
5. Investiga causas de drops (algorithm update, competitor movement, technical issues)
6. Trackea SERP features (quién tiene featured snippet, PAA, local pack)
7. Compara con competidores principales
8. Genera alerts para cambios críticos
9. Analiza tendencias históricas (seasonality, growth patterns)
10. Correlaciona con actualizaciones conocidas de Google (Search Central announcements)

Output:
- Rank tracking dashboard (keyword, posición actual, cambio, tendencia)
- Alerts list (cambios críticos con posibles causas)
- SERP feature report (quién posee qué features)
- Competitor movement analysis
- Weekly summary (winners, losers, action items)
```

---

### 3.6 Skill: `seo-report`

**Propósito**: Generación de reportes ejecutivos para clientes

**Descripción**:
Crea reportes mensuales/semanales ejecutivos con métricas clave, logros, y recomendaciones. Formato claro para stakeholders no técnicos.

**Capabilities**:
- [ ] Executive summary (3-5 bullets clave)
- [ ] Traffic overview (sessions, users, pageviews, bounce rate)
- [ ] Organic performance (clicks, impressions, CTR, avg position)
- [ ] Keyword movement (top gainers, top losers)
- [ ] Conversion metrics (goals, revenue, ROAS)
- [ ] Technical health score
- [ ] Content performance (top pages)
- [ ] Backlink summary (new links, lost links, DA changes)
- [ ] Google Ads performance (si aplica)
- [ ] Next month priorities

**Prompt base**:
```
Eres un especialista en reporting SEO con habilidad para comunicar datos técnicos a stakeholders no técnicos.

Estructura del reporte mensual:
1. Executive Summary (3-5 bullets: logros principales, métricas clave, alertas)
2. Traffic Overview (mes actual vs mes anterior, YoY comparison)
   - Sessions, users, pageviews
   - Bounce rate, avg session duration
3. Organic Search Performance
   - Clicks, impressions, CTR, avg position (GSC data)
   - Top 10 keywords por clicks
   - Biggest movers (top 5 gainers, top 5 losers)
4. Conversion Metrics
   - Goals completadas (leads, ventas, signups)
   - Conversion rate, revenue atribuido
5. Technical Health
   - Core Web Vitals status
   - Crawl errors (4xx, 5xx)
   - Index coverage (páginas indexadas vs errores)
6. Content Performance
   - Top 5 páginas por tráfico
   - Top 5 páginas por conversiones
7. Backlink Summary
   - New links, lost links
   - Domain Authority changes
   - Spam score alerts
8. Google Ads (si aplica)
   - Spend, clicks, conversions, CPA, ROAS
9. Next Month Priorities
   - Top 3-5 iniciativas con impacto esperado

Formato:
- Lenguaje claro, evitar jerga técnica
- Usar visualizaciones (tablas, bullets, emojis para énfasis)
- Incluir contexto (por qué importa cada métrica)
- Acciones claras y owners asignados
```


---

## Fase 4: Flujo de Trabajo Recomendado

### 4.1 Onboarding de Cliente

**Duración**: 1-2 semanas

**Semana 1: Discovery & Baseline**
1. [ ] Kickoff meeting (objetivos, KPIs, timeline, budget)
2. [ ] Access setup (GA4, GSC, Google Ads, CMS, hosting)
3. [ ] Auditoría técnica inicial (skill: `seo-audit`)
4. [ ] Baseline de rankings (skill: `rank-tracker`)
5. [ ] Competitor analysis (top 3-5 competidores)

**Semana 2: Strategy & Planning**
1. [ ] Keyword research (skill: `keyword-research`)
2. [ ] Content audit (qué contenido existe, qué falta)
3. [ ] Technical fixes prioritization (critical issues primero)
4. [ ] Content calendar planning (primeros 3 meses)
5. [ ] Google Ads strategy (si aplica)
6. [ ] Reporting template setup (skill: `seo-report`)

---

### 4.2 Auditoría Inicial

**Herramienta**: Skill `seo-audit`

**Checklist**:
- [ ] Crawl del sitio completo (Screaming Frog o similar)
- [ ] Análisis de estructura de URLs
- [ ] Meta tags audit (titles, descriptions, canonicals)
- [ ] Schema markup validation
- [ ] Robots.txt y sitemap.xml review
- [ ] Error detection (404, 500, redirect chains)
- [ ] Core Web Vitals assessment
- [ ] Mobile-friendliness check
- [ ] Internal linking analysis
- [ ] Contenido duplicado/thin content

**Output**: Reporte de auditoría priorizado (Critical, High, Medium, Low)

---

### 4.3 Optimización Continua

**Sprint Semanal**

**Lunes: Planning**
- [ ] Review de alerts de la semana anterior (rank drops, traffic anomalies)
- [ ] Definir prioridades del sprint
- [ ] Asignar tasks (technical fixes, content creation, link building)

**Martes-Miércoles: Execution**
- [ ] Technical fixes (critical/high priority)
- [ ] Content optimization (skill: `content-optimization`)
- [ ] New content creation (basado en content calendar)
- [ ] Link building outreach

**Jueves: Google Ads Management**
- [ ] Review de performance (ROAS, CPA, Quality Score)
- [ ] Bid adjustments
- [ ] Negative keyword additions
- [ ] New ad copy testing
- [ ] Budget reallocation

**Viernes: Analysis & Reporting**
- [ ] Rank tracking update (skill: `rank-tracker`)
- [ ] Traffic analysis (GA4)
- [ ] Search Console performance review
- [ ] Weekly report para cliente interno

---

### 4.4 Reporting Mensual

**Herramienta**: Skill `seo-report`

**Timeline**:
- **Día 1 del mes**: Recolectar datos del mes anterior
- **Día 2-3**: Generar reporte con skills
- **Día 4-5**: Review interno y ajustes
- **Día 6-7**: Enviar a cliente + meeting de review

**Métricas Clave por Tipo de Cliente**:

| Tipo de Cliente | Métricas Principales |
|-----------------|---------------------|
| **E-commerce** | Revenue orgánico, conversion rate, AOV, ROAS |
| **SaaS** | Demo requests, signups, MQLs, CAC |
| **Local Business** | Calls, direction requests, form fills |
| **Content/Media** | Pageviews, time on page, ad revenue |

---

## Fase 5: Herramientas Externas Recomendadas

### 5.1 Herramientas Esenciales (Free/Freemium)

| Herramienta | Propósito | Costo | Link |
|-------------|-----------|-------|------|
| **Google Search Console** | Search performance, index coverage | Free | [search.google.com/search-console](https://search.google.com/search-console) |
| **Google Analytics 4** | Traffic y conversion analytics | Free | [analytics.google.com](https://analytics.google.com) |
| **Google Tag Manager** | Tag management | Free | [tagmanager.google.com](https://tagmanager.google.com) |
| **Google PageSpeed Insights** | Performance auditing | Free | [pagespeed.web.dev](https://pagespeed.web.dev) |
| **Google Keyword Planner** | Keyword research (volumen estimado) | Free (con cuenta Ads) | [ads.google.com](https://ads.google.com) |
| **Bing Webmaster Tools** | Search performance en Bing | Free | [bing.com/webmasters](https://www.bing.com/webmasters) |
| **Screaming Frog SEO Spider** | Site crawling (hasta 500 URLs) | Free / £149/año | [screamingfrog.co.uk](https://www.screamingfrog.co.uk/seo-spider/) |

---

### 5.2 Herramientas Premium (Recomendadas)

| Herramienta | Propósito | Costo | Prioridad |
|-------------|-----------|-------|-----------|
| **Ahrefs** | Backlink analysis, keyword research, competitor analysis | $99-$999/mes | 🔴 Alta |
| **SEMrush** | All-in-one SEO suite (similar a Ahrefs) | $119-$449/mes | 🔴 Alta |
| **Moz Pro** | DA/PA metrics, rank tracking, site audits | $99-$599/mes | 🟡 Media |
| **Surfer SEO** | Content optimization (NLP-based) | $59-$239/mes | 🟡 Media |
| **Frase** | Content briefs y optimization | $14-$114/mes | 🟡 Media |
| **Authority Labs** | Rank tracking (white-label reports) | $49-$449/mes | 🟢 Si tienes muchos clientes |
| **Looker Studio** | Dashboards personalizados | Free / Enterprise | 🟢 Para reporting avanzado |

**Recomendación inicial**:
- Empezar con **Ahrefs** o **SEMrush** (elige uno, no necesitas ambos)
- Añadir **Surfer SEO** si haces mucho content optimization
- Usar **Looker Studio** para dashboards ejecutivos

---

## Apéndice A: Comandos de Instalación Rápida

```bash
# 1. Google Ads MCP
pip install google-ads-mcp

# 2. Google Analytics MCP
pip install google-analytics-mcp

# 3. Search Console MCP
npm install -g @saurabhsharma2u/search-console-mcp

# 4. Google Tag Manager MCP
npm install -g @pouyanafisi/gtm-mcp

# 5. Lighthouse MCP (experimental)
git clone https://github.com/adamsilverstein/lighthouse-mcp-server.git
cd lighthouse-mcp-server
npm install

# 6. Multi-Ads MCP (opcional)
git clone https://github.com/amekala/ads-mcp.git
cd ads-mcp
./install.sh
```

---

## Apéndice B: Checklist de Lanzamiento

### Pre-Lanzamiento
- [ ] Estructura de carpetas creada
- [ ] `.env.example` configurado
- [ ] MCP servers instalados y testeando
- [ ] Skills creadas con `skill-creator`
- [ ] Scripts custom en `tools/`
- [ ] Templates en `templates/`

### Primer Cliente
- [ ] Contrato y objetivos definidos
- [ ] Access a todas las plataformas
- [ ] Auditoría inicial completada
- [ ] Baseline de rankings establecido
- [ ] Primer reporte mensual generado

### Escalamiento
- [ ] Procesos documentados en `docs/processes/`
- [ ] Templates reutilizables creados
- [ ] Scripts automatizados corriendo
- [ ] Dashboard de múltiples clientes en Looker Studio

---

## Próximos Pasos

1. **Inmediato (esta semana)**:
   - [ ] Instalar MCP servers críticos (Google Ads, GA4, Search Console)
   - [ ] Crear las 6 skills con `skill-creator`
   - [ ] Configurar `.env` con credenciales de prueba

2. **Semana 2**:
   - [ ] Crear scripts custom en `tools/`
   - [ ] Desarrollar templates en `templates/`
   - [ ] Documentar procesos en `docs/processes/`

3. **Semana 3-4**:
   - [ ] Onboard primer cliente piloto
   - [ ] Ejecutar flujo completo (auditoría → optimización → reporte)
   - [ ] Refinar procesos basado en learnings

---

**Documento creado**: 2026-03-23  
**Autor**: Craftia SEO Agency Team  
**Versión**: 1.0
