import os
import csv
import sys
from supabase import create_client

# Cargar variables de entorno del archivo .env.local de hub
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
env_path = os.path.join(HUB_DIR, ".env.local")
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

comunidades_path = os.path.join(HUB_DIR, "doc hub", "encuesta-comunidades.csv")
huerfanos_path = os.path.join(HUB_DIR, "doc hub", "Encuesta-huerfanos.csv")

surveys_map = {}

def parse_csv_file(file_path, source):
    print(f"Leyendo y parseando {file_path}...")
    records_count = 0
    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        for row in reader:
            if len(row) < 13:
                continue
                
            user_id = row[0].strip()
            if not user_id or user_id == '-':
                continue
                
            # Extraer campos de respuestas
            survey_role = row[5].strip() if row[5].strip() != '-' else None
            survey_stage = row[6].strip() if row[6].strip() != '-' else None
            survey_volume = row[7].strip() if row[7].strip() != '-' else None
            survey_purpose = row[8].strip() if row[8].strip() != '-' else None
            survey_brand_sales = row[9].strip() if row[9].strip() != '-' else None
            survey_shipping_pref = row[10].strip() if row[10].strip() != '-' else None
            survey_sell_pref = row[11].strip() if row[11].strip() != '-' else None
            
            surveys_map[user_id] = {
                "user_id": user_id,
                "survey_role": survey_role,
                "survey_stage": survey_stage,
                "survey_volume": survey_volume,
                "survey_purpose": survey_purpose,
                "survey_brand_sales": survey_brand_sales,
                "survey_shipping_pref": survey_shipping_pref,
                "survey_sell_pref": survey_sell_pref,
                "survey_source": source
            }
            records_count += 1
    print(f"Leídos {records_count} registros de {source}.")

# Parsear ambos archivos
parse_csv_file(comunidades_path, "comunidades")
parse_csv_file(huerfanos_path, "huerfanos")

surveys_to_upsert = list(surveys_map.values())
print(f"Total de registros deduplicados a subir: {len(surveys_to_upsert)}")

# Upsert masivo a userpilot_suppliers
print("Subiendo respuestas de encuestas a 'userpilot_suppliers' en Supabase...")
batch_size = 100
total_uploaded = 0

for i in range(0, len(surveys_to_upsert), batch_size):
    batch = surveys_to_upsert[i:i+batch_size]
    try:
        # En PostgREST, upsert con una lista de columnas actualiza esas columnas y no borra el resto
        supabase.table("userpilot_suppliers").upsert(batch).execute()
        total_uploaded += len(batch)
        print(f"Subidos {total_uploaded}/{len(surveys_to_upsert)} registros...")
    except Exception as e:
        print(f"Error en lote {i}-{i+batch_size}: {e}")
        print("¿Te aseguraste de ejecutar el script DDL de migración (003_add_survey_columns.sql) en Supabase primero?")
        sys.exit(1)

print("¡Upsert de encuestas completado con éxito!")
