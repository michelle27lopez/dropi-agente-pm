#!/usr/bin/env python3
"""
Granola AI Client & Sync Utility for Dropi.
Allows fetching meeting notes, summaries, and transcripts from Granola API.

Usage:
  python3 scripts/granola_client.py list
  python3 scripts/granola_client.py get <note_id>
  python3 scripts/granola_client.py search <query>
  python3 scripts/granola_client.py sync [--output-dir research-brain/granola_notes]
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

BASE_URL = "https://public-api.granola.ai/v1"

def load_env():
    """Loads .env file if present."""
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())

class GranolaClient:
    def __init__(self, api_key: str = None):
        load_env()
        self.api_key = api_key or os.environ.get("GRANOLA_API_KEY")
        if not self.api_key:
            raise ValueError("GRANOLA_API_KEY not found in environment or .env file.")

    def _request(self, endpoint: str, params: dict = None):
        url = f"{BASE_URL}{endpoint}"
        if params:
            query = urllib.parse.urlencode(params)
            url += f"?{query}"
        
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Dropi-Agente-PM/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            raise RuntimeError(f"Granola API error ({e.code}): {err_body}")

    def list_notes(self, limit: int = 50, cursor: str = None):
        """Fetches a page of notes."""
        params = {}
        if limit:
            params["limit"] = limit
        if cursor:
            params["cursor"] = cursor
        return self._request("/notes", params if params else None)

    def get_all_notes(self):
        """Fetches all notes across all pages using cursor pagination."""
        all_notes = []
        cursor = None
        has_more = True
        while has_more:
            resp = self.list_notes(limit=50, cursor=cursor)
            notes = resp.get("notes", [])
            all_notes.extend(notes)
            has_more = resp.get("hasMore", False)
            cursor = resp.get("cursor")
            if not cursor:
                break
        return all_notes


    def get_note(self, note_id: str):
        """Fetches detailed note by ID."""
        return self._request(f"/notes/{note_id}")

    def get_full_transcript(self, note_id: str) -> str:
        """Fetches and formats complete transcript with speaker names and timestamps."""
        all_entries = []
        cursor = None
        has_more = True
        
        while has_more:
            params = {}
            if cursor:
                params["cursor"] = cursor
            try:
                resp = self._request(f"/notes/{note_id}/transcript", params if params else None)
            except Exception as e:
                print(f"⚠️ Error fetching transcript for {note_id}: {e}", file=sys.stderr)
                break
                
            if isinstance(resp, list):
                entries = resp
                has_more = False  # list response contains entries directly
            elif isinstance(resp, dict):
                entries = resp.get("transcript") or resp.get("data") or []
                has_more = resp.get("hasMore", False)
                cursor = resp.get("cursor")
            else:
                entries = []
                has_more = False

            if not isinstance(entries, list):
                break
            all_entries.extend(entries)
            
            if not cursor or not has_more:
                break
                
        if not all_entries:
            return ""
            
        formatted_lines = []
        for entry in all_entries:
            if not isinstance(entry, dict):
                continue
            text = entry.get("text", "").strip()
            if not text:
                continue
            speaker_info = entry.get("speaker", {}) or {}
            speaker_name = speaker_info.get("name") or ("Yo" if speaker_info.get("attribution") == "me" else "Participante")
            
            start_time = entry.get("start_time", "")
            time_str = ""
            if "T" in start_time:
                time_str = f"[{start_time.split('T')[1][:5]}] "
                
            formatted_lines.append(f"- **{time_str}{speaker_name}:** {text}")
            
        return "\n".join(formatted_lines)


    def sync_to_markdown(self, output_dir: str = "research-brain/granola_notes"):
        """Syncs all available notes across all pages to markdown files in output_dir."""
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)
        
        notes = self.get_all_notes()
        synced_files = []
        
        for note_summary in notes:
            note_id = note_summary["id"]
            try:
                full_note = self.get_note(note_id)
            except Exception as e:
                print(f"⚠️ Could not fetch details for {note_id}: {e}", file=sys.stderr)
                full_note = note_summary

            title = full_note.get("title", "Untitled Note")
            created_at = full_note.get("created_at", "")[:10]
            
            # Clean title for filename
            clean_title = "".join(c if c.isalnum() or c in (" ", "_", "-") else "" for c in title).strip().replace(" ", "_")
            filename = f"{created_at}_{clean_title}_{note_id}.md"
            filepath = out_path / filename

            # Format Markdown
            lines = [
                f"# {title}",
                "",
                f"- **ID:** `{note_id}`",
                f"- **Fecha:** {full_note.get('created_at', 'N/A')}",
                f"- **Owner:** {full_note.get('owner', {}).get('name', 'N/A')} ({full_note.get('owner', {}).get('email', '')})",
            ]

            if full_note.get("web_url"):
                lines.append(f"- **URL Granola:** [Ver en Granola]({full_note['web_url']})")

            attendees = full_note.get("attendees", [])
            if attendees:
                att_str = ", ".join(a.get("name") or a.get("email") for a in attendees)
                lines.append(f"- **Asistentes:** {att_str}")

            lines.append("")
            lines.append("---")
            lines.append("")

            summary_md = full_note.get("summary_markdown")
            summary_text = full_note.get("summary_text")

            if summary_md:
                lines.append("## Resumen de la Reunión")
                lines.append(summary_md)
            elif summary_text:
                lines.append("## Resumen de la Reunión")
                lines.append(summary_text)

            # Fetch full word-for-word transcript from /transcript endpoint
            transcript_text = self.get_full_transcript(note_id)
            if transcript_text:
                lines.append("")
                lines.append("## Transcripción Completa (Palabra por Palabra)")
                lines.append(transcript_text)

            with open(filepath, "w", encoding="utf-8") as f:
                f.write("\n".join(lines))

            synced_files.append(str(filepath))
            print(f"✅ Sincronizada con Transcripción: {filename}")

        return synced_files


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1].lower()
    client = GranolaClient()

    if cmd == "list":
        notes = client.get_all_notes()
        print(f"\n📋 Encontradas {len(notes)} notas en Granola (todas las páginas):\n")
        for n in notes:
            created = n.get("created_at", "")[:10]
            print(f"• [{n['id']}] {created} - {n.get('title', 'Sin título')} (Owner: {n.get('owner', {}).get('name')})")
        print()

    elif cmd == "get":
        if len(sys.argv) < 3:
            print("Error: Especifica el ID de la nota (ej. python3 scripts/granola_client.py get not_xxx)")
            sys.exit(1)
        note_id = sys.argv[2]
        note = client.get_note(note_id)
        print(json.dumps(note, indent=2, ensure_ascii=False))

    elif cmd == "search":
        if len(sys.argv) < 3:
            print("Error: Especifica el término de búsqueda")
            sys.exit(1)
        query = sys.argv[2].lower()
        notes = client.get_all_notes()
        matches = [n for n in notes if query in n.get("title", "").lower()]
        print(f"\n🔍 Coincidencias para '{query}' ({len(matches)}):\n")
        for n in matches:
            print(f"• [{n['id']}] {n.get('title')} ({n.get('created_at', '')[:10]})")
        print()


    elif cmd == "sync":
        out_dir = "research-brain/granola_notes"
        if "--output-dir" in sys.argv:
            idx = sys.argv.index("--output-dir")
            if idx + 1 < len(sys.argv):
                out_dir = sys.argv[idx + 1]
        print(f"🔄 Sincronizando notas de Granola hacia {out_dir}...")
        synced = client.sync_to_markdown(out_dir)
        print(f"\n✨ ¡Listo! Se sincronizaron {len(synced)} notas.")

    else:
        print(f"Comando no reconocido: {cmd}")
        print(__doc__)

if __name__ == "__main__":
    main()
