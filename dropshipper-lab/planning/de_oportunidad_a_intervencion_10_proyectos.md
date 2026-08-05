# 🛠️ DE OPORTUNIDAD A INTERVENCIÓN — 10 PROYECTOS CORE SELLER SUCCESS
## Célula Seller Success · Dropi S2 2026

> **Marco de Referencia:** Especificación Conductual basada en el [Agente de Discovery](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/.claude/agents/discovery.md) (B=MAP, Dual Process / Carga Cognitiva, Hook Model, SDT, 4 Riesgos de Cagan y Formulación Formal de Hipótesis).

---

## 1. 🔌 Dropify 2.0 (APIs Shopify `PROD-580`, WooCommerce `DROP-17355`, Tienda Nube `STID-6598`)

* **Oportunidad / Problema de Origen:** Sellers de alto volumen pierden hasta 4 horas al día digitando manualmente sus pedidos desde su tienda online (Shopify, Woo, Tienda Nube) hacia Dropi, o sufren fallas silenciosas en la sincronización de variantes/fletes.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** EXTREMA (Sellers integrados producen 487,6 ord/activo vs 104 manuales; el seller busca escalar volumen sin fricción).
  * **Ability / Fricción (A):** MUY BAJA (Fricción técnica alta por mapeo manual de credenciales, variantes complejas y errores de webhooks).
  * **Prompt (P):** Interrupción por falla silenciosa (el seller descubre que el pedido no se despachó cuando el comprador reclama).
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Instalación OAuth de 1-Clic en la tienda de apps de Shopify/Woo. Mapeo automático de variantes y sync bidireccional en segundo plano (*default* invisible).
  * *Trilema de Fricción:* **ELIMINAR** la digitación de pedidos. Preservar la confirmación inicial de credenciales (guardarraíl).
* **Check SDT:** **Maestría** (el seller opera como un e-commerce profesional) + **Autonomía** (control total de inventario sincronizado).
* **Formulación Formal de la Intervención:**
  > **SI** eliminamos el 100% de la digitación manual mediante una sincronización OAuth 1-Clic y webhooks resilientes (*Ability*)...  
  > **ENTONCES** los sellers aumentarán su volumen promedio de despachos de 104 a >300 órdenes/mes por activo...  
  > **MEDIDO POR** % de consistencia de sincronización (Confiabilidad $\ge 99.9\%$) y crecimiento del volumen transaccionado por canal API.

---

## 2. 🚀 PoC Shopi / PoolMax (Pauta Centralizada Comunidades `PROD-POOLMAX`)

* **Oportunidad / Problema de Origen:** El 43,1% del volumen rastreado (1,35M órdenes) viene de comunidades/academias de dropshipping. Los miembros desperdician presupuesto publicitario compitiendo por los mismos públicos o carecen de capital/conocimiento para pautar solos.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** ALTA (Deseo de rentabilizar pauta apoyándose en el conocimiento colectivo del líder).
  * **Ability / Fricción (A):** BAJA (Montar campañas complejas en Meta Ads y gestionar tiendas individuales abruma al novato).
  * **Prompt (P):** Invitación del líder de comunidad a aportar al "Pool" de pauta compartida.
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* El seller aporta su presupuesto ($1M, $2M) a una campaña centralizada gestionada por la comunidad; la API de PoolMax distribuye las ventas generadas de forma automática hacia la tienda del seller según su % de aporte exacto.
  * *Trilema de Fricción:* **ELIMINAR** la creación individual de anuncios en Meta Ads. **PRESERVAR** la visibilidad transparente de asignación de pedidos en el dashboard.
* **Check SDT:** **Relación (Relatedness)** (pertenencia a la comunidad) + **Autonomía** (escalar ventas sin operar pauta directa).
* **Formulación Formal de la Intervención:**
  > **SI** automatizamos la distribución de pedidos por API desde campañas centrales de pauta hacia las tiendas de los miembros (*Ability + Relatedness*)...  
  > **ENTONCES** los miembros de la comunidad activarán sus ventas sin parálisis de pauta y el canal de comunidades crecerá un +35% MoM...  
  > **MEDIDO POR** Volumen de órdenes asignadas por API y tasa de conversión de aportantes a sellers activos.

---

## 3. 🏆 Dropi Wrapped Leyendas 2026 (`PROD-WRAPPED`)

* **Oportunidad / Problema de Origen:** Churn de sellers Pareto por falta de sentido de pertenencia y falta de reconocimiento visual de su progreso transaccional en la plataforma.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** MEDIA-BAJA (Riesgo de enfriamiento entre campañas de pauta).
  * **Ability / Fricción (A):** ALTA (Consumo pasivo en formato Stories).
  * **Prompt (P):** Notificación in-app y correo de revelación de "Tu Wrapped Leyendas 2026".
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Experiencia interactiva tipo Instagram/TikTok Stories que gamifica la trayectoria del seller cruzando sus ventas en Billones/Millones, efectividad de entrega y nivel en Leyendas Dropi (1 a 6).
  * *Loop de Hábito (Hook Model):* Recompensa variable (Estatus + Insignia compartible) $\to$ **Inversión (Investment):** El seller comparte su insignia en redes sociales (virallity) e inicia pauta para el siguiente nivel.
* **Check SDT:** **Maestría** (reconocimiento del volumen alcanzado) + **Relación** (estatus visible ante la comunidad).
* **Formulación Formal de la Intervención:**
  > **SI** entregamos una retrospectiva gamificada en formato Stories conectada a los 6 niveles de Leyendas (*Motivación Intrínseca + Goal-Gradient Effect*)...  
  > **ENTONCES** los sellers aumentarán su engagement in-app y la retención a 30 días subirá del 69.4% al 75.0%...  
  > **MEDIDO POR** CTR de compartido en redes sociales y Tasa de Retención a 30 días de la cohorte intervenida.

---

## 4. 🔀 Bifurcación Onboarding (Express vs. Guiado)

* **Oportunidad / Problema de Origen:** El onboarding actual es plano y trata igual al 34,0% de novatos (0 órdenes) que al 22,8% de sellers VIP (>300 órdenes/mes). El experto sufre fricción aburrida; el novato sufre sobrecarga cognitiva (*Choice Overload*).
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** Diversa (Experto busca velocidad; Novato busca claridad).
  * **Ability / Fricción (A):** Desalineada (Demasiada fricción para el experto; poca guía para el novato).
  * **Prompt (P):** Encuesta inicial de 1 pregunta en UserPilot (`survey_volume`).
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Bifurcación Inmediata:* Si `survey_volume > 300` $\to$ **Ruta Express** (integración API de 1 clic directa a catálogo/Dropify). Si `survey_volume = 0` $\to$ **Ruta Guiada Page Pilot** (asistencia paso a paso con ángulo de venta).
  * *Trilema de Fricción:* **ELIMINAR** pasos de configuración para el seller VIP. **PRESERVAR** andamiaje (scaffolding) para el novato.
* **Check SDT:** **Autonomía** (el experto no es frenado) + **Maestría** (el novato no es abrumado).
* **Formulación Formal de la Intervención:**
  > **SI** bifurcamos el flujo de bienvenida según el volumen declarado en la primera pantalla (*Ability Adaptativa*)...  
  > **ENTONCES** el Time-to-Value (TTV) Neto promedio caerá de 16.0 días a <12.0 días...  
  > **MEDIDO POR** Mediana de días de TTV Neto por cohorte (Express vs Guiada).

---

## 5. 💬 Discovery SAC & Deflexión Help Center (`PROD-SAC-RESEARCH` / `PROD-HELP-MOD`)

* **Oportunidad / Problema de Origen:** Deflexión de soporte estancada en 0,0%. Se reciben 3.664 tickets/mes en SAC, donde el 32,8% son variantes de incertidumbre de saldo/retiro/recarga en Wallet y el 31,1% son anulaciones o estados de guías.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** ALTA (Ansiedad por la seguridad de su dinero o de su paquete).
  * **Ability / Fricción (A):** BAJA (Abrir chat de WhatsApp requiere menor esfuerzo que buscar en FAQs complejas).
  * **Prompt (P):** Gotica/barra tenue de ayuda bajo la cabecera del módulo (sin widgets flotantes molestos).
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Autogestión in-app contextual por módulo. Micro-videos de <45s y FAQs exactas extraídas del análisis de `ml_ia.patrones` que responden proactivamente al estado de retiros y guías.
  * *Trilema de Fricción:* **ELIMINAR** la necesidad de chatear con un agente humano para preguntas administrativas de estado.
* **Check SDT:** **Autonomía** (el seller resuelve sus dudas en segundos sin depender de soporte).
* **Formulación Formal de la Intervención:**
  > **SI** desplegamos ayuda contextual in-app basada en el Top 4 de consultas reales de SAC (*Ability + Reducción de Carga Cognitiva*)...  
  > **ENTONCES** la deflexión de soporte técnico aumentará del 0.0% al 40.0% en consultas de Nivel 1...  
  > **MEDIDO POR** % de consultas auto-resueltas in-app sin generación de ticket en 24h.

---

## 6. 📄 Page Pilot / Landings + Ángulo Venta Obligatorio (`PROD-1663`)

* **Oportunidad / Problema de Origen:** Dropshippers huérfanos se paralizan intentando maquetar tiendas online complejas desde cero y no logran publicar su oferta comercial.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** MEDIA (Alta al registrarse, decae rápidamente por parálisis).
  * **Ability / Fricción (A):** MUY BAJA (Falta de habilidad para redactar copys persuasivos y diseñar ofertas).
  * **Prompt (P):** CTA principal en la pantalla de bienvenida: "Crea tu Landing en 3 Minutos".
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Creador de páginas guiado que exige seleccionar un **Ángulo de Venta Obligatorio** (ej. Problema-Solución, Oferta 2x1) e inyecta plantillas prediseñadas listas para vender.
  * *Trilema de Fricción:* **ELIMINAR** la maquetación en blanco. **PRESERVAR** la elección del producto ganador.
* **Check SDT:** **Maestría** (crear una landing profesional en minutos refuerza la autoeficacia del seller).
* **Formulación Formal de la Intervención:**
  > **SI** reemplazamos el lienzo en blanco por un creador con ángulos de venta predefinidos (*Facilitador / Ability*)...  
  > **ENTONCES** la conversión a la primera orden creada (TTFO) subirá +25% en la cohorte huérfana...  
  > **MEDIDO POR** % de usuarios del piloto que publican una landing activa en $\le 14$ días.

---

## 7. 📦 Solución Muestras 1-Clic (`PROD-MUESTRA-SIMP`)

* **Oportunidad / Problema de Origen:** El seller siente desconfianza de vender un producto de catálogo sin haberlo probado físicamente, pero el flujo actual de pedir muestras requiere digitar su dirección repetidamente.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** MEDIA (Miedo a vender productos de mala calidad o con empaque defectuoso).
  * **Ability / Fricción (A):** BAJA (Fricción de re-llenar formularios de envío en cada solicitud).
  * **Prompt (P):** Botón jerarquizado "Pedir Muestra a tu Casa" en la ficha del producto.
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Formulario 1-Clic con dirección pre-llenada automáticamente desde su perfil, sin modales nuevos ni botón "Guardar" (auto-save en caliente).
  * *Insight UX:* Mantenimiento de la selección manual de transportadora (el seller usa muestras para testear tiempos de entrega reales de paqueteras).
* **Check SDT:** **Autonomía** (experimentar el producto da seguridad para hacer pauta).
* **Formulación Formal de la Intervención:**
  > **SI** simplificamos el pedido de muestras a 1-Clic con auto-diligenciamiento de dirección (*Ability / Reducción de Fricción*)...  
  > **ENTONCES** la solicitud de muestras crecerá un +15% y la conversión a la primera orden neta subirá...  
  > **MEDIDO POR** Tasa de conversión de "Ver Ficha de Producto" $\to$ "Solicitar Muestra".

---

## 8. 🛡️ Second Best / Enrutamiento Dinámico (`PROD-SEC-BEST`)

* **Oportunidad / Problema de Origen:** El proveedor principal quiebra stock y el seller de alto volumen pierde margen por detener sus campañas de pauta publicitaria.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** EXTREMA (*Loss Aversion*: pánico a perder ventas activas y presupuesto de Meta).
  * **Ability / Fricción (A):** BAJA (Desviar órdenes manualmente a otro proveedor toma horas).
  * **Prompt (P):** Alerta emergente de stockout con propuesta de enrutamiento secundario.
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1 vs Sistema 2):* Notificación proactiva que sugiere desviar las órdenes varadas a un proveedor de respaldo calificado. Si hay sobrecosto menor de flete, el Sistema 2 evalúa y aprueba el desvío en 1-Clic sin apagar pauta.
  * *Trilema de Fricción:* **ELIMINAR** la cancelación de la orden. **PRESERVAR** la aprobación explícita del seller si cambia la ganancia neta.
* **Check SDT:** **Autonomía** (el seller protege el control de su negocio) + **Maestría** (operación resiliente).
* **Formulación Formal de la Intervención:**
  > **SI** habilitamos el enrutamiento dinámico automático hacia proveedores de respaldo ante stockout (*Motivación: Loss Aversion*)...  
  > **ENTONCES** rescataremos $\ge 75\%$ de las órdenes amenazadas por quiebre de stock en el Pareto...  
  > **MEDIDO POR** Volume of GMV rescatado y % de aceptaciones del proveedor secundario.

---

## 9. 🚚 Torre Logística: Evidencias y Trazabilidad (`PROD-1706` / `PROD-1665`)

* **Oportunidad / Problema de Origen:** El seller no tiene visibilidad del estado real del paquete post-despacho y sufre incertidumbre cuando la guía entra en estado generado o novedad.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** ALTA (Asegurar el cobro de la venta COD).
  * **Ability / Fricción (A):** BAJA (Consultar guías una por una en portales externos de paqueteras es ineficiente).
  * **Prompt (P):** Alerta de novedad o cambio de estado con botón de acción directa.
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Panel de Torre Logística in-app que expone evidencias físicas de entrega (fotos/firmas) y permite resolver novedades en $\le 24$h mediante acciones predeterminadas.
  * *Instrumentación de Hábito (Capa 1.5):* Triggers post-venta que sugieren auditar stock 48h después de la primera entrega exitosa.
* **Check SDT:** **Maestría** (habilidad operativa logística) + **Autonomía** (resolución directa de novedades).
* **Formulación Formal de la Intervención:**
  > **SI** exponemos las evidencias de entrega y la resolución de novedades en 1-Clic in-app (*Ability + Saliencia*)...  
  > **ENTONCES** reduciremos las devoluciones en un -15% y construiremos la racha de hábito post-venta...  
  > **MEDIDO POR** % de novedades resueltas en <24h y Tasa de Retención post 1ª entrega.

---

## 10. 📊 Fórmula Orden Rentable & Audit Baseline (`PROD-1341` / `PROD-1348`)

* **Oportunidad / Problema de Origen:** El seller toma decisiones de pauta publicitaria a ciegas porque desconoce su utilidad neta real descontando fees de plataforma, fletes y tasa de devolución por país.
* **Diagnóstico Conductual B=MAP:**
  * **Motivación (M):** ALTA (Deseo de saber cuánto dinero real está ganando).
  * **Ability / Fricción (A):** BAJA (Calcular manualmente $Pv - Pp - F - D$ en Excel es complejo y propenso al error).
  * **Prompt (P):** Indicador visual de "Utilidad Neta Estimada" en el resumen del pedido.
* **Intervención Conductual (Qué cambia en el Producto):**
  * *Diseño por Fluidez (Sistema 1):* Visibilidad transparente de la utilidad neta por orden parametrizando fees y tipos de cambio por país (CO, MX, EC, CL).
  * *Trilema de Fricción:* **ELIMINAR** la incertidumbre financiera. **PRESERVAR** la personalización del costo publicitario (CAC).
* **Check SDT:** **Maestría** (comprensión profunda de la salud financiera del negocio).
* **Formulación Formal de la Intervención:**
  > **SI** transparentamos la Fórmula de Orden Rentable en tiempo real en la pantalla de pedidos (*Ability / Sistema 1*)...  
  > **ENTONCES** el seller optimizará sus precios de venta y reducirá operaciones con margen negativo...  
  > **MEDIDO POR** % de sellers con margen neto positivo y precisión del cálculo financiero vs datos de Wallet.

---

### 📌 Resumen de Ejecución Conductual

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             MATRIZ DE INTERVENCIÓN CONDUCTUAL                            │
├───────────────────────────────┬───────────────────────────────┬──────────────────────────┤
│ FOCO DE INTERVENCIÓN          │ PROYECTOS CORE                │ PALANCA B=MAP PREDOM.    │
├───────────────────────────────┼───────────────────────────────┼──────────────────────────┤
│ 🔌 API & Escalamiento         │ Dropify 2.0, PoC PoolMax      │ Ability (OAuth / Sync)   │
│ 🏆 Gamificación & Retención   │ Dropi Wrapped Leyendas        │ Motivation (Hook/SDT)    │
│ ⚡ Activación & Onboarding    │ Bifurcación, Page Pilot       │ Ability (Choice Overload)│
│ 💬 Deflexión & Autogestión    │ Discovery SAC / Help Center   │ Ability (Carga Cognitiva)│
│ 🛡️ Resiliencia & Operación    │ Muestras, Second Best, Torre  │ Motivation (Loss Avers.) │
│ 📊 Salud Financiera           │ Orden Rentable                │ Ability (Transparencia)  │
└───────────────────────────────┴───────────────────────────────┴──────────────────────────┘
```
