from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from supabase import create_client, Client

ROOT = Path.cwd()
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
APPROVED_TABLE = "approved_context"
DRAFT_TABLE = "draft_insights"

VALID_CONTEXT_TYPES = [
    "Business Context", "ASIS", "TOBE", "Capability",
    "Feature", "User Story", "Risk", "Decision", "Operating Rule",
    "HU", "Epica", "Definition", "Open Question", "Summary",
    "E2E Kick-off", "E2E Discovery", "E2E Definición", "E2E Following", "E2E Hand-off"
]
VALID_DRAFT_TYPES = [
    "Business Context", "ASIS", "TOBE", "Capability",
    "Feature", "User Story", "Risk", "Decision", "Summary", "Open Question",
    "HU", "Epica", "E2E Kick-off", "E2E Discovery", "E2E Definición", "E2E Following", "E2E Hand-off"
]


class ContextWriterError(Exception):
    pass


def require_env() -> None:
    missing = [k for k, v in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY}.items() if not v]
    if missing:
        raise ContextWriterError(f"Faltan variables de entorno: {', '.join(missing)}")


def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip()).strip("-")
    return value.lower() or "item"


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def read_content(args: argparse.Namespace) -> str:
    if args.content_file:
        return Path(args.content_file).read_text(encoding="utf-8")
    if args.content:
        return args.content
    data = sys.stdin.read()
    if data.strip():
        return data
    raise ContextWriterError("Envía contenido con --content-file, --content o stdin")


def resolve_type(raw: str, valid: list[str]) -> str:
    raw_norm = re.sub(r"[^a-z0-9]+", "", raw.lower())
    for t in valid:
        if re.sub(r"[^a-z0-9]+", "", t.lower()) == raw_norm:
            return t
    raise ContextWriterError(f"Tipo no reconocido: '{raw}'. Válidos: {valid}")


def latest_version(client: Client, project: str, context_type: str) -> int:
    result = (
        client.table(APPROVED_TABLE)
        .select("version")
        .eq("project", project)
        .eq("context_type", context_type)
        .order("version", desc=True)
        .limit(1)
        .execute()
    )
    if result.data:
        return int(result.data[0]["version"] or 0)
    return 0


def supersede_existing(client: Client, project: str, context_type: str) -> list[str]:
    result = (
        client.table(APPROVED_TABLE)
        .select("id")
        .eq("project", project)
        .eq("context_type", context_type)
        .eq("status", "Active")
        .execute()
    )
    ids = [r["id"] for r in result.data]
    for record_id in ids:
        client.table(APPROVED_TABLE).update({"status": "Superseded"}).eq("id", record_id).execute()
    return ids


def cmd_publish(args: argparse.Namespace) -> None:
    require_env()
    client = get_client()
    content = read_content(args)
    context_type = resolve_type(args.context_type, VALID_CONTEXT_TYPES)
    next_version = latest_version(client, args.project, context_type) + 1
    superseded = supersede_existing(client, args.project, context_type)

    title = args.title or f"{context_type} v{next_version}"
    context_id = f"ctx-{slugify(args.project)}-{slugify(context_type)}-v{next_version}"
    record = {
        "context_id": context_id,
        "project": args.project,
        "context_type": context_type,
        "title": title,
        "approved_content": content,
        "version": next_version,
        "status": "Active",
        "source_references": args.source_refs or "",
        "approved_by": args.approved_by or "Jaime",
        "approved_at": now_iso(),
    }
    created = client.table(APPROVED_TABLE).insert(record).execute()

    if args.sync_file:
        sync_path = Path(args.sync_file)
        sync_path.parent.mkdir(parents=True, exist_ok=True)
        sync_path.write_text(content, encoding="utf-8")

    print(json.dumps({
        "action": "publish",
        "project": args.project,
        "context_type": context_type,
        "version": next_version,
        "superseded_ids": superseded,
        "created": created.data,
        "synced_file": args.sync_file or None,
    }, ensure_ascii=False, indent=2))


def cmd_draft(args: argparse.Namespace) -> None:
    require_env()
    client = get_client()
    content = read_content(args)
    draft_type = resolve_type(args.draft_type, VALID_DRAFT_TYPES)
    ts = datetime.now().strftime("%Y%m%d%H%M%S")
    draft_id = f"draft-{slugify(args.project)}-{slugify(draft_type)}-{ts}"
    record: dict[str, Any] = {
        "draft_id": draft_id,
        "project": args.project,
        "meeting_id": args.meeting_id or "",
        "draft_type": draft_type,
        "title": args.title or draft_id,
        "content": content,
        "status": args.status or "Draft",
    }
    if args.version_hint is not None:
        record["version_hint"] = args.version_hint
    created = client.table(DRAFT_TABLE).insert(record).execute()
    print(json.dumps({
        "action": "draft",
        "project": args.project,
        "draft_type": draft_type,
        "created": created.data,
    }, ensure_ascii=False, indent=2))


def cmd_show_active(args: argparse.Namespace) -> None:
    require_env()
    client = get_client()
    context_type = resolve_type(args.context_type, VALID_CONTEXT_TYPES)
    result = (
        client.table(APPROVED_TABLE)
        .select("*")
        .eq("project", args.project)
        .eq("context_type", context_type)
        .eq("status", "Active")
        .order("version", desc=True)
        .limit(5)
        .execute()
    )
    print(json.dumps({
        "action": "show_active",
        "project": args.project,
        "context_type": context_type,
        "records": result.data,
    }, ensure_ascii=False, indent=2))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Escritor de contexto oficial y borradores — PM Operating System")
    sub = parser.add_subparsers(dest="command", required=True)

    pub = sub.add_parser("publish", help="Publica una nueva versión oficial en approved_context")
    pub.add_argument("--project", required=True)
    pub.add_argument("--context-type", required=True)
    pub.add_argument("--title")
    pub.add_argument("--content-file")
    pub.add_argument("--content")
    pub.add_argument("--approved-by")
    pub.add_argument("--source-refs")
    pub.add_argument("--sync-file", help="Ruta local a sincronizar con la versión vigente")
    pub.set_defaults(func=cmd_publish)

    dr = sub.add_parser("draft", help="Crea un borrador en draft_insights")
    dr.add_argument("--project", required=True)
    dr.add_argument("--draft-type", required=True)
    dr.add_argument("--meeting-id")
    dr.add_argument("--title")
    dr.add_argument("--content-file")
    dr.add_argument("--content")
    dr.add_argument("--status", default="Draft")
    dr.add_argument("--version-hint", type=int)
    dr.set_defaults(func=cmd_draft)

    show = sub.add_parser("show-active", help="Muestra la versión activa de un contexto")
    show.add_argument("--project", required=True)
    show.add_argument("--context-type", required=True)
    show.set_defaults(func=cmd_show_active)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    try:
        main()
    except ContextWriterError as exc:
        raise SystemExit(str(exc))
