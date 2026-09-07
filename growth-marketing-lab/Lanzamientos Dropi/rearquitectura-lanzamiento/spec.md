# Spec · Rearquitectura Dropi — Centro de Comando de Lanzamiento

> Fuente de verdad interna de este artefacto. Estados: 🟢 Definido · 🟡 En construcción ·
> 🔴 Pendiente · 🔵 Propuesta.
>
> **Vive dentro de GRO-003** ("Mesa estratégica Lanzamientos - Product Growth
> Marketing"), igual que Page Pilot — es otro artefacto del dashboard de aprendizajes
> de mesas estratégicas de lanzamiento, no un proyecto aparte.

| Campo | Valor |
|-------|-------|
| Owner / PM | Catherin Salazar |
| Célula | Growth Marketing |
| Proyecto HUB | GRO-003 — Mesa estratégica Lanzamientos |
| Tier del lanzamiento | Tier 3 — Lanzamiento estratégico |
| Fecha de lanzamiento | 12 de septiembre de 2026 (ExpoWinners + canales internos) |
| Estado global | 🟡 En construcción — ver % de avance calculado en el propio artefacto |
| Última actualización | 2026-09-02 |

## 0 · Qué es
Strategy Package / Launch Command Center de la Rearquitectura de Dropi (el lanzamiento
de mayor importancia de la célula hasta ahora): fuente única de verdad para que
Product Growth Marketing, Marketing, Producto, Academy, Servicio al Cliente y Comercial
ejecuten el lanzamiento — narrativa, TARS, journey, comunicación, hipótesis,
experimentos, medición e insumos, todo con estado real (no se inventó ningún dato
faltante).

## 1 · Fuentes usadas (2026-09-02)
- `Lanzamiento Rearquitectura Dropi - Wokshop -Tier 3.pdf` (export de Figma, ~141MB,
  extraído con `pypdf` por exceder el límite de 100MB del lector nativo) — WORKSHOP.
- `Cuentame un poco de la historia - Rearquitectura de Dropi_ ... - Notas de Gemini.pdf`
  (entrevista Catherin Salazar / Maria Ossa, 20-ago-2026) — ENTREVISTA.
- `Insumos rearquitectura.pdf` — links a investigaciones y prototipos (Figma).
- Brief directo de Catherin con los 7 links de Figma reales y el spec de 35 secciones.

## 2 · Qué quedó realmente definido vs. pendiente
El propio workshop se propuso 9 entregables — el artefacto calcula su % de avance
en vivo a partir de este checklist real (ver sección "Resumen ejecutivo"):

🟢 Definidos: narrativa estratégica, comportamiento a cambiar (Entender→Encontrar→
Usar→Descubrir→Adoptar).
🟡 En construcción: segmentos y riesgo de migración, journey de transición, estrategia
de comunicación, hipótesis y experimentos, KPIs de medición.
🔴 Pendientes: estrategia de educación (Academy), plan de acción antes/durante/después
con fechas y responsables individuales.

Marcas Blancas: el workshop dice literalmente "NO SABEMOS" — se dejó como sección
🔴 pendiente con un botón para agregar el insumo cuando llegue, sin reconstruir el
artefacto.

## 2.1 · Artefacto visualizable
https://claude.ai/code/artifact/8ca302d6-fba4-44eb-93e8-e0980f17e732 (privado, compartir
desde el menú de la página). Fuente de verdad del contenido:
[`rearquitectura-lanzamiento.html`](rearquitectura-lanzamiento.html).

## 3 · Arquitectura técnica
Igual patrón que Page Pilot: un solo HTML autocontenido (CSS + JS inline), datos y
render separados dentro del mismo archivo — `DATA` (todo el contenido fijo, con
`src`/estado por afirmación), `STORE` (estado editable: backlog de experimentos y
doc de marcas blancas, persistido en `localStorage` del navegador del viewer), y
funciones `render*` por sección (una por cada uno de los 15 ítems del nav).

Extiende la línea gráfica de Page Pilot (mismos tokens de color/tipografía/espaciado)
con: sidebar de navegación de 15 secciones + scrollspy, toggle de tema claro/oscuro/auto,
panel ejecutivo con % de avance calculado (no inventado), tabla de experimentos
editable en vivo, matriz ICE que se recalcula sola al puntuar, y un modal genérico
(usado hoy para el placeholder de Marcas Blancas).

Antes de publicar se corrió un smoke test en Node+jsdom (`node --check` para sintaxis
+ ejecución simulada: agregar experimento, editar Impacto/Confianza/Esfuerzo, verificar
que los 15 links del nav resuelven a un id real) — sin errores.

**Portabilidad a React/Next.js (para integrarlo al hub más adelante):** el objeto
`DATA` mapea directo a props, `STORE` mapea a estado (o a una tabla de Supabase si se
quiere colaborativo entre viewers en vez de por-navegador), y cada función `render*`
mapea 1:1 a un componente. No se generó nada que dependa de mantenerse como HTML plano.

## 4 · Limitaciones conocidas
- El backlog de experimentos y el documento de Marcas Blancas se editan y guardan
  **por navegador** (localStorage) — no son compartidos entre viewers. Si Catherin
  quiere que el equipo edite y todos vean lo mismo, hay que subir el artefacto a un
  capability de estado compartido (o migrarlo a una tabla real en Supabase).
- El PDF "Insumos rearquitectura" y la entrevista completa no se pueden servir como
  descarga desde el artefacto (el sandbox de Artifacts bloquea links de descarga) —
  quedaron marcados como recurso a subir a Drive/asset, no como botón roto.
- Las notas crudas de módulos (sección 03) se agruparon **tal como aparecen en el
  export de Figma** — el layout espacial del board no garantiza que cada nota quedó
  bajo el módulo correcto; no se reinterpretó ni corrigió.
- La numeración de fases del journey de post-lanzamiento mezcla dos series distintas
  en el material fuente (una "Descubre" y otra "Aprende/Realiza/Convierte") — se
  muestran ambas tal cual, sin forzar una secuencia única inventada.

## 5 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Célula | Growth Marketing |
| Proyecto HUB | GRO-003 — Mesa estratégica Lanzamientos |
| Proyecto ancla del lab | GMR-001 (Product Growth Marketing Agent OS) |
| Relacionado (mismo patrón) | `page-pilot-lanzamiento/spec.md` |
| Relacionado (otra célula, no tocar) | `hub/src/app/proyectos/rearquitectura/` — doc E2E técnico de Diana/Experience, ángulo TI/Product Design, distinto de este artefacto de Marketing/Growth |

## 6 · Próximos pasos del propio artefacto
Ver sección "13 · Próxima mesa estratégica" dentro del artefacto — lista viva,
generada a partir de los huecos reales encontrados en las fuentes.

## 7 · Changelog
- 2026-09-02 — Creado. Analizadas las 3 fuentes, construido el Centro de Comando
  completo, validado con smoke test en jsdom, publicado como Artifact.
