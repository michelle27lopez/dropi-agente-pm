---
name: pm-bootstrap
description: Use this skill when the user wants to validate the Supabase schema, generate the PM Operating System workspace files, or bootstrap the project structure for a new project.
---

# PM Bootstrap

## Objetivo

Validar y reportar el estado del schema en Supabase, y verificar que el workspace esté completo.

## Cuándo usarlo

- cuando el usuario quiera inicializar la base operativa por primera vez
- cuando falten tablas en Supabase
- cuando falten archivos críticos en `.agents`, `schema` o `canon`
- cuando se quiera validar que el workspace sigue alineado con el esquema oficial

## Instrucciones

1. Revisa `schema/supabase_schema.sql`.
2. Revisa `canon/operating_rules.md`.
3. Verifica que la estructura del workspace exista.
4. Ejecuta el script Python del skill para verificar tablas.
5. Revisa el reporte generado en `logs/bootstrap_report.md`.
6. Resume diferencias entre schema esperado y estado actual.
7. Si hay tablas faltantes, indica al usuario que aplique `schema/supabase_schema.sql` en el SQL Editor de Supabase.

## Restricciones

- nunca eliminar tablas o datos
- nunca reescribir `approved_context` por bootstrap
- si falta `SUPABASE_URL` o `SUPABASE_SERVICE_KEY`, detenerse y reportar el problema

## Salida esperada

- tablas presentes
- tablas faltantes
- advertencias
- siguiente acción recomendada
