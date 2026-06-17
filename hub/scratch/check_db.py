import sys
from supabase import create_client

env_path = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/.env.local"
env_vars = {}

try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error loading env: {e}")
    sys.exit(1)

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

res = supabase.table("userpilot_suppliers").select("signed_up").execute()
dates = [r["signed_up"] for r in res.data if r.get("signed_up")]
print(f"Total records in DB: {len(res.data)}")
print(f"Records with signed_up: {len(dates)}")
if dates:
    print(f"Min signed_up: {min(dates)}")
    print(f"Max signed_up: {max(dates)}")
    
    # count within 90 days of 2026-05-25
    from datetime import datetime, timedelta
    ref = datetime.fromisoformat("2026-05-25T10:30:00-05:00")
    limit_90 = ref - timedelta(days=90)
    print(f"90 days limit: {limit_90.isoformat()}")
    
    within_90 = 0
    older = 0
    for d in dates:
        try:
            # Parse ISO date (handle milliseconds and offset timezone)
            # Simplistic parsing since it's ISO format
            dt = datetime.fromisoformat(d.replace("Z", "+00:00"))
            if dt >= limit_90:
                within_90 += 1
            else:
                older += 1
        except Exception as e:
            print(f"Error parsing date {d}: {e}")
    print(f"Records within last 90 days: {within_90}")
    print(f"Records older than 90 days: {older}")
else:
    print("No signup dates found")
