# Mapa de trazabilidad — Logistic Success

> Corte de lectura: 2026-08-03. Este archivo es una **auditoría y mapa de navegación**, no una tabla paralela. Jira gobierna clasificación/estado/ownership/relaciones; Darwin presenta; Drive conserva el E2E vivo; Confluence indexa; el repo conserva el spec y la evidencia técnica. La unión de Darwin con el tablero se hace por `project_code` (`LOG-XXX`). Antes de publicar se consulta el [registro anti-duplicados de Confluence](_registro-confluence.md).

## Sistemas y criterio de verdad

| Sistema | Rol | Llave / regla |
|---|---|---|
| Jira PRM/PROD/DROP/STID | Estado, tipo, owner, implementación y relaciones | issue key; validar antes de escribir |
| Darwin | Portafolio compartido | `projects.project_code` |
| Hub logístico | Metadatos de presentación y navegación | `codigo` = `project_code`; no reemplaza Jira/Darwin |
| Drive/E2E | Documento vivo de nueve fases y anexos | una carpeta + un E2E por proyecto |
| Confluence | Índice y síntesis | reutiliza la página canónica; enlaza Jira, Drive y spec; no duplica el E2E ni crea una segunda síntesis por cambio de nombre |
| RPP | Evidencia de prototipo/build | ruta + commit/rama; una rama no equivale a producción |
| Userpilot / encuestas | Evidencia de comportamiento o percepción | fuente + fecha + país/segmento + muestra + hallazgo + decisión |

## Regla anti-duplicados de Confluence

- El índice canónico es [Proyectos 2026 S2 — Logistic Success](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531314208).
- POD ya existe en [Prueba de entrega — Documentación en Drive](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531772949); código al destinatario, foto, firma y geolocalización se relacionan allí mientras no se demuestre otro proyecto.
- Las 12 páginas hijas existentes y las referencias técnicas externas están inventariadas en [`_registro-confluence.md`](_registro-confluence.md). Una página existente se reutiliza; una fuente técnica se enlaza; una ausencia de título no basta para crear una síntesis nueva.
- Las páginas de Laura son referencia de solo lectura en este frente. `Data (Logistic Success)` no se trata como proyecto ni se replica; su ubicación en el índice se resolverá por gobierno documental, sin editarla ahora.

## Registro cruzado

| LOG | Iniciativa | Jira | Darwin / Hub | Drive / Confluence / RPP | Clasificación y hueco actual |
|---|---|---|---|---|---|
| LOG-001 | Autoconfirmación | PRM-1497 comentario 50933 · oportunidad PRM-1574 · rama WhatsApp candidata PRM-1588/1589 | registrado; fase Research | [Confluence verificado](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572864001); RPP en rama `wireframe/DROP-configuracion-pedidos-autoconfirmacion`; [prueba de usabilidad](movilizacion-confirmacion/prueba-usabilidad-julio-2026.md); Weekly 24/31-jul; hoja LS duplicada | Discovery. Usabilidad completada con 6 usuarios, no impacto. Falta E2E, artefacto crudo, gate ChateaPro y confirmar si la rama WhatsApp equivale al configurador general. Órdenes duplicadas son guardarraíl. |
| LOG-002 | Validación y normalización de direcciones | PRM-91 | registrado | [Confluence existente](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530855466); carpeta Drive vacía; spec repo; board Figma; PROD-1086 encuesta definida, ejecución/resultado no comprobados | Proyecto en discovery. Completar la síntesis existente cuando haya fuente propia. PRM-1341/1144 son antecedentes MX candidatos, no relaciones confirmadas. |
| LOG-003 | Dirección confiable + geo | cruza PRM-1497/1512/1523 | registrado | spec repo | Oportunidad; no tiene ticket propio ni alcance cerrado. |
| LOG-004 | Selección inteligente de transportadoras | PRM-203 → DROP-13739 → DROP-17946 · **PRM-1219** (handoff) · PRM-1513 (paraguas OKR) · PRM-1150 (catálogo/archivos) · PROD-432/576/577/729 · DROP-24402 · PROD-1576/1675/1838/1849/1992 | registrado; ficha corregida 2026-08-03 | [síntesis del sistema inteligente](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531936779); [kickoff de Kate](https://drive.google.com/file/d/1oiKOFdQ27P2COPSRQVVu9WlRAh7c5_bq/view); [análisis de apertura previo](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530593304); Figma; [inventario Userpilot](_fuentes-userpilot-logistica.md); exports restringidos no enlazados | Proyecto en definición/handoff, no experimento suelto ni producción. PRM-1219 está `Asignado para hand off` a Kate; DROP-17946 sigue En curso; PRM-1513 permanece en backlog sin assignee y PROD-1992 conserva el handoff pendiente. PRM-1150 aporta el catálogo V1 y enlaza archivos operativos, pero no convierte esos archivos en otro proyecto ni autoriza copiar sus datos. El POC es referencia: producción requiere arquitectura nueva, squad, carga/índices, carriers e instrumentación. |
| LOG-005 | Same Day | PRM-1366 · PROD-1127 | registrado | [E2E Drive](https://docs.google.com/document/d/1NO9fbjklz2XvMVrMc_os6AuUjsF5ZkmDw3kX5XmwNtA/edit) · [Confluence existente](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531576355) · spec | Proyecto parqueado por WIP; completar las fuentes existentes. El riesgo operativo de validación geográfica sigue explícito. |
| LOG-006 | Parametrización de tarifas | PRM-1362 · PROD-797 | registrado | Drive + spec + RPP; microsurveys despriorizadas | Proyecto; E2E requiere ajuste antes de entrega. PROD-797 es borrador de medición sin campaña/resultados demostrados. |
| LOG-007 | Normalización de estados | PRM-1297 | registrado | [E2E Drive](https://docs.google.com/document/d/1MdJpIfBWM3dODcMW8big-4-RfOxatUIt1I2CcoGtV-Y/edit) · [Confluence existente](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530560582) · spec + vista propia | Proyecto activo de Delivery; completar el E2E existente, que aún conserva la plantilla, y no crear otro. Habilita medición por fases. |
| LOG-008 | Dueño y triaje de novedades | PRM-1512 | registrado | [Notificaciones de Prevención de Devoluciones — síntesis existente](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530560555) · spec | Proyecto en discovery; Jira/ownership y equivalencia por alinear. La página existente es antecedente de prevención/triaje, no token ni logística inversa. |
| LOG-009 | Guías reemplazatorias | PRM-745/1380/1381 · DROP-25407/25564/25614 · PROD-1045 | registrado | [spec](guias-reemplazatorias/spec.md); [auditoría](guias-reemplazatorias/auditoria-lanzamiento-agosto-2026.md); fuentes de Laura solo como referencia | Capacidad beta; evidencia operativa de junio/julio por reconciliar. PROD-1045 sigue en backlog y no prueba rollout global. No mezclar con el código de entrega ni con el token. |
| LOG-010 | Reducir devoluciones COD / logística inversa | PRM-1523 ↔ PRM-1580; antecedentes candidatos DROP-3455/4595/4596 | registrado; ficha por actualizar | [spec](reduccion-devoluciones-cod/spec.md); [auditoría token](reduccion-devoluciones-cod/auditoria-token-veloces-agosto-2026.md); capacitación y revisión Veloces; hoja de prueba restringida | Proyecto OKR en backlog. Token = piloto/capacidad de conciliación del retorno, no prevención de devolución ni proyecto nuevo. Falta informe anonimizado, owners, vigencia de historias e integración; Juan acompaña, no es owner del desarrollo. |
| LOG-011 | Torre de control / tiempo por fases | sin ticket propio | registrado | spec + weekly | Oportunidad de medición. “Torre Logística + evidencias” del workshop todavía no es equivalencia confirmada. |
| LOG-012 | Autogeneración de guías | PRM-1469 (`Solicitud`, Inv. y definición) comentario 50934 → INVS-67; ambos sin assignee/descripcion | registrado; Darwin aún dice Oportunidad/Research | [Confluence verificado](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572929537); prototipo RPP; [auditoría](autogeneracion-guias/auditoria-fuentes-agosto-2026.md); Cell Board/Weekly | Proyecto/solicitud en discovery, no “segundo experimento”. Falta análisis Kevin/Lucho, prueba propia, contrato de datos, E2E y reconciliar Darwin. Guías de recolección 2025 quedan excluidas. |
| LOG-013 | Recolección proactiva | PRM-1465 principal candidato; PRM-1468 fusionada dentro; comentario 51003; PROD-821/1568/1800/1855 sin artefactos | Darwin `044` aplicado/releído | [spec](recoleccion-proactiva/spec.md); [auditoría/paridad](recoleccion-proactiva/auditoria-operacion-paridad-agosto-2026.md); Hub/Indiana; GP/PS-512/503; workshop MX | Oportunidad en Discovery. Pickups externos ≠ carrier interno/cross-docking ≠ PAU futuro ≠ Warranties. RLS bloqueada por 0 accesos `inidiana`; faltan ciclo, owners y piloto. |
| LOG-014 | Parametrización de fulfillment | PRM-1446 · PROD-238/648/785/995/1171/1330/1526 · PROD-240 · INVS-66 · STID-1960 | registrado; resumen verificado 2026-08-02 | [Drive E2E](https://docs.google.com/document/d/1-t3LtPde36OIYE6mDuNWneRn2IL1UPA8paLLiZdbhYI/edit); [Confluence](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572732930); RPP `/old/fulfillment/parametrizar`; spec repo | Workflow Jira “Listo para hand off”, pero handoff transversal bloqueado: PROD-1526 en Dependencia, PROD-240 backlog sin assignee y E2E incompleto. Comentario canónico PRM-1446 #50931. |
| LOG-015 | Vigía | sin Jira | registrado | vista propia + documentación parcial | Experimento de diseño. Requiere ticket, métrica y gate antes de desarrollo. |
| LOG-016 | Pruebas de entrega (POD) | PRM-1517/1364/1361 + PRM-1462/1455/1610/1611/618 · DROP-23095 · PROD-836/1172/1347/1525 | registrado; resumen verificado 2026-08-02 | [único E2E de la carpeta](https://docs.google.com/document/d/16XQ6P1pWrzm3PHaltL5UaMeV4698-rMpgFSpGWd3tas/edit) · [síntesis Confluence canónica](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531772949) · spec repo | Discovery por carrier; handoff PROD-1525 en Dependencia. Reutilizar página/E2E; no crear documento de POD adicional. PROD-1072 excluido (Print On Demand). Código al destinatario es capacidad candidata; token Veloces queda en LOG-010 y archivos de carriers separados. Comentario Jira 50932. |

## Intake sin código propio

| Hallazgo | Tipo hasta validar | Destino de la evidencia |
|---|---|---|
| Torre Logística + evidencias (workshop MX) | discovery compuesto | PROD-1706/1708–1711; comparar LOG-016. No equivale a LOG-011 ni a Torre Control MX |
| Torre de Control MX | capacidad existente + bug | DROP-18559 activación; STID-6894 limitación de filtros |
| Compatibilidad bodega–transportadora | regla/capacidad con antecedentes | DROP-6070/6071/6072 cubren órdenes manuales; comparar LOG-004/012 sin absorber otros flujos |
| Pedidos duplicados desde Ecom | bug candidato / posible recurrencia | PRM-403 comentario `51012` ↔ DROP-6924 Backlog; DROP-6818 hotfix y DROP-6876 reversión; falta reproducción de bodega externa |
| Códigos postales México | oportunidad con antecedentes parciales | PRM-1144 cobertura/CP y PRM-1341 datos Sitidata; mantener intactos |
| Archivos de transportadoras | capacidad/fuente dentro de LOG-004 + operación | PRM-1150 fue fusionada en PRM-203 y conecta con PRM-1219; comentario `51009`; no eliminar fuente hasta paridad/migración |
| Código de seguridad al destinatario | hipótesis POD con contraevidencia | LOG-016/PRM-1517; investigar fricción antes de decidir |

Detalle y fuentes: [intake México — clasificación Logistic Success](_intake-mexico-logistica.md).

## Validaciones antes de sincronizar

- [x] Cuenta Atlassian `producto@dropi.co` autorizada para sincronización documental; no habilita por sí sola cambios de workflow/ownership/relaciones.
- [ ] Jira, Darwin y el Hub muestran el mismo código, tipo, estado y owner.
- [ ] El E2E conserva sus nueve fases y diferencia contenido real de placeholders.
- [x] Se inventariaron las páginas existentes y se fijó la regla de reutilización en `_registro-confluence.md`.
- [ ] Confluence enlaza al E2E vivo en lugar de copiarlo completo.
- [ ] Cada encuesta/Userpilot tiene fuente, fecha, segmento/muestra, hallazgo y decisión.
- [ ] Todo cambio aprobado se vuelve a leer en el sistema destino.
