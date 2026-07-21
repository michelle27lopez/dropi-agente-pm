# Árbol de discovery en Jira — OKR → KR → Oportunidad → Idea → Solución (con Insights y multi-país)

> **Para qué:** este es el **mapa que conecta TODO** — la logística-como-producto (el cerebro:
> cadena de valor, fugas, NSM, hipótesis) con la **estructura real de Polaris** (cómo se ordena el
> discovery en Jira, de la meta a la solución) y con los **Insights** (la evidencia). Sirve para que
> cualquier chat futuro entienda cómo está armado el roadmap de la célula en Jira y cómo se llena.
> Complementa: [`jira-tipos-y-estructura.md`](jira-tipos-y-estructura.md) (qué es cada tipo + enlaces),
> [`discovery-y-categorizacion.md`](discovery-y-categorizacion.md) (el playbook), `estrategia/` (la BASE).
> **Fuente:** lectura directa de Jira PRM/Polaris vía MCP (25-jun-2026). Jira = espejo; el repo = fuente de síntesis (spec-driven).

## 1 · La idea central: una sola cosa vista por dos lados
- **Logística-como-producto** (el cerebro) = el **contenido**: qué es la orden, dónde fuga, qué dice la data.
- **La estructura de Polaris** (cómo lo modela Marcas y debemos modelar nosotros) = el **contenedor**: cómo se ordena ese contenido de la meta hasta la solución.
- **Los Insights** = el **pegamento**: son los hallazgos del cerebro (data) pegados como evidencia a la cadena.
> Mismo árbol, dos lenguajes. Documentar = traducir el cerebro a la cadena de Polaris.

## 2 · La cadena canónica (y qué es en logística-producto)
La jerarquía en PRM/Polaris es **100% por enlaces** (todos los tipos son `hierarchyLevel 0`; ver `jira-tipos-y-estructura.md`). La cadena se arma con **Discovery - Connected** (id 10012) entre eslabones de discovery, **Polaris datapoint** (id 10010) para pegar Insights, y **Polaris work item link** (id 10008) para bajar a la épica DROP/PROD.

| Nivel Polaris | Qué es en el cerebro (logística-producto) | Capa del cerebro |
|---|---|---|
| **North Star Metric** | El techo de compañía | — |
| **OKR** | El objetivo de la célula | `estrategia/` |
| **KR/KPI** | El **North Star vuelto número** | `estrategia/` (NSM) |
| **Proyecto OKR** | Una **fuga** de la cadena de valor | `sintesis §3` (las 4 fugas) |
| **Oportunidad** | La fuga redactada **con hipótesis + cifras** | `product-logistics §4.2` |
| **Insight** ⭐ | Un **hallazgo de data** (una hipótesis H1–H8 medida) | `temas/05`, `temas/03-04` |
| **Idea** | La **palanca** que ataca la fuga | `temas/05` (mapa de palancas) |
| **Solución** | El **experimento/feature** con discovery completo | `temas/05`, `temas/11` |
| *(abajo)* **Épica DROP/PROD** | El build en ingeniería | — |

> **Regla:** el peso vive en la **Oportunidad** (problema con data) y la **Solución** (discovery completo),
> NO en un "Problema" vago. Todo cuelga de un OKR con KR medible, no de una NSM genérica.

> ⭐ **El CENTRO del árbol son los OKR** (decisión Juan, 25-jun). No es ningún proyecto ni una fuga: los OKR
> son la columna y **cada proyecto gana su lugar por cuánto mueve un KR** (campo `Aporte a NSM`). Lo que no
> cuelga de un OKR no entra al roadmap. Logística toca **3 OKR**: OKR2 (entrega ≥70%, dueños) · OKR3 (gross
> margin ≥22%, Tarifas) · OKR1 (volumen/GMV, alimentado por movilización).
> ⚠️ **No confundir capas:** las **fugas** son las ramas (donde se mueve la aguja); los proyectos **transversales**
> (Torre de control / tiempo por fases, Normalización de estados) son **instrumentación** que sirve a las ramas
> — habilitadores, **no el centro**. Medir mejor no mueve el KR por sí solo; lo mueve atacar la fuga dominante.

## 3 · El ejemplo ORO — cómo lo armó Marcas (Katerine Pencue)
Cadena completa, de la meta a la solución en producción. **Es el patrón a replicar.**
```
OKR1 · PRM-1390 "Escalar volumen hacia el unicornio"
└─ KR1.1 · PRM-1393 "93.6M órdenes/año (7.8M/mes)"
   ├─ Oportunidad · PRM-1436 "Usuarios activos cayendo, recuperables"   ← con DATA
   │     Contexto: 50.8% del portafolio en decrecimiento crítico (ene) → 26.8% (mar)
   │     Impacto: ~$3.400 COP por orden perdida · Resultado deseado: bajar de 50.8% sostenido
   │     [estos 3 datos = sus 3 Insights]
   ├─ Oportunidad hermana · PRM-1435 "Registrados que aún no generan 1ª orden" (activación)
   │  └─ Idea · PRM-1440 "Clasificar para activar desde el registro"
   │        └─ Solución · PRM-1153 "Encuesta clasificación perfil Marcas (Userpilot+CRM)" → Producción
   │           [discovery completo: problema·solución·alcance·métricas·validación·supuestos·vacíos]
   └─ Oportunidad · PRM-1437 "El volumen depende de muy pocas cuentas — diversificar protege la meta"
```
Lo que la hace fuerte y nos falta copiar: (a) **Oportunidad con cifras**, no enunciado vago;
(b) **Solución con discovery entero** (incluye "vacíos de conocimiento"); (c) **Insights** que respaldan.

## 4 · El árbol logístico REAL hoy (lo que ya existe en Jira)
**La buena noticia: la estructura ya está, igual que la de Marcas. Está VACÍA debajo del Proyecto OKR.**
```
NSM · PRM-1546 "Lograr valorización de 1B"
└─ OKR2 · PRM-1391 "Consolidar operación multi-país"
   └─ KR2.1 · PRM-1396 "Tasa de entrega promedio ≥ 70%"   ← = NSM de la célula (⬆️ % entrega)
      ├─ Proyecto OKR · PRM-1497 "Movilizaciones: del 80% al 90%"        → Fuga ① confirmación/movilización
      ├─ Proyecto OKR · PRM-1523 "Reducir devoluciones 10%"             → Fuga ② COD (devolución)
      ├─ Proyecto OKR · PRM-1512 "Herramientas predictivas de novedades (IA)" → Fuga ④ novedad
      ├─ Proyecto OKR · PRM-1513 "Optimización selección de transportadoras"  → habilitador (DROP-17946 72%)
      ├─ Proyecto OKR · PRM-1517 "Pruebas de intentos de entrega (SLAs, foto geo)" → desenlace/SLA
      ├─ Proyecto OKR · PRM-1514 "Optimización coberturas y distancias (same day, bodegas)" → movilización
      ├─ Proyecto OKR · PRM-1516 "Cierre logístico"
      ├─ Proyecto OKR · PRM-1515 "Poner ChatePro en transportadoras"
      └─ Proyecto OKR · PRM-1511 "Mejorar gestión de órdenes (rediseño módulo órdenes)"
      (+ Proyectos vivos enlazados: PRM-1219 rediseño selección transp. [hand off], PRM-1239 Dropify 2.X, PRM-1119 entrega oficina)
```
**Mapeo clave:** cada **Proyecto OKR = una fuga** de la cadena de valor, casi 1:1 con las 4 fugas del cerebro.
El trabajo NO es crear el árbol: es **completarlo hacia abajo** (Oportunidad + Insights + Idea + Solución).

### 4.1 · El árbol paralelo más pobre (PRM-1550 / PRM-1536) — a reconectar
Existe otra rama que toca logística pero **cuelga de la NSM de Seller**, no del OKR2:
```
NSM · PRM-1536 "Aumentar ganancia por seller activo"  (célula Seller Success, autora Maria Ossa)
└─ Problema · PRM-1550 "Poca eficiencia logística que impacta rentabilidad CO"  (+ PROB-226 en Parking lot)
   └─ ~22 ideas planas SIN descripción (validador direcciones ×4, entrega oficina ×5, recomendación transp., etc.)
```
Es un árbol **bottom-up** (nació de las ideas, no de las fugas con data) y **paralelo** al oficial.
**Acción:** sus 22 ideas son hojas sueltas que pertenecen a los Proyectos OKR del OKR2 → reconectarlas
ahí (Discovery-Connected) les da lógica. No trabajar PRM-1550 como raíz.

## 4.2 · La vista "[BSC] Árbol de problemas" — cómo se dibuja (aprendizaje 25-jun)
La vista compartida de Polaris arma el árbol con **5 niveles de TIPO**: OKR → KR/KPI → **Oportunidad → Idea → Solución**,
conectados por enlaces **Discovery-Connected**. Aprendizajes (de la captura de Marcas):
- **Lo que llena el árbol son los items tipados conectados**, NO los campos `OKR Ppal`/`KR Ppal` (esos alimentan otras vistas/reportes, no este árbol).
- **"Proyecto Okr" NO es uno de los 5 niveles** → los Proyectos OKR (fugas: PRM-1497, 1523…) **no aparecen** en esta vista. Quedan como agrupación interna (cuelgan del OKR2).
- **Marcas conecta la Oportunidad directo al KR** (KR1.1 → Oportunidad → Idea → Solución). Para que logística se vea igual, hay que **crear Oportunidad→Idea→Solución y colgar la Oportunidad de KR2.1 (PRM-1396)**.
- **No cambiar los niveles de la vista** (es compartida; tocarlos afecta a todas las células).
> Por eso logística salía **vacío bajo KR2.1**: existían los Proyectos OKR (invisibles aquí) pero **ningún Oportunidad/Idea/Solución conectado al KR**. "Espejar a Jira" = crear esas cadenas.

## 5 · Insights — qué son y cómo se usan
- En Polaris, un **Insight** es una **tarjeta de evidencia** en el panel lateral de la idea (research, dato, cita).
  Se enlaza con **Polaris datapoint** (id 10010, "added to idea / is idea for").
- **Para nosotros, cada Insight = una hipótesis H1–H8 medida** o un dato duro del cerebro. Son la munición de la Oportunidad.
- Patrón observado (PRM-1436): un problema sostenido por **3 Insights** (3 cifras). Replicar ese formato.
- ⚠️ **Límite técnico:** el conector MCP **no expone las tarjetas de Insight** del panel lateral (solo la descripción).
  Para leerlas literalmente: abrir la idea por Chrome o pedir que las peguen.

**Ejemplo — los 3 Insights de la Oportunidad "devolución dentro del COD" (PRM-1523):**
1. **H2 — la devolución es problema de PAGO:** COD devuelve **25%** vs prepago **1.3%** (`temas/05`).
2. **El primer intento decide:** entrega 72–99% al 1er intento, se desploma a 10–40% al 2º (`sintesis §4`).
3. **No hay dueño de la novedad:** `solved_by_logistic = 0` siempre; recuperación real <5% (`sintesis §4`).
> Y el principio que no se viola: **el COD es el valor agregado de Dropi** (el cliente paga cuando le llega).
> La devolución se ataca **DENTRO del COD** (anticipo, score de pago, "no tengo plata"), nunca empujando prepago.

## 6 · Proyectos multi-país (MX, CO, …) — el modelo
**El OKR2 es literalmente "Consolidar operación multi-país" → nivelar países ES el objetivo.** Por eso:

> **Regla de oro: el país es una DIMENSIÓN (parámetro/segmento), NO un eje del árbol.**
> Reusa el principio del cerebro (`sintesis §2`): *"lo que cambia entre variantes no son las etapas, son los parámetros."* El país es un parámetro, igual que un producto distinto. **No se duplica el árbol por país.**

Cómo entra el país en la cadena (ejemplo: Proyecto OKR PRM-1517 "Pruebas de entrega" en MX y CO):
- **En los Insights / data:** una **línea base por país** (entrega MX X% vs CO Y%; cada país puede ser su propio datapoint). Aquí se ve la brecha que el OKR2 quiere cerrar.
- **En la Solución (alcance/rollout):** **fases por país** (ej. CO primero por madurez de data → MX después), dentro de la **misma** Oportunidad/Idea. El país vive en el **título** de la Solución/épica (formato `[Sigla]: Nombre_País_Usuarios`, ver `jira-formatos.md`) → confirma que país = atributo, no nivel.
- **En el KR:** KR2.1 (≥70%) se **mide y reporta por país**; el OKR2 se cumple cuando los países convergen.

**Excepción (cuándo SÍ se ramifica por país):** cuando el problema o la implementación es **exclusivo de un país**
(una transportadora solo-MX, una regulación local, foto-geo disponible en un país y no en otro) → eso es una
**Solución/Idea con scope de país** colgando de la **misma** Oportunidad, no un árbol nuevo. La Oportunidad
(el problema con data) casi siempre es común; lo que cambia es la Solución.

**Resumen del patrón multi-país:**
```
Proyecto OKR (fuga, común)
└─ Oportunidad (problema + data, común; Insights con línea base POR PAÍS)
   └─ Idea (palanca, común)
      ├─ Solución CO  [scope país: parámetros/transportadoras/fase CO]
      └─ Solución MX  [scope país: parámetros/transportadoras/fase MX]   ← solo si la implementación difiere
```

## 7 · Cómo se trabaja (resumen accionable)
1. **No crear árbol nuevo** — usar el oficial: OKR2 (PRM-1391) → KR2.1 (PRM-1396) → Proyectos OKR.
2. **Completar hacia abajo** cada Proyecto OKR a la cadena estilo Marcas: Oportunidad (con cifras) → Insights (H1–H8) → Idea (palanca) → Solución (discovery completo).
3. **Empezar por uno como plantilla** — recomendado **PRM-1523 (devoluciones)**: fuga grande + mejor data (hallazgo #1).
4. **País = segmento**, no rama (§6). El árbol es uno; la Solución se faseam/parametriza por país.
5. **Reconectar** las 22 ideas de PRM-1550 a su Proyecto OKR correspondiente (Discovery-Connected).
6. **Repo primero** (borrador, fuente) → **con OK de Juan, espejar a Polaris** (regla: confirmar cada cambio Jira).
```
NSM → OKR → KR → Proyecto OKR (fuga) → Oportunidad (+Insights) → Idea (palanca) → Solución (experimento) → Épica DROP
```
