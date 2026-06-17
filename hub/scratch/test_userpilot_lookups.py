import requests
import json

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

base_url = "https://appex.userpilot.io"

# Common lookups endpoints
endpoints = [
    "/api/v1/analytics/exports/lookups/features",
    "/api/v1/analytics/lookups/features",
    "/api/v1/analytics/exports/lookups/events",
    "/api/v1/analytics/lookups/events",
    "/api/v1/analytics/exports/lookups",
    "/api/v1/analytics/lookups"
]

print("Querying Userpilot metadata lookups...")

for endpoint in endpoints:
    url = f"{base_url}{endpoint}"
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"GET {endpoint} -> Status: {res.status_code}")
        if res.status_code == 200:
            data = res.json()
            # print first 5 items
            print(f"  [SUCCESS] Total items: {len(data) if isinstance(data, list) else 'dict'}")
            print(f"  Sample: {str(data)[:500]}")
        elif res.status_code != 404:
            print(f"  Response: {res.text[:150]}")
    except Exception as e:
        print(f"GET {endpoint} -> ERROR: {e}")
