# Configuración de Variables de Entorno

## Archivo .env requerido

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

## Variables necesarias para MCP Servers

### Google Ads (@channel47/google-ads-mcp)

```bash
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=5309454449
```

### Google Analytics (@toolsdk.ai/google-analytics-mcp)

```bash
GA4_PROPERTY_ID=
GA4_CLIENT_ID=
GA4_CLIENT_SECRET=
GA4_REFRESH_TOKEN=
```

### Google Search Console (search-console-mcp)

```bash
GSC_CLIENT_ID=
GSC_CLIENT_SECRET=
GSC_REFRESH_TOKEN=
GSC_PROPERTY=https://motoshondaconcesionarios.com
```

## Cómo obtener credenciales de Google

### 1. Crear proyecto en Google Cloud Console

1. Ir a https://console.cloud.google.com
2. Crear nuevo proyecto: "SEO Agency"
3. Habilitar APIs:
   - Google Ads API
   - Google Analytics Data API
   - Google Search Console API

### 2. Crear credenciales OAuth 2.0

1. Ir a "APIs & Services" > "Credentials"
2. Crear OAuth 2.0 Client ID
3. Descargar JSON con client_id y client_secret

### 3. Obtener Developer Token (Google Ads)

1. Ir a Google Ads API Center
2. Solicitar Developer Token
3. Esperar aprobación (puede tardar 24-48h)

### 4. Obtener Refresh Token

1. Usar OAuth 2.0 Playground: https://developers.google.com/oauthplayground
2. Seleccionar las APIs necesarias
3. Autorizar y obtener refresh token

## Variables adicionales

```bash
# PageSpeed Insights (no requiere auth completa)
PAGESPEED_API_KEY=

# Herramientas SEO externas (opcional)
AHREFS_API_KEY=
SEMRUSH_API_KEY=
MOZ_API_KEY=

# Cliente Actual
CLIENT_NAME=motoshondaconcesionarios
CLIENT_WEBSITE=https://motoshondaconcesionarios.com
CLIENT_GOOGLE_ADS_ID=530-945-4449
```
