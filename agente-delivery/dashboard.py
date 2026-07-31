#!/usr/bin/env python3
"""Dashboard local de proyectos PM OS. Ejecutar: python3 dashboard.py"""

import os
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

PROJECTS_DIR = Path(__file__).parent / "context" / "projects"

STATUS_COLORS = {
    "discovery": "#0EA5E9",
    "definicion": "#7C3AED",
    "desarrollo": "#F77F00",
    "lanzamiento": "#10B981",
    "pausado": "#6B7280",
}

def parse_frontmatter(content):
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}
    result = {}
    for line in match.group(1).splitlines():
        if ':' not in line:
            continue
        key, _, value = line.partition(':')
        result[key.strip()] = value.strip().strip('"\'')
    return result

def get_projects():
    projects = []
    if not PROJECTS_DIR.exists():
        return projects
    for f in sorted(PROJECTS_DIR.glob("*.md")):
        if f.name == "README.md":
            continue
        fm = parse_frontmatter(f.read_text(encoding="utf-8"))
        projects.append({
            "slug": f.stem,
            "nombre": fm.get("nombre", f.stem),
            "estado": fm.get("estado", "sin estado"),
            "equipo": fm.get("equipo", ""),
            "descripcion": fm.get("descripcion", ""),
            "color": fm.get("color", "#6B7280"),
            "icon": fm.get("icon", "📁"),
        })
    return projects

def render_card(p):
    color = p["color"]
    status_color = STATUS_COLORS.get(p["estado"], "#6B7280")
    return f"""
    <div class="card" style="border-top: 3px solid {color};">
      <div class="card-header">
        <div class="icon" style="background:{color}20;">{p["icon"]}</div>
        <span class="badge" style="color:{status_color}; background:{status_color}18;">{p["estado"]}</span>
      </div>
      <h2>{p["nombre"]}</h2>
      {"<p class='team'>" + p["equipo"] + "</p>" if p["equipo"] else ""}
      <p class="desc">{p["descripcion"] or "Sin descripción"}</p>
    </div>"""

def render_page(projects):
    cards = "\n".join(render_card(p) for p in projects)
    empty = "" if projects else """
    <div class="empty">
      <div style="font-size:40px;margin-bottom:12px">📂</div>
      <p style="font-weight:600;margin-bottom:6px">Sin proyectos todavía</p>
      <p>Agrega archivos <code>.md</code> en <code>agente-delivery/context/projects/</code></p>
    </div>"""
    count = f"{len(projects)} proyecto{'s' if len(projects) != 1 else ''}" if projects else ""

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PM OS · Proyectos</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #F8F9FA; color: #111827; -webkit-font-smoothing: antialiased; }}
    header {{ background: #fff; border-bottom: 1px solid #E5E7EB;
              padding: 20px 32px; display: flex; align-items: center;
              justify-content: space-between; }}
    .logo {{ display: flex; align-items: center; gap: 12px; }}
    .logo-icon {{ width:36px; height:36px; border-radius:10px; background:#0EA5E920;
                  display:flex; align-items:center; justify-content:center; font-size:18px; }}
    h1 {{ font-size: 16px; font-weight: 700; line-height: 1.2; }}
    .subtitle {{ font-size: 12px; color: #6B7280; margin-top: 2px; }}
    .refresh {{ font-size:13px; color:#6B7280; text-decoration:none;
                border:1px solid #E5E7EB; padding:6px 12px;
                border-radius:8px; cursor:pointer; background:#F8F9FA; }}
    .refresh:hover {{ background:#fff; }}
    main {{ max-width: 900px; margin: 0 auto; padding: 48px 24px; }}
    .section-label {{ font-size:13px; color:#6B7280; margin-bottom:20px;
                      text-transform:uppercase; letter-spacing:0.08em; font-weight:600; }}
    .grid {{ display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px; }}
    .card {{ background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:24px; }}
    .card-header {{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }}
    .icon {{ width:44px; height:44px; border-radius:12px; display:flex;
             align-items:center; justify-content:center; font-size:22px; }}
    .badge {{ font-size:11px; font-weight:600; padding:3px 8px; border-radius:20px;
              text-transform:capitalize; margin-top:4px; }}
    h2 {{ font-size:15px; font-weight:700; margin-bottom:4px; }}
    .team {{ font-size:11px; color:#6B7280; font-weight:600;
             text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; }}
    .desc {{ font-size:13px; color:#6B7280; line-height:1.5; }}
    .empty {{ text-align:center; padding:80px 24px; color:#6B7280; }}
    footer {{ font-size:12px; color:#6B7280; margin-top:48px; text-align:center; }}
    code {{ font-size:11px; background:#F3F4F6; padding:2px 6px; border-radius:4px; }}
  </style>
</head>
<body>
  <header>
    <div class="logo">
      <div class="logo-icon">📋</div>
      <div>
        <h1>PM OS · Proyectos</h1>
        <p class="subtitle">Santiago Herrera · Dropi · Seller Success · modo local</p>
      </div>
    </div>
    <a class="refresh" href="/">↻ Refrescar</a>
  </header>
  <main>
    {f'<p class="section-label">{count}</p>' if count else ""}
    {"<div class='grid'>" + cards + "</div>" if projects else empty}
    <footer>
      Fuente: <code>agente-delivery/context/projects/</code> · sin base de datos
    </footer>
  </main>
</body>
</html>"""

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        html = render_page(get_projects()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html)))
        self.end_headers()
        self.wfile.write(html)

    def log_message(self, format, *args):
        pass  # silenciar logs de requests

if __name__ == "__main__":
    port = 8080
    print(f"  PM OS Dashboard corriendo en → http://localhost:{port}")
    print(f"  Proyectos: {PROJECTS_DIR}")
    print(f"  Ctrl+C para detener\n")
    HTTPServer(("", port), Handler).serve_forever()
