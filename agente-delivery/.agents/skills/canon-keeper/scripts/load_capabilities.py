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
TABLE = "capabilities"

# Replace this list with the capabilities of the active project before running.
CAPABILITIES: list[dict[str, Any]] = [
    # {
    #     "capability_id": "CAP-001",
    #     "project": "Nombre del proyecto",
    #     "name": "Nombre de la capacidad",
    #     "purpose": "Objetivo de esta capacidad.",
    #     "scope": "Qué incluye.",
    #     "expected_outcome": "Resultado esperado.",
    #     "exclusions": "Qué no incluye.",
    #     "status": "Proposed",
    #     "version": "1",
    #     "source_references": "Fuente de origen.",
    # },
]


def require_env() -> None:
    missing = [k for k, v in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY}.items() if not v]
    if missing:
        raise SystemExit(f"Faltan variables de entorno: {', '.join(missing)}")


def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def upsert_capability(client: Client, cap: dict[str, Any]) -> str:
    existing = (
        client.table(TABLE)
        .select("id")
        .eq("capability_id", cap["capability_id"])
        .limit(1)
        .execute()
    )
    if existing.data:
        record_id = existing.data[0]["id"]
        client.table(TABLE).update(cap).eq("id", record_id).execute()
        return "updated"
    client.table(TABLE).insert(cap).execute()
    return "created"


def main() -> None:
    require_env()
    if not CAPABILITIES:
        raise SystemExit("No hay capacidades definidas. Edita la lista CAPABILITIES antes de ejecutar.")
    client = get_client()
    created, updated = [], []
    for cap in CAPABILITIES:
        action = upsert_capability(client, cap)
        (created if action == "created" else updated).append(cap["capability_id"])

    print(json.dumps({
        "table": TABLE,
        "created": created,
        "updated": updated,
        "total": len(CAPABILITIES),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
