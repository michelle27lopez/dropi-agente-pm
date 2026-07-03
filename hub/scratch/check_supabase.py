import os
from supabase import create_client

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"

def check_db():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("--- 1. Querying total count of suppliers in userpilot_suppliers ---")
    try:
        res = supabase.table("userpilot_suppliers").select("count", count="exact").limit(1).execute()
        print("Total suppliers count in DB:", res.count)
    except Exception as e:
        print("Error getting count:", e)
        return
        
    print("\n--- 2. Inspecting a few rows to see schema and role values ---")
    try:
        res_rows = supabase.table("userpilot_suppliers").select("*").limit(3).execute()
        if res_rows.data:
            for i, row in enumerate(res_rows.data):
                print(f"\nRow {i+1}:")
                for k, v in row.items():
                    print(f"  {k}: {v}")
        else:
            print("No rows found.")
    except Exception as e:
        print("Error getting rows:", e)
        
    print("\n--- 3. Group by role to check distinct roles ---")
    try:
        # Since Supabase JS/Python client doesn't support group_by directly easily, we can select roles and count in python
        res_roles = supabase.table("userpilot_suppliers").select("role").execute()
        roles = [row.get("role") for row in res_roles.data]
        from collections import Counter
        print("Role counts in DB:", Counter(roles))
    except Exception as e:
        print("Error getting roles:", e)

if __name__ == "__main__":
    check_db()
