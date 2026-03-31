# Propuesta: Migración Angular 11 → Angular 21

---

## Por qué yo

Ya he recorrido este camino de migración antes , en producción con clientes reales. Sé dónde rompen las apps de Angular 11, qué dependencias causan problemas y cómo pasar de modules + zone.js a standalone + signals sin romper nada en el proceso.

Mi enfoque: **migración incremental, no un rewrite.** Cada paso queda testeado, commiteado y desplegable. Nunca van a terminar con una app rota que "va a funcionar cuando terminemos."

---

## Estrategia de Migración

### Fase 1 — Auditoría y Planificación (1-2 días)
- Revisión completa del código: componentes, servicios, módulos, rutas, dependencias
- Matriz de compatibilidad de dependencias (cuáles necesitan reemplazo, cuáles solo actualización)
- Identificación de breaking changes por cada salto de versión
- Evaluación de riesgos y hoja de ruta de migración

### Fase 2 — Actualización Incremental de Versiones (5-8 días)
Angular no soporta saltar de la 11 a la 21 directamente. La migración sigue la ruta oficial:

```
11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21
```

En cada paso:
- Ejecución de `ng update` para los paquetes core de Angular
- Actualización de dependencias de terceros
- Corrección de breaking changes y deprecaciones
- Ejecución de tests para confirmar que nada se rompe
- Commit — cada salto de versión es un checkpoint limpio y desplegable

**Hitos clave de la migración:**
| Versión | Cambio Principal |
|---------|-----------------|
| 12 | Ivy por defecto, modo estricto |
| 14 | Standalone components (opcional), formularios tipados |
| 16 | Signals (preview), inputs requeridos |
| 17 | Standalone por defecto, nuevo control flow (@if, @for) |
| 19 | Zoneless change detection (experimental) |
| 21 | Signals estable, standalone completo, zoneless |

### Fase 3 — Modernización (3-5 días)
Una vez en Angular 21, aplicar las mejores prácticas modernas:
- Migración de módulos a **standalone components**
- Reemplazo de patrones RxJS con **signals** donde aplique
- Migración a la nueva sintaxis de control flow (`@if`, `@for`, `@switch`)
- Reemplazo de `NgModules` por `provideRouter`, `provideHttpClient`, etc.
- Actualización de lazy loading para usar `loadComponent` en vez de `loadChildren` con módulos

### Fase 4 — Testing y QA (2-3 días)
- Ejecución completa del suite de tests, corrección de tests rotos
- Testing manual de todos los flujos críticos del usuario
- Benchmarking de rendimiento (tamaño del bundle antes/después, tiempos de carga)
- Verificación de compatibilidad con navegadores

---

## Qué obtienen al final

- ✅ Angular 21 con standalone components y signals
- ✅ Todas las dependencias actualizadas y compatibles
- ✅ Bundle limpio y optimizado (típicamente 20-40% más pequeño después de la migración)
- ✅ Sintaxis moderna y mejores prácticas en todo el código
- ✅ Cobertura completa de tests pasando
- ✅ Documentación de todos los cambios realizados y decisiones tomadas

---

## Plazo y Presupuesto

| Fase | Duración | Costo |
|------|----------|-------|
| Auditoría y Planificación | 1-2 días | Incluido |
| Actualización de Versiones (11 → 21) | 2-4 días | — |
| Modernización | 2-3 días | — |
| Testing y QA | 2-3 días | — |
| **Total** | **~2 semanas** | **$800 - $1,200 USD** |

> El estimado final depende del tamaño y complejidad del código. Después de la auditoría (Fase 1) puedo dar un precio fijo sin sorpresas.
>
> Forma de pago: 50% al inicio, 50% a la entrega.

---

## Experiencia

- **Angular desde la versión 2** — conocimiento profundo de cada versión mayor y sus breaking changes
- Migración de aplicaciones en producción a través de múltiples versiones de Angular
- Actualmente construyendo apps en producción con **Angular 21**: standalone components, signals, zoneless change detection y TDD
- Stack: TypeScript, Tailwind CSS, Supabase, Vercel, Vitest, Playwright

---

## Cómo trabajo

- Actualizaciones diarias asíncronas del progreso
- Cada salto de versión commiteado por separado — pueden revisar cada paso
- Señalo riesgos ANTES de que se conviertan en problemas
- Si encuentro código que necesita refactoring fuera del alcance de la migración, lo documento como recomendaciones — no amplío el scope sin aprobación
