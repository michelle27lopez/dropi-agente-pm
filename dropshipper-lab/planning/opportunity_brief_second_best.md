# ⛓️ OPPORTUNITY BRIEF: Enrutamiento Dinámico (Second Best) - PROD-SEC-BEST

* **Célula:** Seller Success / Logística
* **Responsable:** Santiago Herrera Acosta
* **Fecha:** 2026-07-27
* **Prioridad:** High
* **Apetencia:** 3 semanas de diseño, validación y especificación técnica en Q3 2026.

---

## 1. Diagnóstico del Problema y Evidencia

### El Problema de Origen
¿Qué pasa cuando un dropshipper quiere vender (o ya tiene órdenes de compra generadas en Dropi) y su proveedor principal se queda sin stock (stockout) o no responde para despachar el producto? 
* El dropshipper se ve obligado a cancelar el pedido o retrasar el envío, **afectando directamente a su cliente final** con demoras y cancelaciones. Esto daña la reputación de la tienda y rompe el hábito de ventas del seller.
* Actualmente, el dropshipper experimenta una fricción extrema para resolver esto de forma manual: debe buscar otros proveedores del mismo producto en el catálogo, re-importar el nuevo ID de producto, mapear las variantes en su tienda y reconfigurar la logística.

### Evidencia del Dolor (Base de Acompañamiento Comercial 360)
El análisis de la operación diaria del equipo comercial (Account Managers) confirma que esta falla de abastecimiento es crítica:
* **95 productos de alta rotación en estado "En búsqueda"** (stockout absoluto del proveedor original).
* **297 productos in-app en estado "Campaña inactiva"** (desactivados por falta de stock).
* **Operación Concierge ineficiente:** Las comerciales dedican horas a buscar manualmente IDs de reemplazo y enviarlos uno a uno por WhatsApp (ej. *"Se le recomienda ID reemplazatorio 2044494..."*), con un tiempo de resolución de 24 a 48 horas.

---

## 2. Propósito y Outcomes

El objetivo es crear un sistema integrado de protección al cliente final estructurado en **dos líneas de defensa**:

```
[Órden Creada] ──> ¿Proveedor Principal Falla / Sin Stock?
                        │
                        ├──> [SÍ] ──> ¿Tiene Second Best Escogido?
                        │                 │
                        │                 ├──> [SÍ] ──> Línea 1: Redirección automática al respaldo
                        │                 │
                        │                 └──> [NO] ──> Línea 2: Subasta de Despacho de Emergencia (Pulso)
```

| Métrica | Nombre del Indicador | Baseline | Meta del MVP |
| :--- | :--- | :--- | :--- |
| **Business Outcome** | Tasa de órdenes canceladas por falta de stock o inactividad del proveedor. | N/A | **Reducción del 50%** en productos Pareto. |
| **Product Outcome** | % de órdenes exitosamente re-enrutadas que llegan al cliente final a tiempo. | 0% (Proceso manual) | **$\ge 75\%$ de efectividad** en redirección automática/guiada. |
| **Fricción Operativa** | Tiempo de resolución comercial para conseguir stock de respaldo. | 24 - 48 horas | **< 2 minutos** (Fulfillment inmediato). |

---

## 3. Mecanismo de Intervención (Las Dos Líneas de Defensa)

### 🛡️ Primera Línea de Defensa: Second Best (Elección Preventiva)
Al momento de importar un producto del catálogo, el catálogo de Dropi sugiere dinámicamente alternativas con stock verificado. El dropshipper **selecciona y pre-aprueba** activamente sus proveedores de respaldo:
1. **La Elección:** El dropshipper ve tarjetas comparativas (costo de producto, stock físico de la bodega, tasa de entrega histórica del proveedor B) y marca el checkbox para guardarlo como su "Second Best".
2. **El Switch:** Ante un stockout inminente o si el proveedor principal no procesa el envío en un límite de tiempo (ej. 24 horas sin responder), el sistema alerta al dropshipper in-app y activa el re-mapeo del webhook de órdenes hacia el proveedor de respaldo en un solo clic.

### 🚨 Segunda Línea de Defensa: Dropi Pulso (Subasta de Despacho de Emergencia)
¿Qué pasa si el proveedor principal falla **y el dropshipper no tiene un Second Best configurado/disponible** en el catálogo?
1. **El Trigger:** El sistema detecta órdenes de compra en Dropi retenidas por falta de stock o proveedor inactivo.
2. **El Broadcast de Pulso:** El sistema emite una alerta de urgencia en tiempo real en el panel de todos los proveedores verificados de esa categoría:
   * *"Alerta de Despacho Urgente: Hay 85 órdenes de 'Slim Patch' en Bogotá listas para despacho que no tienen proveedor activo. ¿Quién tiene stock físico en su bodega y puede despachar hoy mismo?"*
3. **La Resolución:** Cualquier proveedor con stock físico disponible acepta el lote de órdenes y realiza el despacho inmediato, salvando la venta y protegiendo al cliente final del dropshipper.

---

## 4. Algoritmo de Matching Semántico (Reglas de Negocio)

Para sugerir los "Second Best" elegibles en el catálogo al dropshipper, el motor de coincidencia evalúa las opciones bajo los siguientes criterios en cascada:

```
   1. CÓDIGO EAN (Coincidencia exacta) 
       └─> 2. SIMILITUD DE IMAGEN (Coincidencia de embeddings visuales ≥ 90%) 
             └─> 3. TEXTO SEMÁNTICO (Coincidencia semántica de títulos ≥ 85%)
```

### Reglas de Calidad (RB-003):
1. **Nivel del Proveedor:** Solo se pueden sugerir como respaldos proveedores calificados como *Premium Exclusivo, Premium o Verificados*. Las bodegas de nivel *Estándar* o reportadas como no receptivas quedan bloqueadas.
2. **Cota de Stock Mínimo:** El proveedor alternativo debe contar con un stock físico en bodega de al menos $Stock_{min}$ (fórmula de seguridad basada en el promedio de ventas diario del dropshipper).
3. **Mapeo de Atributos:** El sistema debe verificar que el producto de respaldo cuente exactamente con las mismas variaciones de color, talla o presentación para evitar inconsistencias en el despacho COD.

---

## 5. Diagnóstico Conductual (B=MAP)

* **Motivation (M) — Muy Alta:** El seller tiene urgencia por no perder su venta y proteger la reputación de su tienda ante el cliente final. Su aversión a la pérdida reputacional es máxima.
* **Ability (A) — Maximizado por Simplicidad:** Al eliminar la necesidad de buscar, negociar, re-importar y re-mapear de forma manual por fuera de la app, el MVP reduce la fricción a la mínima expresión física y mental (un solo clic de confirmación).
* **Prompt (P) — Alerta Persistente y Contextual:** El prompt ocurre in-app justo al iniciar sesión y va acompañado de un análisis predictivo de tiempo de quiebre (ej. *"te quedan 2 días"*), generando un disparador de urgencia realista.

---

## 6. Plan de Validación (Pre-development Guerrilla Test)

Antes de codificar el backend de redirección, validaremos el flujo visual y la deseabilidad de la interfaz con usuarios reales:

1. **Diseño del Prototipo:** Crear en Figma el flujo del Prompt de Alerta de Inventario y la sección de vinculación de respaldos.
2. **Muestra del Test:** Seleccionar a **5 dropshippers del Pareto** de la base de acompañamiento comercial que hayan tenido estado "En búsqueda" u observaciones de stock en la última semana.
3. **Prueba Moderada (Guerrilla):** Presentar el prototipo y pedirles que simulen resolver un quiebre de stock inminente.
4. **Métricas a evaluar en el Test:**
   * **Tasa de Comprensión:** ¿Entienden la diferencia en costo del producto alternativo y la automatización del ruteo en 5 segundos?
   * **Tasa de Aceptación:** ¿Hacen clic en "Confirmar Redirección" o prefieren apagar la pauta?
   * **Deseabilidad:** Nivel de confianza percibido de la automatización en comparación con la ayuda manual del comercial.
