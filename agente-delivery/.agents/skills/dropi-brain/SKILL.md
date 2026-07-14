---
name: dropi-brain
description: Use this skill when the user wants to keep the section structure of any Dropi document (research, épica, historia, kickoff, pitch, brief de lanzamiento, flujo) unified and consistent, when a new research needs to be added to research-brain/ following the canonical format, when the user asks a question that should be answered from the research-brain knowledge base, or when the user wants to pull insights from Drive/research and publish a synthesis to the right place in Confluence.
---

# Dropi Brain

## Objetivo

Ser la única fuente de verdad sobre **qué secciones debe tener cada tipo de documento de Dropi** y evitar que esa estructura se defina dos veces en lugares distintos. Además, mantiene `research-brain/` (la base de conocimiento de research) actualizada, la usa para responder preguntas, y sintetiza insights de negocio/research hacia Confluence.

Este skill no inventa formato: lee `canon/dropi_methodology.md`, que contiene la estructura oficial de cada tipo de documento (Épica, Historia, Subtarea, Kickoff, Pitch, Brief de Lanzamiento, Documento de Research, Flujo de Usuario). Todos los demás skills creadores (`epic-creator`, `historia-creator`, `kickoff-creator`, `pitch-creator`, `launch-brief-creator`, `flow-creator`, `dropi-researcher`) deben usar esas mismas secciones — nunca redefinir su propia versión.

## Cuándo usarlo

- "unifica la estructura de las secciones de [tipo de documento]"
- "¿esto sigue el formato oficial?"
- "agrega este research al research-brain"
- "¿qué sabemos sobre [tema]?" / cualquier pregunta que deba responderse desde research-brain
- Cuando otro skill creador esté a punto de generar un documento y necesite confirmar la lista de secciones vigente
- "sintetiza esto para Confluence", "trae este proyecto de Drive a Confluence", "sube los insights de research a Confluence"

## Modos de uso

### 1. Consultar estructura oficial de un tipo de documento

1. Lee `canon/dropi_methodology.md`.
2. Devuelve la lista exacta de secciones, en el orden oficial, para el tipo pedido.
3. Si el tipo de documento no existe todavía en `canon/dropi_methodology.md`, dilo explícitamente — no improvises una estructura nueva sin que el usuario la apruebe primero. Si el usuario aprueba una estructura nueva, agrégala a `canon/dropi_methodology.md` (nunca la dejes solo en un documento suelto).

### 2. Validar un documento existente contra el formato oficial

1. Identifica el tipo de documento.
2. Compara sus secciones (títulos `##`/`**`) contra la lista oficial en `canon/dropi_methodology.md`.
3. Reporta: secciones faltantes, secciones de más (fuera de formato), y secciones fuera de orden.
4. No corrijas el documento sin que el usuario lo pida explícitamente.

### 3. Agregar un research nuevo a research-brain/

1. Lee `research-brain/INDEX.md` primero para ver el siguiente ID disponible (`RB-XXX`) y qué temas ya existen.
2. Genera el archivo `research-brain/RB-XXX-[slug].md` con **todas** las secciones de "Documento de Research (RB-XXX)" en `canon/dropi_methodology.md`, en ese orden exacto.
3. Actualiza `research-brain/INDEX.md`:
   - Agrega la fila a la tabla "Researches cargados".
   - Agrega el research a "Temas cubiertos" bajo los temas que corresponda (crea temas nuevos si hace falta).
   - Revisa y actualiza "Vacíos de conocimiento detectados" — quita los vacíos que este research haya cerrado, agrega los nuevos que haya expuesto.
4. Presenta el archivo como borrador para aprobación del usuario antes de darlo por definitivo.
5. Si el usuario aprueba y hay conexión a Supabase, usa el skill `canon-keeper` (o el script equivalente) para insertar/actualizar la fila en `research_documents` con el mismo contenido.

### 4. Responder preguntas usando research-brain/

1. Lee `research-brain/INDEX.md` primero para ver qué hay disponible y en qué archivos.
2. Lee los archivos `RB-XXX` relevantes a la pregunta.
3. Responde con esta estructura fija: **researches encontrados → insights → evidencia → vacíos → recomendación**.
4. Regla dura: si no hay evidencia suficiente en research-brain, dilo explícitamente. Nunca inventes hallazgos, dolores u oportunidades que no estén respaldados por una cita o dato en los archivos.

### 5. Sintetizar insights y publicarlos en el lugar correcto de Confluence

Esto es distinto de un "publicar" 1:1: no se sube el documento crudo, se sintetiza contra el canon y se ubica en la jerarquía correcta.

1. **Reúne las fuentes** del proyecto/iniciativa en cuestión:
   - `docs-sync/` — documentos crudos ya sincronizados de Drive por `/sync-from-drive` (clasificados por tipo: kickoff, research, planning, moscow, pitch, etc.)
   - `research-brain/` — hallazgos, dolores y oportunidades ya estructurados
   - `approved_context` — contexto oficial ya aprobado del proyecto
   - Si `docs-sync/` no tiene documentos recientes del proyecto, sugiere correr primero `/sync-from-drive`.
2. **Identifica qué tipo de síntesis es** (research, kickoff, épica, pitch, brief) y redáctala siguiendo **exactamente** las secciones oficiales de ese tipo en `canon/dropi_methodology.md` — nunca un volcado del documento fuente sin estructurar.
3. **Determina dónde vive en Confluence:**
   - Revisa `docs-sync/_confluence_index.json` (lo mantiene `scripts/confluence_publisher.py`) para ver si el proyecto ya tiene una página padre asignada.
   - Si no la tiene, pregunta al usuario bajo qué página/carpeta de Confluence debe ubicarse (`--parent PAGE_ID`) — no lo publiques en la raíz del espacio por defecto sin confirmar.
4. **Publica con el workflow `/publish-to-confluence`** (`scripts/confluence_publisher.py`):
   - Corre primero con `--dry-run` y muestra la vista previa (título, espacio, página padre).
   - Si el usuario aprueba, publica (crea o actualiza según `_confluence_index.json`).
5. Si el research sintetizado es nuevo para `research-brain/`, aplica también el Modo 3 (agregarlo con su RB-XXX e indexarlo) antes o junto con la publicación — así el conocimiento queda tanto en research-brain como en Confluence, sin duplicar estructura.
6. Reporta la URL de la página de Confluence resultante.

## Restricciones

- La estructura oficial vive en un solo lugar: `canon/dropi_methodology.md`. No la dupliques dentro de este skill ni dentro de research-brain/INDEX.md — si necesitas describirla ahí, enlaza al canon en vez de copiarla.
- Nunca promuevas un research a `research_documents` (Supabase) sin aprobación explícita del usuario — mismo principio que `canon-keeper` aplica a `approved_context`.
- No borres researches ni vacíos de conocimiento del INDEX sin instrucción humana explícita; márcalos como resueltos, no los elimines del historial si tienen valor de trazabilidad.

## Salida esperada

- Al consultar estructura: lista de secciones en orden, citando `canon/dropi_methodology.md`.
- Al validar: reporte de conformidad (falta / sobra / desordenado).
- Al agregar research: archivo `RB-XXX` completo + `INDEX.md` actualizado, en modo borrador.
- Al responder preguntas: respuesta estructurada con trazabilidad a la evidencia.
- Al sintetizar para Confluence: documento de síntesis en formato canónico + URL de la página publicada/actualizada.
