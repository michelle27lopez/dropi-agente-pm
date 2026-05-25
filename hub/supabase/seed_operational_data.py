import csv
import sys
from supabase import create_client

# Cargar variables de entorno del archivo env
env_path = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/.env.local"
env_vars = {}

try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando env vars: {e}")
    sys.exit(1)

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Credenciales de Supabase no encontradas.")
    sys.exit(1)

supabase = create_client(url, key)

csv_path = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/doc hub/Data proveedores.csv"

# 1. Obtener los proveedores actuales de Supabase para cruzar
print("Obteniendo proveedores de Supabase para cruzar...")
suppliers = []
from_idx = 0
limit = 1000
has_more = True

while has_more:
    res = supabase.table("userpilot_suppliers").select("user_id, country").range(from_idx, from_idx + limit - 1).execute()
    data = res.data
    if data:
        suppliers.extend(data)
        if len(data) < limit:
            has_more = False
        else:
            from_idx += limit
    else:
        has_more = False

print(f"Proveedores cargados desde Supabase: {len(suppliers)}")

# Mapear nombres de país de Userpilot a códigos ISO de la base de datos operativa
country_map = {
    "colombia": "CO",
    "mexico": "MX",
    "méxico": "MX",
    "ecuador": "EC",
    "chile": "CL",
    "guatemala": "GT",
    "peru": "PE",
    "perú": "PE",
    "paraguay": "PY",
    "panama": "PA",
    "panamá": "PA",
    "argentina": "AR"
}

# Construir lookup de (country_code, id) -> user_id
lookup = {}
for s in suppliers:
    uid = s.get("user_id")
    country = s.get("country")
    if uid and country:
        cc = country_map.get(country.lower().strip())
        if cc:
            lookup[(cc, uid.strip())] = uid.strip()

print(f"Diccionario de cruce indexado: {len(lookup)} llaves compuestas.")

# Función para limpiar y castear enteros del CSV de Dropi (formato español miles '.')
def clean_int(val):
    val = val.replace("\t", "").replace(" ", "").replace(".", "").replace("-", "").strip()
    if not val or val == '':
        return 0
    try:
        return int(val)
    except ValueError:
        return 0

update_records = []
matches_count = 0

print("Leyendo 'Data proveedores.csv' y cruzando datos...")
with open(csv_path, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    header = next(reader)
    
    for row in reader:
        if len(row) < 14:
            continue
        c_code = row[0].strip()
        pid = row[1].strip()
        
        key = (c_code, pid)
        if key in lookup:
            matches_count += 1
            
            # Extraer campos
            fecha_activacion = row[4].strip() if row[4].strip() and row[4].strip() != '-' else None
            dias_en_activarse = clean_int(row[5])
            es_activo_30d = row[6].strip().upper() == "VERDADERO"
            orders = clean_int(row[7])
            products = clean_int(row[8])
            dropshippers = clean_int(row[13])
            
            update_records.append({
                "user_id": lookup[key],
                "fecha_activacion": fecha_activacion,
                "dias_en_activarse": dias_en_activarse,
                "es_activo_30d": es_activo_30d,
                "real_orders_delivered": orders,
                "real_products_created": products,
                "real_dropshipper_clients": dropshippers
            })

print(f"Cruce finalizado. Coincidencias encontradas: {matches_count}")

# 2. Subir en lotes las actualizaciones operativas
if update_records:
    print(f"Sincronizando {len(update_records)} registros con métricas operativas en Supabase...")
    batch_size = 100
    total_uploaded = 0
    
    for i in range(0, len(update_records), batch_size):
        batch = update_records[i:i+batch_size]
        try:
            supabase.table("userpilot_suppliers").upsert(batch).execute()
            total_uploaded += len(batch)
            print(f"Sincronizados {total_uploaded}/{len(update_records)}...")
        except Exception as e:
            print(f"Error en lote de actualización {i}-{i+batch_size}: {e}")
            sys.exit(1)
            
    print("¡Sincronización de métricas de operaciones completada con éxito!")
else:
    print("No se encontraron coincidencias para actualizar.")
