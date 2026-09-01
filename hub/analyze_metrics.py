import csv

path_activacion = "/Users/santiago.herrera/Downloads/fact_activacion_ttv (2).csv"
path_ordenes = "/Users/santiago.herrera/Downloads/fact_ordenes_activos (2).csv"
path_supervivencia = "/Users/santiago.herrera/Downloads/fact_supervivencia (2).csv"

def get_metrics():
    # 1. Activation metrics for August
    august_cohort = 0
    august_bruto = 0
    august_neto = 0
    august_ttv_dias = []
    
    with open(path_activacion, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['cohort_month'] == '2026-08-01':
                august_cohort += 1
                if row['activado_bruto'].lower() == 'true':
                    august_bruto += 1
                if row['activado_neto'].lower() == 'true':
                    august_neto += 1
                    try:
                        august_ttv_dias.append(float(row['ttv_neto_dias']))
                    except:
                        pass

    activationRate = (august_bruto / august_cohort) * 100 if august_cohort > 0 else 0
    activationRateNet = (august_neto / august_cohort) * 100 if august_cohort > 0 else 0
    
    august_ttv_dias.sort()
    if len(august_ttv_dias) > 0:
        mid = len(august_ttv_dias) // 2
        ttvNetoMedian = august_ttv_dias[mid] if len(august_ttv_dias) % 2 != 0 else (august_ttv_dias[mid-1] + august_ttv_dias[mid]) / 2.0
    else:
        ttvNetoMedian = 0

    # 2. Survival rate for July (latest mature 30d cohort)
    july_cohort = 0
    july_sobrevive = 0
    
    with open(path_supervivencia, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['cohorte_primera_orden'] == '2026-07-01' and row['ventana_30d_completa'].lower() == 'true':
                july_cohort += 1
                if row['sobrevive_30d'].lower() == 'true':
                    july_sobrevive += 1
                    
    survivalRate = (july_sobrevive / july_cohort) * 100 if july_cohort > 0 else 0

    # 3. Active Users (August) - let's see how many unique users have orders in august
    august_active_users = set()
    with open(path_ordenes, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['mes'] == '2026-08-01':
                august_active_users.add(row['user_id'])
                
    activeCount = len(august_active_users)

    print("--- METRICS TO UPDATE ---")
    print(f"activationRateNet: {activationRateNet:.1f}%")
    print(f"ttvNetoMedian: {ttvNetoMedian:.1f} días")
    print(f"activationRate: {activationRate:.1f}%")
    print(f"survivalRate (July): {survivalRate:.1f}%")
    print(f"activeCount (August unique): {activeCount}")

get_metrics()
