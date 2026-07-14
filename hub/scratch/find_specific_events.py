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

search_terms = ["garantias_mis", "solo recolectar", "crear garantia"]
matches = []

print("Scanning for specific funnel events...")

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
                try:
                    event_str = line.lower()
                    matched = [term for term in search_terms if term in event_str]
                    if matched:
                        event = json.loads(line)
                        matches.append((matched, event))
                        if len(matches) >= 50:
                            break
                except Exception:
                    pass
    except Exception as e:
        print(f"Error decompressing part {i+1}: {e}")
    if len(matches) >= 50:
        break

print(f"\n=== MATCHES FOUND: {len(matches)} ===")
for terms, ev in matches[:20]:
    print(f"\nMatched terms: {terms}")
    print(json.dumps(ev, indent=2))
