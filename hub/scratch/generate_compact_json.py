import requests
import gzip
import json
import os

def generate_compact_categories():
    site_id = "MCO"
    url = f"https://api.mercadolibre.com/sites/{site_id}/categories/all"
    print(f"Downloading from {url}...")
    
    response = requests.get(url)
    if response.status_code != 200:
        print("Error downloading")
        return
        
    print("Parsing JSON...")
    data = response.json()
    
    compact_data = {}
    for cat_id, cat_info in data.items():
        name = cat_info.get("name", "")
        path = cat_info.get("path_from_root", [])
        
        # Determine parent_id
        parent_id = None
        if len(path) > 1:
            # The parent is the second-to-last element in path_from_root
            # (the last element is the category itself)
            parent_id = path[-2].get("id")
            
        compact_data[cat_id] = {
            "n": name,
            "p": parent_id
        }
        
    # Create public/data directory if it doesn't exist
    target_dir = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/public/data"
    os.makedirs(target_dir, exist_ok=True)
    
    target_path = os.path.join(target_dir, "meli_categories_mco.json")
    print(f"Writing {len(compact_data)} categories to {target_path}...")
    
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(compact_data, f, ensure_ascii=False, separators=(',', ':'))
        
    print("Done! File size:", os.path.getsize(target_path), "bytes")

if __name__ == "__main__":
    generate_compact_categories()
