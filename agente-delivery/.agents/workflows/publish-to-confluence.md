---
name: publish-to-confluence
description: Publish a structured document (kickoff, pitch, brief, research) to Confluence. Reads from synced Drive docs or approved context.
---

# /publish-to-confluence

## Trigger
The user says: "publica en confluence", "sube esto a confluence", "publica el kickoff en confluence", "/publish-to-confluence".

## Steps

1. **Identify what to publish:**
   - If the user specifies a file → use it directly
   - If the user mentions a document type → find the most recent one in `docs-sync/`
   - If ambiguous → list available documents and ask

2. **Determine if it's a new page or update:**
   - Check `docs-sync/_confluence_index.json` for existing publications
   - If already published → ask: "Ya existe esta página en Confluence. ¿Quieres actualizarla?"

3. **Ask for parent page** (optional):
   - "¿Bajo qué página padre quieres publicarlo?" → need `--parent PAGE_ID`
   - If not specified → publish at root of the space

4. **Run dry-run first:**
   ```bash
   python3 scripts/confluence_publisher.py --dry-run <file.md>
   ```
   Show the user a preview of the page title and body length.

5. **On user approval, publish:**
   ```bash
   python3 scripts/confluence_publisher.py <file.md> [--parent PAGE_ID]
   ```

6. **Report the result** with the Confluence page URL.

## Supported document types

| Type | Template applied |
|---|---|
| `kickoff` | Confluence page with full kickoff structure |
| `pitch` | Confluence page with pitch sections |
| `research` | Confluence page with Research Brain format |
| `launch_brief` | Confluence page with brief for communications team |
| `epic` | Confluence page with epic description |
| `user_flow` | Confluence page with flow + Mermaid diagram |

## Output
The Confluence page URL.
