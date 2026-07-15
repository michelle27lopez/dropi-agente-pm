#!/usr/bin/env python3
"""
jira_publisher.py — Create or update JIRA issues from structured markdown.

Usage:
    python scripts/jira_publisher.py epic   <file.md>              # Create epic
    python scripts/jira_publisher.py story  <file.md> --epic KEY   # Create story under epic
    python scripts/jira_publisher.py sub    <file.md> --parent KEY # Create subtask
    python scripts/jira_publisher.py --dry-run epic <file.md>      # Validate without creating

The script reads a structured markdown file (with YAML frontmatter) and maps
it to JIRA issue fields. It supports Dropi's naming conventions:
    - Epic title:   [ProductCode]: Name_Country_UsersAffected
    - Story title:  [Label] ProductCode: Descriptive Name
    - Subtask:      [Label] ProductCode: Descriptive Name

Requires:
    - JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env
    - pip install requests pyyaml
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.config import jira as jira_cfg

try:
    import requests
    import yaml
except ImportError:
    print("❌ Missing dependencies. Run: pip install requests pyyaml")
    sys.exit(1)


# ── Markdown parser ───────────────────────────────────────────────────

def parse_markdown_doc(filepath: Path) -> dict:
    """Parse a structured markdown file with YAML frontmatter into a dict."""
    content = filepath.read_text(encoding="utf-8")

    # Extract frontmatter
    frontmatter = {}
    body = content
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if fm_match:
        try:
            frontmatter = yaml.safe_load(fm_match.group(1)) or {}
        except yaml.YAMLError:
            pass
        body = fm_match.group(2)

    # Extract sections by heading
    sections = {}
    current_heading = "_intro"
    current_content = []

    for line in body.split("\n"):
        heading_match = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading_match:
            if current_content:
                sections[current_heading] = "\n".join(current_content).strip()
            current_heading = heading_match.group(2).strip()
            current_content = []
        else:
            current_content.append(line)

    if current_content:
        sections[current_heading] = "\n".join(current_content).strip()

    return {
        "frontmatter": frontmatter,
        "sections": sections,
        "raw_body": body,
        "source_file": str(filepath),
    }


# ── JIRA field mappers ────────────────────────────────────────────────

def build_epic_fields(doc: dict) -> dict:
    """Map parsed document to JIRA Epic fields."""
    fm = doc["frontmatter"]
    sections = doc["sections"]

    # Build title per Dropi format: [ProductCode]: Name_Country_Users
    product_code = fm.get("product_code", "DROPI")
    name = fm.get("name", fm.get("title", "Sin título"))
    country = fm.get("country", "")
    users = fm.get("users_affected", "")

    title_parts = [f"{product_code}: {name}"]
    if country:
        title_parts.append(country)
    if users:
        title_parts.append(users)
    title = "_".join(title_parts) if (country or users) else title_parts[0]

    # Build description from sections
    description_parts = []

    for section_name in [
        "Contexto", "Descripción del problema", "Context",
        "¿Qué buscamos?", "What we seek",
        "Fases del proceso", "Phases",
        "Criterios de éxito", "Success criteria",
        "Público objetivo", "Target audience",
    ]:
        if section_name in sections:
            description_parts.append(f"h3. {section_name}\n{sections[section_name]}")

    # Fallback: use raw body
    if not description_parts and doc["raw_body"].strip():
        description_parts.append(doc["raw_body"][:5000])

    description = "\n\n".join(description_parts)

    fields = {
        "project": {"key": jira_cfg.project_key},
        "summary": title,
        "issuetype": {"name": "Epic"},
        "description": _to_adf(description),
    }

    # Optional: labels
    labels = []
    if product_code:
        labels.append(product_code.replace(" ", "_"))
    if country:
        labels.append(country)
    if labels:
        fields["labels"] = labels

    return fields


def build_story_fields(doc: dict, epic_key: Optional[str] = None) -> dict:
    """Map parsed document to JIRA Story fields."""
    fm = doc["frontmatter"]
    sections = doc["sections"]

    # Build title: [Label] ProductCode: Name
    label_type = fm.get("label_type", "")
    product_code = fm.get("product_code", "DROPI")
    name = fm.get("name", fm.get("title", "Sin título"))

    if label_type:
        title = f"[{label_type}] {product_code}: {name}"
    else:
        title = f"{product_code}: {name}"

    # Build description
    description_parts = []

    # User story narrative
    narrative = fm.get("narrative", "")
    if not narrative:
        for key in ["Historia", "Story", "Narrative"]:
            if key in sections:
                narrative = sections[key]
                break

    if narrative:
        description_parts.append(f"h3. Historia de Usuario\n{narrative}")

    for section_name in [
        "Descripción del proceso", "Process description",
        "Flujo del usuario", "User flow",
        "Criterios de aceptación", "Acceptance criteria",
        "Condiciones adicionales", "Additional conditions",
        "Definición de Hecho", "Definition of Done",
    ]:
        if section_name in sections:
            description_parts.append(f"h3. {section_name}\n{sections[section_name]}")

    if not description_parts and doc["raw_body"].strip():
        description_parts.append(doc["raw_body"][:5000])

    description = "\n\n".join(description_parts)

    fields = {
        "project": {"key": jira_cfg.project_key},
        "summary": title,
        "issuetype": {"name": "Story"},
        "description": _to_adf(description),
    }

    if epic_key:
        # JIRA Cloud uses customfield for epic link or parent
        fields["parent"] = {"key": epic_key}

    labels = []
    if label_type:
        labels.append(label_type)
    if product_code:
        labels.append(product_code.replace(" ", "_"))
    if labels:
        fields["labels"] = labels

    return fields


def build_subtask_fields(doc: dict, parent_key: str) -> dict:
    """Map parsed document to JIRA Sub-task fields."""
    fm = doc["frontmatter"]

    label_type = fm.get("label_type", "")
    product_code = fm.get("product_code", "DROPI")
    name = fm.get("name", fm.get("title", "Sin título"))

    if label_type:
        title = f"[{label_type}] {product_code}: {name}"
    else:
        title = f"{product_code}: {name}"

    description = doc["raw_body"][:5000] if doc["raw_body"].strip() else ""

    fields = {
        "project": {"key": jira_cfg.project_key},
        "summary": title,
        "issuetype": {"name": "Sub-task"},
        "description": _to_adf(description),
        "parent": {"key": parent_key},
    }

    return fields


def _to_adf(text: str) -> dict:
    """Convert plain text to Atlassian Document Format (ADF) for JIRA Cloud API v3."""
    # Split into paragraphs
    paragraphs = text.split("\n\n") if text else [""]
    content = []

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # Handle headings (h3. Title)
        heading_match = re.match(r"^h(\d)\.\s+(.+)$", para, re.MULTILINE)
        if heading_match:
            level = int(heading_match.group(1))
            heading_text = heading_match.group(2)
            remaining = para[heading_match.end():].strip()

            content.append({
                "type": "heading",
                "attrs": {"level": min(level, 6)},
                "content": [{"type": "text", "text": heading_text}],
            })

            if remaining:
                content.append({
                    "type": "paragraph",
                    "content": [{"type": "text", "text": remaining}],
                })
        else:
            content.append({
                "type": "paragraph",
                "content": [{"type": "text", "text": para}],
            })

    return {
        "version": 1,
        "type": "doc",
        "content": content or [{"type": "paragraph", "content": [{"type": "text", "text": " "}]}],
    }


# ── JIRA API ──────────────────────────────────────────────────────────

def _auth():
    """Return auth tuple for requests."""
    return (jira_cfg.email, jira_cfg.api_token)


def _headers():
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def create_issue(fields: dict, dry_run: bool = False) -> Optional[dict]:
    """Create a JIRA issue. Returns the created issue data or None."""
    payload = {"fields": fields}

    if dry_run:
        print("\n🔍 DRY RUN — Would create issue with fields:")
        print(json.dumps(payload, indent=2, ensure_ascii=False, default=str))
        return {"key": "DRY-RUN-000", "id": "0", "self": "dry-run"}

    url = f"{jira_cfg.api_url}/issue"
    resp = requests.post(url, json=payload, auth=_auth(), headers=_headers())

    if resp.status_code in (200, 201):
        data = resp.json()
        print(f"✅ Created: {data['key']} — {jira_cfg.base_url}/browse/{data['key']}")
        return data
    else:
        print(f"❌ Error creating issue: {resp.status_code}")
        print(resp.text)
        return None


def update_issue(issue_key: str, fields: dict, dry_run: bool = False) -> bool:
    """Update an existing JIRA issue."""
    payload = {"fields": fields}

    if dry_run:
        print(f"\n🔍 DRY RUN — Would update {issue_key} with fields:")
        print(json.dumps(payload, indent=2, ensure_ascii=False, default=str))
        return True

    url = f"{jira_cfg.api_url}/issue/{issue_key}"
    resp = requests.put(url, json=payload, auth=_auth(), headers=_headers())

    if resp.status_code in (200, 204):
        print(f"✅ Updated: {issue_key}")
        return True
    else:
        print(f"❌ Error updating {issue_key}: {resp.status_code}")
        print(resp.text)
        return False


def search_issue(summary: str) -> Optional[dict]:
    """Search for an existing issue by summary."""
    jql = f'project = {jira_cfg.project_key} AND summary ~ "{summary}"'
    url = f"{jira_cfg.api_url}/search"
    resp = requests.get(
        url,
        params={"jql": jql, "maxResults": 5, "fields": "summary,status,issuetype"},
        auth=_auth(),
        headers=_headers(),
    )

    if resp.status_code == 200:
        issues = resp.json().get("issues", [])
        if issues:
            return issues[0]
    return None


# ── Main ──────────────────────────────────────────────────────────────

def publish(issue_type: str, filepath: str, parent_key: Optional[str] = None, dry_run: bool = False):
    """Parse markdown and publish to JIRA."""
    if not jira_cfg.is_configured:
        print("❌ JIRA is not configured. Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env")
        return

    path = Path(filepath)
    if not path.exists():
        print(f"❌ File not found: {filepath}")
        return

    print(f"📄 Parsing: {path.name}")
    doc = parse_markdown_doc(path)

    if issue_type == "epic":
        fields = build_epic_fields(doc)
    elif issue_type == "story":
        if not parent_key:
            print("⚠️  Stories need --epic KEY to link to an epic")
        fields = build_story_fields(doc, parent_key)
    elif issue_type == "sub":
        if not parent_key:
            print("❌ Subtasks require --parent KEY")
            return
        fields = build_subtask_fields(doc, parent_key)
    else:
        print(f"❌ Unknown issue type: {issue_type}. Use: epic, story, sub")
        return

    print(f"📋 Issue type: {issue_type}")
    print(f"📝 Summary: {fields['summary']}")

    result = create_issue(fields, dry_run=dry_run)
    if result and not dry_run:
        print(f"\n🔗 Link: {jira_cfg.base_url}/browse/{result['key']}")


def main():
    parser = argparse.ArgumentParser(description="Publish structured markdown to JIRA")
    parser.add_argument("type", choices=["epic", "story", "sub"], help="Issue type to create")
    parser.add_argument("file", help="Path to the structured markdown file")
    parser.add_argument("--epic", type=str, help="Epic key to link a story to (e.g., DROPI-123)")
    parser.add_argument("--parent", type=str, help="Parent key for subtasks (e.g., DROPI-456)")
    parser.add_argument("--dry-run", action="store_true", help="Validate format without creating")
    args = parser.parse_args()

    parent = args.epic or args.parent
    publish(args.type, args.file, parent_key=parent, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
