#!/usr/bin/env python3
"""
import_ttv_data.py
Script para procesar y cargar los datos de TTV de registros Userpilot, CRM GHL y encuestas.
Determina el segmento y la comunidad para cada registro.
"""

import os
import sys
import csv
from supabase import create_client

# Cargar variables de entorno del archivo .env.local de hub
ENV_PATH = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/.env.local"
env_vars = {}

try:
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env_vars[k.strip()] = v.strip()
except Exception as e:
    print(f"Error cargando archivo env: {e}")
    sys.exit(1)

SUPABASE_URL = env_vars.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = env_vars.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_URL o SUPABASE_SERVICE_KEY no están configurados en hub/.env.local")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Rutas de los archivos
DATA_DIR = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/doc hub/data ttv"
COMUNIDADES_MASTER_PATH = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/doc hub/Comunidades.csv"

CRM_PATH = os.path.join(DATA_DIR, "crm 14 jul.csv")
UP_REGISTERS_PATH = os.path.join(DATA_DIR, "singups 14 juli userpilot.csv")
SURVEY_COMUNIDADES_PATH = os.path.join(DATA_DIR, "encuesta comunidades 16jul.csv")
SURVEY_HUERFANOS_PATH = os.path.join(DATA_DIR, "encuesta huerfanos 16 jul.csv")

def normalize_email(email):
    if not email:
        return ""
    return str(email).strip().lower()

def normalize_phone(phone):
    if not phone:
        return ""
    # Quitar caracteres no numéricos
    clean = "".join(c for c in str(phone) if c.isdigit())
    # Si empieza con 57 y tiene 12 dígitos, quitar el 57
    if len(clean) == 12 and clean.startswith("57"):
        clean = clean[2:]
    return clean

# Mapeo de volumen a segment_key
def map_volume_to_segment(val):
    if not val:
        return "pequenos"
    val_clean = str(val).strip().lower()
    if any(x in val_clean for x in ["menos de 50", "aún no", "aun no", "no he vendido", "no online"]):
        return "pequenos"
    elif any(x in val_clean for x in ["51 a 300", "51 y 200", "50_300"]):
        return "50_300"
    elif any(x in val_clean for x in ["301 a 1.000", "201 y 500", "300_1000"]):
        return "300_1000"
    elif any(x in val_clean for x in ["más de 1.000", "mas de 1.000", "más de 1.500", "mas de 1.500", "1000_plus"]):
        return "1000_plus"
    return "pequenos"

# 1. Cargar mapeo de comunidades histórico
ref_to_community = {}
if os.path.exists(COMUNIDADES_MASTER_PATH):
    print("Cargando mapeo de comunidades histórico...")
    with open(COMUNIDADES_MASTER_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        belong_idx = header.index('Belong To Comunity')
        ref_idx = header.index('Referred By')
        for row in reader:
            if len(row) > max(belong_idx, ref_idx):
                b = row[belong_idx].strip()
                r = row[ref_idx].strip()
                if r != '-' and r != '' and b != '-' and b != '':
                    ref_to_community[r] = b
    print(f"Mapeo de comunidades cargado: {len(ref_to_community)} IDs de referidos mapeados.")
else:
    print("Advertencia: No se encontró Comunidades.csv en el maestro. Se saltará el mapeo de referidos.")

# 2. Cargar encuestas (vienen pre-separadas por origen: comunidades vs huérfanos)
survey_responses = {} # user_id -> dict de respuestas
survey_community_ids = set() # user_ids confirmados como comunidad por el archivo de origen

def process_8q_survey(file_path, source_name, is_community_source=False):
    """
    Encuesta ramificada Proveedor/Marca (16 columnas).
    Col 5 (pregunta 1) decide la rama: si empieza con "Proveedor" responde
    2-6 (cols 6-10); si es "Marca" responde 7-11 (cols 11-15). Las dos ramas
    comparten los mismos textos de pregunta duplicados en distintas columnas,
    por eso se lee por posición y no por nombre de encabezado.
    """
    if not os.path.exists(file_path):
        print(f"Archivo no encontrado: {file_path}")
        return
    print(f"Procesando encuesta desde: {file_path}...")

    def clean(v):
        v = v.strip()
        return v if v and v != '-' else None

    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 16:
                continue
            user_id = row[0].strip()
            if not user_id or user_id == '-':
                continue

            if is_community_source:
                survey_community_ids.add(user_id)

            role_raw = clean(row[5])
            is_proveedor = bool(role_raw) and role_raw.lower().startswith("proveedor")

            if is_proveedor:
                survey_stage = clean(row[6])
                survey_volume = clean(row[7])
                survey_sell_pref = clean(row[9])
                survey_category = clean(row[10])
                survey_brand_sales = None
                survey_shipping_pref = None
                survey_purpose = None
            else:
                survey_stage = None
                survey_volume = None
                survey_brand_sales = clean(row[11])
                survey_shipping_pref = clean(row[12])
                survey_purpose = clean(row[14])
                survey_category = clean(row[15])
                survey_sell_pref = None

            # Determinar volumen final para segment_key
            vol_val = survey_volume or survey_brand_sales
            segment_key = map_volume_to_segment(vol_val)

            survey_responses[user_id] = {
                "survey_role": role_raw,
                "survey_stage": survey_stage,
                "survey_volume": survey_volume,
                "survey_purpose": survey_purpose,
                "survey_brand_sales": survey_brand_sales,
                "survey_shipping_pref": survey_shipping_pref,
                "survey_sell_pref": survey_sell_pref,
                "survey_source": source_name,
                "segment_key": segment_key,
                "tipo_proveedor": survey_category
            }

process_8q_survey(SURVEY_COMUNIDADES_PATH, "encuesta_comunidades_16jul", is_community_source=True)
process_8q_survey(SURVEY_HUERFANOS_PATH, "encuesta_huerfanos_16jul", is_community_source=False)

print(f"Total de respuestas de encuestas recolectadas: {len(survey_responses)}")

# 3. Procesar Oportunidades del CRM GHL (antes que Userpilot: el CRM ya trae
#    comunidad/huerfano/nombre_comunidad, señal más fresca que el mapeo viejo
#    por "Referido por" contra Comunidades.csv)
crm_records = []
crm_email_to_community_name = {}
crm_email_to_comunidad_flag = {}
if os.path.exists(CRM_PATH):
    print(f"Procesando CRM oportunidades desde: {CRM_PATH}...")
    with open(CRM_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)

        opp_name_idx = header.index("Nombre de la oportunidad")
        contact_name_idx = header.index("Nombre del contacto")
        phone_idx = header.index("teléfono")
        email_idx = header.index("correo electrónico")
        seq_idx = header.index("secuencia")
        stage_idx = header.index("fase")
        assigned_idx = header.index("asignado")
        created_idx = header.index("Creado el")
        updated_idx = header.index("Actualizado el")
        tags_idx = header.index("etiquetas")
        status_idx = header.index("estado")
        opp_id_idx = header.index("ID de oportunidad")
        contact_id_idx = header.index("ID de contacto")
        comunidad_idx = header.index("comunidad")
        nombre_comunidad_idx = header.index("nombre_comunidad")

        for row in reader:
            if len(row) <= max(opp_name_idx, email_idx, stage_idx, opp_id_idx):
                continue

            opp_id = row[opp_id_idx].strip()
            if not opp_id:
                continue

            email = normalize_email(row[email_idx].strip())
            phone = normalize_phone(row[phone_idx].strip())

            nombre_comunidad = row[nombre_comunidad_idx].strip() if len(row) > nombre_comunidad_idx else ""
            comunidad_flag = row[comunidad_idx].strip().upper() if len(row) > comunidad_idx else ""
            if email:
                if nombre_comunidad and nombre_comunidad != '-':
                    crm_email_to_community_name[email] = nombre_comunidad
                elif comunidad_flag == "SI":
                    crm_email_to_comunidad_flag[email] = True

            # Parsear tags
            tags_str = row[tags_idx].strip()
            tags = [t.strip() for t in tags_str.split(",") if t.strip()] if tags_str else []

            crm_records.append({
                "opportunity_id": opp_id,
                "contact_id": row[contact_id_idx].strip(),
                "contact_name": row[contact_name_idx].strip(),
                "opportunity_name": row[opp_name_idx].strip(),
                "phone": row[phone_idx].strip(),
                "email": row[email_idx].strip(),
                "stage_name": row[stage_idx].strip(),
                "status": row[status_idx].strip(),
                "date_created": row[created_idx].strip(),
                "date_updated": row[updated_idx].strip(),
                "tags": tags,
                "assigned_to": row[assigned_idx].strip(),
                "sequence": row[seq_idx].strip(),
                "segment_key": None,  # se completa más abajo, tras procesar Userpilot/encuestas
                "is_manual": False # se calcula en vivo comparando si existe en Userpilot
            })

# 4. Procesar registros de Userpilot
userpilot_cohort_records = []
userpilot_suppliers_records = []

# Mapeos de traducción rápidos
user_id_to_email = {}
user_id_to_phone = {}
email_to_segment = {}
phone_to_segment = {}
email_to_community = {}
phone_to_community = {}

if os.path.exists(UP_REGISTERS_PATH):
    print(f"Procesando registros de Userpilot: {UP_REGISTERS_PATH}...")
    with open(UP_REGISTERS_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)

        id_idx = header.index("User Id")
        name_idx = header.index("Name")
        email_idx = header.index("Email")
        signed_idx = header.index("Signed Up")
        phone_idx = header.index("Phone")
        country_idx = header.index("Country")
        ref_idx = header.index("Referred By")
        device_idx = header.index("Device Type")
        lang_idx = header.index("Browser Language")
        browser_idx = header.index("Browser")
        os_idx = header.index("Os")
        role_idx = header.index("Role")
        verified_idx = header.index("Verified")
        billing_idx = header.index("Billing Information")

        for row in reader:
            if len(row) <= max(id_idx, name_idx, email_idx, signed_idx, phone_idx, country_idx, ref_idx):
                continue

            user_id = row[id_idx].strip()
            if not user_id or user_id == '-':
                continue

            name = row[name_idx].strip()
            email = normalize_email(row[email_idx].strip())
            signed_up = row[signed_idx].strip()
            phone = normalize_phone(row[phone_idx].strip())
            country = row[country_idx].strip()
            referred_by = row[ref_idx].strip()

            device_type = row[device_idx].strip() if row[device_idx].strip() != '-' else None
            browser_lang = row[lang_idx].strip() if row[lang_idx].strip() != '-' else None
            browser = row[browser_idx].strip() if row[browser_idx].strip() != '-' else None
            os_name = row[os_idx].strip() if row[os_idx].strip() != '-' else None
            role = row[role_idx].strip() if row[role_idx].strip() != '-' else 'SUPPLIER'
            verified = row[verified_idx].strip().lower() == 'true'
            billing_info = row[billing_idx].strip().lower() == 'true'

            # Guardar mappings
            if email:
                user_id_to_email[user_id] = email
            if phone:
                user_id_to_phone[user_id] = phone

            # Resolver comunidad (prioridad: referido histórico > CRM con nombre >
            # CRM sin nombre > encuesta de origen). El mapeo por "Referido por" contra
            # Comunidades.csv quedó desactualizado (mayo), por eso el CRM y la encuesta
            # pesan más si el histórico no resuelve nada.
            belong_to_community = None
            if referred_by and referred_by != '-' and referred_by != '':
                belong_to_community = ref_to_community.get(referred_by)
            if not belong_to_community and email in crm_email_to_community_name:
                belong_to_community = crm_email_to_community_name[email]
            if not belong_to_community and crm_email_to_comunidad_flag.get(email):
                belong_to_community = "Comunidad (CRM, sin nombre)"
            if not belong_to_community and user_id in survey_community_ids:
                belong_to_community = "Comunidad (encuesta)"

            if email and belong_to_community:
                email_to_community[email] = belong_to_community
            if phone and belong_to_community:
                phone_to_community[phone] = belong_to_community

            # Buscar respuestas de encuesta
            survey = survey_responses.get(user_id)
            segment_key = survey.get("segment_key") if survey else "pequenos"

            if email:
                email_to_segment[email] = segment_key
            if phone:
                phone_to_segment[phone] = segment_key

            # Record para userpilot_suppliers (maestro)
            supplier_record = {
                "user_id": user_id,
                "name": name,
                "email": email,
                "signed_up": signed_up,
                "phone": phone,
                "country": country,
                "referred_by": referred_by if referred_by != '-' else None,
                "belong_to_community": belong_to_community,
                "device_type": device_type,
                "browser_language": browser_lang,
                "browser": browser,
                "os": os_name,
                "role": role,
                "verified": verified,
                "billing_information": billing_info,
            }
            if survey:
                supplier_record.update({
                    "survey_role": survey["survey_role"],
                    "survey_stage": survey["survey_stage"],
                    "survey_volume": survey["survey_volume"],
                    "survey_purpose": survey["survey_purpose"],
                    "survey_brand_sales": survey["survey_brand_sales"],
                    "survey_shipping_pref": survey["survey_shipping_pref"],
                    "survey_sell_pref": survey["survey_sell_pref"],
                    "survey_source": survey["survey_source"],
                    "tipo_proveedor": survey["tipo_proveedor"]
                })
            userpilot_suppliers_records.append(supplier_record)

            # Record para ttv_userpilot_cohort
            userpilot_cohort_records.append({
                "user_id": user_id,
                "name": name,
                "email": email,
                "signed_up": signed_up,
                "phone": phone,
                "country": country,
                "segment_key": segment_key
            })
else:
    print(f"Error: No se encontró {UP_REGISTERS_PATH}")
    sys.exit(1)

# 5. Completar segment_key de las oportunidades CRM ya con email_to_segment listo
for rec in crm_records:
    email = normalize_email(rec["email"])
    phone = normalize_phone(rec["phone"])
    if email and email in email_to_segment:
        rec["segment_key"] = email_to_segment[email]
    elif phone and phone in phone_to_segment:
        rec["segment_key"] = phone_to_segment[phone]
    else:
        rec["segment_key"] = "pequenos"

# 6. Guardar en Supabase en lotes
def upload_batches(table, records, on_conflict=None):
    if not records:
        print(f"Sin registros para la tabla {table}")
        return
        
    print(f"Subiendo {len(records)} registros a '{table}'...")
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        try:
            if on_conflict:
                supabase.table(table).upsert(batch, on_conflict=on_conflict).execute()
            else:
                supabase.table(table).upsert(batch).execute()
        except Exception as e:
            print(f"Error subiendo lote {i}-{i+batch_size} a '{table}': {e}")
            # Intentar uno a uno en caso de error para no abortar todo
            for record in batch:
                try:
                    if on_conflict:
                        supabase.table(table).upsert([record], on_conflict=on_conflict).execute()
                    else:
                        supabase.table(table).upsert([record]).execute()
                except Exception as ex:
                    print(f"  Fallo registro individual: {record.get('email') or record.get('user_id')} -> {ex}")
    print(f"✓ Sincronización completada para {table}")

upload_batches("userpilot_suppliers", userpilot_suppliers_records)
upload_batches("ttv_userpilot_cohort", userpilot_cohort_records)
upload_batches("ttv_crm_opportunities", crm_records, on_conflict="opportunity_id")

print("¡Proceso de importación finalizado con éxito!")
