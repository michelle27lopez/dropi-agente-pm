import requests
import gzip
import io
import json

api_key = "692d64b9e344913f"
job_id = "75a9afaa-c81e-4847-9aae-56607ecf0e76"

headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

status_url = f"https://appex.userpilot.io/api/v1/analytics/exports/jobs/{job_id}"
res = requests.get(status_url, headers=headers, timeout=10)
if res.status_code != 200:
    print(f"Error checking status: {res.status_code}")
    exit(1)

data = res.json()
presigned = data.get("presigned_urls")
if presigned and isinstance(presigned, list):
    download_urls = [item.get("url") for item in presigned if item.get("url")]
else:
    download_urls = data.get("download_urls") or [data.get("download_url")]

if not download_urls or not download_urls[0]:
    print("Could not retrieve download URLs.")
    exit(1)

keywords = ["garantia", "warranty", "claim", "reclamacion", "ticket", "emprendedor"]
matching_events = []
sampled_events = []

print("Scanning events for warranty/guarantee keywords...")

for i, url in enumerate(download_urls):
    if len(matching_events) >= 100:
        break
    print(f"Scanning part {i+1}...")
    res = requests.get(url, timeout=30)
    if res.status_code != 200:
        continue
    
    compressed_stream = io.BytesIO(res.content)
    try:
        with gzip.GzipFile(fileobj=compressed_stream) as gz:
            text_stream = io.TextIOWrapper(gz, encoding='utf-8')
            for line in text_stream:
                if not line:
                    continue
                try:
                    event = json.loads(line)
                    # Get all text fields
                    event_str = line.lower()
                    
                    # Store a sample of track events for debugging
                    event_type = event.get("event") or event.get("event_type")
                    if event_type in ("track", "track_feature") and len(sampled_events) < 10:
                        sampled_events.append(event)
                        
                    # Check for keyword match
                    matched_kw = [kw for kw in keywords if kw in event_str]
                    if matched_kw:
                        matching_events.append((matched_kw, event))
                        if len(matching_events) >= 100:
                            break
                except Exception:
                    pass
    except Exception as e:
        print(f"Error decompressing part {i+1}: {e}")

print(f"\n=== MATCHING EVENTS FOUND: {len(matching_events)} ===")
for kws, ev in matching_events[:20]:
    print(f"\nMatched keywords: {kws}")
    print(json.dumps(ev, indent=2))

print(f"\n=== SAMPLED TRACK EVENTS ===")
for ev in sampled_events:
    print(json.dumps(ev, indent=2))
