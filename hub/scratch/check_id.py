from supabase import create_client
import json

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"

def check_id():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Check 904525
    res = supabase.table("userpilot_suppliers").select("*").eq("user_id", "904525").execute()
    print("Record for 904525:")
    print(json.dumps(res.data, indent=2))
    
    # Check 900510
    res2 = supabase.table("userpilot_suppliers").select("*").eq("user_id", "900510").execute()
    print("\nRecord for 900510:")
    print(json.dumps(res2.data, indent=2))

if __name__ == "__main__":
    check_id()
