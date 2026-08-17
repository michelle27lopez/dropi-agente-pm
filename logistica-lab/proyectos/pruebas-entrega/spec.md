# Spec · Pruebas de entrega (POD)

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. Cada afirmación indica estado y fuente.

| Campo | Valor |
|---|---|
| Owner / PM | Sin owner en PRM-1517; PRM-1364 asignado a Juan `[⚪ · jira:PRM-1517/1364]` |
| Product Designer | Michel Pino `[🟢 · jira:PROD-836/1172/1347/1525]` |
| Stakeholder | Logística/soporte y transportadoras `[🟡 · jira:PRM-1364]` |
| Célula | Logistic Success `[🟡 · confluence:POD]` |
| Etapa de la cadena | Entrega / Devolución `[🟡 · jira:PRM-1517]` |
| Estado global | 🟡 programa por carrier en discovery; diseño ENVÍA avanzó hasta Fase 3, pero el handoff PROD-1525 está en Dependencia y no hay evidencia técnica suficiente para afirmar despliegue productivo |
| NSM que mueve | Tasa de entrega y métrica operativa de resolución de reclamos `[🟡 · jira:PRM-1517]` |
| Última actualización | 2026-08-02 |

## 0 · Resumen y estado global

POD reúne evidencia verificable del intento o entrega por transportadora: URL/archivo, foto, firma/sello, geolocalización y, como línea relacionada, doble validación entre carrier y EcomScanner. El corte actual corrige dos falsas equivalencias: PROD-1172 ya está hecho (no “en curso”) y PROD-1072 es **Print On Demand**, no Proof of Delivery. La cadena de Producto para ENVÍA es PROD-836 → PROD-1172 → PROD-1347 → PROD-1525; las tres primeras están hechas y PROD-1525 está en Dependencia. DROP-23095 figura Finalizada, pero sus criterios son mapa, inventario, diagnóstico y propuesta; sin build/API/product verification no se usará como prueba de despliegue. El E2E tiene 10 tabs, 1.404 párrafos y al menos 129 placeholders/campos por confirmar en lectura estructural. `[🟡 · jira:PRM-1364/1517 · jira:DROP-23095/PROD-836/1172/1347/1525 · drive:E2E]`

## 1 · Problema raíz

- Las pruebas de entrega son una solicitud recurrente del equipo logístico y hoy están fragmentadas por transportadora/ticket. `[🟡 · jira:PRM-618/1364]`
- PRM-618 declara que el 80% de las solicitudes del equipo de Logística a carriers son pruebas de entrega; es un dato reportado sin periodo, volumen absoluto ni método, útil como señal de prioridad pero no como baseline de impacto. `[🟡 · jira:PRM-618]`
- Sin evidencia consistente, los reclamos y la confirmación del desenlace dependen de datos incompletos o no comparables. `[🟡 · jira:PRM-1364]`
- Un “código de seguridad al destinatario” aparece como necesidad en México, pero no se ha demostrado si complementa o duplica el POD actual. `[⚪ · drive:Hablemos del producto en MX · 2026-06-03]`

## 2 · Hipótesis de valor y métrica

- **Hipótesis:** centralizar evidencia verificable por intento/entrega reduce el tiempo y la ambigüedad de reclamos y mejora la trazabilidad del desenlace. `[🟡 · jira:PRM-1364]`
- **Métrica de éxito + línea base:** tiempo de respuesta a solicitudes POD, % de entregas con evidencia válida y % de reclamos resueltos; baseline pendiente. `[⚪ · confluence:POD]`
- **NSM:** contribución indirecta a tasa de entrega; el efecto directo es trazabilidad/resolución. `[🟡 · inferencia desde alcance]`

## 3 · Usuarios / actores

- Equipo de logística/soporte que solicita y revisa evidencias. `[🟡 · jira:PRM-1364]`
- Transportadora que produce foto/firma/sello/geolocalización. `[🟡 · confluence:POD]`
- Destinatario final; podría confirmar con código, sujeto a discovery. `[⚪ · drive:workshop MX]`
- Operación EcomScanner que aporta segunda verificación. `[🟡 · jira:PRM-1364]`

## 4 · Alcance

**Entra (por estado):**

- Evidencia por transportadora y fase de adopción, comenzando por capacidades verificadas. `[🟡 · jira:PRM-1517/1364]`
- Foto, firma/sello y geolocalización cuando el carrier las suministra. `[🟡 · confluence:POD]`
- Doble verificación EcomScanner + transportadora. `[🟡 · jira:PRM-1364]`
- Evaluación del código de seguridad al destinatario como capacidad adicional. `[⚪ · drive:workshop MX]`
- Inventario/matriz por transportadora y método de acceso: API, FTP, portal o manual. `[🟢 · jira:DROP-23095]`

**Cobertura por ticket al corte:**

- ENVÍA PRM-1462: Inv. y definición; sin assignee. `[🟢 · jira]`
- Interrapidísimo PRM-1455: Impedimentos; sin assignee. `[🟢 · jira]`
- Domina PRM-1610 y TIUI PRM-1611: backlog; sin assignee. `[🟢 · jira]`
- Coordinadora PRM-618: backlog, asignado a Juan; declara disponibilidad de API. `[🟢 · jira]`
- Georreferenciación/novedad PRM-1361: Impedimentos, asignado a Juan. `[🟢 · jira]`

**No-objetivos (⛔ — explícito):**

- Token de devoluciones de Veloces: confirma el retorno al proveedor y pertenece a LOG-010/logística inversa. `[⛔ · doc:reduccion-devoluciones-cod/spec.md]`
- Archivos periódicos de transportadoras: integración/automatización separada. `[⛔ · drive:workshop MX]`
- Fusionar soluciones de carriers sin validar que entregan el mismo dato y nivel de evidencia. `[⛔ · jira:PRM-1517]`

## 5 · Reglas de negocio

- **R1 ·** Toda evidencia debe identificar orden/guía, carrier, evento, fecha/hora y origen. `[🟡 · inferencia necesaria para trazabilidad]`
- **R2 ·** “Entregado observado” por estado carrier no equivale a “entregado confirmado” con evidencia. `[🟡 · doc:normalizacion-estados]`
- **R3 ·** El código al destinatario, si se adopta, confirma última milla; nunca sustituye el token de retorno al proveedor. `[🟡 · drive:workshop MX · doc:LOG-010]`
- **R4 ·** Una capacidad por carrier solo se marca construida tras lectura/verificación del build o respuesta real. `[🟡 · doc:metodologia/spec-driven.md]`
- **R5 ·** Un épico Jira Finalizado cuyo entregable es discovery/matriz/propuesta no prueba por sí solo que la integración esté en producción. `[🟢 · jira:DROP-23095 · criterio de auditoría]`
- **R6 ·** “POD” no es una llave suficiente: PROD-1072 pertenece a Print On Demand y se excluye de Proof of Delivery. `[🟢 · jira:PROD-1072]`

## 6 · Criterios de aceptación (Gherkin)

**Módulo: consulta POD**

- **Dado** una guía con evidencia disponible **Cuando** logística consulta el POD **Entonces** ve el tipo de evidencia, su fuente, timestamp y relación inequívoca con la orden. `[🟡 · jira:PRM-1364]`
- **Dado** que carrier y EcomScanner discrepan **Cuando** se revisa la entrega **Entonces** ambas observaciones quedan visibles y no se presenta una como confirmación silenciosa. `[🟡 · jira:PRM-1364]`

**Módulo: código al destinatario (candidato)**

- **Dado** un código válido asociado a la entrega **Cuando** el destinatario lo confirma **Entonces** el evento queda como confirmación de última milla, separado de cualquier devolución al proveedor. `[⚪ · drive:workshop MX]`

## 7 · Datos (diccionario)

- Campos mínimos candidatos: `order/guide id`, carrier, evento, evidencia/tipo, URL o payload, geolocalización, actor, timestamp, fuente y resultado de validación. Nombres físicos pendientes. `[⚪ · inferencia de alcance]`
- Eventos backend y retención/privacidad de fotos, firma y ubicación requieren definición con TI/Legal. `[⚪ · pregunta abierta]`

## 8 · Trazabilidad

| Tipo | Referencia |
|---|---|
| Proyecto paraguas | [PRM-1517](https://dropi-it.atlassian.net/browse/PRM-1517) |
| Solicitud/alcance | [PRM-1364](https://dropi-it.atlassian.net/browse/PRM-1364) |
| Épico / cadena Producto ENVÍA | DROP-23095 · PROD-836 → PROD-1172 → PROD-1347 → PROD-1525 `[🟢 · jira]` |
| Exclusión por acrónimo | PROD-1072 = Print On Demand; no pertenece a Proof of Delivery `[🟢 · jira:PROD-1072]` |
| Soluciones carrier | PRM-1462 · PRM-1455 · PRM-1610 · PRM-1611 · PRM-618 `[🟡 · jira]` |
| Doc E2E | [Proyectos E2E - Prueba de entrega](https://docs.google.com/document/d/16XQ6P1pWrzm3PHaltL5UaMeV4698-rMpgFSpGWd3tas/edit) |
| Confluence | [Síntesis POD](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531772949) |
| Comentario Jira canónico | PRM-1517 comentario `50932` `[🟢 · verificado por lectura]` |
| Darwin | LOG-016 |

## 9 · Preguntas abiertas

- [ ] Definir owner del paraguas PRM-1517 y reconciliar su estado con PRM-1364 — responsable: Juan/lead de célula. `[⚪ · jira]`
- [ ] Confirmar capacidades reales y cobertura por carrier; resolver impedimentos antes de prometer fases — responsable: Juan + TI/carriers. `[⚪ · jira]`
- [ ] Determinar qué entregó realmente DROP-23095 y verificar build/API/UI en producción; su estado Finalizada no basta. `[⚪ · jira:DROP-23095]`
- [ ] Resolver por qué PROD-1382 “Handoff a TI” fue cancelada mientras PROD-1525 permanece en Dependencia — responsable: Producto + TI. `[⚪ · jira:PROD-1347/1525]`
- [ ] Retirar PROD-1072 de E2E/Confluence y de cualquier reporte POD de Logística — responsable: Producto. `[🟢 · contradicción confirmada]`
- [ ] Determinar si el código al destinatario agrega seguridad sobre foto/firma/geolocalización y cómo maneja fraude/excepciones — responsable: Juan + Research. `[⚪ · drive:workshop MX]`
- [ ] Definir línea base y objetivo de tiempo/% de resolución POD — responsable: Juan + Data/Operación. `[⚪]`

## 10 · Changelog

- 2026-08-02 — Reauditoría Jira/Drive/Figma: PROD-1172 y PROD-1347 están hechos; PROD-1525 está en Dependencia; PROD-1072 se excluye por ser Print On Demand; DROP-23095 no se usa como prueba automática de despliegue; E2E conserva 129+ placeholders.
- 2026-08-02 — Sincronización aplicada y releída en Jira (comentario 50932), Confluence (página 1531772949 v3) y Darwin (resumen LOG-016); campos de gobierno permanecieron intactos.
- 2026-08-02 — Spec inicial; separación explícita entre POD/código al destinatario, token de devoluciones y archivos de carriers.
