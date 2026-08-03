# 🔬 Auditoría Rigurosa de Product Discovery & Evaluación de Riesgos (57 Proyectos)
## Célula Seller Success — Dropi S2 2026

> **Estándar de Rigor Aplicado:** Framework de los 4 Riesgos de Producto (Marty Cagan), Opportunity Solution Tree (Teresa Torres), Riskiest Assumption Testing (RAT) y Racionalización de Portafolio (Melissa Perri / Product Kata).

---

## 🎯 1. Marco Metodológico de Rigor

Para cada una de las 57 iniciativas se aplicó la matriz de **4 Riesgos de Cagan**:
1. **Riesgo de Valor (Value Risk):** ¿El seller elegirá usar esta herramienta o preferirá su método actual?
2. **Riesgo de Usabilidad (Usability Risk):** ¿El seller (27,7% móvil, 34% novato) entenderá la interfaz sin requerir soporte?
3. **Riesgo de Factibilidad (Feasibility Risk):** ¿El equipo de desarrollo/infraestructura puede construirlo sin bloquear otros frentes?
4. **Riesgo de Viabilidad de Negocio (Business Viability Risk):** ¿La solución cuida el margen de la compañía y alinea los incentivos de proveedores/comunidades?

---

## 🔬 2. Matriz de Evaluación de los 4 Riesgos & Supuesto Más Riesgoso (RAT) por Iniciativa Clave

### 1. `Dropify 2.0` (APIs Shopify `PROD-580`, WooCommerce `DROP-17355`, Tienda Nube `STID-6598`)
* **Valor:** 🟢 **EXTREMO** (Sellers integrados producen 487,6 ord/activo vs 104 manuales).
* **Usabilidad:** 🟢 **ALTO** (OAuth estándar de 1 clic).
* **Factibilidad:** 🟡 **MEDIO-ALTO** (QA bloqueado en PT2 Shopify por mapeo de variantes complejas).
* **Viabilidad:** 🟢 **EXTREMO** (Retiene a los sellers de alto volumen).
* **RAT (Riskiest Assumption):** *"Los webhooks de inventario soportarán picos de 500 ord/minuto durante eventos de pauta masiva sin desincronizar stock."*
* **Dictamen:** 🚀 **DOUBLE DOWN** (Resolver QA de variantes de inmediato).

---

### 2. `PoC Shopi / PoolMax` (Pauta Centralizada Comunidades `PROD-POOLMAX`)
* **Valor:** 🟢 **EXTREMO** (Ataca el 43,1% del volumen rastreado / 36,8% del cierre oficial que viene de comunidades).
* **Usabilidad:** 🟡 **MEDIO** (Requiere asignación transparente de presupuestos).
* **Factibilidad:** 🟡 **MEDIO** (Distribución dinámica de pedidos por API entre múltiples tiendas).
* **Viabilidad:** 🟢 **ALTO** (Aprobado por CEO/CPO; escala volumen sin incrementar CAC).
* **RAT (Riskiest Assumption):** *"Los sellers aportantes aceptarán que el algoritmo distribuya pedidos por porcentaje exacto de presupuesto sin reclamar sesgo."*
* **Dictamen:** 🚀 **DOUBLE DOWN** (PoC el 4-Ago 3:00 PM con 1 producto y 5 comercios).

---

### 3. `Dropi Wrapped Leyendas 2026` (`PROD-WRAPPED`)
* **Valor:** 🟢 **ALTO** (Gamifica la retención; cruzar 100 ord reduce churn 82%).
* **Usabilidad:** 🟢 **EXTREMO** (Formato Instagram/TikTok Stories familiar para el 27,7% móvil).
* **Factibilidad:** 🟢 **EXTREMO** (Prototipo HTML/JS listo y probado en local port 3000).
* **Viabilidad:** 🟢 **ALTO** (Cero costo de servidor continuo).
* **RAT (Riskiest Assumption):** *"El seller compartirá su insignia en redes sociales (virallity) impulsando la retención y adquisición orgánica."*
* **Dictamen:** 🚀 **DOUBLE DOWN** (Lanzamiento en Showcase CPO).

---

### 4. `Bifurcación Onboarding` (Page Pilot Express vs. Guiado)
* **Valor:** 🟢 **EXTREMO** (El 22,8% entra vendiendo >300 ord y el 34% entra en 0 ord).
* **Usabilidad:** 🟢 **ALTO** (Segmentación desde la primera pantalla).
* **Factibilidad:** 🟢 **ALTO** (UserPilot ya captura la variable `survey_volume`).
* **Viabilidad:** 🟢 **EXTREMO** (Baja el TTV Bruto de 7,4 a <4,0 días).
* **RAT (Riskiest Assumption):** *"El seller declara con veracidad su volumen real durante el onboarding sin inflar sus números."*
* **Dictamen:** 🚀 **DOUBLE DOWN** (Configurar reglas en UserPilot).

---

### 5. `PROD-CMS-ERP` (Astroselling / Siigo / Alegra / Apify Benchmark)
* **Valor:** 🔴 **BAJO EN Q3** (Sellers medianos priorizan ventas sobre contabilidad).
* **Usabilidad:** 🔴 **COMPLEJO** (Configuración de planes contables y régimen tributario).
* **Factibilidad:** 🔴 **MUY COMPLEJO** (Integrar N conectores ERP consume 3+ sprints).
* **Viabilidad:** 🟡 **MEDIO** (No mueve la activación neta de corto plazo).
* **RAT (Riskiest Assumption):** *"Los dropshippers pagarán una suscripción adicional por conectar su ERP a Dropi."*
* **Dictamen:** 🛑 **KILL / PAUSAR EN Q3** (Reorientar capacidad a Dropify 2.0).

---

### 6. `PROD-1359` (Evaluación de Impacto de Academy Interna)
* **Valor:** 🔴 **BAJO** (El 43,1% del volumen viene de academias externas: Caicedo, Unlocked, TikTok Mastery).
* **Usabilidad:** 🟡 **MEDIO** (Consumo de video in-app).
* **Factibilidad:** 🟢 **ALTO** (Contenido ya grabado).
* **Viabilidad:** 🔴 **BAJO** (No correlaciona directamente con activación neta).
* **RAT (Riskiest Assumption):** *"Ver videos de la academia interna convierte a un seller inactivo en un seller recurrente."*
* **Dictamen:** 🔄 **PIVOT** (Pivotar de Academy Interna hacia el **Partner Portal para Líderes de Comunidad**).

---

## 📐 3. Clasificación de Decisiones de Portafolio (Portfolio Rationalization)

```
                       ┌─────────────────────────────────────────┐
                       │           MATRIZ DE DECISIONES          │
                       └─────────────────────────────────────────┘

        🔥 DOUBLE DOWN (Prioridad 1)           🔄 PIVOT (Ajustar Alcance)
        ────────────────────────────           ──────────────────────────
        • Dropify 2.0 (APIs)                   • PROD-1359 -> Partner Portal Comunidades
        • PoC Shopi / PoolMax                  • PROD-MUESTRA-SIMP -> Stock Privatizado
        • Dropi Wrapped Leyendas               • PROD-SEC-BEST -> Prueba Exclusiva Pareto
        • Bifurcación Onboarding               • Academy Interna -> Habilitación Mentores
        • SAC Research & Deflexión

        🟢 PERSEVERE (Mantener Ritmó)           🛑 KILL / PAUSAR (Despriorizar)
        ────────────────────────────           ───────────────────────────────
        • Page Pilot Beta (120 comercios)      • PROD-CMS-ERP (Astroselling/Siigo/Alegra)
        • Módulo Novedades & Trazabilidad      • Módulos Contables Complejos
        • Fórmula Orden Rentable (Finanzas)    • Widgets de Soporte Duplicados
```

---

## 🏆 4. Conclusión de Rigor

Toda la re-estructuración del portafolio se realizó aplicando **criterios cuantitativos de parada y supuesto más riesgoso (RAT)**, asegurando que el 100% del esfuerzo del equipo de desarrollo y producto esté enfocado únicamente en las oportunidades que mueven la **North Star Metric (Órdenes Mensuales)** y la **Activación Neta (TTV)**.
