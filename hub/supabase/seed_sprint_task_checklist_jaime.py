import os
import sys
import requests

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

def sec(name, status="pendiente", notes=""):
    return {"name": name, "status": status, "notes": notes}

# Sembrado 2026-07-16 a partir de las 4 tareas reales de Jaime en el sprint activo
# (JQL: assignee = jaime.guevara@dropi.co AND sprint in openSprints()). Todas quedan
# en "pendiente" porque no hay contexto de conversación sobre su avance real —
# nada de esto se inventa, solo se deriva del criterio de aceptación/DoD de cada HU.
ROWS = [
    {
        "jira_key": "PROD-551",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-551",
        "person_email": "jaime.guevara@dropi.co",
        "summary": "[PRODUCTO] Discovery — Mejora de Categorías de Productos",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Consolidar avances previos (Juan Diego, equipo AI, Kate, Lina)"),
            sec("AS-IS + Discovery"),
            sec("TOBE en fases"),
            sec("Pitch a Dropi Score (alineado con María Ossa)"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-350",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-350",
        "person_email": "jaime.guevara@dropi.co",
        "summary": "[PRODUCTO] TOBE: conexión y sincronización de stock con Chateapro + coronita azul",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Token de autenticación"),
            sec("Sincronización de stock"),
            sec("Coronita azul (activación/visual)"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-349",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-349",
        "person_email": "jaime.guevara@dropi.co",
        "summary": "[PRODUCTO] Discovery: conexión y sincronización de stock con Chateapro + coronita azul",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Conexión/autenticación (AS-IS + riesgo de suplantación)"),
            sec("Sincronización de stock (decisión tiempo real vs. batch)"),
            sec("Coronita azul (condiciones + validación con Diseño)"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-338",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-338",
        "person_email": "jaime.guevara@dropi.co",
        "summary": "[PRODUCTO] Discovery y AS-IS: ¿Qué tienen los suppliers que más venden?",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Revisión manual top 20 suppliers"),
            sec("Patrones comunes identificados (mínimo 5)"),
            sec("Documento de hallazgos"),
        ],
        "links": [],
    },
]

resp = requests.post(
    f"{url}/rest/v1/sprint_task_checklist",
    json=ROWS,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    params={"on_conflict": "jira_key"},
)

if resp.status_code in (200, 201, 204):
    print(f"OK: {len(ROWS)} filas insertadas/actualizadas en sprint_task_checklist (Jaime)")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
