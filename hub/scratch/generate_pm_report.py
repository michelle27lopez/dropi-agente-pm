import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2] / "agente-delivery"
load_dotenv(ROOT / ".env")

client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

def get_data(table):
    try:
        return client.table(table).select("*").execute().data
    except Exception as e:
        print(f"Error fetching {table}: {e}")
        return []

projects = get_data("projects")
risks = get_data("risks")
followups = get_data("followups")
decisions = get_data("decisions")
drafts = get_data("draft_insights")
approved = get_data("approved_context")
okrs = get_data("okrs")
milestones = get_data("milestones")

# Group by project_id
project_map = {p["id"]: {
    "info": p,
    "risks": [],
    "followups": [],
    "decisions": [],
    "drafts": [],
    "approved": [],
    "okrs": [],
    "milestones": []
} for p in projects}

# Add unassigned / None projects too
unassigned = {
    "info": {"id": None, "name": "Sin Proyecto / Global", "status": "N/A", "summary": ""},
    "risks": [],
    "followups": [],
    "decisions": [],
    "drafts": [],
    "approved": [],
    "okrs": [],
    "milestones": []
}

def assign_to_project(items, key):
    for item in items:
        p_id = item.get("project_id") or item.get("project")
        if p_id in project_map:
            project_map[p_id][key].append(item)
        else:
            unassigned[key].append(item)

assign_to_project(risks, "risks")
assign_to_project(followups, "followups")
assign_to_project(decisions, "decisions")
assign_to_project(drafts, "drafts")
assign_to_project(approved, "approved")
assign_to_project(okrs, "okrs")
assign_to_project(milestones, "milestones")

report_lines = []
report_lines.append("# Reporte de Proyectos y Memorias — Célula Supplier Success")
report_lines.append("Este reporte consolida la información activa en Supabase (proyectos, OKRs, compromisos, riesgos, decisiones y estado de memorias) para planificar los avances de la semana.\n")

report_lines.append("## Resumen de Proyectos\n")
report_lines.append("| Proyecto | Estado | Owner | Resumen |")
report_lines.append("|---|---|---|---|")
for p_id, data in project_map.items():
    p = data["info"]
    report_lines.append(f"| **{p['name']}** | `{p.get('status')}` | {p.get('owner') or 'Sin definir'} | {p.get('summary') or 'Sin resumen'} |")
report_lines.append("\n---\n")

for p_id, data in list(project_map.items()) + [(None, unassigned)]:
    p = data["info"]
    if p_id is None and not any(data[k] for k in ["risks", "followups", "decisions", "drafts", "approved", "okrs", "milestones"]):
        continue # Skip global if empty
        
    report_lines.append(f"## {p['name']} (Estado: `{p.get('status')}`) ")
    if p.get('summary'):
        report_lines.append(f"*{p['summary']}*\n")
        
    # OKRs
    if data["okrs"]:
        report_lines.append("### OKRs Relacionados")
        for o in data["okrs"]:
            report_lines.append(f"- **{o.get('objective')}**: {o.get('key_result')} (Métrica: {o.get('metric_name')}, Target: {o.get('target')}, Actual: {o.get('current_value')}) — `[{o.get('status')}]`")
        report_lines.append("")

    # Milestones
    if data["milestones"]:
        report_lines.append("### Hitos (Milestones)")
        for m in data["milestones"]:
            report_lines.append(f"- **{m.get('name')}**: {m.get('description')} (Fecha: {m.get('target_date')}) — `[{m.get('status')}]`")
        report_lines.append("")

    # Followups (Compromisos)
    active_followups = [f for f in data["followups"] if f.get("status") not in ["Done", "Cancelled"]]
    done_followups = [f for f in data["followups"] if f.get("status") in ["Done", "Cancelled"]]
    if active_followups:
        report_lines.append("### Compromisos Pendientes (Followups)")
        for f in active_followups:
            due = f.get('due_date') or 'Sin fecha'
            report_lines.append(f"- `[{f.get('status')}]` **{f.get('title')}** — Responsable: *{f.get('owner') or 'Sin definir'}* (Límite: {due})")
        report_lines.append("")
    if done_followups:
        report_lines.append("<details><summary><b>Compromisos Completados/Cancelados (" + str(len(done_followups)) + ")</b></summary>\n")
        for f in done_followups:
            report_lines.append(f"- `[{f.get('status')}]` **{f.get('title')}** — Responsable: *{f.get('owner')}*")
        report_lines.append("\n</details>\n")

    # Risks
    active_risks = [r for r in data["risks"] if r.get("status") != "Closed"]
    if active_risks:
        report_lines.append("### Riesgos Activos")
        for r in active_risks:
            report_lines.append(f"- `[{r.get('status')}]` **{r.get('title')}** (Impacto: `{r.get('impact')}`, Probabilidad: `{r.get('probability')}`) — *Mitigación:* {r.get('mitigation') or 'No definida'}")
        report_lines.append("")

    # Decisions
    if data["decisions"]:
        report_lines.append("### Decisiones Oficiales")
        for d in data["decisions"]:
            report_lines.append(f"- **{d.get('title')}**: {d.get('decision')} — *Razón:* {d.get('rationale')}")
        report_lines.append("")

    # Approved Context vs Drafts
    report_lines.append("### Estado de Memoria y Contexto")
    if data["approved"]:
        report_lines.append(f"**Contexto Aprobado ({len(data['approved'])} items):**")
        for a in data["approved"]:
            report_lines.append(f"- `[Aprobado]` **{a.get('title')}** ({a.get('context_type')}) — Versión: {a.get('version')}, Actualizado: {a.get('approved_at') or a.get('created_at')}")
    else:
        report_lines.append("- *No hay contexto aprobado oficial aún.*")
        
    if data["drafts"]:
        active_drafts = [d for d in data["drafts"] if d.get("status") in ["Draft", "In Review", "Approved Candidate"]]
        if active_drafts:
            report_lines.append(f"\n**Borradores / Memorias en Progreso ({len(active_drafts)} items):**")
            for d in active_drafts:
                report_lines.append(f"- `[{d.get('status')}]` **{d.get('title')}** ({d.get('draft_type')})")
    report_lines.append("\n---\n")

report_path = Path("/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub/scratch/projects_status_report.md")
report_path.write_text("\n".join(report_lines), encoding="utf-8")
print(f"Report generated successfully at: {report_path}")
