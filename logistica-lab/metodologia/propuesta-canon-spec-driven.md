# Propuesta al canon compartido — trazabilidad y gate de realidad

> **Estado:** 🟡 propuesta · **Para:** Jaime Guevara (dueño del canon) · **De:** Juan Bautista
> (Logistic Success) · **Fecha:** 21-jul-2026
>
> **Esto no es un cambio hecho.** Es lo que propongo llevar de la ley de logística al canon
> compartido, para que lo discutamos en el PR. Mientras no se acuerde, la ley sigue viviendo
> solo en `logistica-lab/metodologia/spec-driven.md` y aplica solo a logística.

## Qué resolvió el empalme (contexto)

Al entrar logística a Darwin aparecieron **tres duplicaciones** del mismo material entre
`logistica-lab/` y `agente-delivery/canon/`. Dos ya se resolvieron a favor del canon:

| Duplicado | Resolución |
|---|---|
| Formatos de épica/historia/subtarea (`jira-formatos.md` ↔ `dropi_methodology.md`) | Secciones **equivalentes**. Gana el canon; `jira-formatos.md` quedó como puente con lo específico de PRM/STID |
| Documento corporativo del semestre (`marco-comun-2026-s2.md` ↔ `dropi_base_semestral_2026.md`) | El canon es más completo (10 células, 7 roles de KPI). Gana el canon |
| **Ley spec-driven** (`spec-driven.md`) | **Sin equivalente en el canon** → es lo que se propone abajo |

Las 10 skills de logística eran 1:1 con 10 de las 12 de `agente-delivery` (mismos triggers,
mismo output). Ya apuntan al canon como fuente de secciones.

## Lo que se propone añadir

El canon define **qué secciones** tiene cada documento. No define **cómo se sabe si lo escrito
es cierto**. Eso es lo que aporta la ley de logística, y es independiente del vertical.

### 1. Estado + fuente en cada afirmación

Ninguna afirmación entra a un documento sin estado y fuente rastreable:

```
afirmación   [<estado> · fuente: <tipo>:<ref> · <fecha>]
```

Estados: ⚪ discovery (explorado, no decidido) · 🟡 definido (cumple Definition of Ready) ·
🔵 en diseño · 🟢 construido **y verificado** · ⛔ descartado / no-objetivo.
Tipos de fuente: `figma:` · `jira:` · `screenshot:` · `data:` · `reunion:` · `doc:` · `drive:`.

**Por qué al canon:** hoy `dropi_methodology.md` §Épica pide "datos relevantes que justifiquen
la solución" sin exigir de dónde salen. Un dato sin fuente sobrevive meses y se cita como
verdad. Esto es transversal — le pasa igual a suppliers, brands y sellers.

### 2. Cero placeholders

Cada campo es un valor real con fuente, o `N/A — <razón>`. Nunca texto de plantilla
("Actor 1: rol y qué hace", "[DD/MM/AAAA]"). Un placeholder es un campo no revisado
disfrazado de campo completo.

**Por qué al canon:** complementa directamente los *Checklists de Calidad* de
`e2e_methodology.md` §Apéndice, que hoy verifican que la sección exista, no que esté resuelta.

### 3. Gate de realidad antes del hand-off

Antes de exportar un E2E o entregar a desarrollo:

- [ ] Cada afirmación tiene estado + fuente
- [ ] Ningún placeholder (valor real o `N/A — razón`)
- [ ] Lo marcado 🟢 está verificado contra Figma o el build — **no contra el documento**
- [ ] Los no-objetivos (⛔) están explícitos
- [ ] Cifras consistentes (no dos números para el mismo KR)
- [ ] Trazabilidad completa: Jira + Figma + datos enlazados

**Por qué al canon:** es el punto donde un documento pasa a costar tiempo de desarrollo. El
`delivery-controller` de `agente-delivery` ya audita los checklists del E2E cuando
`requires_e2e_format = true`; este gate le daría un criterio verificable de "está construido"
en vez de "está escrito".

### 4. Regla de dirección

El flujo va en un solo sentido: **la ley manda sobre el spec; el spec manda sobre el documento
E2E.** Si el documento afirma algo que no está en el spec, es un bug y se corrige hacia el
spec — nunca al revés.

**Por qué al canon:** sin esto, el documento que se comparte se vuelve la fuente de verdad de
facto, y el spec queda desactualizado en dos semanas.

## Lo que NO se propone

No todo lo de logística debe subir al canon. Se queda en `logistica-lab/`:

- **`product-logistics.md`** — el filtro de la célula: cadena de valor de la orden, North Star
  (movilización + % de entrega), KPI de tiempo por fases. Es del vertical, no del área.
- **Convenciones de PRM/STID** y la distinción sigla-de-producto vs. project-key.
- **`handoff-ti.md`** y `requisitos-doc-e2e.md` — reglas de contenido propias de cómo Juan
  redacta el Kick-off y el Hand-off, ya derivadas del `e2e_methodology.md` del canon.

## Aporte suelto, aparte de esto

`dropi_base_semestral_2026.md` dice "fuente oficial compartida por la dirección de producto",
pero **no enlaza el original ni nombra a la autora**. El original es
[Confluence 1484292098](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1484292098), de
**Maria Ossa**. Ese dato solo existía en la copia de logística. Sin trazabilidad al original,
un canon es indistinguible de una transcripción vieja — que es justo el problema que la
propuesta 1 intenta resolver.
