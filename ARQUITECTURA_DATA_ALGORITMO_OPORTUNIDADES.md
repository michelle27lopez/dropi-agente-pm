# 🏛️ Proyecto: Arquitectura de Datos para el Algoritmo de Oportunidades Dropi
## *Blueprint de Data Science, Ingesta Continua y Feature Store Minimalista*

> **Documento:** `ARQUITECTURA_DATA_ALGORITMO_OPORTUNIDADES.md`  
> **Estado:** Propuesta Técnica / En Aprobación  
> **Autores:** Product Management (Brands & Seller Success) + Darwin Data Intelligence  
> **Destinatarios:** Jaime Guevara, Miguel Ángel (Data Analyst), José Giraldo (Tech Lead), María Ossa (CPO)  
> **Fecha:** Septiembre 2026  

---

## 1. Visión y Propósito Estratégico

### 1.1. El Norte: De un "Buscador Pasivo" al "Motor de Matching Bi-direccional"
Hoy Dropi opera como un catálogo abierto donde los dropshippers y marcas buscan manualmente entre miles de referencias y la plataforma destaca productos por volumen bruto ("Winners"). 

Esta dinámica genera tres fallas de mercado estructurales:
1. **Canibalización de subasta:** 200 dropshippers pautan exactamente el mismo video y producto en Meta Ads, disparando el Costo por Adquisición (CPA) hasta que nadie es rentable.
2. **Quiebre de stock y desbalance:** El proveedor del producto popular colapsa operativamente, mientras que cientos de otros proveedores confiables quedan huérfanos sin ventas.
3. **Muerte prematura de novatos:** Los emprendedores sin capital compiten en desventaja directa contra anunciantes agresivos y abandonan Dropi en sus primeros 14 días.

**El Futuro que estamos construyendo:**  
Un **Algoritmo de Oportunidades Bi-direccional (Two-Sided Opportunity Matching Engine)** que entrega a cada actor su mejor jugada:
* **Al Dropshipper / Marca:** Le recomienda productos con alta probabilidad de conversión ($P(\text{éxito})$), margen neto real protegido y bajo nivel de saturación publicitaria, adecuados a su experiencia y presupuesto.
* **Al Supplier (Proveedor):** Le identifica vacíos de mercado (*Gaps*) y le conecta demanda calificada con capacidad real de venta para su inventario sin quebrar stock.

### 1.2. El Imperativo de Data Science
Un algoritmo de este calibre **no se puede alimentar con la forma en que hoy se manejan los datos**. Requiere rigor en la pureza de las variables, inmutabilidad temporal y sincronía estricta entre cómo se entrena el modelo y cómo se sirve la recomendación en vivo.

---

## 2. Diagnóstico Técnico: Las 4 Malas Prácticas Actuales

Tras auditar las entrañas del repositorio (`hub/`, `supabase/`, `investigador/`), identificamos cuatro riesgos letales que harían colapsar cualquier modelo de Machine Learning en producción:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 LOS 4 RIESGOS DEL MANEJO ACTUAL                                 │
├─────────────────────────┬───────────────────────────────────┬───────────────────────────────────┤
│ Síntoma en el Código    │ Causa Raíz                        │ Impacto en el Algoritmo / ML      │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 1. Training-Serving     │ Miguel calcula métricas en        │ Las variables divergen. El modelo │
│    Skew                 │ BigQuery/Python; Next.js calcula  │ aprende con una distribución y en │
│                         │ en TypeScript con `ALIAS_MAP`.    │ producción recibe otra distinta.  │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 2. Temporal Data        │ Tablas como `userpilot_suppliers` │ El modelo "hace trampa viendo el  │
│    Leakage              │ guardan solo el estado de hoy     │ futuro" al entrenar. En frío con  │
│                         │ (`real_orders_delivered`).        │ usuarios nuevos, falla al 100%.   │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 3. Upserts              │ Webhooks hacen `upsert({          │ Se destruye la serie de tiempo.   │
│    Destructivos         │ onConflict: 'user_id' })`.        │ No podemos medir aceleración ni   │
│                         │                                   │ velocidad de crecimiento.         │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 4. Ausencia de Data     │ Diccionario permisivo de 40 alias │ Los datos basura entran de forma  │
│    Contracts            │ en `route.ts` que adivina nombres │ silenciosa sin que nadie alerte   │
│                         │ de columnas de Data.              │ del error en la ingesta.          │
└─────────────────────────┴───────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. La Nueva Arquitectura de Datos (One Store, Two Reads)

Sin contratar infraestructura externa costosa ni clústeres complejos, implementaremos la arquitectura estándar de marketplaces modernos (**Uber Michelangelo / Airbnb Zipline / Feast**) sobre nuestra infraestructura actual: **Next.js + Supabase Postgres + Zod + DuckDB + R**.

```
                           [FUENTES DE DATOS]
                 (Dagster / Scripts de Data / Telemetría)
                                    │
                                    ▼ (POST HTTPS con Bearer Token)
┌───────────────────────────────────────────────────────────────────────────┐
│              CAPA 1: DATA CONTRACTS EN LA FRONTERA (Next.js)             │
│   • Validación estricta con Schemas Zod (Rechazo HTTP 422 si no cumple)  │
│   • Tipado estático sincronizado TypeScript ↔ Postgres                     │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼ (INSERT Append-Only)
┌───────────────────────────────────────────────────────────────────────────┐
│             CAPA 2: REGISTRO INMUTABLE DE EVENTOS (Supabase)             │
│   • Tabla: marketplace_feature_log (Append-Only, nunca hace UPDATE)       │
│   • Columnas: entity_id, entity_type, feature_payload (JSONB), timestamp  │
│   • Particionamiento e índices por (entity_id, event_timestamp DESC)      │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
┌─────────────────────────────────────┐   ┌─────────────────────────────────┐
│     CAPA 3A: SERVING EN VIVO        │   │   CAPA 3B: ENTRENAMIENTO ML     │
│       (Online Read < 15ms)          │   │      (Offline Read Histórico)   │
│ • Vistas Materializadas en Postgres │   │ • Point-in-Time Joins           │
│ • Consultada en milisegundos por la │   │ • DuckDB en memoria + R         │
│   PWA de Gali / ExpoWinners         │   │ • Entrena el modelo sin sesgo   │
│   para entregar la recomendación.   │   │   temporal ni fuga de datos.    │
└─────────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 4. Especificación Técnica de Componentes

### 4.1. Capa 1: Data Contracts con Zod (`hub/src/lib/contracts/`)
Se elimina el `ALIAS_MAP` permisivo. Se establece un contrato formal entre el equipo de Data Analyst (Miguel) y el Agente PM.

```typescript
// hub/src/lib/contracts/seller-metrics-contract.ts
import { z } from "zod";

export const SellerMetricsPayloadSchema = z.object({
  user_id: z.string().min(1, "user_id es obligatorio"),
  corte_timestamp: z.string().datetime("Formato ISO 8601 requerido"),
  rol_tecnico: z.enum(["DROPSHIPPER", "SUPPLIER", "HYBRID"]),
  
  // Métricas Operativas Directas
  ordenes_propias_mes: z.number().int().nonnegative(),
  ordenes_externas_mes: z.number().int().nonnegative(),
  productos_activos_catalogo: z.number().int().nonnegative(),
  
  // Métricas Logísticas y de Confianza
  tasa_entrega_30d: z.number().min(0).max(1),
  tiempo_promedio_despacho_horas: z.number().nonnegative(),
  tasa_devolucion_30d: z.number().min(0).max(1),
  
  // Señales de Negocio Declaradas
  nivel_leyenda: z.enum(["Iniciando", "Creciendo", "Consolidando", "Pre-Escalando", "Escalando"]),
  saldo_promedio_fletes: z.number().optional(),
});

export type SellerMetricsPayload = z.infer<typeof SellerMetricsPayloadSchema>;
```

### 4.2. Capa 2: DDL del Log Inmutable (`hub/supabase/056_marketplace_feature_store.sql`)
La tabla que garantiza la trazabilidad histórica total sin pérdida de contexto.

```sql
-- Migración 056: Feature Store Append-Only Log
CREATE TABLE IF NOT EXISTS marketplace_feature_log (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id           TEXT NOT NULL,
  entity_type         TEXT NOT NULL CHECK (entity_type IN ('dropshipper', 'supplier', 'product')),
  payload             JSONB NOT NULL,
  event_timestamp     TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Índices optimizados para Point-in-Time queries y Online Serving
CREATE INDEX IF NOT EXISTS idx_feature_log_entity_time 
  ON marketplace_feature_log (entity_id, event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_feature_log_type_time 
  ON marketplace_feature_log (entity_type, event_timestamp DESC);

-- RLS: Solo lectura para authenticated, escritura solo vía Service Key de API
ALTER TABLE marketplace_feature_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura interna para authenticated" 
  ON marketplace_feature_log FOR SELECT TO authenticated USING (true);
```

### 4.3. Capa 3: Vista de Servicio en Vivo (Online Serving)
Garantiza que la PWA y Darwin consulten la foto más reciente en menos de 15 ms sin recalcular nada:

```sql
CREATE OR REPLACE VIEW v_online_seller_features AS
SELECT DISTINCT ON (entity_id)
  entity_id,
  entity_type,
  payload,
  event_timestamp
FROM marketplace_feature_log
WHERE entity_type = 'dropshipper'
ORDER BY entity_id, event_timestamp DESC;
```

### 4.4. Capa 4: Cómputo Analítico y Entrenamiento con DuckDB y R
Cuando Darwin o R necesitan entrenar el modelo de matching o auditar supervivencia:
1. **DuckDB** une en memoria local el log histórico de Supabase con los Parquets masivos de órdenes de BigQuery.
2. Ejecuta el **Point-in-Time Join**:
   $$\text{Features}(u, t) = \max_{t' \le t} \text{Payload}(u, t')$$
3. El motor de R (`investigador`) corre la regresión de elección discreta (*Discrete Choice*) o supervivencia (*Cox Proportional Hazards*) con datos 100% limpios y sin fuga temporal.

---

## 5. El Algoritmo de Oportunidades: Lógica de Ponderación

El motor no rankeará productos por "ventas brutas". La recomendación a un Dropshipper $D$ sobre un Producto $P$ del Supplier $S$ se calcula con una función de **Afinidad Multiobjetivo ($Score_{D,P}$)**:

$$Score_{D,P} = \underbrace{P(\text{Conv}_{D,P})}_{\text{Match de Nicho}} \times \underbrace{\text{MargenNeto}(P)}_{\text{Utilidad Real}} \times \underbrace{(1 - \text{Saturacion}(P))}_{\text{Protección Pauta}} \times \underbrace{\text{Efectividad}(S)}_{\text{Salud Logística}}$$

* **$P(\text{Conv}_{D,P})$:** Probabilidad calculada a partir de los swipes del usuario (capturados en Gali/ExpoWinners) y su nivel de experiencia previa.
* **MargenNeto:** Precio de venta sugerido menos costo de proveedor, flete promedio regional y comisión Dropi.
* **$(1 - \text{Saturacion})$:** Penaliza productos que ya tienen más de 15 anunciantes activos detectados en la biblioteca de anuncios (Apify).
* **$\text{Efectividad}(S)$:** Castiga a proveedores con tiempo de despacho $> 24\text{ h}$ o devolución $> 18\%$.

---

## 6. Plan de Implementación por Fases (Roadmap Ágil)

### Fase 1: Blindaje de Entrada y Data Contracts (Semana 1)
* [ ] Crear schema de validación Zod para el webhook de Seller Success.
* [ ] Reemplazar el `ALIAS_MAP` permisivo por respuestas de error explícitas (HTTP 422).
* [ ] Compartir la especificación JSON/Zod con Miguel Ángel para estandarizar sus scripts de entrega.

### Fase 2: Inmutabilidad en Supabase (Semana 2)
* [ ] Aplicar la migración `056_marketplace_feature_store.sql`.
* [ ] Modificar la ruta del webhook para hacer `INSERT` inmutable en lugar de `upsert` destructivo.
* [ ] Crear la vista materializada `v_online_seller_features` para lectura en caliente.

### Fase 3: Instrumentación de Señales de Preferencia en Gali (ExpoWinners)
* [ ] Capturar eventos de swipe y guardado de productos en la tabla `expo_events`.
* [ ] Registrar el vector de preferencias del usuario (categoría, rango de precio, margen deseado).

### Fase 4: Integración del Motor de Inferencia en Darwin (Semana 3)
* [ ] Conectar DuckDB local en el MCP `investigador` para consultas point-in-time ultrarrápidas.
* [ ] Desplegar la primera versión del algoritmo de scoring de oportunidades en el panel del PM.

---

## 7. Conclusión y Compromisos de Equipo

Con esta arquitectura:
1. **Miguel Ángel (Data):** Sabe exactamente qué contrato enviar, con qué tipos de datos y sin incertidumbre de nombres de columnas.
2. **Jaime Guevara:** Cuenta con un pipeline transparente y confiable donde el webhook ya no es una "caja negra".
3. **Darwin y R:** Disponen de datos históricos puros, libres de sesgo temporal y listos para entrenar algoritmos de Machine Learning de clase mundial.
4. **La Célula:** Da el salto definitivo de reportar el pasado a **entregarle oportunidades predictivas a miles de emprendedores en Dropi**.
