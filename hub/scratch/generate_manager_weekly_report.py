import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

def get_data(table):
    try:
        return client.table(table).select("*").execute().data
    except Exception as e:
        print(f"Error fetching {table}: {e}")
        return []

# Fetch data
projects = get_data("projects")
risks = get_data("risks")
decisions = get_data("decisions")
all_metrics = get_data("pm_supplier_metrics")

# Get latest date metrics
latest_date = None
latest_metrics = []
if all_metrics:
    # Sort metrics by date desc
    all_metrics.sort(key=lambda x: x.get("metric_date", ""), reverse=True)
    latest_date = all_metrics[0]["metric_date"]
    latest_metrics = [r for r in all_metrics if r["metric_date"] == latest_date]

# Group latest metrics by country
metrics_by_country = {}
for m in latest_metrics:
    country = m["country"]
    if country not in metrics_by_country:
        metrics_by_country[country] = []
    metrics_by_country[country].append(m)

# Build status mapping
status_colors = {
    "Discovery": "🔵",
    "Planned": "🟡",
    "In Progress": "🟣",
    "Blocked": "🔴",
    "Done": "🟢",
    "Lanzamiento": "🔵",
}

report = []
report.append(f"# Reporte Gerencial Semanal — Célula Supplier Success")
report.append(f"**Fecha de Corte:** {latest_date or datetime.now().strftime('%Y-%m-%d')} | **Generado el:** {datetime.now().strftime('%Y-%m-%d')}\n")

report.append("---")
report.append("## 📈 Dashboard de Métricas de Negocio y Operación")
report.append("La célula Supplier Success mide su impacto en una estructura de 4 niveles, desde negocio hasta onboarding operativo:")

# For the report, show ALL (Global) first, then other countries in collapse blocks
countries = ["ALL", "CO", "MX", "EC"]
for country in countries:
    if country not in metrics_by_country:
        continue
    
    country_metrics = metrics_by_country[country]
    # Sort by level
    country_metrics.sort(key=lambda x: (x.get("metric_level", 9), x.get("metric_key", "")))
    
    title = "🌍 Global (Todos los Países)" if country == "ALL" else f"🇨🇴 Colombia" if country == "CO" else f"🇲🇽 México" if country == "MX" else f"🇪🇨 Ecuador"
    
    if country != "ALL":
        report.append(f"<details><summary><b>Ver métricas detalladas de {title}</b></summary>\n")
    else:
        report.append(f"### {title}\n")
        
    report.append("| Nivel | Métrica | Valor | Tendencia | Estado |")
    report.append("|---|---|---|---|---|")
    
    for m in country_metrics:
        trend_sym = "▲" if m.get("trend") == "up" else "▼" if m.get("trend") == "down" else "▶"
        trend_val = m.get("trend_value") or ""
        trend_str = f"{trend_sym} {trend_val}"
        
        health_sym = "🟢 Bueno" if m.get("health") == "good" else "🟡 Advertencia" if m.get("health") == "warning" else "🔴 Crítico" if m.get("health") == "critical" else "⚪ Neutral"
        
        level_names = {
            1: "1. Negocio (GMV)",
            2: "2. Adopción/Salud",
            3: "3. Eficiencia",
            4: "4. Onboarding"
        }
        lvl = level_names.get(m["metric_level"], f"Nivel {m['metric_level']}")
        
        report.append(f"| {lvl} | {m['metric_name']} | **{m['value_display']}** | {trend_str} | {health_sym} |")
        
    if country != "ALL":
        report.append("\n</details>\n")
    else:
        report.append("")

report.append("\n---")
report.append("## 🗺️ Estado de Portafolio de Proyectos")

report.append("""```mermaid
graph TD
    subgraph Discovery [1. Definición / Discovery]
        D_IC[Inteligencia Catálogo]
        D_CP[Catálogo Preseleccionado]
        D_DD[Dinámicas Descuentos]
        D_CHP[Conexión Chateapro]
        D_FAC[Facturación]
    end

    subgraph Executing [2. En Ejecución / Tech]
        E_COM[Combos MVP]
        E_IND[Panel Indicadores]
        E_TTV[Time to Value]
        E_CHP[Chip Proveedor]
    end

    subgraph Launching [3. Lanzamiento / Adopción]
        L_NEG[Negociaciones]
    end

    classDef disc fill:#4285f4,stroke:#333,stroke-width:1px,color:#fff;
    classDef exec fill:#8e44ad,stroke:#333,stroke-width:1px,color:#fff;
    classDef done fill:#34a853,stroke:#333,stroke-width:1px,color:#fff;

    class D_IC,D_CP,D_DD,D_CHP,D_FAC disc;
    class E_COM,E_IND,E_TTV,E_CHP exec;
    class L_NEG done;
```""")

report.append("| Proyecto | Estado | Owner | Avance y Próximo Hito |")
report.append("|---|---|---|---|")
for p in projects:
    color = status_colors.get(p.get("status"), "⚪")
    report.append(f"| {color} **{p['name']}** | `{p.get('status')}` | {p.get('owner') or 'Sin definir'} | {p.get('summary') or 'Sin resumen'} |")

report.append("\n---")
report.append("## 🚨 Riesgos y Alertas Críticas (Semáforo)")
active_risks = [r for r in risks if r.get("status") != "Closed"]
if active_risks:
    for r in active_risks:
        impact_color = "🔴" if r.get("impact") == "High" else "🟡" if r.get("impact") == "Medium" else "🟢"
        report.append(f"- {impact_color} **[{r.get('impact')} Impacto] {r.get('title')}** (Estado: `{r.get('status')}`): {r.get('description')} *Mitigación:* {r.get('mitigation') or 'No definida'}")
else:
    report.append("🟢 *No hay riesgos activos reportados en el sistema.*")

report.append("\n---")
report.append("## 📋 Últimas Decisiones Alineadas")
recent_decisions = [d for d in decisions if d.get("status") == "Active"]
if recent_decisions:
    for d in recent_decisions[:10]:
        report.append(f"- ⚖️ **{d.get('title')}**: {d.get('decision')} — *Racional:* {d.get('rationale')}")
else:
    report.append("- *No hay decisiones registradas recientemente.*")

report_path = Path("/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/manager_weekly_report.md")
report_path.write_text("\n".join(report_lines if 'report_lines' in locals() else report), encoding="utf-8")
print(f"Manager report generated successfully at: {report_path}")
