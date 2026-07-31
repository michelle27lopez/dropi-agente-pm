"""
Migra hub/.local-data/campaigns-planeacion.json (suppliers + eligibleProducts)
a las tablas nuevas de Supabase (campaign_planeacion_suppliers /
campaign_planeacion_eligible, ver hub/supabase/029_...sql).

Requiere que 029_campaigns_planeacion_suppliers_elegibles.sql ya se haya
corrido en el SQL Editor del proyecto de Jaime (fwwkesboxlbmimzyoztq) —
si las tablas no existen, este script falla al primer insert.

No migra `campaigns` ni `nodes`: esos ya viven en Supabase desde la
migración 016 (la campaña de este JSON ya debería existir en
`campaigns_planeacion` o el script avisa y sigue igual, porque
suppliers/eligible solo referencian campaign_id por FK).

Uso: python3 hub/supabase/migrate_campaigns_planeacion_local_to_supabase.py [--dry-run]
"""

import json
import os
import sys
from supabase import create_client

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
ENV_PATH = os.path.join(HUB_DIR, ".env.local")
JSON_PATH = os.path.join(HUB_DIR, ".local-data", "campaigns-planeacion.json")
DRY_RUN = "--dry-run" in sys.argv

env_vars = {}
try:
    with open(ENV_PATH, "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando {ENV_PATH}: {e}")
    sys.exit(1)

# CAMPAIGNS_SUPABASE_* son las variables que usa @/lib/supabase-campaigns.ts;
# si no están seteadas, caen a las genéricas (mismo proyecto de Jaime desde
# el 09/07/2026, ver memoria feedback-supabase-siempre-jaime).
url = env_vars.get("CAMPAIGNS_SUPABASE_URL") or env_vars.get("SUPABASE_URL")
key = env_vars.get("CAMPAIGNS_SUPABASE_SERVICE_KEY") or env_vars.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: no hay CAMPAIGNS_SUPABASE_URL/SUPABASE_URL configurados en hub/.env.local")
    sys.exit(1)

with open(JSON_PATH, "r") as f:
    store = json.load(f)

suppliers = store.get("suppliers", [])
eligible = store.get("eligibleProducts", [])
campaigns = store.get("campaigns", [])

print(f"Origen: {len(campaigns)} campañas, {len(suppliers)} suppliers, {len(eligible)} eligibleProducts")

if DRY_RUN:
    print("--dry-run: no se escribe nada en Supabase.")
    sys.exit(0)

supabase = create_client(url, key)

# La campaña debe existir ya en campaigns_planeacion (FK) — si no está,
# el insert de suppliers/eligible falla con un error de FK claro.
for c in campaigns:
    existing = supabase.table("campaigns_planeacion").select("id").eq("id", c["id"]).maybe_single().execute()
    if not existing or not existing.data:
        print(f"⚠️  Campaña {c['id']} ({c.get('name')}) no existe en campaigns_planeacion — créala antes de seguir (la UI la crea sola al abrirla, o insértala manualmente).")

ok_suppliers = 0
for s in suppliers:
    row = {
        "id": s["id"],
        "campaign_id": s["campaign_id"],
        "identifier": s["identifier"],
        "data": s.get("data", {}),
        "status": s.get("status", "contactado"),
        "note": s.get("note"),
        "contacts": s.get("contacts", []),
        "created_at": s.get("created_at"),
        "updated_at": s.get("updated_at"),
    }
    res = supabase.table("campaign_planeacion_suppliers").upsert(row, on_conflict="campaign_id,identifier").execute()
    if res.data:
        ok_suppliers += 1
    else:
        print(f"⚠️  No se pudo migrar supplier {s['identifier']}")

ok_eligible = 0
for e in eligible:
    row = {
        "token": e["token"],
        "campaign_id": e["campaign_id"],
        "supplier_id": str(e["supplier_id"]),
        "supplier_name": e["supplier_name"],
        "products": e.get("products", []),
        "selected_product_ids": e.get("selectedProductIds"),
        "submitted_at": e.get("submitted_at"),
        "selection_updated_at": e.get("selection_updated_at"),
        "approved_at": e.get("approved_at"),
        "ready_checklist": e.get("readyChecklist"),
        "view_count": e.get("view_count", 0),
        "first_viewed_at": e.get("first_viewed_at"),
        "last_viewed_at": e.get("last_viewed_at"),
        "updated_at": e.get("updated_at"),
    }
    res = supabase.table("campaign_planeacion_eligible").upsert(row, on_conflict="token").execute()
    if res.data:
        ok_eligible += 1
    else:
        print(f"⚠️  No se pudo migrar eligible {e['token']}")

print(f"Migrados: {ok_suppliers}/{len(suppliers)} suppliers, {ok_eligible}/{len(eligible)} eligibleProducts")
print("Verifica en Supabase y luego, si todo cuadra, borra o renombra hub/.local-data/campaigns-planeacion.json")
