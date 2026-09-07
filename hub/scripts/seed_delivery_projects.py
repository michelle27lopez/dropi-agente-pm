import os
import requests
import json

env = {}
with open('hub/.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k] = v.strip('"\'')

URL = env['NEXT_PUBLIC_SUPABASE_URL']
KEY = env['SUPABASE_SERVICE_KEY']

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 1. Fetch celulas to get Seller Success id
res = requests.get(f"{URL}/rest/v1/celulas?select=id,slug", headers=headers)
celulas = res.json()
seller_success_id = next((c['id'] for c in celulas if c['slug'] == 'sellers'), None)
if not seller_success_id:
    print("Could not find sellers. Options:", [c['slug'] for c in celulas])
    seller_success_id = celulas[0]['id']

print(f"Using Celula ID: {seller_success_id}")

projects_to_seed = [
    {
        "name": "Integración de Dropify en Tiendanube caída - Urgente",
        "project_code": "TN-URGENTE",
        "type": "Delivery Proyecto",
        "estado_interno": "Cerrado",
        "prioridad": "P0",
        "celula_owner_id": seller_success_id
    },
    {
        "name": "Tienda Nube: Errores Integración",
        "project_code": "TN-BUGS",
        "type": "Delivery Proyecto",
        "estado_interno": "en DEV",
        "prioridad": "P0",
        "celula_owner_id": seller_success_id
    },
    {
        "name": "Page Pilot",
        "project_code": "PAGEPILOT",
        "type": "Delivery Proyecto",
        "estado_interno": "Activo",
        "prioridad": "P1",
        "celula_owner_id": seller_success_id
    },
    {
        "name": "Dropify Shopify 2.0 (Pruebas 2.0)",
        "project_code": "SHOPIFY-2.0",
        "type": "Delivery Proyecto",
        "estado_interno": "Activo",
        "prioridad": "P2",
        "celula_owner_id": seller_success_id
    },
    {
        "name": "Dropify 2.0 — WooCommerce",
        "project_code": "WOO-2.0",
        "type": "Delivery Proyecto",
        "estado_interno": "en DEV",
        "prioridad": None,
        "celula_owner_id": seller_success_id
    },
    {
        "name": "Dropify 2.2 Multiplataforma (Tienda Nube)",
        "project_code": "TN-2.2",
        "type": "Delivery Proyecto",
        "estado_interno": "Pendiente Handoff",
        "prioridad": None,
        "celula_owner_id": seller_success_id
    }
]

res = requests.post(f"{URL}/rest/v1/projects", headers=headers, json=projects_to_seed)
if res.ok:
    print("Successfully seeded projects:")
    for p in res.json():
        print(f" - {p['name']} ({p['id']})")
else:
    print(f"Error seeding projects: {res.text}")
