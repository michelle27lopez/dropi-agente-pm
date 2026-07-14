#!/usr/bin/env python3
import os
import sys
import csv
import json
import zipfile
import gzip
import io
import time
import argparse
from datetime import datetime, timedelta
import requests
from supabase import create_client

# Cargar variables de entorno del archivo .env.local
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HUB_DIR = os.path.dirname(SCRIPT_DIR)
ENV_PATH = os.path.join(HUB_DIR, ".env.local")
env_vars = {}

try:
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Advertencia: No se pudo leer el archivo .env.local: {e}")

# Configurar claves de Supabase
SUPABASE_URL = env_vars.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = env_vars.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY")
USERPILOT_API_KEY = env_vars.get("USERPILOT_API_KEY") or os.environ.get("USERPILOT_API_KEY")
USERPILOT_API_BASE_URL = env_vars.get("USERPILOT_API_BASE_URL") or os.environ.get("USERPILOT_API_BASE_URL") or "https://appex.userpilot.io"

# Diccionario para mapear países a códigos
COUNTRY_MAP = {
    "colombia": "CO",
    "ecuador": "EC",
    "méxico": "MX",
    "mexico": "MX"
}

def parse_iso_date(date_str):
    if not date_str or date_str == '-' or date_str == '':
        return None
    return date_str

def parse_boolean(val):
    if not val:
        return False
    return str(val).strip().lower() in ('true', '1', 'yes')

def parse_integer(val):
    if not val or val == '-':
        return 0
    try:
        return int(float(val))
    except ValueError:
        return 0

def map_fields(row_dict):
    """
    Normaliza y mapea los campos provenientes de Userpilot (ya sea JSON o CSV)
    para cumplir con el esquema de la tabla 'userpilot_suppliers' en Supabase.
    """
    # Limpieza de llaves (case-insensitive y quitar espacios)
    clean_row = {k.strip().lower().replace(' ', '_').replace('-', '_'): v for k, v in row_dict.items() if k}
    
    # Identificar el ID de usuario (clave primaria crítica)
    user_id = clean_row.get("user_id") or clean_row.get("userid") or clean_row.get("id")
    if not user_id or str(user_id).strip() == '-':
        return None
    user_id = str(user_id).strip()

    # Mapeo de campos de texto básicos
    name = clean_row.get("name") or clean_row.get("full_name") or clean_row.get("display_name") or ""
    email = clean_row.get("email") or ""
    
    # Mapeo de fechas
    first_seen = parse_iso_date(clean_row.get("first_seen"))
    signed_up = parse_iso_date(clean_row.get("signed_up") or clean_row.get("created_at") or clean_row.get("signedup"))
    last_seen = parse_iso_date(clean_row.get("last_seen"))
    
    # Web sessions
    web_sessions = parse_integer(clean_row.get("web_sessions") or clean_row.get("sessions") or clean_row.get("session_count"))
    
    # Entorno y dispositivo
    country = clean_row.get("country") or ""
    device_type = clean_row.get("device_type") or clean_row.get("device")
    if device_type == '-': device_type = None
    
    browser_lang = clean_row.get("browser_language") or clean_row.get("browser_lang") or clean_row.get("language")
    if browser_lang == '-': browser_lang = None
    
    browser = clean_row.get("browser")
    if browser == '-': browser = None
    
    os_name = clean_row.get("os") or clean_row.get("operating_system")
    if os_name == '-': os_name = None
    
    role = clean_row.get("role") or 'SUPPLIER'
    if role == '-': role = 'SUPPLIER'
    
    phone = clean_row.get("phone") or clean_row.get("phone_number")
    if phone == '-': phone = None

    # Booleanos
    verified = parse_boolean(clean_row.get("verified"))
    billing_info = parse_boolean(clean_row.get("billing_information") or clean_row.get("billing_info"))
    
    # Comunidades
    owner_of_community = clean_row.get("owner_of_comunity") or clean_row.get("owner_of_community")
    if owner_of_community == '-': owner_of_community = None
    
    belong_to_community = clean_row.get("belong_to_comunity") or clean_row.get("belong_to_community")
    if belong_to_community == '-': belong_to_community = None
    
    referred_by = clean_row.get("referred_by")
    if referred_by == '-': referred_by = None
    
    # Encuestas (Survey Columns)
    survey_role = clean_row.get("survey_role")
    if survey_role == '-': survey_role = None
    
    survey_stage = clean_row.get("survey_stage")
    if survey_stage == '-': survey_stage = None
    
    survey_volume = clean_row.get("survey_volume")
    if survey_volume == '-': survey_volume = None
    
    survey_purpose = clean_row.get("survey_purpose")
    if survey_purpose == '-': survey_purpose = None
    
    survey_brand_sales = clean_row.get("survey_brand_sales")
    if survey_brand_sales == '-': survey_brand_sales = None
    
    survey_shipping_pref = clean_row.get("survey_shipping_pref")
    if survey_shipping_pref == '-': survey_shipping_pref = None
    
    survey_sell_pref = clean_row.get("survey_sell_pref")
    if survey_sell_pref == '-': survey_sell_pref = None
    
    survey_source = clean_row.get("survey_source")
    if survey_source == '-': survey_source = None
    
    # Tipo de proveedor
    tipo_proveedor = clean_row.get("tipo_proveedor") or clean_row.get("category")
    if tipo_proveedor == '-': tipo_proveedor = None

    return {
        "user_id": user_id,
        "name": name.strip(),
        "email": email.strip(),
        "first_seen": first_seen,
        "signed_up": signed_up,
        "last_seen": last_seen,
        "web_sessions": web_sessions,
        "country": country.strip() if country else None,
        "device_type": device_type,
        "browser_language": browser_lang,
        "browser": browser,
        "os": os_name,
        "role": role,
        "phone": phone,
        "verified": verified,
        "billing_information": billing_info,
        "owner_of_community": owner_of_community,
        "belong_to_community": belong_to_community,
        "referred_by": referred_by,
        "survey_role": survey_role,
        "survey_stage": survey_stage,
        "survey_volume": survey_volume,
        "survey_purpose": survey_purpose,
        "survey_brand_sales": survey_brand_sales,
        "survey_shipping_pref": survey_shipping_pref,
        "survey_sell_pref": survey_sell_pref,
        "survey_source": survey_source,
        "tipo_proveedor": tipo_proveedor
    }

def upsert_to_supabase(supabase_client, suppliers_list):
    """
    Sube en lotes la lista de proveedores a la tabla 'userpilot_suppliers'.
    """
    if not suppliers_list:
        print("No hay registros válidos para subir.")
        return 0

    # Deduplicar para evitar el error 'ON CONFLICT DO UPDATE command cannot affect row a second time'
    unique_suppliers = {}
    for supplier in suppliers_list:
        uid = supplier["user_id"]
        if uid not in unique_suppliers:
            unique_suppliers[uid] = supplier
        else:
            # Mantener el que tenga la fecha de última sesión o registro más reciente
            existing = unique_suppliers[uid]
            existing_time = existing.get("last_seen") or existing.get("first_seen") or ""
            current_time = supplier.get("last_seen") or supplier.get("first_seen") or ""
            if current_time > existing_time:
                unique_suppliers[uid] = supplier
                
    deduped_list = list(unique_suppliers.values())
    print(f"Deduplicación: Reducido de {len(suppliers_list)} a {len(deduped_list)} registros únicos.")

    print(f"Subiendo {len(deduped_list)} registros a la tabla 'userpilot_suppliers'...")
    batch_size = 100
    total_uploaded = 0
    
    for i in range(0, len(deduped_list), batch_size):
        batch = deduped_list[i:i+batch_size]
        try:
            supabase_client.table("userpilot_suppliers").upsert(batch).execute()
            total_uploaded += len(batch)
            print(f"  [Supabase] Sincronizados {total_uploaded}/{len(deduped_list)} registros...")
        except Exception as e:
            print(f"  [ERROR] Ocurrió un fallo al guardar el lote {i}-{i+batch_size}: {e}")
            
    print("¡Sincronización de proveedores individuales completada con éxito!")
    return total_uploaded

def sync_from_csv(supabase_client, file_path):
    """
    Lee un archivo CSV y sincroniza sus filas con Supabase.
    """
    print(f"Leyendo archivo CSV desde: {file_path}")
    suppliers_to_insert = []
    
    with open(file_path, mode='r', encoding='utf-8') as f:
        # Detectar el delimitador y formato
        sample = f.read(2048)
        f.seek(0)
        dialect = csv.Sniffer().has_header(sample) and csv.excel or csv.excel
        
        reader = csv.DictReader(f)
        for row in reader:
            mapped = map_fields(row)
            if mapped:
                suppliers_to_insert.append(mapped)
                
    print(f"Se leyeron {len(suppliers_to_insert)} registros válidos del CSV.")
    return upsert_to_supabase(supabase_client, suppliers_to_insert)

def sync_from_api(supabase_client, api_key, start_date_str):
    """
    Trata de llamar a la Bulk Export API de Userpilot.
    """
    print("Iniciando sincronización mediante la API de Userpilot (Bulk Export)...")
    
    # 1. Crear el Job de Exportación
    api_base = USERPILOT_API_BASE_URL.rstrip('/')
    url_job = f"{api_base}/api/v1/analytics/exports"
    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json"
    }
    
    end_date_str = datetime.now().strftime("%Y-%m-%d")
    payload = {
        "start_date": start_date_str,
        "end_date": end_date_str,
        "from": start_date_str,
        "to": end_date_str,
        "event_types": ["identify_user"],
        "format": "json"
    }
    
    print(f"  [API] Enviando solicitud de exportación a: {url_job}...")
    res = requests.post(url_job, headers=headers, json=payload)
    
    # Si la ruta con /api da 404, intentar la ruta sin /api
    if res.status_code == 404:
        url_job_alt = f"{api_base}/v1/analytics/exports"
        print(f"  [API] Ruta principal falló (404). Intentando ruta alternativa: {url_job_alt}...")
        res = requests.post(url_job_alt, headers=headers, json=payload)
        if res.status_code != 404:
            url_job = url_job_alt
            print(f"  [API] Conectado exitosamente usando la ruta alternativa.")
            
    if res.status_code == 409:
        print("  [API] Conflicto (409): Ya existe una tarea de exportación activa. Intentando listar trabajos activos...")
        # Intentar obtener la lista de trabajos
        res_list = requests.get(f"{url_job}/jobs", headers=headers)
        if res_list.status_code == 200:
            jobs = res_list.json()
            # Encontrar un trabajo activo
            active_jobs = [j for j in jobs if j.get("status") in ("pending", "processing")]
            if active_jobs:
                job_id = active_jobs[0]["id"]
                print(f"  [API] Reutilizando trabajo activo ID: {job_id}")
            else:
                completed_jobs = [j for j in jobs if j.get("status") == "completed"]
                if completed_jobs:
                    job_id = completed_jobs[0]["id"]
                    print(f"  [API] Usando el último trabajo completado ID: {job_id}")
                else:
                    print("  [ERROR] No se pudo crear ni reutilizar ningún trabajo. Inténtalo de nuevo en unos minutos.")
                    return 0
        else:
            print(f"  [ERROR] Falló la listación de trabajos: {res_list.status_code} - {res_list.text}")
            return 0
    elif res.status_code != 200 and res.status_code != 201:
        print(f"  [ERROR] Falló la creación del trabajo de exportación: {res.status_code} - {res.text}")
        return 0
    else:
        job_data = res.json()
        job_id = job_data.get("id") or job_data.get("job_id")
        print(f"  [API] Trabajo de exportación creado con éxito. ID: {job_id}")

    # 2. Monitorear el estado del Job (Polling)
    if "/api/v1/" in url_job:
        status_url = f"{api_base}/api/v1/analytics/exports/jobs/{job_id}"
    else:
        status_url = f"{api_base}/v1/analytics/exports/jobs/{job_id}"
    max_attempts = 30
    delay = 10
    download_urls = []
    
    print("  [API] Esperando a que el trabajo de exportación se complete...")
    for attempt in range(1, max_attempts + 1):
        time.sleep(delay)
        res_status = requests.get(status_url, headers=headers)
        if res_status.status_code != 200:
            print(f"    [Intento {attempt}/{max_attempts}] Error consultando estado ({res_status.status_code})...")
            continue
            
        status_data = res_status.json()
        status = status_data.get("status")
        print(f"    [Intento {attempt}/{max_attempts}] Estado actual: '{status}'")
        
        if status == "completed":
            presigned = status_data.get("presigned_urls")
            if presigned and isinstance(presigned, list):
                download_urls = [item.get("url") for item in presigned if item.get("url")]
            else:
                download_urls = status_data.get("download_urls") or [status_data.get("download_url")]
            break
        elif status == "failed":
            print("  [ERROR] La tarea de exportación falló en los servidores de Userpilot.")
            return 0
            
    if not download_urls or not download_urls[0]:
        print("  [ERROR] Tiempo de espera agotado o URL de descarga no disponible.")
        return 0

    # 3. Descargar y procesar los archivos de exportación
    suppliers_to_insert = []
    print(f"  [API] Descargando datos de exportación ({len(download_urls)} partes)...")
    
    for url in download_urls:
        if not url:
            continue
        print(f"    Descargando: {url[:60]}...")
        file_res = requests.get(url)
        if file_res.status_code != 200:
            print(f"    [ERROR] Falló la descarga de la parte: {file_res.status_code}")
            continue
            
        content_type = file_res.headers.get("Content-Type", "")
        
        # Procesar GZIP
        if url.split('?')[0].endswith('.gz') or "gzip" in content_type or file_res.content.startswith(b'\x1f\x8b'):
            try:
                print(f"      Descomprimiendo GZIP en flujo...")
                compressed_stream = io.BytesIO(file_res.content)
                with gzip.GzipFile(fileobj=compressed_stream) as gz:
                    text_stream = io.TextIOWrapper(gz, encoding='utf-8')
                    line_count = 0
                    for line in text_stream:
                        if not line:
                            continue
                        try:
                            event = json.loads(line)
                            mapped = extract_user_from_event(event)
                            if mapped:
                                suppliers_to_insert.append(mapped)
                            line_count += 1
                            if line_count % 10000 == 0:
                                print(f"        Procesados {line_count} eventos...")
                        except Exception as json_err:
                            pass
                print(f"      Descompresión y mapeo completados ({line_count} eventos procesados).")
            except Exception as parse_err:
                print(f"      [ERROR] Falló el parseo de GZIP: {parse_err}")
        # Procesar ZIP
        elif "zip" in content_type or file_res.content.startswith(b'PK\x03\x04'):
            with zipfile.ZipFile(io.BytesIO(file_res.content)) as z:
                for filename in z.namelist():
                    print(f"      Descomprimiendo y procesando archivo: {filename}")
                    with z.open(filename) as f:
                        # Asumimos que los archivos internos son JSON lines o JSON arrays
                        try:
                            content = f.read().decode('utf-8')
                            lines = content.strip().split('\n')
                            for line in lines:
                                if not line:
                                    continue
                                event = json.loads(line)
                                # Extraer datos del evento 'identify_user'
                                mapped = extract_user_from_event(event)
                                if mapped:
                                    suppliers_to_insert.append(mapped)
                        except Exception as parse_err:
                            print(f"      [ERROR] Fallo al parsear archivo JSON: {parse_err}")
        else:
            # Archivo JSON directo o JSON Lines
            try:
                content = file_res.content.decode('utf-8')
                if content.strip().startswith('['):
                    events = json.loads(content)
                    for event in events:
                        mapped = extract_user_from_event(event)
                        if mapped:
                            suppliers_to_insert.append(mapped)
                else:
                    lines = content.strip().split('\n')
                    for line in lines:
                        if not line:
                            continue
                        event = json.loads(line)
                        mapped = extract_user_from_event(event)
                        if mapped:
                            suppliers_to_insert.append(mapped)
            except Exception as parse_err:
                print(f"    [ERROR] Falló el parseo de la respuesta directa: {parse_err}")

    print(f"  [API] Total de registros válidos recolectados: {len(suppliers_to_insert)}")
    return upsert_to_supabase(supabase_client, suppliers_to_insert)

def extract_user_from_event(event):
    """
    Extrae la información de usuario a partir del evento 'identify_user'
    que viene en el bulk export de Userpilot.
    """
    # Si no es un evento de identificación, lo ignoramos
    event_type = event.get("event_type") or event.get("event")
    if event_type and event_type != "identify_user":
        return None
        
    user_id = event.get("user_id") or event.get("userId")
    if not user_id:
        return None
        
    # Userpilot exporta las propiedades en un objeto anidado (usualmente 'metadata', 'properties' o 'attributes')
    properties = event.get("metadata") or event.get("properties") or event.get("attributes") or {}
    
    # Crear un diccionario plano para mapearlo con map_fields
    row_dict = {"user_id": user_id}
    for k, v in properties.items():
        row_dict[k] = v
        
    # Asegurar que campos básicos estén en la raíz por si acaso
    for key in ["name", "email", "first_seen", "last_seen", "signed_up", "sessions", "web_sessions", 
                "device_type", "browser_language", "browser", "operating_system"]:
        if key in event and key not in row_dict:
            row_dict[key] = event[key]
            
    # Mapear country_code a country si no está en properties
    if "country" not in row_dict and "country_code" in event:
        cc = event["country_code"]
        if cc == "CO": row_dict["country"] = "Colombia"
        elif cc == "EC": row_dict["country"] = "Ecuador"
        elif cc == "MX": row_dict["country"] = "México"
        elif cc == "PE": row_dict["country"] = "Perú"
        else: row_dict["country"] = cc
            
    return map_fields(row_dict)

def main():
    parser = argparse.ArgumentParser(description="Userpilot API to Supabase Sync Client")
    parser.add_argument("--csv-file", help="Ruta de un archivo CSV local para importar directamente")
    parser.add_argument("--start-date", default=(datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d"),
                        help="Fecha de inicio para la exportación API en formato YYYY-MM-DD (por defecto: hace 90 días)")
    
    args = parser.parse_args()
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("[ERROR] Las variables SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar configuradas.")
        sys.exit(1)
        
    print(f"Inicializando cliente de Supabase ({SUPABASE_URL})...")
    supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    if args.csv_file:
        # Modo CSV
        print(f"--- MODO ARCHIVO CSV ---")
        if not os.path.exists(args.csv_file):
            print(f"[ERROR] El archivo CSV no existe en la ruta: {args.csv_file}")
            sys.exit(1)
        count = sync_from_csv(supabase_client, args.csv_file)
        print(f"Proceso finalizado. Total importado: {count} proveedores.")
    else:
        # Modo API
        print(f"--- MODO API USERPILOT ---")
        if not USERPILOT_API_KEY:
            print("[ERROR] USERPILOT_API_KEY no configurado. Especifique la clave de API en hub/.env.local para usar el modo API.")
            print("O bien, use el modo CSV ejecutando: python sync_userpilot.py --csv-file <ruta_al_archivo.csv>")
            sys.exit(1)
        count = sync_from_api(supabase_client, USERPILOT_API_KEY, args.start_date)
        print(f"Proceso finalizado. Total importado vía API: {count} proveedores.")

if __name__ == "__main__":
    main()
