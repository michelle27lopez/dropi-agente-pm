# 08 · MVP Ecom Scanner — métricas

> **Fuente:** `fuentes/Metricas_Ecom_Scanner_Producto_Logistica.docx` · **Tipo:** spec de producto/instrumentación · **Confianza:** propuesta de MVP

## TL;DR
- **No medir Ecom por cantidad de escaneos** (sube sin mejorar entrega). Medir por **cobertura de estados, velocidad al siguiente estado, errores prevenidos, y resultado final (entrega/devolución con Ecom vs sin Ecom)**.
- Ecom Scanner NO es app para sellers: lo operan **proveedor, bodega, PAU/Dropi**. El seller solo consulta en Dropi web.
- Métrica norte sugerida: guías con Ecom que avanzan al siguiente estado dentro del SLA y terminan entregadas.

## Contenido
### Alcance
Captura eventos físicos → estados logísticos medibles. Módulos: Salidas, Devoluciones, Inspección de devoluciones dañadas. NO imprime/genera guías, NO reemplaza Dropi web.

### Estados Ecom a medir
Preparado para transportadora · Entregado a transportadora (separar origen: proveedor vs bodega Dropi) · Recibido PAU · Recogido Dropi · En bodega Dropi.

### 5 familias de métricas
1. **Adopción/cobertura:** % guías elegibles con ≥1 estado Ecom (la adopción real), por proveedor.
2. **Velocidad:** guía creada→1er estado Ecom; 1er estado Ecom→1er estado transportadora; tiempo de escaneo.
3. **Errores/alertas:** % con error, % alertas críticas, % falsos positivos, % bloqueadas, % corregidas.
4. **Fugas de estado:** guía con estado Ecom sin siguiente estado esperado (la fuga clave); entregada a transportadora sin 1er estado de carrier tras X horas.
5. **Resultado logístico:** tasa entrega/devolución y tiempo a 1er estado carrier, **con Ecom vs sin Ecom**.

### Definiciones clave
Guía **elegible** (debería tener estado Ecom) · guía **con/sin Ecom** · primer estado Ecom · primer estado transportadora · siguiente estado esperado · SLA de avance.

### Qué NO usar como éxito
Total de escaneos · usuarios creados · cantidad de alertas · manifiestos impresos · pantallas/clics.

## Conexión con metodología
- Cae en la etapa **Despacho/recolección** de la cadena (Ecom = pierna física Dropi, capa 3 → `temas/03`).
- Regla de medición que refuerza la metodología: medir resultado, no actividad.

## ⚠️ Cuidado de atribución
Comparar Ecom vs sin-Ecom sin controlar por proveedor/ciudad/transportadora/producto/periodo da conclusiones falsas. Comparar guías lo más similares posible.

## Pendiente de instrumentación (checklist)
Cada estado Ecom con timestamp + usuario + origen; marca de guía elegible; flag con/sin Ecom; 1er estado de transportadora + timestamp; estado final entregada/devuelta/anulada.
