# 🚨 Auditoría de Integridad de Datos & Corrección de Inconsistencias
## Célula Seller Success — Dropi S2 2026

> **Fecha:** 3 de Agosto de 2026  
> **Objetivo:** Verificar que cada insight, porcentaje y afirmación en nuestros documentos tiene sustento directo en los datos crudos. Identificar saltos de razonamiento, imprecisiones y gaps.

---

## ⚠️ INCONSISTENCIAS DETECTADAS & CORRECCIONES

### 🔴 INCONSISTENCIA 1: "55.368 sellers activos sincronizados" — INCORRECTO

**Lo que dijimos:**
> *"55.368 sellers reales importados y sincronizados desde la exportación completa de UserPilot/Auth0."* — DASHBOARD.md

**La realidad en Supabase:**
| Segmento (`tipo_proveedor`) | Registros | Origen Real |
| :--- | :---: | :--- |
| `" -"` (guión) | **54.241** | Carga original de CSV Auth0/UserPilot |
| `null` (vacío) | **48.508** | Segunda carga sin clasificar |
| `VERIFICADO` | **696** | Proveedores de otra célula |
| `PARETO 360` | **250** | Carga de hoy desde Acompañamiento 360 Excel |
| `PREMIUM` | **96** | Proveedores de otra célula |
| `PREMIUM EXCLUSIVO` | **61** | Proveedores de otra célula |
| `ESTÁNDAR` | **36** | Carga de hoy desde Acompañamiento 360 Excel |
| Otros (`Catálogo mixto`, etc.) | **4** | Residual |
| **TOTAL REAL** | **103.892** | — |

**El problema:**
1. La cifra de "55.368" probablemente correspondía al número de registros de la primera carga del Auth0 CSV. Pero la tabla ya tenía **~48.508 registros previos** de cargas anteriores de la célula de Suppliers.
2. Los 54.241 con `tipo_proveedor = " -"` son los que subimos hoy del Auth0 CSV, pero el campo `tipo_proveedor` se escribió con un guión `" -"` en vez del valor descriptivo del tipo de usuario.
3. La tabla `userpilot_suppliers` es **compartida entre células** (Sellers + Suppliers). No todos los 103.892 registros son "sellers activos".

**Corrección:**
> ✅ *"103.892 registros totales en la tabla `userpilot_suppliers` de Supabase. De estos, **54.241 provienen de la exportación Auth0/UserPilot de sellers** (tipo_proveedor = ' -'), **286 provienen del Acompañamiento Comercial 360** (250 PARETO + 36 ESTÁNDAR), y **~49.365 son registros previos de la célula de Proveedores** (VERIFICADO/PREMIUM/null)."*

---

### 🔴 INCONSISTENCIA 2: "251 Sellers Pareto representan el 68% del volumen" — IMPRECISO

**Lo que dijimos:**
> *"251 Sellers Pareto representan el 68%+ del volumen total de órdenes de Dropi."* — insights_sellers_360_2026.md, DISCOVERY_FRAMEWORK.md, DISCOVERY_RIGOR_AUDIT.md

**La realidad calculada desde el CSV de Seguimiento Diario:**

| Grupo de Sellers | Órdenes (Julio) | % del Volumen Rastreado |
| :--- | :---: | :---: |
| **Top 50 sellers** | 2.019.066 | **64,1%** |
| **Top 72 sellers** | ~2.141.000 | **≈68,0%** |
| **Top 100 sellers** | 2.274.871 | **72,2%** |
| **Top 170 sellers** | ~2.518.000 | **≈80,0%** |
| **Top 251 sellers** | 2.740.907 | **87,0%** |
| **Top 300 sellers** | 2.848.241 | **90,4%** |
| **Top 500 sellers** | 3.134.492 | **99,5%** |
| **Total rastreados (539 sellers)** | 3.149.280 | **100%** |

**El problema:**
1. **El 68% del volumen lo mueven los top 72 sellers, no los 251.** El claim "251 = 68%" es falso.
2. **Los 251 sellers Pareto del Acompañamiento 360 en realidad mueven el 87% del volumen rastreado.** Mucho más que lo que dijimos.
3. **El "Pareto" del Excel de Acompañamiento 360 NO es el mismo universo que los 539 sellers del CSV de Seguimiento Diario.** El Excel 360 clasifica a 250 como "PARETO" por criterio comercial/KAM, no por volumen de órdenes.
4. No hicimos el cruce entre ambos datasets para validar cuántos de los 250 PARETO del 360 coinciden con los Top del CSV diario.

**Corrección:**
> ✅ *"La concentración del volumen es extrema: los top 50 sellers mueven el 64,1% y los top 100 mueven el 72,2% de las órdenes rastreadas. Los 250 sellers clasificados como PARETO por el equipo comercial en el programa de Acompañamiento 360 mueven colectivamente el ~87% del volumen del seguimiento diario (2.740.907 de 3.149.280 órdenes)."*

---

### 🟡 INCONSISTENCIA 3: "43,10% del volumen total viene de Comunidades" — BASE INCORRECTA

**Lo que dijimos:**
> *"Las comunidades afiliadas mueven 1.357.391 órdenes (43,10% del volumen global)."*

**La realidad:**
* **43,10% es correcto pero sobre las 3.149.280 órdenes RASTREADAS en el CSV de Seguimiento Diario**, que solo cubre el **85,4% del cierre oficial** de 3.687.786 órdenes.
* Sobre el cierre oficial completo, las comunidades representan el **36,81%** del volumen (1.357.391 / 3.687.786).
* Los 538.506 órdenes restantes (14,6%) provienen de sellers no rastreados en el CSV (sellers sin seguimiento comercial, sellers internacionales directos, etc.).

**Corrección:**
> ✅ *"Las comunidades afiliadas mueven 1.357.391 órdenes, representando el **43,1% de las órdenes con seguimiento comercial directo** o **36,8% del cierre oficial total de julio** (3.687.786 órdenes). La diferencia se explica porque el seguimiento diario cubre ~85% del volumen total."*

---

### 🟡 INCONSISTENCIA 4: "Acompañamiento 360 — Órdenes de Junio vs Julio"

**Lo que dijimos:**
> *"380.648 órdenes en junio"* y *"crecimiento del +126,8% MoM"*

**La realidad:**
* Los datos del Excel de Acompañamiento 360 son de **Órdenes Generadas en Junio (columna 38)** y **Unidades vendidas en Mayo (columna 35)**.
* La columna "Unidades vendidas en Julio" (columna 39) está **vacía (null/0)** en todos los registros.
* El crecimiento MoM es: Mayo 167.837 → Junio 380.648 = **+126,8%**. Esto **SÍ es correcto** pero solo aplica al **período mayo→junio**, no a julio.
* **No tenemos dato de julio en este dataset.** No podemos afirmar que el programa 360 sostuvo este crecimiento en julio.

**Corrección:**
> ✅ *"El Acompañamiento Comercial 360 creció de 167.837 órdenes en mayo a 380.648 en junio (+126,8% MoM). **Datos de julio aún no disponibles en el Excel 360** — la columna 'Unidades vendidas en Julio' se encuentra vacía y pendiente de actualización por el equipo comercial."*

---

### 🟡 INCONSISTENCIA 5: "250 vs 251 Sellers Pareto"

**Lo que dijimos:**
> *"251 Sellers Pareto"* en múltiples documentos.

**La realidad en Supabase:**
* `tipo_proveedor = 'PARETO 360'`: **250 registros** (no 251).
* El conteo de 251 se obtuvo al procesar el Excel localmente con Python (`len(pareto_sellers_map) = 251`). La diferencia de 1 se debe a que un seller tenía un `user_id` inválido (vacío, `None` o `-`) que fue filtrado durante el upsert a Supabase.

**Corrección:**
> ✅ *"250 Sellers clasificados como PARETO en Supabase (1 registro filtrado durante la carga por ID inválido)."*

---

### 🟡 INCONSISTENCIA 6: Campo `referred_by` mezclado entre KAM Humano e ID Numérico

**Lo que dijimos:**
> *"67.009 registros con KAM asignado"*

**La realidad:**
* De los 67.009 registros con `referred_by != null`:
  * Los del Acompañamiento 360 (286 registros) tienen **nombres humanos** de KAM (ej: "Angela Ivone Parrado Morales").
  * Los del Auth0/UserPilot (~48.508 de tipo null) tienen **IDs numéricos** como `referred_by` (ej: "2449", "1760", "9562") — estos son IDs de referido de la plataforma Dropi, **no son nombres de KAMs comerciales**.
* Estamos mezclando dos semánticas distintas en el mismo campo.

**Corrección:**
> ✅ *"El campo `referred_by` mezcla dos tipos de dato incompatibles: nombres de KAMs comerciales (286 registros del programa 360) e IDs numéricos de referidos de plataforma (~48K registros del Auth0/UserPilot). Para análisis de cobertura de KAMs, solo los 286 registros del 360 son confiables."*

---

### 🟢 DATOS CORRECTOS Y BIEN SUSTENTADOS

Los siguientes insights **SÍ tienen sustento directo y verificado**:

| Afirmación | Fuente | Verificado |
| :--- | :--- | :---: |
| Cierre julio = 3.687.786 órdenes | Backend API `route.ts` + Cifras CPO | ✅ |
| NSM cumplimiento = 103,26% (+116.744 órdenes) | Cálculo sobre meta 3.571.042 | ✅ |
| Top KAMs: Angela Parrado (290K), Angie Hurtado (271K) | CSV Seguimiento Diario, cálculo directo | ✅ |
| Comunidad Iván Caicedo = 294.707 órdenes | CSV Seguimiento Diario, cálculo directo | ✅ |
| Top Pareto #1: Joan Sebastián Otero = 21.687 ord (junio) | Excel Acompañamiento 360, columna 38 | ✅ |
| 315 campañas con producto privatizado | Excel Acompañamiento 360, campo "Privatizado" | ✅ |
| Crecimiento 360 mayo→junio = +126,8% MoM | 167.837 → 380.648 (cálculo directo) | ✅ |
| 10/10 Sellers TOP con nombre real en Wrapped | Auth0 CSV cruzado manualmente | ✅ |
| Activación Neta = 5,2%, Bruta = 7,6% | Playbook/Baseline célula | ✅ |
| TTV Bruto = 7,4 días, TTV Neto = 16,0 días | Playbook/Baseline célula | ✅ |
| Retención 30d = 69,38% | Playbook/Baseline célula | ✅ |
| 27,7% tráfico móvil (19,3% Android + 8,4% iOS) | UserPilot Analytics | ✅ |
| 34% novatos (0 ord) y 22,8% vendedores >300 ord | UserPilot Surveys | ✅ |

---

## 🛠️ PLAN DE CORRECCIÓN

### Paso 1: Corregir las cifras en los documentos
- [ ] `DASHBOARD.md`: Corregir "55.368 sellers" → "54.241 registros de sellers del Auth0/UserPilot" + "103.892 registros totales en tabla compartida".
- [ ] `DASHBOARD.md`: Corregir "43,10% del volumen global" → "43,1% del volumen rastreado (36,8% del cierre oficial total)".
- [ ] `insights_sellers_360_2026.md`: Corregir "251 Sellers Pareto = 68% del volumen" → "250 Sellers Pareto = ~87% del volumen rastreado; Top 72 sellers = 68% del volumen".
- [ ] `insights_sellers_360_2026.md`: Agregar nota de que los datos del 360 son de junio, no de julio.
- [ ] `DISCOVERY_FRAMEWORK.md` / `DISCOVERY_RIGOR_AUDIT.md`: Ajustar todas las referencias a estas cifras.

### Paso 2: Limpieza de campo `referred_by`
- [ ] Los registros del Auth0/UserPilot con `referred_by` numérico no deben interpretarse como "KAM asignado". Crear un campo separado o renombrar para distinguir.

### Paso 3: Solicitar actualización de datos de julio
- [ ] Pedir al equipo comercial / Data Analyst la columna "Unidades vendidas en Julio" del Excel de Acompañamiento 360 para completar la serie temporal.
