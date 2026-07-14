import requests
import json

api_key = "692d64b9e344913f"
job_id = "6b00b86e-7228-4eef-9241-c9957f95fe5f"
status_url = f"https://appex.userpilot.io/api/v1/analytics/exports/jobs/{job_id}"

headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

res = requests.get(status_url, headers=headers)
print("Status Code:", res.status_code)
try:
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print("Error parsing JSON:", e)
    print("Raw text:", res.text)
