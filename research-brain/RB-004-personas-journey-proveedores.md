# RB-004 — Segmentos y Journey del Proveedor (Supplier)

---

## Metadatos

| Campo | Valor |
|---|---|
| **ID** | RB-004 |
| **Fecha** | 2026-07-08 |
| **Iniciativas relacionadas** | NEG-002, DCA-001, DESC-001, Combos, Supplier Lab |
| **Segmentos** | No Verificado, Verificado, Premium, Premium Exclusivo |

Este documento reúne todo lo que Dropi ya sabe y tiene documentado sobre el proveedor, organizado en dos partes: cómo se clasifican los proveedores, y qué pasos sigue un proveedor dentro de la plataforma. Solo incluye información confirmada por reglas de negocio, por producto ya construido, o por diseño vigente. Donde no hay información, se dice directamente que no existe — no se completa con supuestos.

---

## 1. Segmentos de Proveedor

Dropi clasifica a los proveedores en 4 niveles: **No Verificado → Verificado → Premium → Premium Exclusivo**.

> El nombre correcto del nivel base es **"No Verificado"** (confirmado por Michelle). El término "Estándar", que aparecía en un documento interno de reglas de matching, no es válido — no corresponde a ningún nombre de negocio real.

### Requisitos para ascender de nivel

| Requisito | No Verificado | Verificado | Premium |
|---|---|---|---|
| Órdenes movilizadas por trimestre | Sin mínimo | Mínimo 3.000 | Mínimo 20.000 |
| Antigüedad activa en la plataforma | Ninguna | Mínimo 3 meses | Mínimo 6 meses |
| Certificación de uso de la plataforma | No exigida | Obligatoria | Obligatoria |
| Gestión de garantías | Sin exigencia | 100% en menos de 24h | 100% en menos de 24h |
| Uso de Ecom Scanner | Sin exigencia | Obligatorio | Obligatorio |
| Tiempo promedio de despacho | Sin exigencia | Menor a 48h | Menor a 24h |
| Registro en Cámara de Comercio | No exigido | No exigido | Exigido |
| Historial y comportamiento comercial | Sin filtro | Óptimo | Óptimo |

**Premium Exclusivo** no tiene requisitos publicados: se accede mediante un **contrato propio**, negociado directamente con Dropi.

### Beneficios por nivel

| Nivel | Beneficios |
|---|---|
| **Verificado** | Visibilidad y exposición de productos, catálogo de productos, aprobación automática de productos, atención preferencial, tiempos de respuesta rápidos, insignias, Plan Kanguro (garantías) |
| **Premium** | Todo lo de Verificado, más: atención personalizada y directa, informe mensual de actividades, reuniones semanales, back office de procesos logísticos, exposición en home, reuniones con líderes de comunidad, presencia en showroom |
| **Premium Exclusivo** | Todo lo de Premium, más: prioridad en gestiones logísticas, créditos para importaciones internacionales, atención prioritaria, gestión de inventarios, estrategias personalizadas |

*Fuente: requisitos oficiales de ascenso y página pública `dropi.co/soluciones-para-proveedores`.*

### Qué nivel recomienda el sistema

Cuando un dropshipper busca producto asistido por el sistema de recomendación (Gali/ADA Spy), el orden de prioridad es:

1. Premium y Premium Exclusivo — máxima prioridad.
2. Verificado — segunda prioridad, requiere confirmación adicional del pedido por WhatsApp.
3. No Verificado — excluido de las recomendaciones.

Esto significa que un proveedor No Verificado no solo tiene menos beneficios: sus productos no aparecen cuando el sistema recomienda catálogo a un dropshipper.

---

## 2. Personas de Proveedor

No existen entrevistas directas a proveedores todavía — este es el vacío #1 de la sección 3. Las 4 personas de abajo están construidas poniéndonos en los zapatos del proveedor **a partir de las reglas de negocio, restricciones y vacíos ya confirmados** en la sección 1 (requisitos, beneficios, prioridad de recomendación). No son testimonios literales ni citas de personas reales — son inferencia razonada, y se presentan como tal. Se usa el nivel oficial como segmentación principal; dentro de cada nivel se describe qué tipos de negocio suelen ocupar ese lugar, porque un mismo nivel agrupa perfiles operativos distintos (un importador no opera igual que un laboratorio con manufactura propia, aunque cumplan el mismo requisito de volumen).

### Persona 1 — Proveedor No Verificado

**Identidad**
Proveedor recién registrado en Dropi. En este nivel conviven perfiles muy distintos: un emprendedor que fabrica en casa y recién está probando el canal, un importador ocasional de bajo volumen, o alguien que ya tiene operación en otro canal y apenas está montando su catálogo en la plataforma. Lo único que todos comparten es que no tienen historial ni antigüedad todavía.

**Perfil de contexto**
Acaba de completar el flujo de activación: creó su bodega guiada por el tour, subió su primer producto y pasó las validaciones mínimas (100 unidades de stock, 3 imágenes, 3 garantías). Para él, publicar el producto se siente como la meta — no sabe que ese es apenas el punto de partida de una clasificación que sigue evaluándolo después.

**Necesidades de plataforma**
- Entender con claridad qué significa "No Verificado" y qué gana al dejar de estarlo.
- Ver cuánto le falta, en cifras concretas, para llegar a Verificado (3.000 órdenes, 3 meses).
- Saber por qué su catálogo no se mueve al mismo ritmo que el de otros proveedores.

**Frustraciones**
- No entiende por qué sus productos casi no reciben pedidos, sin saber que el sistema de recomendación lo excluye activamente por su nivel.
- Cumplió todas las validaciones para publicar y siente que "ya hizo la tarea" — pero no hay ninguna señal dentro de la plataforma de que ese no es el criterio que determina su visibilidad real.
- No tiene forma de saber si va bien o mal encaminado hacia Verificado; para él, el ascenso es una caja negra.

---

### Persona 2 — Proveedor Verificado

**Identidad**
Ya superó 3 meses activo y 3.000 órdenes por trimestre. En este nivel es común encontrar importadores con flujo de pedido regular, o laboratorios/manufactura de escala pequeña-mediana que ya tienen procesos de despacho más o menos ordenados.

**Perfil de contexto**
Invirtió en certificarse y en adoptar Ecom Scanner porque son obligatorios en este nivel. Gestiona sus garantías dentro de la ventana de 24 horas exigida. Su operación ya es medianamente predecible, pero cada venta tiene un paso adicional que Premium no tiene: la confirmación del pedido por WhatsApp.

**Necesidades de plataforma**
- Que la confirmación por WhatsApp no se sienta como desconfianza hacia él, sino como parte normal del proceso — hoy no hay comunicación clara de por qué existe ese paso.
- Visibilidad de qué tan cerca está de Premium, dado que el salto es grande: de 3.000 a 20.000 órdenes/trimestre, de 3 a 6 meses de antigüedad.
- Herramientas o acompañamiento para bajar su tiempo de despacho de menos de 48h a menos de 24h, el requisito que probablemente le cueste más.

**Frustraciones**
- Cumple con certificación, herramientas y garantías, pero sigue en 2ª prioridad de recomendación — siente que "ya certificado" debería pesar más de lo que pesa.
- El paso de confirmación por WhatsApp le agrega fricción operativa a cada venta, sin que la plataforma le explique el motivo ni le dé un plazo o condición para dejar de necesitarlo.
- El salto a Premium es una meta lejana y sin ruta visible — no sabe si depende solo de acumular volumen o si hay algo más que deba demostrar.

---

### Persona 3 — Proveedor Premium

**Identidad**
Más de 500 despachos mensuales, 6 o más meses activo, registro vigente en Cámara de Comercio. En este nivel suelen estar empresas ya formales: importadores de alto volumen, laboratorios con producción propia certificada, o marcas con bodega y equipo dedicado a e-commerce.

**Perfil de contexto**
Tiene una relación más cercana con Dropi: reuniones semanales, informe mensual de actividades, exposición en home y en showroom. Su volumen implica que gestiona relaciones comerciales con muchos dropshippers a la vez, no solo transacciones puntuales — incluyendo negociaciones directas de comisión (NEG-002).

**Necesidades de plataforma**
- Herramientas de gestión masiva: aplicar una comisión general a todo su catálogo y ajustar por excepción, no negociar producto por producto.
- Que el back office logístico prometido como beneficio reduzca de verdad su carga operativa, no la traslade a otra reunión o informe que también debe atender.
- Claridad — aunque sea informal — sobre qué implicaría dar el salto a Premium Exclusivo.

**Frustraciones**
- Con alto volumen, cada negociación 1 a 1 con un dropshipper distinto (72h de espera, sin poder cambiar la comisión una vez aprobada) es trabajo manual que se multiplica por la cantidad de contrapartes.
- Recibe beneficios de acompañamiento (reuniones, informes) que también consumen tiempo de gestión — el beneficio tiene un costo operativo que nadie mide.
- No tiene ninguna visibilidad de qué más debe demostrar para llegar a Premium Exclusivo, porque ese nivel no tiene reglas públicas.

---

### Persona 4 — Proveedor Premium Exclusivo

**Identidad**
El único nivel que no se gana por métricas sino por contrato propio negociado directamente con Dropi. Suele tratarse de fabricantes o importadores grandes, o marcas reconocidas, con capacidad de comprometerse contractualmente (créditos de importación, inventario gestionado).

**Perfil de contexto**
Su relación con Dropi no depende de cumplir un umbral, sino de un acuerdo negociado con una persona o equipo específico. Es el copy oficial de Dropi quien lo llama "socio estratégico preferido" — pero la forma exacta en la que opera esa relación no está documentada en ningún lugar de la plataforma ni internamente.

**Necesidades de plataforma**
- Condiciones documentadas y consultables, no solo un acuerdo verbal o de correo con quien negoció el contrato.
- Continuidad del trato de "socio estratégico" independientemente de si cambia su interlocutor comercial en Dropi.

**Frustraciones**
- Al no haber reglas escritas, puede sentir que su relación con Dropi depende de una persona y no de un proceso institucional — un riesgo si esa persona cambia de rol.
- Términos como "gestión de inventarios" o "estrategias personalizadas" no tienen una definición operativa clara ni dentro ni fuera de la plataforma — no sabe exactamente qué puede exigir.

---

## 3. Journey del Proveedor

Tres momentos del proveedor están documentados hoy: **cómo se activa en la plataforma**, **qué necesita para subir de nivel**, y **cómo negocia condiciones con un dropshipper**. El resto —logística cotidiana, postventa, y qué pasa si deja de cumplir sus métricas— no está documentado todavía (ver sección 4).

### Etapa 1 — Registro y Activación

Este es el único tramo con seguimiento instrumentado (eventos registrados en el sistema):

1. El proveedor se registra y crea su cuenta.
2. Completa un diagnóstico y configuración inicial de su perfil.
3. Crea su primera bodega, guiado por un tour paso a paso.
4. Crea su primer producto, con datos generales, stock, imágenes, recursos adicionales y garantías.
5. El sistema valida que el producto cumpla el mínimo: 100 unidades de stock, 3 imágenes y 3 garantías obligatorias. Si falla, el sistema registra por qué (falta de stock, de imágenes o de garantías).
6. El producto se guarda y el proveedor pasa a una validación externa (encuesta) que revisa su capacidad operativa y financiera.
7. El producto queda visible para los dropshippers.

### Etapa 2 — Ascenso de Categoría

La ruta de ascenso es: No Verificado → Verificado → Premium → Premium Exclusivo, según los requisitos de la tabla de la sección 1.

No existe documentación sobre cómo el proveedor solicita el ascenso, si puede ver su progreso hacia el siguiente nivel, o si el ascenso es automático o manual. Tampoco hay una definición medible de qué cuenta como "historial y comportamiento comercial óptimo".

### Etapa 3 — Negociación con Dropshippers

Este es el diseño vigente del flujo de negociación directa entre proveedor y dropshipper (proyecto NEG-002, todavía en diseño, no en producción):

1. El proveedor crea una negociación y elige con quién: un líder de comunidad o un dropshipper específico.
2. Define el alcance: catálogo completo o productos específicos.
3. Define la comisión (porcentaje o valor fijo), general o por producto.
4. Envía la propuesta.
5. El dropshipper tiene 72 horas para aprobarla o rechazarla. Si la rechaza, el proveedor puede modificarla y reenviarla. Si la aprueba, el proveedor puede seguir agregando o quitando productos, pero ya no puede cambiar la comisión. Si no hay respuesta en 72 horas, la propuesta expira.

---

## 4. Lo que no está documentado

- **Cero entrevistas directas a proveedores.** Las personas de la sección 2 son inferencia razonada sobre reglas de negocio confirmadas, no testimonios reales — falta validarlas con proveedores de cada nivel.
- Cómo el proveedor solicita o hace seguimiento a su ascenso de nivel.
- Qué pasa si un proveedor deja de cumplir los requisitos de su nivel (no hay reglas de descenso).
- El proceso de logística y postventa desde la pantalla del proveedor (hoy solo se conoce desde el lado del dropshipper).
- Cómo se negocia o gestiona el nivel Premium Exclusivo, más allá de que es "contrato propio".
- Cuántos proveedores hay en cada nivel y en qué países.

---

## Fuentes

- Requisitos oficiales de ascenso a Verificado y Premium — Michelle, 08/07/2026.
- `dropi.co/soluciones-para-proveedores` — beneficios oficiales por nivel.
- Reglas de recomendación de catálogo del agente Gali/ADA Spy (documento interno de reglas de negocio).
- Proceso de activación del proveedor, instrumentado en Supplier Lab.
- Diseño vigente del proyecto NEG-002 (negociación proveedor-dropshipper).
