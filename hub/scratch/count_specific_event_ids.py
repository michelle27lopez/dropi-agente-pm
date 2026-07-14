import requests
import gzip
import io
import json

api_key = "692d64b9e344913f"
job_id = "562a97dc-c95a-45c1-ba98-85a782a92e2b"

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

# Specific IDs we want to count
target_ids = {"668", "674", "679"}
counts = {tid: 0 for tid in target_ids}
sample_events = {tid: None for tid in target_ids}

print("Counting occurrences of IDs 668, 674, 679...")

for i, url in enumerate(download_urls):
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
                # Fast string checks
                if any(tid in line for tid in target_ids):
                    try:
                        event = json.loads(line)
                        event_name = event.get("event") or event.get("event_name")
                        if str(event_name) in target_ids:
                            counts[str(event_name)] += 1
                            if sample_events[str(event_name)] is None:
                                sample_events[str(event_name)] = event
                    except Exception:
                        pass
    except Exception as e:
        print(f"Error decompressing part {i+1}: {e}")

print("\n=== COUNTS FOUND ===")
for tid, count in counts.items():
    print(f" - Event ID {tid}: {count} occurrences")
    
print("\n=== SAMPLES OF EVENTS ===")
for tid, sample in sample_events.items():
    print(f"\nID {tid} Sample:")
    print(json.dumps(sample, indent=2))
