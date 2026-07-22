# Metodología Spec-Driven — la LEY (Logistic Success)

> La **constitución** del trabajo de producto. Reglas no-negociables que aplican a **todos**
> los proyectos. Nacen para evitar dos errores: (1) relleno genérico de plantilla que parece
> real, y (2) documentar como construido algo que es solo discovery/intención.
> El spec de cada proyecto y su documento E2E **deben obedecer** esta ley.

## Las 3 capas (de qué se compone todo)
```
LEY (interna, repo)  →  SPEC del proyecto (interno, repo)  →  DOCUMENTO E2E (Drive)  →  se comparte
```
| Capa | Qué es | Dónde vive | Manda sobre |
|------|--------|-----------|-------------|
| **Ley** | Reglas globales no-negociables (este archivo + `product-logistics.md`) | `metodologia/` | Todos los specs |
| **Spec de proyecto** | Verdad interna de UN proyecto (estado+fuente, reglas, trazabilidad) | `proyectos/<x>/spec.md` | Su documento E2E |
| **Documento E2E** | Entregable formateado para TI/stakeholders, **derivado** del spec | Google Drive | — |
| **Drive** | Biblioteca: documentos + Figma + prototipos + Excel + data | Google Drive | (almacén) |

**Regla de dirección (la más importante):** el flujo va en **un solo sentido**. El documento
obedece al spec; el spec obedece a la ley. Si el documento afirma algo que no está en el spec,
es un **bug** y se corrige hacia el spec — nunca al revés.

## Ley 1 — Estado + Fuente en CADA afirmación
Ninguna afirmación entra a un spec sin **estado** y **fuente**. Formato estándar:
> `afirmación   [<estado> · fuente: <tipo>:<ref> · <fecha opcional>]`

### Estados (leyenda fija — usar siempre estos emojis)
| Emoji | Estado | Significa |
|-------|--------|-----------|
| ⚪ | discovery | explorado, no decidido |
| 🟡 | definido | decidido, listo para construir (cumple Definition of Ready) |
| 🔵 | en diseño | en Figma / prototipo |
| 🟢 | construido | está en el build/diseños **y verificado** |
| ⛔ | descartado / no-objetivo | explícitamente fuera de alcance |

### Tipos de fuente (fija)
`figma:<link/nodo>` · `jira:<KEY>` · `screenshot:<archivo>` · `data:<tabla.campo o query>` · `reunion:<fecha>` · `doc:<nombre>` · `drive:<archivo>`

> Ejemplo: `R1 · COD = MAX(%, mínimo)  [🟢 construido · fuente: screenshot:parametrizar-tarifas + doc:E2E §1.5]`
> Ejemplo: `Mercancía Industrial (tabla O-D)  [⚪ discovery · fuente: doc:E2E §1.3 · NO en Figma]`

## Ley 2 — Cero placeholders
Cada campo es **un valor real (con fuente)** o **`N/A — <razón>`**. Nunca texto de plantilla
("Actor 1: rol y qué hace", "Regla 1: condición…", "[DD/MM/AAAA]"). Un placeholder = campo no revisado.

## Ley 3 — Gate de realidad (antes de marcar 🟢 o de hacer hand-off)
Nada se marca **🟢 construido** si no está en los **diseños/build**. Antes de exportar el documento
E2E o entregar a TI, correr el checklist:
- [ ] Cada afirmación tiene estado + fuente.
- [ ] No queda ningún placeholder (todo es valor real o `N/A — razón`).
- [ ] Lo marcado 🟢 está verificado contra Figma o el build (no contra el doc).
- [ ] Los **no-objetivos (⛔)** están explícitos (lo que NO se hace).
- [ ] Cifras consistentes (sin dos números para el mismo KR/dato).
- [ ] Trazabilidad completa: Jira + Figma + datos enlazados.

## Ley 4 — Definition of Ready / Done (de `product-logistics.md`)
No pasa a diseño/dev sin: problema raíz · hipótesis de valor · métrica con línea base ·
**definición de datos cerrada antes de la UI** · dependencias · preguntas abiertas listadas.
No se da por hecho sin: métrica medida post-lanzamiento · adopción verificada · próximos pasos con datos.

## Ley 5 — Toda iniciativa mueve una NSM
Cada proyecto se ata a ≥1 North Star (⬆️ movilización · ⬆️ % entrega · ⏱️ tiempo por fases) o a
una métrica operativa (costo por orden, devolución, novedades…). Si el vínculo es indirecto, **decirlo**.

## Ley 6 — No asumir; preguntar todo (regla de Juan)
Lo que no esté confirmado por **fuente** NO se decide por el agente. Separar siempre lo **sourced**
(real, con fuente) de lo **propuesto/asumido**; lo propuesto va a un bloque **"Pendiente de
confirmar"** y se pregunta a Juan antes de cerrarlo. Aplica a OKR/KR, metas/baseline, riesgos,
alcance y cualquier cifra. Mejor preguntar de más que asumir.

**No dejar inconsistencias colgando (23-jun):** si algo **no cuadra** (cifras contradictorias, datos
faltantes, decisiones abiertas), NO se entierra en "pendientes/hallazgos" y se sigue. Se **señala
explícitamente**, se le dice a Juan para resolverlo, y se asigna **responsable**. Resolverlo es
mejor que dejarlo anotado. Toda inconsistencia detectada se sube a Juan, no se silencia.

## Ley 7 — Mantener la arquitectura del documento
"Básico" / "límpialo" = **contenido limpio y conciso, NO quitar secciones**. El documento E2E
conserva su arquitectura estándar (9 fases + apéndice). No colapsar, fusionar ni renumerar la
estructura. Las secciones que no son de Producto (o que llena TI) se dejan presentes y marcadas,
no se eliminan. Recordar [[e2e-doc-roles]]: Juan (PM) llena **Kick-off** y **Hand-off**; el resto
es del Product Designer — no rellenar las secciones del PD con supuestos.

## Estructura estándar del spec (todos idénticos)
Toda `proyectos/<x>/spec.md` sigue **exactamente** `proyectos/_PLANTILLA-spec.md`:
encabezado (metadata) · 0 Resumen+estado global · 1 Problema raíz · 2 Hipótesis+métrica/NSM ·
3 Usuarios/actores · 4 Alcance (por estado) + **no-objetivos** · 5 Reglas de negocio numeradas ·
6 Criterios Gherkin · 7 Datos (diccionario) · 8 Trazabilidad (Jira/Figma/Drive/doc) ·
9 Preguntas abiertas (con responsable) · 10 Changelog.

## Cómo se opera (flujo)
1. **Nace un proyecto** → copiar `_PLANTILLA-spec.md` a `proyectos/<x>/spec.md`.
2. **Se llena con estado+fuente** (Ley 1) y cero placeholders (Ley 2). Lo que no se sabe → ⚪ o `N/A`.
3. **Antes de construir** → Gate DoR (Ley 4).
4. **Antes de entregar a TI** → Gate de realidad (Ley 3) + se **genera el documento E2E** desde el spec.
5. **El spec es vivo**: cada cambio actualiza estado/fuente y el changelog (§10).

> El spec es **upstream** de Jira, Figma y el doc E2E. Si el doc y el spec difieren, gana el spec.
