# Spec · Page Pilot — Documento de Lanzamiento (GRO-003)

> Fuente de verdad interna de este proyecto. Estados: ⚪ discovery · 🟡 definido ·
> 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

| Campo | Valor |
|-------|-------|
| Owner / PM | Catherin Salazar |
| Célula | Growth Marketing |
| Fase del Launch System | `02_Launch_System` — documentación / comunicación del lanzamiento |
| Estado global | 🔵 en diseño (piloto funcional, en iteración) |
| Última actualización | 2026-08-25 |

## 0 · Resumen y estado global
Página HTML autocontenida (`lanzamiento-page-pilot.html`) que genera un documento de
lanzamiento a partir de datos de entrada (nombre del lanzamiento + secciones): hero,
secciones de contenido con íconos, etc. Es el piloto de una plantilla estándar para
comunicar lanzamientos dentro del Launch System de Product Growth Marketing.

## 1 · Qué resuelve
Hoy cada lanzamiento arma su propia página/documento de comunicación sin un formato
único. Este piloto busca estandarizar esa pieza para que sea reutilizable entre
lanzamientos y se pueda iterar en un solo lugar.

## 2 · Alcance actual
**Construido:**
- Render de hero con nombre del lanzamiento.
- Render de secciones de contenido con título e ícono.
- Sistema de íconos inline (SVG paths) embebido en el archivo.

**Pendiente / por definir:**
- Fuente de datos: hoy el contenido vive hardcodeado en el propio HTML — falta definir
  si se alimenta desde un JSON externo, un form, o Notion/Drive.
- Integración con `05_Templates/` (relación con `Strategy_Package.md`,
  `Marketing_Brief.md`) — por decidir si este pilot los reemplaza, los complementa o
  los alimenta.
- Publicación: dónde vive la versión final por lanzamiento (¿HUB, Drive, link público?).

## 3 · Archivos
- [`lanzamiento-page-pilot.html`](lanzamiento-page-pilot.html) — el pilot completo (HTML+CSS+JS en un solo archivo).

## 4 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Célula | Growth Marketing |
| Proyecto ancla del lab | GMR-001 (Product Growth Marketing Agent OS) |
| Relacionado | `02_Launch_System/Launch_Workflow.md`, `05_Templates/` |

## 5 · Preguntas abiertas
- [ ] ¿De dónde saca los datos el pilot en su versión final (JSON/form/Notion)? — responsable: Catherin
- [ ] ¿Reemplaza o complementa las plantillas de `05_Templates/`? — responsable: Catherin

## 6 · Changelog
- 2026-08-25 — Proyecto creado en Darwin como GRO-003. Se mueve el HTML desde
  `Workshops lanzamientos Dropi - Product Growth Marketing/` a
  `growth-marketing-lab/proyectos/page-pilot-lanzamiento/`.
