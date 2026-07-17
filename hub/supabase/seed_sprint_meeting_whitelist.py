import os
import sys
import requests

# Carga variables de entorno del archivo env (mismo patrón que seed_jira_bug_tracking.py)
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

# Whitelist confirmada por Michelle el 2026-07-15 (ver feedback_reuniones_generales_clasificacion.md)
MICHELLE_WHITELIST = [
    "Suppliers success - Daily",
    "Weekly suppliers",
    "Planning supplier",
    "Cellboard suppliers",
    "Alineación registro de suppliers",
    "Design lab Michel",
    "Design Team Dropi APP",
    "Product Lab 2.0",
    "Ecommerce League",
    "Continuemos hablando de Darwin",
    "preplanning",
]

rows = [
    {"person_email": "michelle.lopez@dropi.co", "meeting_title": title}
    for title in MICHELLE_WHITELIST
]

resp = requests.post(
    f"{url}/rest/v1/sprint_meeting_whitelist",
    json=rows,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    params={"on_conflict": "person_email,meeting_title"},
)

if resp.status_code in (200, 201, 204):
    print(f"OK: {len(rows)} filas insertadas/actualizadas en sprint_meeting_whitelist")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
