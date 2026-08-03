import openpyxl
import json

def inspect_excel():
    path = '/Users/santiago.herrera/Downloads/Copia Sellers de 2026 Acompañamiento Comercial 360 Comunidades.xlsx'
    wb = openpyxl.load_workbook(path, data_only=True)
    print("Sheets in workbook:", wb.sheetnames)
    
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        print(f"\n--- Sheet: {sheet_name} ---")
        print(f"Dimensions: {sheet.dimensions}")
        
        # Get first 15 rows
        rows = list(sheet.iter_rows(values_only=True))
        if not rows:
            print("Empty sheet.")
            continue
            
        print(f"Total rows found: {len(rows)}")
        
        # Print first 10 rows
        for idx, row in enumerate(rows[:15]):
            # Filter out completely None rows for display
            if all(v is None for v in row):
                continue
            # Print row with index
            truncated_row = [str(v)[:30] if v is not None else "None" for v in row[:12]]
            print(f"Row {idx:02d}: {truncated_row}")

if __name__ == '__main__':
    inspect_excel()
