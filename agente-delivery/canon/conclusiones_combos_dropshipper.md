# Conclusiones — Combos Dropshipper (PROD-545)

## Contexto

Se documentó el flujo completo de la funcionalidad Combos Dropshipper mediante una guía Tango visual publicada en `dropi-pd-hub.vercel.app/proyectos/combos`. Este documento recoge las decisiones de diseño, reglas de negocio y comportamientos del sistema que se validaron durante el proceso.

---

## Reglas de negocio confirmadas

**Sobre la creación del combo:**
- Todos los productos del combo deben pertenecer al **mismo proveedor**. No es posible mezclar proveedores.
- El mínimo para crear un combo es **2 artículos** (pueden ser el mismo producto repetido).
- El combo se vincula automáticamente a las **bodegas que tienen todos los productos en común** con stock disponible. No todas las bodegas del proveedor aparecen — solo las que pueden surtir el combo completo.
- El campo **nombre es obligatorio**. Descripción e imágenes son opcionales.

**Sobre la edición del combo:**
- Al editar un combo guardado, el flujo **abre directamente en el Paso 3 (Personalizar)**, no en el Paso 1. Esto es intencional: el caso de uso más frecuente al editar es cambiar nombre, descripción o imágenes.
- **No se puede cambiar de proveedor** en un combo existente. Si el usuario navega al Paso 1, aparece un modal bloqueante con el mensaje: *"No puedes cambiar de proveedor — este combo ya tiene productos agregados. Para elegir otro proveedor debes empezar un nuevo combo."*
- Sí es posible **agregar o quitar productos** desde el Paso 2 durante la edición.

---

## Decisiones de nomenclatura y tono

- El término correcto para donde está disponible el combo es **"bodegas"**, no "canales" ni "principales/centros". Las bodegas son las unidades logísticas reales del proveedor.
- **No usar "asistente"** para referirse al flujo de creación o edición. El término suena genérico y no representa cómo funciona el producto.
- Las tarjetas de producto en el catálogo del proveedor se llaman **"tarjetas de producto"** (no "ítems" ni "artículos" en la UI).
- El resumen del combo en el panel derecho muestra: **Costo Combo** (suma de precios proveedor) y **Precio sugerido** (suma de precios sugeridos de los productos incluidos).

---

## Estructura de la guía Tango

**Flujo CREAR — 12 pasos:**
1. Accede a Mis combos (`step01_empty_activos.png`)
2. Haz clic en «Crear combo» (misma pantalla)
3. Paso 1 — Elegir proveedor (`ep01_elegir_proveedor_main.png`)
4. (Opcional) Filtrar proveedores (`ep02_elegir_proveedor_filtros.png`)
5. Selecciona el proveedor y «Siguiente» (`ep03_elegir_proveedor_seleccionado.png`)
6. Paso 2 — Agregar productos (`ap01_agregar_productos_main.png`)
7. Confirma los productos seleccionados — miniaturas en barra inferior (`ap03_agregar_miniaturas.png`)
8. Revisa los productos del combo y las bodegas disponibles (`ap04_productos_agregados.png`)
9. Paso 3 — Personalizar combo (`pc02_personalizar_con_productos.png`)
10. Haz clic en «Guardar» (misma pantalla)
11. El sistema guarda tu combo — modal de carga (`gc01_guardar_main.png`)
12. ¡Combo creado con éxito! — regresa a Mis combos con badge Activo (`gc02_guardar_exito.png`)

**Flujo EDITAR — 8 pasos:**
1. Mis combos — lista de combos (`step03_con_combos_activos.png`)
2. Haz clic en «Editar» (misma pantalla)
3. El combo abre directo en Paso 3 — Personalizar (`ed04_editar_personalizar_directo.png`)
4. ⚠️ No puedes cambiar de proveedor — modal bloqueante (`ed05_proveedor_bloqueado_modal.png`)
5. Paso 2 — Agregar o quitar productos (`ed06_editar_agregar_productos.png`)
6. Paso 2 — Confirmación de producto agregado con toast (`ed07_editar_personalizar.png`)
7. Guardar cambios (`gc01_guardar_main.png`)
8. ¡Cambios guardados! — toast de confirmación en Mis combos (`ed08_editar_exito.png`)

---

## Decisiones de diseño de la guía

- Cada paso tiene un **link directo al frame de Figma** para que Marketing pueda navegar a la pantalla exacta al crear manuales o tutoriales.
- Se implementaron **recuadros de highlight** (borde naranja, posicionado como overlay sobre la imagen) para señalar dónde debe hacer clic el usuario en cada pantalla.
- Las coordenadas del highlight se obtienen **desde Figma**: se selecciona el elemento en el frame, se leen los valores de distancia al borde del frame desde el panel Layer Properties (los 4 números naranjos: top, bottom, left, right), y se convierten a porcentajes dividiéndolos por las dimensiones del frame.
- Los frames del Figma tienen dimensiones variables: 1280×883 (pantallas de lista), 1280×992 (pantallas de flujo), 1296×1024 (pantalla de agregar productos), 1280×996 (modal de proveedor bloqueado).

---

## Recursos del proyecto

- **Guía Tango publicada:** `dropi-pd-hub.vercel.app/proyectos/combos`
- **Figma:** `Ssrh2jwCSL3u3KBwF7R9SV` — archivo "Combos Dropshipper 1.0"
- **Ticket:** PROD-545
- **Repositorio del hub:** `michelle27lopez/dropi-pd-hub` en GitHub, rama `main`, deploy automático en Vercel
