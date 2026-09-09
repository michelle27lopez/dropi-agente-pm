-- Tablero transversal de Following (todas las células), pedido por Laura
-- 2026-09-07: "/celula/product-designers/following debe ser un tablero donde
-- podamos ver el following de todas las células, cada uno con CES, estándares
-- de éxito/fracaso, CSAT de experiencias CORE y NPS general de Dropi."
--
-- CES/estándares son por proyecto (cada célula documenta el suyo). NPS y CSAT
-- transversales NO tienen fila aquí — no existe hoy un catálogo único ni una
-- fórmula para llevarlos a %  (ver investigación de Laura, "Laboratorio CES"),
-- así que la página los muestra aparte, con lo real que sí existe (NPS de
-- plataforma por país, UserPilot) y un banner de vacío para CSAT CORE.

create table if not exists following_project_metrics (
  project_id uuid primary key references projects(id) on delete cascade,
  ces_score numeric,
  ces_meta text,
  estandar_exito text,
  estandar_fracaso text,
  notas text,
  updated_at timestamptz not null default now()
);

-- Una fila en blanco por cada proyecto ya en Following, para que la página
-- tenga algo que editar desde el día uno. Nada se inventa: todos los campos
-- quedan NULL hasta que la célula dueña los llene.
insert into following_project_metrics (project_id)
select id from projects where type = 'Following'
on conflict (project_id) do nothing;
