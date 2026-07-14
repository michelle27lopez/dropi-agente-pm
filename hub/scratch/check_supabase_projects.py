import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: No database credentials found in environment.")
    exit(1)

client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def fetch_table(table_name):
    try:
        response = client.table(table_name).select("*").execute()
        return response.data
    except Exception as e:
        return f"Error fetching {table_name}: {e}"

tables_to_fetch = [
    "projects",
    "okrs",
    "milestones",
    "followups",
    "risks",
    "decisions",
    "approved_context",
    "draft_insights"
]

print("=== SUPABASE DATA DUMP ===")
for t in tables_to_fetch:
    data = fetch_table(t)
    if isinstance(data, list):
        print(f"\n--- Table: {t} ({len(data)} rows) ---")
        for i, row in enumerate(data[:15]):  # Show up to 15 rows
            print(f"Row {i+1}: {row}")
        if len(data) > 15:
            print(f"... and {len(data) - 15} more rows.")
    else:
        print(f"\n--- Table: {t} ---")
        print(data)
