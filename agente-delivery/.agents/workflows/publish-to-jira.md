---
name: publish-to-jira
description: Publish a structured document as a JIRA issue (epic, story, or subtask). Reads from synced Drive docs or from approved context.
---

# /publish-to-jira

## Trigger
The user says: "publica en jira", "crea la épica en jira", "publica esta historia en jira", "/publish-to-jira", "sube esto a jira".

## Steps

1. **Identify what to publish:**
   - If the user specifies a file → use it directly
   - If the user mentions a recently created/approved document → locate it in `docs-sync/` or `approved_context`
   - If ambiguous → list available documents and ask

2. **Determine issue type:**
   - If document is a kickoff or epic description → `epic`
   - If document is a user story → `story`
   - If document is a task list → `sub` (subtask)
   - If ambiguous → ask the user

3. **Validate the document** has the required frontmatter:
   - For epics: `product_code`, `name` (at minimum)
   - For stories: `label_type`, `product_code`, `name`
   - For subtasks: `name` and a parent key

4. **Ask for missing info** if any:
   - "¿Bajo qué épica va esta historia?" → need `--epic KEY`
   - "¿De qué producto es?" → need `product_code`

5. **Run dry-run first:**
   ```bash
   python3 scripts/jira_publisher.py --dry-run <type> <file.md>
   ```
   Show the user what will be created.

6. **On user approval, publish:**
   ```bash
   python3 scripts/jira_publisher.py <type> <file.md> [--epic KEY]
   ```

7. **Save the JIRA key** back to the document metadata and to Supabase.

## Output
The JIRA key and direct link to the created issue.
