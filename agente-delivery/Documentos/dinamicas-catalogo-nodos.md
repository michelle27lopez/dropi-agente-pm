# Dinámicas de Catálogo — Documentación de nodos del Graph Builder

**Proyecto:** DCA-001 · Catálogo Preseleccionado  
**Experimento:** Lean MVP antes de desarrollo  
**Herramienta:** Graph Builder · Prototipo 1  
**Última actualización:** 2026-06-02 · Nodos 1–7 completos · Flujo reducido a 10 nodos (Validación eliminada)

Este documento recoge el handoff completo de cada nodo del flujo de creación de campañas de Dinámicas de Catálogo. Sirve como fuente de verdad para la célula, para el equipo de diseño y para generar documentos de proceso formales.

---

## Flujo general — 10 nodos

> Nodo 7 (Validación Dropi) eliminado del flujo. La validación/curaduría se integra dentro del Nodo 6 (Postulación) y el Nodo 7 (Vitrina).

```
[1] Nueva campaña
    → [2] Tipo de campaña
       → [3] Segmentación
          → [4] Reglas de participación
             → [5] Convocatoria supplier
                → [6] Postulación de productos
                   → [7] Construir vitrina
                      → [8] Documento handoff
                         → [9] Medición del piloto
                            → [10] Decisión final
```

---

## Plan de Alineación de Campañas (Marketing)

Este plan define la estrategia de alineación entre los equipos de Célula, Producto, Comercial y Marketing para el ciclo de vida, la comunicación y la vitrina de las campañas del catálogo de Dropi.

### 1. Ciclo de Vida y Fases de Campaña (Duración: 4 meses)
Para campañas de alto impacto (ej. Dropicup Mundial, Black Days, Navidad), se establece un cronograma estándar de **4 meses** para asegurar el correcto flujo de captación de proveedores y la maduración de las ventas:
*   **Fase 1: Conceptualización (15 días):** Diseño del hilo conductor de la campaña, la narrativa visual, preparación de los lives comerciales y definición del segmento objetivo de proveedores.
*   **Fase 2: Construcción y Recepción (1 mes):**
    *   *Expectación:* Lanzamiento de popups de votación de categorías favoritas para dropshippers vía User Pilot.
    *   *Convocatoria:* Envío del Contacto 1 a proveedores para postularse.
    *   *Curaduría y Preparación:* Evaluación manual de propuestas de productos por parte de Comercial/Supplier Success (según reglas del Nodo 4). Aprobación y envío del Contacto 2 para que vistan sus imágenes.
*   **Fase 3: Campaña Activa (1.5 a 2.5 meses):** Publicación de la vitrina en catálogo. Los dropshippers importan productos, preparan sus creativos de pauta, configuran campañas y comienzan la venta. La campaña permanece activa hasta 1 semana después del evento comercial principal.
*   **Fase 4: Cierre y Medición (1 semana):** Retiro de la vitrina y categorías, recopilación de resultados (órdenes, GMV, adopción) y toma de decisión de continuidad o escalamiento (Nodo 10).

### 2. Esquema de Comunicación en Dos Contactos
Para evitar que los proveedores utilicen de forma indebida el material gráfico oficial (marcos) en productos no curados o de baja calidad, la comunicación con proveedores se divide en dos contactos independientes:
1.  **Contacto 1 (Convocatoria y Registro):**
    *   **Objetivo:** Invitar a los proveedores a registrarse e indicar qué productos les gustaría pautar y bajo qué condiciones. **No incluye las piezas gráficas ni marcos.**
    *   **Canales:** Popups y banners in-app en User Pilot segmentados por ID de proveedor (Premium/Exclusivos), reforzado con mensajes masivos por CRM (WhatsApp y Email).
    *   **CTA:** Enlace a formulario de postulación externo (Tally o Google Form).
2.  **Contacto 2 (Aprobación e Instrucciones Operativas):**
    *   **Objetivo:** Comunicar la aprobación formal a los proveedores seleccionados y dar las pautas técnicas para vestir el producto.
    *   **Canales:** Mensaje directo vía CRM (Email o WhatsApp corporativo) del gestor comercial.
    *   **Contenido:** Enlace a la sublanding de marcos (`dropi.co`) donde colocarán el marco oficial a sus fotos, palabra clave obligatoria para el título de sus productos (ej. "Mundialist") y asignación de la categoría temporal en el panel de administración.

### 3. Estrategia de Vitrina y Visibilidad MVP
La vitrina para dropshippers se construye usando herramientas ya existentes sin sobrecargar al equipo de desarrollo (IT):
*   **Categoría Temporal en Admin:** Se crea una categoría temporal desde el panel administrativo de Dropi. Los proveedores seleccionados asocian sus productos a esta y les agregan la palabra clave requerida en el título.
*   **Banners Prefiltrados y Segmentados:** Un banner destacado en la sección de catálogo de la plataforma redirige a la URL prefiltrada por la categoría/palabra clave. Estos banners y enlaces están segmentados por país para que cada dropshipper vea únicamente el inventario disponible localmente.
*   **Flyer en el Home:** Una gráfica en el Home de la plataforma permite la descarga del catálogo completo en PDF para que los dropshippers de pauta directa los revisen rápidamente.
*   **Sublanding de Marcos:** Herramienta web en un subdominio de `dropi.co` donde el proveedor sube su foto y el sistema le renderiza automáticamente la imagen con el marco oficial aplicado, evitando la descarga libre del archivo editable original.

---


## Nodo 1 — Nueva campaña

**Color:** Naranja Dropi (`#f39a33`)  
**Ícono:** ➕  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Crear la ficha base de una nueva dinámica de catálogo. Este nodo funciona como el punto de partida del experimento y define la identidad, intención comercial, alcance inicial y responsable de la campaña.

Este nodo **no define** todavía segmentos, reglas, productos ni canales. Solo deja creada la campaña como contenedor principal para que los demás nodos puedan completarla.

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero crear una nueva campaña de catálogo para registrar su nombre, objetivo, alcance inicial, fechas, responsable e hipótesis, de forma que la célula pueda entender qué dinámica se va a probar antes de avanzar a segmentación, reglas, convocatoria y ejecución.

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Ejemplos / Opciones |
|---|-------|-------------|------|---------------------|
| 1 | Nombre de la campaña | Sí | Texto libre | Dropicup Mundial, Black Week, Remates de Stock, Amor y Amistad, Belleza de Temporada, Tecnología Alto Margen, Productos para Pauta |
| 2 | Descripción corta | Sí | Texto libre | "Campaña para agrupar productos relacionados con el mundial y validar si una vitrina curada aumenta la adopción de dropshippers." |
| 3 | Objetivo principal | Sí | Selección | Aumentar órdenes · Generar GMV · Activar productos quietos · Dar visibilidad a suppliers · Ayudar a suppliers a salir de stock · Validar interés de dropshippers · Activar suppliers nuevos · Validar una categoría específica · Validar productos con descuento |
| 4 | Tipo de experimento | Sí | Selección | Campaña manual · Vitrina manual · Categoría temporal beta · Campaña vía comunicación comercial · Campaña vía GHL · Campaña vía Userpilot · Campaña vía WhatsApp · Campaña mixta |
| 5 | País o mercado | Sí | Selección | Colombia · México · Chile · Ecuador · Multipaís |
| 6 | Fecha inicio convocatoria supplier | Sí | Fecha | — |
| 6 | Fecha cierre postulación supplier | Sí | Fecha | — |
| 6 | Fecha publicación para dropshippers | Sí | Fecha | — |
| 6 | Fecha cierre de campaña | Sí | Fecha | — |
| 7 | Responsable | Sí | Selección / Texto | Producto · Growth · Comercial · Supplier Success · Comunicaciones · Responsable específico |
| 8 | Estado inicial | Sí | Fijo | **Borrador** |
| 9 | Hipótesis asociada | Sí | Texto libre | "Si Dropi crea una campaña curada del mundial, los suppliers estarán dispuestos a postular productos por mayor visibilidad o salida de stock, y los dropshippers tendrán mayor intención de explorarlos." |
| 10 | Resultado esperado | Sí | Texto libre | "Validar si una campaña manual genera participación supplier, adopción dropshipper y señales iniciales de órdenes o GMV." |

> [!NOTE]
> **Ciclo de Vida de la Campaña (Alineación con Marketing)**:
> Se establece una duración estándar de **4 meses** para campañas robustas (ej. Navidad, Dropicup, Black Days), dividida en las siguientes fases:
> 1. **Fase 1: Conceptualización (15 días)**: Diseño de narrativa, hilo conductor, lives, y segmentación inicial.
> 2. **Fase 2: Construcción y Recepción (1 mes)**: Campaña de expectativa y votación de categorías para dropshippers, convocatoria y recepción de propuestas de suppliers, curaduría y aprobación, y vestido de imágenes.
> 3. **Fase 3: Campaña Activa (1.5 a 2.5 meses)**: Margen para que los dropshippers prueben el producto, organicen creativos y pauten. Termina **1 semana después** de la fecha comercial/evento.
> 4. **Fase 4: Cierre y Medición (1 semana)**: Recopilación de resultados y toma de decisiones.

### Output del nodo

Al completar este nodo debe quedar creada una campaña en estado **Borrador** con:

- Nombre definido
- Descripción corta
- Objetivo principal
- Tipo de experimento
- País o mercado
- Fechas base (4 fechas alineadas con las fases de 4 meses)
- Responsable asignado
- Hipótesis registrada
- Resultado esperado documentado

### Criterios de aceptación

- [ ] La campaña tiene nombre
- [ ] La campaña tiene descripción corta
- [ ] La campaña tiene objetivo principal
- [ ] La campaña tiene tipo de experimento
- [ ] La campaña tiene país o mercado definido
- [ ] La campaña tiene las fechas base alineadas al ciclo de 4 meses
- [ ] La campaña tiene responsable
- [ ] La campaña queda en estado inicial "Borrador"
- [ ] La campaña tiene hipótesis asociada
- [ ] La campaña tiene resultado esperado
- [ ] La información registrada permite avanzar al siguiente nodo: Tipo de campaña / dinámica

**Nodo siguiente:** Nodo 2 — Tipo de campaña

---

## Nodo 2 — Tipo de campaña

**Color:** Naranja Dropi (`#f39a33`)  
**Ícono:** 🏷️  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Definir la mecánica comercial que tendrá la campaña creada en el nodo anterior. Este nodo responde qué tipo de dinámica se va a probar y qué comportamiento esperamos activar en suppliers y dropshippers.

Este nodo es clave porque condiciona los siguientes pasos del flujo: segmentación, reglas de participación, convocatoria, postulación, curaduría, vitrina, medición y handoff a la célula.

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero definir el tipo de campaña o dinámica comercial que vamos a ejecutar, para establecer si la campaña será de visibilidad, descuento, remate, temporada, categoría, productos quietos, suppliers nuevos, alto margen, combos, proveedor destacado o una combinación de varias.

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Opciones |
|---|-------|-------------|------|----------|
| 1 | Tipo principal de campaña | Sí | Selección | Ver catálogo de tipos abajo |
| 2 | ¿Requiere descuento? | Sí | Selección | Sí · No · Opcional · Depende del producto · Depende del supplier |
| 3 | ¿Requiere precio de campaña? | Sí | Selección | Sí · No · Opcional |
| 4 | ¿Tiene fecha de expiración? | Sí | Selección | Sí · No *(recomendado: Sí en el MVP)* |
| 5 | Motivador principal del supplier | Sí | Selección | Mayor visibilidad · Salir de stock · Vender más volumen · Activar producto nuevo · Mover producto quieto · Conseguir primeras órdenes · Ganar adopción de dropshippers · Destacar su catálogo · Mejorar rotación |
| 6 | Qué se quiere mover | Sí | Selección | Órdenes · GMV · Unidades · Productos quietos · Suppliers nuevos · Categoría específica · Productos con alto stock · Productos con descuento · Productos con primera venta pendiente · Catálogos de suppliers estratégicos |

---

### Catálogo de tipos de campaña

#### 1. Campaña de temporada
Campañas creadas por Dropi alrededor de momentos comerciales claros.

**Ejemplos:** Dropicup Mundial · Black Week · Amor y Amistad · Navidad · Día de la Madre · Regreso a clases · Halloween · Cyber Days

**Objetivo:** Mover órdenes y GMV aprovechando una fecha donde los dropshippers pueden pautar con contexto comercial.

**Motivador supplier:** Mayor visibilidad, aumento de rotación y oportunidad de vender más volumen.

**Requiere descuento:** Opcional — puede ser solo visibilidad o incluir precio especial.

---

#### 2. Campaña de remate
Campañas pensadas para suppliers que quieren salir de stock quieto, inventario acumulado o productos de baja rotación.

**Ejemplos:** Remates de Stock · Últimas unidades · Productos con baja rotación · Liquidación de inventario · Productos dormidos con descuento · Bodega en remate

**Objetivo:** Ayudar al supplier a mover inventario quieto y validar si el dropshipper responde a productos con precio atractivo.

**Motivador supplier:** Salir de stock, liberar inventario y recuperar capital.

**Requiere descuento:** Sí, o al menos precio especial de campaña.

---

#### 3. Campaña de visibilidad
Campañas donde el principal beneficio no es el descuento, sino la exposición dentro de una vitrina curada por Dropi.

**Ejemplos:** Productos seleccionados por Dropi · Productos recomendados para dropshippers · Suppliers destacados de la semana · Nuevos productos con potencial · Productos listos para pauta · Top oportunidades del catálogo

**Objetivo:** Validar si el supplier participa por mayor visibilidad, incluso cuando no hay descuento obligatorio.

**Motivador supplier:** Mayor exposición frente a dropshippers y posibilidad de adopción.

**Requiere descuento:** No.

---

#### 4. Campaña por categoría
Campañas que agrupan productos por categoría, temática o intención comercial.

**Ejemplos:** Belleza de temporada · Hogar y organización · Tecnología alto margen · Mascotas · Fitness · Moda y accesorios · Productos para cocina · Productos virales

**Objetivo:** Facilitarle al dropshipper encontrar productos según una oportunidad clara de venta.

**Motivador supplier:** Entrar a una vitrina curada de alta intención comercial.

**Requiere descuento:** Opcional.

---

#### 5. Campaña de productos quietos
Campañas enfocadas en productos publicados que no han tenido suficiente movimiento.

**Ejemplos:** Productos sin órdenes en 30/60/90 días · Productos con stock alto y baja venta · Productos con primera venta pendiente · Catálogo dormido · Reactivación de productos

**Objetivo:** Pasar de productos "publicados" a productos "activados" comercialmente.

**Motivador supplier:** Activar catálogo dormido, mover productos quietos y generar primeras órdenes.

**Requiere descuento:** Opcional, pero recomendado para aumentar atractivo.

---

#### 6. Campaña para suppliers nuevos
Campañas pensadas para acelerar el Time to Value de suppliers recién activados o verificados.

**Ejemplos:** Nuevos suppliers destacados · Primeros productos en vitrina · Proveedores recién verificados · Activa tus primeras órdenes · Nuevos catálogos de la semana

**Objetivo:** Ayudar a que suppliers nuevos reciban visibilidad y validen rápido si sus productos generan interés.

**Motivador supplier:** Conseguir primeras órdenes, adopción inicial y visibilidad dentro del ecosistema.

**Requiere descuento:** No necesariamente.

---

#### 7. Campaña de alto margen para dropshippers
Campañas que agrupan productos atractivos por rentabilidad.

**Ejemplos:** Productos con alto margen · Productos para escalar pauta · Productos con buen ticket · Productos con buena rentabilidad · Oportunidades para dropshippers top

**Objetivo:** Atraer dropshippers con productos que tengan una promesa comercial clara.

**Motivador supplier:** Mayor adopción de dropshippers y potencial de venta recurrente.

**Requiere descuento:** No necesariamente — puede depender del margen existente.

---

#### 8. Campaña de combos
Campañas enfocadas en productos agrupados para aumentar ticket, rotación o atractivo comercial.

**Ejemplos:** Combos con descuento · Combos por temporada · Combos sugeridos por supplier · Combo mundial: camiseta + vaso + decoración · Combo belleza: shampoo + cepillo + acondicionador

**Objetivo:** Mover varios productos juntos y aumentar el atractivo comercial para el dropshipper.

**Motivador supplier:** Aumentar rotación, mover productos complementarios y mejorar ticket promedio.

**Requiere descuento:** Opcional, pero puede ser un incentivo fuerte.

---

#### 9. Campaña por proveedor destacado
Campañas enfocadas en darle visibilidad a suppliers específicos, no solo a productos individuales.

**Ejemplos:** Supplier destacado de la semana · Bodega destacada · Proveedor premium destacado · Proveedor con despacho rápido · Proveedor con alto stock · Proveedor verificado

**Objetivo:** Impulsar suppliers estratégicos, con buen cumplimiento o con potencial comercial.

**Motivador supplier:** Mayor exposición de su catálogo completo o de una selección de productos.

**Requiere descuento:** No.

---

#### 10. Campaña mixta
Campañas que combinan varias lógicas en una misma dinámica.

**Ejemplo:** Dropicup Mundial puede ser simultáneamente: campaña de temporada + vitrina de visibilidad + productos con descuento opcional + remates de productos relacionados + productos para pauta.

**Objetivo:** Validar varios motivadores dentro de una misma campaña.

**Motivador supplier:** Visibilidad, rotación, salida de stock o adopción de dropshippers.

**Requiere descuento:** Opcional según producto o supplier.

---

### Output del nodo

Al completar este nodo la campaña debe tener definido:

- Tipo principal de campaña seleccionado
- Si requiere descuento o precio especial de campaña
- Si tiene fecha de expiración
- Motivador principal del supplier
- Qué se quiere mover con la campaña
- Información suficiente para condicionar la segmentación, las reglas de participación y la convocatoria

### Criterios de aceptación

- [ ] La campaña tiene tipo principal de campaña seleccionado
- [ ] Está definido si requiere descuento
- [ ] Está definido si requiere precio de campaña
- [ ] Está definida la fecha de expiración
- [ ] El motivador principal del supplier está seleccionado
- [ ] Está definido qué se quiere mover con la campaña
- [ ] La combinación de campos es coherente (ej: remate → descuento requerido)
- [ ] La información del nodo permite avanzar al nodo de segmentación

**Nodo siguiente:** Nodo 3 — Segmentación

---

## Nodo 3 — Segmentación

**Color:** Azul (`#49a8ff`)  
**Ícono:** 👥  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Definir a qué suppliers, productos, categorías o mercados se les habilitará la campaña, usando una lógica de condiciones tipo query.

Este nodo no es una lista manual. Debe funcionar como una estructura de segmentación que permita expresar: *suppliers que cumplen estas condiciones Y tienen estos productos O fueron recomendados por comercial, pero excluyendo casos con riesgo operativo o productos incompletos.*

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero definir el segmento objetivo de una campaña mediante condiciones claras de inclusión, condiciones opcionales y exclusiones, para identificar qué suppliers y productos serán invitados o considerados dentro del experimento.

### Lógica del nodo — estructura tipo query

```
Incluir suppliers/productos que cumplan:
  Condición A (AND)
  Condición B (AND)
  Condición C (AND)

También permitir (opcionales):
  Condición D (OR)
  Condición E (OR)

Excluir:
  Condición F (OR)
  Condición G (OR)
```

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Notas |
|---|-------|-------------|------|-------|
| 1 | Universo base | Sí | Selección | Ver opciones abajo. MVP recomendado: Suppliers + productos |
| 2 | Condiciones obligatorias | Sí | Texto libre | Reglas AND que deben cumplirse sí o sí |
| 3 | Condiciones opcionales | No | Texto libre | Reglas OR para incluir por oportunidad comercial |
| 4 | Exclusiones | Sí | Texto libre | Casos que quedan fuera sin excepción |
| 5 | Tamaño esperado del segmento | Sí | Texto libre | MVP: 20–50 suppliers o 50–150 productos |
| 6 | Fuente de datos | Sí | Multiselección | De dónde sale la información para construir el segmento |
| 7 | Responsable de segmentación | Sí | Selección | Quién construye y valida la lista |
| 8 | Notas y contexto | No | Texto libre | Restricciones, contexto adicional, datos faltantes |

> [!NOTE]
> **Segmentación por IDs en User Pilot**:
> Es posible segmentar la comunicación in-app (popups, banners) a nivel de proveedor cargando una base de datos actualizada de IDs de proveedores (Premium, Exclusivos, Verificados) provista por el equipo comercial. User Pilot validará estos IDs en el inicio de sesión para activar el flujo de la campaña correspondiente de manera automática para el segmento.

**Opciones — Universo base:** Suppliers + productos · Solo suppliers · Solo productos · Categorías · País / mercado · Base comercial manual · Campaña anterior · Lista cargada en Sheet

**Opciones — Fuente de datos:** Comercial · CRM / GHL · Userpilot · Base de productos · Reporte de stock · Reporte de órdenes · Reporte de productos sin venta · Reporte de alto stock · Sheet manual · Recomendación Supplier Success · Data de campañas anteriores

**Opciones — Responsable:** Producto · Comercial · Supplier Success · Growth · Data · Operación · Líder de campaña

---

### Casos de uso documentados

#### Caso 1 — Dropicup Mundial (campaña de temporada)
```
Universo: Suppliers + productos

Condiciones obligatorias:
  Supplier país = Colombia
  AND Supplier estado = Verificado
  AND Supplier tiene contacto válido
  AND Producto activo = Sí
  AND Stock producto >= 20
  AND Categoría relacionada con fútbol / accesorios / hogar / tecnología

Condiciones opcionales:
  OR Producto recomendado por comercial = Sí
  OR Producto con potencial para pauta = Sí

Exclusiones:
  Producto sin stock = Sí
  OR Producto sin imagen = Sí
  OR Supplier con alerta operativa crítica = Sí

Output: Lista de suppliers candidatos + productos por categoría
```

#### Caso 2 — Remates de Stock
```
Universo: Suppliers + productos

Condiciones obligatorias:
  Supplier tiene productos activos
  AND Supplier tiene contacto válido
  AND Producto activo = Sí
  AND Stock producto >= 50
  AND Supplier acepta precio especial o descuento

Condiciones opcionales:
  OR Producto sin órdenes en últimos 30/60/90 días
  OR Producto con alto stock sin rotación

Exclusiones:
  Producto sin imagen = Sí
  OR Producto sin precio claro = Sí
  OR Supplier con problemas de despacho = Sí

Output: Lista de productos para remate + motivo documentado
```

#### Caso 3 — Productos seleccionados por Dropi (visibilidad)
```
Universo: Productos

Condiciones obligatorias:
  Producto activo = Sí
  AND Ficha completa = Sí
  AND Imagen válida = Sí
  AND Stock >= 20
  AND Supplier con buen cumplimiento = Sí

Condiciones opcionales:
  OR Producto recomendado por comercial = Sí
  OR Producto con alto margen = Sí
  OR Producto nuevo con buena ficha = Sí

Exclusiones:
  Producto sin stock = Sí
  OR Supplier con alerta operativa crítica = Sí

Output: Productos candidatos para vitrina + suppliers para invitación por visibilidad
```

#### Caso 4 — Suppliers nuevos destacados
```
Universo: Suppliers + productos

Condiciones obligatorias:
  Supplier estado = Recién verificado
  AND Supplier fecha activación <= últimos 30 días
  AND Supplier tiene productos activos
  AND Supplier tiene contacto válido

Condiciones opcionales:
  OR Supplier recomendado por comercial = Sí

Exclusiones:
  Supplier sin contacto = Sí
  OR Producto sin stock = Sí
  OR Producto sin imagen = Sí

Output: Lista de suppliers nuevos + productos iniciales destacados
```

#### Caso 5 — Alto margen para dropshippers
```
Universo: Productos

Condiciones obligatorias:
  Producto activo = Sí
  AND Stock >= 20
  AND Margen estimado >= X%
  AND Supplier con buen cumplimiento = Sí

Condiciones opcionales:
  OR Producto con buen ticket promedio
  OR Producto recomendado por Growth

Exclusiones:
  Producto sin stock = Sí
  OR Producto con precio no competitivo = Sí

Output: Lista de productos con margen atractivo para vitrina o comunicación dropshippers
```

---

### Plantilla de segmentación para el MVP

Para el MVP no se construye un query builder en plataforma. Se implementa como plantilla en Sheet con columnas que representen las condiciones.

**Columnas sugeridas:**
Supplier · País · Estado supplier · Verificado · Contacto disponible · Comercial responsable · Producto · ID producto · Categoría · Producto activo · Stock · Precio · Imagen · Ficha completa · Órdenes 30d · Órdenes 60d · Órdenes 90d · Baja rotación · Alto stock · Recomendado por comercial · Aplica a campaña · Motivo de inclusión · Motivo de exclusión · Estado segmentación (Candidato / Excluido / Requiere revisión / Priorizado)

### Output del nodo

Al completar este nodo la campaña debe tener:

- Universo base definido
- Condiciones obligatorias documentadas en lenguaje natural
- Condiciones opcionales documentadas
- Exclusiones documentadas
- Tamaño esperado del segmento definido
- Fuente de datos definida
- Responsable de segmentación asignado
- Lista inicial de suppliers/productos candidatos (o plan para generarla)

### Criterios de aceptación

- [ ] Se definió el universo base de segmentación
- [ ] Se definieron condiciones obligatorias
- [ ] Se definieron condiciones opcionales
- [ ] Se definieron exclusiones
- [ ] Se definió el tamaño esperado del segmento
- [ ] Se definió la fuente de datos
- [ ] Se definió el responsable de segmentación
- [ ] Se documentó la query en lenguaje natural
- [ ] Se documentó la query en formato de condiciones
- [ ] Se puede explicar por qué cada supplier/producto entra o queda fuera
- [ ] La información permite avanzar al siguiente nodo: Reglas de participación

**Nodo siguiente:** Nodo 4 — Reglas de participación

---

## Nodo 4 — Reglas de participación

**Color:** Azul (`#49a8ff`)  
**Ícono:** 📏  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Establecer las reglas mínimas para que un producto o supplier sea aceptado en la campaña. Este nodo protege la experiencia del dropshipper y evita que Dropi dé visibilidad a productos con mala ficha, sin stock, bajo cumplimiento o poca relación con la campaña.

> El nodo anterior (Segmentación) define a quién vamos a mirar. Este nodo define quién realmente puede entrar.

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero definir las condiciones mínimas de participación para filtrar automáticamente qué productos y suppliers son elegibles, cuáles requieren ajuste y cuáles quedan descalificados.

### Estructura del nodo — 5 bloques de reglas

| Bloque | Qué valida | Ejemplos |
|--------|------------|---------|
| **Supplier** | Si el proveedor puede participar | Activo, verificado, sin alertas, contacto válido, capacidad de despacho |
| **Producto** | Si el producto está en condiciones de entrar | Activo, con stock, con imagen, con precio, categoría alineada |
| **Comercial** | Según el tipo de campaña | Descuento, precio especial, margen mínimo, vigencia de precio |
| **Operativo** | Que no genere problemas post-campaña | Bajo nivel de cancelaciones, tiempo de despacho, sin novedades críticas |
| **Específica** | Reglas únicas de esta campaña | Relación con la temática, umbrales propios, condiciones del experimento |

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Notas |
|---|-------|-------------|------|-------|
| 1 | Reglas obligatorias | Sí | Condition builder (AND) | Sin estas, el producto no puede entrar |
| 2 | Reglas recomendadas | No | Condition builder (AND) | Ayudan a priorizar pero no bloquean |
| 3 | Reglas excluyentes | Sí | Condition builder (OR) | Si se cumple una, descalifica automáticamente |
| 4 | Stock mínimo requerido | Sí | Número | ej. 20 unidades |
| 5 | Descuento mínimo (%) | No | Número | Solo si aplica a la campaña |
| 6 | Margen mínimo (%) | No | Número | Solo si aplica |
| 7 | Máx. productos por supplier | No | Número | ej. 5 |
| 8 | ¿Requiere vigencia de precio? | Sí | Selección | Obligatorio / No aplica / Depende |
| 9 | Reglas específicas de esta campaña | No | Texto libre | Condiciones únicas que no aplican genéricamente |
| 10 | Criterios de elegibilidad | Sí | Texto libre | Describe cuándo aprobar, rechazar, pedir ajuste o marcar excepción |

### Estados de evaluación

| Estado | Cuándo aplica |
|--------|---------------|
| **Elegible** | Cumple todas las reglas obligatorias |
| **Requiere ajuste** | Cumple las principales pero falta algo corregible (ej. imagen) |
| **No elegible** | Incumple una regla bloqueante |
| **Pendiente de validación** | Requiere revisión manual |
| **Aprobado por excepción** | No cumple todo pero se aprueba con justificación documentada |

### Ejemplos de reglas por tipo de campaña

#### Dropicup Mundial
```
Obligatorias (AND):
  Producto activo = Sí
  Stock >= 20
  Producto tiene imagen = Sí
  Precio vigente = Sí
  Campaña: Relación con temática = Sí

Recomendadas:
  Producto con buen margen
  Recomendado por comercial

Excluyentes (OR):
  Producto sin stock = Sí
  Producto sin imagen = Sí
  Supplier con alerta operativa crítica = Sí
  Producto fuera de categoría = Sí
```

#### Remates de Stock
```
Obligatorias (AND):
  Producto activo = Sí
  Stock >= 50
  Campaña: Descuento definido = Sí
  Campaña: Vigencia de precio = Sí
  Campaña: Supplier acepta participar = Sí

Recomendadas:
  Producto con baja rotación = Sí
  Órdenes últimos 90 días <= 5

Excluyentes (OR):
  Producto sin stock = Sí
  Producto sin imagen = Sí
  Operativo: Novedades críticas = Sí
```

#### Productos seleccionados por Dropi (visibilidad)
```
Obligatorias (AND):
  Producto activo = Sí
  Stock >= 20
  Producto tiene imagen = Sí
  Producto ficha completa = Sí
  Supplier buen cumplimiento = Sí

Recomendadas:
  Producto con potencial para pauta = Sí
  Campaña: Margen cumple mínimo = Sí

Excluyentes (OR):
  Producto sin stock = Sí
  Producto sin imagen = Sí
  Producto ficha incompleta = Sí
  Operativo: Alerta operativa crítica = Sí
```

### Output del nodo

Al completar este nodo debe quedar:

- Reglas obligatorias definidas y documentadas
- Reglas recomendadas definidas
- Reglas excluyentes definidas
- Umbrales numéricos especificados (stock, descuento, margen, máx. productos)
- Criterios de elegibilidad documentados
- Estados de evaluación claros (elegible / requiere ajuste / no elegible / excepción)

### Criterios de aceptación

- [ ] Se definieron reglas obligatorias con al menos: supplier activo, producto activo, stock mínimo e imagen
- [ ] Se definieron reglas excluyentes con al menos: sin stock, sin imagen, alerta operativa crítica
- [ ] Se definió el stock mínimo como umbral numérico
- [ ] Se definió si requiere vigencia de precio
- [ ] Se documentaron los criterios para los 5 estados de evaluación
- [ ] Las reglas son coherentes con el tipo de campaña del Nodo 2
- [ ] Las reglas no contradicen las exclusiones del Nodo 3
- [ ] La información permite avanzar al siguiente nodo: Convocatoria supplier

**Nodo siguiente:** Nodo 5 — Convocatoria supplier

---

## Nodo 5 — Convocatoria supplier

**Color:** Azul (`#49a8ff`)  
**Ícono:** 📣  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Definir el canal, mensaje, audiencia y seguimiento de la convocatoria para invitar a los suppliers seleccionados a participar en la campaña. Este nodo valida una de las hipótesis principales del experimento: *si Dropi ofrece visibilidad o la oportunidad de rematar productos, ¿los suppliers realmente muestran intención de participar?*

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero definir cómo se comunica la campaña a los suppliers para llevarlos a postular productos, midiendo cuántos fueron invitados, cuántos respondieron, cuántos se interesaron y cuántos postularon.

### Campos del nodo

> [!IMPORTANT]
> **Esquema de Comunicación en 2 Contactos (Alineación con Marketing)**:
> Para evitar que los proveedores utilicen el material gráfico o vistan sus productos sin la debida curaduría, la convocatoria se divide en dos fases independientes:
> 1. **Contacto 1 (Convocatoria / Registro)**:
>    - **Objetivo**: Comunicar la campaña e invitar a los proveedores a postularse. No contiene las piezas de diseño ni instrucciones de marcos.
>    - **Canales**: User Pilot (popup emergente configurado al inicio de sesión segmentado por IDs de proveedores premium/exclusivos) y CRM directo (WhatsApp/Email/GHL).
>    - **CTA**: Link al formulario de captura (Google Form o Tally).
> 2. **Contacto 2 (Aprobación e Instrucciones)**:
>    - **Objetivo**: Notificar a los proveedores aprobados (tras la revisión en el Nodo 6) y dar las instrucciones operativas.
>    - **Canales**: CRM (Email y WhatsApp corporativo).
>    - **Contenido**: Enlace a la sublanding de marcos (`dropi.co`) donde subirán sus fotos para aplicar el marco, palabra clave requerida para el nombre, y asignación de la categoría temporal de la campaña.

| # | Campo | Obligatorio | Tipo | Notas |
|---|-------|-------------|------|-------|
| 1 | Tipo de convocatoria | Sí | Selección con descripción | Ver tipos abajo |
| 2 | Canal principal | Sí | Selección | Canal primario de contacto |
| 3 | Canal secundario | No | Selección | Refuerzo del canal principal |
| 4 | Motivador principal del mensaje | Sí | Selección con descripción | Define el tono y ángulo del mensaje |
| 5 | Mensaje base de convocatoria | Sí | Textarea | Ver estructura mínima abajo |
| 6 | Call to action (CTA) | Sí | Selección | Acción que se pide al supplier |
| 7 | Link de postulación | Sí | URL / texto | Form, Sheet, GHL o contacto comercial |
| 8 | Fecha límite de postulación | Sí | Fecha | |
| 9 | Responsable del envío | Sí | Selección | |
| 10 | Lista de suppliers a convocar | Sí | Texto libre | Puede venir del Nodo 3 |
| 11 | Estado de la convocatoria | Sí | Selección | Pendiente / Enviada / En seguimiento / Completada |

---

### Tipos de convocatoria

| Tipo | Cuándo aplica | Ejemplo |
|------|---------------|---------|
| **Abierta** | Grupo amplio, reglas básicas | Remates, Black Week, temporadas grandes |
| **Segmentada** | Suppliers que cumplen condición específica | Dropicup, belleza, mascotas |
| **Por invitación** | Mensaje personalizado | Suppliers estratégicos o con alto potencial |
| **Comercial manual** | Contacto directo del comercial | Recomendado para el MVP — respuesta más rápida |
| **Mixta** | Invitación directa + apertura al segmento | Campañas grandes con mezcla de suppliers |

### Canales disponibles

Comercial directo · WhatsApp · GHL · Email · Userpilot · Modal in-app · Banner in-app · Llamada · Comunidad / grupo

### Estructura mínima del mensaje base

```
1. Nombre de la campaña
2. Beneficio para el supplier (visibilidad / salida de stock / primera venta)
3. Qué productos puede postular
4. Si aplica descuento o precio especial
5. Fecha límite de postulación
6. CTA claro con link
```

### Ejemplos de mensajes por motivador

#### Visibilidad
> "Dropi está preparando una vitrina especial para dropshippers. Queremos invitarte a postular productos con buen stock y potencial comercial para que puedan ser destacados dentro de la campaña."

#### Remate / salida de stock
> "Si tienes productos con stock quieto, baja rotación o inventario que quieras mover, puedes postularlos a una campaña de remates para darles mayor visibilidad frente a dropshippers."

#### Mixto (Dropicup / temporada)
> "Participa postulando productos relacionados con la campaña. Puedes postular productos para ganar visibilidad o productos que quieras mover con precio especial."

#### Por invitación (personalizado)
> "Tu catálogo fue identificado como candidato para [nombre campaña]. Queremos invitarte a postular productos con buen stock y potencial comercial para darles mayor visibilidad frente a dropshippers."

### Métricas que debe registrar este nodo

| Métrica | Cómo capturarla |
|---------|-----------------|
| Suppliers convocados | Conteo en tabla de control |
| Mensajes enviados | Registro por canal |
| Respuestas | Respuesta = interesado o rechazó |
| Suppliers interesados | Respondió positivamente |
| Suppliers que postularon | Completaron el form / enviaron productos |
| Motivo declarado | Visibilidad / Remate / Activación / Otro |
| Tiempo inv. → postulación | Fecha envío vs. fecha postulación |

### Tabla de control para el MVP

Para el MVP no se automatiza. Se maneja con una tabla:

| Supplier | Canal | Responsable | Fecha envío | Estado | Respondió | Motivo | Link |
|----------|-------|-------------|-------------|--------|-----------|--------|------|

**Estados:** Pendiente · Enviado · En seguimiento · Interesado · No interesado · Postuló productos · No respondió

### Output del nodo

Al finalizar este nodo debe quedar:

- Tipo y canal de convocatoria definidos
- Mensaje base redactado
- CTA y link de postulación listos
- Fecha límite comunicada
- Responsable asignado
- Lista de suppliers a contactar
- Registro de estado de envío y respuestas

### Criterios de aceptación

- [ ] Tipo de convocatoria definido
- [ ] Canal principal (y secundario si aplica) definido
- [ ] Motivador del mensaje definido
- [ ] Mensaje base redactado con estructura mínima (campaña, beneficio, productos, descuento, fecha, CTA)
- [ ] CTA definido
- [ ] Link de postulación disponible y válido
- [ ] Fecha límite de postulación definida
- [ ] Responsable de envío asignado
- [ ] Lista de suppliers a convocar referenciada (del Nodo 3 o documentada)
- [ ] La información permite avanzar al siguiente nodo: Postulación de productos

**Nodo siguiente:** Nodo 6 — Postulación de productos

---

## Nodo 6 — Postulación de productos

**Color:** Púrpura (`#a875ff`)  
**Ícono:** 📝  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Recibir y ordenar los productos postulados por los suppliers para la campaña, dejando registrada la información mínima necesaria para que Dropi pueda revisarlos, aprobarlos o pedir ajustes. Este nodo valida si la campaña genera interés real: el supplier ya fue convocado, ahora registra qué quiere proponer y bajo qué condiciones.

> [!NOTE]
> **Proceso de Curaduría y Aprobación**:
> La curación de los productos postulados es un proceso **manual liderado por Comercial y Supplier Success**. Los productos se evalúan conforme a las reglas del Nodo 4. En esta fase los proveedores **no visten los productos** con marcos; esto solo ocurre para los productos formalmente aprobados en la fase posterior (Contacto 2).

> **Para el MVP:** no es un módulo en plataforma. Se configura un formulario externo (Google Form, Airtable, Tally, Sheet o GHL) que el supplier o el comercial diligencia.

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero configurar el proceso y formulario de postulación de productos para que los suppliers puedan registrar su intención de participar, qué productos postulan y bajo qué condiciones comerciales, de forma que Dropi pueda revisarlos y llevarlos a curaduría.

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Notas |
|---|-------|-------------|------|-------|
| 1 | Herramienta de captura | Sí | Selección con descripción | Google Form (recomendado MVP), Airtable, Tally, Sheet, GHL |
| 2 | Link del formulario | Sí | URL | El que recibe el supplier o el comercial |
| 3 | Datos del supplier requeridos | Sí | Multiselección | Mínimo: nombre, ID, contacto |
| 4 | Datos del producto requeridos | Sí | Multiselección | Mínimo: nombre, ID/link, estado |
| 5 | Datos comerciales requeridos | Sí | Multiselección | Mínimo: precio actual, stock disponible |
| 6 | ¿Capturar motivación del supplier? | Sí | Selección | Obligatorio / Opcional / No |
| 7 | Confirmaciones requeridas | No | Multiselección | Stock, precio, despacho, revisión Dropi |
| 8 | Responsable de gestionar postulaciones | Sí | Selección | |
| 9 | Instrucciones para el supplier o comercial | No | Texto libre | |

### Estructura del formulario de postulación (plantilla)

**Sección 1 — Datos del supplier:** Nombre · ID · País · Contacto · Comercial responsable · Estado

**Sección 2 — Producto postulado:** Nombre · ID / link Dropi · Categoría · Stock disponible · Precio actual · Precio campaña · Descuento · Stock para campaña

**Sección 3 — Motivación del supplier:**
> "¿Por qué quieres postular este producto?"
- Quiero más visibilidad
- Quiero salir de stock
- Quiero rematar inventario
- Quiero mover un producto quieto
- Quiero activar un producto nuevo
- Quiero conseguir más dropshippers
- Otro

**Sección 4 — Confirmaciones:**
- Confirmo que el producto tiene stock disponible
- Confirmo que el precio es válido para la campaña
- Entiendo que Dropi revisará y puede aprobar o rechazar el producto
- Confirmo capacidad de despacho durante la campaña

### Estados de la postulación

| Estado | Cuándo aplica |
|--------|---------------|
| **Recibido** | Postulación completada con campos mínimos |
| **Incompleto** | Faltan datos (stock, precio, imagen) |
| **Pendiente de revisión** | Recibido pero aún no evaluado |
| **Enviado a curaduría** | Todos los campos OK, listo para validación |
| **Requiere información adicional** | Dropi necesita más contexto |

### Casos de uso

**Dropicup Mundial** — postulación de temporada:
Supplier: Sport Fans · Producto: Camiseta selección Colombia · Stock: 120u · Precio actual: $45.000 · Precio campaña: $38.000 · Motivo: Visibilidad + volumen

**Remates de Stock** — producto quieto:
Supplier: Casa Hogar · Producto: Organizador plegable cocina · Stock: 500u · Precio campaña: $19.900 · Motivo: Salir de stock · Obs: "Inventario acumulado, queremos liquidarlo."

**Visibilidad sin descuento:**
Supplier: Beauty Lab · Producto: Kit maquillaje compacto · Stock: 90u · Sin precio campaña · Motivo: Visibilidad · Obs: "Producto nuevo, queremos que lo conozcan los dropshippers."

### Output del nodo

Al finalizar este nodo debe quedar:

- Formulario de postulación configurado y con link disponible
- Campos mínimos definidos (supplier, producto, comercial)
- Motivación capturada como campo
- Confirmaciones mínimas del supplier definidas
- Responsable asignado
- Proceso claro para pasar postulaciones a curaduría

### Criterios de aceptación

- [ ] Herramienta de captura definida
- [ ] Link del formulario disponible
- [ ] Se definieron los datos del supplier requeridos (mínimo: nombre, contacto)
- [ ] Se definieron los datos del producto requeridos (mínimo: ID/link, stock, precio)
- [ ] Se definieron los datos comerciales (mínimo: precio actual, stock)
- [ ] Se definió si se captura motivación del supplier
- [ ] Se definieron las confirmaciones requeridas
- [ ] Se asignó un responsable de gestionar las postulaciones
- [ ] El proceso permite avanzar al siguiente nodo: Validación Dropi

**Nodo siguiente:** Nodo 7 — Validación Dropi

---

## ~~Nodo 7 — Validación Dropi~~ *(eliminado del flujo)*

> Este nodo fue eliminado. La validación y curaduría de productos se integra en el proceso entre Postulación (Nodo 6) y Vitrina (Nodo 7). El PM o Supplier Success revisa manualmente los productos postulados usando los criterios del Nodo 4 antes de construir la vitrina.

---

## Nodo 7 — Construir vitrina

**Color:** Verde (`#36dc83`)  
**Ícono:** 🛍️  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Definir cómo se presentarán al dropshipper los productos de la campaña durante el MVP manual. La campaña solo tiene valor si el dropshipper percibe una oportunidad clara.

> [!IMPORTANT]
> **Componentes de la Vitrina MVP (Alineación con Marketing)**:
> 1. **Categoría Temporal en Admin**: Se crea una categoría temporal (ej. Dropicop) desde el panel de administración de Dropi (sin requerir desarrollo de IT). Los proveedores seleccionados asocian sus productos a esta categoría y les agregan la palabra clave en el título.
> 2. **Banner prefiltrado en la sección de Catálogo**: Un banner colocado en la sección de productos. Al hacer clic, redirige al catálogo con una URL prefiltrada por la categoría/palabra clave. Los banners y enlaces se **segmentan por país** para asegurar que los dropshippers vean el inventario local correcto.
> 3. **Flyer en la página Home**: Imagen en el Home de la plataforma que permite descargar el catálogo completo en PDF.
> 4. **Sublanding de marcos**: Herramienta alojada en un subdominio de `dropi.co` (desarrollada por Juan Felipe Peña usando un script de procesamiento de imágenes) para que el proveedor cargue su imagen y la descargue con el marco oficial, evitando la distribución libre del archivo de diseño.

### Descripción funcional

Como usuario de la célula de Supplier Success, quiero definir el formato, nombre, descripción, agrupaciones, badges, CTA y canal de distribución de la vitrina para que los dropshippers entiendan, exploren y tomen los productos de la campaña.

### Campos del nodo

| # | Campo | Obligatorio | Tipo | Notas |
|---|-------|-------------|------|-------|
| 1 | Tipo de vitrina | Sí | Selección con descripción | Ver opciones abajo |
| 2 | Nombre visible para el dropshipper | Sí | Texto libre | ej. Dropicup Mundial · Remates de Stock |
| 3 | Descripción visible | Sí | Textarea | Frase clara sobre la oportunidad |
| 4 | Fuente de los productos incluidos | Sí | Selección | Sheet / Airtable / Categoría temporal / Lista manual |
| 5 | Agrupaciones internas | No | Multiselección | Cómo se organizan los productos (evitar lista plana) |
| 6 | Badges o señales visuales | No | Multiselección | Máx. 2–3 badges por producto |
| 7 | Información visible por producto | Sí | Multiselección | Mínimo: imagen, nombre, supplier, precio, stock, CTA |
| 8 | CTA principal | Sí | Selección con descripción | Ver producto (recomendado MVP) |
| 9 | Canal de distribución | Sí | Multiselección ranked | El primero = canal principal |
| 10 | Vigencia visible para el dropshipper | Sí | Texto libre | ej. "Termina en 7 días" |
| 11 | Link o documento de la vitrina | No | URL | Landing, sheet, categoría o doc compartido |
| 12 | Responsable de publicación | Sí | Selección | |

### Tipos de vitrina para el MVP

| Tipo | Esfuerzo | Ideal para |
|------|----------|------------|
| **Landing manual** | Medio | Buena experiencia, campaña importante |
| **Categoría temporal beta** | Bajo | Probar dentro del catálogo actual sin desarrollo |
| **Sheet curado** | Muy bajo | MVP ultra-rápido |
| **Airtable view** | Bajo | Si ya gestionan la campaña en Airtable |
| **Documento handoff comercial** | Muy bajo | Validar interés rápido vía comercial |
| **Campaña GHL / WhatsApp** | Bajo | Dropshippers segmentados ya en GHL |

### Información mínima por producto

Imagen · Nombre · Supplier · Precio · Precio campaña (si aplica) · Stock · Badge · CTA · Vigencia

### Organización por tipo de campaña

**Dropicup Mundial:** Productos destacados / Ropa y accesorios / Decoración / Tecnología / Remates mundialistas

**Remates de Stock:** Mayores descuentos / Últimas unidades / Alto stock / Remates por categoría / Precio especial

**Productos seleccionados por Dropi:** Seleccionados por Dropi / Alto margen / Buen stock / Productos nuevos / Productos para pauta

### Output del nodo

- Tipo de vitrina definido
- Nombre y descripción visible listos
- Productos agrupados y ordenados
- Badges y señales visuales definidos
- CTA principal definido
- Canal de distribución definido
- Vigencia visible comunicada
- Responsable asignado
- Link o documento disponible

### Criterios de aceptación

- [ ] Tipo de vitrina definido
- [ ] Nombre visible para dropshippers definido
- [ ] Descripción clara de la oportunidad
- [ ] Fuente de productos definida
- [ ] Agrupaciones internas definidas
- [ ] Información mínima por producto definida (imagen, nombre, supplier, precio, stock, CTA)
- [ ] Badges definidos (máx. 3)
- [ ] CTA principal definido
- [ ] Canal de distribución definido (al menos uno)
- [ ] Vigencia visible comunicada
- [ ] Responsable de publicación asignado
- [ ] Existe link, categoría o documento listo para compartir

**Nodo siguiente:** Nodo 8 — Documento handoff

---

## Nodo 8 — Documento handoff para la célula

**Color:** Verde (`#36dc83`)  
**Ícono:** 📄  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Generar el documento operativo final que consolida todas las definiciones comerciales y los accesos a las herramientas temporales (Tally/Form, sublanding de marcos, categoría temporal del Admin, y listado de IDs segmentados de proveedores en User Pilot) para que el equipo operativo ejecute la campaña sin dependencias ni bloqueos.

> En este MVP "publicar" significa dejar un documento operativo para que la célula ejecute la campaña manualmente. No es una pantalla productiva.

### Estructura del Documento de Handoff

El documento consolidado (generalmente un Google Doc o Notion) debe contener:
1. **Ficha técnica consolidada**: Nombre de la campaña, tipo de mecánica, país o mercado, responsable líder y objetivo principal.
2. **Enlaces de herramientas operativas**:
   - Enlace del Formulario de Postulación de proveedores (Nodo 6).
   - Enlace de la sublanding para colocación del marco de imágenes (`dropi.co`).
   - Enlace del Sheet de control (mapeo de proveedores candidatos, estado de postulación, y curaduría manual).
   - Enlace a la Categoría Temporal en el panel de administración.
3. **Parámetros de comunicación y segmentación**:
   - Listado de IDs actualizados de proveedores premium y exclusivos cargados en User Pilot.
   - Plantillas de mensajes para **Contacto 1** y **Contacto 2** a proveedores.
   - Estructura de banners y popups para dropshippers (votos expectativa y links prefiltrados por país en catálogo).
4. **Matriz de Responsabilidades (RACI)**:
   - **Comercial**: Segmenta y convoca proveedores (Contacto 1, Contacto 2).
   - **Marketing / Growth**: Diseño gráfico de marcos, banners y flyers, configuración de User Pilot (popups y banners), comunicación general a dropshippers y lives.
   - **Supplier Success**: Configuración de formularios, revisión y curaduría manual de productos, y creación de categorías temporales en Admin.
   - **Producto**: Coordinar la publicación y monitorear el flujo global.

---

## Nodo 9 — Medición del piloto

**Color:** Amarillo (`#f9c74f`)  
**Ícono:** 📊  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Medir el embudo completo del piloto para evaluar la adopción por parte de suppliers, el engagement de los dropshippers, y el impacto comercial neto (órdenes e ingresos).

### Métricas del Piloto (Framework en 3 Niveles)

1. **Métricas de Proveedor (Embudo de Adopción)**:
   - **Convocados**: Total de proveedores convocados (Contacto 1).
   - **Tasa de Respuesta**: % de proveedores interesados sobre el total de convocados.
   - **Tasa de Postulación**: % de proveedores que completaron la postulación de productos.
   - **Curaduría**: Cantidad de productos postulados vs. cantidad aprobados.
   - **Tasa de Vestido**: % de productos aprobados que fueron editados con el marco en la sublanding y asignados a la categoría correcta.

2. **Métricas de Dropshipper (Engagement)**:
   - **Feedback de expectativa**: Cantidad de dropshippers expuestos al popup de User Pilot para votación de categorías y volumen de votos recibidos.
   - **Clics en Banners**: CTR y clics absolutos en el banner del catálogo prefiltrado (por país).
   - **Descargas PDF**: Cantidad de descargas del catálogo en PDF a través del flyer del Home.
   - **Tasa de Adopción (Importación)**: % de dropshippers que importaron al menos 1 producto de la campaña a su catálogo.

3. **Métricas de Negocio (Impacto Financiero)**:
   - **Activación de Catálogo**: Cantidad de productos de "stock quieto" que consiguieron su primera orden.
   - **Lift en Activos**: % de incremento en órdenes de productos que ya vendían y entraron a campaña.
   - **GMV Incremental**: Valor total en pesos colombianos de las ventas de la campaña.
   - **Ticket Promedio de Campaña**: GMV dividido por el total de órdenes de campaña (valida si la optimización de curaduría por categorías de alto ticket subió el promedio).

---

## Nodo 10 — Decisión final

**Color:** Rojo (`#ff5b5b`)  
**Ícono:** 🔀  
**Estado del handoff:** ✅ Completo

### Objetivo del nodo

Tomar una definición estratégica sobre el futuro del experimento una semana después de que finalice la fecha comercial de la campaña, con base en el informe de medición del Nodo 9.

### Rutas de Decisión Estratégica

1. **Apagar / Pivotar (Descartar)**:
   - **Criterio**: Tasa de adopción de proveedores < 10% o conversión a órdenes en dropshippers marginal.
   - **Acción**: Se archiva el piloto, se realiza sesión post-mortem y se documentan aprendizajes en el repositorio.
2. **Iterar (Mantener flujo manual con ajustes)**:
   - **Criterio**: Conversión y ventas positivas, pero con altos cuellos de botella operativos en el embudo (ej: retraso de proveedores al vestir fotos o confusión con la categoría temporal).
   - **Acción**: Ajustar piezas, links, y refinar el soporte comercial para la próxima campaña del cronograma (ej. Halloween o Navidad).
3. **Escalar (Automatizar desarrollo en plataforma)**:
   - **Criterio**: Resultados de conversión y órdenes incrementales que justifiquen una inversión en tecnología de IT.
   - **Acción**: Levantar el documento de requerimientos (PRD) y enviarlo para priorización (Dropy Score) enfocado en:
     - Vestido automático nativo (la plataforma renderiza el marco sobre la imagen original de forma automática para los aprobados).
     - Modificación automática de categoría y palabra clave para el catálogo al ser aprobado en admin.
     - Módulo de vitrina segmentada por país directo en el backend.

---

## Instrucciones para generar documento de proceso

Cuando todos los nodos tengan handoff completo, se puede generar un documento de proceso ejecutivo con esta estructura:

1. **Resumen del flujo** — qué hace el sistema de campaña de extremo a extremo
2. **Por cada nodo:** objetivo, campos, criterios de aceptación, output, nodo siguiente
3. **Reglas de negocio transversales** — qué aplica a todo el flujo
4. **Roles y responsables** — quién hace qué en cada nodo
5. **Métricas del experimento** — cómo se mide si el flujo funcionó
