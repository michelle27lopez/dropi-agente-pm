import requests
import json

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

url = "https://appex.userpilot.io/api/v1/analytics/exports/lookups/features_events"

print(f"Requesting features and events from: {url}...")
try:
    res = requests.get(url, headers=headers, timeout=20)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print(f"Retrieved {len(data)} event/feature definitions.")
        
        # Save all definitions locally for reference
        with open("scratch/features_events_metadata.json", "w") as f:
            json.dump(data, f, indent=2)
        print("Saved definitions to scratch/features_events_metadata.json")
        
        # Filter for our funnel terms
        keywords = ["garantia", "garantias", "pedido", "recolectar"]
        print("\n=== MATCHING USERPILOT EVENT/FEATURE DEFINITIONS ===")
        matched_items = []
        for item in data:
            display_name = item.get("display_name") or ""
            item_id = item.get("id")
            item_str = str(item).lower()
            if any(kw in item_str for kw in keywords):
                matched_items.append(item)
                print(f" - ID: {item_id} | Name: {display_name} | Full: {item}")
        print(f"\nTotal matches found: {len(matched_items)}")
    else:
        print(f"Failed: {res.text}")
except Exception as e:
    print(f"ERROR: {e}")
