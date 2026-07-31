# Matriz de impacto cruzado — Template por proyecto

Toda iniciativa que avance hacia desarrollo debe pasar por esta validación.
El agente aplica esta matriz automáticamente cuando analiza o actualiza cualquier proyecto.

---

## Cómo usar esta matriz

Para cada frente, responder tres preguntas:
1. **¿Impacta?** — Sí / No / Por definir
2. **Pregunta crítica sin resolver** — Si aplica
3. **Estado** — `Validado` / `Pendiente` / `No aplica`

Si hay un frente con estado `Pendiente`, el proyecto **no puede avanzar a desarrollo**.

---

## Frentes de validación

### 1. Modelo de producto / catálogo
¿El proyecto crea, modifica o extiende entidades del catálogo (producto, variante, categoría, agrupador)?

Preguntas tipo:
- ¿Qué entidad técnica representa este concepto?
- ¿Es una entidad nueva o extiende una existente?
- ¿Afecta cómo se publica un producto?
- ¿Genera duplicación de datos?

---

### 2. Precio, margen y descuentos
¿El proyecto afecta cómo se calcula, muestra o cobra un precio?

Preguntas tipo:
- ¿Quién define el precio?
- ¿Quién puede modificarlo?
- ¿Quién asume el descuento?
- ¿Cómo se calcula la comisión/margen?
- ¿Qué pasa si el precio base cambia?

---

### 3. Inventario y stock
¿El proyecto crea nuevas unidades de stock o depende del stock de otras entidades?

Preguntas tipo:
- ¿Cómo se calcula la disponibilidad?
- ¿Qué pasa si el stock llega a cero?
- ¿Se descuenta stock correctamente al vender?
- ¿Hay riesgo de overselling?
- ¿El proveedor puede actualizar stock sin romper algo?

---

### 4. Garantías
¿El proyecto afecta cómo se asigna o gestiona una garantía?

Preguntas tipo:
- ¿La garantía aplica al nuevo concepto o a sus componentes?
- ¿Se puede reclamar garantía parcialmente?
- ¿Qué pasa si un componente tiene garantía y otro no?
- ¿Cómo lo ve soporte?
- ¿Requiere validación legal?

---

### 5. Órdenes y fulfillment
¿El proyecto afecta cómo se genera, procesa o despacha una orden?

Preguntas tipo:
- ¿Cómo llega la orden al proveedor?
- ¿El proveedor entiende lo que debe preparar?
- ¿Se genera una guía o varias?
- ¿Qué pasa si una parte de la orden no puede despacharse?
- ¿Cómo se calcula el tiempo de entrega?

---

### 6. Integraciones externas
¿El proyecto afecta lo que se sincroniza o publica en Shopify, Tienda Nube, Dropify u otros canales?

Preguntas tipo:
- ¿El canal externo soporta este tipo de entidad?
- ¿Cómo se representa el stock en el canal?
- ¿Cómo regresa la orden al sistema de Dropi?
- ¿Hay riesgo de que funcione en Dropi pero falle en el canal?
- ¿Qué canales quedan dentro del alcance del MVP?

---

### 7. Proveedor (experiencia y operación)
¿El proyecto cambia algo en la experiencia o flujo operativo del proveedor?

Preguntas tipo:
- ¿El proveedor necesita hacer algo diferente?
- ¿El proveedor fue consultado o notificado?
- ¿Afecta su panel, sus órdenes o sus reportes?
- ¿Tiene que validar, aprobar o configurar algo nuevo?
- ¿Puede generar confusión o rechazo del proveedor?

---

### 8. Dropshipper (experiencia)
¿El proyecto cambia algo en la experiencia del dropshipper?

Preguntas tipo:
- ¿El flujo es claro para el dropshipper?
- ¿Puede causar confusión con funcionalidades existentes?
- ¿Requiere comunicación o capacitación?

---

### 9. Devoluciones, cancelaciones y soporte
¿El proyecto genera nuevos casos que soporte debe gestionar?

Preguntas tipo:
- ¿Soporte sabe que este proyecto existe?
- ¿Puede identificar en una orden que proviene de este flujo?
- ¿Qué casos de devolución o reclamo genera?
- ¿Tiene herramientas para atenderlos?
- ¿Hay algún caso no cubierto?

---

### 10. Legal y términos
¿El proyecto requiere validación legal, nuevos términos o condiciones?

Preguntas tipo:
- ¿Hay un documento legal pendiente?
- ¿El flujo requiere consentimiento explícito del usuario?
- ¿Afecta condiciones comerciales entre Dropi, proveedor y dropshipper?
- ¿Hay riesgo regulatorio por país?

---

### 11. Performance y volumen técnico
¿El proyecto puede degradar el sistema con el volumen real de producción?

Preguntas tipo:
- ¿Hay consultas en tiempo real que podrían saturarse?
- ¿Beta replicó el volumen de producción?
- ¿Se consideró un cálculo nocturno o precalculado donde sea necesario?
- ¿Hay riesgo de caída bajo carga alta?

---

### 12. Métricas, medición y data
¿El proyecto tiene métricas definidas desde el inicio?

Preguntas tipo:
- ¿Cuál es la métrica principal?
- ¿Cuál es la línea base?
- ¿Cuál es el target?
- ¿Quién es el responsable de datos?
- ¿Los eventos están configurados para trackear desde el primer release?
- ¿Cómo se medirá la adopción?

---

### 13. Comunicación y lanzamiento
¿El proyecto tiene plan de lanzamiento definido antes de que desarrollo termine?

Preguntas tipo:
- ¿Quién comunica y a quién?
- ¿Hay manual o guía de uso?
- ¿Se necesita live o capacitación?
- ¿Soporte está informado?
- ¿La comunicación está lista antes del lanzamiento?

---

## Output esperado por proyecto

Al aplicar esta matriz, el agente debe generar:

1. **Tabla de estado por frente** — impacta / no aplica / pendiente / validado
2. **Lista de preguntas críticas sin resolver** → van como `Open Question` en `draft_insights`
3. **Lista de riesgos por frente no validado** → van como `Risk` en `risks`
4. **Lista de acciones de validación pendientes** → van como `Followup` en `followups`
5. **Veredicto de readiness** → listo / no listo / condicionado

---

## Regla de bloqueo

Si un frente está marcado como `Pendiente` y es crítico para el flujo principal,
el proyecto **no puede marcarse como listo para desarrollo** hasta resolver ese frente.

Frentes críticos (siempre bloquean si están pendientes):
- Modelo de producto / catálogo (si crea entidades nuevas)
- Órdenes y fulfillment (si toca el flujo de compra)
- Integraciones externas (si publica en canales)
- Legal (si hay documento o consentimiento requerido)
- Performance (si hay consultas en tiempo real con volumen alto)
