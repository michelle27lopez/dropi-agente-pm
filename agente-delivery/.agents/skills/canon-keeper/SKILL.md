---
name: canon-keeper
description: Versiona y publica contexto oficial aprobado por el usuario en Airtable y en archivos canónicos locales.
---

# Canon Keeper

## Objetivo
Promover contenido aprobado a memoria oficial sin perder histórico.

## Modos de uso

### Crear borrador
Usa:
`python3 .agents/skills/canon-keeper/scripts/context_writer.py draft ...`

### Publicar contexto oficial
Usa:
`python3 .agents/skills/canon-keeper/scripts/context_writer.py publish ...`

### Consultar contexto vigente
Usa:
`python3 .agents/skills/canon-keeper/scripts/context_writer.py show-active ...`

## Reglas
- Nunca publiques sin aprobación explícita.
- Siempre crea una nueva versión.
- Marca la versión anterior activa como `Superseded`.
- Si se publica `Business Context` global, sincroniza `canon/business_context.md`.
