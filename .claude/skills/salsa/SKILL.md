---
name: salsa
description: Crea una guía visual paso a paso de un flujo de producto (una "salsa") con screenshots de Figma, descripciones y highlights de clic, publicada como página del hub en `hub/src/app/proyectos/[slug]`. Úsala cuando el usuario pida armar/crear una salsa, documentar un flujo con screenshots de Figma para hand-off, o invoque `/salsa`.
---

# Skill: Salsa

Una **Salsa** es una guía visual paso a paso de un flujo de producto. Documenta cada pantalla con screenshot, descripción y link de Figma, y opcionalmente marca con un recuadro dónde hace clic el usuario.

El template de referencia es `hub/src/app/proyectos/combos/page.tsx`.

---

## Proceso al invocar /salsa

Sigue estos pasos en orden. No avances al siguiente sin tener la información del anterior.

### 1. Recopilar información base

Pregunta al usuario:
- **Nombre del flujo** (ej: "Combos Dropshipper", "Caza Productos") — se usará como título y como ruta URL (`/proyectos/[slug]`)
- **Ticket de Jira** (ej: PROD-545)
- **Figma file ID** (el código en la URL del archivo, ej: `Ssrh2jwCSL3u3KBwF7R9SV`)
- **Flujos a documentar** (ej: Crear, Editar, Eliminar — puede ser uno o varios)
- **Tipo de usuario** (Dropshipper, Proveedor, etc.)

Si el usuario prefiere armar la salsa **por partes** (una sesión por flujo/rol), está bien — no forzar a
recopilar todo de una vez. Cuando ya existan 2+ partes (ej. un rol Proveedor y un rol Dropshipper), usar una
estructura de **tabs** en la página (ver el patrón `tab`/`switchTab` de Combos) en vez de una sola lista de
pasos larga — cada parte con su propio array de `Step[]`.

### 2. Explorar el archivo de Figma

**Preferir pedirle al usuario los node-ids/links exactos de cada pantalla, en el orden del flujo, en vez de
explorar el archivo a ciegas.** Los archivos de Figma en uso activo suelen tener muchas variantes de
exploración con nombres duplicados (ej. el mismo "Paso 2: comisión porcentual - fill" repetido 6+ veces en
distintas posiciones) — intentar adivinar cuál es la versión final desde `get_metadata` es lento y propenso
a error. Si el usuario no tiene los links a mano, ahí sí explorar con el MCP de Figma
(`mcp__claude_ai_Figma__get_metadata` o `mcp__claude_ai_Figma__get_design_context`), pero siempre confirmar
con el usuario cuáles son los frames correctos antes de descargar.

Para archivos grandes, `get_metadata` sobre un nodeId muy alto en la jerarquía puede exceder el límite de
tokens — si pasa, pedir un nodeId más específico (una sección o frame concreto) en vez de la página completa.

### 3. Descargar screenshots

Para cada pantalla:
- Usar `mcp__claude_ai_Figma__download_assets` con el node ID del frame
- Guardar en `hub/public/tango/` con nombre descriptivo
- Convención de nombres: `[prefijo]_[descripcion].png`
  - `ep_` → elegir proveedor
  - `ap_` → agregar productos
  - `pc_` → personalizar combo
  - `gc_` → guardar/confirmar
  - `ed_` → editar
  - Usar prefijos propios si el flujo es diferente
- Registrar las dimensiones reales de cada frame (w × h) — varían por pantalla

### 4. Redactar los pasos

Para cada paso:
- **Título:** acción concreta en imperativo (ej: "Haz clic en «Crear combo»")
- **Descripción:** explica el POR QUÉ del paso, no solo el qué. Menciona elementos de la UI por su nombre exacto como aparece en pantalla. Máximo 3 oraciones.
- **figmaUrl:** `https://www.figma.com/design/[FILE_ID]/...?node-id=[NODE_ID]`

Reglas de contenido obligatorias:
- Nunca usar la palabra "asistente" para referirse al flujo
- Usar el nombre exacto de botones, labels y pantallas como aparecen en la UI
- Marcar `optional: true` en pasos que el usuario puede saltarse
- Marcar `warning: true` en pasos que describen una restricción o error
- Si dos pasos consecutivos usan la misma pantalla, repetir la imagen (no fusionar los pasos)

### 5. Definir highlights (si aplica)

Solo agregar highlight cuando hay una acción clara de clic en esa pantalla.

Si el usuario tiene Figma Desktop abierto, puede leer las coordenadas exactas:
1. Seleccionar el elemento a resaltar en el frame
2. Abrir el panel **Layer Properties** (pestaña Code/Inspect)
3. Leer los 4 números naranjos: **top, bottom, left, right** (distancia a los bordes del frame) y el **tamaño del elemento** (w × h)
4. Convertir a porcentajes:
   - `x = left / frame_w * 100`
   - `y = top / frame_h * 100`
   - `w = elem_w / frame_w * 100`
   - `h = elem_h / frame_h * 100`

Si el agente no tiene acceso a Figma Desktop (caso normal), estimar las coordenadas combinando:
- Las posiciones x/y/width/height de `get_metadata` para los elementos que se puedan identificar con certeza
- Medición visual sobre el screenshot ya descargado, sabiendo el ancho/alto real del frame (ej. 1280×992)

Esto no cuenta como "inventar" coordenadas — se derivan del diseño real, solo que sin el panel interactivo.

### 6. Crear el archivo de la página

Crear `hub/src/app/proyectos/[slug]/page.tsx` usando como base el template de Combos.

Estructura de cada step:
```ts
type Step = {
  n: number;
  title: string;
  img: string;          // ruta relativa desde /public, ej: "/tango/ep01.png"
  w: number;            // ancho real del frame en px
  h: number;            // alto real del frame en px
  desc: string;
  optional?: boolean;
  warning?: boolean;
  highlight?: { x: number; y: number; w: number; h: number }; // porcentajes 0–100
  figmaUrl?: string;
};
```

### 7. Registrar el proyecto en el hub

Agregar una entrada al array `projects` en `hub/src/app/page.tsx`:
```ts
{
  key: "[slug]",
  name: "[Nombre del flujo]",
  description: "[Descripción breve para la tarjeta del hub]",
  url: "/proyectos/[slug]",
  color: "[color hex]",
  tag: "[TICKET] · Hand-off",
  icon: "[emoji]",
}
```

### 8. Verificar antes de publicar

- Probar en local: `cd hub && npm run dev` → abrir `localhost:3004/proyectos/[slug]`
- Verificar que todas las imágenes cargan
- Verificar que los highlights están bien posicionados
- Verificar que los links de Figma abren el frame correcto
- **No hacer push hasta que el usuario diga explícitamente que ya está terminado** — probar en local no es
  luz verde para subir. Cuando lo confirme, seguir el flujo de git de este repo (rama `design/*` → push a
  `fork`, nunca a `main`/`origin` directo → PR cross-fork hacia el repo principal), no un push directo a main.

---

## Reglas de negocio nuevas y hallazgos de QA

Revisar cada screenshot con cuidado (no solo los nombres de las capas en Figma) suele sacar a la luz cosas
que no estaban documentadas: reglas de negocio en el texto literal de un modal, íconos con un significado
distinto al que se asumía, copys inconsistentes, datos de ejemplo reciclados de otro flujo/proyecto. Esto es
valioso — funciona como una revisión de QA informal, no solo como documentación.

- **Si aparece una regla de negocio que no se había mencionado antes en la conversación, preguntarle al
  usuario antes de darla por buena** (ej. "¿esto es una regla real o solo texto del mockup?"). No decidir
  unilateralmente si es una regla confirmada, pendiente de validar, o un error de diseño — eso lo determina
  el usuario, no el agente.
- Si se detecta un posible bug de copy o dato inconsistente, señalarlo aparte (a la persona, no como parte
  de la descripción del paso) — no corregirlo en el Figma ni redactar la descripción del paso como si el
  bug fuera el comportamiento correcto.

## Qué NO hacer

- No fusionar dos acciones distintas en un mismo paso aunque usen la misma pantalla
- No inventar coordenadas de highlight — siempre obtenerlas desde Figma
- No usar términos genéricos: "asistente", "modal de ayuda", "wizard"
- No hacer push sin probar en local primero
