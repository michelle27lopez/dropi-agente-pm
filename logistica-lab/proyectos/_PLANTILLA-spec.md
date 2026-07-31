# Spec · <Nombre del proyecto>

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
> Fuente: `figma:` `jira:` `screenshot:` `data:` `reunion:` `doc:` `drive:`.

| Campo | Valor |
|-------|-------|
| Owner / PM | <nombre> |
| Product Designer | <nombre> |
| Stakeholder | <nombre> |
| Célula | Logistics |
| Etapa de la cadena | <Selección/Generación/Despacho/Tránsito/Novedad/Desenlace> |
| Estado global | ⚪ / 🟡 / 🔵 / 🟢 |
| NSM que mueve | <movilización / % entrega / tiempo por fases / métrica operativa> |
| Última actualización | <AAAA-MM-DD> |

## 0 · Resumen y estado global
<1 párrafo: qué es + en qué estado real está, separando lo construido de lo discovery.>

## 1 · Problema raíz
<árbol de problemas, no síntoma — cada causa con fuente>
- <causa>  `[estado · fuente]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "creemos que [cambio] mejora [métrica de orden] porque [evidencia]".  `[fuente]`
- **Métrica de éxito + línea base:** <métrica> · base <valor>  `[data:…]`
- **NSM:** <cuál> (si el vínculo es indirecto, decirlo).

## 3 · Usuarios / actores
- <actor — rol>  `[fuente]`

## 4 · Alcance
**Entra (por estado):**
- <capacidad>  `[🟢/🔵/🟡 · fuente]`

**No-objetivos (⛔ — explícito):**
- <lo que NO se hace y por qué>  `[⛔ · fuente]`

## 5 · Reglas de negocio
- **R1 · <regla>**  `[estado · fuente]`
- **R2 · <regla>**  `[estado · fuente]`

## 6 · Criterios de aceptación (Gherkin)
**Módulo: <x>**
- **Dado** … **Cuando** … **Entonces** …

## 7 · Datos (diccionario)
<tablas/campos que toca — ver `conocimiento/temas/10`>
- `<tabla.campo>` — <para qué>  `[data:…]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Épica Jira | <KEY> |
| Historia/Oportunidad | <KEY(s)> |
| Idea/Proyecto Polaris | <KEY> |
| Figma | <link> |
| Doc E2E (Drive) | <link> |
| Carpeta Drive | <link> |
| Código/Repo | <ruta> |

## 9 · Preguntas abiertas
- [ ] <pregunta> — responsable: <quién>  `[fuente]`

## 10 · Changelog
- <AAAA-MM-DD> — <qué cambió>
