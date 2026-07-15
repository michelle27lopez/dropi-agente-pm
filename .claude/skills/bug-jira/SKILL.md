---
name: bug-jira
description: Sube a Jira una o varias HU de bug ya redactadas en el formato de Dropi (título "[Etiqueta] Sigla: Nombre", Historia, Descripción del proceso, flujo actual/esperado, Criterios de aceptación en Gherkin, Condiciones adicionales, Definición de Hecho). Úsala cuando Michelle pida "sube esta HU de bug a jira", "crea este bug en jira", "publica este bug en jira", "sube estos bugs a jira" y ya tenga el texto completo de la HU.
---

# Subir HU de bug a Jira

Publica directo en Jira vía el MCP de Atlassian ya autenticado — sin scripts, sin tokens, sin `.env`. Objetivo: que subir una HU de bug sea un paso, no una sesión de formateo manual.

## Config fija (confirmada con Michelle el 2026-07-15, no volver a preguntar)

- Cloud: `dropi-it.atlassian.net`
- Proyecto Jira: `PROD`
- Tipo de issue: **Error** (el tipo "Bug" nativo de Jira) — aunque el texto venga en formato de HU completo, no usar "Historia".
- Herramienta: `mcp__claude_ai_Atlassian_Rovo__createJiraIssue` directo, con `contentFormat: "markdown"`. No usar `agente-delivery/scripts/jira_publisher.py` (ese requiere `JIRA_BASE_URL`/`JIRA_EMAIL`/`JIRA_API_TOKEN` en `.env`) ni pedirle credenciales a Michelle.
- Cada bug creado se registra además en la tabla `jira_bug_tracking` del Supabase de Jaime (`fwwkesboxlbmimzyoztq`) — ver Paso 5. Es el único proyecto Supabase válido para el hub, nunca uno personal/aislado.

## Paso 1 — Parsear cada HU

El usuario puede pegar una o varias HUs seguidas en el mismo mensaje. Cada bloque nuevo empieza con una línea título tipo `[Etiqueta] Sigla: Nombre` (ej. `[Backend] TTV: Auto-login post-registro — proveedor rebota antes de llegar al CRM`).

Por cada bloque:
- **summary** = la línea título completa, tal cual.
- **description** = el resto del bloque (Historia, Descripción del proceso, Flujo actual/esperado, Criterios de aceptación, Condiciones adicionales, Definición de Hecho) tal cual, en Markdown — pasar directo como string con `contentFormat: "markdown"`. No convertir a ADF a mano, no resumir, no reescribir.
- **labels** (`additional_fields.labels`) = la Etiqueta entre corchetes (ej. `Backend`) + la Sigla del producto (ej. `TTV`, `CAZ`).

## Paso 2 — Confirmar a quién se asigna

Nunca crear el issue sin asignado, y nunca asumir la misma persona de la última vez sin preguntar.

1. Si Michelle ya dijo el nombre en el mensaje, buscarlo con `lookupJiraAccountId` (`cloudId` + `searchString: "<nombre>"`).
2. Si hay varios resultados parecidos (ej. "Jose Giraldo" vs "Jose Pineda Pitre" vs "Maria Jose Calderon"), mostrar las opciones con `displayName` y pedir que confirme cuál es antes de seguir.
3. Si no dijo ningún nombre, preguntar explícitamente a quién se asigna — no dejarlo sin asignar ni adivinar.
4. Usar el `accountId` confirmado en el campo `assignee_account_id` de `createJiraIssue`.

## Paso 3 — Decidir si va vinculada a una épica (regla confirmada 2026-07-15)

Regla de Michelle: **si el bug fue detectado mientras la feature ya está en producción/live → vincular como parent a la épica del producto. Si no (fase previa a producción, o no está confirmado que sea producción) → crearla suelta, sin parent.**

Para decidir, en este orden:
1. Evidencia dentro del propio texto de la HU: datos de cohortes/métricas reales de producción ("111 de 243 proveedores... cohorte 30-jun al 14-jul") pesan a favor de "sí, en producción". Lenguaje condicional o que pide confirmación ("puede ser comportamiento intencional en beta", "se requiere confirmación de TI antes de clasificar como bug en producción") pesa a favor de "no vincular".
2. Si no es obvio, buscar la épica del producto: `searchJiraIssuesUsingJql` con `project = PROD AND issuetype = Epic AND summary ~ "<sigla o nombre del producto>"` y revisar si hay señal de que ya está live.
3. Si sigue sin ser claro, preguntar a Michelle explícitamente — no asumir ni forzar el vínculo.

Épicas ya localizadas (reusar, no rebuscar):
- TTV → `PROD-1305` — "[DROPI] TTV - POSTULACIONES Suppliers Verificados, Premium, Exclusivos"
- CAZ / Caza Productos → `PROD-1290` — "[PRODUCTO] Caza productos"

## Paso 4 — Confirmar antes de crear

Mostrar a Michelle, por cada HU: summary, tipo (Error), proyecto (PROD), asignado, parent (épica o "sin vincular") y labels. Esperar su ok antes de llamar `createJiraIssue` — crea algo visible para todo el equipo en Jira, no es reversible con un clic.

## Paso 5 — Crear y reportar

Llamar `createJiraIssue` con:
```
cloudId: "dropi-it.atlassian.net"
projectKey: "PROD"
issueTypeName: "Error"
summary: <título>
description: <markdown del cuerpo>
contentFormat: "markdown"
additional_fields: { "labels": [<etiqueta>, <sigla>] }
assignee_account_id: <accountId confirmado en Paso 2>
parent: <epic key>   # solo si aplica según Paso 3
```
Reportar la key y el link (`https://dropi-it.atlassian.net/browse/<KEY>`) de cada issue creado.

## Paso 6 — Registrar en Supabase para seguimiento de Soporte/TI

Por cada issue creado, insertar una fila en la tabla `jira_bug_tracking` del Supabase de Jaime (`fwwkesboxlbmimzyoztq`, `hub/.env.local` → `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`). Si la tabla no existe todavía, correr primero `hub/supabase/022_jira_bug_tracking.sql` en el SQL Editor de Supabase (pedirle a Michelle que lo corra ella — no hay acceso directo a DDL, solo REST vía service key).

Insertar vía REST (`POST {SUPABASE_URL}/rest/v1/jira_bug_tracking` con headers `apikey`/`Authorization: Bearer {SUPABASE_SERVICE_KEY}`, `Prefer: return=minimal`) o con un script Python que cargue `hub/.env.local` en runtime igual que `hub/supabase/seed_*.py` (nunca hardcodear la key en el script ni pegarla en el chat/output). Campos:
```
jira_key: <key, ej. PROD-1584>
jira_url: https://dropi-it.atlassian.net/browse/<key>
summary: <título>
label_type: <etiqueta, ej. Backend>
product_code: <sigla, ej. TTV>
status: <nombre del estado en Jira al crear, ej. "En Ruta (backlog)">
assignee: <displayName de la persona confirmada en Paso 2>
parent_epic_key: <epic key o null>
reported_by: <nombre de quien pidió subir la HU>
```

## Restricciones

- No inventar ni forzar el vínculo a una épica sin evidencia clara de que la feature está en producción.
- No usar el script de Python ni pedir tokens/`.env` de Jira — todo vía MCP ya autenticado.
- No mezclar varias HUs en un solo issue de Jira, aunque vengan pegadas juntas en el mismo mensaje.
- No reescribir ni resumir el contenido de la HU — se sube tal cual la redactó Michelle (o quien la escribió).
- No crear un issue sin asignado confirmado.
- Nunca hardcodear la `SUPABASE_SERVICE_KEY` en un script ni imprimirla en la conversación — cargarla siempre desde `hub/.env.local` en tiempo de ejecución.
