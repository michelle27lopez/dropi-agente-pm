# Spec · Operación: MCP — juego estratégico de preparación mesa estratégica

> Fuente de verdad interna de este artefacto. Estados: ⚪ discovery · 🟡 definido ·
> 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
>
> **Vive dentro de GRO-003** ("Mesa estratégica Lanzamientos - Product Growth
> Marketing"), el proyecto del HUB que centraliza los aprendizajes de las mesas
> estratégicas de todos los lanzamientos. Es su tercer artefacto documentado,
> junto a Page Pilot y Rearquitectura — no un proyecto aparte.

| Campo | Valor |
|-------|-------|
| Owner / PM | Catherin Salazar |
| Célula | Growth Marketing |
| Proyecto HUB | GRO-003 — Mesa estratégica Lanzamientos |
| Fase del Launch System | `02_Launch_System` — preparación previa a la mesa estratégica |
| Estado global | 🔵 en diseño (v4 — juego estratégico funcional, pendiente validación del equipo) |
| Última actualización | 2026-09-07 |

## 0 · Resumen y estado global
Página HTML autocontenida (`dropi-mcp-brief.html`), rebautizada **"Operación:
MCP"**: un juego estratégico digital de preparación (no el taller en sí) para
que los participantes de la mesa estratégica del lanzamiento de MCP lleguen a
la sesión entendiendo el cambio de narrativa ("Dropi se adapta a ti"), por qué
está pasando ahora, dónde está el primer territorio (Huella Digital), a quién
le están diseñando la operación, el caso completo, y con una primera jugada
(hipótesis + experimento) ya construida.

**v4 (2026-09-07) cambió la mecánica, no solo el contenido**, a pedido de
Catherin: la experiencia dejó de ser "información → pregunta → siguiente
pantalla" para convertirse en un ciclo de juego real — **Tablero de Operación**
(hub con 8 misiones bloqueadas/disponibles/completadas + un panel "Estado de la
Operación" que se va llenando con las piezas que el participante consigue) →
**Misión** (escenario narrativo → desafío/decisión → consecuencia con feedback,
en algunos casos ramificado por opción → "jugada registrada" → desbloqueo de la
siguiente misión). Nombre del concepto en toda la experiencia: "Operación: MCP
— Diseña la jugada para hacer que Dropi se adapte a ti."

## 1 · Qué resuelve
Sin esto, el equipo llega a la mesa estratégica de MCP en blanco — o Product
Marketing resuelve la estrategia por ellos antes de la sesión. Este brief es el
"abrebochas": entrega contexto y datos primero, luego pide pensamiento — sin
cerrar la estrategia por anticipado. La v4 corrige además cómo se siente esa
preparación: en vez de leer y llenar, el participante decide, ve la consecuencia
de su decisión, y construye su jugada pieza por pieza.

## 2 · Alcance actual
**Construido (v4):**
- **Tablero de Operación** (hub): lista de 8 misiones con estado 🔒 bloqueada /
  ◉ disponible / ✓ completada (no se pueden saltar misiones), más el panel
  "Estado de la Operación" (Jugador, Problema, Territorio, Momento wow,
  Mensaje, Experimento) que pasa de `[pendiente]` a su valor real a medida que
  se completan misiones. Accesible en cualquier momento vía el botón "◈
  Tablero" del topbar.
- **Misión 01 — Descifra el cambio:** escenario narrativo, decisión A–D,
  consecuencia + revelación del contraste "tú te adaptas a Dropi" → "Dropi se
  adapta a ti", más la inteligencia "MCP no reemplaza el dashboard" y las
  capacidades `Por validar` (fusionadas aquí desde la extinta misión "MCP es el
  primer paso" de la v3).
- **Misión 02 — Descubre la razón:** dato de liderazgo (60–70 solicitudes
  mensuales, sin mencionar la cifra previa ni ninguna discrepancia); decisión
  A–D con **consecuencia ramificada por opción** (4 textos de feedback
  distintos, siguiendo el ejemplo exacto que dio Catherin en el brief).
- **Misión 03 — Descubre el territorio:** el participante apuesta primero
  dónde demostraría valor, luego se revela que el territorio real es Huella
  Digital (con nota de si coincidió o no, sin penalizar); interacción de
  escenario + campo `Oportunidad` ("algo que todavía no hemos imaginado").
- **Misión 04 — Encuentra al jugador:** grid de 9 segmentos del Core Target
  (2.946) ahora de **selección única** ("no puedes elegir a todos"), con
  justificación; decisión adicional Core Target vs. Universo Ampliado ("¿a
  quién le estás diseñando la operación?").
- **Misión 05 — Arma el caso:** 9 piezas clicables (público, tamaño, problema,
  JTBD, frecuencia, gravedad, alternativas, impacto, importancia estratégica)
  que se revelan una por una — reemplaza la radiografía estática de la v3 por
  una construcción activa; hay que revelar las 9 para continuar.
- **Misión 06 — Encuentra el wow:** elegir un solo "spark" de momento de valor
  y construirlo como situación + acción con MCP + por qué genera "esto me
  sirve" — más la fila de Copiloto de IA (futura, deshabilitada, con los
  verbos exactos del brief).
- **Misión 07 — Construye la jugada:** problema, valor y mensaje, con el
  jugador ya identificado mostrado como contexto fijo (no se vuelve a pedir).
- **Misión 08 — Ponla a prueba:** Hipótesis / Control / Tratamiento / Métrica
  (heredado de v3, sin ICE ni matriz de priorización — eso es del taller).
- **Operación completada:** resumen final (jugador, problema, territorio,
  momento wow, mensaje, experimento), "X/8 misiones completadas", cierre, y
  "Copiar mi jugada" al portapapeles.
- Persistencia: `localStorage` únicamente (clave `dropiMcpOperacion_v1`) — sin
  ninguna capability de Claude declarada (`capabilities: {}`), para que el link
  sea **público** y abra para cualquier persona con cuenta personal de Claude
  (ver Changelog para el porqué de este cambio).
- Identidad visual sin cambios respecto a v1–v3 (dark/naranja Dropi, grain, glow).

**Pendiente / por definir:**
- Confirmar con Product/Tech el alcance definitivo de las capacidades de MCP
  hoy marcadas `Por validar` antes de comunicarlas fuera de este brief.
- Definir la ventana temporal de Retención (funnel de adopción) con Product/Data.
- Sin base de datos compartida, Catherin no ve las respuestas centralizadas
  automáticamente — cada participante debe copiar y enviar su jugada (Slack,
  correo, o un formulario externo que se decida armar en paralelo).

## 3 · Archivos y links
- [`dropi-mcp-brief.html`](dropi-mcp-brief.html) — el artefacto completo (HTML+CSS+JS en un solo archivo), fuente de verdad del contenido.
- Artefacto visualizable: https://claude.ai/code/artifact/f443f3f8-9f9e-4fd6-b417-764a3b53a0f5 (público desde el menú "Share" → "Anyone with the link"; sin capabilities de Claude, así que no requiere estar en ninguna organización).

## 4 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Célula | Growth Marketing |
| Proyecto HUB | GRO-003 — Mesa estratégica Lanzamientos |
| Proyecto ancla del lab | GMR-001 (Product Growth Marketing Agent OS) |
| Relacionado | `Taller TARS/` (marco TARS usado también aquí), `02_Launch_System/Launch_Workflow.md` |

## 5 · Preguntas abiertas
- [ ] ¿Quién de Product/Tech confirma el alcance final de las capacidades `Por validar`? — responsable: Catherin
- [ ] ¿Se define ya la ventana de Retención o se deja abierta para el taller? — responsable: Catherin / Product-Data
- [ ] ¿Cómo se van a consolidar las jugadas de todos los participantes antes del taller (Slack, formulario, correo)? — responsable: Catherin
- [ ] ¿Cuándo se cuantifican Proveedores y Marcas Propias? Mientras tanto, `SUPPLIERS_COUNT` y `OWN_BRANDS_COUNT` quedan en `null` en el código y el universo total se muestra como "Por definir" — responsable: Catherin / Data

## 6 · Changelog
- 2026-09-07 — Construido de punta a punta en Claude (pantalla demo inicial validada primero, luego los 6 niveles completos), probado end-to-end por Catherin, y movido a `growth-marketing-lab/Lanzamientos Dropi/MCP/` como tercer artefacto de GRO-003.
- 2026-09-07 — Archivo renombrado de `dropi-mcp-mision.html` a `dropi-mcp-brief.html` ("Dropi MCP Brief"), a pedido de Catherin. La carpeta se probó momentáneamente como `Brief MCP/` y volvió a `MCP/` — nombre final: carpeta `MCP/`, archivo `dropi-mcp-brief.html`.
- 2026-09-07 — **Rearquitectura v2**, a pedido de Catherin, a partir de una conversación estratégica con Laura: cambio de narrativa central ("Dropi se adapta a ti" pasa de concepto preliminar a narrativa estratégica), reestructuración de 6 a 7 niveles, incorporación del dato de liderazgo (60–70 solicitudes/mes) sin reconciliar con la cifra previa, e introducción de Huella Digital como primer territorio. `localStorage` migrado a la clave `dropiMcpMision_v2` (progreso de pruebas anteriores con el esquema v1 queda descartado).
- 2026-09-07 — **Iteración v3**, a pedido de Catherin: se eliminó por completo la mención a la cifra sin reconciliar en el Nivel 02 (regla de curaduría — no exponer inconsistencias internas de documentación al participante); se creó el Nivel 06 "El Caso MCP" como radiografía consolidada (público, JTBD, gravedad, impacto, importancia estratégica, valor, TARS), moviendo ahí el bloque de medición que vivía en el antiguo Nivel 05; el nivel de experimento se amplió a Hipótesis/Control/Tratamiento/Métrica. Total de niveles: 7 → 8. `localStorage` migrado a la clave `dropiMcpMision_v3`.
- 2026-09-07 — Se activó la capability `db` de Claude para centralizar las respuestas del equipo, pero se descubrió en la práctica que **bloquea por completo compartir el artefacto** con cuentas personales de Claude (el equipo de Catherin no usa cuentas corporativas provistas por Dropi) — no existe forma de invitar personas individualmente a un artefacto con base de datos compartida. Se retiró `db`. Al intentar compartir públicamente, se confirmó que la capability `downloads` **también** bloquea el link público (mensaje de Claude: "this Artifact stores shared data and offers file downloads, so it can't be shared publicly") — se retiró también, y el botón "Descargar" se reemplazó por "Copiar al portapapeles" (`navigator.clipboard`, sin capability de Claude).
- 2026-09-07 — **Rearquitectura v4 — mecánica de juego**, a pedido de Catherin: la experiencia completa cambió de "información → pregunta → siguiente pantalla" a un ciclo real de juego (Tablero de Operación → Misión → escenario → decisión → consecuencia, con ramificación por opción en la Misión 02 → jugada registrada → desbloqueo). Concepto rebautizado a **"Operación: MCP"**. Se reordenaron las misiones (Huella Digital ahora antes de la selección de jugador), se creó el Tablero como hub con panel "Estado de la Operación", y Misión 05 pasó de tarjetas estáticas a piezas clicables. `localStorage` migrado a la clave `dropiMcpOperacion_v1`. Sin capabilities de Claude — el link es público.
- 2026-09-07 — Se agregó el botón "Enviar mi jugada por correo" en la pantalla final (`mailto:` con asunto y cuerpo prellenados hacia `catherin.salazar@dropi.co`) para que cada participante pueda enviar su jugada en un clic, sin necesidad de un formulario externo. Convive con "Copiar mi jugada" como respaldo.
- 2026-09-07 — **Corrección de datos contra el E2E**, a pedido de Catherin (el E2E de lanzamiento y seguimiento de MCP prevalece sobre datos de conversaciones anteriores): (1) la pieza "Frecuencia" en la Misión 05 pasó de "60–70 solicitudes mensuales" a "Diaria" — la cifra de 60–70/mes se conserva únicamente en la Misión 02, relabeleada explícitamente "Señal de demanda" (nunca "frecuencia"); (2) 2.946 dejó de presentarse como universo total — ahora es "Dropshippers cuantificados" en cada aparición, con Proveedores y Marcas Propias como "Por cuantificar" y el Universo Total como "Por definir"; (3) se agregó una tarjeta nueva "El universo completo del MCP" en la Misión 04; (4) MCP Adoption Rate ya no usa 2.946 como denominador fijo — queda como "% del universo objetivo", con nota "denominador por definir al consolidar Dropshippers + Proveedores + Marcas Propias"; (5) el problema y la acción de valor (conexión del conector de IA = activación, resultado de consulta exitosa = adopción) se alinearon textualmente al E2E. En el código se agregaron las constantes `DROPSHIPPERS_COUNT` (calculada desde `SEGMENTS`), `SUPPLIERS_COUNT` y `OWN_BRANDS_COUNT` (ambas `null` hasta tener cifras reales) y `totalTargetDisplay()`, para que el universo total se actualice solo con editar esas dos constantes, sin tocar el resto del artefacto.
- **Nota de transparencia:** al hacer esta corrección se encontró que el bloque explícito de TARS y la fórmula de MCP Adoption Rate habían quedado fuera del artefacto durante la rearquitectura v4 (se perdieron al reorganizar el contenido en misiones) — no fue un pedido de Catherin, fue un vacío detectado en el camino. Se reintrodujo, ya con los datos corregidos, dentro de la nueva tarjeta "Cómo mediremos el éxito" en la Misión 04.
