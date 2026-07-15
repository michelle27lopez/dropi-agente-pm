"""
seed_prospectos_ascenso.py
IND-001 · Carga/actualiza supplier_ascenso_panel en Supabase a partir del
export CSV del panel de proveedores (panel_suppliers_YYYYMMDD.csv).

Uso:
  python3 seed_prospectos_ascenso.py [ruta_csv]

Si no se pasa ruta_csv, toma el CSV más reciente en "hub/doc hub/"
que empiece por panel_suppliers_.

Cada corrida reemplaza el snapshot completo: hace upsert de las filas del
CSV y borra las que quedaron con una fecha_extraccion anterior (proveedores
que salieron del segmento operativo o ya no vienen en el export nuevo).
"""

import csv
import glob
import os
import sys
from supabase import create_client

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
ENV_PATH = os.path.join(HUB_DIR, ".env.local")
DOC_HUB_DIR = os.path.join(HUB_DIR, "doc hub")

UMBRAL = {"Activo": 3000, "Verificado": 20000}
OBJETIVO = {"Activo": "Verificado", "Verificado": "Premium"}
BATCH_SIZE = 500


def cargar_env():
    env_vars = {}
    with open(ENV_PATH, "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                env_vars[k.strip()] = v.strip()
    return env_vars


def resolver_csv(arg_path):
    if arg_path:
        return arg_path
    candidatos = sorted(glob.glob(os.path.join(DOC_HUB_DIR, "panel_suppliers_*.csv")))
    if not candidatos:
        print(f"Error: no se encontró ningún panel_suppliers_*.csv en {DOC_HUB_DIR}")
        sys.exit(1)
    return candidatos[-1]


def f(v):
    if v in (None, ""):
        return None
    try:
        return float(v)
    except ValueError:
        return None


def i(v):
    x = f(v)
    return int(x) if x is not None else None


def main():
    env_vars = cargar_env()
    url = env_vars.get("SUPABASE_URL")
    key = env_vars.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        print("Error: SUPABASE_URL o SUPABASE_SERVICE_KEY no están configurados en hub/.env.local")
        sys.exit(1)

    csv_path = resolver_csv(sys.argv[1] if len(sys.argv) > 1 else None)
    fecha_extraccion = None
    print(f"Leyendo {csv_path} ...")

    rows_out = []
    with open(csv_path, encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for r in reader:
            nivel = r["nivel_actual"]
            if nivel not in UMBRAL:
                continue
            if r["es_activo_operativo"] != "True":
                continue
            if r["es_interno_dropi"] == "True":
                continue
            pu = f(r["pct_umbral_siguiente_nivel"])
            if pu is None:
                continue
            fecha_extraccion = r["fecha_extraccion"] or fecha_extraccion
            rows_out.append({
                "supplier_id": i(r["supplier_id"]),
                "supplier_name": r["supplier_name"],
                "email": r["email"] or None,
                "nivel_actual": nivel,
                "nivel_objetivo": OBJETIVO[nivel],
                "ordenes_movilizadas_90d": i(r["ordenes_movilizadas_90d"]),
                "umbral_objetivo": UMBRAL[nivel],
                "pct_umbral": round(pu, 4),
                "despachos_pct": f(r["despachos_pct"]),
                "despacho_tiempo_h": f(r["despacho_tiempo_promedio_h"]),
                "garantias_recibidas_90d": i(r["garantias_recibidas_90d"]),
                "garantias_gestion_pct": f(r["garantias_gestion_pct"]),
                "garantias_tiempo_h": f(r["garantias_tiempo_promedio_h"]),
                "fecha_extraccion": r["fecha_extraccion"],
            })

    if not rows_out:
        print("No se encontraron filas válidas para cargar. Abortando.")
        sys.exit(1)

    print(f"Filas a upsertear: {len(rows_out)} · fecha_extraccion={fecha_extraccion}")

    supabase = create_client(url, key)

    for start in range(0, len(rows_out), BATCH_SIZE):
        batch = rows_out[start:start + BATCH_SIZE]
        supabase.table("supplier_ascenso_panel").upsert(batch, on_conflict="supplier_id").execute()
        print(f"  upsert {start + len(batch)}/{len(rows_out)}")

    # Limpieza: borrar snapshots viejos que no vinieron en este export
    del_res = (
        supabase.table("supplier_ascenso_panel")
        .delete()
        .neq("fecha_extraccion", fecha_extraccion)
        .execute()
    )
    print(f"Filas obsoletas eliminadas: {len(del_res.data or [])}")
    print("Listo.")


if __name__ == "__main__":
    main()
