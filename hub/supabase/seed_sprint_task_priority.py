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

# Prioridades reales traídas de Jira el 2026-07-16 (campo `priority.name` de
# cada issue) — requiere que la migración 027 ya haya corrido.
PRIORITIES = {
    "PROD-1581": "Highest",
    "PROD-1578": "Highest",
    "PROD-1577": "Highest",
    "PROD-1512": "High",
    "PROD-1500": "High",
    "PROD-1496": "Medium",
    "PROD-1306": "Medium",
    "PROD-551": "Medium",
    "PROD-350": "Medium",
    "PROD-349": "Medium",
    "PROD-338": "Medium",
}

ok = 0
for jira_key, priority in PRIORITIES.items():
    resp = requests.patch(
        f"{url}/rest/v1/sprint_task_checklist",
        json={"priority": priority},
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        params={"jira_key": f"eq.{jira_key}"},
    )
    if resp.status_code in (200, 204):
        ok += 1
    else:
        print(f"Error {resp.status_code} en {jira_key}: {resp.text}")

print(f"OK: {ok}/{len(PRIORITIES)} tareas actualizadas con su prioridad de Jira")
