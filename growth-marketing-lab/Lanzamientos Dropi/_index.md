# 📁 Índice de proyectos — Growth Marketing

> Cada proyecto de la célula = una carpeta `Lanzamientos Dropi/<slug>/` con un `spec.md`
> (fuente de verdad interna, estado + fuente en cada afirmación). Proyecto ancla del lab
> completo: **GMR-001** (Product Growth Marketing Agent OS, ver `growth-marketing-lab/CLAUDE.md`).

## Proyectos reales de la célula en el HUB (Supabase, verificado 2026-09-02)
| Código | Proyecto | Resumen |
|--------|----------|---------|
| GMR-001 | Dropi - Product Growth Marketing Agent OS | Sistema operativo (framework + agentes de IA) del área. |
| GMR-002 | Reporte Sprints | — |
| GRO-003 | Mesa estratégica Lanzamientos - Product Growth Marketing | Dashboard con los aprendizajes de las mesas estratégicas para todos los lanzamientos. |
| GRO-008 | Taller TARS | Documentación del taller TARS al equipo de producto — capacitación en la metodología (carpeta `growth-marketing-lab/Taller TARS/`, fuera de esta convención de `Lanzamientos Dropi/`). |

## Artefactos documentados por proyecto
### GRO-003 — Mesa estratégica Lanzamientos
| Artefacto | Qué es | Spec |
|-----------|--------|------|
| Page Pilot — Documento de Lanzamiento | Piloto de plantilla HTML para el documento de lanzamiento (output del Workshop 3, 24-jul-2026) | [spec](page-pilot-lanzamiento/spec.md) |
| Rearquitectura — Centro de Comando de Lanzamiento | Strategy Package / Launch Command Center del lanzamiento Tier 3 de la Rearquitectura de Dropi (12-sep-2026) | [spec](rearquitectura-lanzamiento/spec.md) |

## Cómo se documenta un artefacto
1. Carpeta `Lanzamientos Dropi/<slug>/` con `spec.md` como fuente de verdad interna.
2. Archivos pesados (HTML, assets, exports) viven junto al `spec.md` en la misma carpeta.
3. Si el artefacto pertenece a un proyecto GRO/GMR ya existente en el HUB, se documenta
   como artefacto de ese proyecto (no se inventa un código nuevo). Antes de asignar un
   código nuevo, verificar en el HUB (`/celula/growth-marketing`) cuál es el siguiente libre.
