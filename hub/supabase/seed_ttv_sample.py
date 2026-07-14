"""
seed_ttv_sample.py
Pobla los primeros 3 meses del dashboard TTV-001 con datos de ejemplo.

Progresión simulada:
  Mes 1 → arrancando (~85% de meta) — equipo ajustando proceso
  Mes 2 → mejorando  (~94% de meta) — pipeline más fluido
  Mes 3 → en meta    (~98% de meta) — operación estabilizada

Ejecutar desde: hub/supabase/
  python seed_ttv_sample.py
"""

import sys
from supabase import create_client

# ── Cargar .env.local ──────────────────────────────────────────────────────────
ENV_PATH = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/.env.local"
env = {}
try:
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando .env.local: {e}")
    sys.exit(1)

url = env.get("SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_KEY")
if not url or not key:
    print("Error: SUPABASE_URL o SUPABASE_SERVICE_KEY no encontrados en .env.local")
    sys.exit(1)

sb = create_client(url, key)

# ── Helper ──────────────────────────────────────────────────────────────────────
def fetch_all(table, order="month_number"):
    try:
        res = sb.table(table).select("*").order(order).execute()
        return res.data or []
    except Exception:
        res = sb.table(table).select("*").execute()
        return res.data or []

def update(table, id_, data):
    sb.table(table).update(data).eq("id", id_).execute()
    print(f"  ✓ {table} id={id_[:8]}… → {data}")

# ══════════════════════════════════════════════════════════════════════════════
# 1. ttv_monthly_data — reales por mes
# ══════════════════════════════════════════════════════════════════════════════
print("\n[1/4] ttv_monthly_data")
monthly_real = {
    1: dict(contactos_real=265, auditados_real=134, listos_real=88),   # ~85% meta
    2: dict(contactos_real=278, auditados_real=148, listos_real=98),   # ~94% meta
    3: dict(contactos_real=291, auditados_real=154, listos_real=101),  # ~98% meta
}
for row in fetch_all("ttv_monthly_data"):
    mn = row["month_number"]
    if mn in monthly_real:
        update("ttv_monthly_data", row["id"], monthly_real[mn])

# ══════════════════════════════════════════════════════════════════════════════
# 2. ttv_monthly_segments — reales por mes y segmento
# ══════════════════════════════════════════════════════════════════════════════
print("\n[2/4] ttv_monthly_segments")
# Estructura: { (mes, segment_key): { contactos_real, auditados_real, listos_real } }
seg_real = {
    # Mes 1 — arranque, por debajo de meta en todos los segmentos
    (1, "pequenos"):  dict(contactos_real=40,  auditados_real=14, listos_real=8),
    (1, "50_300"):    dict(contactos_real=112, auditados_real=49, listos_real=32),
    (1, "300_1000"):  dict(contactos_real=71,  auditados_real=42, listos_real=29),  # sorpresa: supera meta en contactos
    (1, "1000_plus"): dict(contactos_real=42,  auditados_real=29, listos_real=19),

    # Mes 2 — mejora notoria, casi en meta
    (2, "pequenos"):  dict(contactos_real=46,  auditados_real=16, listos_real=9),
    (2, "50_300"):    dict(contactos_real=128, auditados_real=57, listos_real=38),
    (2, "300_1000"):  dict(contactos_real=67,  auditados_real=44, listos_real=30),
    (2, "1000_plus"): dict(contactos_real=37,  auditados_real=31, listos_real=21),

    # Mes 3 — muy cerca de meta, proceso estabilizado
    (3, "pequenos"):  dict(contactos_real=49,  auditados_real=17, listos_real=10),
    (3, "50_300"):    dict(contactos_real=131, auditados_real=59, listos_real=39),
    (3, "300_1000"):  dict(contactos_real=69,  auditados_real=45, listos_real=31),
    (3, "1000_plus"): dict(contactos_real=42,  auditados_real=33, listos_real=21),
}
for row in fetch_all("ttv_monthly_segments"):
    key_ = (row["month_number"], row["segment_key"])
    if key_ in seg_real:
        update("ttv_monthly_segments", row["id"], seg_real[key_])

# ══════════════════════════════════════════════════════════════════════════════
# 3. ttv_time_metrics — TTV real (activación + primera orden)
# ══════════════════════════════════════════════════════════════════════════════
print("\n[3/4] ttv_time_metrics")
ttv_real = {
    # Scope → (promedio_activacion_dias, promedio_primera_orden_dias)
    # Meta: activación ≤5 días, primera orden ≤25 días
    "global": (5.9, 27.2),   # promedio global de los 3 meses — todavía arriba del target
    "mes_1":  (7.1, 31.4),   # mes 1: proceso manual, lento
    "mes_2":  (5.8, 26.3),   # mes 2: mejora, casi en target activación
    "mes_3":  (4.8, 23.1),   # mes 3: activación ok, primera orden dentro del target!
}
for row in fetch_all("ttv_time_metrics"):
    if row["scope"] in ttv_real:
        act, po = ttv_real[row["scope"]]
        update("ttv_time_metrics", row["id"], {
            "promedio_activacion_dias": act,
            "promedio_primera_orden_dias": po,
        })

# ══════════════════════════════════════════════════════════════════════════════
# 4. ttv_pipeline_metrics — % reales por mes (1, 2, 3)
# ══════════════════════════════════════════════════════════════════════════════
print("\n[4/4] ttv_pipeline_metrics")
# { metric_key: (mes1_real, mes2_real, mes3_real) }
pipeline_real = {
    "formulario_completo":  ("100%", "100%", "100%"),
    "bodega_creada":        ("54%",  "61%",  "65%"),   # sube hasta target
    "producto_creado":      ("58%",  "65%",  "70%"),   # alcanza target en mes 3
    "auditoria_solicitada": ("38%",  "45%",  "50%"),   # en camino
    "en_auditoria":         ("22%",  "25%",  "28%"),
    "con_novedad":          ("11%",  "9%",   "8%"),    # baja (buen signo)
    "auditoria_aprobada":   ("17%",  "21%",  "24%"),   # alcanza target en mes 3
    "primera_orden":        ("10%",  "13%",  "15%"),   # alcanza target en mes 3
    "rechazado":            ("6%",   "5%",   "4%"),    # baja (buen signo)
}
for row in fetch_all("ttv_pipeline_metrics"):
    mk = row["metric_key"]
    if mk in pipeline_real:
        m1, m2, m3 = pipeline_real[mk]
        update("ttv_pipeline_metrics", row["id"], {
            "mes1_real": m1, "mes2_real": m2, "mes3_real": m3,
        })

print("\n✅ Seed completo. Meses 1–3 poblados con datos de ejemplo.")
print("   Meses 4–6 quedan vacíos (sin data) para ir completando con datos reales.")
