#!/usr/bin/env python3
"""
Script de envío de datos vía Webhook para el Data Analyst de la Célula Seller Success.
Permite enviar archivos CSV o estructuras JSON con la data actualizada de sellers a Supabase/Dashboard.
"""

import json
import csv
import urllib.request
import sys

# Configuración del Webhook de la Célula Seller Success
WEBHOOK_URL = "http://localhost:3000/api/webhooks/seller-success"  # O la URL pública de producción
API_KEY = "seller-success-secret-2026"

def send_seller_data(sellers_list):
    """
    Envía un lote de datos de sellers al Webhook de la célula.
    """
    payload = json.dumps(sellers_list).encode('utf-8')
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }

    req = urllib.request.Request(WEBHOOK_URL, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            print("✅ [EXITO] Data enviada al Webhook:", res_data)
            return res_data
    except Exception as e:
        print("❌ [ERROR] Falló el envío al Webhook:", e)
        return None

def send_from_csv(csv_filepath):
    """
    Lee un CSV exportado por el Data Analyst y lo envía en un lote al Webhook.
    """
    sellers = []
    with open(csv_filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sellers.append(row)
    
    print(f"Enviando {len(sellers)} registros del CSV: {csv_filepath}...")
    return send_seller_data(sellers)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_from_csv(sys.argv[1])
    else:
        # Ejemplo de prueba con datos simulados del Data Analyst
        sample_data = [
            {
                "user_id": "671121",
                "name": "Sandry Rodelo",
                "email": "sandryrodelo07@gmail.com",
                "pais": "Colombia",
                "total_orders": 393,
                "nivel_leyendas": "Explorador"
            }
        ]
        send_seller_data(sample_data)
