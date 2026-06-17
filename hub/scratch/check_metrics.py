import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

try:
    # Get all metrics sorted by date DESC
    data = client.table("pm_supplier_metrics").select("*").order("metric_date", desc=True).execute().data
    print(f"Total metrics rows: {len(data)}")
    
    if data:
        latest_date = data[0]["metric_date"]
        print(f"Latest metric date found: {latest_date}")
        
        # Filter metrics for the latest date
        latest_metrics = [r for r in data if r["metric_date"] == latest_date]
        print(f"Total metrics for latest date: {len(latest_metrics)}")
        
        # Group by country
        by_country = {}
        for r in latest_metrics:
            country = r["country"]
            if country not in by_country:
                by_country[country] = []
            by_country[country].append(r)
            
        for country, metrics in by_country.items():
            print(f"\n--- Country: {country} ---")
            # Sort by level then key
            metrics.sort(key=lambda x: (x.get("metric_level", 9), x.get("metric_key", "")))
            for m in metrics:
                trend_sym = "▲" if m.get("trend") == "up" else "▼" if m.get("trend") == "down" else "▶"
                trend_val = m.get("trend_value") or ""
                health_sym = "🟢" if m.get("health") == "good" else "🟡" if m.get("health") == "warning" else "🔴" if m.get("health") == "critical" else "⚪"
                print(f"  Level {m['metric_level']} | {m['metric_name']} ({m['metric_key']}): {m['value_display']} {health_sym} (Trend: {trend_sym} {trend_val})")
    else:
        print("No metrics found.")
except Exception as e:
    print(f"Error: {e}")
