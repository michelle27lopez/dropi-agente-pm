import json

json_file = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/suppliers_after_june_29_2026.json"
md_file = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/suppliers_after_june_29_2026.md"

def convert():
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        markdown = f"# Reporte: Nuevos Proveedores (Registros después del 29 de junio de 2026)\n\n"
        markdown += f"Se encontraron **{len(data)}** nuevos proveedores registrados en Userpilot desde el 29 de junio de 2026 (últimas 24-48 horas).\n\n"
        
        markdown += "| # | ID Usuario | Nombre | Email | Teléfono | País | Fecha Registro |\n"
        markdown += "|---|------------|--------|-------|----------|------|----------------|\n"
        
        for i, row in enumerate(data):
            # Clean fields
            user_id = row.get("user_id") or ""
            name = row.get("name") or "Sin Nombre"
            email = row.get("email") or "Sin Email"
            phone = row.get("phone") or "Sin Teléfono"
            country = row.get("country") or "Desconocido"
            signed_up = row.get("signed_up") or ""
            
            # Format date (strip milliseconds and timezone if long)
            if signed_up and 'T' in signed_up:
                signed_up = signed_up.split('+')[0].replace('T', ' ')
            
            markdown += f"| {i+1} | `{user_id}` | {name} | `{email}` | `{phone}` | {country} | {signed_up} |\n"
            
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
            
        print(f"Successfully generated markdown report at: {md_file}")
    except Exception as e:
        print("Error converting to markdown:", e)

if __name__ == "__main__":
    convert()
