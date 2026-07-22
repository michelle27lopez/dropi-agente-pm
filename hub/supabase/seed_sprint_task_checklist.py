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

def sec(name, status, notes=""):
    return {"name": name, "status": status, "notes": notes}

# Sembrado 2026-07-15 a partir del estado real de Jira (sprint "Product Sprint 26-27").
# No incluye PROD-1514 (Reuniones) — esa tarea la maneja la skill sprint-reuniones, no este checklist.
ROWS = [
    {
        "jira_key": "PROD-1581",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1581",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][DEFINICIÓN] Mejora de Categorías de Productos",
        "jira_status": "En curso",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Escenarios", "en_curso", "En definición."),
            sec("Documentación", "pendiente", "Falta el E2E del proyecto completo de Categorización (mismo formato de tabs que NEG-002)."),
            sec("Alineación IA", "hecho",
                "Mega-menú de categorías (estilo MercadoLibre) reemplazando el sidebar fijo. "
                "Nueva rama 'Salud y Bienestar → Suplementos Dietarios' con 4 subcategorías: proteínas, colágeno, vitaminas, quemadores. "
                "Nota explicativa en pantalla para casos de ambigüedad de clasificación. "
                "Resuelve hallazgo de Manuela (Black Swan, validación 08/07): la categoría sigue el modelo mental del comprador, no la clasificación regulatoria. "
                "Pendiente: hallazgo de Andrés (Katz Supply) sobre categorizar por artículo vs. función, aún sin resolver."),
        ],
        "links": [
            {"label": "Prototipo (hub)", "url": "https://github.com/search?q=hub/src/app/proyectos/categorizacion/prototipo"},
        ],
    },
    {
        "jira_key": "PROD-1578",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1578",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][DEFINICIÓN] Descuentos en producto Precio Antes / Precio Ahora — Fase 1 MVP",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Ajustar con componentes existentes", "pendiente"),
            sec("Definir todos los escenarios", "pendiente"),
            sec("Documentación", "pendiente"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-1577",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1577",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][DEFINICIÓN] Dropi pulso - MVP",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Documentación", "pendiente"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-1512",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1512",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][EXPERIMENTACIÓN] Campañas: Fase 2 mvp - iniciar campaña",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Iniciar campaña en el prototipo + siguientes pasos", "pendiente"),
            sec("Conexión con CRM para envío automático de mensajes", "pendiente"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-1500",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1500",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][DEFINICIÓN] Caza productos: Diseñar nueva manera y dinamica en Dropi pulso",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Conectar CSV de caza productos con Dropi Pulso", "pendiente"),
            sec("Botón en home para formulario de solicitud", "pendiente"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-1496",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1496",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][DISCOVERY] Time to value: Levantamiento de información necesaria para enseñar al Supplier a vender",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Levantamiento de información", "pendiente"),
        ],
        "links": [],
    },
    {
        "jira_key": "PROD-1306",
        "jira_url": "https://dropi-it.atlassian.net/browse/PROD-1306",
        "person_email": "michelle.lopez@dropi.co",
        "summary": "[PRODUCTO][EXPERIMENTACIÓN] Time to Value: Postulaciones mavisas (Suppliers Verificados, Premium, Exclusivos)",
        "jira_status": "En Ruta (backlog)",
        "sprint_label": "Product Sprint 26-27",
        "sections": [
            sec("Documentar", "pendiente"),
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
    print(f"OK: {len(ROWS)} filas insertadas/actualizadas en sprint_task_checklist")
else:
    print(f"Error {resp.status_code}: {resp.text}")
    sys.exit(1)
