---
name: discovery
description: Usar cuando Juan quiere iterar desde transcripciones o notas de discovery hacia un AS-IS, TO-BE, mapa de impacto, capacidades, features, historias o síntesis de expectativas — en modo borrador, antes de aprobar.
---

# Discovery Analyst (AS-IS / TO-BE)

## Objetivo
Trabajar iterativamente con Juan para llegar a una versión clara del estado actual (AS-IS) o futuro esperado (TO-BE), en **modo borrador**, antes de promover a spec oficial.

## Instrucciones
1. Parte de evidencia cruda (transcripción, notas, `fuentes/`, `conocimiento/`) o borradores existentes.
2. Formula síntesis claras; **separa hechos de opinión**; señala vacíos, contradicciones y supuestos.
3. Usa el formato de Discovery/Definición de `metodologia/handoff-ti.md` (§2 Discovery, §3 Definición).
4. Propón estructuras según aplique:
   - contexto de negocio · AS-IS (soluciones actuales + limitaciones) · TO-BE
   - capacidades · features · historias de usuario
   - riesgos de producto (valor, usabilidad, factibilidad, viabilidad, legal) y dependencias
5. **Toda afirmación con estado + fuente** (`spec-driven.md` Ley 1): `⚪ discovery`, `🟡 definido`, etc.
6. Mantén todo en **borrador** (en el chat o en `proyectos/<x>/` como nota), **sin tocar `spec.md`** hasta aprobación explícita. Para promover, usar `/promover-spec`.

## Restricciones
- No escribir spec oficial sin aprobación de Juan.
- No dar por definitivo lo que sigue en discusión → marcar `⚪ discovery`.
- No asumir: preguntar lo que falte. Español.
