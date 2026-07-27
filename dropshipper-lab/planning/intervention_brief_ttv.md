# 🧠 INTERVENTION BRIEF: Activación Neta / TTV (PROD-1478)

* **Célula:** Seller Success
* **PM:** Santiago Herrera Acosta
* **Responsable de ejecución:** Francisco Velandia
* **Fecha de creación:** 2026-07-27
* **Sprint objetivo:** Agosto 2026
* **Medición:** Septiembre 2026

---

## F0 — Frame (Encuadre)

### Outcome a mover
* **Business Outcome:** Reducir el churn prematuro de nuevos dropshippers y apalancar el crecimiento de órdenes activas de la compañía.
* **Product Outcome (Métrica Primaria):** Mediana de **TTV (Time to Value)**, definida como la cantidad de días entre el registro del seller y su primera entrega exitosa y rentable ($Pv - Pp - F - D > 0$).
* **Baselines & Metas:**
  * *Baseline TTV:* Mediana de 15 días (promedio de 24 días).
  * *Meta del Experimento:* Reducir la mediana de TTV a **$\le 12$ días** (señal de dirección hacia la meta final de 7 días).

### ¿Por qué este tramo y no otro?
La activación bruta (**TTFO — Time to First Order**) ya cuenta con intervención activa mediante el Onboarding guiado lanzado el 9 de julio. Sin embargo, el tramo posterior entre la orden creada y la orden entregada representa un "valle de la muerte" de $\approx 4$ días de mediana. Es en este tramo donde se experimenta el valor real y financiero de Dropi; un seller que experimenta su primera entrega rentable posee tasas de retención significativamente mayores en el ciclo posterior.

### ¿Qué pasa si no intervenimos?
Los nuevos dropshippers huérfanos se registrarán y crearán su primera orden, pero ante la falta de visibilidad del estado logístico y el temor a perder su inversión publicitaria, asumirán que la plataforma falló. Esto disparará un abandono prematuro antes de que la orden llegue física y financieramente a su término.

---

## F1 — Diagnose (Diagnóstico B=MAP)

### Causa raíz conductual
1. **Ability (Fricción Cognitiva) — Crítico:** El dropshipper huérfano desconoce el funcionamiento y los tiempos del flujo logístico (COD - pago contra entrega) de Dropi. Al no tener tracking en tiempo real integrado in-app, experimenta una "caja negra" y se siente incompetente para dar respuesta a su comprador final cuando este le pregunta por el estado del paquete.
2. **Prompt (Señal / Gatillo) — Alto:** No existen prompts ni mensajes contextuales activos que notifiquen al seller el estado de la primera orden, que normalicen los tiempos de tránsito promedio del país o que provean herramientas para mitigar la ansiedad de sus clientes.

### Niveles cognitivos del usuario
El seller se encuentra en el **nivel reptiliano / de supervivencia**. Su principal motivador es el miedo a perder dinero en pauta y producto. La falta de información logística activa su modo defensivo, asumiendo una pérdida inminente y decidiendo abandonar la plataforma como mecanismo de protección de capital.

### Guardarraíles de la Autodeterminación (SDT)
* **Competencia ❌:** El seller se siente incapaz de gestionar la relación post-venta con su cliente final al no poseer información del despacho.
* **Autonomía ❌:** Se siente a merced de transportadoras y procesos internos de Dropi que no puede controlar ni visibilizar.

---

## F2 — Design (Diseño del Experimento)

### Hipótesis Principal
> **Si** habilitamos un canal de comunicación automatizado y contextual in-app/email que enseñe al dropshipper cómo rastrear su primera orden y qué responder al cliente durante el tiempo promedio de envío,
> **entonces** reduciremos la tasa de abandono en el tramo y acortaremos la mediana del TTV,
> **porque** eliminamos la fricción cognitiva de la incertidumbre (Ability) y gatillamos la acción correcta en el momento de mayor ansiedad del seller (Prompt).

### Intervención Mínima Viable (MVP)
Se diseñará un flujo de **3 mensajes automatizados secuenciales** disparados a partir de la creación de la primera orden, reutilizando la infraestructura actual de Onboarding guiado:

* **Mensaje 1 (Disparador: `orden_creada` | Día +1):** 
  * *Contenido:* Guía visual simplificada ("Tu orden está en manos de la transportadora"). Explica los pasos del COD. Provee una **plantilla de respuesta rápida** para que el seller la copie y envíe a su comprador si este pregunta.
  * *Foco:* Promover Ability (Habilidad).
* **Mensaje 2 (Disparador: `en_transito` | Día +3):**
  * *Contenido:* Recordatorio de tiempos de entrega promedio por país ("El tiempo estimado de entrega es de X días. Estamos dentro del rango normal").
  * *Foco:* Mitigar ansiedad (Prompt).
* **Mensaje 3 (Disparador: `orden_entregada_rentable` | Día del Outcome):**
  * *Contenido:* "¡Felicidades, ganaste tus primeros $X! Revisa tu Wallet y mira tu saldo real. Estás listo para escalar".
  * *Foco:* Refuerzo positivo / Variable Reward.

### Parámetros del Experimento
* **Muestra:** Todos los dropshippers "huérfanos" que registren su primera orden en el mes de agosto de 2026.
* **Canal de Entrega:** Correos electrónicos automáticos del flujo de onboarding y banners in-app (UserPilot).
* **Restricción:** El experimento **no depende** de la Torre Logística (`PROD-1706`), se ejecutará con la infraestructura de envío de notificaciones y correo existente.

---

## F3 — Measure (Métricas y Criterios de Decisión)

### Métricas de Outcome (Negocio / Comportamiento)
* **Métrica Primaria:** Mediana de TTV (días desde registro hasta primera entrega rentable).
* **Métrica Secundaria:** Tasa de conversión TTFO $\to$ TTV (% de sellers con orden creada que llegan a orden entregada y rentable).
* **Dato Nuevo a Registrar:** Tasa de abandono en el tramo (sellers que crean la primera orden pero no registran entrega en los 30 días posteriores).

### Métricas de Actividad (Filtros de control)
* Tasa de apertura y lectura de los 3 correos del flujo.
* Clics en la plantilla de respuesta logística.

### Criterios de Decisión (Gate 2 — Octubre 2026)

| Resultado en Mediana TTV | Decisión | Acción |
| :--- | :--- | :--- |
| **Mediana $\le 12$ días** | **Escalar ✅** | Entra formalmente al roadmap Q4 con especificaciones técnicas completas y conexión de base de datos automatizada. |
| **Mediana $> 12$ días** *(con mejora en conversión)* | **Iterar 🔄** | Ajustar canal de entrega (ej. migrar a WhatsApp automatizado) o refinar el contenido de las plantillas. |
| **Sin variación / Churn igual** | **Matar ❌** | Descartar hipótesis de contención y reevaluar barreras del flete/catálogo en lugar de comunicación. |

---

## F4 — Decide (Protocolo de Decisión)

* **Fecha de Lectura de Datos:** 15 de septiembre de 2026.
* **Decisor:** Santiago Herrera Acosta (PM).
* **Blocker de Medición:** Si el desajuste de `user_id` (UserPilot ≠ backend) no es resuelto por José Giraldo, Francisco Velandia generará la lectura de resultados cruzando datos manualmente vía extracción CSV/SQL en la base de datos de producción.
