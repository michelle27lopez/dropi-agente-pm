from supabase import create_client

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"

def get_max_date():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        # Get newest signed_up supplier
        res = supabase.table("userpilot_suppliers")\
            .select("signed_up")\
            .not_.is_("signed_up", "null")\
            .order("signed_up", desc=True)\
            .limit(1)\
            .execute()
        if res.data:
            print("Newest non-null signed_up in DB:", res.data[0]["signed_up"])
        else:
            print("No non-null data in DB")
            
        # Get oldest signed_up supplier
        res_old = supabase.table("userpilot_suppliers")\
            .select("signed_up")\
            .not_.is_("signed_up", "null")\
            .order("signed_up")\
            .limit(1)\
            .execute()
        if res_old.data:
            print("Oldest signed_up in DB:", res_old.data[0]["signed_up"])
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    get_max_date()
