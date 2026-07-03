# Tango: Combos Dropshipper
**Feature:** Crear y editar combos  
**Figma:** https://www.figma.com/design/Ssrh2jwCSL3u3KBwF7R9SV/Combos-Dropshipper-1.0?node-id=6396-56596

---

## TANGO 1: Crear combo (flujo principal)

> Crea dos Tangos separados: uno para crear y otro para editar.

### Cómo exportar screenshots desde Figma
1. Abre el Figma en modo diseño
2. Selecciona el nodo por su ID (Ctrl+G o busca en las capas)
3. En el panel derecho > Export > PNG > Export
4. Nombra el archivo como se indica en cada paso

---

### Paso 1 — Pantalla "Mis combos" vacía
**Screenshot:** `step01_empty_activos.png`  
**Figma node:** `6405:20327`  
**Descripción para Tango:**
> Ve a **Productos > Mis combos** desde el menú lateral. Si todavía no tienes combos creados, verás la pantalla vacía con el banner de bienvenida.

---

### Paso 2 — Clic en "Crear combo"
**Screenshot:** `step01_empty_activos.png` *(mismo frame, anota el botón naranja)*  
**Descripción para Tango:**
> Haz clic en el botón **"Crear combo"** en la esquina superior derecha para iniciar el asistente de creación.

---

### Paso 3 — Paso 1: Elegir proveedor
**Screenshot:** `ep01_elegir_proveedor_main.png`  
**Figma node:** `6407:21135`  
**Descripción para Tango:**
> Se abre el asistente de creación en el **Paso 1: Elegir proveedor**. Ves la lista de todos tus proveedores disponibles. Puedes buscar por nombre con la barra de búsqueda o activar el toggle **Favoritos** para ver solo los que tienes marcados.

---

### Paso 4 — (Opcional) Filtrar proveedores
**Screenshot:** `ep02_elegir_proveedor_filtros.png`  
**Figma node:** `6398:60982`  
**Descripción para Tango:**
> Usa los filtros de **Tipo de proveedor**, **Ciudad** y **Categoría** para acotar la búsqueda. Haz clic en la flecha naranja para aplicar los filtros.

---

### Paso 5 — Seleccionar un proveedor
**Screenshot:** `ed01_editar_elegir.png`  
**Figma node:** `6401:63975`  
**Descripción para Tango:**
> Haz clic en el proveedor que quieres usar. Queda seleccionado con un borde naranja y el panel derecho muestra un preview del combo. **Recuerda:** todos los productos del combo deben ser del mismo proveedor.

---

### Paso 6 — Clic en "Siguiente"
**Screenshot:** `ep01_elegir_proveedor_main.png` *(anota el botón "Siguiente")*  
**Descripción para Tango:**
> Confirma tu elección haciendo clic en **"Siguiente"** en la esquina inferior derecha.

---

### Paso 7 — Paso 2: Agregar productos (pantalla vacía)
**Screenshot:** `ap02_modal_producto.png`  
**Figma node:** `6178:5853`  
**Descripción para Tango:**
> Estás en el **Paso 2: Agregar productos**. Ves los slots vacíos del combo. Necesitas al menos 2 artículos para continuar. Haz clic en **"+ Agregar producto"** para abrir el catálogo del proveedor.

---

### Paso 8 — Modal de selección de productos
**Screenshot:** `ap01_agregar_productos_main.png`  
**Figma node:** `6178:6109`  
**Descripción para Tango:**
> Se abre el catálogo con los productos del proveedor seleccionado. Cada tarjeta muestra categoría, stock disponible, precio proveedor y precio sugerido. Haz clic en **"+ Agregar"** en cada producto que quieras incluir.

---

### Paso 9 — Confirmar productos seleccionados
**Screenshot:** `ap01_agregar_productos_main.png` *(anota la barra inferior y el botón "Agregar")*  
**Descripción para Tango:**
> En la barra inferior verás las miniaturas de los productos que vas agregando. Cuando termines, haz clic en **"Agregar"** para confirmarlos.

---

### Paso 10 — Paso 3: Personalizar combo
**Screenshot:** `pc01_personalizar_main.png`  
**Figma node:** `6226:18891`  
**Descripción para Tango:**
> Estás en el **Paso 3: Personalizar combo**. Ingresa el **nombre** del combo (obligatorio), una **descripción** (opcional) y sube una o más **imágenes** (opcional). El panel derecho muestra el resumen con el costo total y precio sugerido calculados automáticamente.

---

### Paso 11 — Clic en "Guardar"
**Screenshot:** `pc01_personalizar_main.png` *(anota el botón "Guardar")*  
**Descripción para Tango:**
> Cuando hayas completado el nombre del combo, haz clic en **"Guardar"**.

---

### Paso 12 — Cargando
**Screenshot:** `gc01_guardar_main.png`  
**Figma node:** `6400:62336`  
**Descripción para Tango:**
> Aparece un modal de carga mientras el sistema procesa tu combo.

---

### Paso 13 — ¡Combo creado con éxito!
**Screenshot:** `gc02_guardar_exito.png`  
**Figma node:** `6400:62607`  
**Descripción para Tango:**
> Vuelves automáticamente a **Mis combos**, donde tu nuevo combo aparece en la lista con el badge **"Activo"**. Un mensaje de confirmación aparece en la esquina superior derecha.

---

## TANGO 2: Editar combo

### Paso 1 — Mis combos con combos creados
**Screenshot:** `step03_con_combos_activos.png`  
**Figma node:** `6329:63527`  
**Descripción para Tango:**
> En **Productos > Mis combos**, ves todos tus combos activos e inactivos en tarjetas con imagen, productos, stock, proveedor y canales de disponibilidad.

---

### Paso 2 — Clic en "Editar"
**Screenshot:** `step03_con_combos_activos.png` *(anota el botón "Editar" en alguna card)*  
**Descripción para Tango:**
> Haz clic en **"Editar"** en la tarjeta del combo que quieres modificar.

---

### Paso 3 — Elegir proveedor (con proveedor actual)
**Screenshot:** `ed01_editar_elegir.png`  
**Figma node:** `6401:63975`  
**Descripción para Tango:**
> Se abre el asistente de edición en el **Paso 1: Elegir proveedor**. El proveedor actual ya aparece seleccionado (borde naranja). Puedes mantenerlo o elegir otro.

---

### Paso 4 — ⚠️ Cambiar de proveedor (flujo alternativo)
**Screenshot:** `step_cambiar_proveedor_modal.png`  
**Figma node:** `6407:21602`  
**Descripción para Tango:**
> Si seleccionas un proveedor diferente al actual, aparece una advertencia: **"Cambiar de proveedor eliminará tus productos"**. Haz clic en "Cancelar" para mantener el proveedor actual, o en "Cambiar de proveedor" para confirmar (y tendrás que seleccionar productos nuevamente).

---

### Paso 5 — Agregar o quitar productos
**Screenshot:** `ed02_editar_agregar.png`  
**Figma node:** `6401:63931`  
**Descripción para Tango:**
> En el **Paso 2**, ves los productos que ya tenía el combo. Puedes agregar más haciendo clic en **"+ Agregar producto"** o eliminar los existentes con el ícono de papelera.

---

### Paso 6 — Personalizar combo
**Screenshot:** `ed03_editar_personalizar.png`  
**Figma node:** `6401:64000`  
**Descripción para Tango:**
> En el **Paso 3**, ajusta nombre, descripción e imágenes del combo. Los campos ya vienen pre-llenados con la información actual.

---

### Paso 7 — Guardar cambios
**Screenshot:** `gc01_guardar_main.png`  
**Descripción para Tango:**
> Haz clic en **"Guardar"** para aplicar los cambios. Aparece el modal de carga mientras se procesan.

---

### Paso 8 — Cambios guardados
**Screenshot:** `gc02_guardar_exito.png`  
**Descripción para Tango:**
> Vuelves a **Mis combos** con la confirmación de que los cambios fueron guardados exitosamente.

---

## Screenshots disponibles

| Archivo | Qué muestra |
|---|---|
| `step01_empty_activos.png` | Mis combos — sin combos (empty state) |
| `step03_con_combos_activos.png` | Mis combos — con combos activos (cards) |
| `ep01_elegir_proveedor_main.png` | Paso 1: Lista de proveedores (default, toggle favoritos activo) |
| `ep02_elegir_proveedor_filtros.png` | Paso 1: Con filtros aplicados y proveedor seleccionado |
| `ed01_editar_elegir.png` | Paso 1: Proveedor seleccionado con preview en panel |
| `step_cambiar_proveedor_modal.png` | Modal de advertencia al cambiar proveedor |
| `ap02_modal_producto.png` | Paso 2: Pantalla principal con slots vacíos |
| `ap01_agregar_productos_main.png` | Paso 2: Modal de selección de productos |
| `pc01_personalizar_main.png` | Paso 3: Formulario de personalización |
| `gc01_guardar_main.png` | Loading "Guardando combo..." |
| `gc02_guardar_exito.png` | Éxito: vuelta a Mis combos con toast de confirmación |
| `ed01_editar_elegir.png` | Editar — Paso 1 con proveedor preseleccionado |
| `ed02_editar_agregar.png` | Editar — Paso 2 con productos existentes |
| `ed03_editar_personalizar.png` | Editar — Paso 3 con datos prellenados |

---

*Screenshots en:* `/private/tmp/claude-501/.../scratchpad/tango/`  
*Para exportar desde Figma: selecciona el node ID > panel derecho > Export > PNG*
