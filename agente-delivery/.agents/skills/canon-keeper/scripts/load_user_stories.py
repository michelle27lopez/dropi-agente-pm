from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from supabase import create_client, Client

ROOT = Path.cwd()
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
TABLE = "user_stories"

# Replace this list with the user stories of the active project before running.
STORIES: list[dict[str, Any]] = [
    # {
    #     "story_id": "US-001-001",
    #     "project": "Nombre del proyecto",
    #     "capability_id": "CAP-001",
    #     "capability_name": "Nombre de la capacidad",
    #     "source_epic": "EPIC-001",
    #     "original_key": "TICKET-001",
    #     "title": "Título de la historia",
    #     "type": "User Story",
    #     "status": "Active",
    #     "scope_treatment": "Accepted",
    #     "narrative": "Como [rol], quiero [acción], para [beneficio].",
    #     "acceptance_criteria": "Criterios de aceptación.",
    #     "notes": "Notas adicionales.",
    #     "sort_order": 1,
    # },
]


def require_env() -> None:
    missing = [k for k, v in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY}.items() if not v]
    if missing:
        raise SystemExit(f"Faltan variables de entorno: {', '.join(missing)}")


def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def upsert_story(client: Client, story: dict[str, Any]) -> str:
    existing = (
        client.table(TABLE)
        .select("id")
        .eq("story_id", story["story_id"])
        .limit(1)
        .execute()
    )
    if existing.data:
        record_id = existing.data[0]["id"]
        client.table(TABLE).update(story).eq("id", record_id).execute()
        return "updated"
    client.table(TABLE).insert(story).execute()
    return "created"


def main() -> None:
    require_env()
    if not STORIES:
        raise SystemExit("No hay historias definidas. Edita la lista STORIES antes de ejecutar.")
    client = get_client()
    created, updated = [], []
    for story in STORIES:
        action = upsert_story(client, story)
        (created if action == "created" else updated).append(story["story_id"])

    print(json.dumps({
        "table": TABLE,
        "created": created,
        "updated": updated,
        "total": len(STORIES),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
