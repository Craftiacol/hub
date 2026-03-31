---
name: google-ads-manager
description: >
  Gestión completa de campañas de Google Ads. Creación, optimización, reporting 
  y troubleshooting de campañas de búsqueda, display y shopping.
  Trigger: When managing Google Ads campaigns, diagnosing campaign issues, or optimizing ad performance.
license: Apache-2.0
metadata:
  author: seo-agency
  version: "1.0"
---

## When to Use

- Diagnóstico de campañas no activas
- Creación de nuevas campañas
- Optimización de campañas existentes
- Análisis de rendimiento
- Configuración de conversion tracking

## Critical Patterns

### Diagnóstico de Campañas Inactivas

```markdown
## Estado de Campaña: INACTIVA

### Causas Comunes (en orden de probabilidad):

1. **Información de Facturación** ❌
   - Tarjeta no configurada o rechazada
   - Límite de gasto no alcanzado
   - Verificación de pago pendiente

2. **Verificación de Identidad** ❌
   - Documento no cargado
   - Verificación telefónica pendiente
   - Revisión de cuenta en curso

3. **Configuración Incompleta** ❌
   - Fechas de campaña no definidas
   - Presupuesto diario no establecido
   - Targeting geográfico incompleto
   - Grupos de anuncios vacíos
   - Anuncios no creados

4. **Anuncios Desaprobados** ❌
   - Viola políticas de Google
   - Landing page problemática
   - Contenido restringido

5. **Cuenta Suspendida** ❌
   - Violaciones previas
   - Verificación pendiente
   - Problemas de pago históricos
```

### MCP Server - Google Ads

```bash
# Instalación
npm install -g @channel47/google-ads-mcp

# Consultar estado de cuenta
npx @channel47/google-ads-mcp account-info

# Listar campañas
npx @channel47/google-ads-mcp campaigns --customerId "5309454449"

# Verificar problemas
npx @channel47/google-ads-mcp diagnose --customerId "5309454449"
```

### Checklist de Activación

```markdown
## Google Ads - Checklist de Activación

### 1. Configuración de Cuenta
- [ ] Facturación configurada
- [ ] Método de pago válido
- [ ] Verificación de identidad completada
- [ ] Límites de gasto establecidos

### 2. Configuración de Campaña
- [ ] Objetivo de campaña seleccionado
- [ ] Tipo de campaña definido (Búsqueda/Display/Shopping)
- [ ] Presupuesto diario establecido
- [ ] Fechas de inicio/fin configuradas
- [ ] Targeting geográfico seleccionado
- [ ] Idiomas definidos

### 3. Grupos de Anuncios
- [ ] Al menos 1 grupo de anuncios creado
- [ ] Keywords asignadas a cada grupo
- [ ] Match types configurados

### 4. Anuncios
- [ ] Al menos 3 anuncios por grupo
- [ ] Headlines (15 por anuncio)
- [ ] Descriptions (4 por anuncio)
- [ ] URLs de destino funcionales
- [ ] Extensiones de anuncio configuradas

### 5. Conversion Tracking
- [ ] Google Analytics conectado
- [ ] Eventos de conversión definidos
- [ ] Remarketing list configurada
```

### Configuración para Motos Honda

```markdown
## Cliente: Motos Honda Concesionarios
## ID Cuenta: 530-945-4449

### Configuración Recomendada:

**Objetivo**: Leads (solicitudes de información, contactos)
**Tipo**: Campaña de Búsqueda
**Presupuesto Diario**: $X USD (ajustar según competencia)
**Ubicación**: Argentina (geolocalización cercana a concesionaria)
**Idioma**: Español

### Grupos de Anuncios Sugeridos:

1. **Brand Honda**
   - Keywords: concesionaria honda, honda motos, honda argentina
   
2. **Modelos Honda**
   - Keywords: cb 190 honda, honda wave, honda tornado
   
3. **Intención Compra**
   - Keywords: comprar moto honda, precio moto honda, oferta moto honda
   
4. **Competencia**
   - Keywords: mejor moto, moto recomendada, comparar motos
```

## Commands

```bash
# Instalar Google Ads MCP
npm install -g @channel47/google-ads-mcp

# Consultar cuenta
npx @channel47/google-ads-mcp account-info
npx @channel47/google-ads-mcp campaigns --customerId "5309454449"

# Diagnosticar problemas
npx @channel47/google-ads-mcp diagnose
```

## Resources

- **Checklist**: See [assets/](assets/) for activation checklist
- **Google Ads**: Official documentation
- **MCP Server**: @channel47/google-ads-mcp on npm
