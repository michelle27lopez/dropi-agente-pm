import requests

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

bases = ["https://appex.userpilot.io", "https://analytex-us.userpilot.io"]

paths = [
    "/api/v1/analytics/exports/lookups/features-events",
    "/api/v1/analytics/exports/lookups/features_events",
    "/api/v1/analytics/exports/lookups/features",
    "/api/v1/analytics/exports/lookups/events",
    "/api/v1/analytics/exports/lookups/flows",
    "/api/v1/analytics/exports/lookups/user-properties",
    "/api/v1/analytics/exports/lookups/segments",
    "/api/v1/analytics/lookups/features-events",
    "/api/v1/analytics/lookups/features",
    "/api/v1/analytics/lookups/user-properties",
    "/api/v1/lookups/features-events",
    "/api/v1/lookups/features",
    "/v1/analytics/exports/lookups/features-events",
    "/v1/analytics/exports/lookups/features",
    "/v1/analytics/lookups/features-events",
    "/v1/lookups/features-events",
    "/api/v1/exports/lookups/features-events",
    "/api/v1/exports/lookups/features"
]

print("Scanning for Lookups Endpoints...")
for base in bases:
    print(f"\n=== Base: {base} ===")
    for path in paths:
        url = f"{base}{path}"
        try:
            res = requests.get(url, headers=headers, timeout=5)
            if res.status_code != 404:
                print(f"FOUND! GET {path} -> Status: {res.status_code}")
                print(f"  Response: {res.text[:150]}")
            else:
                # print(f"404: {path}")
                pass
        except Exception as e:
            print(f"ERROR on {path}: {e}")
