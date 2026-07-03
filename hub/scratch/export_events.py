#!/usr/bin/env python3
import os
import sys
import json
import gzip
import io
import time
import argparse
from datetime import datetime, timedelta
import requests

API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"
METADATA_FILE = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/features_events_metadata.json"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def load_metadata():
    """Loads features_events_metadata.json and returns a lookup dictionary."""
    if not os.path.exists(METADATA_FILE):
        print(f"Warning: Metadata file not found at {METADATA_FILE}. ID translation will not be active.")
        return {}, {}
        
    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
            
        id_to_name = {}
        id_to_key = {}
        for item in metadata:
            # Check ID
            item_id = item.get("id")
            display_name = item.get("display_name")
            item_key = item.get("key")
            
            if item_id is not None:
                str_id = str(item_id)
                if display_name:
                    id_to_name[str_id] = display_name
                if item_key:
                    id_to_key[str_id] = item_key
                    
            # Check Analytical ID as fallback
            analytic_id = item.get("analytical_id")
            if analytic_id is not None:
                str_an_id = str(analytic_id)
                if display_name and str_an_id not in id_to_name:
                    id_to_name[str_an_id] = display_name
                if item_key and str_an_id not in id_to_key:
                    id_to_key[str_an_id] = item_key
                    
        print(f"Loaded metadata: Mapped {len(id_to_name)} event IDs to friendly display names.")
        return id_to_name, id_to_key
    except Exception as e:
        print(f"Warning: Could not parse metadata file: {e}")
        return {}, {}

def trigger_export(start_date_str, end_date_str, event_type):
    url = f"{API_BASE_URL}/api/v1/analytics/exports"
    payload = {
        "start_date": start_date_str,
        "end_date": end_date_str,
        "from": start_date_str,
        "to": end_date_str,
        "event_types": [event_type],
        "format": "json"
    }
    
    print(f"Creating export job for event type '{event_type}' from {start_date_str} to {end_date_str}...")
    res = requests.post(url, headers=headers, json=payload)
    
    if res.status_code == 404:
        url_alt = f"{API_BASE_URL}/v1/analytics/exports"
        print(f"Main route failed (404). Trying alternative: {url_alt}...")
        res = requests.post(url_alt, headers=headers, json=payload)

    if res.status_code == 409:
        print("Conflict (409): Active export job already running. Fetching active jobs...")
        res_list = requests.get(f"{API_BASE_URL}/api/v1/analytics/exports/jobs", headers=headers)
        if res_list.status_code == 200:
            jobs = res_list.json()
            active_jobs = [j for j in jobs if j.get("status") in ("pending", "processing")]
            if active_jobs:
                job_id = active_jobs[0]["id"]
                print(f"Reusing active job ID: {job_id}")
                return job_id
            completed_jobs = [j for j in jobs if j.get("status") == "completed"]
            if completed_jobs:
                job_id = completed_jobs[0]["id"]
                print(f"Reusing last completed job ID: {job_id}")
                return job_id
        print("Error: Could not retrieve active jobs.")
        return None
    elif res.status_code not in (200, 201):
        print(f"Error creating export job: {res.status_code} - {res.text}")
        return None
        
    job_data = res.json()
    job_id = job_data.get("id") or job_data.get("job_id")
    print(f"Job created successfully. ID: {job_id}")
    return job_id

def poll_job(job_id):
    status_url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs/{job_id}"
    max_attempts = 40
    delay = 10
    
    print(f"Polling job status for ID: {job_id}...")
    for attempt in range(1, max_attempts + 1):
        time.sleep(delay)
        res = requests.get(status_url, headers=headers)
        if res.status_code != 200:
            print(f"  Attempt {attempt}/{max_attempts}: Error getting status ({res.status_code})")
            continue
            
        data = res.json()
        status = data.get("status")
        print(f"  Attempt {attempt}/{max_attempts}: Status is '{status}'")
        
        if status == "completed":
            presigned = data.get("presigned_urls")
            if presigned and isinstance(presigned, list):
                return [item.get("url") for item in presigned if item.get("url")]
            urls = data.get("download_urls") or [data.get("download_url")]
            return [u for u in urls if u]
        elif status == "failed":
            print("Job failed on Userpilot servers.")
            return None
            
    print("Polling timed out.")
    return None

def process_file_content(url):
    print(f"Downloading file part: {url[:60]}...")
    res = requests.get(url)
    if res.status_code != 200:
        print(f"Error downloading file: {res.status_code}")
        return []
        
    events = []
    content_type = res.headers.get("Content-Type", "")
    
    # Check if gzip
    if url.split('?')[0].endswith('.gz') or "gzip" in content_type or res.content.startswith(b'\x1f\x8b'):
        try:
            compressed_stream = io.BytesIO(res.content)
            with gzip.GzipFile(fileobj=compressed_stream) as gz:
                text_stream = io.TextIOWrapper(gz, encoding='utf-8')
                for line in text_stream:
                    if line.strip():
                        try:
                            events.append(json.loads(line))
                        except Exception as e:
                            pass
        except Exception as e:
            print(f"Gzip decompression error: {e}")
    else:
        try:
            content = res.content.decode('utf-8')
            if content.strip().startswith('['):
                events = json.loads(content)
            else:
                for line in content.strip().split('\n'):
                    if line.strip():
                        try:
                            events.append(json.loads(line))
                        except:
                            pass
        except Exception as e:
            print(f"Error parsing raw text: {e}")
            
    return events

def main():
    parser = argparse.ArgumentParser(description="Export and filter Userpilot custom events with metadata translation.")
    parser.add_argument("--event-name", help="Specific event name or numeric ID to filter by. Case-insensitive search.")
    parser.add_argument("--start-date", help="Start date (YYYY-MM-DD). Defaults to 3 days ago.")
    parser.add_argument("--end-date", help="End date (YYYY-MM-DD). Defaults to today.")
    parser.add_argument("--event-type", default="track", choices=["track", "track_feature", "interaction", "page_view", "identify_user"],
                        help="Userpilot event type classification (default: track)")
    parser.add_argument("--output", help="Save matching events to a JSON file.")
    
    args = parser.parse_args()
    
    # Load friendly mappings
    id_to_name, id_to_key = load_metadata()
    
    # Date defaults
    end_date = args.end_date or datetime.now().strftime("%Y-%m-%d")
    start_date = args.start_date or (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
    
    job_id = trigger_export(start_date, end_date, args.event_type)
    if not job_id:
        sys.exit(1)
        
    download_urls = poll_job(job_id)
    if not download_urls:
        sys.exit(1)
        
    all_events = []
    for url in download_urls:
        all_events.extend(process_file_content(url))
        
    print(f"\nTotal events downloaded: {len(all_events)}")
    
    if len(all_events) == 0:
        print("No events found in this range.")
        sys.exit(0)
        
    # Analyze events and perform translation
    unique_names = {}
    matching_events = []
    
    for event in all_events:
        raw_name = event.get("event_name") or event.get("event") or event.get("name")
        if not raw_name and "metadata" in event and isinstance(event["metadata"], dict):
            raw_name = event["metadata"].get("name") or event["metadata"].get("event_name")
            
        if not raw_name:
            raw_name = "[Unknown Name]"
            
        str_raw_name = str(raw_name)
        
        # Translate name using metadata if possible
        friendly_name = id_to_name.get(str_raw_name) or id_to_key.get(str_raw_name) or str_raw_name
        
        # Track count by friendly name (show ID alongside it for reference)
        summary_key = friendly_name if friendly_name == str_raw_name else f"{friendly_name} (ID: {str_raw_name})"
        unique_names[summary_key] = unique_names.get(summary_key, 0) + 1
        
        # Store resolved name in the event object for output clarity
        event["resolved_event_name"] = friendly_name
        
        # Filter check
        if args.event_name:
            filter_val = str(args.event_name).lower()
            if (filter_val == str_raw_name.lower() or 
                filter_val == friendly_name.lower() or 
                filter_val in friendly_name.lower()):
                matching_events.append(event)
            
    print("\n--- Event Summary (Unique Names & Counts) ---")
    for name, count in sorted(unique_names.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {name}: {count} occurrences")
        
    if args.event_name:
        print(f"\n--- Matching Events for filter '{args.event_name}' ({len(matching_events)} found) ---")
        # Print up to 5 examples
        for i, ev in enumerate(matching_events[:5]):
            print(f"\n[Example {i+1}]:")
            print(json.dumps(ev, indent=2))
        if len(matching_events) > 5:
            print(f"\n... and {len(matching_events) - 5} more.")
            
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(matching_events, f, indent=2)
            print(f"\nSaved matching events to {args.output}")

if __name__ == "__main__":
    main()
