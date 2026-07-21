# 14 · Portfolio Dropi: cobertura de la cadena, monetización y fugas (referencia dura)

> **Fuente:** Artifact de Claude "Día 2 · El motor" (detalle), compartido por Juan vía capturas (24-jun). Construido desde el cerebro. · **Tipo:** **conocimiento duro / referencia** del negocio Dropi (portfolio, cobertura, revenue, fugas). · **Confianza:** alta como mapa del portfolio; cifras de fuga viven en data ([04](04-hallazgos-data.md), [05](05-hipotesis-palancas-y-plan.md)). · Complementa el resumen de [02](02-cadena-de-valor-y-portafolio.md) y el marco de [13](13-dia2-el-motor-cadena-de-valor-y-consumidor-final.md).

## TL;DR
- **La cadena = 7 actividades:** 5 secuenciales (Producto → Mercadeo → Logística → Posventa → Fidelización) + 2 transversales (Educación, Negocio). Dropi se mide por **cuántas cubre y qué tan bien**, y eso **cambia por perfil**.
- **Logística es el foso:** la actividad mejor cubierta y presente en **6 de los 10 productos**.
- **Gaps reales:** Fidelización (sin CRM dedicado), Educación (concentrada en un solo producto, Academy), y "importar/producir" del Proveedor (parcial vía Groupack).
- **10 productos del holding**; **4 flujos de monetización** (COD, Shipping, Order commissions, Data); **4 fugas típicas**, una por zona de la cadena.
- **Dato clave:** el **Trust Agent** del bloque de confianza ([13](13-dia2-el-motor-cadena-de-valor-y-consumidor-final.md)) **ya está operacionalizado en ConfioPagos** (escrow: el dinero queda en custodia hasta que el consumidor confirme la entrega).

## Contenido

### A · Cobertura de la cadena, etapa por etapa (qué producto la cubre)
| Etapa | Cubre (Dropi/holding) | Parcial / Gap |
|---|---|---|
| **T1 · Educación** | Dropi Academy · Comunidad · Líderes | — |
| **01 · Producto** | Catálogo · Caza Productos | Parcial: Groupack (importación, dev producto) |
| **02 · Mercadeo** | Roax (ads · rentabilidad) · ChateaPro (agente WhatsApp · carritos · redes) | Parcial: ConfioPagos (sello de confianza) · Dropi Pay (crédito ads) |
| **03 · Logística** | Core Dropi · StockPro (WMS) · Ecom Scanner · CAS · Veloces · Atom (auditoría) | Parcial: Groupack (fulfillment) · ChateaPro (confirmaciones) |
| **04 · Posventa** | Módulo de garantías Dropi · ChateaPro · CAS · Ecom Scanner (devoluciones) | Parcial: ConfioPagos (mediación · reembolsos) |
| **05 · Fidelización** | Parcial: ChateaPro (remarketing) | **Gap:** CRM, automatización dedicada |
| **T2 · Negocio** | Dropi Pay (pagos · crédito) · Roax (data) · ConfioPagos (pagos) · Atom (auditoría) | **Gap:** contable, legal, ERP propio |

### B · Cada perfil activa la cadena distinto (matriz etapa × perfil)
| Etapa | Dropshipper | Marcas | Proveedor | Líder |
|---|---|---|---|---|
| **Producto** | Selecciona del catálogo | Desarrolla producto propio | Importa o produce inventario | Curador para su comunidad |
| **Mercadeo** | **Eje principal** (pauta, redes, UGC) | Marca + canal de sellers + influencers | B2B tradicional + presencia en red | Contenido + venta de educación |
| **Logística** | Confirma pedidos, gestiona novedades | Igual + control de marca y precio | **Eje principal** (stock, despacho, SLA) | Bajo (no opera directo) |
| **Posventa** | Atención básica del comprador | Garantías, marca, reputación | Garantías al consumidor final | Atención a estudiantes |
| **Fidelización** | Baja (no suelen hacerlo) | **Eje principal** (comunidad de marca) | Relacionamiento con sellers | **Eje principal** (cohortes y referidos) |
| **Educación (T)** | Cliente de educación | Cliente de educación más avanzada | Cliente educación B2B | **Productor** de educación |
| **Negocio (T)** | Básico (Excel, WhatsApp) | Estructurado, contable | ERP, WMS, integraciones | Reporting de cohorte y GMV |

### C · Cobertura producto × perfil (dónde dominamos vs dónde casi no tenemos)
Leyenda: 🟧 Dropi core lo cubre bien · 🟨 cobertura parcial (producto del holding) · 🟦 cubre ChateaPro · ⬛ casi no tenemos.
- **Dropshipper:** Educación 🟧 (Academy·Líderes·Comunidad) · Producto 🟧 (Catálogo·Caza Productos) · Mercadeo 🟧 (ChateaPro·Roax·ConfioPagos·Dropi Pay crédito ads) · Logística 🟧 (Core·Ecom Scanner·CAS·Veloces) · Posventa 🟦 (ChateaPro·CAS·ConfioPagos disputas) · Fidelización 🟦 (ChateaPro) · Negocio 🟨 (Dropi Pay·ConfioPagos·Roax data).
- **Proveedor:** Educación ⬛ (sin track específico) · Importar/producir 🟨 (Groupack parcial) · Ofrecer a sellers 🟧 (Red Dropi·Catálogo) · Logística+inventario 🟧 (Core·StockPro WMS·CAS proveedores·Atom·Ecom Scanner) · Posventa garantías 🟧 (Módulo garantías·CAS·Core) · Fidelización (sellers) ⬛ (sin herramienta dedicada) · Negocio 🟨 (Dropi Pay·Atom auditoría).
- **Marcas propias:** Educación ⬛ (Academy no específico) · Crear/importar 🟨 (Groupack parcial) · Mercadeo 🟧 (ChateaPro·Roax·ConfioPagos) · Logística+inventario 🟧 (Core·StockPro·Veloces·Ecom Scanner·Groupack fulfillment·Atom) · Posventa 🟧 (Módulo garantías·ChateaPro·CAS) · Fidelización 🟦 (ChateaPro) · Negocio 🟨 (Atom·ConfioPagos·Dropi Pay parcial).

**Lecturas (qué hacer):**
- **Logística domina en los 3 perfiles** → es lo que más nos define y nuestro **foso**.
- Para **Marcas**, Posventa pasó de "ChateaPro únicamente" a tener el **Módulo de garantías Dropi como core** → consolida la responsabilidad sobre el consumidor (bloque de confianza).
- El **Proveedor casi no tiene educación ni fidelización propia**; su flujo "importar/producir" es **gap real** → Groupack con rol estratégico a futuro.
- **Atom** es el producto más dirigido al Proveedor: recupera dinero atascado en transportadoras y profundiza la capa de Negocio para quien tiene inventario en riesgo.

### D · Los 10 productos del portfolio
| Producto | Dominio | Qué es | Etapas que cubre |
|---|---|---|---|
| **Dropi · Plataforma** | dropi.co | Core operativo: catálogo, Caza Productos, Ecom Scanner (picking·packing·devoluciones), CAS (comunicación transportadoras·proveedores·sellers) y módulo de garantías | Producto, Logística, Posventa |
| **StockPro** | dropi.co | WMS integrado, multi-bodega para proveedores y dropshippers: recepción, almacenamiento, etiquetado QR/barcode, asignación IA a la bodega más cercana | Logística |
| **Dropi Academy** | dropi.co | Educación, comunidad y líderes: cursos de dropshipping y marketing digital; líderes activan aprendizaje horizontal y validación de cohortes | Educación (T) |
| **ChateaPro** | chateapro.com | Automatización de WhatsApp con IA: agente de ventas, confirmación de pedidos, recuperación de carritos, atención 24/7, comentarios en redes, remarketing y fidelización | Mercadeo, Logística, Posventa, Fidelización |
| **Roax** | roaxai.com | Copiloto de rentabilidad con IA: unifica datos, alerta KPIs críticos, mide ROAS final, lanza campañas con IA; integra Meta, TikTok, Shopify y Dropi | Mercadeo, Negocio (T) |
| **Groupack** | groupack.co | Importación desde China, fulfillment, dropshipping y desarrollo de producto; para traer producto o producir marca propia con bodega | Producto, Logística |
| **Veloces** | veloces.app | Última milla: transportadora con same-day y next-day en Colombia, México, Ecuador; rutas flexibles, sin costo de devolución en primer intento | Logística |
| **Dropi Pay** | dropipay.com | E-wallet LATAM: tarjeta virtual y física, multimoneda, recibe pagos directos; crédito basado en facturación (alianza con Roax para crédito de pauta) | Mercadeo, Negocio (T) |
| **ConfioPagos** | confiopagos.com | Pasarela con **escrow**: el dinero queda en custodia hasta que el consumidor confirme la entrega; reembolso garantizado y mediación. **Es el trust agent operacionalizado** | Mercadeo, Posventa, Negocio (T) |
| **Atom** | atomsolutionsdata.com | Auditoría logística: recupera productos perdidos en transportadoras, audita devoluciones falsas, da visibilidad del dinero pendiente; foco fuerte en proveedores | Logística, Negocio (T) |

**Lecturas (qué hacer):**
- **Logística aparece en 6 productos** (Dropi core · StockPro · ChateaPro · Groupack · Veloces · Atom) → defensa más densa.
- **Negocio (T) en 4** (Roax · Dropi Pay · ConfioPagos · Atom) → capa transversal consolidándose.
- **Mercadeo en 4** (ChateaPro · Roax · Dropi Pay · ConfioPagos), pero **ninguno es un stack de pauta + creativos dedicado** (gap).
- **Educación en un solo producto** (Academy + comunidad + líderes) → punto de concentración y de **fragilidad si Academy falla**.

### E · Monetización: 4 flujos de revenue
| # | Flujo | Desde | Qué es |
|---|---|---|---|
| 01 | **COD commissions** | el seller | Comisión sobre el cobro contra entrega; compensa el riesgo logístico y financiero de la red |
| 02 | **Shipping fees** | seller / consumidor | Tarifas de envío sobre la red logística; volumen-dependiente: cada pedido entregado paga |
| 03 | **Order commissions** | sobre la transacción | Comisión sobre el pedido procesado; se activa por cada **orden válida** cruzando la plataforma |
| 04 | **Data monetization** | terceros | Monetización del dataset: insights de mercado, partnerships, inteligencia de productos *winning* para actores externos |
- **Regla:** toda iniciativa **activa o desactiva al menos una fuente** → preguntarse *cuál y cuánto la mueve*.
- Las **3 primeras dependen de volumen transaccional**; la **4ª depende del tamaño y calidad del dataset** que el resto del producto produce → **revenue compuesto** sobre todo lo demás.

### F · Las 4 fugas típicas (una por zona de la cadena)
| # | Fuga | Etapa | Impacto |
|---|---|---|---|
| 1 | **Churn temprano** (emprendedores que no llegan al primer pedido entregado; se rompe antes de la transacción) | Producto + Mercadeo | **las 4 fuentes** (las anula antes de activarlas) |
| 2 | **COD fallido y devoluciones** (no se entregan/se devuelven; costo logístico sin comisión; erosiona margen y confianza) | Logística | shipping + COD |
| 3 | **Stock-outs** (pedidos sin inventario; frustran al seller, decepcionan al consumidor, dañan el SLA) | Producto (desde Proveedor) | order commissions |
| 4 | **Posventa rota** (consumidor sin respuesta tras la entrega; lo siente primero el consumidor) | Posventa | LTV y reputación |

## Modelo mental — cómo pensar el conocimiento de Dropi
1. **La unidad es la ORDEN; el motor es el CONSUMIDOR FINAL.** Todo el portfolio existe para que una orden se cree, confirme, movilice y entregue bien, y se recupere si falla. *A la orden se le cuida siempre.*
2. **Toda iniciativa se evalúa con 4 preguntas:** ¿qué **etapa** fortalece? ¿para qué **perfil**? ¿qué **fuga** cierra? ¿qué **fuente de revenue** activa? (si no mueve ninguna, sospechar).
3. **Logística es el foso → defenderlo; los gaps (Fidelización/CRM, Educación, Mercadeo dedicado, Negocio del proveedor) son las zonas de oportunidad.**
4. **La cobertura cambia por perfil:** un mismo feature pesa distinto para Dropshipper vs Marca vs Proveedor vs Líder. No diseñar "para todos" sin decir para quién.
5. **La confianza es responsabilidad de Dropi** y ya tiene un vehículo (ConfioPagos/escrow); el resto de la posventa (garantías, tracking, soporte) la consolida como producto.

## Conexión con metodología / cadena de valor
- Es el **detalle** de [02](02-cadena-de-valor-y-portafolio.md) (resumen) y la **Capa 2 (proceso)** del modelo de 4 capas ([06](06-logistica-como-producto-4capas.md)).
- Las 4 fugas conectan con la jerarquía de [05](05-hipotesis-palancas-y-plan.md) y la síntesis §3; los KPIs de tiempo por fases ([03](03-modelo-datos-y-estados.md)) miden la fuga #2.
- El **Trust Agent** ([13](13-dia2-el-motor-cadena-de-valor-y-consumidor-final.md)) se cruza con ConfioPagos (ya operacionaliza el escrow) y el Módulo de garantías Dropi.

## Preguntas abiertas / pendientes
- [ ] **Mercadeo sin stack dedicado** y **Fidelización sin CRM**: ¿son gaps a llenar (build/partner) o a ceder? Decisión de portfolio.
- [ ] **Educación concentrada en Academy** = riesgo de single point of failure.
- [ ] Falta aún la **parte de PLG/loops del Día 2** (loops + Momento Ajá; ya hay base en [07](07-plg.md)) — pendiente si Juan comparte ese tramo del artifact.
