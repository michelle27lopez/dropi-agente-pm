"""
Shared configuration for PM OS scripts.
Loads environment variables from .env and exposes typed config objects.
"""

import os
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional; env vars can be set directly


# ── Paths ──────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DOCS_SYNC_DIR = PROJECT_ROOT / "docs-sync"
CANON_DIR = PROJECT_ROOT / "canon"
SCHEMA_DIR = PROJECT_ROOT / "schema"


@dataclass
class SupabaseConfig:
    url: str = field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    service_key: str = field(default_factory=lambda: os.getenv("SUPABASE_SERVICE_KEY", ""))

    @property
    def is_configured(self) -> bool:
        return bool(self.url and self.service_key)


@dataclass
class GoogleDriveConfig:
    folder_id: str = field(default_factory=lambda: os.getenv("GOOGLE_DRIVE_FOLDER_ID", ""))
    service_account_json: str = field(default_factory=lambda: os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", ""))
    # Supported export formats for Google Workspace files
    export_formats: dict = field(default_factory=lambda: {
        "application/vnd.google-apps.document": ("text/plain", ".txt"),
        "application/vnd.google-apps.spreadsheet": ("text/csv", ".csv"),
        "application/vnd.google-apps.presentation": ("text/plain", ".txt"),
    })

    @property
    def is_configured(self) -> bool:
        return bool(self.folder_id and self.service_account_json)


@dataclass
class JiraConfig:
    base_url: str = field(default_factory=lambda: os.getenv("JIRA_BASE_URL", ""))
    email: str = field(default_factory=lambda: os.getenv("JIRA_EMAIL", ""))
    api_token: str = field(default_factory=lambda: os.getenv("JIRA_API_TOKEN", ""))
    project_key: str = field(default_factory=lambda: os.getenv("JIRA_PROJECT_KEY", "DROPI"))

    @property
    def is_configured(self) -> bool:
        return bool(self.base_url and self.email and self.api_token)

    @property
    def api_url(self) -> str:
        return f"{self.base_url.rstrip('/')}/rest/api/3"


@dataclass
class ConfluenceConfig:
    base_url: str = field(default_factory=lambda: os.getenv("CONFLUENCE_BASE_URL", ""))
    email: str = field(default_factory=lambda: os.getenv("JIRA_EMAIL", ""))  # Same Atlassian account
    api_token: str = field(default_factory=lambda: os.getenv("JIRA_API_TOKEN", ""))  # Same token
    space_key: str = field(default_factory=lambda: os.getenv("CONFLUENCE_SPACE_KEY", "PROD"))

    @property
    def is_configured(self) -> bool:
        return bool(self.base_url and self.email and self.api_token)

    @property
    def api_url(self) -> str:
        return f"{self.base_url.rstrip('/')}/rest/api"


# ── Singletons ─────────────────────────────────────────────────────────
supabase = SupabaseConfig()
drive = GoogleDriveConfig()
jira = JiraConfig()
confluence = ConfluenceConfig()


def check_all() -> dict[str, bool]:
    """Return readiness status for each integration."""
    return {
        "supabase": supabase.is_configured,
        "google_drive": drive.is_configured,
        "jira": jira.is_configured,
        "confluence": confluence.is_configured,
    }


if __name__ == "__main__":
    status = check_all()
    for name, ready in status.items():
        icon = "✅" if ready else "❌"
        print(f"  {icon} {name}")
