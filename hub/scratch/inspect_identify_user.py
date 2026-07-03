import requests
import time
import gzip
import io
import json
from datetime import datetime, timedelta

API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def inspect_identify():
    today = datetime.now().strftime("%Y-%m-%d")
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    url = f"{API_BASE_URL}/api/v1/analytics/exports"
    payload = {
        "start_date": yesterday,
        "end_date": today,
        "from": yesterday,
        "to": today,
        "event_types": ["identify_user"],
        "format": "json"
    }
    
    print("Triggering identify_user export...")
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code == 409:
        print("Job already running, fetching jobs...")
        res_list = requests.get(f"{API_BASE_URL}/api/v1/analytics/exports/jobs", headers=headers)
        if res_list.status_code == 200:
            jobs = res_list.json()
            active_jobs = [j for j in jobs if j.get("status") in ("pending", "processing")]
            if active_jobs:
                job_id = active_jobs[0]["id"]
            else:
                print("No jobs found")
                return
        else:
            return
    elif res.status_code in (200, 201):
        job_data = res.json()
        job_id = job_data.get("id") or job_data.get("job_id")
        if not job_id:
            print("Response does not contain id or job_id:", job_data)
            return
    else:
        print(f"Error: {res.status_code} - {res.text}")
        return

    status_url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs/{job_id}"
    print(f"Polling job {job_id}...")
    for _ in range(20):
        res = requests.get(status_url, headers=headers)
        if res.status_code == 200:
            data = res.json()
            status = data.get("status")
            print(f"Status: {status}")
            if status == "completed":
                presigned = data.get("presigned_urls")
                if presigned:
                    download_url = presigned[0]["url"]
                else:
                    download_url = data.get("download_urls", [None])[0] or data.get("download_url")
                break
        time.sleep(5)
    else:
        print("Timeout polling")
        return

    if not download_url:
        print("No download URL")
        return

    print("Downloading sample...")
    res_file = requests.get(download_url)
    if res_file.status_code == 200:
        compressed_stream = io.BytesIO(res_file.content)
        with gzip.GzipFile(fileobj=compressed_stream) as gz:
            text_stream = io.TextIOWrapper(gz, encoding='utf-8')
            count = 0
            for line in text_stream:
                if line.strip():
                    try:
                        event_data = json.loads(line)
                        event_type = event_data.get("event_type") or event_data.get("event")
                        if event_type == "identify_user":
                            print(f"\n--- Identify User Event {count + 1} ---")
                            print(json.dumps(event_data, indent=2))
                            count += 1
                            if count >= 3:
                                break
                    except Exception as e:
                        print("Error parsing:", e)
    else:
        print("Failed to download:", res_file.status_code)

if __name__ == "__main__":
    inspect_identify()
