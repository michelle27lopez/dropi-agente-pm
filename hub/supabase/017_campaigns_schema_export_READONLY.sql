-- ═══════════════════════════════════════════════════════════════════════════
-- SOLO LECTURA — para que Jaime lo corra en SU Supabase (SQL Editor)
-- No modifica nada. El objetivo es exportar la definición real de las tablas
-- que su wizard usa (`projects`, `campaigns`, `campaign_nodes`), que nunca
-- quedaron versionadas como CREATE TABLE en el repo — él las creó a mano
-- desde el dashboard de Supabase.
--
-- Pedirle que corra esto y comparta el resultado completo (las 3 consultas).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Columnas exactas de cada tabla (tipo de dato, si acepta nulos, default)
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('projects', 'campaigns', 'campaign_nodes')
ORDER BY
  CASE table_name
    WHEN 'projects' THEN 1
    WHEN 'campaigns' THEN 2
    WHEN 'campaign_nodes' THEN 3
  END,
  ordinal_position;

-- 2. La fila real del proyecto DCA-001 (para saber qué datos tiene hoy)
SELECT * FROM projects WHERE id = 'd64b428a-3c99-412f-8100-53e07bd20ed8';

-- 3. Políticas RLS activas en esas tablas, por si hay reglas que replicar
SELECT tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('projects', 'campaigns', 'campaign_nodes');
