# 📝 Borradores de documentación para Jira

> **Qué es:** el texto para llenar las descripciones vacías que encontró la auditoría del
> **10-ago-2026**. Cada borrador sale de los specs del cerebro, no se inventa nada.
>
> **⚠️ NO se ha escrito nada en Jira.** La sesión de Atlassian está conectada como **Michel
> Pino**, no como Juan, y el `CLAUDE.md` de este lab prohíbe escribir a nombre de Juan con la
> cuenta de otra persona. Reconectar la cuenta, o pegar estos textos a mano.
>
> **Molde:** se copia la estructura de **PRM-1362** (parametrización de tarifas), el único
> ticket del portafolio con documentación completa — contexto · cambio externo · cambio
> interno · costo de no hacerlo. Si Jira tuviera 14 tickets así, no habría auditoría.

---

## Lo que encontró la auditoría

| Ticket | Descripción | Dueño |
|---|---|---|
| PRM-1362 Tarifas | ✅ Excelente — **el molde** | Juan |
| PRM-1446 Fulfillment | ✅ Buena | Juan |
| PRM-1364 POD | ⚠️ Una línea | Juan |
| PRM-749 Notif. devolución | ⚠️ Tres líneas | Juan |
| **PRM-1297** Normalización | ❌ vacía | Juan |
| **PRM-1366** Same Day | ❌ vacía | Juan |
| **PRM-1469** Autogeneración | ❌ vacía | sin asignar |
| INVS-17 POD | ❌ vacía | sin asignar |
| PRM-1608 Tarifas F1 | ❌ vacía | sin asignar |
| PRM-1609 Tarifas F2 | ❌ vacía | sin asignar |
| PRM-1462 · PRM-1455 · PRM-1610 | ❌ vacías | sin asignar |
| **PROD-235 · PROD-240 · PROD-1127** | ⚠️ solo un link al PRM | sin asignar |

**Las tres épicas de PROD son cáscaras:** su descripción es una URL. Un dev que abra PROD-240
no encuentra qué construir.

---

## 1 · PRM-1297 · Normalización de estados

*Prioridad #1 del Delivery Roadmap (WIP=1), en Inv. y definición, descripción vacía.*

> **Contexto**
>
> No existe "el estado de una orden Dropi". Existen tres fuentes distintas y solo dos son
> homologables:
>
> * **A · Estado de la ORDEN** — lo emite Dropi, es el ciclo de vida comercial. Homologable. ~15 en uso.
> * **B · Estado de la GUÍA** — lo emite la transportadora, es el ciclo físico del paquete. Homologable. ~34 en uso sobre un catálogo de ~500.
> * **C · Movimientos del carrier** — texto libre. **No homologable**: solo sirve para narrativa cruda y para fechar eventos.
>
> Confundir A, B y C es el error de diseño más caro del proyecto. El PDF de macro-proceso
> (24 estados, 6 fases) describe A; el Excel de 576 mapeos describe B. No se contradicen:
> cubren mitades distintas del mismo flujo.
>
> Hoy, de los 51 estados que usa la operación, **35 se guardan como lo mismo**. No se puede
> medir dónde se traba una orden ni avisarle nada al cliente.
>
> **Cambio externo**
>
> Cada transportadora nueva trae su propio vocabulario de estados. Sin un catálogo homologado,
> integrar un carrier implica volver a mapear a mano y multiplicar las colisiones.
>
> **Cambio interno**
>
> Discovery cerrado con datos reales: auditoría de solo lectura sobre **133.555 órdenes y
> 52.636 guías de Colombia**, más una corrida de **125.232 órdenes y 1,88M de eventos** en la
> ventana 19-mar → 22-jul.
>
> Esa corrida cerró la decisión de arquitectura más cara: `INTENTO DE ENTREGA` resultó ser
> **término propio de Interrapidísimo** (144.575 de 145.733 ocurrencias = 99,2%) y ahí
> significa intento fallido — 92,08% termina en falla, contra 44,93% de entrega en el control
> `EN REPARTO` de ENVIA. **No es un término compartido entre carriers, así que no hay colisión
> semántica y el modelo NO necesita eje `transportadora`.** La clave es `estado_crudo` global,
> sin override.
>
> **Modelo propuesto:** dos capas. El estado crudo lo ve el admin; 9 estados homologados los
> ve el usuario.
>
> **Costo de no hacerlo**
>
> 1. El KPI de tiempo de entrega por fases no se puede calcular — es el habilitador de LOG-011.
> 2. El embudo de novedades no es trazable: no se sabe cuántas entran, cuántas se resuelven ni cuántas terminan entregadas.
> 3. No se le puede comunicar al cliente final en qué punto va su pedido.
> 4. Cada carrier nuevo multiplica el mapeo manual.
>
> **Pendiente:** 2 decisiones de negocio para cerrar el catálogo.
>
> **Entregable revisable:** `/proyectos/logistica/normalizacion-estados` — mapa, comparador de
> 4 catálogos sobre el mismo tráfico, evidencia y cola de decisiones.

---

## 2 · PROD-235 · Épica de tarifas

*Hoy su descripción es solo un link a PRM-1362.*

> **Qué construye esta épica**
>
> El panel de parametrización de tarifas de transportadoras. Hoy los ajustes se hacen
> directamente por código: cuando hay que cambiar una tarifa, un sobreflete o un porcentaje de
> COD, se genera un requerimiento a TI.
>
> **Dos fases, ya separadas en discovery:**
>
> * **Fase 1 · PRM-1608** — el panel actual de paquetería express (envíos hasta 5 kg), sobre lo ya construido y prototipado.
> * **Fase 2 · PRM-1609** — mercancía industrial: peso volumétrico, tablas origen-destino, remesas y rangos de peso sin límite. Lógica completamente distinta a paquetería.
>
> **Evidencia del problema (de PRM-1362):** el cotizador de Urbano en Argentina cobra $5.737
> cuando el costo real del trayecto es $10.412 — 82% de diferencia que Dropi absorbe. Y la
> tasa de COD en Argentina estuvo en 0,7% cuando el objetivo de utilidad requiere 1,5%; se
> descubrió meses después porque no hay visibilidad de pricing.
>
> **Alcance de la fase 1:** parametrizar sin tocar código, con validación y simulación antes
> de activar. **Fuera de alcance en fase 1:** mercancía industrial.
>
> Discovery completo en PRM-1362. Prototipo RPP construido, 3 vistas.

---

## 3 · PROD-240 · Épica de fulfillment

*Hoy su descripción es solo un link a PRM-1446.*

> **Qué construye esta épica**
>
> Parametrizar el registro y cobro de los servicios de fulfillment por bodega y proveedor, con
> un corte consolidado por país.
>
> **El problema (de PRM-1446):** Dropi opera bodegas 2PL en Bogotá, Cali y Medellín con
> **92.000 órdenes mensuales**. El cobro se activa solo cuando la orden llega a "Entregado",
> así que **entre el 20 y el 25% de las órdenes preparadas y despachadas nunca se cobran** —
> devoluciones, pérdidas y cancelaciones post-despacho.
>
> Además no se cobran servicios que las bodegas ya prestan: almacenamiento, etiquetado manual
> de productos sin código de barras, armado de kits y combos, y manejo de multi-unidad.
>
> **Modelo de cobro, ya definido:**
> * El responsable del cobro es el **equipo de facturación**
> * El corte es **por país y lo resuelve TI**, no un operador por bodega
> * Si la wallet del proveedor no tiene saldo, **se dispara una alerta; el cobro no se bloquea**
>
> **Pendiente de definir:** a quién notifica esa alerta y con qué política de reintento.
>
> ⚠️ **Esta épica no tiene Solución asociada en Jira** — a diferencia de tarifas, que sí tiene
> sus dos fases. Hay que crearla o vincularla.

---

## 4 · PROD-1127 · Épica de Same Day

*Hoy su descripción es solo un link a PRM-1366.*

> **Qué construye esta épica**
>
> Entrega el mismo día para bodegas propias y para Veloces.
>
> **MVP:** flag Same Day + validación de hora de corte + validación geográfica + selección
> guiada de transportadora.
>
> **Riesgo vivo, confirmado en producción:** hoy con Veloces salen guías marcadas same day
> **sin validación geográfica** — una orden Cali → Santa Marta sale como same day. Es la razón
> por la que la validación geo no es un nice-to-have.
>
> **Discovery:** board de research de Michelle López + mapa de densidad de demanda construido
> sobre **427.294 órdenes reales** de Bogotá, Medellín y Cali, ubicadas por cruce de
> nomenclatura contra OpenStreetMap, para medir cuánta demanda captura un centro de operación
> según su radio.
>
> **Estado:** parqueado por WIP = 1 mientras Normalización de estados es la iniciativa activa.
> La ventana del cronograma es tentativa.
>
> ⚠️ **Definición de datos sin cerrar:** faltan origen, timestamps, transportadora y estado
> final. Hasta cerrarla, el mapa sirve para decidir dónde, no para comprometer SLA.

---

## Pendientes de este archivo

- [ ] Borrador de **PRM-1366** (Same Day, solicitud) — mismo contenido que su épica, en clave de solicitud
- [ ] Borrador de **PRM-1469** (autogeneración de guías) — y asignarle dueño
- [ ] Borradores de las 5 Soluciones vacías: PRM-1608, PRM-1609, PRM-1462, PRM-1455, PRM-1610
- [ ] Borrador de **INVS-17**
- [ ] Ampliar **PRM-1364** (POD) y **PRM-749** (notificación de devolución), hoy de una y tres líneas
- [ ] Crear o vincular la Solución que le falta a PROD-240
- [ ] Aclarar el estado real de POD: se reportó "listo para hand off" pero PRM-1364 está en "Próximo"
