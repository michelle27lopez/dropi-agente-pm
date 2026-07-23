# Direccionamiento — Logistic Success (+EcomScanner) · 2026 · S2

> **Síntesis** del direccionamiento de NUESTRA célula. Fuente de verdad (página viva):
> [Confluence 1485471746](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1485471746) ·
> autora **Maria Ossa**. Parte del [Marco Común](marco-comun-2026-s2.md) (leerlo primero).

| | |
|---|---|
| **Célula** | Logistic Success (+EcomScanner) — Logística (**Enabler**) |
| **Clientes** | Dropshippers · Brands · Proveedores · Transportadoras |
| **Ownership** | **La orden** — todo lo que le pasa a la orden una vez se crea en Dropi |
| **Periodo** | 2026 · S2 (Q3 + Q4) |
| **Dupla** | PM: **Juan Diego Bautista** · Product Designer: **Michel Pino** |
| **NSM de la célula** | **Tasa de entrega exitosa ≥ 70%** |

## Cómo opera la célula (así se lee este doc)
1. **Terminar el Delivery Backlog heredado.** A medida que se cierran, entran los nuevos que proponga la célula.
2. **En paralelo, product discovery:** cómo mover los KPIs asignados en función del OKR principal.
3. **Del discovery salen oportunidades** que se exploran en el Product Backlog. Saber qué trabajar primero.

**Tableros en Jira (PRM · Polaris):**
[Product Backlog](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525502) ·
[Repositorio de ideas](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525526) ·
[Delivery backlog](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11505515).

## 1. Propósito y core
**Logística como producto.** Dos líneas: **Logística** y **EcomScanner**. **Dueño directo de la tasa de entrega.**
La célula es dueña de **la orden** y mantiene la narrativa completa de todo lo que le pasa una vez se crea
(otras células coordinan antes de intervenir ese flujo).

## 2. Visión de producto (tres lentes) — *a construir (Product Backlog)*
Armar qué ofrecemos como **producto logístico**, uniendo **fulfillment, bodegas y EcomScanner**.
- **Por perfil:** qué resuelve la logística para dropshipper, marca, proveedor, transportadora.
- **Por nivel de madurez:** qué necesita la operación de un usuario Iniciando/Consolidando/Escalando.
- **Por etapa de la cadena:** qué resuelve cada pieza (Core, Stock Pro, Ecom Scanner, CAS, Veloces, Atom, fulfillment, bodegas) y dónde están los gaps.

## 3. Enfoque por trimestre
**Q3 y Q4 — sostener y mejorar la tasa de entrega** (dueño directo) y **reducir el tiempo de la orden hasta la transportadora.**

## 4. Los dos backlogs
Se ordena por estado (en ejecución vs. en validación). El tipo (heredado · junta OKR · represado) es una
etiqueta dentro de cada backlog. Una oportunidad gradúa **Product → Delivery** al pasar **Gate 2 (Dropi Score)**.
Cap: **2–3 oportunidades activas**.

### Delivery Backlog — aprobado, en ejecución
| Proyecto | Tipo | Estado | Ticket |
|----------|------|--------|--------|
| Optimización de selección de transportadoras | Junta directiva (OKR) | **EJECUTAR** | [PRM-1513](https://dropi-it.atlassian.net/browse/PRM-1513) |
| Same Day (proveedores, marcas y fulfillment) | Junta directiva (OKR) | **EJECUTAR** | [PRM-1366](https://dropi-it.atlassian.net/browse/PRM-1366) |
| Herramienta preventiva/predictiva de novedades · Notificaciones · Predicción de entrega con AI | Junta directiva (OKR) | **FINALIZAR** · *alinear con Seller Success (módulo de notificaciones)* | [PRM-1512](https://dropi-it.atlassian.net/browse/PRM-1512) |
| Normalización de estados | Represado (remapeado) | **EJECUTAR** | [PRM-1297](https://dropi-it.atlassian.net/browse/PRM-1297) |
| Validación de direcciones (países) | Represado (remapeado) | **EJECUTAR** | [PRM-91](https://dropi-it.atlassian.net/browse/PRM-91) |

### Product Backlog — oportunidades a validar (discovery)
Checklist **obligatorio** (todos se validan; avanzan Wander → Explore → Make → Impact).
Antes de explorar, revisar el [Repositorio de ideas](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525526) (ideas/insights previos).
- [ ] **Primera medición de KPIs y definición de meta** *(wander)* — medir el estado actual de los KPIs de la célula y definir la **meta objetivo con Dirección de Producto**.
- [ ] **Cronograma de ejecución de Q3 (Jul–Sep)** *(arranque)* — qué se finaliza/ejecuta del Delivery y en qué orden + primeras oportunidades del Product Backlog, con **responsables y fechas**. (Q4 se planifica al cierre de Q3.)
- [ ] **Visión de producto logístico** *(represado · validar)* — fulfillment + bodegas + EcomScanner. Deliverable y fecha **TBD**.

## 5. OKRs y KPIs
- **OKR de compañía:** OKR 2 — **Tasa de entrega promedio ≥ 70% (KR2.1).** Somos **dueños directos**.
  *(El core lo refiere como KR2.2 — confirmar numeración. TBD.)*
- **KPI de célula Q3/Q4:** **Tiempo de la orden hasta la transportadora ≤ 24h** desde la creación.
  ⚠️ *Confirmar dirección del umbral: el insumo original decía "≥ 24h" → como está, se contradice.*

## 6. Equipo y roles
| Rol | Persona |
|-----|---------|
| Product Manager | **Juan Diego Bautista** |
| Product Designer | **Michel Pino** |
| Owner tech | Kevin Fory · Marcos Amado |
| Project lead tech | José Giraldo |
| Front | Johan Palacio |
| Back | Víctor Orobio · Álvaro Romero · Daniel Pozo |
| Growth | Maria Ossa |
| Growth Ops | Juan Camilo Rojas |
| Comunicaciones | María José Calderón |
| Áreas aliadas | Logística · Legal |

## Notas de cruce con el cerebro
- Mapeo Delivery Backlog ↔ `proyectos/_index.md`: **PRM-1513** ≈ *Sistema Inteligente Transportadoras* ·
  **PRM-1512** ≈ *Notificaciones Prevención de Devoluciones* · **PRM-91** ≈ *Validación de direcciones* ·
  **PRM-1366** (Same Day) y **PRM-1297** (Normalización de estados) son nuevos respecto al índice → crear carpeta si arrancan.
- **Tarifas / monetización del flete** vive en OKR 3 de compañía (no en el Delivery Backlog de esta célula),
  pero es proyecto activo de Juan → ver `proyectos/parametrizacion-tarifas/`.
