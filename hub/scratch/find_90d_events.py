import requests
import time
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

print(f"Polling status of export job {job_id}...")
download_urls = []

for attempt in range(1, 40):
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
    time.sleep(10)

if not download_urls or not download_urls[0]:
    print("Could not retrieve download URLs.")
    exit(1)

print(f"Found {len(download_urls)} parts to download.")
search_terms = ["garantias_mis", "solo recolectar", "crear garantia"]
matches = []

for i, url in enumerate(download_urls):
    print(f"Scanning part {i+1}...")
    res = requests.get(url, timeout=45)
    if res.status_code != 200:
        continue
    
    compressed_stream = io.BytesIO(res.content)
    try:
        with gzip.GzipFile(fileobj=compressed_stream) as gz:
            text_stream = io.TextIOWrapper(gz, encoding='utf-8')
            for line in text_stream:
                if not line:
                    continue
                # Fast pre-filtering to avoid string lowercasing and array iterations on 99.9% of lines
                if 'garantia' in line or 'Garantia' in line or 'recolectar' in line or 'Recolectar' in line:
                    try:
                        event_str = line.lower()
                        matched = [term for term in search_terms if term in event_str]
                        if matched:
                            event = json.loads(line)
                            matches.append((matched, event))
                            if len(matches) >= 100:
                                break
                    except Exception:
                        pass
    except Exception as e:
        print(f"Error decompressing part {i+1}: {e}")
    if len(matches) >= 100:
        break

print(f"\n=== MATCHES FOUND: {len(matches)} ===")
for terms, ev in matches:
    print(f"\nMatched terms: {terms}")
    print(json.dumps(ev, indent=2))
