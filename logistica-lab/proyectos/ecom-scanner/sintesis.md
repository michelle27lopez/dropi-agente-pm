# Síntesis · Ecom Scanner

> **Qué es este archivo.** La síntesis de Producto de Ecom Scanner: lo mínimo que hay que saber para decidir sobre él. Obedece `metodologia/spec-driven.md` (estado + fuente en cada afirmación, cero placeholders).
> **Qué NO es.** No es una copia de la documentación técnica. `_registro-confluence.md` es explícito en que las páginas [798687237](https://dropi-it.atlassian.net/wiki/spaces/ES/pages/798687237) *(Documentación Ecom Scanner — descripción funcional y actores)* y [922845188](https://dropi-it.atlassian.net/wiki/spaces/ES/pages/922845188) *(Análisis Ecom Scanner — arquitectura, roles, permisos y flujos)* son **fuentes de contexto, no proyectos nuevos, y no se duplican aquí**. Se enlazan.
> **Corte:** 2026-09-01. **PM de la célula:** Juan Diego Bautista.
> ⚠️ **Pendiente de esta versión:** al momento de escribirla el conector de Atlassian estaba caído, así que las dos páginas de Confluence **no se pudieron leer**. Lo que falta específicamente: el **modelo de roles y permisos** y los **flujos operativos completos**. Cuando el conector vuelva, se completa esa sección — no se rellena con suposiciones.

---

## 1 · Qué es

`[HECHO · fuente: conocimiento/temas/08-mvp-ecom-scanner-metricas.md, derivado de Metricas_Ecom_Scanner_Producto_Logistica.docx]`

> *"Captura eventos físicos → estados logísticos medibles. Módulos: **Salidas, Devoluciones, Inspección de devoluciones dañadas**. NO imprime/genera guías, NO reemplaza Dropi web."*

Ecom Scanner es **la pierna física de Dropi**: el punto donde el movimiento real de un paquete se convierte en un estado que la plataforma puede leer. Todo lo que Dropi sabe sobre dónde está una orden en el mundo físico entra por aquí.

**Lo que NO hace:** no genera ni imprime guías (eso es autogeneración, LOG-012), no reemplaza Dropi web, no es una app para sellers.

## 2 · Quién lo usa — y quién no

`[HECHO · tema 08]` > *"Ecom Scanner **NO es app para sellers**: lo operan **proveedor, bodega, PAU/Dropi**. El seller solo consulta en Dropi web."*

| Actor | Qué hace | Qué valora `[HIPÓTESIS del kickoff PLG, a validar en discovery]` |
|---|---|---|
| **Proveedor** | Prepara y despacha; en una ruta entrega directo al carrier. | Que sus pedidos salgan rápido y queden registrados, para que no le reclamen por algo que sí despachó. |
| **Bodega Dropi** | Recibe, almacena y despacha. **Marca la mayoría de los eventos.** | Procesar volumen sin equivocarse de paquete ni de estado, aunque vaya a las corridas. |
| **PAU / punto** | Recibe órdenes y devoluciones en punto físico. | Registrar lo que entra y sale sin que se pierda nada ni se trabe el sistema. |

> **Consecuencia de producto que casi siempre se pasa por alto:** el usuario que ejecuta la acción **no es el titular de la cuenta**. Es un operario, muchas veces sin redes sociales y sin leer campañas de marketing. **Cualquier estrategia de adopción que dependa de canales externos falla por diseño**: hay que alcanzarlo dentro de la herramienta, en el momento en que va a escanear. Esto condiciona todo el plan de canales de [`lanzamiento-adopcion-e2e.md`](lanzamiento-adopcion-e2e.md).

`[PENDIENTE Confluence 922845188]` — modelo formal de roles y permisos. `conocimiento/temas/11-plataforma-modulos.md` (capturas 2026-06-24) advierte además que el inventario de UI **solo tiene la vista dropshipper**: faltan las vistas de proveedor y admin.

## 3 · Escala

`[HECHO · Kickoff_Ecom_Scanner_v3, análisis abril-2026 sobre 60 días]`

| Señal | Valor |
|---|---|
| Volumen de eventos | **> 25M en 60 días** |
| Ruta física dominante | **Recogido 14,3M > En bodega 9,6M** — no es un flujo lineal, son **dos rutas que conviven** |
| Reparto por carrier | **18–70% ruta-Dropi**, según transportadora |
| Retorno ya capturado | *Recibido por Dropi* **775K** · *Recepción de devoluciones* **345K** |

El módulo aparece en la plataforma marcado **Beta** (`temas/11`, vista CO).

## 4 · La tesis de producto: PLG

`[fuente: Kickoff_Ecom_Scanner_v3 · Drive 1s8dHFxLIZhE8c5fNR2RaXmhfiTvugk-tF1Kt6vt5N_k]`

El kickoff plantea el proyecto desde el valor a quien usa la herramienta, no desde la eficiencia de Dropi:

> *"Una herramienta se usa bien cuando le entrega valor real a quien la usa."*

**Las tres hipótesis de valor** (las tres marcadas `[HIPÓTESIS]` — el discovery debe confirmarlas):

| Valor | Qué significa para el usuario | Por qué crece el negocio si se cumple |
|---|---|---|
| **Velocidad** | Escaneo rápido, sin pasos de más, sin esperar al sistema. | Más volumen procesado por persona; se alivia el cuello de recolección. |
| **Confianza** | Saber que lo que registró quedó bien y que no le van a reclamar después. | Registros fieles → la orden es visible → menos disputas y soporte. |
| **Claridad** | Nunca dudar qué estado marcar, ni en la ruta menos común ni en una devolución. | Menos errores de estado → métricas logísticas confiables. |

> *"Si la herramienta es veloz, confiable y clara, la persona la usa bien porque le conviene — y los datos limpios que Dropi necesita salen como consecuencia natural, no como una carga impuesta."*

**Dolores registrados** (así los vive quien escanea):

| Dolor | Valor que rompe | Evidencia | Estado |
|---|---|---|---|
| *"No sé si marqué bien; después me reclaman."* | Confianza | Estados con typos en los datos | `[HIPÓTESIS]` |
| *"Tengo que acordarme si este va por recogida o directo."* | Claridad | Dos rutas comprobadas (14,3M vs 9,6M) | `[CONFIRMADO]` la ruta; `[HIPÓTESIS]` el dolor |
| *"El sistema me hace lento cuando voy a las corridas."* | Velocidad | Por validar | `[HIPÓTESIS]` |
| *"Una devolución no sé bien cómo registrarla."* | Claridad | Flujo de retorno poco modelado | `[CONFIRMADO]` |

**El último dolor es el que ataca guías reemplazatorias** — de ahí que esa capacidad sea el mejor gancho para el push de adopción.

## 5 · La regla de medición (no negociable)

`[HECHO · tema 08]`

> *"**No medir Ecom por cantidad de escaneos**" (sube sin mejorar entrega). Medir por **cobertura de estados, velocidad al siguiente estado, errores prevenidos, y resultado final (entrega/devolución con Ecom vs sin Ecom)**."*

**Qué NO cuenta como éxito:** total de escaneos · usuarios creados · cantidad de alertas · manifiestos impresos · pantallas/clics.

**Las 5 familias de métricas del MVP:**
1. **Adopción/cobertura** — % de guías elegibles con ≥1 estado Ecom, por proveedor. *(Es la adopción real.)*
2. **Velocidad** — guía creada→1er estado Ecom; 1er estado Ecom→1er estado transportadora; tiempo de escaneo.
3. **Errores/alertas** — % con error, % alertas críticas, % falsos positivos, % bloqueadas, % corregidas.
4. **Fugas de estado** — guía con estado Ecom sin el siguiente estado esperado *(la fuga clave)*.
5. **Resultado logístico** — tasa de entrega/devolución y tiempo al 1er estado carrier, **con Ecom vs sin Ecom**.

⚠️ **Cuidado de atribución:** comparar con-Ecom vs sin-Ecom sin controlar por proveedor, ciudad, transportadora, producto y periodo da conclusiones falsas.

## 6 · Estado de la instrumentación: no existe

`[HECHO · auditoría Jira 2026-09-01 + _fuentes-userpilot-logistica.md]`

- Lo único registrado es *"una matriz de eventos preparada para adaptar a Userpilot"* mencionada en el Weekly Ecom del 23-jun, clasificada como **"antecedente de instrumentación; no outcome"**. Pendiente abierto: localizarla y comprobar implementación.
- **Hoy no se puede responder "¿cuántos proveedores usan Ecom Scanner?"** con un dato. Es el bloqueo de fondo de cualquier conversación de adopción.
- Existe el **precedente de cómo se hace bien**: el lanzamiento de devoluciones ecom (abril-2026) sí tuvo `DROP-23033` (definición de métricas), `DROP-23525` (métricas conductuales y TARS), `DROP-23526` (catálogo de eventos) y `DROP-23631` (cierre). Ese es el molde a repetir.

## 7 · Mapa Jira

`[HECHO · lectura 2026-09-01]`

| Ticket | Qué es | Estado |
|---|---|---|
| [PRM-1287](https://dropi-it.atlassian.net/browse/PRM-1287) | *[Dropi][Ecom] Cobertura universal de guías y casos* — proyecto (garantías, productos variables, combos, flujo Ecom Scanner) | Inv. y definición · **sin descripción** |
| [PRM-1288](https://dropi-it.atlassian.net/browse/PRM-1288) | *[Dropi][Ecom] Manejo de devoluciones y novedades eficiente* — proyecto madre de guías reemplazatorias | En Desarrollo · **sin descripción** |
| [PRM-1272](https://dropi-it.atlassian.net/browse/PRM-1272) | *[Ecom] Investigación de adopción* | Inv. y definición |
| [PRM-1342](https://dropi-it.atlassian.net/browse/PRM-1342) | *[Dropi][Ecom] Seguimiento logístico completo y adopción* | Inv. y definición |
| [PRM-1344](https://dropi-it.atlassian.net/browse/PRM-1344) | *[Ecom] Revisión de flujo Ecom Scanner* | Inv. y definición |
| [PRM-1229](https://dropi-it.atlassian.net/browse/PRM-1229) | *[Ecom] Dashboard de control y beta ecom* | Finalizada |
| [TECH-480](https://dropi-it.atlassian.net/browse/TECH-480) | *Guias reemplazatorias - EcomScanner* — épica vigente (12-ago), 5 bloqueadores antes de graduar `return_guide` | Backlog · **fechas "por definir"** |

> **Lo que dice este mapa:** **tres tickets de adopción llevan meses en "Inv. y definición" y ninguno está instrumentado.** La adopción de Ecom Scanner es un tema abierto desde hace tiempo que nunca pasó de intención a medición.

## 8 · Problemas conocidos

| Problema | Evidencia | Estado |
|---|---|---|
| **Manifiestos/lotes duplicados** — múltiples clics en "Generar lote" sin control de idempotencia | `movilizacion-confirmacion/auditoria-duplicidad-ecom-agosto-2026.md`. Cadena inconsistente: PRM-403 `Finalizada` declara que DROP-6924 la implementa, pero **DROP-6924 sigue en Backlog**; DROP-6876 fue una reversión sin descripción | 🔴 Riesgo de regresión abierto |
| **Se mide volumen, no calidad de captura** | `[CONFIRMADO]` en el kickoff PLG: *"Más escaneos no se asocian a mejor entrega"* | Cambiar la métrica es parte del proyecto |
| **Estados con typos / paquetes "sin movimientos"** | `[CONFIRMADO]` las señales; `[HIPÓTESIS]` la causa (kickoff PLG) | Abierto |
| **Devoluciones con guía reemplazatoria no se podían escanear** | [`../guias-reemplazatorias/spec.md`](../guias-reemplazatorias/spec.md) | 🟡 Resuelto en beta `return_guide`; graduación pendiente |
| **Coordinadora devolvía 404 en toda su integración** | `DROP-26971`, cerrado 28-ago con fix declarado **interino**; `TECH-641` (resolución bidireccional) **Blocked**; `STID-6847` abierto desde 28-jul | 🔴 No verificada en producción |

## 9 · Capacitación

`[HECHO · temas/11]` El **Inicio** de la plataforma lista capacitaciones para *"Proveedor, Garantías, **EcomScanner**, Logística"*. Existe además un canal de agendamiento de capacitación de Ecom Scanner por Calendly, documentado fuera del repo (aparece en el onboarding del área de producto).

> **Oportunidad concreta:** ya existe un canal de capacitación con demanda. **No hace falta crear uno nuevo para el push de adopción** — hace falta medir cuánta gente pasa por él y si eso cambia su cobertura de captura. Hoy nadie lo mide.

## 10 · Los dos frentes abiertos

| Frente | Qué es | Documento |
|---|---|---|
| **Capacidad** | Leer guías reemplazatorias (LOG-009). Tier 1. Beta construida, gate de graduación sin cerrar. | [`../guias-reemplazatorias/lanzamiento-e2e.md`](../guias-reemplazatorias/lanzamiento-e2e.md) |
| **Adopción** | Que quien no usa Ecom Scanner empiece a usarlo. Tier 2. Sin baseline, sin instrumentación. | [`lanzamiento-adopcion-e2e.md`](lanzamiento-adopcion-e2e.md) |

Se lanzan **encadenados**: la capacidad primero, como prueba tangible de que la herramienta mejoró; el push de adopción después, usando esa mejora como argumento.

## 11 · Fuentes

- **Kickoff PLG:** [Kickoff_Ecom_Scanner_v3](https://docs.google.com/document/d/1s8dHFxLIZhE8c5fNR2RaXmhfiTvugk-tF1Kt6vt5N_k/edit) · variante [PLG_Dropi](https://docs.google.com/document/d/1tKfkxpYBMLhEmx21GoFDhtM_N5reXeL8QxqlXGX-Mx0/edit) · doc contenedor [Proyectos - Ecom scanner](https://docs.google.com/document/d/1zEoHYOazPA1cXvEUOxEHn7N6XXkgxS4fQD5oYDMGXV4/edit)
- **Drive:** [carpeta Ecom scanner](https://drive.google.com/drive/folders/1SE466V4OR2vSSHw7VOu_RvSbzjNPPA7c) · [7. Ecom Scanner](https://drive.google.com/drive/folders/1VDcNqA6gR78NervuRaOarkwKIoaGW4n6)
- **Confluence** *(pendientes de leer — conector caído al 01-sep)*: [798687237](https://dropi-it.atlassian.net/wiki/spaces/ES/pages/798687237) · [922845188](https://dropi-it.atlassian.net/wiki/spaces/ES/pages/922845188)
- **Repo:** `conocimiento/temas/08-mvp-ecom-scanner-metricas.md` · `conocimiento/temas/11-plataforma-modulos.md` · `proyectos/_fuentes-userpilot-logistica.md` · `proyectos/movilizacion-confirmacion/auditoria-duplicidad-ecom-agosto-2026.md`

## 12 · Changelog

- **2026-09-01** — Síntesis creada (la fila de Ecom Scanner en `_index.md` decía "_por crear_" desde el origen del índice). Destila kickoff PLG, tema 08, tema 11, auditoría de duplicidad y lectura de Jira del 01-sep. Confluence pendiente por caída del conector. Se abre el frente de adopción como lanzamiento propio, separado de la capacidad de guías reemplazatorias.
