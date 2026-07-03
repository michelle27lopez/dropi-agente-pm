from supabase import create_client

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"

def count_nulls():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Count of role = SUPPLIER
    res_supplier = supabase.table("userpilot_suppliers").select("count", count="exact").eq("role", "SUPPLIER").execute()
    print("Total suppliers in DB:", res_supplier.count)
    
    # Count of role = SUPPLIER with signed_up is null
    res_null = supabase.table("userpilot_suppliers").select("count", count="exact").eq("role", "SUPPLIER").is_("signed_up", "null").execute()
    print("Suppliers with signed_up = NULL:", res_null.count)
    
    # Count of role = SUPPLIER with signed_up is NOT null
    res_not_null = supabase.table("userpilot_suppliers").select("count", count="exact").eq("role", "SUPPLIER").not_.is_("signed_up", "null").execute()
    print("Suppliers with signed_up != NULL:", res_not_null.count)

if __name__ == "__main__":
    count_nulls()
