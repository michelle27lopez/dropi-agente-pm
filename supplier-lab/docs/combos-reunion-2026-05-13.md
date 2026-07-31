# Reunión de Estado — Proyecto Combos
**Fecha:** 2026-05-13  
**Tipo:** Técnica — equipo Producto + TI  
**Duración:** ~48 min

**Participantes:** Katerine Pencue, Jose Giraldo, Fabian Castro Peralta, Daniel De la Pava Suarez (Dani), Michael Giovanny Martinez Guzman (MG), Juan

---

## Decisión central tomada

La reunión **no cerró un MVP fijo**. La decisión fue de **exploración**: definir el estado deseado (TOBE) desde Producto prototipando cada nodo del ecosistema, para que TI pueda hacer una **estimación de esfuerzo** (no de tiempo) por fase. El esfuerzo es independiente del calendario; puede ejecutarse en 1 mes o en 12 meses según la dedicación disponible.

El documento TOBE resultante vive en: `supplier-lab/docs/combos-definicion-tobe.md`

---

## Puntos de debate relevantes

### Qué es un combo (aclaración técnica — Fabian + MG)
El debate inicial giró alrededor de confundir una "orden con múltiples productos" con un combo real. Fabian lo aclaró:
- Una orden compuesta es simplemente una orden con varios productos — cada uno con su propio stock, precio y proveedor.
- Un **combo** es un tipo de producto con precio unificado (no suma de partes), stock dependiente entre componentes y lógica propia de reverso.
- MG añadió: combo es un **tipo**, no un ID. Un tipo simple tiene 1 ID, uno variable tiene múltiples, uno combo tiene múltiples con lógica de precio y stock compartida.

### Escala del proyecto
MG fue explícito: *"Combos es el proyecto más complejo que hay en Dropi, se mete con las entidades base."* No es un proyecto nuevo — toca la arquitectura existente. Por eso no aplica la lógica de "MVP pequeño": cualquier cambio tiene impacto transversal.

### Por qué no se puede simplemente exportar como dos productos a Shopify
Katerine intentó importar dos productos por separado a Shopify simulando un combo. El sistema los rechazó porque el fulfillment está configurado sobre Dropi y al recibir dos productos separados, los precios y el fulfillment no cuadran. Fabian lo confirmó.

### Shopify: prueba parcial realizada con Aleja/Mich
Se logró importar un combo como producto simple a Shopify. El error apareció cuando el combo incluía un producto con variantes — la carga falló. El flujo inverso (orden desde Shopify → Dropi) **no se ha probado**.

### CAS e Icon Scanner marcados como críticos
- **CAS:** sin él, atención al cliente no puede operar órdenes de combo (consultas, garantías, devoluciones).
- **Icon Scanner:** sin él, si se crean muchos combos y el escáner no los reconoce, se pierden devoluciones y confirmaciones de bodega.

### Garantías no son bloqueantes para el primer corte
~5,000 garantías/mes en Colombia. El equipo acordó que puede arrancar sin garantías de combos con un mensaje temporal mientras se construye la lógica.

### Negociaciones: solo un mensaje temporal
Page Pilot y negociaciones también pueden arrancar con un aviso: "productos tipo combo no participan en negociaciones activas por el momento."

### Rol emprendedor vs proveedor
No existe el perfil técnico de "emprendedor". Un proveedor que crea su propia orden ya es funcionalmente un emprendedor. Decisión: un solo copy unificado para ambos, sin diferenciación en esta fase.

### Integraciones WooCommerce y Tienda Nube
- WooCommerce: plugin en rediseño (v2.0). Hacer combos sobre la versión actual sería reproceso.
- Tienda Nube: app existe pero también en rediseño.
- Decisión: combos en estas plataformas va a una fase posterior, sobre las versiones nuevas.

### Dropify
Jose confirmó que Dropify (plugin de Shopify) debe salir a beta la semana siguiente a la reunión (semana del 2026-05-18).

---

## Acuerdos de la reunión

1. No se define un MVP cerrado — se define un TOBE por nodo y luego TI estima esfuerzo.
2. Producto prototipar cada nodo antes de que TI pueda estimar.
3. La presentación a María y Lucho debe incluir el roadmap de fases (MVP1 → MVP2 → MVP3) con estimados de esfuerzo, no de tiempo.
4. Jose y el equipo técnico (MG, Fabian, Dani) lideran la presentación a María y Lucho.
5. Dropify a beta la semana del 2026-05-18.

---

## Pendientes identificados en la reunión

| Pendiente | Responsable mencionado |
|---|---|
| Prototipar flujo de creación de combo (UI) | Producto |
| Verificar flujo orden Shopify → Dropi con combo | TI (Fabian/MG) |
| Resolver importación de combos con variantes a Shopify | TI |
| Revisión de API Shopify post-enero (variantes y productos compuestos) | TI |
| Definir política de garantía para combos | María / equipo garantías |
| Definir dispersión de márgenes en negociaciones con combos | Lucho / Juan Diego |
| Confirmar estado del plugin WooCommerce v2.0 | Jose Giraldo |
| Presentación roadmap a María y Lucho | Jose + equipo técnico |
