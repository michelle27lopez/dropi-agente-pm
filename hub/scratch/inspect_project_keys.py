import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

for table in ["okrs", "milestones", "risks", "followups", "decisions", "draft_insights", "approved_context"]:
    try:
        data = client.table(table).select("*").limit(5).execute().data
        print(f"\n--- {table} keys ---")
        if data:
            for k in data[0].keys():
                if "proj" in k or k == "project":
                    print(f"Key '{k}': {data[0][k]}")
        else:
            print("No rows found")
    except Exception as e:
        print(f"Error on {table}: {e}")
