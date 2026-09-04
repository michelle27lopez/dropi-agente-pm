# 🔔 Especificación de Proyecto: Módulo Notificaciones 360 (`PROD-1664`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-1664`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Explore** (Diseño UX/UI y Reglas de Negocio)
* **Estado Interno:** 🛠️ Re-alinear (Completando Vacíos de Throttling y UX Writing)
* **Research Base:** [RB-011: Notificaciones Proactivas B2B y Reglas Anti-Spam](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/research-brain/published/RB-011-notificaciones-proactivas.md)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Los sellers se enteran de problemas (novedades, devoluciones, quiebres de stock) demasiado tarde porque deben ir a buscarlos manualmente a la plataforma. 
* **Fricción Identificada:** Dependencia de la memoria del seller (Sistema 2) para revisar constantemente los estados de sus guías y pagos. 

---

## 🧠 3. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Quieren cuidar su dinero y evitar devoluciones).
* **Prompt (P):** Faltante o ineficaz. La solución es inyectar P(rompts) externos (Push/In-App) e internos (Centro de notificaciones).
* **Fricción de Diseño:** Si enviamos notificaciones sin filtro por cada evento, generaremos "Ceguera por Inatención" (Fatiga de Notificaciones). Se requiere *Throttling* estricto.

---

## 🛠️ 4. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Creación de un "Centro de Notificaciones" in-app (la campanita) con lógica de agrupación (Digest) y respuestas bi-direccionales accionables directamente desde la vista de alerta.
* **Trilema de Fricción:**
  * **ELIMINAR:** La revisión manual compulsiva de los módulos de "Mis Ventas" y "Novedades".
  * **PRESERVAR:** El control del usuario (Panel de preferencias para silenciar alertas no críticas).
  * **INVERTIR:** Tomarse el tiempo de gestionar la novedad *in-situ* cuando la alerta llega (Actionable).

---

## 🛡️ 5. Reglas Críticas de Negocio (Handoff Requirements)
1. **Reglas Anti-Spam (Throttling):**
   * *Regla de Ráfaga:* Si un seller sufre $>5$ novedades del mismo tipo en $\le 1$ hora, agrupar en un *Digest* ("Tienes 6 nuevas Novedades Logísticas").
   * *Rate Limit:* Máximo 15 notificaciones push al día por seller.
2. **UX Writing (Alejandra Melo):**
   * *Estructura obligatoria:* [Estado] + [Consecuencia] + [Acción].
   * *Ejemplo:* "Novedad en Guía #1234: Dirección errada. Corrige antes de 12h o será devuelta."
3. **Bi-Direccionalidad:**
   * El payload de la notificación debe traer las "Quick Actions" (ej. botón "Corregir Dirección") o el Deep Link directo al drawer de resolución.

---

## 🔗 6. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-1664`
* **Prototipos Interactivos:** 
  * [notificaciones/centro-alertas-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/notificaciones/centro-alertas-poc.html) *(Nota: Directorio referenciado según hallazgos en memoria)*
