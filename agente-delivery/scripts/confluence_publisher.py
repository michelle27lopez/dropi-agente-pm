#!/usr/bin/env python3
"""
confluence_publisher.py — Publish structured markdown documents to Confluence.

Usage:
    python scripts/confluence_publisher.py <file.md>                  # Create page
    python scripts/confluence_publisher.py <file.md> --parent PAGE_ID # Under a parent page
    python scripts/confluence_publisher.py <file.md> --update PAGE_ID # Update existing page
    python scripts/confluence_publisher.py --dry-run <file.md>        # Validate without publishing
    python scripts/confluence_publisher.py --list                     # List published pages

Supported document types (auto-detected):
    kickoff, pitch, research, launch_brief, epic, user_flow, planning, moscow

Requires:
    - CONFLUENCE_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env
    - pip install requests pyyaml markdown
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.config import confluence as conf_cfg, DOCS_SYNC_DIR

try:
    import requests
    import yaml
except ImportError:
    print("❌ Missing dependencies. Run: pip install requests pyyaml")
    sys.exit(1)


# ── Markdown → Confluence Storage Format ──────────────────────────────

def markdown_to_confluence_html(md_text: str) -> str:
    """Convert markdown to Confluence storage format (XHTML).

    Handles the most common patterns without requiring a full markdown library.
    """
    lines = md_text.split("\n")
    html_parts = []
    in_code_block = False
    code_lang = ""
    code_lines = []
    in_table = False
    table_rows = []

    for line in lines:
        # Code blocks
        if line.strip().startswith("```"):
            if in_code_block:
                # Close code block
                code_content = "\n".join(code_lines)
                lang_attr = f' ac:language="{code_lang}"' if code_lang else ""
                html_parts.append(
                    f'<ac:structured-macro ac:name="code">'
                    f'<ac:parameter ac:name="language">{code_lang or "text"}</ac:parameter>'
                    f'<ac:plain-text-body><![CDATA[{code_content}]]></ac:plain-text-body>'
                    f'</ac:structured-macro>'
                )
                in_code_block = False
                code_lines = []
                code_lang = ""
            else:
                in_code_block = True
                code_lang = line.strip().lstrip("`").strip()
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        # Tables
        if "|" in line and line.strip().startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            # Skip separator rows (|---|---|)
            if all(re.match(r"^[-:]+$", c) for c in cells):
                continue
            if not in_table:
                in_table = True
                table_rows = []
            table_rows.append(cells)
            continue
        elif in_table:
            # Flush table
            html_parts.append(_build_table_html(table_rows))
            in_table = False
            table_rows = []

        # Headings
        heading_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            text = _inline_format(heading_match.group(2))
            html_parts.append(f"<h{level}>{text}</h{level}>")
            continue

        # Horizontal rules
        if re.match(r"^[-*_]{3,}\s*$", line):
            html_parts.append("<hr/>")
            continue

        # Blockquotes
        if line.strip().startswith("> "):
            quote_text = _inline_format(line.strip()[2:])
            html_parts.append(f"<blockquote><p>{quote_text}</p></blockquote>")
            continue

        # Unordered list items
        ul_match = re.match(r"^(\s*)[-*]\s+(.+)$", line)
        if ul_match:
            text = _inline_format(ul_match.group(2))
            html_parts.append(f"<ul><li>{text}</li></ul>")
            continue

        # Ordered list items
        ol_match = re.match(r"^(\s*)\d+\.\s+(.+)$", line)
        if ol_match:
            text = _inline_format(ol_match.group(2))
            html_parts.append(f"<ol><li>{text}</li></ol>")
            continue

        # Empty line
        if not line.strip():
            continue

        # Regular paragraph
        html_parts.append(f"<p>{_inline_format(line)}</p>")

    # Flush remaining table
    if in_table:
        html_parts.append(_build_table_html(table_rows))

    return "\n".join(html_parts)


def _inline_format(text: str) -> str:
    """Apply inline formatting (bold, italic, code, links)."""
    # Bold
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    # Inline code
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    # Links
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    return text


def _build_table_html(rows: list[list[str]]) -> str:
    """Build an HTML table from parsed rows."""
    if not rows:
        return ""

    html = ['<table><tbody>']

    for i, row in enumerate(rows):
        html.append("<tr>")
        tag = "th" if i == 0 else "td"
        for cell in row:
            html.append(f"<{tag}>{_inline_format(cell)}</{tag}>")
        html.append("</tr>")

    html.append("</tbody></table>")
    return "".join(html)


# ── Parse frontmatter ─────────────────────────────────────────────────

def parse_document(filepath: Path) -> dict:
    """Parse markdown document with optional YAML frontmatter."""
    content = filepath.read_text(encoding="utf-8")

    frontmatter = {}
    body = content
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if fm_match:
        try:
            frontmatter = yaml.safe_load(fm_match.group(1)) or {}
        except yaml.YAMLError:
            pass
        body = fm_match.group(2)

    # Determine title
    title = frontmatter.get("title", frontmatter.get("original_name", ""))
    if not title:
        # Use first heading
        heading_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        if heading_match:
            title = heading_match.group(1)
        else:
            title = filepath.stem.replace("-", " ").replace("_", " ").title()

    return {
        "title": title,
        "frontmatter": frontmatter,
        "body": body,
        "html_body": markdown_to_confluence_html(body),
        "doc_type": frontmatter.get("doc_type", "unknown"),
        "source_file": str(filepath),
    }


# ── Confluence API ────────────────────────────────────────────────────

def _auth():
    return (conf_cfg.email, conf_cfg.api_token)


def _headers():
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def create_page(
    title: str,
    html_body: str,
    parent_id: Optional[str] = None,
    dry_run: bool = False,
) -> Optional[dict]:
    """Create a new Confluence page."""
    payload = {
        "type": "page",
        "title": title,
        "space": {"key": conf_cfg.space_key},
        "body": {
            "storage": {
                "value": html_body,
                "representation": "storage",
            }
        },
    }

    if parent_id:
        payload["ancestors"] = [{"id": parent_id}]

    if dry_run:
        print("\n🔍 DRY RUN — Would create page:")
        print(f"   Title: {title}")
        print(f"   Space: {conf_cfg.space_key}")
        print(f"   Parent: {parent_id or 'root'}")
        print(f"   Body length: {len(html_body)} chars")
        return {"id": "DRY-RUN", "title": title, "_links": {"webui": "/dry-run"}}

    url = f"{conf_cfg.api_url}/content"
    resp = requests.post(url, json=payload, auth=_auth(), headers=_headers())

    if resp.status_code in (200, 201):
        data = resp.json()
        page_url = f"{conf_cfg.base_url}{data['_links']['webui']}"
        print(f"✅ Created: {data['title']}")
        print(f"🔗 URL: {page_url}")
        return data
    else:
        print(f"❌ Error creating page: {resp.status_code}")
        try:
            error_data = resp.json()
            print(f"   Message: {error_data.get('message', resp.text[:200])}")
        except Exception:
            print(f"   Response: {resp.text[:200]}")
        return None


def update_page(
    page_id: str,
    title: str,
    html_body: str,
    dry_run: bool = False,
) -> bool:
    """Update an existing Confluence page."""
    if dry_run:
        print(f"\n🔍 DRY RUN — Would update page {page_id}:")
        print(f"   Title: {title}")
        print(f"   Body length: {len(html_body)} chars")
        return True

    # First, get current version number
    url = f"{conf_cfg.api_url}/content/{page_id}"
    resp = requests.get(url, auth=_auth(), headers=_headers())

    if resp.status_code != 200:
        print(f"❌ Could not fetch page {page_id}: {resp.status_code}")
        return False

    current = resp.json()
    current_version = current["version"]["number"]

    payload = {
        "version": {"number": current_version + 1},
        "title": title,
        "type": "page",
        "body": {
            "storage": {
                "value": html_body,
                "representation": "storage",
            }
        },
    }

    resp = requests.put(url, json=payload, auth=_auth(), headers=_headers())

    if resp.status_code == 200:
        data = resp.json()
        page_url = f"{conf_cfg.base_url}{data['_links']['webui']}"
        print(f"✅ Updated: {data['title']} (v{data['version']['number']})")
        print(f"🔗 URL: {page_url}")
        return True
    else:
        print(f"❌ Error updating page: {resp.status_code}")
        print(resp.text[:200])
        return False


def search_page(title: str) -> Optional[dict]:
    """Search for an existing page by title in the configured space."""
    url = f"{conf_cfg.api_url}/content"
    resp = requests.get(
        url,
        params={
            "spaceKey": conf_cfg.space_key,
            "title": title,
            "expand": "version",
        },
        auth=_auth(),
        headers=_headers(),
    )

    if resp.status_code == 200:
        results = resp.json().get("results", [])
        if results:
            return results[0]
    return None


# ── Publish index (local tracking) ────────────────────────────────────

PUBLISH_INDEX_PATH = DOCS_SYNC_DIR / "_confluence_index.json"


def load_publish_index() -> dict:
    """Load the Confluence publish tracking index."""
    if PUBLISH_INDEX_PATH.exists():
        return json.loads(PUBLISH_INDEX_PATH.read_text(encoding="utf-8"))
    return {"pages": {}}


def save_publish_index(index: dict):
    """Save the publish index."""
    DOCS_SYNC_DIR.mkdir(parents=True, exist_ok=True)
    PUBLISH_INDEX_PATH.write_text(
        json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def list_published():
    """Show published pages."""
    index = load_publish_index()
    if not index["pages"]:
        print("📭 No pages published yet.")
        return

    print("📄 Published Confluence pages:\n")
    for source, info in index["pages"].items():
        print(f"  {info.get('title', 'Unknown')}")
        print(f"    Page ID: {info.get('page_id', '?')}")
        print(f"    Source:  {source}")
        print()


# ── Main ──────────────────────────────────────────────────────────────

def publish(
    filepath: str,
    parent_id: Optional[str] = None,
    update_id: Optional[str] = None,
    dry_run: bool = False,
):
    """Parse and publish a markdown document to Confluence."""
    if not conf_cfg.is_configured:
        print("❌ Confluence is not configured. Set CONFLUENCE_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env")
        return

    path = Path(filepath)
    if not path.exists():
        print(f"❌ File not found: {filepath}")
        return

    print(f"📄 Parsing: {path.name}")
    doc = parse_document(path)
    print(f"   Title: {doc['title']}")
    print(f"   Type: {doc['doc_type']}")

    if update_id:
        # Update existing page
        success = update_page(update_id, doc["title"], doc["html_body"], dry_run=dry_run)
        if success and not dry_run:
            index = load_publish_index()
            index["pages"][str(path)] = {
                "page_id": update_id,
                "title": doc["title"],
                "doc_type": doc["doc_type"],
            }
            save_publish_index(index)
    else:
        # Check if page already exists
        existing = search_page(doc["title"]) if not dry_run else None
        if existing:
            print(f"⚠️  Page already exists: {existing['title']} (id: {existing['id']})")
            print(f"   Use --update {existing['id']} to update it")
            return

        # Create new page
        result = create_page(doc["title"], doc["html_body"], parent_id=parent_id, dry_run=dry_run)
        if result and not dry_run:
            index = load_publish_index()
            index["pages"][str(path)] = {
                "page_id": result["id"],
                "title": doc["title"],
                "doc_type": doc["doc_type"],
            }
            save_publish_index(index)


def main():
    parser = argparse.ArgumentParser(description="Publish markdown to Confluence")
    parser.add_argument("file", nargs="?", help="Path to the markdown file")
    parser.add_argument("--parent", type=str, help="Parent page ID")
    parser.add_argument("--update", type=str, help="Page ID to update")
    parser.add_argument("--dry-run", action="store_true", help="Validate without publishing")
    parser.add_argument("--list", action="store_true", help="List published pages")
    args = parser.parse_args()

    if args.list:
        list_published()
    elif args.file:
        publish(args.file, parent_id=args.parent, update_id=args.update, dry_run=args.dry_run)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
