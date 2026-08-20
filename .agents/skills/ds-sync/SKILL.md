---
name: ds-sync
description: Aplica o actualiza el Dropi Design System real (tokens de dropi-prototypes/ds-registry/) en cualquier proyecto — Pulso, el hub, u otro repo nuevo. Lee los JSON de ds-registry en vivo en cada corrida, así que si los tokens cambian ahí, la próxima corrida de esta skill trae el cambio automáticamente — no hace falta editar la skill. Úsala cuando alguien pida "aplica el DS de Dropi a X", "sincroniza los estilos con ds-registry", "¿este proyecto sigue teniendo los tokens actualizados?", o al iniciar el theming de un proyecto nuevo.
user-invocable: true
argument-hint: "[ruta del proyecto destino, default: el proyecto actual]"
---

Aplica los tokens reales del Dropi Design System (`dropi-prototypes/ds-registry/`) a un proyecto destino, generando las variables de tema (CSS vars, SCSS, o el sistema que use el stack) a partir de la fuente de verdad — nunca copiando valores a mano de memoria ni de una corrida anterior.

## Fuente de verdad

`/Users/macdropi/Documents/dropi-prototypes/ds-registry/` tiene **dos arquitecturas conviviendo**:
- `ds-registry/new/` (`architecture: "new"`, v2.0) — tokens (`new/tokens/*.json`). `new/components` está vacío a la fecha de esta skill: sin specs de botón/input/card/etc.
- `ds-registry/` raíz (= `ds-registry/old/`, v0.2.0) — tokens en `tokens/*.json` **y** 19 specs de componentes en `components/*.json` (dropi-button, dropi-sidebar, dropi-header, dropi-modal, etc.), cada uno con `designRules` explícitos (ej. "Sidebar is white background, NOT dark").

**Siempre releer estos archivos al momento de correr la skill**, nunca asumir los valores de una sesión anterior — pueden haber cambiado. Si `new/components` ya no está vacío cuando corras esto, avísalo: significa que la migración a la arquitectura nueva avanzó.

## Pasos

1. **Detectar qué arquitectura usar.**
   - Lee `ds-registry/index.json` y `ds-registry/new/index.json` para confirmar versiones vigentes.
   - Si no es obvio cuál es la vigente (por ejemplo si ambas carpetas siguen existiendo y ninguna está marcada como deprecada), pregunta a la persona en vez de asumir — igual que se hizo la primera vez que se aplicó esto a Dropi Pulso.
   - Si se eligió `new/` y necesitas specs de componentes (no solo tokens), avisa que esa parte solo existe en la versión vieja todavía.

2. **Leer los tokens de la arquitectura elegida:** `colors.json`, `typography.json`, `radius.json`, `spacing.json`, `shadows.json`. No hardcodear valores — leerlos del archivo en cada corrida.

3. **Detectar el stack del proyecto destino** antes de mapear nada:
   - Next.js/React con Tailwind v4 + shadcn → CSS vars en `globals.css` dentro de `:root` y `@theme inline` (ver `Dropi pulso/src/app/globals.css` como referencia de un mapeo ya hecho).
   - Angular (como `dropi-prototypes` mismo) → variables SCSS en `src/styles/_variables.scss`.
   - Otro stack → preguntar cómo se manejan tokens de tema ahí antes de inventar una convención.

4. **Mapear tokens → variables del proyecto**, con esta correspondencia semántica (ajustar nombres exactos al stack detectado):
   - `primary.500` → `--primary` / `$primary`, `primary-foreground` blanco.
   - `secondary.500` → `--secondary`.
   - `gray.50` → fondo general (**a menos que el proyecto pida explícitamente algo distinto** — confirmar con la persona, no asumir "gris claro" como default silencioso; en Dropi Pulso terminó siendo blanco puro por decisión explícita, no por el DS).
   - `gray.900` → texto principal.
   - `gray.100` → `--border` / `--input` / `--muted`.
   - `success/warning/error/info` → semánticos + `--destructive` = `error.500`.
   - `radius` tokens → `--radius-*` (ojo: la arquitectura `new` no tiene `pill`/`full`/`circle`; si el proyecto los necesita, decirlo en vez de inventar un valor).
   - `shadows` tokens → variables `--shadow-ds-*`, no reemplazar automáticamente las sombras de shadcn/Tailwind si el proyecto ya las usa para otra cosa.
   - Tipografía → cargar la fuente real (`Inter` vía `next/font/google` en Next.js, `@font-face`/Google Fonts link en otros stacks). No dejar fuentes del sistema si el DS especifica una fuente concreta.

5. **Antes de escribir nada:** si el cambio afecta look-and-feel visible (colores de marca, fondo general, tipografía), mostrar el mapeo propuesto y confirmar con la persona — esto es un cambio de diseño grande, no un refactor mecánico. No aplicar fondos oscuros, paletas alternativas, ni ninguna decisión que no esté en los JSON de `ds-registry` sin confirmarlo explícitamente primero.

6. **Marcar explícitamente cualquier `designRule` del componente que el pedido de la persona contradiga** (ej. si piden sidebar oscuro y el registry dice "NOT dark") — decirlo, no aplicarlo en silencio ni negarse en silencio; la decisión final es de la persona, pero debe tomarla informada.

7. **Verificar que el proyecto sigue compilando** después del cambio (`tsc --noEmit`, `ng build --configuration=development`, o el check equivalente del stack) antes de reportar terminado.

8. **Reportar el diff aplicado** de forma explícita: qué token de qué archivo de `ds-registry` se usó para qué variable del proyecto, y qué quedó pendiente de confirmar o fuera de alcance (ej. specs de componentes si se usó `new/`).

## Qué NO hace esta skill

- No copia valores de tokens "de memoria" — siempre relee los JSON de `ds-registry` en la corrida actual.
- No decide sola entre arquitectura `new`/`old` si ambas existen y no está claro cuál es la vigente — pregunta.
- No aplica decisiones de diseño que no vengan ni de `ds-registry` ni de una instrucción explícita de la persona (ej. fondo oscuro, paleta alterna).
- No inventa componentes/specs que no existen en la arquitectura elegida.
