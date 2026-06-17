import gzip
import json
import requests

def run_experiment(site_id="MCO"):
    url = f"https://api.mercadolibre.com/sites/{site_id}/categories/all"
    print(f"Downloading category tree for site '{site_id}' from: {url}")
    
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        print(f"Error: Received status code {response.status_code}")
        print(response.text)
        return
        
    print("Download complete. Decompressing and parsing JSON...")
    
    # Check headers
    created_at = response.headers.get("X-Content-Created", "Unknown")
    content_md5 = response.headers.get("X-Content-MD5", "Unknown")
    print(f"Dump Last Generated: {created_at}")
    print(f"Dump MD5 Checksum: {content_md5}")
    
    try:
        # requests decompresses gzip automatically under the hood
        data = response.json()
    except Exception as e:
        print(f"Failed to parse JSON: {e}")
        return
        
    print(f"\n--- SUCCESS! Analyzed Data ---")
    
    # In Mercado Libre, /categories/all returns a dictionary or list? Let's find out by checking its type
    print(f"Data type: {type(data)}")
    
    if isinstance(data, dict):
        print(f"Total categories in database: {len(data)}")
        
        # Analyze using path_from_root
        roots = []
        max_depth = 0
        depth_distribution = {}
        
        for cat_id, cat_info in data.items():
            path = cat_info.get("path_from_root", [])
            depth = len(path)
            max_depth = max(max_depth, depth)
            depth_distribution[depth] = depth_distribution.get(depth, 0) + 1
            
            if depth == 1:
                roots.append((cat_id, cat_info.get("name")))
                
        print(f"\nRoot Categories found: {len(roots)}")
        for r_id, r_name in sorted(roots, key=lambda x: x[1])[:20]:
            print(f"  - {r_name} ({r_id})")
            
        print(f"\nMax tree depth: {max_depth}")
        print("\nDepth distribution:")
        for depth in sorted(depth_distribution.keys()):
            count = depth_distribution[depth]
            percentage = (count / len(data)) * 100
            print(f"  Level {depth}: {count} categories ({percentage:.2f}%)")
            
        print("\n--- Sample Tree Hierarchy (First 3 Roots, up to 3 levels deep) ---")
        # Let's map children using the children_categories inside each node
        for r_id, r_name in sorted(roots, key=lambda x: x[1])[:3]:
            print(f"\n📁 {r_name} ({r_id})")
            root_info = data.get(r_id, {})
            children_1 = root_info.get("children_categories", [])
            for c1 in sorted(children_1, key=lambda x: x.get("name", ""))[:5]:
                c1_id = c1.get("id")
                c1_name = c1.get("name")
                print(f"  ├── 📁 {c1_name} ({c1_id})")
                c1_info = data.get(c1_id, {})
                children_2 = c1_info.get("children_categories", []) if c1_info else []
                for c2 in sorted(children_2, key=lambda x: x.get("name", ""))[:4]:
                    c2_id = c2.get("id")
                    c2_name = c2.get("name")
                    print(f"  │   ├── 📄 {c2_name} ({c2_id})")
                if len(children_2) > 4:
                    print(f"  │   └── ... ({len(children_2) - 4} more)")
            if len(children_1) > 5:
                print(f"  └── ... ({len(children_1) - 5} more)")
            
    elif isinstance(data, list):
        print(f"Total categories in list: {len(data)}")
        if len(data) > 0:
            print("Sample categories:")
            for i, item in enumerate(data[:10]):
                print(f"  [{i}] ID: {item.get('id')} - Name: {item.get('name')} - Parent: {item.get('parent_id') or 'Root'}")
                
            # Build hierarchy info
            roots = [item for item in data if not item.get('parent_id')]
            print(f"\nRoot Categories: {len(roots)}")
            for item in roots[:10]:
                 print(f"  - {item.get('name')} ({item.get('id')})")
    else:
        print("Unknown JSON root type")

if __name__ == "__main__":
    run_experiment("MCO")
