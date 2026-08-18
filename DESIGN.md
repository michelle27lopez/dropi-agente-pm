---
name: Dropi PM Tools Hub
description: Hub interno de prototipos para Supplier Success — precisión sobre decoración.
colors:
  dropi-orange: "#FF6102"
  dropi-orange-tint: "#FFF3E0"
  success-green: "#10B981"
  warning-amber: "#F59E0B"
  danger-red: "#EF4444"
  info-blue: "#3B82F6"
  neutral-bg: "#F8F9FA"
  neutral-card: "#FFFFFF"
  neutral-border: "#E5E7EB"
  neutral-ink: "#111827"
  neutral-muted: "#6B7280"
  gray-50: "#F0F4F9"
  gray-100: "#E9EEF5"
  gray-200: "#C3C9D9"
  gray-300: "#A3ABBF"
  gray-400: "#858EA6"
  gray-500: "#69738C"
  gray-600: "#475066"
  gray-700: "#32394D"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  content-x: "32px"
  content-y: "16px"
components:
  button-primary:
    backgroundColor: "{colors.dropi-orange}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "#DB4E00"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: Dropi PM Tools Hub

## 1. Overview

**Creative North Star: "El Taller de Prototipos"**

Este hub es donde el equipo de Supplier Success construye, en código real, los flujos que luego se convierten en producto Dropi. No es una vitrina de marca: es un taller de trabajo, cuidado pero honesto sobre lo que es — un lugar para pensar en flujos, no para lucirse visualmente. La confianza no viene de la decoración, viene de que cada prototipo se lea con la misma claridad que tendría el flujo real, y de que el naranja Dropi aparezca como una firma puntual, no como fondo.

El sistema documentado aquí es una **consolidación**, no un inventario del estado actual: el código de hoy usa más de diez colores sueltos y una docena de radios de borde distintos sin patrón. Este archivo fija el subconjunto que sobrevive de ahora en adelante; el resto se retira por convergencia natural cada vez que se toque una pantalla, no por una migración masiva.

**Decisión 2026-08-04 — alineación con el DS real de Dropi.** El chrome global del hub (sidebar, topbar, dropdowns de usuario/célula) pasa a usar el naranja real de producto (`#FF6102`, antes `#F77F00`) y la escala de grises del Design System de Dropi (`gray-50`…`gray-700`), en vez de una paleta propia del hub. Reemplaza la guía anterior de "no usar los hex exactos del Figma real de Dropi" — decisión explícita de Michelle, no convergencia espontánea. El radio `xl` (24px) se suma como cuarto+uno paso, reservado a contenedores de página grandes (no a botones ni cards, que siguen en 8/12/20/pill). El resto de los prototipos (`proyectos/*`) no migra automáticamente: converge screen por screen cuando se toquen, igual que el resto de esta consolidación.

Rechaza explícitamente: gradientes decorativos, tarjetas idénticas repetidas, kickers en mayúsculas sobre cada sección, glassmorphism decorativo, numeración 01/02/03 como scaffolding por defecto — el "look genérico de IA" que este proyecto quiere evitar por decisión explícita.

**Key Characteristics:**
- Un único acento de marca (naranja Dropi), el resto son colores de estado funcionales.
- Sin sombra en reposo — la sombra es feedback de interacción, no jerarquía visual permanente.
- Densidad tipo panel de datos (13px de cuerpo), con una jerarquía de tamaños clara y acotada a 5 pasos.
- Radios de esquina consolidados a 4 pasos: nada de valores sueltos nuevos.

## 2. Colors

Paleta restringida: un acento de marca, cuatro colores de estado con rol fijo, y una escala neutra corta.

### Primary
- **Naranja Dropi** (#FF6102): el único acento de identidad — hex real del Design System de Dropi (ver nota de decisión arriba). Botones primarios, elementos activos/seleccionados, y toques puntuales que digan "esto es Dropi". No se usa como color de fondo de secciones completas.
- **Naranja Dropi (tint)** (#FFF3E0): fondo suave para resaltar un bloque relacionado con el acento (ej. una fila destacada), nunca como reemplazo del naranja sólido.

### Escala neutra del DS de Dropi (chrome global)
Usada en sidebar, topbar y dropdowns — no reemplaza los neutrales de abajo dentro de cards de prototipo, que se mantienen en su convergencia normal.
- `gray-50` #F0F4F9 · `gray-100` #E9EEF5 · `gray-200` #C3C9D9 · `gray-300` #A3ABBF · `gray-400` #858EA6 · `gray-500` #69738C · `gray-600` #475066 · `gray-700` #32394D

### Estado (semántico)
- **Verde Confirmado** (#10B981): éxito, estados "activo"/"aprobado", confirmaciones.
- **Ámbar Alerta** (#F59E0B): advertencia, estados pendientes o que requieren atención.
- **Rojo Crítico** (#EF4444): error, bloqueo, estados "rechazado"/"vencido".
- **Azul Información** (#3B82F6): informativo/neutral-activo, enlaces o estados de "en progreso" sin connotación de riesgo.

### Neutral
- **Fondo** (#F8F9FA): fondo base de página.
- **Superficie** (#FFFFFF): cards, paneles, inputs.
- **Borde** (#E5E7EB): divisores y bordes de card/input en reposo.
- **Texto** (#111827): texto principal.
- **Texto secundario** (#6B7280): metadatos, labels, texto de apoyo.

### Named Rules
**La Regla del Acento Único.** El naranja Dropi sólido se usa en un solo elemento por vista como máximo (el CTA principal o el estado seleccionado). Si dos elementos compiten por naranja, uno de los dos debe bajar a `dropi-orange-tint` o a un color de estado.

**La Regla de los Cuatro Estados.** Verde, ámbar, rojo y azul son los únicos colores con significado semántico. Ningún otro color (morado, índigo, cian, etc.) se introduce para "diferenciar visualmente" una categoría — para eso está la tipografía y el layout, no un color nuevo.

## 3. Typography

**Display Font:** -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
**Body Font:** la misma familia — una sola tipografía, variada por peso, no por familia.

**Character:** Sistema, no editorial. La fuente del propio sistema operativo del usuario transmite "herramienta interna, sin pretensiones" — coherente con Pulido y confiable sin caer en marketing.

### Hierarchy
- **Display** (700, 32px, 1.1): números grandes de métrica/KPI puntuales. Uso raro, casi nunca en el cuerpo de un flujo.
- **Headline** (600, 22px, 1.2): título de página o de sección principal de un prototipo.
- **Title** (600, 16px, 1.3): título de card, de bloque o de paso dentro de un flujo.
- **Body** (400, 13px, 1.5): texto de trabajo por defecto — la mayoría de la interfaz vive aquí. Máximo ~70ch en bloques de texto largo.
- **Label** (500, 11px, 1.3): encabezados de tabla, tags, meta-texto. Sin mayúsculas forzadas ni tracking amplio (evita el patrón de "eyebrow" genérico).

### Named Rules
**La Regla de la Familia Única.** Una sola familia tipográfica en todo el hub, diferenciada por peso y tamaño, nunca por mezclar dos sans-serif distintas.

## 4. Elevation

Superficie plana en reposo. Ninguna card, panel o fila lleva sombra por defecto — la separación viene de `neutral-border` y del color de fondo, no de elevación falsa. La sombra existe únicamente como **respuesta a interacción**: aparece en `:hover` / `:focus-visible` sobre elementos accionables (botones, filas clicables, cards navegables) y desaparece en reposo.

### Shadow Vocabulary
- **hover-lift** (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`): única sombra del sistema. Se aplica solo en estados de interacción, nunca en reposo.

### Named Rules
**La Regla del Hover-Only.** Si un elemento tiene sombra en su estado default, es un error de implementación, no una elección de diseño. La sombra se gana con la interacción del usuario, no se regala en reposo.

## 5. Components

Cuidados pero discretos: la función manda, la superficie no debe competir con los datos o el flujo que representa.

### Buttons
- **Shape:** esquinas suaves (8px, `rounded.sm`).
- **Primary:** fondo `dropi-orange`, texto blanco, padding `10px 16px`.
- **Hover:** fondo baja a `#DB7300` (naranja más oscuro) + `hover-lift` shadow.
- **Ghost/Secondary:** fondo transparente, texto `neutral-ink`, mismo radio; usar para acciones secundarias en la misma vista que un primary.

### Cards / Containers
- **Corner Style:** 12px (`rounded.md`).
- **Background:** `neutral-card` (blanco) sobre `neutral-bg`.
- **Shadow Strategy:** plana en reposo; `hover-lift` solo si la card completa es clicable/navegable.
- **Border:** 1px `neutral-border` cuando la card necesita separarse de otra card adyacente sin usar sombra.
- **Internal Padding:** `spacing.lg` (16px).

### Inputs / Fields
- **Style:** borde 1px `neutral-border`, fondo `neutral-card`, radio 8px (`rounded.sm`).
- **Focus:** borde pasa a `dropi-orange` + halo suave (`box-shadow: 0 0 0 3px rgba(255,97,2,.12)`, patrón ya usado en el código).
- **Error:** borde `danger-red`, mensaje de apoyo en el mismo color debajo del campo.

### Tags / Estado (pills)
- **Style:** radio `pill` (999px), fondo = tint suave del color de estado correspondiente (10-15% de opacidad), texto = versión sólida del mismo color.
- **State:** un tag por estado semántico (activo=verde, pendiente=ámbar, rechazado=rojo, en progreso=azul). Nunca un quinto color para un quinto estado — se reutiliza el más cercano semánticamente.

### Navigation
- Los prototipos de `proyectos/*` no comparten un chrome de navegación pesado entre sí: cada uno es su propio contexto acotado (ver Design Principles en PRODUCT.md). Donde exista navegación interna a un flujo (tabs, pasos), usar `title` para el paso activo y `body` + `neutral-muted` para los inactivos.

## 6. Do's and Don'ts

### Do:
- **Do** usar `#FF6102` (naranja Dropi) como único acento de marca, en un elemento por vista.
- **Do** dejar las cards y filas planas en reposo; añadir `hover-lift` solo en `:hover`/`:focus-visible`.
- **Do** consolidar cualquier radio de borde nuevo a uno de los cuatro pasos: 8px / 12px / 20px / 999px (pill).
- **Do** usar los cuatro colores de estado (verde/ámbar/rojo/azul) para cualquier necesidad semántica futura, en vez de introducir un color nuevo.

### Don't:
- **Don't** introducir gradientes decorativos, `background-clip: text`, glassmorphism decorativo, kickers en mayúsculas sobre cada sección, o numeración 01/02/03 como scaffolding por defecto — el look genérico de IA que este proyecto rechaza explícitamente (heredado de PRODUCT.md).
- **Don't** sumar un color nuevo (morado, índigo, cian, etc.) "para diferenciar" algo — son los colores sueltos que este documento retira del vocabulario oficial.
- **Don't** dar sombra a una card o fila en su estado de reposo; la sombra es exclusivamente de interacción.
- **Don't** mezclar dos familias tipográficas distintas; todo el peso/jerarquía viene de tamaño y peso de una sola familia.
