import requests
from datetime import datetime, timedelta

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

start_date_str = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
end_date_str = datetime.now().strftime("%Y-%m-%d")

# Let's test a few common event type values to see what the Userpilot API accepts
event_type_options = [
    ["track"],
    ["track_event"],
    ["identify_user"],
    ["page_view"],
    ["track_feature"],
    ["nps_response"],
    ["nps"]
]

print("Starting export event types diagnostic...")

for opts in event_type_options:
    payload = {
        "start_date": start_date_str,
        "end_date": end_date_str,
        "from": start_date_str,
        "to": end_date_str,
        "event_types": opts,
        "format": "json"
    }
    url = "https://appex.userpilot.io/api/v1/analytics/exports"
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"POST export with event_types={opts} -> Status: {res.status_code}")
        print(f"  Response: {res.text[:200]}")
    except Exception as e:
        print(f"POST export with event_types={opts} -> ERROR: {e}")
