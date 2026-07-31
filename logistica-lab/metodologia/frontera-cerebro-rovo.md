# Frontera cerebro ↔ Rovo (agentes de Atlassian)

> **Decisión del 14-jul-2026.** Qué vive en el cerebro (este repo) y qué se delega a un
> agente de Rovo Studio. Se escribe para que la respuesta a *"¿montamos esto en Rovo?"*
> no se re-discuta en cada chat.

## Principio rector
- **El cerebro piensa. Rovo ejecuta.**
- **Cerebro** = donde se acumula criterio: discovery, metodología, memoria entre sesiones,
  síntesis de datos, cualquier cosa que produzca un spec/épica/decisión.
- **Rovo** = brazo automático dentro de Jira/Confluence: tareas **acotadas, repetitivas,
  sin criterio**, que se disparan solas y que el equipo consume **sin pasar por Juan**.

## La regla que evita que esto se pudra
**Rovo NUNCA es dueño de una definición.**
Si el Definition of Ready vive en `metodologia/product-logistics.md` **y también** dentro de
las instrucciones de un agente de Rovo, en 3 meses hay dos versiones y ninguna es la buena.

→ **Un solo origen (este repo) → una copia derivada.** El agente de Rovo apunta a una página
de Confluence publicada **desde** el repo; no reescribe la definición en su prompt.
Si cambia la metodología: se cambia en el repo → se republica la página → el agente hereda.

## Reparto

| | **Cerebro (repo)** | **Rovo** |
|---|---|---|
| Discovery, specs, épicas, historias | ✅ | ❌ |
| Metodología / DoR / DoD (dueño) | ✅ | ❌ (solo la lee) |
| Memoria entre sesiones (`ESTADO.md`) | ✅ | ❌ (no tiene) |
| Síntesis de datos, criterio | ✅ | ❌ |
| Triage repetitivo de tickets | ❌ | ✅ |
| Triggers automáticos (ticket nuevo, comentario) | ❌ | ✅ |
| Consumo por el equipo sin Juan en el loop | ❌ | ✅ |

## Por qué NO migrar el cerebro a Rovo
El wizard de Rovo Studio ofrece lo mismo en apariencia (instrucciones + conocimiento +
skills), pero pierde tres cosas que aquí ya funcionan:
1. **Memoria persistente y versionada** (`ESTADO.md` + git). Rovo no acumula criterio entre sesiones.
2. **Skills como metodología real** (`discovery`, `control-entrega`, `epica`…), no un prompt de 200 palabras.
3. **Acceso multi-fuente** (Drive, Gmail, Calendar, Figma, Jira, repo) en una sola conversación.
   Rovo vive encerrado en Atlassian.

Lo que Rovo sí aporta y el cerebro no puede: **distribución** (vive en Jira, lo usa el equipo)
y **triggers automáticos** (se dispara sin abrir un chat).

## Qué NO se le delega a Rovo (guardarraíl)
Nada que produzca un **spec, una épica o un discovery**. Eso necesita memoria y criterio;
sin ellos Rovo genera basura con confianza — **peor que no generar nada**, porque alguien la
toma por buena y entra al backlog.

## Piloto acordado (uno solo, medido)
**Agente de triage de STID.** Ticket nuevo → comenta qué campos faltan según el DoR.
Alto volumen · cero criterio · valor inmediato para el equipo.

- **Criterio de éxito:** en 2 semanas, ¿los tickets de STID llegan más completos?
- **Si no mueve la aguja → no se escala.** No se agregan más agentes "por si acaso".
- **Candidato #2 (solo si el #1 funciona):** higiene en PRM — épica sin problema raíz o sin
  métrica definida → comenta. Es el "ser duro con los proyectos" automatizado.

## Estado
🟡 **Decisión tomada, piloto sin arrancar.** Pendiente: publicar el DoR en Confluence desde
el repo (origen único) y crear el agente de triage en Rovo Studio.
