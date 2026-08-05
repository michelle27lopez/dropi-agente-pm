# 🧪 Especificación de Proyecto: Experimento Concierge Wpp Novatos (`PROD-EXP-WPP-NOVATOS`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-EXP-WPP-NOVATOS`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Wonder ➔ Explore** (Experimento de Falsificación Causal / Wizard of Oz)
* **Estado Interno:** 🚀 Experimento Prioritario (Falsificación con 5 Novatos)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El 94.8% de los dropshippers registrados no logra entregar ni 1 sola orden (Activación Neta 5.2%). El novato huérfano (34.0% de la DB) se paraliza en el día 1 por sobrecarga cognitiva (*Choice Overload*) y falta de conocimiento en marketing digital.
* **Fricción Identificada:** El novato no sabe maquetar tiendas ni publicar en Meta Ads. Su único canal real de contacto inmediato es **WhatsApp Business**, pero se enreda creando su catálogo y redactando respuestas comerciales.
* **Cita del Seller:** *"Registré mi cuenta en Dropi, vi miles de productos pero no sé qué vender ni cómo ofrecérselo a mis contactos por WhatsApp."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Registros con 0 órdenes entregadas en `userpilot_suppliers` (Población Huérfana = 15.659 usuarios).
* **Métrica Factual:** El **96.87% de los novatos jamás vincula un producto** (`real_products_created` = 3.13%). La mediana de TTV Neto es de **16.0 días**.
* **Baseline vs. Meta del Experimento:**
  * *Tasa de Activación Neta:* Baseline **5.2%** $\to$ **Meta Piloto $\ge 40.0\%$ (2 de 5 novatos activos en 48h)**.
  * *Time-to-Value (TTV):* Baseline **16.0 días** $\to$ **Meta < 48 horas**.

---

## 🧠 4. Diagnóstico Conductual & Causalidad (Mindset Discovery)

### A. Diagnóstico B=MAP
* **Motivación (M):** MEDIA (Alta expectativa inicial al registrarse, decae rápidamente por incertidumbre).
* **Ability (A) / Fricción:** EXTREMADAMENTE BAJA (El novato se paraliza si se le exige configurar APIs de Meta o maquetar tiendas).
* **Prompt (P):** Asistencia Concierge directa por WhatsApp en las primeras 24h tras el registro.

### B. Confounders Aislados (Variables de Confusión)
1. **Confounder 1 (Lista de Contactos Previa):** Aislar si el novato ya tiene compradores en su WhatsApp mediante emparejamiento por perfil (PSM).
2. **Confounder 2 (Calidad del Producto / Margen):** Seleccionar 1 solo producto curado con stock auditado $>500$ unids en bodega local y efectividad de entrega $>82\%$.
3. **Confounder 3 (Habilidad de Chat):** Entregar respuestas rápidas pre-armadas (`/oferta`, `/envio`, `/datos`) para que el novato no improvise.

---

## 🛠️ 5. Diseño del Experimento de Falsificación (Wizard of Oz / Concierge)

Para evitar construir código inútil antes de verificar causalidad:

1. **La Simulación Manual:**
   * Seleccionamos a **5 dropshippers novatos reales** (0 órdenes en Supabase).
   * El equipo de producto les configura manualmente su Catálogo de WhatsApp Business en 10 minutos con **1 Producto Ganador Curado**.
   * Les entregamos el kit de **Respuestas Rápidas `/oferta` y `/envio`** listo en su teléfono.
2. **Criterio de Falsificación (Ex-Ante):**
   * > [!IMPORTANT]
   * > **Criterio de Falla:** *"Si a los 5 novatos con el catálogo perfecto y respuestas listas en su WhatsApp Business, menos de 2 logran generar 1 orden entregada en 48 horas, **la hipótesis queda FALSIFICADA (DESTRUIDA)** y no se construye ninguna integración técnica."*
3. **Veredicto de Decisión:**
   * *Si Falla:* Nos ahorramos 3 semanas de ingeniería.
   * *Si Pasa:* Probamos causalidad en caliente con usuarios reales y procedemos a automatizar el flujo.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan)

* **Valor:** 🟢 **EXTREMO** (Ataca la parálisis directa del día 1).
* **Usabilidad:** 🟢 **EXTREMO** (Operación nativa en WhatsApp Business sin salir de su app de mensajes).
* **Factibilidad:** 🟢 **INMEDIATA** (Experimento Concierge manual sin desarrollo técnico).
* **Viabilidad:** 🟢 **ALTO** (Cero costo de licencias o APIs en la fase de prueba).

---

## 📈 7. Eventos de Tracking & Prototipo UX

* **Métrica de Éxito:** % de novatos del experimento que crean su 1ª orden en $\le 48$h.
* **Prototipo Interactivo (UI/UX Completa):**
  * Servidor Local: `http://localhost:3004/prototipos/falsificacion-wpp-novatos-poc.html`
  * Archivo en Repositorio: [hub/public/prototipos/falsificacion-wpp-novatos-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/falsificacion-wpp-novatos-poc.html)

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-EXP-WPP-NOVATOS`
* **Metodología:** [Agente de Discovery](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/.claude/agents/discovery.md) (Wizard of Oz / Falsificación Causal Ex-Ante).
