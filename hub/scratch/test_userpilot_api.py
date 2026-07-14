import requests
import json

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

# We will test two base URLs
base_urls = [
    "https://appex.userpilot.io",
    "https://analytex-us.userpilot.io"
]

endpoints = [
    "/api/v1/dashboards",
    "/api/v1/dashboards/49",
    "/v1/dashboards",
    "/v1/dashboards/49",
    "/api/v1/analytics/dashboards",
    "/v1/analytics/dashboards",
    "/api/v1/analytics/dashboards/49",
    "/api/v1/analytics/exports/jobs",
    "/v1/analytics/exports/jobs"
]

print("Starting Userpilot API Endpoint diagnostic test...")

for base in base_urls:
    print(f"\n=== Testing base URL: {base} ===")
    for endpoint in endpoints:
        url = f"{base.rstrip('/')}{endpoint}"
        try:
            # Let's try GET first
            res = requests.get(url, headers=headers, timeout=10)
            print(f"GET {endpoint} -> Status: {res.status_code}")
            if res.status_code == 200:
                print(f"  [SUCCESS] Data: {res.text[:300]}")
            elif res.status_code != 404:
                print(f"  Response: {res.text[:150]}")
        except Exception as e:
            print(f"GET {endpoint} -> ERROR: {e}")

        try:
            # Let's also try POST on exports just to see
            if "exports" in endpoint:
                res = requests.post(url, headers=headers, json={}, timeout=10)
                print(f"POST {endpoint} -> Status: {res.status_code}")
                if res.status_code != 404:
                    print(f"  Response: {res.text[:150]}")
        except Exception as e:
            print(f"POST {endpoint} -> ERROR: {e}")
