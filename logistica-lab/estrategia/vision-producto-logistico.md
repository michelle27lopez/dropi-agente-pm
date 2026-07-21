# 🧭 Visión de producto logístico — los 3 lentes (v1, 30-jun)

> **Qué es:** el armado formal de *qué ofrecemos como producto logístico*, uniendo **fulfillment,
> bodegas y EcomScanner**, mirado por los **3 lentes** del [direccionamiento §2](direccionamiento-logistic-success-2026-s2.md):
> **por perfil · por nivel de madurez · por etapa de la cadena de valor**.
> Cierra el ítem *"Visión de producto logístico"* del Product Backlog (TODO #8b).
>
> **Disciplina (ley spec-driven):** cada bloque marca su naturaleza —
> **[FUENTE]** = destilado de un tema/Confluence con cita · **[SÍNTESIS]** = ensamblaje propio sobre fuentes ·
> **[PROPUESTA·validar]** = inferencia mía que **aún no está validada** con Juan/Maria.
> No duplica los temas: **apunta y cruza**. La materia prima vive en `conocimiento/temas/11·14·16` + `marco-comun §2.3`.

---

## 0 · Tesis (en una línea)
**[SÍNTESIS]** Logística no es "un feature": es el **foso** de Dropi — la actividad mejor cubierta, presente en
**6 de los 10 productos** del holding (`temas/14 §D`). La visión = hacer explícito **qué resuelve la orden
para cada perfil, en cada nivel de madurez, y con qué pieza en cada etapa** — y dónde están los gaps.
Core operativo = **LA ORDEN**; motor = el **consumidor final** (`temas/14`, modelo mental).

---

## Lente 1 · Por perfil — qué resuelve la logística para cada cliente
**[FUENTE: `temas/14 §B/§C` + `temas/16`]** La logística pesa **distinto** según el perfil (no diseñar "para todos"):

| Perfil | Rol de la logística | Fricción crítica | Momento Ajá | Métrica del perfil |
|---|---|---|---|---|
| **Dropshipper** (masa crítica) | Confirma pedidos, gestiona novedades. **No quiere saber de logística** — quiere que la orden llegue. | **primer COD fallido** | 1ª venta cerrada + **1er cobro recibido** | **TTV** · retención M2 |
| **Marcas** | Igual que dropshipper **+ control de marca y precio** (qué sellers venden, precio mínimo). | pérdida de control de marca | 1ª cohorte de sellers vendiendo | rotación de inventario |
| **Proveedor** | **Eje principal**: stock, despacho, SLA, inventario (StockPro WMS · CAS proveedores · Atom). | **stock-outs · SLA incumplido** | — | **SLA de despacho** |
| **Transportadora** | Cliente B2B de la red: recibe la guía, rutea, reporta novedad/cierre. | dirección no ruteable · datos sucios | — | (cobertura · % entrega · cierre) |
| **Líder** | Bajo — no opera directo. | — | — | cohort retention |

> **Lectura [SÍNTESIS]:** el **dropshipper** es el que más nos define en volumen y el más frágil → la logística
> que lo retiene es **movilización + entrega al 1er intento** (su fricción es el primer COD fallido). El **proveedor**
> es donde la logística es *el producto* (SLA, WMS). Marcas y transportadora son clientes de la misma red con
> exigencias propias (control / ruteo). Detalle de personas y sub-perfiles → [[16-perfiles-a-profundidad-subperfiles]].

---

## Lente 2 · Por nivel de madurez — qué necesita la operación logística según el momento del usuario
> 🔴 **Este es el lente que estaba VACÍO en el cerebro.** El framework Iniciando/Consolidando/Escalando existía
> solo a nivel compañía (`marco-comun §2.3`); aquí se aterriza **a logística por primera vez.**
> **[PROPUESTA·validar]** — el cruce madurez × logística es síntesis propia sobre las palancas que el marco ya
> asigna a cada nivel; **falta validarlo con Juan/Maria** y con data de qué features usa cada cohorte.

| Nivel | Necesidad logística central | Palancas YA vivas (`marco §2.3` + `temas/14`) | Qué desbloquea el salto al siguiente nivel | Proyectos del cerebro que pegan aquí |
|---|---|---|---|---|
| **A · Iniciando** | **Cero-fricción y confianza:** despachar **sin capital ni infraestructura propia**; que la 1ª orden se movilice y entregue sin saber de logística. | COD con **+8 transportadoras** (sin pasarela propia) · **pago el día de la entrega** (liquidez) · **sin cobro por devoluciones** (amortigua el 1er COD fallido = su fricción #1) · **validador de direcciones** (evita la 1ª novedad) · **CAS** (habla con la transportadora sin montar soporte) | que la orden **entre a red y se entregue** → confianza para repetir | **Movilización/confirmación** (PRM-1497) · **Dirección+geo** (PRM-91) · **Novedad/triaje** (PRM-1512) |
| **B · Consolidando** | **Escala con control:** ya integra canales (Shopify/Woo) y mueve volumen → necesita **visibilidad y consistencia** del estado de cientos de órdenes. | **integraciones ecom** (las órdenes entran por SHOP) · **torre logística** · **informes de productos** · Dropi Card | **operar volumen sin perder el hilo** (estados claros, tiempos medibles, transportadora correcta) | **Torre de control / tiempo por fases** · **Normalización de estados** (PRM-1297) · **Selección de transportadoras** (PRM-1513) · *(la fuga SHOP-sin-validar vive aquí)* |
| **C · Escalando** | **Red como infraestructura:** multi-país, marca propia, inventario → necesita **fulfillment y última milla propios**. | **fulfillment** (StockPro WMS) · **Groupack** (importación) · **Veloces** (same-day / última milla) · **+8 países** | volumen multi-país con **SLA y costo controlados** | **Same Day** (PRM-1366) · **fulfillment / bodegas** · multi-bodega (↔ Combos) |

> **Hallazgo que produce este lente [SÍNTESIS]:** los proyectos activos del cerebro **se ordenan por madurez** —
> movilización/direcciones/novedad sirven al usuario **Iniciando**; torre/normalización/transportadoras al que
> **Consolida**; Same Day/fulfillment al que **Escala**. Esto da un eje extra para priorizar: *¿a qué cohorte
> sirve cada apuesta?* El **dropshipper Iniciando** es la masa crítica y su fricción (1er COD fallido) coincide
> con la **NSM** (movilización + entrega) → refuerza por qué el grueso del roadmap vive en el nivel A/B.

---

## Lente 3 · Por etapa de la cadena — qué resuelve cada pieza y dónde están los gaps
**[FUENTE: `temas/14 §A/§D` + `temas/11`]** La etapa **Logística** de la cadena de valor está cubierta por estas piezas:

| Pieza | Qué resuelve en la orden | Etapa fina |
|---|---|---|
| **Core Dropi** | Catálogo, módulo de órdenes, confirmación, novedades, garantías. El sistema nervioso. | toda la orden |
| **StockPro (WMS)** | Multi-bodega: recepción, almacenamiento, etiquetado QR/barcode, **asignación IA a la bodega más cercana**. | almacenamiento / despacho |
| **EcomScanner** | Picking · packing · **recepción de devoluciones** + registro de novedades en bodega. | despacho · devolución |
| **CAS** | Comunicación directa con **transportadoras · proveedores · sellers**. | tránsito / soporte |
| **Veloces** | Última milla propia: **same-day / next-day**, sin costo de devolución en 1er intento. | última milla |
| **Atom** | Auditoría logística: **recupera dinero/producto atascado** en transportadoras, audita devoluciones falsas. | post-tránsito / negocio |
| **Groupack** | Importación + **fulfillment** + desarrollo de producto. | despacho (parcial) |

**Gaps de la etapa logística [FUENTE: `temas/14`]:**
- **Fulfillment** y **confirmaciones** figuran como **cobertura *parcial*** (Groupack / ChateaPro) → no son aún producto logístico de primera clase **de Dropi core**.
- La fuga dura de la cadena en esta etapa = **COD fallido + devoluciones** (fuga #2 de `temas/14 §F`), que es justo donde trabaja el roadmap (carrier×zona, devoluciones COD).

> **Unir "fulfillment + bodegas + EcomScanner" [SÍNTESIS]:** hoy están como piezas sueltas (StockPro = bodegas/WMS,
> EcomScanner = picking/devoluciones, Groupack = fulfillment parcial). La visión que pide la CPO es **contarlas como
> UN producto logístico end-to-end** (recepción → almacenamiento → despacho → última milla → devolución → auditoría),
> no como módulos aislados. Ese es el deliverable de fondo.

---

## 4 · Síntesis — qué ofrecemos como "producto logístico"
**[SÍNTESIS]** Dropi ofrece, sobre **la orden**, una **red logística como infraestructura** que el usuario consume
según su madurez: arranca **sin montar nada** (COD + transportadoras + validación + CAS), **escala con visibilidad**
(integraciones + torre + estados + carrier correcto) y **termina con red propia** (fulfillment + bodegas + same-day).
El **foso** es que esto cubre 6 de 10 productos y los **3 perfiles** operativos; los **gaps** (fulfillment como
producto de primera clase, confirmación robusta, devolución dentro del COD) son las **zonas de roadmap**.

## 5 · No-objetivos de esta visión (⛔)
- ⛔ No es el **roadmap** ni el cronograma (eso vive en [roadmap-okr-impacto](roadmap-okr-impacto.md) + TODO #4).
- ⛔ No redefine la **NSM** (sigue siendo tasa de entrega ≥70% + movilización).
- ⛔ No reemplaza los temas de conocimiento; los **organiza** bajo los 3 lentes.

## 6 · Preguntas abiertas / qué falta para cerrarla
- [ ] 🔴 **Validar el Lente 2 (madurez × logística)** con Juan/Maria — es síntesis propia, no fuente.
- [ ] 🟡 **Confirmar con data qué features logísticos usa cada cohorte** (Iniciando/Consolidando/Escalando) → hoy el mapeo es por diseño del marco, no medido.
- [ ] 🟡 **Sub-tipos de Proveedor** sin desagregar (`temas/16` pendiente) → el Lente 1 para Proveedor queda grueso.
- [ ] 🟡 **Definir el deliverable formal** que espera la CPO (¿doc? ¿board en Figma? ¿una sola lámina por lente?) y su fecha.

## 7 · Trazabilidad
| Lente | Fuente principal en el cerebro |
|---|---|
| Por perfil | [[14-portfolio-dropi-cobertura-monetizacion-fugas]] §B/§C · [[16-perfiles-a-profundidad-subperfiles]] |
| Por nivel de madurez | `marco-comun §2.3` + ensamblaje propio (este doc) |
| Por etapa de cadena | [[14-portfolio-dropi-cobertura-monetizacion-fugas]] §A/§D · [[11-plataforma-modulos]] · [[02-cadena-de-valor-y-portafolio]] |
| Marco de los 3 lentes | [direccionamiento §2](direccionamiento-logistic-success-2026-s2.md) (Confluence 1485471746) |

## 8 · Changelog
- **2026-06-30** — v1 ensamblada. Lentes 1 y 3 destilados de `temas/14·16·11`; **Lente 2 (madurez × logística) construido por primera vez** (estaba vacío en el cerebro) como [PROPUESTA·validar]. Pendiente: validar Lente 2 + definir deliverable/fecha con la CPO.
