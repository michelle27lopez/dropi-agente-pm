# 🗓️ Organización Semanal — Célula Seller Success (Darwin)

> **Semana de referencia:** 3 – 7 de Agosto 2026 (zona America/Bogota).
> **Foco Semanal:** Consolidación de entregables TI (WooCommerce + Tienda Nube), avance en Discovery SAC / Experimentos UX, y preparación del **Weekly Product (Showcase 5 min con CPO María Ossa)**.

---

## 🔄 El Sistema de Rituales Semanales

Tomando las mejores prácticas de las células con mayor madurez en Dropi (como Logística), el ritmo semanal de Seller Success se estructura en un ciclo de 4 hitos:

| Ritual | Cadencia | Objetivo / Entregable | Responsable |
|---|---|---|---|
| 🎯 **Planning Semanal Seller** | Lun (o Mar si es festivo) | Alineación semanal del equipo Seller Success: foco, asignación de tareas y entregables de la semana. | PM (Santiago) + Célula |
| 🔄 **Daily Seller Success** | Mar–Vie (o Mié–Vie si festivo) | Sincronización diaria rápida de avances, impedimentos y foco del día (todos los días excepto el día de Planning). | Célula Seller Success |
| 💻 **Weekly TI (Tech)** | Mar 3:00 PM *(varía seg. disp.)* | Sincronización técnica con Jose Giraldo (Tech Lead): estado de WooCommerce (entrega 4-ago), bugs Tienda Nube (`STID-6598`) y QA Dropify Shopify (`PROD-580`). | PM (Santiago) + Jose Giraldo (Tech) |
| 🤝 **Cell Board Seller** | Mié 2:00 PM | Ideación, revisión de mocks UX (Muestras 1-clic, Wrapped x Leyendas), triaje SAC y repartición de tareas. | PM (Santiago) + Designer (Alejandra Melo) |
| 📊 **Weekly Product (CPO Showcase)** | Vie 11:00 AM | Presentación ejecutiva de **5 minutos** con María Ossa (CPO) centrada en Dashboard de KPIs + Avances + Decisiones. | PM (Santiago) |
| 📲 **Reporte Semanal de Estado** | Vie 5:00 PM | Sintetizado en formato listo para enviar a stakeholders (WhatsApp / Slack). | PM (Santiago) |

---

## ⏱️ Estructura del Pitch de 5 Minutos con la CPO (Viernes)

Dado que solo disponemos de **5 minutos en el Weekly de Producto**, el espacio se divide estrictamente en 3 bloques cronometrados:

```
┌────────────────────────────────────────────────────────────────────────┐
│  SHOWCASE SELLER SUCCESS (5 MINUTOS CON CPO MARÍA OSSA)                │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 📊 Min 0:00 - 2:00 (2 min)      │ DASHBOARD DE KPIs & METAS S2        │
│                                  │ • KR 1.1: 3.35M ord/mes vs 7.8M     │
│                                  │ • Activación Neta: 5.2% vs 8.0%     │
│                                  │ • TTV Neto: 16.0d vs <12.0d         │
│                                  │ • Retención 30d: 69.4% vs 75.0%     │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 🚀 Min 2:00 - 4:00 (2 min)      │ AVANCES DE PROYECTOS & EXPERIMENTOS │
│                                  │ • WooCommerce + Tienda Nube (Dev)   │
│                                  │ • Page Pilot V1 (Piloto 120 users)  │
│                                  │ • Mock Muestras 1-Clic & SecondBest │
│                                  │ • Hallazgos Discovery SAC (3.6k tqs)│
├──────────────────────────────────┼─────────────────────────────────────┤
│ 🚦 Min 4:00 - 5:00 (1 min)      │ DECISIONES & GATES DE LA CPO        │
│                                  │ • Rebranding Dropify                │
│                                  │ • Integración Help Center & SAC     │
│                                  │ • Condicionador Órdenes en Alerta   │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 📅 Agenda & Entregables Día a Día (3 – 7 Ago 2026)

### 📌 Lunes 3-Ago: Planning Semanal & Discovery SAC
- [ ] ⭐ **Planning Semanal Seller Success (con Célula):** Alineación de prioridades, asignación de tareas de la semana y coordinación de entregables.
- [x] ⭐ **Correo PoC Shopi (Finanzas & CPO):** Enviado a Mónica González (Financial Manager), Nicolás Martínez (Financial Analyst) y Maria (CPO) con asunto *"Prueba de Concepto Shopi (Distribución Automática de Ventas) – Explicación y Solicitud de Presupuesto"*.
- [ ] **Data & SAC:** Avanzar en el reporte de Discovery analizando los 3.664 tickets de SAC (`ml_ia.patrones`) para estructurar los cuellos de botella en Wallet y Catálogo (`PROD-SAC-RESEARCH`).
- [ ] **Métricas:** Revisar datos actualizados de Activación Neta (5.2%) y TTV Neto (16d) en producción para preparar el corte semanal del Dashboard.
- [ ] **Demo Interna Dropify:** Ajustar preparación del flujo multitienda para demo interna.

### 📌 Martes 4-Ago: Weekly TI, PoC PoolMax & Cierre Tech
- [ ] ⭐ **3:00 PM — Sesión de Revisión PoC PoolMax (con Arlex / Shopi & Founder PoolMax):**
  - **Contexto:** Evaluación de la herramienta de distribución automática de pedidos vía API desde campañas centrales (Meta/TikTok) hacia tiendas Shopify/Shopi según el presupuesto publicitario aportado por cada seller ($1M, $2M, etc.), procesando luego la confirmación y despacho en Dropi vía Dropify.
  - **Objetivo:** Auditar funcionamiento en vivo y definir factibilidad técnica y operativa para correr la PoC en Shopi sin errores ni fricciones de trazabilidad.
- [ ] ⭐ **4:00 PM — Weekly TI (con Jose Giraldo - Tech Lead):** *(Ajustado a las 4:00 PM esta semana para no interferir con la PoC de Shopi)*
  - Validar entrega final de **WooCommerce** (`DROP-17355`, fecha fijada 4-ago).
  - Coordinar asignación de dev para **Tienda Nube** (6 bugs, `STID-6598`).
  - Revisar estatus de QA de **Dropify Shopify** (`PROD-580`).
- [ ] **Page Pilot:** Verificar despliegue del feature flag `PROD-1516` en producción para el cohorte de 120 usuarios del piloto.

### 📌 Miércoles 5-Ago: Cell Board & Alineación UX/UI
- [ ] ⭐ **2:00 PM — Cell Board Seller Success:**
  - Revisar avances de UX/UI con Alejandra Melo: Muestras 1-clic (`PROD-MUESTRA-SIMP`) y Mock Wrapped unificado con Leyendas.
  - Revisar resultados de guerrilla testing de Enrutamiento Dinámico / Second Best (5 sellers).
  - Consolidar insumos de la semana para la plantilla del Weekly del Viernes.

### 📌 Jueves 6-Ago: Ensamblaje del Showcase & Dashboard
- [ ] **Dashboard Update:** Congelar los números de indicadores al corte del jueves (Órdenes acumuladas, Activación, TTV, Retención 30d).
- [ ] **Diapositivas / One-Pager Showcase (5 min):** Armar la vista ejecutiva para María Ossa con los 3 bloques (KPIs, Hitos, Decisiones).
- [ ] **Rebranding Dropify:** Revisar benchmark de nombres comerciales propuestos.

### 📌 Viernes 7-Ago: Weekly Product (Showcase) & Reporte Cierre
- [ ] ⭐ **11:00 AM – 12:30 PM — Weekly Product (Showcase CPO):**
  - Presentar en **5 minutos** el estado de la célula a María Ossa + CPO office.
  - Recoger decisiones sobre Rebranding Dropify y Help Center / Alertas.
- [ ] ⭐ **5:00 PM — Reporte Semanal (WhatsApp / Stakeholders):**
  - Generar y enviar el resumen semanal a stakeholders clave (CEO, CPO, Tech Leads).

---

## 📊 Plantilla de Presentación para el Weekly Product (5 min)

```markdown
# 🚀 Showcase Seller Success — Weekly Product (Corte 7-Ago 2026)

### 1. Dashboard de Indicadores (2 min)
- **OKR 1 / KR 1.1 (Compañía):** 3.35M / 7.8M ord/mes (42.9% de meta)
- **NSM Célula:** 3.35M / 3.57M ord/mes (97.5% cumplimiento)
- **Tasa Activación Neta:** 5.2% (Meta S2: 8.0% | Gap: -2.8 pp)
- **Mediana TTV Neto:** 16.0 días (Meta S2: < 12.0 días | Gap: +4.0 días)
- **Retención 30d:** 69.4% (Meta S2: 75.0% | Gap: -5.62 pp)

### 2. Hitos & Avances de la Semana (2 min)
- 🚀 **WooCommerce:** Entrega final completada y validada con TI.
- 📦 **Page Pilot V1:** Piloto activo con 120 usuarios en producción (`PROD-1516`).
- 🎨 **Muestras 1-Clic & Wrapped x Leyendas:** Mocks UI listos para QA de usuario.
- 🔍 **Discovery SAC:** Clasificación de 3.6k tickets — Wallet (consultas de saldo/retiro) identificada como fuga #1 de atención.

### 3. Decisiones / Gates Requeridos de CPO (1 min)
- 🚦 **Rebranding Dropify:** Aprobar nombre final entre las 3 opciones de benchmark.
- 🚦 **Help Center / Alertas:** Confirmar unificación de guías in-app con la Biblia AI de SAC.
```
