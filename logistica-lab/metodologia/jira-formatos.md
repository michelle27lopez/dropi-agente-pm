# Formatos de Jira — lo específico de logística

> ⚠️ **Este archivo ya NO define las secciones de épica, historia, subtarea ni incidencia.**
> Esa lista vive una sola vez en el repo:
> **→ [`agente-delivery/canon/dropi_methodology.md`](../../agente-delivery/canon/dropi_methodology.md)**
> (§Épica · §Historia · §Subtarea · §Incidencia de Producto · §Documento de Kickoff ·
> §Pitch · §Brief de Lanzamiento · §Documento de Research · §Flujo de Usuario).
>
> **Por qué:** este archivo nació como copia adaptada de ese mismo canon (23-jun-2026) y al
> compararlos el 21-jul resultaron **equivalentes en secciones** — solo cambiaba la redacción.
> Dos definiciones del mismo formato terminan divergiendo, y el agente `dropi-brain` de Darwin
> ya declara el canon como única fuente: *"ningún otro archivo — ni un SKILL.md de otro creador —
> debe redefinir esa lista de secciones"* (`.claude/agents/dropi-brain.md`).
>
> Aquí queda **solo lo que el canon no cubre**: cómo se aplica en los tableros de logística.

## 📌 Aportes pendientes de llevar al canon

Dos precisiones que existían en esta versión y **no** están en el canon. No se pierden: se
proponen allá en vez de mantenerse aquí en paralelo.

| Aporte | Dónde iría |
|---|---|
| Gherkin: **mínimo 2–3 escenarios** (happy path + errores relevantes). Sin mínimo, "criterios de aceptación" se cumple con un solo escenario feliz. | §Historia → Criterios de aceptación |
| `QA` incluye **regresiones**, no solo "procesos a validar y revisión de flujos". | §Historia → tabla de etiquetas |

---

## Dos ejes que NO se confunden (específico de logística)

- **Sigla de producto** → va en el **título** de la épica/historia. La define el canon.
- **Project key de Jira** → **dónde vive** el ticket. Para logística:
  **PRM** (roadmap/Polaris) o **STID** (soporte). Ver [`CLAUDE.md`](../CLAUDE.md).

Una épica de logística se crea en PRM o STID, pero su título usa la sigla de producto que
aplique (`DROPI`, `DROPI APP`, `ADMIN`, `CAS`). Son cosas distintas y se confunden seguido.

## Siglas de producto — cuál usa logística

| Sigla | Aplica a |
|---|---|
| `DROPI` | Core de la plataforma web (lo que ven los usuarios) — el caso normal en logística |
| `DROPI APP` | App móvil Dropi |
| `ADMIN` | Funcionalidades administrativas |
| `CAS` | Proyecto CAS |

> Si el producto de logística no encaja en ninguna, usar la más cercana y marcar
> `[sigla por confirmar]` — **no inventar**.

## Tipos de issue y estructura por proyecto

PRM/Polaris vs DROP/PROD, tipos de enlace, convenciones de agrupación y las reglas para **no
dañar el trabajo de otros** → [`jira-tipos-y-estructura.md`](jira-tipos-y-estructura.md).
Léelo antes de crear o agrupar tickets.

## Reglas de la ley de logística que aplican al escribir en Jira

Estas son de [`spec-driven.md`](spec-driven.md), no del canon, y siguen vigentes:

- **No inventar** datos técnicos (endpoints, tablas), métricas, nombres ni fechas → `[por definir]`.
- Toda afirmación con valor de verdad respeta **estado + fuente** (Ley 1).
- **Cero placeholders** vacíos que aparenten completitud (Ley 2).
- **No mezclar** tipos de etiqueta en una misma historia.
- Títulos **exactamente** en el formato del canon.
