import requests

token = "BQKiLW8zsLMg0UCN7TBRhIGK0YomXb"

# We will test candidate API endpoints
urls = [
    f"https://run.userpilot.io/api/public/dashboards/{token}",
    f"https://run.userpilot.io/api/v1/public/dashboards/{token}",
    f"https://run.userpilot.io/public/api/dashboards/{token}",
    f"https://run.userpilot.io/api/v1/dashboards/public/{token}",
    f"https://run.userpilot.io/api/dashboards/public/{token}",
    f"https://run.userpilot.io/public/dashboards/{token}/data",
    f"https://run.userpilot.io/api/public/shares/{token}",
    f"https://run.userpilot.io/api/v1/public/shares/{token}"
]

print("Scanning for public dashboard JSON API...")
for url in urls:
    try:
        res = requests.get(url, timeout=10)
        print(f"GET {url} -> Status: {res.status_code}")
        if res.status_code == 200:
            print("FOUND IT!")
            print(res.text[:1000])
            break
    except Exception as e:
        print(f"Error on {url}: {e}")
