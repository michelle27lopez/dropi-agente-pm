import os
import json
import gzip
import io
import time
import requests
from datetime import datetime, timedelta
from supabase import create_client

SUPABASE_URL = "https://fwwkesboxlbmimzyoztq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d2tlc2JveGxibWltenlvenRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4MDMzMiwiZXhwIjoyMDkzNTU2MzMyfQ.rj3EkRLTS89tM3NbyftV023mWUbHIB4DvXU6cJZzVVU"
API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def parse_iso_date(date_str):
    if not date_str or date_str == '-' or date_str == '':
        return None
    return date_str

def parse_boolean(val):
    if not val:
        return False
    return str(val).strip().lower() in ('true', '1', 'yes')

def parse_integer(val):
    if not val or val == '-':
        return 0
    try:
        return int(float(val))
    except ValueError:
        return 0

def map_fields(event):
    user_id = event.get("user_id") or event.get("userId")
    if not user_id:
        return None
        
    attributes = event.get("attributes") or event.get("metadata") or event.get("properties") or {}
    
    # Normalize attributes keys to lowercase
    clean_attrs = {k.strip().lower().replace(' ', '_').replace('-', '_'): v for k, v in attributes.items() if k}
    
    # Map basic fields
    name = clean_attrs.get("name") or clean_attrs.get("full_name") or clean_attrs.get("display_name") or ""
    email = clean_attrs.get("email") or ""
    
    # Map dates
    first_seen = parse_iso_date(clean_attrs.get("first_seen")) or parse_iso_date(event.get("first_seen"))
    signed_up = parse_iso_date(clean_attrs.get("signed_up")) or parse_iso_date(clean_attrs.get("signed_up_date")) or parse_iso_date(clean_attrs.get("created_at"))
    last_seen = parse_iso_date(clean_attrs.get("last_seen")) or parse_iso_date(event.get("last_seen"))
    
    # Web sessions
    web_sessions = parse_integer(clean_attrs.get("web_sessions") or clean_attrs.get("sessions") or clean_attrs.get("session_count"))
    
    # Environment & Device
    # Country map
    country_code = event.get("country_code")
    country = clean_attrs.get("country")
    if not country and country_code:
        if country_code == "CO": country = "Colombia"
        elif country_code == "EC": country = "Ecuador"
        elif country_code == "MX": country = "México"
        elif country_code == "PE": country = "Perú"
        else: country = country_code
        
    device_type = clean_attrs.get("device_type") or event.get("device_type")
    browser_lang = clean_attrs.get("browser_language") or event.get("browser_language")
    browser = clean_attrs.get("browser") or event.get("browser")
    os_name = clean_attrs.get("os") or clean_attrs.get("operating_system") or event.get("operating_system")
    
    role = clean_attrs.get("role") or 'SUPPLIER'
    phone = clean_attrs.get("phone") or clean_attrs.get("phone_number")
    
    verified = parse_boolean(clean_attrs.get("verified"))
    billing_info = parse_boolean(clean_attrs.get("billing_information") or clean_attrs.get("billing_info"))
    
    owner_of_community = clean_attrs.get("owner_of_comunity") or clean_attrs.get("owner_of_community")
    belong_to_community = clean_attrs.get("belong_to_comunity") or clean_attrs.get("belong_to_community")
    referred_by = clean_attrs.get("referred_by")
    
    return {
        "user_id": str(user_id),
        "name": name.strip() if name else "",
        "email": email.strip() if email else "",
        "first_seen": first_seen,
        "signed_up": signed_up,
        "last_seen": last_seen,
        "web_sessions": web_sessions,
        "country": country,
        "device_type": device_type,
        "browser_language": browser_lang,
        "browser": browser,
        "os": os_name,
        "role": role.upper() if role else 'SUPPLIER',
        "phone": str(phone) if phone else None,
        "verified": verified,
        "billing_information": billing_info,
        "owner_of_community": owner_of_community,
        "belong_to_community": belong_to_community,
        "referred_by": referred_by
    }

def run_test_sync():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    today = datetime.now().strftime("%Y-%m-%d")
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    # 1. Trigger export
    url = f"{API_BASE_URL}/api/v1/analytics/exports"
    payload = {
        "start_date": yesterday,
        "end_date": today,
        "from": yesterday,
        "to": today,
        "event_types": ["identify_user"],
        "format": "json"
    }
    
    print("Triggering test export for identify_user...")
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code == 409:
        print("Active job already running, listing jobs...")
        res_list = requests.get(f"{API_BASE_URL}/api/v1/analytics/exports/jobs", headers=headers)
        jobs = res_list.json()
        active_jobs = [j for j in jobs if j.get("status") in ("pending", "processing")]
        if active_jobs:
            job_id = active_jobs[0]["id"]
        else:
            job_id = jobs[0]["job_id"]
    else:
        job_data = res.json()
        job_id = job_data.get("id") or job_data.get("job_id")
        
    print(f"Job ID: {job_id}")
    
    # 2. Poll job status
    status_url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs/{job_id}"
    download_url = None
    for _ in range(30):
        time.sleep(5)
        res_status = requests.get(status_url, headers=headers)
        if res_status.status_code == 200:
            data = res_status.json()
            status = data.get("status")
            print(f"Status: {status}")
            if status == "completed":
                presigned = data.get("presigned_urls")
                download_url = presigned[0]["url"] if presigned else (data.get("download_urls", [None])[0] or data.get("download_url"))
                break
            elif status == "failed":
                print("Job failed")
                return
                
    if not download_url:
        print("Timed out or no URL found")
        return
        
    # 3. Download and parse
    print("Downloading and parsing events...")
    res_file = requests.get(download_url)
    users = []
    if res_file.status_code == 200:
        compressed_stream = io.BytesIO(res_file.content)
        with gzip.GzipFile(fileobj=compressed_stream) as gz:
            text_stream = io.TextIOWrapper(gz, encoding='utf-8')
            for line in text_stream:
                if line.strip():
                    try:
                        event = json.loads(line)
                        if event.get("event_type") == "identify_user":
                            mapped = map_fields(event)
                            if mapped:
                                users.append(mapped)
                    except Exception as e:
                        pass
                        
    print(f"Parsed {len(users)} users from export.")
    
    # 4. Upsert a small batch to test
    if users:
        # Deduplicate
        unique_users = {}
        for u in users:
            unique_users[u["user_id"]] = u
        deduped = list(unique_users.values())
        print(f"Deduplicated to {len(deduped)} unique users.")
        
        # Print a sample of 2 users
        print("\nSample mapped user 1:", json.dumps(deduped[0], indent=2))
        if len(deduped) > 1:
            print("\nSample mapped user 2:", json.dumps(deduped[1], indent=2))
            
        # Test upserting the first 5 users to Supabase
        test_batch = deduped[:5]
        print(f"\nUpserting {len(test_batch)} users to Supabase to verify columns...")
        try:
            supabase.table("userpilot_suppliers").upsert(test_batch).execute()
            print("Successfully upserted test batch!")
            
            # Retrieve them to check
            test_ids = [u["user_id"] for u in test_batch]
            res_check = supabase.table("userpilot_suppliers").select("user_id, name, email, signed_up, country, role").in_("user_id", test_ids).execute()
            print("Verified data in Supabase:")
            print(json.dumps(res_check.data, indent=2))
        except Exception as e:
            print("Error upserting:", e)

if __name__ == "__main__":
    run_test_sync()
