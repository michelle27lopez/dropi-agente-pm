-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-001: registrar prototipo Fase 5 (dropitesters.co)
--
-- La tabla de proyectos de la Célula Backoffice (`/celula/backoffice/proyectos`)
-- muestra el badge "🔗 Prototipo" leyendo `projects.prototype_url` — con ese
-- campo vacío la columna se ve en blanco aunque la ficha del proyecto ya
-- enlace al prototipo desde su propia página estática.
-- ═══════════════════════════════════════════════════════════════════════════

update projects
set prototype_url = 'https://www.dropitesters.co/new/fase5-demo/controlador?profile=dropshipper'
where project_code = 'BAC-001';
