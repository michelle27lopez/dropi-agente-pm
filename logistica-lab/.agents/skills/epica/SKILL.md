---
name: epica
description: Usar cuando Juan pide crear, redactar o describir una épica de Dropi para Jira. Se dispara con "crea la épica de", "dame la descripción de la épica", "describe la épica para", "estructura esta iniciativa como épica".
---

# Crear épica (formato oficial Dropi)

## Objetivo
Generar la descripción completa de una épica lista para pegar en Jira, en el formato oficial.

## Instrucciones
1. Lee el **formato oficial de épica** en `agente-delivery/canon/dropi_methodology.md` §Épica (única fuente de las secciones) + `metodologia/jira-formatos.md` (sigla vs. project key PRM/STID y reglas de la ley) antes de generar.
2. Si el proyecto existe en `proyectos/<x>/spec.md`, **léelo y úsalo como fuente** — respeta su estado+fuente. No contradigas el spec (regla de dirección de `spec-driven.md`).
3. Si falta contexto, **pregunta** (no asumas — ver `feedback-no-asumir-preguntar`):
   - Sigla de producto (DROPI / DROPI APP / ADMIN / CAS) y project key de Jira (PRM/STID/…)
   - Nombre de la iniciativa, país, usuarios afectados
   - Problema que resuelve (contexto)
4. Genera la épica con TODAS las secciones del formato oficial:
   - **Título:** `[Sigla]: [Nombre]_[País]_[Usuarios afectados]`
   - **Contexto** (problema, por qué importa, a quién afecta, datos que lo justifican)
   - **¿Qué buscamos?** (qué lograr + fases con bloqueantes y entregable por fase)
   - **Criterios de éxito** (métricas + público objetivo)
   - **Documentación** (Kickoff, flujo, Figma, docs — links reales o placeholder)
5. Presenta como **borrador** para que Juan confirme antes de crear el ticket.
6. Si Juan aprueba y quiere crearlo en Jira, primero verifica la cuenta con `atlassianUserInfo` (regla de `CLAUDE.md`), luego `createJiraIssue`.

## Restricciones
- Nunca inventar métricas/datos → `[métrica por definir]`, `[por confirmar]`.
- Sin contexto del problema, no generar: preguntar.
- Título EXACTAMENTE en el formato.
- Responder en español, directo y conciso.
