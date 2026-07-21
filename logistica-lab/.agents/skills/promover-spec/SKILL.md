---
name: promover-spec
description: Usar cuando Juan APRUEBA explícitamente un borrador y quiere promoverlo a oficial — al spec del proyecto, al doc E2E o al canon. Se dispara con "aprueba esto", "promueve a spec/oficial", "guarda como vigente", "esta es la nueva versión".
---

# Promover borrador a oficial (canon keeper)

## Objetivo
Mover contenido **aprobado por Juan** a memoria oficial (spec del proyecto / metodología / conocimiento) sin perder histórico ni romper la ley.

## Cuándo actuar
SOLO con aprobación explícita ("aprueba", "publica", "promueve a canon", "esta es la versión vigente"). Si Juan está en modo "propón/analiza/itera/todavía no publiques" → **NO promover**, dejar en borrador (`conversation_rules` del repo original; aquí: `spec-driven.md`).

## Instrucciones
1. Identifica el destino oficial:
   - Verdad de UN proyecto → `proyectos/<x>/spec.md`
   - Regla global → `metodologia/`
   - Conocimiento destilado → `conocimiento/` (citando fuente + fecha)
2. **Respeta la regla de dirección** (`spec-driven.md`): el flujo va en un sentido — la ley manda sobre el spec, el spec sobre el doc E2E. No promover algo que contradiga la ley.
3. Cada afirmación entra con **estado + fuente** (Ley 1): `afirmación  [<estado> · fuente: <tipo>:<ref> · <fecha>]`.
4. **Versiona, no borres:** si reemplazas una afirmación previa, marca la anterior como superada (`⛔ descartado` o nota de reemplazo) — no la elimines en silencio. No borrar estructura automáticamente.
5. **No recortar contenido real** (`requisitos-doc-e2e.md`): condensar perdiendo detalle real = error.
6. Tras promover, actualiza el rastro de continuidad: `ESTADO.md` (dónde vamos, decisión, fecha) y `planning/todos.md` si aplica. Nada queda solo en el chat.
7. Reporta a Juan: qué se promovió, a qué archivo, qué quedó superado.

## Restricciones
- Nunca publicar sin aprobación explícita.
- Nunca contradecir la ley ni el spec con un doc derivado.
- Español, conciso.
