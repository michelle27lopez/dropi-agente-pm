import csv
import sys
from datetime import datetime
from collections import defaultdict
from supabase import create_client

# Cargar variables de entorno del archivo .env.local de hub
env_path = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/.env.local"
env_vars = {}

try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando archivo env: {e}")
    sys.exit(1)

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL o SUPABASE_SERVICE_KEY no están configurados en hub/.env.local")
    sys.exit(1)

supabase = create_client(url, key)

csv_path = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/doc hub/auth0_69fce8b962d8ef610433002e-3EDnm2IionkHnb5eaBegeGCzCVs.csv"

# Diccionario para mapear países a códigos
country_map = {
    "colombia": "CO",
    "ecuador": "EC",
    "méxico": "MX",
    "mexico": "MX"
}

# Estructura: registration_stats[date][country] = count
registration_stats = defaultdict(lambda: defaultdict(int))
suppliers_to_insert = []

print("Leyendo y parseando CSV...")

def parse_iso_date(date_str):
    if not date_str or date_str == '-' or date_str == '':
        return None
    try:
        # Formato ISO 8601 (ej: 2026-05-21T22:24:15.000000-05:00)
        # Reemplazar zona horaria corta si es necesario o recortar milisegundos
        return date_str
    except Exception:
        return None

with open(csv_path, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    
    for row in reader:
        if len(row) < 31:
            continue
            
        user_id = row[0].strip()
        name = row[1].strip()
        email = row[3].strip()
        first_seen = parse_iso_date(row[4].strip())
        signed_up = parse_iso_date(row[5].strip())
        last_seen = parse_iso_date(row[6].strip())
        
        try:
            web_sessions = int(row[7].strip()) if row[7].strip() else 0
        except ValueError:
            web_sessions = 0
            
        country_name = row[8].strip()
        country_code = country_map.get(country_name.lower(), None)
        
        device_type = row[9].strip() if row[9].strip() != '-' else None
        browser_lang = row[10].strip() if row[10].strip() != '-' else None
        browser = row[11].strip() if row[11].strip() != '-' else None
        os_name = row[12].strip() if row[12].strip() != '-' else None
        role = row[17].strip() if row[17].strip() != '-' else 'SUPPLIER'
        phone = row[20].strip() if row[20].strip() != '-' else None
        
        verified = row[23].strip().lower() == 'true'
        billing_info = row[30].strip().lower() == 'true'

        owner_of_community = row[18].strip() if len(row) > 18 and row[18].strip() != '-' else None
        belong_to_community = row[19].strip() if len(row) > 19 and row[19].strip() != '-' else None
        referred_by = row[22].strip() if len(row) > 22 and row[22].strip() != '-' else None

        if not user_id or user_id == '-':
            continue

        suppliers_to_insert.append({
            "user_id": user_id,
            "name": name,
            "email": email,
            "first_seen": first_seen,
            "signed_up": signed_up,
            "last_seen": last_seen,
            "web_sessions": web_sessions,
            "country": country_name,
            "device_type": device_type,
            "browser_language": browser_lang,
            "browser": browser,
            "os": os_name,
            "role": role,
            "phone": phone,
            "verified": verified,
            "billing_information": billing_info,
            "referred_by": referred_by,
            "belong_to_community": belong_to_community,
            "owner_of_community": owner_of_community
        })
        
        # Agrupar registros para pm_supplier_metrics
        if signed_up:
            try:
                date_str = signed_up.split("T")[0]
                # Validar fecha
                datetime.strptime(date_str, "%Y-%m-%d")
                if country_code:
                    registration_stats[date_str][country_code] += 1
                registration_stats[date_str]["ALL"] += 1
            except Exception:
                pass

print(f"Total de proveedores leídos: {len(suppliers_to_insert)}")

# 1. Upsert masivo a userpilot_suppliers
print("Subiendo registros individuales a 'userpilot_suppliers' en Supabase...")
batch_size = 100
total_uploaded = 0

for i in range(0, len(suppliers_to_insert), batch_size):
    batch = suppliers_to_insert[i:i+batch_size]
    try:
        supabase.table("userpilot_suppliers").upsert(batch).execute()
        total_uploaded += len(batch)
        print(f"Subidos {total_uploaded}/{len(suppliers_to_insert)} registros...")
    except Exception as e:
        print(f"Error en lote {i}-{i+batch_size}: {e}")
        print("¿Asegúrate de haber creado la tabla 'userpilot_suppliers' en Supabase primero.")
        sys.exit(1)

print("¡Upsert de proveedores individuales completado con éxito!")

# 2. Upsert de agregados a pm_supplier_metrics
print("Calculando agregaciones de Nuevos Registros...")
metric_records = []
countries = ["CO", "MX", "EC", "ALL"]

for date_str, country_counts in registration_stats.items():
    for c in countries:
        count = country_counts.get(c, 0)
        metric_records.append({
            "metric_date": date_str,
            "country": c,
            "metric_level": 4,
            "metric_key": "new_registrations",
            "metric_name": "Nuevos Registros",
            "value_num": count,
            "value_display": str(count),
            "unit": "proveedores",
            "trend": "stable",
            "trend_value": "Userpilot CSV",
            "health": "good"
        })

print(f"Sincronizando {len(metric_records)} agregaciones de registros en pm_supplier_metrics...")
for i in range(0, len(metric_records), batch_size):
    batch = metric_records[i:i+batch_size]
    supabase.table("pm_supplier_metrics").upsert(batch, on_conflict="metric_date,country,metric_key").execute()

print("¡Sincronización de agregaciones completada con éxito!")
