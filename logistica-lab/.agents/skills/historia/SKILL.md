---
name: historia
description: Usar cuando Juan pide crear historias de usuario (HU) para Dropi. Se dispara con "dame las historias de UX/UI/frontend/backend/DBA/QA/legal/lanzamiento de", "crea las historias para [épica]".
---

# Crear historia de usuario (formato oficial Dropi, con Gherkin)

## Objetivo
Generar HUs en el formato oficial de Dropi para cualquier etiqueta (UX, UI, Frontend, Backend, DBA, QA, Legal, Lanzamiento), listas para Jira.

## Instrucciones
1. Lee el **formato oficial de historia** en `agente-delivery/canon/dropi_methodology.md` §Historia (tabla de etiquetas, tipos de usuario, Gherkin, DoD) + `metodologia/jira-formatos.md` (lo específico de logística).
2. Identifica la(s) etiqueta(s) pedida(s). **No mezclar etiquetas** en una misma historia.
3. Si existe `proyectos/<x>/spec.md`, úsalo como fuente (respeta estado+fuente). Si no hay contexto de la épica, **pídelo** (no asumir).
4. Por cada historia genera:
   - **Título:** `[Etiqueta] [Sigla]: [Nombre descriptivo]`
   - **Historia:** `Como [usuario], Puedo [acción], Para [resultado].` (usuario de la lista válida)
   - **Descripción del proceso**
   - **Flujo del usuario** (paso a paso; diagrama si aplica — puede invocar `/flujo`)
   - **Criterios de aceptación (Gherkin, OBLIGATORIO):** mínimo 2-3 escenarios (happy path + errores)
     ```
     Escenario: [Nombre]
       Dado que [precondición]
       Cuando [acción]
       Entonces [resultado esperado]
     ```
   - **Condiciones adicionales** (versión design system, nuevo/rediseño, resoluciones)
   - **Definición de Hecho (DoD)**
5. Agrega solo las secciones relevantes a la etiqueta (ver tabla de etiquetas en `agente-delivery/canon/dropi_methodology.md` §Historia).
6. Presenta como **borrador** para revisión.

## Restricciones
- Gherkin obligatorio. Título exacto `[Etiqueta] [Sigla]: Nombre`.
- No inventar endpoints, tablas ni datos técnicos sin base en el contexto → `[por definir]`.
- Responder en español, directo.
