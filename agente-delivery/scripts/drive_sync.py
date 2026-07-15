#!/usr/bin/env python3
"""
drive_sync.py — Synchronize documents from a Google Drive folder to local
structured markdown files.

Usage:
    python scripts/drive_sync.py                  # Full sync
    python scripts/drive_sync.py --dry-run        # List files without downloading
    python scripts/drive_sync.py --list           # Show currently synced docs
    python scripts/drive_sync.py --detect <file>  # Detect document type of a local file

Requires:
    - GOOGLE_DRIVE_FOLDER_ID
    - GOOGLE_SERVICE_ACCOUNT_JSON (path to the service account key file)
    - pip install google-api-python-client google-auth PyPDF2
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Append parent so we can import config when run as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.config import drive as drive_cfg, DOCS_SYNC_DIR


# ── Document type detection ────────────────────────────────────────────

DOCUMENT_TYPE_PATTERNS = {
    "kickoff": [
        r"kickoff", r"kick[\s-]?off", r"arranque",
        r"título del proyecto.*introducción.*problema",
    ],
    "pitch": [
        r"\bpitch\b", r"apetencia", r"problema.*solución",
    ],
    "research": [
        r"research", r"investigación", r"hallazgos", r"dolores detectados",
        r"hipótesis.*validadas", r"social\s*listening",
    ],
    "planning": [
        r"planning", r"planificación", r"sprint", r"backlog",
    ],
    "moscow": [
        r"moscow", r"must\s+have.*should\s+have", r"priorización",
    ],
    "journey_map": [
        r"journey\s*map", r"mapa de viaje", r"experiencia del usuario",
    ],
    "empathy_map": [
        r"mapa de empatía", r"empathy\s*map", r"piensa.*siente.*dice.*hace",
    ],
    "epic": [
        r"épica", r"criterios de éxito", r"qué buscamos",
    ],
    "user_story": [
        r"historia de usuario", r"como\s+\[.*\],?\s*puedo", r"criterios de aceptación.*gherkin",
    ],
    "launch_brief": [
        r"brief de lanzamiento", r"launch\s*brief", r"mensajes y ángulos",
    ],
    "user_flow": [
        r"flujo de usuario", r"user\s*flow", r"flowchart",
    ],
    "transcript": [
        r"transcripción", r"transcript", r"reunión.*participantes",
    ],
}


def detect_document_type(text: str, filename: str = "") -> str:
    """Detect the document type from its content and filename.

    Returns the best matching type or 'unknown'.
    """
    combined = (filename + " " + text[:3000]).lower()
    scores: dict[str, int] = {}

    for doc_type, patterns in DOCUMENT_TYPE_PATTERNS.items():
        score = 0
        for pattern in patterns:
            matches = re.findall(pattern, combined, re.IGNORECASE)
            score += len(matches)
        if score > 0:
            scores[doc_type] = score

    if not scores:
        return "unknown"

    return max(scores, key=scores.get)


# ── Metadata ───────────────────────────────────────────────────────────

def build_metadata(
    drive_file: dict,
    doc_type: str,
    local_path: str,
) -> dict:
    """Build metadata dict for a synced document."""
    return {
        "drive_id": drive_file.get("id", ""),
        "name": drive_file.get("name", ""),
        "mime_type": drive_file.get("mimeType", ""),
        "doc_type": doc_type,
        "local_path": local_path,
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "modified_at": drive_file.get("modifiedTime", ""),
        "created_at": drive_file.get("createdTime", ""),
        "owners": [o.get("displayName", "") for o in drive_file.get("owners", [])],
        "parent_folders": drive_file.get("parents", []),
    }


def write_synced_doc(content: str, metadata: dict, output_dir: Path) -> Path:
    """Write synced content and metadata to docs-sync/."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Sanitize filename
    safe_name = re.sub(r"[^\w\s\-.]", "", metadata["name"])
    safe_name = re.sub(r"\s+", "-", safe_name.strip()).lower()
    if not safe_name:
        safe_name = metadata["drive_id"]

    # Write markdown
    md_path = output_dir / f"{safe_name}.md"
    frontmatter = (
        f"---\n"
        f"drive_id: {metadata['drive_id']}\n"
        f"doc_type: {metadata['doc_type']}\n"
        f"original_name: \"{metadata['name']}\"\n"
        f"synced_at: {metadata['synced_at']}\n"
        f"modified_at: {metadata['modified_at']}\n"
        f"---\n\n"
    )
    md_path.write_text(frontmatter + content, encoding="utf-8")

    # Write metadata JSON sidecar
    meta_path = output_dir / f"{safe_name}.meta.json"
    meta_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")

    return md_path


# ── Google Drive API helpers ───────────────────────────────────────────

def get_drive_service():
    """Build an authenticated Google Drive API service."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("❌ Missing dependencies. Run: pip install google-api-python-client google-auth")
        sys.exit(1)

    creds = service_account.Credentials.from_service_account_file(
        drive_cfg.service_account_json,
        scopes=["https://www.googleapis.com/auth/drive.readonly"],
    )
    return build("drive", "v3", credentials=creds)


def list_drive_files(service, folder_id: str) -> list[dict]:
    """List all files in a Drive folder (recursively)."""
    files = []
    query = f"'{folder_id}' in parents and trashed = false"
    page_token = None

    while True:
        response = service.files().list(
            q=query,
            fields="nextPageToken, files(id, name, mimeType, modifiedTime, createdTime, owners, parents)",
            pageToken=page_token,
            pageSize=100,
        ).execute()

        for f in response.get("files", []):
            if f["mimeType"] == "application/vnd.google-apps.folder":
                # Recurse into subfolders
                files.extend(list_drive_files(service, f["id"]))
            else:
                files.append(f)

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return files


def download_file_content(service, file_info: dict) -> Optional[str]:
    """Download file content as text. Handles Google Docs exports and PDFs."""
    mime = file_info["mimeType"]

    # Google Workspace files → export
    if mime in drive_cfg.export_formats:
        export_mime, _ = drive_cfg.export_formats[mime]
        content_bytes = service.files().export(
            fileId=file_info["id"],
            mimeType=export_mime,
        ).execute()
        if isinstance(content_bytes, bytes):
            return content_bytes.decode("utf-8", errors="replace")
        return str(content_bytes)

    # PDF → extract text
    if mime == "application/pdf":
        import io
        try:
            from PyPDF2 import PdfReader
        except ImportError:
            print(f"  ⚠️  Skipping PDF '{file_info['name']}' — install PyPDF2")
            return None

        content_bytes = service.files().get_media(fileId=file_info["id"]).execute()
        reader = PdfReader(io.BytesIO(content_bytes))
        text_parts = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
        return "\n\n".join(text_parts) if text_parts else None

    # Plain text / markdown / CSV
    if mime.startswith("text/") or mime in (
        "application/json",
        "application/xml",
    ):
        content_bytes = service.files().get_media(fileId=file_info["id"]).execute()
        if isinstance(content_bytes, bytes):
            return content_bytes.decode("utf-8", errors="replace")
        return str(content_bytes)

    # Unsupported
    print(f"  ⏭️  Skipping unsupported type '{mime}' for '{file_info['name']}'")
    return None


# ── Sync index ─────────────────────────────────────────────────────────

INDEX_PATH = DOCS_SYNC_DIR / "_index.json"


def load_index() -> dict:
    """Load the sync index (tracks what was already synced)."""
    if INDEX_PATH.exists():
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    return {"files": {}, "last_sync": None}


def save_index(index: dict):
    """Save the sync index."""
    DOCS_SYNC_DIR.mkdir(parents=True, exist_ok=True)
    index["last_sync"] = datetime.now(timezone.utc).isoformat()
    INDEX_PATH.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")


# ── Main ───────────────────────────────────────────────────────────────

def sync(dry_run: bool = False) -> list[dict]:
    """Full sync: download new/updated files from Drive."""
    if not drive_cfg.is_configured:
        print("❌ Google Drive is not configured. Set GOOGLE_DRIVE_FOLDER_ID and GOOGLE_SERVICE_ACCOUNT_JSON in .env")
        return []

    print(f"🔄 Connecting to Google Drive folder: {drive_cfg.folder_id}")
    service = get_drive_service()
    files = list_drive_files(service, drive_cfg.folder_id)
    print(f"📂 Found {len(files)} file(s) in Drive")

    index = load_index()
    synced = []

    for f in files:
        file_id = f["id"]
        modified = f.get("modifiedTime", "")

        # Skip if already synced and not modified
        if file_id in index["files"]:
            if index["files"][file_id].get("modified_at") == modified:
                print(f"  ⏭️  {f['name']} (unchanged)")
                continue

        if dry_run:
            print(f"  📄 {f['name']} ({f['mimeType']}) — would sync")
            synced.append({"name": f["name"], "action": "would_sync"})
            continue

        print(f"  ⬇️  Downloading: {f['name']}")
        content = download_file_content(service, f)
        if content is None:
            continue

        doc_type = detect_document_type(content, f["name"])
        metadata = build_metadata(f, doc_type, "")
        local_path = write_synced_doc(content, metadata, DOCS_SYNC_DIR)
        metadata["local_path"] = str(local_path)

        # Update index
        index["files"][file_id] = {
            "name": f["name"],
            "doc_type": doc_type,
            "local_path": str(local_path),
            "modified_at": modified,
            "synced_at": metadata["synced_at"],
        }

        print(f"  ✅ Synced as {doc_type}: {local_path.name}")
        synced.append(metadata)

    if not dry_run:
        save_index(index)

    print(f"\n{'🔍 Dry run' if dry_run else '✅ Sync'} complete. {len(synced)} file(s) processed.")
    return synced


def list_synced():
    """Show currently synced documents."""
    index = load_index()
    if not index["files"]:
        print("📭 No synced documents yet. Run: python scripts/drive_sync.py")
        return

    print(f"📚 Synced documents (last sync: {index.get('last_sync', 'never')}):\n")
    for file_id, info in index["files"].items():
        print(f"  [{info['doc_type']:>15}]  {info['name']}")
        print(f"                     → {info['local_path']}")
        print()


def detect_local(filepath: str):
    """Detect document type of a local file."""
    p = Path(filepath)
    if not p.exists():
        print(f"❌ File not found: {filepath}")
        return

    content = p.read_text(encoding="utf-8", errors="replace")
    doc_type = detect_document_type(content, p.name)
    print(f"📄 {p.name}")
    print(f"   Type: {doc_type}")


def main():
    parser = argparse.ArgumentParser(description="Sync Google Drive documents to local markdown")
    parser.add_argument("--dry-run", action="store_true", help="List files without downloading")
    parser.add_argument("--list", action="store_true", help="Show currently synced docs")
    parser.add_argument("--detect", type=str, help="Detect document type of a local file")
    args = parser.parse_args()

    if args.list:
        list_synced()
    elif args.detect:
        detect_local(args.detect)
    else:
        sync(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
