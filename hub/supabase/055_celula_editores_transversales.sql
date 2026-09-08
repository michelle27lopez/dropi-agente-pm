-- Editores transversales de célula (2026-09-07, a pedido de Laura).
--
-- El modelo de permisos de Darwin hoy es 1 perfil → 1 `celula_id` (ver
-- `017_darwin_profiles.sql`, `require-celula-member.ts`). Eso no alcanza
-- para un proyecto transversal: Diana Aldana sigue siendo dueña de
-- Experience (su `celula_id` primario NO cambia), pero también necesita
-- poder de edición sobre proyectos de Product team (célula slug
-- `product-designers`) — PRO-001/002/003 son transversales y se manejan
-- entre las dos.
--
-- En vez de mover su `celula_id` (le quitaría acceso a Experience) o
-- volverla `is_super_admin` (le daría acceso a TODAS las células, mucho
-- más de lo pedido), esta tabla agrega permisos de edición ADICIONALES,
-- explícitos por célula, sin tocar la pertenencia primaria de nadie.
--
-- Nota manual: correr en Supabase Dashboard → SQL Editor (sin acceso a
-- psql/DDL directo desde el agente, mismo patrón que 044/051/054).

CREATE TABLE IF NOT EXISTS celula_editores (
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  celula_id   UUID        NOT NULL REFERENCES celulas(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_id, celula_id)
);

-- Diana Aldana (Experience Design Lead, celula_id primario = Experience)
-- como editora transversal de Product team.
INSERT INTO celula_editores (profile_id, celula_id)
SELECT p.id, c.id
FROM profiles p, celulas c
WHERE p.email = 'diana.aldana@dropi.co' AND c.slug = 'product-designers'
ON CONFLICT (profile_id, celula_id) DO NOTHING;
