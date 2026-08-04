# 🧪 INTERVENTION BRIEF CONDUCTUAL — 1 PRODUCTO GANADOR "LISTO PARA DESPACHO"
## Célula Seller Success · Dropi S2 2026

> **Marco de Referencia:** Especificación Conductual fundamentada en el [Agente de Discovery](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/.claude/agents/discovery.md) (B=MAP, Dual Process / Carga Cognitiva, Hook Model, SDT, 4 Riesgos de Cagan y Assumption Testing).

---

## 🎯 1. Problema Conductual & Diagnóstico B=MAP

* **Comportamiento Actual (Falla):** El 96.87% de los usuarios registrados ingresa a Dropi, se enfrenta a un catálogo de 10.000+ productos heterogéneos sin saber cuál tiene stock real o baja devolución, sufre parálisis por elección (*Choice Overload*) y abandona sin publicar ningún producto (`real_products_created` = 3.13%).
* **Comportamiento Objetivo:** El novato ingresa al dashboard en sus primeras 48 horas, selecciona en 1-Clic el **Producto Ganador "Listo para Despacho"** curado por Dropi para su ciudad, y activa su primera oferta comercial.
* **Diagnóstico B=MAP:**
  * **Motivación (M):** MEDIA (Alta expectativa inicial al registrarse, decae rápidamente por incertidumbre).
  * **Ability / Fricción (A):** MUY BAJA (Fricción cognitiva extrema investigando proveedores, stock y márgenes).
  * **Prompt (P):** Banner/Card destacado en el Home: *"Tu primer producto listo para despacho hoy"*.
* **Procesamiento Dual & Carga Cognitiva:** **Sistema 1 (Fluidez).** Eliminar la búsqueda en el catálogo. Presentar **1 solo producto curado** con stock auditado en su ciudad, flete calculado y margen limpio visible.

---

## 💡 2. Tres Estrategias de Intervención (Espacio de Soluciones)

Para evitar el sesgo de la primera idea, estructuramos 3 alternativas de facilitación:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   ESPACIO DE SOLUCIONES: 1 PRODUCTO GANADOR                              │
├───────────────────────────────┬───────────────────────────────┬──────────────────────────┤
│ ESTRATEGIA A: HERO CARD HOME  │ ESTRATEGIA B: CATÁLOGO STARTER│ ESTRATEGIA C: MATCHING   │
├───────────────────────────────┼───────────────────────────────┼──────────────────────────┤
│ • Card destacada en Home.     │ • Pestaña "Starter" en el     │ • Encuesta de 1 pregunta │
│ • "Producto Estrella Semana". │   catálogo general.           │   en onboarding (nicho). │
│ • Stock auditado >500 unids.  │ • Filtra los 10 productos con │ • Asigna automáticamente │
│ • Botón "Vender en 1-Clic".   │   efectividad >80%.           │   1 producto a su tienda.│
└───────────────────────────────┴───────────────────────────────┴──────────────────────────┘
```

### 🏆 Estrategia Seleccionada: **Estrategia A (Hero Card "Producto Estrella de la Semana" en Home)**
* **Por qué gana:** Ataca directamente al novato desde el minuto 1 de su login en la Home, sin exigirle navegar menús profundos de la plataforma.

---

## 🛠️ 3. Intervención de Producto & Trilema de Fricción

* **Qué cambia en la pantalla (Home):**
  * Se destaca una tarjeta principal: **"Producto Estrella de la Semana — Listo para Despacho"**.
  * **Data Transparente Visible:** Foto limpia, Stock auditado ($>500$ unids en bodega local), Tiempo promedio de despacho ($<24$h), Efectividad de entrega ($>82\%$) y Ganancia Neta Estimada por unidad ($22.000\text{ COP}$).
  * **CTA Primario:** **[ 🚀 VENDER EN 1-CLIC ]**
* **Trilema de Fricción:**
  * **ELIMINAR:** La búsqueda de proveedores y el filtrado manual entre 10.000 productos.
  * **PRESERVAR:** La libertad del seller de cambiar de producto más adelante si prefiere otro nicho.

---

## 🔁 4. El Loop Conductual (Hook Model) & Checks SDT

* **Trigger (Disparador):** Prompt visual en Home al iniciar sesión.
* **Action (Acción):** 1-Clic en "Vender este Producto".
* **Variable Reward (Recompensa):** Sentimiento inmediato de avance (ver su tienda o catálogo listo con una oferta que tiene stock real).
* **Investment (Inversión):** Pedir la muestra a su casa o compartir el link con sus primeros clientes.
* **Check SDT:**
  * **Autonomía:** 🟢 Siente control al iniciar con un producto verificado por la plataforma.
  * **Maestría:** 🟢 Supera la barrera del día 1 sin cometer errores de selección de proveedores piratas.

---

## 🔬 5. Matriz de los 4 Riesgos & RAT (Riskiest Assumption Testing)

* **Valor:** 🟢 **EXTREMO** (Elimina la causa #1 de abandono del huérfano).
* **Usabilidad:** 🟢 **EXTREMO** (1-Clic en la pantalla de inicio).
* **Factibilidad:** 🟢 **ALTO** (Curaduría manual inicial por equipo comercial de Dropi).
* **Viabilidad:** 🟢 **ALTO** (Garantiza volumen hacia proveedores con alta efectividad).
* **Riskiest Assumption Test (RAT):**
  * **Supuesto más Riesgoso:** *"El novato adoptará el producto recomendado por Dropi en lugar de querer buscar un producto exótico por su cuenta."*
  * **Test más Barato:** **Fake Door Test en Home** con una cohorte de 100 usuarios novatos (0 órdenes) midiendo el CTR del botón *"Vender en 1-Clic"* vs *"Ir al Catálogo General"*.
  * **Criterio de Éxito ex-ante:** CTR en tarjeta recomendada $\ge 40\%$ de los novatos expuestos.

---

## 📈 6. Métricas de Impacto & Eventos de Tracking

* **Leading Indicator:** % de usuarios novatos que vinculan el producto recomendado en sus primeras 48h.
* **Lagging Indicator:** Tasa de Activación Neta (5.2% $\to$ 8.0%) y Mediana de TTV Neto (16d $\to$ <12d).
* **Eventos a Instrumentar:**
  * `view_home_hero_recommended_product`
  * `click_import_recommended_product_1click`
  * `first_order_created_from_recommended_product`

---

## 🔗 7. Traza Discovery ➔ Delivery

* **Fase Lifecycle JPD:** **Wonder ➔ Explore**
* **Prototipo Recomendado:** Componente Hero en `dropshipper-lab/src/app/inicio/page.tsx`.
* **Próximo Paso:** Configurar el experimento Fake Door en la Home del lab para medir CTR con usuarios reales.
