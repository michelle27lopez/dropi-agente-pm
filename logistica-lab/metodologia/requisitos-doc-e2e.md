# Requisitos de los documentos E2E (Producto) — reglas de Juan

> Especificación para CUALQUIER documento E2E que arme Producto. Complementa la plantilla
> maestra E2E y `spec-driven.md` (Ley 7 — mantener arquitectura). Origen: feedback de Juan 2026-06-23.

## 0. REGLA BASE — NO SACAR COSAS (la más importante)
**Nunca recortar contenido REAL del proyecto.** "Básico / límpialo / ajústalo" significa quitar
**placeholders genéricos de plantilla**, NO borrar información real (painpoints detallados, las
preguntas con sus respuestas, AS-IS, hallazgos, decisiones, cifras, modelos). Si algo es real, se
**conserva** — aunque el doc quede largo. Condensar perdiendo detalle real = error. Ante la duda,
**preservar** y preguntar. (Origen: Juan, 23-jun, tras condensar de más el doc de Tarifas.)

## 1. Qué secciones arma Juan (PM) vs. qué conserva el doc
- **Juan (PM) redacta:** **Kick-off** y **Hand-off**.
- Pero el documento **conserva TODAS las secciones con contenido real** que existan
  (Discovery, Definición, etc.) — esas son del Product Designer / contexto, **no se borran**.
- Si una sección está vacía pero el proyecto lo amerita (ej. Definición), se **documenta** con lo
  real que se tenga (decisiones, conceptualización) y se marca lo pendiente. No se deja en placeholder.
- Lo no resuelto va a **riesgos / pendientes** (no como preguntas sueltas).

## 2. Contenido
- **Respuestas, no preguntas.** El documento lleva **decisiones**, no preguntas abiertas dispersas.
  Lo que no esté resuelto va a una sección de **Riesgos / pendientes**, no como pregunta en el cuerpo.
- **Datos del Kick-off (1.1) con TODOS los enlaces reales:** Jira **épica** + **solicitud**, **Figma**,
  y cualquier enlace relevante. **NO** incluir **prototipos no finales** (HTML/borradores/maquetas).

## 2.1 Hand-off — Contexto del sistema (C4 Nivel 1) siempre con sus 4 partes
La sección **4.2 del Hand-off** se desarrolla con sus **cuatro partes rotuladas** (cada una con su
título y contenido real, NO comprimidas en una sola línea con separadores):
- **Actores:** roles humanos que interactúan en el flujo y qué hace cada uno.
- **Sistemas externos involucrados:** plataformas/terceros con los que conversa el feature y **qué
  información se intercambia** con cada uno.
- **Dominios de negocio impactados:** áreas del producto/negocio que se tocan (sirve a TI para
  identificar dueños de módulos).
- **Flujo de datos a alto nivel:** cómo viaja la información entre actores y sistemas, en prosa o
  lista numerada, sin tecnicismos.

Producto aporta la vista funcional; TI traduce a componentes. Nunca dejar el placeholder
("Actor 1: rol y qué hace", "Sistema externo 1: (ej. pasarela de pagos)").

## 3. Formato
- **Mantener la estructura de colores** de la plantilla (encabezados de tabla con color de fondo).
- **Varias pestañas / documentos**, no todo junto en un solo bloque.
- Mantener la **arquitectura** de la plantilla (no colapsar ni renumerar).

## 3.1 Estilo y tipografía (reglas de Juan, 23-jun)
- **Espaciado:** separar visualmente las partes; dejar aire entre secciones y subsecciones. No dejarlo
  pegado. En HTML→Doc, meter párrafos/espacios en blanco entre bloques.
- **Sin guiones entre espacios:** no usar " — " ni " - " como separador entre frases. Reestructurar
  con dos puntos, paréntesis o salto de línea. Los guiones DENTRO de palabras compuestas se mantienen
  (Hand-off, Kick-off, Origen-Destino, no-objetivo).
- **Títulos en formato oración:** solo la **primera letra** en mayúscula. Las **siglas** van en
  mayúscula (DEV, COD, IVA, TI, OKR, KR, C4, JTBD, UX, AS-IS). Ejemplos: "Job to be done" (NO "Job To
  Be Done") · "Hand-off a DEV" (correcto) · "Definición y alcance" (NO "Definición & Alcance").

## 4. Limitaciones técnicas (MCP Drive) — a tener en cuenta
- **No puedo crear tabs nativas** de Google Docs vía API → "varias pestañas" se resuelve con
  **documentos separados** (uno por sección) o Juan crea las tabs y pega cada sección.
- **No puedo borrar ni renombrar** archivos de Drive vía API → si un doc queda obsoleto, lo borra Juan.
- **Sí puedo** crear Google Docs nativos con formato (HTML→Doc): títulos, tablas, negritas y
  **colores de celda**.
