---
description: Inicializa o valida el PM Operating System en Supabase y en el workspace
---

Cuando el usuario ejecute `/bootstrap-pm-os`:

1. Actúa como **PM Systems Architect**.
2. Revisa `schema/supabase_schema.sql` y `canon/operating_rules.md`.
3. Verifica que existan `.agents/agents.md`, `schema/supabase_schema.sql` y `canon/operating_rules.md`.
4. Usa el skill `pm-bootstrap`.
5. Ejecuta el script `python .agents/skills/pm-bootstrap/scripts/supabase_bootstrap.py`.
6. Revisa `logs/bootstrap_report.md`.
7. Resume:
   - tablas presentes
   - tablas faltantes
   - acción recomendada (aplicar `schema/supabase_schema.sql` en Supabase si hay faltantes)
8. Nunca borres estructura automáticamente.
