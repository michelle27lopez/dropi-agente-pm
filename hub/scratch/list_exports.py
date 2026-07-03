import requests
import json

API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def list_jobs():
    url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        print("Jobs in Userpilot:")
        print(json.dumps(res.json(), indent=2))
    else:
        print(f"Error listing jobs: {res.status_code} - {res.text}")

if __name__ == "__main__":
    list_jobs()
