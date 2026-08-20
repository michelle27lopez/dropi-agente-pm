import os
import sys
import requests
from datetime import datetime, timezone

# Carga variables de entorno del archivo env (mismo patrón que seed_sprint_meeting_whitelist.py)
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

PERSON_EMAIL = "michelle.lopez@dropi.co"

# Reuniones de HOY traídas por el agente vía el conector de Google Calendar
# (list_events sobre el calendario primario) y clasificadas igual que
# sprint-reuniones: colorId=4 (personal) queda excluido — Almuerzo y Gym no
# entran acá. Este bloque se reemplaza cada vez que se corre la skill/sync
# para un día nuevo, no es un dato fijo de código.
MEETINGS = [
    {
        "title": "Suppliers success - Daily",
        "start": "2026-07-29T08:30:00-05:00",
        "end": "2026-07-29T08:45:00-05:00",
        "join_url": "https://meet.google.com/qfz-jrba-kic",
    },
    {
        "title": "Weekly suppliers",
        "start": "2026-07-29T10:00:00-05:00",
        "end": "2026-07-29T11:00:00-05:00",
        "join_url": "https://meet.google.com/fed-cecf-vat",
    },
    {
        "title": "Michelle / Michel David · Selección de transportadoras",
        "start": "2026-07-29T15:45:00-05:00",
        "end": "2026-07-29T16:15:00-05:00",
        "join_url": "https://meet.google.com/tgq-oasu-oao",
    },
    {
        "title": "Asistencia proveedor",
        "start": "2026-07-29T17:00:00-05:00",
        "end": "2026-07-29T17:30:00-05:00",
        "join_url": "https://meet.google.com/qoj-eshy-ave",
    },
]

event_date = datetime.fromisoformat(MEETINGS[0]["start"]).date().isoformat()

# Limpia las filas de ese día para esa persona antes de reinsertar — evita
# duplicados si se corre más de una vez el mismo día (ej. resync a media
# tarde porque agendaron algo nuevo).
del_resp = requests.delete(
    f"{url}/rest/v1/today_meetings",
    headers={"apikey": key, "Authorization": f"Bearer {key}"},
    params={"person_email": f"eq.{PERSON_EMAIL}", "event_date": f"eq.{event_date}"},
)
if del_resp.status_code not in (200, 204):
    print(f"Aviso: no se pudo limpiar filas previas ({del_resp.status_code}): {del_resp.text}")

rows = [
    {
        "person_email": PERSON_EMAIL,
        "event_date": event_date,
        "start_time": m["start"],
        "end_time": m["end"],
        "title": m["title"],
        "join_url": m["join_url"],
        "is_personal": False,
    }
    for m in MEETINGS
]

resp = requests.post(
    f"{url}/rest/v1/today_meetings",
    json=rows,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    },
)

if resp.status_code in (200, 201, 204):
    print(f"OK: {len(rows)} reuniones sincronizadas para {PERSON_EMAIL} ({event_date})")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
