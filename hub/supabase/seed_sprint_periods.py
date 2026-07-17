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

# Sembrado 2026-07-16 con las fechas reales del sprint activo, traídas de Jira
# (PROD-1581, customfield_10020: "Product Sprint 26 - 27", startDate 2026-07-14,
# endDate 2026-07-21) y el festivo colombiano dentro del rango, traído del
# calendario "Días feriados en Colombia" (Día de la Independencia, 2026-07-20).
#
# Ajuste 2026-07-16 (confirmado por Michelle): el lunes 13 fue festivo, así que
# el sprint arrancó el martes 14 a las 4pm — casi sin horas útiles ese día. Se
# excluye el 14 del conteo de días hábiles igual que un festivo (mismo campo
# `holiday_dates`, aunque no sea un festivo legal) para que el % esperado no
# cuente ese día como jornada completa.
ROWS = [
    {
        "sprint_label": "Product Sprint 26-27",
        "start_date": "2026-07-14",
        "end_date": "2026-07-21",
        "holiday_dates": ["2026-07-14", "2026-07-20"],
    },
]

resp = requests.post(
    f"{url}/rest/v1/sprint_periods",
    json=ROWS,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    params={"on_conflict": "sprint_label"},
)

if resp.status_code in (200, 201, 204):
    print(f"OK: {len(ROWS)} filas insertadas/actualizadas en sprint_periods")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
