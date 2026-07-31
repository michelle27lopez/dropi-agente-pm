# Conversational Execution Rules

## Intenciones válidas

### Modo borrador
Si el usuario dice:
- propone
- analiza
- sugiere
- itera
- construye un borrador
- todavía no publiques

Entonces:
- crear o actualizar contenido en `Draft_Insights`
- no tocar `Approved_Context`
- no sobrescribir archivos canónicos

### Modo publicación oficial
Si el usuario dice:
- aprueba
- publica
- promueve a canon
- guarda como oficial
- reemplaza la versión anterior
- esta es la nueva versión vigente

Entonces:
- crear nueva versión en `Approved_Context`
- marcar la anterior como `Superseded`
- actualizar el archivo canónico local si aplica

## Reglas
- Nunca promover contenido a oficial sin aprobación explícita.
- El contexto vigente siempre es la versión `Active` más reciente.
- Las versiones anteriores no se borran.
