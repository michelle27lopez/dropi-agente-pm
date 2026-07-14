---
name: sync-from-drive
description: Synchronize documents from the shared Google Drive folder into the local PM OS, classify them by type, and show what's available for publishing.
---

# /sync-from-drive

## Trigger
The user says: "sincroniza drive", "sync from drive", "/sync-from-drive", "trae los documentos de drive", "actualiza los docs".

## Steps

1. **Run the sync script:**
   ```bash
   python3 scripts/drive_sync.py
   ```

2. **Show the user a summary** of what was synced:
   - Number of new documents
   - Number of updated documents
   - For each document: name, detected type, and suggested next action

3. **Suggest next actions** based on document types found:

   | Document type detected | Suggested action |
   |---|---|
   | `kickoff` | "¿Quieres que cree la épica a partir de este kickoff?" |
   | `research` | "¿Quieres que lo registre como Research Brain (RB-XXX)?" |
   | `planning` | "¿Quieres que genere las historias de usuario?" |
   | `moscow` | "¿Quieres que priorice las features basado en este MoSCoW?" |
   | `epic` | "¿Quieres publicarla en JIRA?" |
   | `pitch` | "¿Quieres publicarlo en Confluence?" |
   | `launch_brief` | "¿Quieres publicarlo en Confluence para el equipo de comunicaciones?" |

4. **Wait for the user** to choose which action take.

## Output
A summary table showing all synced documents with their type and suggested action.
