import requests

token = "BQKiLW8zsLMg0UCN7TBRhIGK0YomXb"

# We will test candidate API endpoints on different subdomains
urls = [
    f"https://app.userpilot.io/api/public/shares/{token}",
    f"https://app.userpilot.io/api/public/dashboards/{token}",
    f"https://app.userpilot.io/api/v1/public/dashboards/{token}",
    f"https://appex.userpilot.io/api/v1/public/dashboards/{token}",
    f"https://appex.userpilot.io/api/public/shares/{token}",
    f"https://appex.userpilot.io/api/v1/public/shares/{token}",
    f"https://run.userpilot.io/api/public/shares/{token}",
    f"https://run.userpilot.io/api/v1/public/shares/{token}"
]

print("Scanning other subdomains for public dashboard JSON API...")
for url in urls:
    try:
        # Userpilot public shares do not require authentication, so we do not pass headers
        res = requests.get(url, timeout=10)
        # Check if response is JSON (usually starts with { or [)
        is_json = "application/json" in res.headers.get("Content-Type", "") or res.text.strip().startswith(("{", "["))
        print(f"GET {url} -> Status: {res.status_code} | IsJSON: {is_json}")
        if res.status_code == 200 and is_json:
            print("FOUND JSON API!")
            print(res.text[:1000])
            break
    except Exception as e:
        print(f"Error on {url}: {e}")
