from __future__ import annotations

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client

ROOT = Path(__file__).resolve().parents[4]
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SCHEMA_PATH = ROOT / "schema" / "supabase_schema.sql"
REPORT_PATH = ROOT / os.getenv("BOOTSTRAP_REPORT_PATH", "logs/bootstrap_report.md")

EXPECTED_TABLES = [
    "projects", "teams", "meetings", "transcripts", "draft_insights",
    "approved_context", "okrs", "capabilities", "features", "user_stories",
    "decisions", "risks", "followups", "milestones",
]


class BootstrapError(Exception):
    pass


def require_env() -> None:
    missing = [k for k, v in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY}.items() if not v]
    if missing:
        raise BootstrapError(f"Faltan variables de entorno requeridas: {', '.join(missing)}")


def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def check_tables(client: Client) -> tuple[list[str], list[str]]:
    present = []
    missing = []
    for table in EXPECTED_TABLES:
        try:
            client.table(table).select("id").limit(1).execute()
            present.append(table)
        except Exception:
            missing.append(table)
    return present, missing


def write_report(present: list[str], missing: list[str]) -> None:
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Bootstrap report — Supabase\n",
        f"## URL\n\n{SUPABASE_URL}\n",
        "## Tablas presentes\n",
        *[f"- {t}" for t in present],
        "\n## Tablas faltantes\n",
        *([f"- {t}" for t in missing] if missing else ["- Ninguna"]),
        "\n## Acción recomendada\n",
    ]
    if missing:
        lines.append(f"Aplica el schema en Supabase SQL Editor:\n`{SCHEMA_PATH}`\n")
    else:
        lines.append("El schema está completo. No se requiere acción.\n")
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    require_env()
    client = get_client()
    present, missing = check_tables(client)
    write_report(present, missing)
    result = {
        "present_tables": present,
        "missing_tables": missing,
        "schema_path": str(SCHEMA_PATH),
        "report_path": str(REPORT_PATH),
        "status": "ok" if not missing else "missing_tables",
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except BootstrapError as exc:
        raise SystemExit(str(exc))
