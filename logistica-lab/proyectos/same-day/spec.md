# Spec · Same Day (proveedores, marcas y fulfillment)

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Product Designer | Michel Pino  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Stakeholder | Dirección de Producto — Maria Ossa (CPO)  `[⚪ confirmar · fuente: estrategia/]` |
| Célula | Logistic Success (+EcomScanner) |
| Etapa de la cadena | Despacho / Tránsito (coberturas y distancias) |
| Estado global | 🟡 discovery levantado (borrador desde Jira · Delivery Backlog · EJECUTAR)  `[fuente: doc:direccionamiento-2026-s2 + jira:PRM-1366]` |
| NSM que mueve | % de entrega + tiempo por fases (entrega same-day)  `[⚪ · validar magnitud]` |
| Última actualización | 2026-07-25 |

## 0 · Resumen y estado global
Proyecto **heredado de junta directiva (enfoque OKR)**, en **Delivery Backlog · estado EJECUTAR**
`[fuente: doc:direccionamiento-2026-s2]`. Busca **formalizar la entrega same-day como producto** de la
plataforma (hoy es manual). Cuelga del **Proyecto OKR [PRM-1514](https://dropi-it.atlassian.net/browse/PRM-1514)**
"Optimización coberturas y distancias". PRM-1366 no tiene descripción, pero su **red de conexiones Polaris**
levanta el discovery (problema, sub-oportunidades y la idea de solución) — destilado abajo.  `[🟡 · fuente: jira:PRM-1366 issuelinks, 24-jun]`
**🆕 30-jun: discovery COMPLETO encontrado en Figma** (board "Research same-day", PD **Michelle López**) → destilado en §0.1. **Corrige el estado:** el discovery no estaba pendiente, estaba hecho fuera del cerebro.
**🆕 09-jul · revisión corta con Veloces (riesgo vivo en producción):** hoy Veloces le saca guía **"same day" a ciertos dropshippers/proveedores SIN ninguna lógica detrás** — no valida tipo de envío ni geografía (ej. **Cali→Santa Marta igual sale como same day**). Confirma **en producción** el dolor del §0.1 ("falsos SD y promesas incumplidas"): el SD se asigna a dedo, no por regla. **No hay construcción nueva** (sigue ⚪ discovery). → es **evidencia dura** de que el MVP debe empezar por **① flag SD + ④ validación geográfica** (misma ciudad/municipio elegible) para cortar los falsos SD. `[fuente: update de Juan a Maria, 09-jul]`

## 0.1 · Discovery destilado — board Figma "Research same-day" `[fuente: figma:uZeHBc0bilrBIXgYWyxeow · PD Michelle López · destilado 30-jun]`

### Hallazgos por área
- **Bodega/Fulfillment** (Jorge Escobar · Óscar Gómez): cortes cada 2h (7AM–4PM), picking batch por transportadora. **La identificación SD es 100% manual** (listado de Comercial). El WMS nuevo (**Stock Pro**) puede clasificar SD pero **no recibe el input de Dropi**. Dolor: un pedido Veloces que entra 8PM se clasifica como SD del día siguiente → **falsos SD y promesas incumplidas**.
- **Veloces/Transportadora** (Urley Ospina): entregan el mismo día como **"valor agregado" sin costo adicional ni marcación formal**; corte 11AM para bodegas Dropi. Su TMS puede marcar SD pero **Dropi no le envía la señal**. Dolor: sin diferenciación, no puede **medir cumplimiento ni monetizar**.
- **Producto** (Katerine · Michelle · Alejandro · Juan Diego): SD se ofrece comercialmente a Marcas, pero **no hay identificador tecnológico nativo** en Dropi que hable con WMS/transportadora. Flujo informal: **voz a voz → Excel → coordinación**. Alcance acordado: **Bodegas Dropi + Veloces + Envíos Urbanos**; tarifa pendiente con Carlos Peralta.

### Flujo AS-IS (12 pasos) — el SD vive de un Excel manual
Catálogo → Generación de orden → **③ Identificación manual SD** (Comercial Mayra/Vanessa → bodega vía WhatsApp/Excel; **sin este paso la bodega no sabe qué es SD** 🚩) → Generación de guía (Dropi) → Carga al WMS (Copérnico, manual) → **⑥ Primer corte/picking 7–9AM** (prioriza por transportadora, **NO por flag SD**) → Picking (2 pickers, ~100 ped/ciclo) → Packing → Cross docking (Veloces primero) → Entrega física a Veloces 9:30–11AM → Distribución Veloces (georreferenciación) → Entrega cliente final (tarde, mismo día). **Dropi nunca marca "SD" ni "entregado SD" → medición imposible.**

### SLAs operativos `[fuente: Óscar/bodega]`
Hora de corte SD ~7–11AM · entrega a Veloces 11AM · Veloces llega 9:30–10AM · cortes de picking 7/9/11AM·2·4PM · capacidad ~100 ped/ciclo (2 pickers) · volumen full-fill Bogotá ~2.500 órd/día · recepción inventario 24–72h.

### Elegibilidad geográfica (Veloces)
✅ **Bogotá–Bogotá** (core) · **Medellín–Medellín** (+Bello/Itagüí/Sabaneta) · **Cali–Cali** (+Jamundí). ⚠️ Parcial: Bogotá–Chía/Mosquera/Funza · Medellín–Tagüí/Bello (Veloces no despacha). ❌ Palmira (desde Cali) · intercity Bogotá–Cali (solo aéreo, costo prohibitivo).

### Requisitos del MVP
**Técnicos:** ① **Flag SD en la orden** al crearla (validación hora de corte en tiempo real) · ② **Validación de hora de corte** (post-corte → bloquea/advierte y redirige a ND) · ③ **Validación geográfica** (origen=destino misma ciudad/municipio elegible) · ④ **Propagación del flag al WMS** (Dropi→Stock Pro, campo `tipo_envio = SD/ND/Express` → ola de picking prioritaria) · ⑤ **Señal SD al TMS de Veloces** (priorización en distribución).
**Operativos:** cobertura SD formal (municipios, con Veloces + Carlos Peralta) · tarifa diferencial (con Carlos Peralta) · SLA publicado en plataforma · **alcance MVP = bodegas propias Dropi [Bogotá/Medellín/Cali] + Veloces; EXCLUIR bodegas externas de marcas en fase 1** · reunión cross-funcional (Bodega Jorge/Óscar · Veloces Urley · Comercial Vanessa · TI Fernando · Producto) antes de dev.

### Matriz de priorización (11 gaps) — define el MVP
| Prioridad | Gaps |
|---|---|
| **MVP** | ① flag SD (UX+BE) · ② hora de corte (UX) · ③ propagación WMS (Integración) · ④ validación geo (BE+UX) · ⑥ selección transportadora guiada en UI (UX) · ⑦ marcación para medir cumplimiento (Data) — **todos Alto impacto** |
| **Post-MVP** | ⑤ notificación SD al cliente final (UX) · ⑧ **tarifa diferencial (Negocio, requiere negociación externa)** · ⑩ dashboard monitoreo SD (UX interno) |
| **Fase 2** | ⑨ bodegas externas de marcas (Operativo) · ⑪ otras transportadoras Inter/TCC (Operativo) |

## 1 · Problema raíz
- **El same-day NO existe como producto dentro de la plataforma: es un proceso manual, sin cobro ni
  medición.**  `[🟡 · fuente: jira:PROB-247 (Problem roadmap conectado)]`
- Consecuencia: no es escalable, no monetiza el flete premium y no se puede medir su impacto en entrega.  `[🟡 · inferido del problema]`
- Encaje estratégico: palanca del **OKR 2 · KR2.1 (tasa de entrega ≥70%)** vía "coberturas y distancias".  `[⚪ · fuente: doc:marco-comun-2026-s2 §5]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "si formalizamos el same-day como producto en plataforma (**flag en orden, validaciones,
  integración WMS y tarifa**), se vuelve **cobrable, medible y escalable**, y sube la entrega rápida."  `[🟡 · fuente: jira:PRM-1316 (idea de solución)]`
- **Métrica de éxito + línea base:** adopción (# órdenes same-day), **% entrega same-day en SLA**, tiempo
  de la orden, e **ingreso por tarifa**. Línea base N/A — depende de la "Primera medición de KPIs".  `[⚪ · base por cerrar]`
- **NSM:** % de entrega + tiempo por fases.  `[⚪ · validar magnitud]`

## 3 · Usuarios / actores
- **Proveedores · Marcas · Fulfillment** (operación) — generan la orden same-day.  `[🟡 · fuente: doc:direccionamiento-2026-s2]`
- **Bodegas Dropi / Veloces** (infraestructura propia) y **transportadoras externas** (escalar cobertura).  `[🟡 · fuente: jira:PRM-1156 / PRM-1225]`
- **Consumidor final** (recibe el mismo día).  `[⚪]`

## 4 · Alcance
**Entra — tres frentes (sub-oportunidades conectadas):**
- **Producto formal del flujo same-day:** flag en orden, validaciones, integración WMS y **tarifa**.  `[🟡 · fuente: jira:PRM-1316]`
- **Infraestructura propia:** Same Day sobre **Veloces + Bodegas Dropi**.  `[🟡 · fuente: jira:PRM-1156]`
- **Escalar a infraestructura externa** (otras transportadoras / bodegas) sin perder control operativo.  `[🟡 · fuente: jira:PRM-1225]`
- **Coberturas y distancias** (qué ciudades/zonas habilitan same-day).  `[⚪ · fuente: PRM-1514]`

**No-objetivos (⛔ — por confirmar en Definición):**
- ⚪ Delimitar fase 1 (¿solo infra propia? ¿qué ciudades?) — se fija al cerrar discovery.

## 5 · Reglas de negocio

### 5.0 · Elegibilidad de una orden — tres condiciones, no una
Una orden es same-day sólo si cumple **las tres**. Hoy no se valida ninguna: por eso
Cali→Santa Marta salió con guía SD.  `[🟡 · fuente: simulador same-day + discovery §0.1]`
1. **Geográfica** — origen y destino en la misma ciudad/municipio elegible (gap ④).
2. **Horaria** — la orden entra antes de la hora de corte (gap ②).
3. **De capacidad** — la zona de destino cabe en la jornada con la flota disponible.

### 5.1 · Hallazgo del simulador: el cuello de botella es HORARIO, no geográfico
`[🟢 · fuente: hub/public/logistica/same-day, modo Simulación, 26-jul]`
Modelado con Dijkstra sobre la red vial real de OSM (accesibilidad) + **Daganzo (1984)**
(capacidad de ruta), sobre la demanda ya ubicada:
- **Las 37 zonas de Bogotá quedan accesibles** desde una bodega céntrica en todos los escenarios
  probados: ir y volver nunca agota la jornada → **la distancia no es lo que limita el SD**.
- **El corte sí manda:** 11:00 → 24% de la demanda sale el mismo día · 15:00 → 51% · 18:00 → 66%.
  → **mover la hora de corte es la palanca principal**, lo que respalda la prioridad del gap ②.
- **Ubicación óptima de bodega** (p-mediana sobre demanda real): Bogotá **4.630, −74.085**
  (Puente Aranda, 14,8 min medios) · Medellín **6.249, −75.565** (8,0) · Cali **3.437, −76.522**
  (9,3). Que Bogotá dé Puente Aranda —el distrito logístico real— indica que el modelo no delira.

### 5.1.1 · Dimensionamiento con el periodo confirmado
`[🟡 · fuente: confirmación de Juan 26-jul — junio completo, reparto lunes a viernes = 20 días]`
Con día pico 1,4× (la flota no se dimensiona con el promedio o se queda corta la mitad de los
días) y corte a las 11:00: **Bogotá 3.410 órdenes same-day/día con 86 vehículos**. Suba sola:
2.360 órdenes/día de demanda, 569 que alcanzan el corte, **14,2 vehículos**.

> 🚩 **Contradicción que bloquea usar estas cifras.** Junio en 20 días implica **10.104
> órdenes/día en Bogotá**, contra las **~2.500 órd/día de full-fill** que documenta el §0.1 —
> **4×**. Lectura más probable: el archivo trae **toda la demanda hacia esas ciudades**, no sólo
> lo que sale de bodega Dropi, y el MVP fase 1 sólo cubre lo segundo. Si se confirma, **el
> universo servible es una fracción de las 427.294** y el dimensionamiento está sobreestimado.
> No es error de cálculo: es estar midiendo sobre el universo equivocado.
> → `bodega_origen_id` pasa a ser **el campo más urgente** de `peticion-data.md`.

⚠️ La capa horaria está **simulada**, no medida (no hay timestamps): se publica la curva completa
corte↔cobertura, no un número. Lo robusto es la forma.
✅ **El % servible no depende del periodo** (24,1% con corte 11:00 en todos los escenarios
probados): el periodo sólo mueve volumen absoluto y flota. Por eso la conclusión de §5.1 —que el
cuello de botella es el corte— **se sostiene aunque el universo esté por depurar**.

### 5.2 · Elegibilidad geográfica
- **Gap ④ — ahora dimensionada, no sólo declarada.** La cobertura
  del §0.1 (Bogotá–Bogotá · Medellín+área · Cali+Jamundí) ya tiene tamaño: sobre 427.294
  órdenes de las 3 ciudades, la demanda se concentra en pocas zonas y el radio necesario
  para capturarla difiere fuerte por ciudad (§7.1). La regla de validación origen=destino
  debe escribirse **por zona operativa** (localidad/comuna), no por ciudad: es la unidad con
  la que operan bodega y transportadora.  `[🟡 · fuente: data:Data samday.xlsx + mapa same-day, 25-jul]`
- ⚪ **Hora de corte (gap ②) — sin regla posible todavía.** El export no trae fecha ni hora de
  creación, así que no se puede fijar ni validar el corte 7–11 AM con datos. Es el bloqueo
  principal para escribir la regla completa.  `[⚪ · falta data]`

## 6 · Criterios de aceptación (Gherkin)
- N/A — se redactan en el Hand-off a TI (doc E2E §4.5).

## 7 · Datos (diccionario)

**Fuente disponible hoy: `Data samday.xlsx`** (entregado 25-jul). 427.294 filas, sin vacíos.
`[🟢 · fuente: data:Data samday.xlsx, verificado 25-jul]`

| Columna | Tipo | Nota |
|---|---|---|
| `orden_id` | entero | una fila por orden, sin repetidos |
| `direccion` | texto libre | nomenclatura colombiana, calidad heterogénea |
| `ciudad_destino` | texto | **sólo 3 valores**: BOGOTA / MEDELLIN / CALI |
| `dpto_destino` | texto | CUNDINAMARCA / ANTIOQUIA / VALLE |

Reparto: **Bogotá 235.310 (55,1%) · Medellín 103.322 (24,2%) · Cali 88.662 (20,7%)**.

### 7.1 · Qué se obtuvo con eso
Mapa de densidad en `hub/public/logistica/same-day/` (pipeline y método en su README).
Las direcciones se ubican **resolviendo el cruce de las dos vías** contra la geometría de
OpenStreetMap — sin geocodificador de pago y sin cuota. Cobertura: **347.462 órdenes
ubicadas (81,3%)**.  `[🟢 · fuente: pipeline same-day, 26-jul]`

Concentración por zona operativa (% sobre ubicadas de cada ciudad):
- **Bogotá:** Suba 16,6% · Kennedy 12,0% · Engativá 11,6% · Usaquén 10,8% · Fontibón 6,2% → **las 5 primeras localidades concentran el 57,2%**.
- **Medellín:** El Poblado 11,1% · Belén 10,5% · La Candelaria 9,2% · Laureles-Estadio 7,8% → reparto **mucho más plano**.
- **Cali:** Comuna 17 11,7% · Comuna 19 11,3% · Comuna 3 6,7%.

⚠️ **Precisión — verificada, con un límite claro en Bogotá.** La ubicación es el cruce de vías,
**no el domicilio**. Se midió contra el **barrio que la propia dirección menciona** (apartando el
20% de los nombres para que la prueba no sea circular): errores gruesos (>3 km) del **6,7% en
Medellín, 9,9% en Cali y 22,6% en Bogotá**. Bogotá es peor porque tiene nomenclaturas paralelas
(Bosa, Suba, Ciudad Bolívar, Usme) y una misma pareja calle×carrera existe en varios sitios.
→ **Usable para forma y concentración por zona. No usable** para una dirección concreta ni —en
Bogotá— para decidir entre una localidad y su vecina: **diferencias menores a ~1,5 pp entre zonas
no se sostienen** (al corregir el método, Kennedy pasó a Engativá y El Poblado a Belén).
La medición está **visible dentro del mapa**, alimentada del JSON del pipeline, no escrita a mano.
`[🟢 · fuente: pipeline/verificar.js + verificacion-barrios.json, 26-jul]`

### 7.2 · Lo que falta para pasar de demanda a factibilidad ⛔
El export **no permite** decidir cobertura same-day por sí solo: dice *dónde está la demanda*,
no *dónde se puede cumplir*. Faltan, cruzables por `orden_id`:  `[⚪ · pedido a Data pendiente]`

| Campo | Sin él no se puede… |
|---|---|
| bodega de origen + coordenada | calcular distancia origen→destino, el corazón del SD |
| fecha y hora de creación | evaluar la hora de corte 7–11 AM (**gap ②**) |
| fecha y hora de entrega | medir si el mismo día era alcanzable |
| estado final | ver si las zonas densas son también las que fallan |
| transportadora | separar lo servible por Veloces de lo que no |

⚠️ **Punto ciego:** `ciudad_destino` sólo tiene 3 valores, así que **Soacha, Bello, Itagüí,
Sabaneta y Jamundí no están en esta data** — aunque el §0.1 los lista como elegibles o
parciales. El área metropolitana **no se puede dimensionar** con este archivo.
→ Declarado explícitamente en cada lámina del entregable (04-ago): omitirlo en silencio hace
que el mapa se lea como "ahí no hay demanda", que no es lo que dice el dato.

⚠️ **Segundo punto ciego, cuantificado (04-ago): el 18,7% de las órdenes no se puede ubicar**
(79.832 de 427.294). Por ciudad: Bogotá 13,9% · Medellín 23,9% · **Cali 25,4%** — en Cali una de
cada cuatro órdenes no está en el mapa. Se ubica interpolando el cruce de vías porque el export
sólo trae texto libre. **Un solo campo lo resolvería:** barrio / localidad / comuna normalizada
o la coordenada del destino, si la orden la guarda. Agregado a la petición de data como campo de
prioridad alta. Si resulta que la orden **no** guarda nada de eso, es hallazgo por sí mismo:
Dropi no podría segmentar por zona sin geocodificar.

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Oportunidad Polaris (ancla) | [PRM-1366](https://dropi-it.atlassian.net/browse/PRM-1366) "Same day proveedores, marcas y fulfillment" |
| **Proyecto OKR madre** | [PRM-1514](https://dropi-it.atlassian.net/browse/PRM-1514) Optimización coberturas y distancias |
| **Problema raíz** | [PROB-247](https://dropi-it.atlassian.net/browse/PROB-247) "no existe como producto, manual sin cobro ni medición" |
| Idea de solución | [PRM-1316](https://dropi-it.atlassian.net/browse/PRM-1316) flujo completo (flag, validaciones, WMS, tarifa) |
| Sub-oportunidades | [PRM-1156](https://dropi-it.atlassian.net/browse/PRM-1156) infra propia · [PRM-1225](https://dropi-it.atlassian.net/browse/PRM-1225) infra externa · [PRM-785](https://dropi-it.atlassian.net/browse/PRM-785) proveedores |
| **Épica dev (PROD)** | [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127) "[Dropi] Same day proveedores, marcas y fullfilment" — creada 30-jun, *implements* PRM-1366. ⚠️ **vacía** (descripción = solo link a PRM-1366; sin subtareas) `[verificado jira 30-jun]` |
| Doc E2E (Drive) | [Proyectos E2E - Same Day](https://docs.google.com/document/d/1NO9fbjklz2XvMVrMc_os6AuUjsF5ZkmDw3kX5XmwNtA/edit) — ⚠️ **es la plantilla maestra EN BLANCO** (único archivo en la carpeta; sin contenido propio) `[verificado drive 30-jun]` |
| Carpeta Drive | [Same Day](https://drive.google.com/drive/folders/13266oMrDh97OIKEF8nKeSembRD__BMYf) |
| **Figma — Research** ⭐ | [Research same-day](https://www.figma.com/board/uZeHBc0bilrBIXgYWyxeow/Research-same-day?node-id=1-2) (board, PD Michelle López) — ✅ **destilado 30-jun en §0.1** (AS-IS · blueprint · SLAs · cobertura · requisitos MVP · matriz de 11 gaps). Fuente de verdad del discovery. |

## 9 · Preguntas abiertas
> Varias **resueltas** con el discovery del Figma (30-jun):
- [x] **Fase 1 — RESUELTA:** MVP solo **bodegas propias Dropi (Bogotá/Medellín/Cali) + Veloces**; excluir bodegas externas de marcas (→ Fase 2). `[figma]`
- [x] **Tarifa — RESUELTA (de fase):** es **Post-MVP** (gap #8, requiere negociación externa con **Carlos Peralta**). No bloquea el MVP. `[figma]`
- [x] **WMS — DEFINIDO:** integración **Dropi → Stock Pro** con campo `tipo_envio = SD/ND/Express` → ola de picking prioritaria. `[figma]`
- [x] **Fusión sub-oportunidades — HECHA en Jira:** PRM-1156/1225/785/1316 están **merged** en PRM-1366 (verificado 30-jun). `[jira]`
- [ ] ⚠️ **Línea base — REPLANTEADA:** "¿cuántas SD hoy y a qué % cumplimiento?" **NO es medible hoy** (gap #7: sin marcación automática). → **El MVP (flag + marcación) es prerequisito de la propia baseline.** La baseline se mide *después* de instrumentar, no antes.
- [ ] **Reunión cross-funcional** (Bodega · Veloces · Comercial · TI · Producto) antes de iniciar dev — pendiente de agendar. `[figma · requisito operativo]`
- [ ] ⭐ **Petición de data a Chronos/Data (§7.2)** — origen, timestamps, transportadora y estado final, cruzables por `orden_id`. Es lo que convierte el mapa de demanda en mapa de factibilidad y desbloquea la regla de hora de corte (gap ②). **Sin esto la cobertura SD se seguiría definiendo a dedo.**
- [ ] **¿Dónde están las bodegas Dropi de Bogotá, Medellín y Cali?** Son pocas y se geocodifican fácil; con su coordenada el mapa ya puede medir cobertura real por anillo en vez de usar un centro supuesto.
- [ ] **¿El área metropolitana entra en fase 1?** El §0.1 lista Bello/Itagüí/Sabaneta/Jamundí como elegibles, pero no hay una sola orden de ellos en la data entregada. O el export vino filtrado a las 3 ciudades, o esas plazas no tienen volumen. Hay que saber cuál de las dos.

## 10 · Changelog
- 2026-08-04 — **Entregable imprimible para Carlos Peralta.** Acordado con Katerine en la
  reunión del 04-ago: sacar el mapa de calor a un formato que se pueda pasar fuera del equipo.
  Construido `pipeline/laminas.js` → `npm run sameday:laminas` genera
  `hub/public/logistica/same-day/entregables/same-day-mapas.pdf` (6 láminas A4 vertical) más un
  SVG por lámina. **Se dibuja desde `datos-sameday.json`, no se captura el mapa:** una captura
  sale rasterizada, atada al CDN del basemap, y —lo que importa— **sin la nota de precisión**.
  Acá el rótulo *"mapa de DEMANDA, no de factibilidad"* va impreso en las seis láminas.
  Contenido: portada con universo y límites · una lámina por ciudad (calor + ranking de zonas +
  composición del 100% incluyendo el % sin ubicar) · concentración comparada · curva
  corte↔cobertura. Sin dependencias nuevas (PDF escrito a mano, fuentes base-14).
  **Hallazgo de la construcción:** encuadrar por límite administrativo metía a Sumapaz y dejaba
  media lámina vacía; el encuadre pasó a salir de la demanda (99,8% dentro del marco).
  ⚠️ **Vigente:** el PDF no cambia el estado del proyecto — sigue siendo demanda, no
  factibilidad. Antes de que Carlos lo use para fijar cobertura o tarifa hay que enviarle la
  petición de data del §7.2.
- 2026-07-25 — **Primera data real del proyecto + mapa de densidad.** Llegó `Data samday.xlsx`
  (427.294 órdenes de Bogotá/Medellín/Cali). Poblado §7 con el diccionario verificado y §5 con la
  primera regla de negocio dimensionada. Construido el mapa navegable en
  `hub/public/logistica/same-day/` (ruta `/proyectos/logistica/same-day`), con el mismo patrón de
  recolecciones: HTML autocontenido + iframe mientras el discovery no cierre.
  **Método:** las direcciones se ubican resolviendo el **cruce de las dos vías** contra geometría de
  OpenStreetMap — 76,0% de cobertura, sin geocodificador de pago. Se descartaron con medición tres
  alternativas (geocodificar una por una: ~117 h; recta tipo malla de recolecciones: R²=0,32 en
  carreras de Bogotá; mediana isotónica: 1,6 km de corrección). Documentado en el README del pipeline.
  **Verificación:** se midió contra el barrio que la propia dirección menciona, apartando el 20%
  de los nombres para evitar circularidad. Errores gruesos >3 km: Medellín 6,9% · Cali 13,2% ·
  **Bogotá 27,4%** (nomenclaturas paralelas). El reparto por zona se mueve ≤0,37 pp al cambiar el
  método de desempate → el agregado es robusto aunque direcciones sueltas fallen.
- 2026-07-26 — **Fase 3: simulador de cobertura.** Modo "Simulación" en el mapa. Tres capas
  encadenadas: **accesibilidad** (red vial completa de OSM + Dijkstra por bodega — 253.000 nodos
  en Bogotá, 0,1 s por corrida, sin servicio externo ni cuota), **capacidad** (Daganzo 1984,
  validado: da 34,6–38,7 paradas/vehículo, dentro del rango operativo real) y **corte horario**
  (simulado, no medido). Bodega arrastrable + p-mediana ("dónde convendría que estuviera").
  **Hallazgo:** el cuello de botella es el corte, no la geografía (§5.1). Todos los supuestos
  quedaron como deslizadores visibles y el README documenta las 4 clases de variable (A medido /
  B documentado / C supuesto / D bloqueado) para que no se mezclen.
  **Corrección (misma fecha, detectada por Juan al revisar):** la flota se contaba redondeando
  por zona, lo que metía un piso de 1 vehículo por zona → 42 vehículos para 541 órdenes/día (13
  por vehículo con capacidad 40, incoherente). Ahora se cuenta en **vehículos-equivalente
  fraccionarios** y se redondea una sola vez sobre la ciudad → **14 vehículos, 39 órdenes cada
  uno**. Verificado que el modelo responde a las dos restricciones (capacidad con ventana de 8 h,
  tiempo con ventana de 3 h).
  ⚠️ **Límite de los tiempos:** OSM casi no trae `maxspeed` en estas ciudades (0,0% Bogotá · 0,6%
  Medellín · 0,2% Cali). De OSM viene la **topología** (real y buena); las **velocidades son
  supuesto** de una tabla por clase de vía. Además el factor de tráfico es hoy **uno solo para
  las tres ciudades** — pendiente separarlo y calibrarlo contra pares reales.
  ⚠️ **Pendiente:** enviar `peticion-data.md` — sin timestamps la capa 3 sigue simulada, y sin el
  periodo del archivo no se puede dimensionar la flota.
- 2026-07-26 — **Fase 2: precisión.** Causa raíz del error de Bogotá encontrada y corregida: el
  parser descartaba la **letra** de la nomenclatura (`Calle 137B` = `Calle 137`), y al capturarla
  apareció un bug peor — en `"Calle 80 Sur"` el patrón glotón se comía `"Su"` y **la Calle 80 Sur
  de Bosa se indexaba como Calle 80**. El 45,9% de las direcciones de Bogotá traen letra.
  Resultado: **Bogotá 27,4% → 22,6%** de errores gruesos, Cali 13,2% → 9,9%, Medellín 6,9% → 6,7%,
  y la **cobertura sube de 76,0% a 81,3%** (la clave específica cae en cascada a la base, así que
  no puede costar cobertura). Bosa +1,3 pp y Ciudad Bolívar +0,9 pp confirman el diagnóstico.
  Añadidos: **panel de precisión dentro del mapa** (alimentado del JSON, no a mano),
  **`npm run sameday`** con **guarda de regresión** (falla si la precisión cae >1 pp).
  ⚠️ **Pendiente:** Bogotá sigue al 22,6%. El siguiente paso es la capa oficial
  **Placa Domiciliaria (IDECA)** — puntos de todas las direcciones domiciliarias urbanas — que
  convertiría la interpolación en búsqueda directa. `[fuente: pipeline/README.md §Precisión]`
  **Hallazgo de estructura:** Bogotá concentra el 60,5% de su demanda en 5 localidades, mientras
  Medellín y Cali la tienen repartida — no es el mismo problema operativo en las tres, y la fase 1
  no debería tratarlas igual.
  **Límite honesto:** con 4 columnas esto es un mapa de **demanda**, no de **factibilidad**. Falta
  origen, timestamps, transportadora y estado final (§7.2) — el gap ② (hora de corte) sigue sin
  poder escribirse. **Próximo:** enviar la petición de data y conseguir las coordenadas de las
  bodegas Dropi.
- 2026-06-30 — **Verificación en vivo + épica creada.** Juan creó la **épica dev [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127)** (anclada a PRM-1366, aún vacía). Confirmada en Jira toda la estructura (PROB-247 problema · PRM-1514 OKR · PRM-1316 idea · PRM-1156/1225/785 sub-opps merged) — sin descripciones, contenido en los títulos. **Hallazgos:** Drive sigue con la **plantilla E2E en blanco** (no hay research en Drive); existe **board Figma "Research same-day"** (PD Michelle López). **Juan pasó el board** → **discovery COMPLETO destilado en §0.1** (AS-IS 12 pasos · blueprint · SLAs · cobertura geo · requisitos MVP · matriz de 11 gaps). Resueltas las preguntas de fase 1/tarifa/WMS/fusión (§9). **Corrección honesta:** el discovery NO estaba delgado, estaba completo fuera del cerebro. **Próximo:** estructurar PROD-1127 con el alcance MVP real + 1ª historia de Michel = **diseñar el flujo de creación de orden SD** (flag + hora de corte + geo + selección guiada). ⚠️ Pendiente: ¿**Michelle López** (autora del research) vs **Michel Pino** (PD asignado en el direccionamiento) — misma persona o dos diseñadoras? Aclarar con Juan. Recordatorio de prioridad: Same Day = "Medium" (roadmap §2), prioridad de la CPO.
- 2026-06-24 — **Discovery levantado desde las conexiones de PRM-1366** (PROB-247 problema raíz, PRM-1514 OKR madre, PRM-1316 idea, PRM-1156/1225/785 sub-oportunidades). Problema/hipótesis/métrica/actores/alcance poblados. PRM-1366 sin descripción → el detalle fino (data, entrevistas) queda para la carpeta Drive.
- 2026-06-23 — Creado el spec + carpeta Drive + doc E2E base. Origen: direccionamiento de la célula (CPO). Discovery pendiente (Jira bloqueado por IP / por leer PRM-1366).
