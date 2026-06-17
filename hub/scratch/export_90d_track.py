import requests
from datetime import datetime, timedelta

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

start_date_str = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
end_date_str = datetime.now().strftime("%Y-%m-%d")

payload = {
    "start_date": start_date_str,
    "end_date": end_date_str,
    "from": start_date_str,
    "to": end_date_str,
    "event_types": ["track"],
    "format": "json"
}

url = "https://appex.userpilot.io/api/v1/analytics/exports"

print("Creating 90 days track export job...")
res = requests.post(url, headers=headers, json=payload, timeout=15)
print(f"Status: {res.status_code}")
print(f"Response: {res.text}")
