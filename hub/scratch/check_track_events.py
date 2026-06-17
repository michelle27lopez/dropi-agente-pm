import requests
import time
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

print(f"Polling status of export job {job_id}...")
download_urls = []

for attempt in range(1, 20):
    res = requests.get(status_url, headers=headers, timeout=10)
    if res.status_code == 200:
        data = res.json()
        status = data.get("status")
        print(f"  Attempt {attempt}: Status is '{status}'")
        if status == "completed":
            presigned = data.get("presigned_urls")
            if presigned and isinstance(presigned, list):
                download_urls = [item.get("url") for item in presigned if item.get("url")]
            else:
                download_urls = data.get("download_urls") or [data.get("download_url")]
            break
        elif status == "failed":
            print("  Job failed on Userpilot servers.")
            break
    else:
        print(f"  Error checking status: {res.status_code} - {res.text}")
    time.sleep(5)

if not download_urls or not download_urls[0]:
    print("Could not retrieve download URLs.")
    exit(1)

print(f"Found {len(download_urls)} parts to download.")
unique_events = {}

for i, url in enumerate(download_urls):
    if not url:
        continue
    print(f"Downloading part {i+1}...")
    res = requests.get(url, timeout=30)
    if res.status_code == 200:
        print(f"  Decompressing and parsing events...")
        compressed_stream = io.BytesIO(res.content)
        try:
            with gzip.GzipFile(fileobj=compressed_stream) as gz:
                text_stream = io.TextIOWrapper(gz, encoding='utf-8')
                line_count = 0
                for line in text_stream:
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                        event_name = event.get("event") or event.get("event_type") or event.get("name")
                        if event_name:
                            unique_events[event_name] = unique_events.get(event_name, 0) + 1
                        line_count += 1
                    except Exception as e:
                        pass
                print(f"  Successfully processed {line_count} events from part {i+1}.")
        except Exception as e:
            print(f"  Error decompressing: {e}")

print("\n=== UNIQUE EVENT NAMES FOUND ===")
for name, count in sorted(unique_events.items(), key=lambda x: x[1], reverse=True):
    print(f" - {name}: {count} occurrences")
