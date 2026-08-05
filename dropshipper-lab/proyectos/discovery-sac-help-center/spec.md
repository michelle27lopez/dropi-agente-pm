# 💬 Especificación de Proyecto: Discovery SAC & Deflexión Help Center (`PROD-SAC-RESEARCH` / `PROD-HELP-MOD`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-SAC-RESEARCH` / `PROD-HELP-MOD`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **SAC Lead:** Laura Contreras / José Pineda
* **Fase JPD:** **Explore** (Triaje de Tickets Concluido & Diseño de Help Center)
* **Estado Interno:** 🚀 Double Down (Integración con Biblia AI)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Deflexión de soporte estancada en **0,0%**. SAC recibe **3.664 tickets al mes** en 10 países. El seller abre chat directo por preguntas simples de estado.
* **Fricción Identificada:** El 32,8% de las consultas son por Wallet (estado de retiros 120, recargas 120, problemas al recargar 40) y el 31,1% por logística (anulación de guías 290, estado generado 156).
* **Cita del Seller:** *"No sé si mi dinero ya se transfirió a mi banco, prefiero preguntarle a un asesor por WhatsApp que ponerme a buscar."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Fuente de Datos:** Reporte operacional `ml_ia.patrones` (3.664 conversaciones analizadas).
* **Métrica Factual:** Las 4 preguntas más frecuentes son variantes del estado transaccional: **"¿En qué estado está mi X?"**
* **Baseline vs. Meta:**
  * *Tasa de Deflexión SAC (Nivel 1):* Baseline **0.0%** $\to$ **Meta 40.0%**.
  * *Tickets Mensuales por Dudas de Wallet:* Baseline 1.202 tickets $\to$ **Meta < 400 tickets**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Ansiedad por la seguridad financiera o el paquete).
* **Ability (A) / Fricción:** BAJA (Chatear requiere menor esfuerzo inmediato que buscar en un centro de ayuda desactualizado).
* **Prompt (P):** Gotica/barra tenue de ayuda contextual bajo la cabecera del módulo (sin widgets flotantes molestos).
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Auto-resolución in-app con micro-videos de <45s y FAQs predictivas exactas.

---

## 🛠️ 5. Intervención de Producto & Flujo Completo del Usuario (End-to-End)

Para evitar la fragmentación de características o la proliferación de widgets molestos, la solución se consolida en **un solo flujo unificado de 4 pasos in-app**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FLUJO UNIFICADO DE USUARIO (Ayuda Contextual + Buzón Co-Creación + Sherlock AI)                         │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PASO 1: TRIGGER IN-APP DISCRETO                                                                        │
│ • El seller está en un módulo crítico (ej: Wallet consultando retiros o Novedades).                    │
│ • Visualiza el botón sutil de "Ayuda & Sugerencias" en la esquina inferior.                            │
│                                                                                                        │
│ PASO 2: DESPLIEGUE DEL PANEL UNIFICADO (2 Pestañas en 1 Widget)                                        │
│ • Pestaña 💡 "Ayuda del Módulo": Muestra las 3 FAQs más consultadas de esa vista específica.           │
│ • Pestaña 💬 "Buzón de Co-Creación": Permite enviar sugerencias, mejoras o reportar un dolor de UX.   │
│                                                                                                        │
│ PASO 3: ENGINE INTELIGENTE CON SHERLOCK AI                                                             │
│ • Si consulta una duda: Sherlock responde con micro-guías in-app (<45s) logrando deflexión >40%.       │
│ • Si envía una sugerencia/bug: Sherlock analiza la semántica, elimina duplicados y clasifica:          │
│   - Dudas operativas ➔ Responde de inmediato in-app.                                                  │
│   - Ideas de producto ➔ Envía al backlog de Jira del PM de la célula correspondiente.                 │
│   - Bloqueos graves ➔ Rutea al WhatsApp de soporte de Laura Contreras (SAC).                          │
│                                                                                                        │
│ PASO 4: RECOMPENSA CONDUCTUAL & CLOSED-LOOP                                                            │
│ • El seller recibe confirmación in-app de la gestión ("Tu idea fue asignada a Finanzas").             │
│ • Cero cambio de contexto: el seller no sale a WhatsApp ni abandona su flujo de ventas.                │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Trilema de Fricción:**
  * **ELIMINAR:** La necesidad de chatear con un ser humano para saber el estado de un retiro o guía.
  * **PRESERVAR:** Acceso a soporte humano prioritario cuando el caso supera Nivel 1.
  * **INVERSIÓN:** El feedback dejado por el seller retroalimenta el backlog sin trabajo de triaje manual.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Libera capacidad del equipo de soporte).
* **Usabilidad:** 🟢 **ALTO** (In-app, sin salir de la pantalla operativa).
* **Factibilidad:** 🟢 **ALTO** (Contenido de FAQs e indexación en progreso).
* **Viabilidad:** 🟢 **EXTREMO** (Reduce costos operativos de SAC).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"El dropshipper consultará la respuesta contextual in-app en lugar de chatear si el tiempo de respuesta es <1 segundo."*
  * *Test:* Piloto in-app en el módulo de integraciones con 50 comercios midiendo el CTR de autogestión.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de búsquedas in-app resueltas sin generación de ticket en 24h.
* **Lagging Indicator:** Volumen total de tickets SAC recibidos al mes.
* **Eventos a Instrumentar:**
  * `expand_contextual_help_module`
  * `click_faq_resolution_success`
  * `redirect_to_human_sac_ticket`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-SAC-RESEARCH` / `PROD-HELP-MOD`
* **Especificación Madre:** [ESTADO.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/ESTADO.md#L200)
