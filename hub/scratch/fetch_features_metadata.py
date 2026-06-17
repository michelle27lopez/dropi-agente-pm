import requests
import json

api_key = "692d64b9e344913f"
headers = {
    "Authorization": f"Token {api_key}",
    "Content-Type": "application/json"
}

url = "https://appex.userpilot.io/api/v1/analytics/exports/lookups/features-events"

print(f"Requesting features and events lookup from: {url}...")
try:
    res = requests.get(url, headers=headers, timeout=15)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print(f"Successfully retrieved lookups metadata.")
        # Filter for anything containing "garantias", "garantia", "pedidos", "recolectar"
        keywords = ["garantia", "garantias", "pedido", "recolectar"]
        print("\n=== MATCHING DEFINITIONS FOUND IN USERPILOT ===")
        matching_count = 0
        
        # Check if data is list or dict
        items = []
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            # Sometimes it is a dictionary with a key like 'data' or 'results'
            items = data.get("data") or data.get("results") or list(data.values())
            
        for item in items:
            item_str = str(item).lower()
            if any(kw in item_str for kw in keywords):
                print(json.dumps(item, indent=2))
                matching_count += 1
                
        print(f"\nFound {matching_count} matching feature/event definitions.")
        
        # Also print first 10 items as a general sample
        print("\n=== SAMPLE OF DEFINITIONS (FIRST 10) ===")
        for item in items[:10]:
            print(f" - {item.get('name') or item.get('label') or item.get('id')}: {item}")
            
    else:
        print(f"Failed with response: {res.text}")
except Exception as e:
    print(f"ERROR: {e}")
