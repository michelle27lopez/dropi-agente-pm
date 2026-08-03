import openpyxl

def inspect_pareto_cuidado():
    path = '/Users/santiago.herrera/Downloads/Copia Sellers de 2026 Acompañamiento Comercial 360 Comunidades.xlsx'
    wb = openpyxl.load_workbook(path, data_only=True)
    sheet = wb['ParetoCuidado de Campaña']
    rows = list(sheet.iter_rows(values_only=True))
    
    print("=== ParetoCuidado de Campaña Header & Data ===")
    print("Row 9 Header:", rows[9])
    
    # Print rows 10 to 25
    for idx, row in enumerate(rows[10:30]):
        # Filter None
        if all(v is None for v in row):
            continue
        print(f"Row {idx+10}: {[str(v)[:30] if v is not None else 'None' for v in row[:15]]}")

if __name__ == '__main__':
    inspect_pareto_cuidado()
