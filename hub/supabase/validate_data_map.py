#!/usr/bin/env python3
"""
Script de validación de datos — Auditoría del Mapa 360° de Seller Success.

Ejecuta queries contra Supabase para confirmar el estado real de los campos
que tienen confianza media en la auditoría antes de usarlos como base
para hipótesis experimentales.

Uso: python3 validate_data_map.py
"""
import os
import sys
import json

# Cargar variables de entorno
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
env_path = os.path.join(HUB_DIR, ".env.local")
env_vars = {}

try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando env vars: {e}")
    sys.exit(1)

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Credenciales de Supabase no encontradas.")
    sys.exit(1)

from supabase import create_client
supabase = create_client(url, key)

print("=" * 70)
print("🔬 AUDITORÍA DE DATOS — Mapa 360° Seller Success")
print("=" * 70)

# --- Función helper para paginar toda la tabla ---
def fetch_all():
    all_data = []
    from_idx = 0
    limit = 1000
    has_more = True
    while has_more:
        res = supabase.table("userpilot_suppliers").select("*").range(from_idx, from_idx + limit - 1).execute()
        data = res.data
        if data:
            all_data.extend(data)
            if len(data) < limit:
                has_more = False
            else:
                from_idx += limit
        else:
            has_more = False
    return all_data

print("\nCargando todos los registros de userpilot_suppliers...")
data = fetch_all()
total = len(data)
print(f"Total de registros: {total}")

# ===== VALIDACIÓN 1: role =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #1: Campo `role` (¿defaultea a SUPPLIER?)")
print("─" * 70)
role_counts = {}
for row in data:
    r = row.get("role") or "NULL"
    role_counts[r] = role_counts.get(r, 0) + 1
for val, count in sorted(role_counts.items(), key=lambda x: -x[1]):
    pct = round(count / total * 100, 2) if total > 0 else 0
    print(f"  {val}: {count} ({pct}%)")
all_supplier = role_counts.get("SUPPLIER", 0) == total
print(f"\n  ✅ VEREDICTO: {'CONFIRMADO — 100% es SUPPLIER (default).' if all_supplier else 'HAY VARIACIÓN — role tiene valores distintos.'}")

# ===== VALIDACIÓN 2: survey_source =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #2: Campo `survey_source` (¿canal de adquisición o clasificación binaria?)")
print("─" * 70)
ss_counts = {}
null_count = 0
for row in data:
    ss = row.get("survey_source")
    if ss is None or ss == '' or ss == '-':
        null_count += 1
    else:
        ss_counts[ss] = ss_counts.get(ss, 0) + 1
print(f"  NULL / vacío / '-': {null_count}")
for val, count in sorted(ss_counts.items(), key=lambda x: -x[1]):
    pct = round(count / total * 100, 2) if total > 0 else 0
    print(f"  '{val}': {count} ({pct}%)")
print(f"\n  📝 INTERPRETACIÓN: Revisar si los valores corresponden a canales de tráfico o a etiquetas internas.")

# ===== VALIDACIÓN 3: billing_information =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #3: Campo `billing_information` (¿algún registro con true?)")
print("─" * 70)
bi_counts = {"true": 0, "false": 0, "null": 0}
for row in data:
    bi = row.get("billing_information")
    if bi is True:
        bi_counts["true"] += 1
    elif bi is False:
        bi_counts["false"] += 1
    else:
        bi_counts["null"] += 1
for val, count in bi_counts.items():
    pct = round(count / total * 100, 2) if total > 0 else 0
    print(f"  {val}: {count} ({pct}%)")
has_any_true = bi_counts["true"] > 0
print(f"\n  ✅ VEREDICTO: {'HAY registros con billing=true.' if has_any_true else 'CONFIRMADO — 0% tiene billing=true. El evento no llega a producción.'}")

# ===== VALIDACIÓN 4: real_products_created =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #4: Campo `real_products_created` (¿dato estático o gap?)")
print("─" * 70)
rpc_null = 0
rpc_zero = 0
rpc_gt0 = 0
rpc_sum = 0
for row in data:
    rpc = row.get("real_products_created")
    if rpc is None:
        rpc_null += 1
    elif rpc == 0:
        rpc_zero += 1
    else:
        rpc_gt0 += 1
        rpc_sum += rpc
print(f"  NULL: {rpc_null} ({round(rpc_null / total * 100, 2) if total > 0 else 0}%)")
print(f"  = 0:  {rpc_zero} ({round(rpc_zero / total * 100, 2) if total > 0 else 0}%)")
print(f"  > 0:  {rpc_gt0} ({round(rpc_gt0 / total * 100, 2) if total > 0 else 0}%)")
if rpc_gt0 > 0:
    print(f"  Promedio (solo > 0): {round(rpc_sum / rpc_gt0, 1)}")
print(f"\n  ✅ VEREDICTO: {'Dato POBLADO desde CSV — reclasificar como Estático.' if rpc_gt0 > 0 else 'CONFIRMADO — campo vacío en producción.'}")

# ===== VALIDACIÓN 5: verified =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #5: Campo `verified` (distribución)")
print("─" * 70)
v_counts = {"true": 0, "false": 0, "null": 0}
for row in data:
    v = row.get("verified")
    if v is True:
        v_counts["true"] += 1
    elif v is False:
        v_counts["false"] += 1
    else:
        v_counts["null"] += 1
for val, count in v_counts.items():
    pct = round(count / total * 100, 2) if total > 0 else 0
    print(f"  {val}: {count} ({pct}%)")

# ===== VALIDACIÓN 6: tipo_proveedor (valores reales) =====
print("\n" + "─" * 70)
print("📋 VALIDACIÓN #6: Campo `tipo_proveedor` (valores reales)")
print("─" * 70)
tp_counts = {}
tp_null = 0
for row in data:
    tp = row.get("tipo_proveedor")
    if tp is None or tp == '' or tp == '-':
        tp_null += 1
    else:
        tp_counts[tp] = tp_counts.get(tp, 0) + 1
print(f"  NULL / vacío: {tp_null}")
for val, count in sorted(tp_counts.items(), key=lambda x: -x[1]):
    pct = round(count / total * 100, 2) if total > 0 else 0
    print(f"  '{val}': {count} ({pct}%)")

# ===== RESUMEN =====
print("\n" + "=" * 70)
print("📊 RESUMEN DE AUDITORÍA")
print("=" * 70)
print(f"  Total registros: {total}")
print(f"  role 100% SUPPLIER (default):  {'SÍ' if all_supplier else 'NO'}")
print(f"  billing_information con true:  {'SÍ' if has_any_true else 'NO (0%)'}")
print(f"  real_products_created > 0:     {'SÍ (' + str(rpc_gt0) + ' registros)' if rpc_gt0 > 0 else 'NO'}")
print(f"  survey_source valores únicos:  {len(ss_counts)}")
print("=" * 70)
