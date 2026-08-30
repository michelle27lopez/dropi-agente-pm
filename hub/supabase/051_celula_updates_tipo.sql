-- ═══════════════════════════════════════════════════════════════════════════
-- Separa los updates de célula en dos espacios: Weekly (sync con TI/Delivery,
-- PL-PO-PM) y Cell Board (avance hacia las metas de la célula). Pedido de
-- Kate para Brands (2026-08-20): el weekly y el cell board responden
-- preguntas distintas y se venían mezclando en una sola lista sin distinción.
--
-- De paso corrige el constraint `UNIQUE (week_date)` (010_celula_updates.sql:12)
-- que era global a toda la tabla, no por célula — quedó documentado como
-- deuda pendiente en 031_darwin_celula_logistica.sql:119-129 ("el arreglo de
-- fondo sería mover la restricción a UNIQUE (celula_id, week_date)"). Ahora
-- que se agrega `tipo`, dos updates de la misma célula en la misma fecha
-- (uno weekly, uno cell board) necesitan poder coexistir, así que el
-- arreglo ya no es opcional.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celula_updates
  add column if not exists tipo text not null default 'cell_board'
  check (tipo in ('weekly', 'cell_board'));

alter table celula_updates
  drop constraint if exists celula_updates_week_date_key;

alter table celula_updates
  add constraint celula_updates_celula_id_week_date_tipo_key unique (celula_id, week_date, tipo);

-- Backfill de los dos updates de Brands existentes al momento de esta
-- migración: el de 17-jul es transcripción del Cell Board (lo dice el propio
-- texto), el de 19-ago es la sync semanal con TI/Delivery (Seller PL-PO-PM).
update celula_updates set tipo = 'cell_board' where id = '5941d0b9-7dba-4a69-86a5-c052e27d6235';
update celula_updates set tipo = 'weekly'     where id = 'fe29c2dd-36e2-4d11-9077-747cf87ebef2';
