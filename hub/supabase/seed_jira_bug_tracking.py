import os
import sys
import requests

# Carga variables de entorno del archivo env (mismo patrón que seed_operational_data.py)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
env_path = os.path.join(HUB_DIR, ".env.local")
env_vars = {}

try:
    with open(env_path, "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando env vars: {e}")
    sys.exit(1)

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Credenciales de Supabase no encontradas en hub/.env.local")
    sys.exit(1)

rows = [
    {
        "jira_key": "PROD-1584",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1584",
        "summary": "[Backend] TTV: Auto-login post-registro — proveedor rebota antes de llegar al CRM",
        "label_type": "Backend",
        "product_code": "TTV",
        "status": "En Ruta (backlog)",
        "assignee": "Jose Giraldo",
        "parent_epic_key": "PROD-1305",
        "reported_by": "Michelle López Obregón",
    },
    {
        "jira_key": "PROD-1585",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1585",
        "summary": "[Backend] CAZ: Búsqueda de catálogo muestra resultados sin filtro por categoría del proveedor",
        "label_type": "Backend",
        "product_code": "CAZ",
        "status": "En Ruta (backlog)",
        "assignee": "Jose Giraldo",
        "parent_epic_key": "PROD-1290",
        "reported_by": "Michelle López Obregón",
    },
    {
        "jira_key": "PROD-1586",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1586",
        "summary": "[Backend] CAZ: Búsqueda semántica con resultados inconsistentes entre sesiones",
        "label_type": "Backend",
        "product_code": "CAZ",
        "status": "En Ruta (backlog)",
        "assignee": "Jose Giraldo",
        "parent_epic_key": None,
        "reported_by": "Michelle López Obregón",
    },
]

resp = requests.post(
    f"{url}/rest/v1/jira_bug_tracking",
    json=rows,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    params={"on_conflict": "jira_key"},
)

if resp.status_code in (200, 201, 204):
    print(f"OK: {len(rows)} filas insertadas/actualizadas en jira_bug_tracking")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
