# Metodología — Product Logistics (Dropi)

> El filtro con el que evaluamos, documentamos y priorizamos TODO proyecto de la
> célula Logistic Success. Cuando Juan diga "sé duro", aplico esto sin suavizar.
>
> 🧭 **Encima de este filtro está la BASE estratégica de la CPO** (`estrategia/`): el
> pipeline oficial Ideas → Gate 1 → discovery → **Gate 2 (Dropi Score)** → Delivery, los
> OKRs de compañía y el direccionamiento de la célula. Este filtro es el lente de la ORDEN
> que se aplica **dentro** de las etapas de discovery (Wander/Explore) y nutre la dimensión
> **Confianza** del Dropi Score. **NSM oficial de la célula (CPO): tasa de entrega ≥ 70%
> (OKR 2 · KR2.1)** — se descompone operativamente en movilización + % entrega + tiempo por fases (§3).

## 1. Principio rector
La unidad de valor es **la ORDEN**. No diseñamos features, **destrabamos órdenes**.
Todo proyecto debe poder responder: *¿cómo hace que más órdenes lleguen entregadas,
más rápido, a menor costo y fricción?* Si no lo responde con una métrica, no está listo.
Regla del motor: **un feature nuevo nunca puede afectar la orden** (menos barreras para
crearla, más herramientas para garantizar su éxito).

> 📚 Este filtro se apoya en la base de conocimiento. Síntesis accionable:
> `conocimiento/sintesis-logistica-producto.md`. Consultarla al evaluar proyectos.

## 2. La cadena de valor de la orden (dónde se fuga el valor)
Cada etapa es un punto donde el valor se pierde. Documentar proyectos ubicándolos aquí:

1. **Selección** — el usuario escoge buen producto y buen proveedor.
2. **Generación de guía** — guía con código de barras correcto, transportadora adecuada.
3. **Despacho / recolección** — el proveedor despacha, la transportadora recoge.
4. **Tránsito** — movimiento, tiempos, visibilidad del estado.
5. **Novedad** — gestión de incidencias (reintentos, datos de contacto, evidencias).
6. **Desenlace** — entrega efectiva (valor capturado) vs. devolución (valor perdido).

## 3. North Star Metrics de logística (operativas)
Las dos NSM de la célula — todo proyecto debe mover al menos una:
1. **⬆️ Movilización** — % de órdenes que entran de verdad a la red del carrier (capa 4+). Meta 80→90%.
2. **⬆️ % de entrega** — entregadas / base (s/red y s/creadas). Subir entrega efectiva.

**Valor agregado de Dropi = el contraentrega (COD).** Se cuida y se mejora dentro del COD,
no empujando prepago (ver hallazgo #1 en `conocimiento/`). El COD es la esencia del negocio.

### 3.1 KPI de tiempo — tiempo de entrega POR FASES
No medir un solo "tiempo de entrega"; medir el tiempo de cada **fase** (mediana/P75/P90, no promedio):
`creación → confirmación → guía generada → preparado → recogido/handoff → 1er estado carrier → en reparto → entregado`.
Foco de Juan: **tiempos de despacho desde que se genera la orden y se confirma**. Fuentes:
`Order.date_*` + `Historyorder` + tabla `q18` (tiempos por transición). Ver `conocimiento/temas/10`.

### 3.2 TTV / activación (lente PLG, complementa)
- **Time to Value (TTV)** = tiempo hasta la **primera orden ENTREGADA** (activación neta).
- Activación bruta = monta 1ª orden; neta = 1ª orden entregada ⇒ **+80%** retención.
- TTV ata la cadena completa; por eso logística toca todo: producto, proveedor, despacho, transporte, entrega.

## 4. Métricas operativas (las que vigila la célula)
Tasa de entrega efectiva · % novedades · tiempo en tránsito · tasa de devolución ·
costo por orden · tiempo de recolección. Todo proyecto debe atarse a ≥1 de estas o a TTV.

### 4.1 Datos de la cadena de valor (de dónde salen)
La evidencia para estas métricas vive en fuentes externas: Drive (hojas de incidencias,
métricas), Jira (PRM/STID), notas/transcripciones de Gemini, Excel, correo. Ver el
registro completo en `fuentes/_index.md`. Cada dato relevante se destila al repo
mapeándolo a su etapa de la cadena (sección 2) y citando origen + fecha.

## 4.2 Verdades de data que cambian la prioridad (abril 2026, re-validar)
No tratar como opinión — son hallazgos medidos. Un proyecto que los ignora arranca mal:
- **La devolución es un problema de PAGO, no de logística** (hallazgo #1). COD devuelve 25% vs prepago 1.3%. Como el COD es la esencia del negocio, se ataca **dentro del COD** (anticipo, ConfioPagos, score de riesgo), no empujando prepago.
- **El problema NO es la última milla.** En red todos entregan ~72–77%. La sangría (~20 pts) está **antes de la red**. Priorizar pre-red, no optimizar carriers (mueve 3-4 pts).
- **El motivo de cancelación NO está instrumentado** (428K órdenes "otros/sin nota"). 1ª palanca barata que desbloquea todo: catálogo cerrado de motivos. No se rescata lo que no se sabe por qué murió.
- **Canal SHOP = fuga #1.** Entra a red 66% vs MANUAL 93%. La validación ya existe (`is_validated`, +12 pts): el producto es **forzarla en SHOP**, no construirla.
- **El primer intento decide.** Reintentar no recupera (cae a 10–40%). Construir **gate pre-despacho**, no motor de re-despacho.
- **No hay dueño Dropi de la novedad** (`solved_by_logistic = 0`). "Solucionado" es humo (recuperación real <5%). Hueco de producto. **Triar**: pelear las recuperables, soltar "rehúsa recibir".
- **Tensión Movilización↑ vs Devolución↓**: no se optimizan con la misma palanca (ver síntesis §5).

## 4.3 Modelo de 4 capas (al conceptualizar producto logístico)
No "productos vs features". Son 4 capas: **dimensiones** (velocidad·carga·profundidad·cobro·geo) ·
**proceso** (la cadena de la orden) · **features/capacidades** (muchas transversales; capacidad ≠ interfaz) ·
**beneficios por actor** (dropshipper·proveedor·transportadora·consumidor — "X para quién").
Huecos a no olvidar en mercado COD: **logística inversa** y **conciliación COD** como flujos de primer nivel.
Decisión que bloquea el inventario de productos: **¿quién compra cada producto?** (ver síntesis §6-7).

## 4.4 Lente PLG (cómo el producto mueve el valor)
Dropi es PLG por diseño. Pilares: TTV · self-serve · valor antes de pagar · viralidad · expansión.
**Momento Ajá** del dropshipper = primera venta **entregada** + primer cobro ⇒ es el mismo TTV/activación
neta. Test de priorización: *¿acerca o aleja el Momento Ajá?* **PQL** = setup + 1ª venta entregada + cobro ≤30d.

## 4.5 Filtro de priorización (qué construir primero)
Antes de priorizar, toda iniciativa responde **dos preguntas** (cadena × PLG); **sin las dos, no se prioriza**:
1. **¿Qué valor mueve en la cadena?** → etapa · perfil · fuga · fuente de revenue.
2. **¿Qué pilar PLG activa?** → loop + nivel de conciencia.

Checklist integrado (los 4 marcos: **territorio · perfil · nivel · loop**):
- [ ] **Ubícala** (territorio + perfil + nivel + loop). *Si no puedes ubicarla, no puedes medirla.*
- [ ] **Diseña para movimiento, no para estado** (acompaña el ascenso N1→N3; los perfiles evolucionan).
- [ ] **Activación temprana > optimización final** (destraba las 4 fuentes de revenue; optimizar el final mueve solo una).
- [ ] **Acerca el "Momento Ajá"** del perfil (o tiene una razón muy fuerte para alejarlo). El Momento Ajá es por perfil (ver §4.4).
- [ ] **Self-serve, o es operación** (si requiere intervención humana obligatoria para activar, no es producto).
- [ ] **Mide el loop, no la pantalla** (una métrica vive en un loop; sin loop = métrica de vanidad).
- [ ] **Adyacencia defiende el core, no diversifica** (si solo "agrega revenue" sin reforzar el flujo principal, compite por foco).
- Empate entre dos → gana **la que mejor entiende el lugar del usuario en el ecosistema**, no la del mejor mockup.
> Detalle en `conocimiento/temas/14` (§E revenue · §F fugas), `temas/15` (§J dos preguntas · §K checklist) y `temas/01` (checklist + matriz de diseño por nivel + territorios↔células). Perfiles a fondo: `temas/16`.

## 5. El filtro "duro" — Definition of Ready (antes de construir)
Un proyecto/historia NO pasa a UI ni a desarrollo si no tiene:
- [ ] **Problema raíz** identificado (árbol de problemas, no síntoma).
- [ ] **Hipótesis de valor**: "creemos que [cambio] mejora [métrica de orden] porque [evidencia]".
- [ ] **Métrica de éxito** concreta y medible, con línea base.
- [ ] **Definición de datos cerrada** ANTES del diseño. (El cruce de datos se resuelve primero, no después.)
- [ ] **Dependencias y validaciones** identificadas (TI, data, growth, legal, transportadoras) y movidas a tiempo.
- [ ] **Preguntas abiertas** listadas explícitamente, no escondidas.

## 6. El filtro "duro" — Definition of Done
- [ ] Métrica medida post-lanzamiento (¿movió la aguja? con datos, no intuición).
- [ ] Adopción verificada: ¿el usuario objetivo realmente lo usa?
- [ ] Próximos pasos basados en datos, traídos proactivamente.
- [ ] **Self-serve:** el usuario objetivo activa sin intervención humana obligatoria (si la requiere, es operación, no producto).
- [ ] **Plan de comunicación a las cohortes existentes** (relanzamiento por nivel/perfil, no "lanzar y olvidar"). *Un feature sin plan de comunicación no está terminado.*
- [ ] **PQL definido por perfil** (umbral de Product Qualified Lead; sin él no se sabe a qué tasa se mide la activación real).

## 7. Cómo documentar un proyecto (estructura por carpeta)
Cada proyecto en `proyectos/<nombre>/` con:
- `overview.md` — qué es, etapa de la cadena, hipótesis, métrica, estado, owner.
- `arbol-de-problemas.md` — problema raíz → ramas → oportunidades.
- `insights.md` — hallazgos con fuente y fecha.
- `decisiones.md` — decisiones tomadas y por qué (para no re-litigar).
- `preguntas-abiertas.md` — lo que falta resolver y quién debe responder.

## 8. Categorización de proyectos (etiquetas del equipo de producto)
- 🔵 **Azul** — nuevos / estratégicos.
- 🔴 **Rojo** — heredados / por finalizar (cerrar antes de entregar).
- 🟡 **Amarillo** — proyectos OKR.
- 🟣 **Morado** — KPIs.

## 9. Estándares de Juan (no negociables)
Estos salen de cómo Juan exige el trabajo — aplican a él y a quien lidere con él:
- La **definición de datos se cierra dentro de la historia, antes de la UI**.
- **Métricas de punta a punta**: no solo definirlas — lanzarlas, seguirlas, traer próximos pasos con datos.
- **Buscar tú a la gente**: mover validaciones con TI/data/growth/legal sin esperar a que lo pidan; avisar bloqueos temprano.
- Llegar con **recomendación de cierre lista y sustentada**, no armándola sobre la marcha.
