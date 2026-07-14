import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_data(table):
    try:
        return client.table(table).select("*").execute().data
    except Exception as e:
        print(f"Error fetching {table}: {e}")
        return []

projects = get_data("projects")
print(f"=== PROJECTS ({len(projects)}) ===")
for p in projects:
    print(f"ID: {p['id']} | Name: {p['name']} | Code: {p.get('project_code')} | Status: {p['status']} | Owner: {p.get('owner')}")

print("\n=== DRAFT INSIGHTS SUMMARY ===")
drafts = get_data("draft_insights")
print(f"Total drafts: {len(drafts)}")
for d in drafts[:10]:
    print(f"- Project: {d.get('project') or d.get('project_id')} | Type: {d['draft_type']} | Title: {d['title']} | Status: {d['status']}")

print("\n=== APPROVED CONTEXT SUMMARY ===")
approved = get_data("approved_context")
print(f"Total approved context items: {len(approved)}")
for a in approved[:10]:
    print(f"- Project: {a.get('project') or a.get('project_id')} | Type: {a['context_type']} | Title: {a['title']} | Status: {a['status']}")

print("\n=== OKRS ===")
okrs = get_data("okrs")
for o in okrs:
    print(f"- Project: {o.get('project')} | Objective: {o.get('objective')} | Status: {o.get('status')}")

print("\n=== MILESTONES ===")
milestones = get_data("milestones")
for m in milestones:
    print(f"- Project: {m.get('project')} | Name: {m.get('name')} | Status: {m.get('status')} | Date: {m.get('target_date')}")

print("\n=== RISKS ===")
risks = get_data("risks")
for r in risks:
    print(f"- Project: {r.get('project')} | Title: {r.get('title')} | Impact: {r.get('impact')} | Status: {r.get('status')}")

print("\n=== FOLLOWUPS ===")
followups = get_data("followups")
for f in followups:
    print(f"- Project: {f.get('project')} | Title: {f.get('title')} | Owner: {f.get('owner')} | Status: {f.get('status')} | Due: {f.get('due_date')}")
