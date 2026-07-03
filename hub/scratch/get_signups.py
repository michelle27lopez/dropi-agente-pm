import os
import json
from supabase import create_client

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"

def get_signups():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Try querying after July 29, 2025 (since today is June 30, 2026)
    print("Querying database for all suppliers signed up after July 29, 2025 (paginated)...")
    try:
        all_data = []
        limit = 1000
        offset = 0
        while True:
            res_2025 = supabase.table("userpilot_suppliers")\
                .select("user_id, name, email, signed_up, country, role")\
                .eq("role", "SUPPLIER")\
                .gt("signed_up", "2025-07-29T00:00:00")\
                .range(offset, offset + limit - 1)\
                .order("signed_up")\
                .execute()
            if not res_2025.data:
                break
            all_data.extend(res_2025.data)
            if len(res_2025.data) < limit:
                break
            offset += limit
            
        print(f"Found {len(all_data)} suppliers signed up after July 29, 2025.")
        if all_data:
            print("\nFirst 5 records from July 29, 2025:")
            for i, row in enumerate(all_data[:5]):
                print(f"  {i+1}. ID: {row['user_id']} | Name: {row['name']} | Email: {row['email']} | Signed Up: {row['signed_up']}")
            
            print("\nLast 5 records (most recent sign-ups):")
            for i, row in enumerate(all_data[-5:]):
                print(f"  {len(all_data)-4+i}. ID: {row['user_id']} | Name: {row['name']} | Email: {row['email']} | Signed Up: {row['signed_up']}")
            
            # Save all to a file
            output_file = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/suppliers_after_july_29_2025.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(all_data, f, indent=2)
            print(f"Saved all {len(all_data)} records to {output_file}")
    except Exception as e:
        print("Error querying 2025 signups:", e)

    # Try querying after June 29, 2026 (in case they meant June 29, 2026, which is yesterday)
    print("\nQuerying database for suppliers signed up after June 29, 2026...")
    try:
        res_2026 = supabase.table("userpilot_suppliers")\
            .select("user_id, name, email, signed_up, country, role")\
            .eq("role", "SUPPLIER")\
            .gt("signed_up", "2026-06-29T00:00:00")\
            .order("signed_up")\
            .execute()
            
        print(f"Found {len(res_2026.data)} suppliers signed up after June 29, 2026.")
        if res_2026.data:
            print("\nFirst 5 records from June 29, 2026:")
            for i, row in enumerate(res_2026.data[:5]):
                print(f"  {i+1}. ID: {row['user_id']} | Name: {row['name']} | Email: {row['email']} | Signed Up: {row['signed_up']}")
                
            output_file_2026 = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/suppliers_after_june_29_2026.json"
            with open(output_file_2026, 'w', encoding='utf-8') as f:
                json.dump(res_2026.data, f, indent=2)
            print(f"Saved all {len(res_2026.data)} records to {output_file_2026}")
    except Exception as e:
        print("Error querying 2026 signups:", e)

if __name__ == "__main__":
    get_signups()
