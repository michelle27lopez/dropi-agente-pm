# 🗂️ Categorización de proyectos — Logistic Success

> Tablero de trabajo del playbook `metodologia/discovery-y-categorizacion.md`. Categoriza el roadmap
> por **la ORDEN** (criterio de Juan 24-jun: *logística = dueño de la orden; entra por CONTENIDO, no por el
> campo Célula/Dominio de Jira*). Fuentes: `reportes/auditoria-roadmap-lsc.md` (17 ideas + fill-rate) ·
> `estrategia/` (OKR) · specs de cada proyecto. **Última actualización: 2026-06-24.**

## OKR / NSM de la célula (contexto)
- **Ownership:** *la orden — todo lo que le pasa una vez se crea en Dropi.* Célula = **Enabler**, dueño directo de la tasa de entrega.
- **NSM:** **OKR2 · Tasa de entrega exitosa ≥ 70%** *(numeración KR2.1 vs KR2.2 = TBD).*
- **KPI del semestre:** **tiempo de la orden hasta la transportadora ≤ 24h** *(dirección del umbral por confirmar).*
- OKRs de compañía: **OKR1** escalar volumen (KR: 9.6M órdenes · GMV $3.74B) · **OKR2** multi-país (KR2 entrega ≥70% ⬅ nuestro) · **OKR3** eficiencia/rentabilidad (KR1 gross margin ≥22%).

**Leyenda** — Fuga: ① churn pre-red · ② COD/devolución · ③ stock-out · ④ posventa rota · ⬚ habilitador/medición.
Etiqueta: 🔵 nuevo/estratégico · 🔴 heredado/finalizar · 🟡 OKR · 🟣 KPI. Estado Delivery: **EJECUTAR / FINALIZAR**.

## Tablero por etapa de la cadena de la orden
> El criterio "la orden" se aplica por **contenido**: incluye trabajo etiquetado en otras células si toca la orden (marcado ⤴).

### 1 · Creación (nace la venta)
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Notas |
|---|---|---|---|---|---|
| Mis pedidos / crear-editar órdenes ⤴ | PRM-1245 · 1306 | Mejora Exp (upstream) | ① | OKR1 volumen | gestión de orden aguas arriba; logística por contenido (debatible) |

### 2 · Confirmación (dirección/datos correctos → evita errores) — **fuga ① la más grande**
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Spec |
|---|---|---|---|---|---|
| **Validación y normalización de direcciones** | PRM-91 (+1218⤴, 1341 MX) | Represado · **EJECUTAR** · 🟡 | ① | entrega ≥70% | [spec](validacion-normalizacion-direcciones/spec.md) · taller 24-jun |
| Predicción de devoluciones / panel transportadoras ⤴ | PRM-1328 (hub PRM-203) | Seller→**LSC** (reclasif. 24-jun) | ①② | entrega | — |
| Estados con AI | PRM-749 | — | ⬚ | tiempo fases | — |

### 3 · Preparación (guía, picking, packing, hand-off al carrier) — **bloque más fuerte**
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Spec |
|---|---|---|---|---|---|
| **Sistema Inteligente de Selección de Transportadoras** (PM Kate; Juan=Carrier Ops) | PRM-1513 · DROP-17946 | Junta OKR · **EJECUTAR** · 🟡 | ② | entrega ≥70% (OKR1/2/3) | [spec](sistema-inteligente-transportadoras/spec.md) |
| **Parametrización de tarifas** | PRM-1362 · 1446 (→1510) | activo (Juan) · 🟡 | — | **OKR3 gross margin ≥22%** | [spec](parametrizacion-tarifas/spec.md) |
| Generación de guías | PRM-1469 | — | ① | entrega | — |
| Integración de carriers | PRM-1265 · 1309 (→1499) | — | — | OKR2 multi-país | (+ Validación Transportadora) |
| Ecom Scanner (cobertura guías / productividad) | PRM-1287 · 1289 (Ecom) | Ecom | ① | movilización | — |

### 4 · Movilización (+ recaudo COD) — **gaps fuertes aquí**
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Spec |
|---|---|---|---|---|---|
| **Same Day** (proveedores, marcas, fulfillment) | PRM-1366 (→1514) | Junta OKR · **EJECUTAR** · 🟡 | — | entrega + tiempo fases | [spec](same-day/spec.md) |
| **Normalización de estados** | PRM-1297 | Represado · **EJECUTAR** · 🟡 | ⬚ | **habilita tiempo por fases** | [spec](normalizacion-estados/spec.md) |
| Novedades (preventiva/gestión) | PRM-1361 · 1365 | — | ②④ | entrega | — |
| Activación CAS carriers (MX·Starken·TIUI) ⤴ | PRM-1386·1471·1473 | Backoffice/CAS | — | OKR2 multi-país | onboarding carrier (más soporte) |
| 🔴 **COD / recaudo / conciliación** ⤴ | PRM-1283 · 1209 (Backoffice) | Financiero | ② | **COD = valor Dropi** | **no se mueve como frente logístico → revisar** |

### 5 · Entrega + posventa (recibe · garantías · devolución · recompra)
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Spec |
|---|---|---|---|---|---|
| **Notif. Prevención de Devoluciones / predicción de entrega AI** | PRM-1512 | Junta OKR · **FINALIZAR** · 🟡 | ②④ | entrega ≥70% | _por crear_ (alinear c/ Seller Success) |
| Pruebas de entrega | PRM-1364 (→1517) | — | ② | entrega | — |
| **Guías reemplazatorias** (Ecom Scanner) | PRM-745·1380·1381 | dev beta · ✅ ordenado | ②④ | entrega | [spec](guias-reemplazatorias/spec.md) |
| Devoluciones (logística inversa) | PRM-1363 · 1263 · 1288 (Ecom) | — | ②④ | entrega | (dedupe 1263↔1288) |
| Rediseño módulo de garantías ⤴ | PRM-1294 (Backoffice) | — | ④ | — | logística inversa (debatible) |

### Transversal · Medición / North Star
| Proyecto | Jira | Tipo/Estado | Fuga | KR/NSM | Notas |
|---|---|---|---|---|---|
| Cierre diario · seguimiento transportadoras ⤴ | PRM-1082 (Backoffice) | Backoffice | ⬚ | **North Star (SLA por ruta, tiempos)** | logística por contenido; **mover/anclar** |
| Tableros KPIs (gerencia / CAS) | PRM-1185 · 1268 | Data/Backoffice | ⬚ | medición | soporte/data |

### Catálogo / pre-orden (no-core de la célula)
| Proyecto | Jira | Notas |
|---|---|---|
| Combos CAS + lectura Ecom | PRM-1568 · 1467 | apoyo a **Supplier** (Jaime); [spec](combos/spec.md) |

## 🔴 Gaps del roadmap (del audit, con el criterio de la orden)
1. **NO existe proyecto de "tiempo de entrega por fases"** = la métrica norte/KPI del semestre. Lo más cercano (PRM-1082) está en Backoffice. → **candidato #1 a crear** ("Torre de control por etapa de la orden").
2. **Movilización** no la nombra ningún proyecto como objetivo directo (aunque es media NSM).
3. **COD / recaudo / conciliación** existe pero **disperso en Backoffice** (1283/1209), no se trabaja como frente logístico — y **COD = el valor de Dropi**.
4. **Fill-rate muerto:** `Aporte a NSM` 0/28 · `Cronograma inicio/fin` 0/28 (por eso el roadmap no tiene línea de tiempo) · `OKR Ppal` vacío en ~15 · `Etapa Delivery` vacío en 5.

## ▶️ Próximos pasos
- [ ] **Crear el proyecto de la métrica norte** (tiempo de entrega por fases) — gap #1.
- [ ] Poblar campos de roadmap: `OKR Ppal` + `Aporte a NSM` + `Cronograma` en los proyectos activos (hoy vacíos).
- [ ] Decidir el frente **COD/recaudo** (¿lo asume logística o se coordina con Backoffice?).
- [ ] Bajar **árbol→rutas→experimentos→data** a los EJECUTAR (Same Day, Normalización, Direcciones) con el playbook.
