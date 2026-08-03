# Spec · Normalización de estados

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Product Designer | Michel Pino  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Stakeholder | Dirección de Producto — Maria Ossa (CPO)  `[⚪ confirmar · fuente: estrategia/]` |
| Célula | Logistic Success (+EcomScanner) |
| Etapa de la cadena | Tránsito (estados del envío, transversal a toda la cadena) |
| Estado global | 🟡 discovery cerrado + evidencia medida + entregable visual publicado (Delivery Backlog · EJECUTAR · **WIP = 1**)  `[fuente: doc:direccionamiento-2026-s2 + doc:CONTEXTO_ESTADOS_DROPI + corrida 22-jul]` |
| NSM que mueve | Habilitador de **tiempo por fases** + medición de **movilización**  `[⚪ · ver nota §2]` |
| Última actualización | 2026-07-28 |

> 📎 **Fuente maestra del discovery:** [`CONTEXTO_ESTADOS_DROPI.md`](CONTEXTO_ESTADOS_DROPI.md) —
> documento autocontenido armado desde la **API real de Dropi** + auditoría de solo-lectura sobre
> **133.555 órdenes y 52.636 guías reales de Colombia (2026-07-12)** + los dos documentos de trabajo
> previos. Fuentes crudas snapshot en `fuentes/` *(bóveda: fuentes/)* (Excel de 576 mapeos + PDF macro-proceso).
> **Cada afirmación de este spec con `[fuente: CONTEXTO §N]` sale de ahí.**
> 📐 **Diseño del catálogo (cómo debería quedar):** [`propuesta-homologacion.md`](propuesta-homologacion.md) —
> borrador v0 con diagnóstico del modelo actual, modelo por capas, catálogo objetivo e investigación
> carrier-by-carrier de las 6 colisiones.
> 📊 **Evidencia medida (qué dicen los datos):** corrida read-only del **22-jul-2026** sobre réplica
> interna — **125.232 órdenes / 1,88M eventos, CO, ventana 19-mar→22-jul**. Vive codificada en
> `hub/src/app/proyectos/logistica/_lib/normalizacion-evidencia-data.ts`. Cerró el gate de arquitectura (§5).
> 🖥️ **Entregable revisable:** [`/proyectos/logistica/normalizacion-estados`](../../../hub/src/app/proyectos/logistica/normalizacion-estados/)
> — mapa, comparador de 4 catálogos sobre el mismo tráfico, evidencia y cola de decisiones.

## 0 · Resumen y estado global
Proyecto **represado estratégico (remapeado)**, en **Delivery Backlog · estado EJECUTAR**
`[fuente: doc:direccionamiento-2026-s2]`. Consiste en **normalizar/homologar los estados** del
envío (entre transportadoras y dentro de Dropi) para tener un lenguaje único de en qué punto está
cada orden. **Es un habilitador transversal:** sin estados normalizados no se puede medir bien el
**tiempo de entrega por fases** ni la **movilización** (capas de la cadena).

**Hallazgo estructural que redefine el proyecto** `[fuente: CONTEXTO §1]`: no existe "el estado de
una orden Dropi", existen **tres fuentes distintas** y sólo **dos son homologables**:
- **A · Estado de la ORDEN** (lo emite Dropi — ciclo de vida comercial). ✅ homologable. ~15 en uso.
- **B · Estado de la GUÍA** (lo emite la transportadora — ciclo físico del paquete). ✅ homologable. ~34 en uso, ~500 en catálogo.
- **C · Movimientos del carrier** (`servientrega_movements[]`, texto libre). ❌ **NO homologable** — sólo sirve para narrativa cruda y para fechar eventos.

El PDF de macro-proceso (24 estados, 6 fases) describe **A**; el Excel de 576 mapeos describe **B**.
No se contradicen: **cubren mitades distintas del mismo flujo**. Confundir A/B/C es el error de
diseño más caro.

**🆕 22-jul · evidencia medida — el gate de arquitectura QUEDÓ CERRADO** `[fuente: corrida read-only 22-jul · 125.232 órdenes / 1,88M eventos · CO]`
- ✅ **`INTENTO DE ENTREGA` resuelto con datos.** Es **término propio de Interrapidísimo** (144.575 de
  145.733 ocurrencias = 99,2%) y ahí significa **intento fallido**: 92,08% termina en falla, contra
  44,93% de entrega en el control `EN REPARTO` de ENVIA. **No es un término compartido entre carriers
  → no hay colisión semántica → el modelo NO necesita eje `transportadora`.** Era la decisión de
  arquitectura más cara del proyecto. La clave es `estado_crudo` global, sin override.
  ⚠️ *Reserva:* el veredicto del reporte está editado a mano; los CSV lo sostienen, pero **re-correr
  el script antes de citarlo en la presentación**.
- ~~🔴 **Hallazgo colateral:** ese mismo estado está clasificado como tránsito y los datos dicen novedad.~~
  **❌ DESCARTADO por Juan el 28-jul — la conclusión estaba mal.** `INTENTO DE ENTREGA` **no es
  novedad.** Criterio de diseño: **una novedad es accionable** — alguien tiene que hacer algo
  (corregir la dirección, llamar al cliente). Un intento de entrega no lo es: se intentó, no hay nada
  que resolver, se va a volver a intentar. **Un estado se clasifica por lo que le exige a la
  operación, no por cómo suele terminar.** Destino correcto: **`En reparto`**, no `Novedad`.
  `[🟢 decidido · fuente: Juan, 28-jul]`
- 🟡 **Lo que el dato sí dice, y no hay que perder:** tras un `INTENTO DE ENTREGA` el **92,08%**
  termina en falla, contra **44,93%** del reparto normal. Eso no lo vuelve novedad, pero señala una
  fuga grande que hoy nadie mide. **Su lugar es el contador de reintentos**, no la rama de novedad.
  Refuerza la decisión abierta de §9: ¿el reintento es estado propio o contador sobre «En reparto»?
- 🔗 **Cierra un cabo suelto:** el mapa tiene un nodo **`Reintento de entrega` que ninguna traza
  recorre**, y `INTENTO DE ENTREGA` era el crudo con más volumen sin buen destino. **Son las dos
  mitades del mismo hueco.**  `[🟡 · fuente: trazas §3.2 borrador-visual]`
- 🔴 **Gate 2 abierto — terminalidad de `Entregado`. Ya no falta dato, falta decisión.** Los dos
  vocabularios no coinciden y no se contradicen: responden preguntas distintas. En **A** (estado de
  orden) rebota 0,11% y el máximo es 31h; en **C** (eventos de carrier) el p99 va de 153h (TCC) a
  495h (Coordinadora). **Recomendación: para la vista del cliente manda A → umbral de 24–48h**, no de
  3 semanas. Confirmar sobre más volumen antes de fijarlo acá.
- 📏 **El vocabulario C es tratable por volumen, no uno a uno:** 9.415 valores distintos, pero **16
  cubren el 80%** del tráfico. Confirma el ⛔ no-objetivo de §4: no se homologa uno a uno.
- ⚠️ **Alcance:** suficiente para medir transiciones y rebotes; **no** para proyectar volumen anual.
- 🔴 **Falta medir el vocabulario B (estado de la GUÍA).** La corrida midió A y C. B es la capa con el
  catálogo grande (~900 estados) y la que describen los 576 mapeos, pero **no tiene corrida
  transaccional propia**: todo lo que afirmamos de ella sale del catálogo publicado o de trabajo
  manual. Ojo: el «46% del catálogo con cero ocurrencias» se afirma de B pero se comprobó en A.

> **📦 Cifras de la corrida del 22-jul** — se guardan acá porque el 28-jul se sacaron de la vista
> (ver §10). Ventana 19-mar→22-jul 2026, Colombia.
>
> | | **A · estado de orden** | **C · movimientos del carrier** |
> |---|---|---|
> | Eventos | 47.683 | 1.883.560 |
> | Estados distintos | 51 | 9.415 |
> | Cubren el 80% | 9 estados | 16 estados |
> | Cubren el 95% / 99% | 21 / 32 | 70 / 624 |
> | Sin clasificar | 1 (`ASIGNADO`, 27 ocurr.) | 12 (códigos numéricos y textos largos) |
>
> **Top A:** PENDIENTE 9.258 · PENDIENTE CONFIRMACION 7.852 · GUIA_GENERADA 7.065 · PREPARADO PARA
> TRANSPORTADORA 4.799 · RECOGIDO POR DROPI 3.096 · EN REPARTO 2.182 · ENTREGADO 1.871.
> **Top C:** RECLAME EN OFICINA 417.630 (22,2%) · TRANSITO NACIONAL 221.450 · CENTRO ACOPIO 214.363 ·
> INTENTO DE ENTREGA 145.733 · TRANSITO REGIONAL 92.284.
> ⚠️ `RECLAME EN OFICINA` es el #1 de C con 417.630 y en A son **184**: el retiro en punto es hoy
> prácticamente invisible para Dropi.
>
> **Rebote de terminales (C):** COORDINADORA `PEDIDO CANCELADO` rebota 99,59% · ENVIA `DEVUELTA`
> 47,76% · INTERRAPIDISIMO `DEVOLUCION RATIFICADA` 19,89% · las de entrega, entre 0,16% y 5,71%.
> **Órdenes por carrier:** ENVIA 52.513 · INTERRAPIDISIMO 41.957 · TCC 17.612 · COORDINADORA 10.558 ·
> VELOCES 2.245 · el resto <120. **Longitud de traza (C):** mediana 8, p90 34, p99 115, máx 543.

**🆕 12-jul · discovery levantado con datos reales** `[fuente: CONTEXTO_ESTADOS_DROPI.md]`
- Se auditó la **API real + base de 133.555 órdenes / 52.636 guías (CO)**. Respuestas duras a las 3 preguntas abiertas (ver §9, ya cerradas).
- **El catálogo está inflado ~10×:** publica ~500 estados/país pero en tráfico real circulan **~50**; **46% del catálogo tiene CERO ocurrencias históricas** → homologar **por volumen**, no a mano los 400 que nunca llegaron.
- **Multi-país resuelto sin viajar:** se verificaron catálogos de 7 países vía API — **los estados NO colisionan entre países** (un `PENDIENTE` es lo mismo en CO y MX) → **el modelo NO necesita eje `país`**, un catálogo global alcanza. (Esto responde el correo pidiendo cuentas MX/AR — ya no bloquea.)
- ~~**Sí puede necesitar eje `transportadora`:**~~ había **6 colisiones candidatas** donde el mismo estado crudo se clasificaba distinto según carrier. **CERRADO el 22-jul: no hay colisión semántica real** — ver §5 y el bloque del 22-jul arriba.

**🆕 09-jul · avances de la semana** `[fuente: update de Juan a Maria, 09-jul]`
- Juan **envió correo pidiendo cuentas en los otros países** (MX/AR/…) para revisar **casos reales de guías**. *(⚠️ contexto: el CONTEXTO del 12-jul ya cerró el panorama multi-país vía API — el acceso a cuentas deja de ser bloqueante para decidir el eje `país`.)*
- Está construyendo una **primera versión más interactiva** del mapa/propuesta de estados → alimenta el paso "actualizar el mapa/gráfico de estados (dividido y agrupado)" antes de presentar y abrir mesas de trabajo.

## 1 · Problema raíz
- 🟡 **El estado del envío está fragmentado en 3 fuentes con vocabularios y cadencias distintas**
  (orden / guía / movimientos crudos), sin un lenguaje único. Sin homologar, no se puede medir
  transiciones ni ubicar dónde se fuga el valor.  `[🟡 · fuente: CONTEXTO §1]`
- 🟡 **El catálogo publicado no refleja la realidad:** ~500 estados/país catalogados vs **~50 reales**;
  46% del catálogo nunca ocurrió. Homologar contra el catálogo entero es esfuerzo desperdiciado.  `[🟡 · fuente: CONTEXTO §4.1]`
- 🟡 **La cabecera de la orden se atrasa respecto de su propio historial** (`status` de cabecera ≠
  último `history[]`) → el estado "efectivo" hay que derivarlo del `history[]` con `id` más alto.  `[🟡 · fuente: CONTEXTO §1.1]`
- Conecta con hallazgos previos: tiempo por fases (`metodologia/product-logistics.md §3.1`) y "el
  motivo de cancelación NO está instrumentado".  `[fuente: conocimiento/]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** 🟡 "Homologar los estados a un catálogo único (por volumen real, con implicaciones
  físicas declaradas) permite medir tiempo por fases y movilización con precisión, lo que destraba
  la priorización del resto de proyectos de la célula."  `[🟡 · validar con Maria/Data]`
- **Métrica de éxito + línea base:** candidata → **% de órdenes con transición de estado trazable /
  cobertura de estados mapeados por volumen** (~50 estados cubren ~100% del tráfico). Línea base por
  medir contra la base actual.  `[⚪ · data: por cerrar]`
- **NSM:** indirecto — es **habilitador de medición** de movilización y tiempo por fases (Ley 5).

## 3 · Usuarios / actores
- **Operador logístico / equipo de producto-data** — consumidor del detalle completo (necesita los ~21 estados).  `[🟡 · fuente: CONTEXTO §8.3]`
- **Cliente final (comprador)** — no debería ver 21 estados sino **8** (vista simplificada).  `[🟡 · fuente: CONTEXTO §8.3]`
- **Transportadoras** — origen de los estados crudos (7 carriers, casing inconsistente).  `[🟡 · fuente: CONTEXTO §4.4]`
- **Dropshipper** — ve el estado del envío.  `[🟡]`

## 4 · Alcance
**Entra (por estado):**
- 🟡 **Catálogo único de estados homologados** (separando vocabulario A=orden y B=guía desde el modelo de datos, no desde la UI — el catálogo ya los distingue con la propiedad `company`).  `[🟡 · fuente: CONTEXTO §10]`
- 🟡 **Mapeo estado_crudo → estado homologado**, priorizado **por volumen real**, con default observable para desconocidos ("por clasificar").  `[🟡 · fuente: CONTEXTO §4.1, §10]`
- 🟡 **Declaración de implicaciones físicas por estado** (¿salió de bodega? ¿orden cerrada? ¿terminal/reversible? ¿efecto en stock?) — sin esto es una lista, no una homologación.  `[🟡 · fuente: CONTEXTO §7]`
- 🟡 **Dos capas de vista:** operador (~21) vs cliente final (8).  `[🟡 · fuente: CONTEXTO §8.3]`
- 🟡 **Modelar reintentos (3 intentos → devolución) y rama de siniestro/indemnización** (están en el PDF, en ningún otro lado).  `[🟡 · fuente: CONTEXTO §8.1, §8.4]`

**No-objetivos (⛔ — explícito):**
- ⛔ **Homologar `servientrega_movements[]` / `nom_mov`** — es texto libre del carrier, no es estado.  `[⛔ · fuente: CONTEXTO §3.5]`
- ⛔ **Eje `país` en el modelo** — los estados no colisionan entre países, un catálogo global alcanza.  `[⛔ · fuente: CONTEXTO §3.1]`
- ⛔ Homologar a mano los ~400 estados de catálogo con cero ocurrencias.  `[⛔ · fuente: CONTEXTO §4.1]`

## 5 · Reglas de negocio
- 🟡 **Estado efectivo = entrada de `history[]` con `id` más alto** (ids monótonos), no el `status` de cabecera; salvo que la cabecera no aparezca en el historial (entonces vale la cabecera — historial incompleto).  `[🟡 · fuente: CONTEXTO §1.1]`
- 🟡 **A y B avanzan a ritmos distintos** — la UI fusiona las dos líneas de tiempo, no elige una.  `[🟡 · fuente: CONTEXTO §1]`
- 🟢 **Las 6 colisiones — CERRADAS (22-jul).** Investigadas carrier-by-carrier el 12-jul: **5 de 6 eran errores de llenado**; la sexta, `INTENTO DE ENTREGA`, era la única candidata a colisión semántica real. **La corrida del 22-jul la descartó con datos**: el término es de Interrapidísimo (99,2%) y no lo comparte con otros carriers, así que no hay dos significados que reconciliar. **La clave es `estado_crudo` global — sin eje `transportadora` y sin override.** Detalle en [`propuesta-homologacion.md §6`](propuesta-homologacion.md); veredicto en el bloque 22-jul de §0. Queda una validación cualitativa (no bloqueante): confirmarlo con Interrapidísimo, ya con el número en la mano.  `[🟢 · fuente: corrida 22-jul + propuesta §6]`
- 🟡 **`Entregado` no es terminal por sí solo** — es terminal tras una ventana sin nuevo evento. Qué capa la define es el gate 2 (§9).  `[🟡 · fuente: corrida 22-jul]`
- 🟡 **Un mismo texto crudo puede existir en el vocabulario A y en el C con conteos de otro orden de magnitud** (`INTENTO DE ENTREGA`: 174 en A, 145.733 en C). Toda cifra debe citarse **con su capa**; sin eso se lee como contradicción.  `[🟡 · fuente: corrida 22-jul]`
- 🟡 **Normalizar el casing de transportadora en ambos lados** (catálogo=Title Case, órdenes=MAYÚSCULAS) o el match falla en silencio.  `[🟡 · fuente: CONTEXTO §4.4]`

## 6 · Criterios de aceptación (Gherkin)
- N/A — se redactan en el Hand-off a TI (doc E2E §4.5). Insumo listo: checklist de construcción en `CONTEXTO §10`.

## 7 · Datos (diccionario)
- 🟡 **Fuente autoritativa del vocabulario:** endpoint `helpers/getStatusesByCountry` — objetos con propiedad `company` = estado de transportadora (B); sin ella = estado de orden (A).  `[🟡 · fuente: CONTEXTO §3.1]`
- 🟡 **Línea de tiempo de estados:** `order.history[]` (`id`, `status`, `created_at` naive, `user`). ⚠️ **NO viene en el listado** — sólo 1,7% de órdenes lo traen desde `myorders/v2`; hay que pegarle al **detalle orden por orden**. Presupuestar ese costo.  `[🟡 · fuente: CONTEXTO §3.4]`
- 🟡 **Timestamps naive en hora local de cada país** (no UTC) → usar zona IANA por país; Argentina tiene DST, nunca offset fijo.  `[🟡 · fuente: CONTEXTO §5]`
- ⚪ Mapear a tablas internas: `Historyorder`, `q18` (tiempos por transición), `Order.date_*` (ver `conocimiento/temas/10`).  `[⚪ · data: por cerrar contra la base actual]`
- 🔴 **Errata del Excel previo:** su columna "Estado Actual (DB)" usa categorías eliminadas en abril-2026 (`PENDIENTE_RECOLECCION`, `RECIBIDO_TRANSPORTADORA`, `EN_REPARTO`) → el "Plan de Ajustes" (145 cambios) y los totales (dice 576, real ~900) **no son confiables**; el diff hay que recalcularlo. El contenido semántico sí sirve.  `[🔴 · fuente: CONTEXTO §9]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Idea/Proyecto Polaris | [PRM-1297](https://dropi-it.atlassian.net/browse/PRM-1297) |
| Doc E2E (Drive) | [Proyectos E2E - Normalización de estados](https://docs.google.com/document/d/1MdJpIfBWM3dODcMW8big-4-RfOxatUIt1I2CcoGtV-Y/edit) |
| Carpeta Drive | [Normalización de estados](https://drive.google.com/drive/folders/1aI3PxUKGTuM5WVZ753Qv-5JyRaVC_9gw) |
| Figma | N/A — aún no |

## 9 · Preguntas abiertas
**Cerradas por el CONTEXTO (12-jul):**
- [x] ¿Cuántos/cuáles estados crudos hay por transportadora y país? → **~500 catalogados/país, ~50 reales; 46% con cero ocurrencias.** Top real en `CONTEXTO §4.2`. Los estados NO colisionan entre países.  `[CONTEXTO §4, §3.1]`
- [x] ¿El catálogo normalizado existe o se crea de cero? → **Existen 3 propuestas** (PDF 24 estados/6 fases · Excel 21 estados/576 mapeos · vista usuario 8 estados). Se **consolidan**, no se parte de cero. Contradicciones mapeadas en `CONTEXTO §8.4`.  `[CONTEXTO §8]`
- [x] ¿Qué proyectos dependen de esto? → **Tiempo por fases / Torre de control** (habilitador directo), movilización, novedades. Ver §2.

**Cerradas por la corrida del 22-jul:**
- [x] 🟢 **Las 6 colisiones: ¿errores de llenado o semántica real?** → **errores de llenado.** La clave es
  `estado_crudo` **global**, sin eje `transportadora` y sin override. Era el gate de arquitectura y ya no
  bloquea nada.  `[corrida 22-jul · ver §0 y §5]`

**Abiertas / a decidir:**
- [ ] 🔴 **Re-mapear `INTENTO DE ENTREGA`:** hoy cuenta como tránsito, los datos dicen novedad —
  145.733 eventos del vocabulario C (7,74%). Responsable: Juan + TI. **No es discusión, es corrección.**  `[corrida 22-jul]`
- [ ] 🔴 **Terminalidad de `Entregado`: ¿qué capa manda, A o C?** Ya no falta dato, falta decisión.
  Recomendación: manda A, umbral 24–48h. Responsable: Juan + Maria.  `[corrida 22-jul]`
- [ ] 🟡 **Cerrar el conteo del catálogo.** Circulan tres cifras y hay que quedarse con una: el mapa
  modela **24 estados**; la propuesta v0.1 lista **26** porque abre `Novedad` y `Reintento` por nivel
  (1/2/3), y trata `Incautado`, `Excepción`, `En proceso de indemnización` y `Devuelto` como estados
  propios en vez de absorberlos. **Decidir: ¿los reintentos son estados o `estado + contador`?**
  Con Michel + Maria.  `[CONTEXTO §8 + propuesta §11]`
- [ ] 🟡 Aprobar la **vista cliente 8+1** — `Disponible para retiro` como noveno estado (habilita aviso,
  punto y fecha límite).  `[propuesta §11.D]`
- [ ] 🟡 Declarar implicaciones físicas por estado (salida bodega / cierre / reversible / stock).  `[CONTEXTO §7]`
- [ ] 🟡 **Validar el cierre de la devolución.** Ninguna de las 14 guías llega a `Devolución confirmada`:
  ese estado lo marca el **proveedor**, no el carrier, así que una traza de carrier no puede contenerlo.
  Es el desenlace más frecuente de la muestra (11 de 14) y **no está validado por ningún dato**. Hay que
  buscar la señal en otra fuente.  `[borrador-visual §3.1]`
- [ ] ⚪ Cobertura multinacional: tomar al menos **una guía real por país** y registrar los crudos que caigan
  en `Por clasificar`. Hoy solo Colombia tiene validación transaccional.  `[borrador-visual §2]`
- [ ] ⚪ Recalcular el diff contra la base actual (~900 estados), no contra el Excel desactualizado.  `[CONTEXTO §9]`
- [ ] ⚪ Mapear los estados homologados a las tablas internas (`Historyorder`, `q18`).

## 9.B · Modelo vigente: DOS capas, no tres  `[🟢 decidido · fuente: Juan, 29-jul]`

> Regla de Juan: **«1 realmente: el homologado y el estado crudo — crudo lo ven los admin,
> homologado lo ven los usuarios».**

```
ESTADO CRUDO  ──────────►  HOMOLOGADO (9)
lo que llega                lo que se muestra
· lo ve el admin            · lo ven los usuarios
· no se toca                · es EL entregable
```

**Los 9 homologados:** En preparación · En tránsito · En reparto · Disponible para retiro ·
Novedad · Entregado · En devolución · Devuelto · Cancelado.

Decisiones de nombre (29-jul): `En camino` → **`En tránsito`** (era el mismo estado con dos
nombres) · `Novedad en tu pedido` → `Novedad` · `Proceso finalizado` **eliminado** · `Devuelto`
**agregado** (faltaba el cierre de la devolución) · `Indemnizado` **el usuario nunca lo ve**.

### Los 24 estados intermedios → ahora son PUNTOS DE MEDICIÓN, no vocabulario

El catálogo de 24 dejó de mostrarse el 29-jul: no tenía audiencia (ni admin ni usuario lo leían).
**Pero no se borra**, porque es donde vive la medición que justifica el proyecto. Se conserva acá
como la agrupación interna de cálculo:

| Homologado (usuario) | Agrupa estos puntos de medición |
|---|---|
| **En preparación** (7) | Por confirmar · Pendiente · Guía generada · Pendiente de recolección · Preparado para transportadora · Recolección fallida · Reintento de recolección |
| **En tránsito** (6) | Recibido por transportadora · En tránsito · Entregado a transportadora · Recolectado por Dropi · En bodega Dropi · Novedad solucionada |
| **Cancelado** (3) | Rechazado · Cancelado · *(Indemnizado — no visible al usuario)* |
| **En reparto** (2) | En reparto · Reintento de entrega |
| **Novedad** (2) | Novedad · Siniestro |
| **Entregado** (1) | Entregado |
| **Disponible para retiro** (1) | Disponible para retiro |
| **En devolución** (1) | En devolución |
| **Devuelto** (1) | Devolución confirmada |

⚠️ **Por qué importa conservarlos.** 13 de los 24 viven dentro de dos baldes, y ahí están las dos
fugas de tiempo que el proyecto quiere medir:
- entre `Guía generada` y `Recolección fallida / Reintento de recolección` → **cuánto tarda la
  transportadora en venir a recoger**;
- entre `En bodega Dropi` y `Recibido por transportadora` → **el paquete sale de bodega y arranca
  el reloj del transportador** (además es el hito contable de salida de inventario).

Si el hand-off a TI implementa solo los 9, **la medición de tiempo por fases se pierde**. Los 9 son
la capa de presentación; estos 24 son la capa de cálculo.

🔴 **Y 5 de los 24 no se pueden medir hoy: ningún estado crudo los alimenta.**

| Punto de medición | Por qué no llega |
|---|---|
| `Pendiente de recolección` | Derivable por regla (guía generada y todavía sin recibir). **Sin él no se mide cuánto tarda la recogida** — que es justo la fuga que se quería medir. |
| `Recolección fallida` | Existe en el vocabulario del transportador, no en el de la orden. Hay que subirlo o se pierde. |
| `Reintento de recolección` | El ciclo de reintento de recogida no se registra como evento propio. |
| `Reintento de entrega` | Las trazas vuelven directo a «En reparto». O sobra el punto, o falta el evento. |
| `Siniestro` | Sin ocurrencias en la ventana medida. |

Es decir: **la mitad de la fase de recolección es un hueco de instrumentación**, no un problema de
homologación. Esto entra al hand-off como requisito, no como supuesto.
`[🔴 · guardado el 29-jul, al salir el catálogo de 24 de la vista]`

### Peso medido de cada ruta operativa
Sobre las **7.001 órdenes que generaron guía** en la ventana mar–jul 2026, según el estado que
marca cada tramo. **No son excluyentes** (una orden con Dropi pasó antes por ECOM), por eso no
suman 100:

| Ruta | Peso | Señal usada |
|---|---:|---|
| **ECOM** | 68,5% | `PREPARADO PARA TRANSPORTADORA` (4.799 órdenes) |
| **ECOM + Dropi** | 44,2% | `RECOGIDO POR DROPI` (3.096 órdenes) |
| **Directo** | ~31% | no registra ninguna de las dos señales |

⚠️ Corrige una estimación previa (98 / 0,8 / 1,2) que era falsa: dividía conteos de un universo
por el total de otro. `[🟡 · guardado acá el 29-jul, al salir el selector de rutas de la vista]`

### Fases del macroproceso (7) — se conservan igual
Gestión de orden · ECOM · Recolección · Transporte y entrega · Novedad y reintentos · Siniestro ·
Devolución. Cada punto de medición pertenece a una.

## 10 · Changelog
- **2026-07-28 (tarde) — El entregable se cortó a UNA pantalla + fallo de fondo sobre «intento de
  entrega».** Dos cosas:
  1. **Corrección de contenido (Juan):** `INTENTO DE ENTREGA` **no es novedad** — una novedad es
     accionable, un intento no lo es. Va a **`En reparto`**. Se eliminó el «hallazgo crítico» que
     decía lo contrario y el gate asociado. Ver §0.
  2. **Corte del entregable:** la vista tenía 4 pestañas y ~15 bloques y **dejó de entenderse**
     ("no estoy entendiendo nada"). Quedó en 4 bloques: el problema · el mapa · lo que ve el
     cliente · lo que se decide hoy. Los envíos de ejemplo y el macroproceso quedan plegados.
     **Se sacaron de la vista** (y viven acá): evidencia medida, comparador de 4 catálogos, reparto
     de los 51 crudos, países, transportadoras, las 3 capas A/B/C, los tres criterios de
     «validado» y todos los porcentajes de eventos. Se eliminaron los módulos
     `normalizacion-catalogos-data.ts` y `normalizacion-evidencia-data.ts`; sus cifras quedaron en
     el bloque 📦 de §0. También se **quitó del hub toda referencia técnica** (nombres de tablas,
     endpoints, «réplica», «vía API») y se anonimizaron los 14 números de guía reales.
     Las 9 decisiones se redujeron a **2 para decidir hoy** + 4 anotadas.
- **2026-07-28 — Revisión de coherencia antes de la mesa de trabajo.** El spec estaba congelado en
  12-jul y presentaba como gate abierto algo cerrado el 22-jul. Se incorporó la corrida de evidencia,
  se cerró el gate de arquitectura en §5 y §9, y se reescribió §9 con las decisiones que sí siguen
  abiertas. En paralelo se corrigieron contradicciones del entregable visual: un hallazgo de traza que
  se contradecía con el de al lado (`«Devolución»` iba a `En devolución`, no a `Devolución confirmada`),
  cifras del mismo texto crudo citadas sin decir de qué capa salían (174 en A vs 145.733 en C), el
  vocabulario de fases del propio mapa —11 nombres para una lista de 7— y tres criterios distintos de
  «no validado» que se usaban con la misma palabra. Origen: revisión pedida por Juan.
- **2026-07-22 — Evidencia medida.** Corrida read-only sobre réplica interna (125.232 órdenes /
  1,88M eventos, CO). Cierra el gate de arquitectura: `INTENTO DE ENTREGA` es término propio de
  Interrapidísimo, no hay colisión entre carriers, el modelo no necesita eje `transportadora`.
  Destapa el hallazgo colateral (7,74% del tráfico mal clasificado) y deja el gate de terminalidad
  como decisión, no como falta de dato. Origen: scripts de Juan fuera del repo.
- **2026-07-17 — Borrador de la propuesta final visual.** [`borrador-propuesta-final-visual.md`](borrador-propuesta-final-visual.md):
  evidencia disponible por capa, inconsistencias que la visualización no debe esconder y 7 gates para
  declarar la propuesta final. **No promovido al spec** (por decisión: requiere aprobación de Juan).
- **2026-07-12 — Discovery levantado con datos reales.** Se sumó [`CONTEXTO_ESTADOS_DROPI.md`](CONTEXTO_ESTADOS_DROPI.md) (API real + auditoría de 133.555 órdenes / 52.636 guías CO) y fuentes crudas snapshot (`fuentes/` *(bóveda: fuentes/)*: Excel 576 mapeos + PDF macro-proceso). Reescritos §0–§9 con hallazgos: modelo de 3 fuentes (A/B/C), catálogo inflado ~10×, sin eje país, 6 colisiones como gate de arquitectura, implicaciones físicas como requisito. Cerradas las 3 preguntas abiertas. Origen: docs de trabajo de Juan en repo `BodeGo-back`.
- 2026-06-23 — Creado el spec + carpeta Drive + doc E2E base. Origen: direccionamiento de la célula (CPO). Discovery pendiente (por leer PRM-1297).
