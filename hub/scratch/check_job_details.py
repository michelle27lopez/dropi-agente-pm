import requests
import json

API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def check_job():
    job_id = "53015ec9-7448-4728-bd91-0cfbd7188052"
    url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs/{job_id}"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        print("Job Details:")
        print(json.dumps(res.json(), indent=2))
    else:
        print(f"Error checking job: {res.status_code} - {res.text}")

if __name__ == "__main__":
    check_job()
