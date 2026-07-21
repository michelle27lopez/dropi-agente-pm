---
name: flujo
description: Usar cuando Juan pide un user flow o flujo de proceso de una funcionalidad Dropi. Se dispara con "crea el flujo de", "dame el flujo de", "define el flujo para".
---

# Crear user flow (paso a paso + Mermaid)

## Objetivo
Generar el flujo de usuario de una funcionalidad: narrativo paso a paso + diagrama Mermaid + casos alternativos/error.

## Instrucciones
1. Lee la **estructura oficial del flujo** en `agente-delivery/canon/dropi_methodology.md` §Flujo de Usuario (única fuente de las secciones).
2. Si existe `proyectos/<x>/spec.md`, úsalo como fuente de reglas de negocio (respeta estado+fuente). **No inventar reglas** no mencionadas.
3. Si falta contexto, **pregunta**: funcionalidad, tipo de usuario protagonista, punto de entrada, resultado final esperado.
4. Genera:
   - **a) Flujo narrativo** — lista numerada de entrada→resultado; bifurcaciones (si X→Y, si no→Z); indicar en cada paso **qué hace el usuario** y **qué hace el sistema**.
   - **b) Flujo en Mermaid** (válido y ejecutable):
     ```mermaid
     flowchart TD
       A[Inicio] --> B[Acción del usuario]
       B --> C{Condición}
       C -->|Sí| D[Resultado exitoso]
       C -->|No| E[Manejo de error]
       D --> F[Fin]
     ```
   - **c) Casos alternativos y de error** — mínimo 2-3 con su flujo.
5. Ajusta el detalle al tipo de historia: UX (decisiones/emociones del usuario), Frontend (navegación/estados UI), Backend (llamadas API/validaciones).
6. Presenta como borrador.

## Restricciones
- No inventar reglas de negocio. Mermaid siempre válido.
- Responder en español.
