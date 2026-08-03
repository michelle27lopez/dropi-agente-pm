# Setup para nuevo PM

Este archivo es para quien clona el repo por primera vez.

## Requisitos previos

- [Claude Code](https://claude.ai/code) instalado y con sesión activa
- Python 3.11+ (solo si usas scripts de análisis)

## Primer arranque

Abre Claude Code apuntando a la carpeta `agente-delivery/` y pega el siguiente prompt:

---

```
Acabo de clonar este repositorio como nuevo PM. Necesito que hagas el setup inicial completo. Sigue estos pasos en orden:

**PASO 1 — Limpieza del PM anterior**

Elimina los archivos personales del PM anterior (no toques .agents/, canon/, schema/, README.md, .env.example, .gitignore, requirements.txt):

- Todo el contenido de la carpeta Documentos/ (deja la carpeta vacía)
- Todo el contenido de logs/ (deja el archivo bootstrap_report.md vacío o con solo un header)
- Todo el contenido de research-brain/ (deja la carpeta vacía)
- Todo el contenido de scratch/ (deja la carpeta vacía)
- El archivo .env (tiene credenciales del PM anterior)

**PASO 2 — Configurar modo local (sin Supabase)**

No tengo acceso a Supabase. Crea la siguiente estructura de carpetas para trabajar en modo archivo local:

- context/projects/   → un archivo .md por proyecto
- context/approved/   → contexto aprobado oficial (reemplaza la tabla approved_context)
- context/drafts/     → borradores en progreso (reemplaza la tabla draft_insights)

Crea un .env con LOCAL_MODE=true.

Crea context/README.md explicando brevemente qué va en cada carpeta.

**PASO 3 — Personalización**

Antes de continuar, pregúntame:
1. Mi nombre y rol
2. Nombre de mi empresa o área
3. El equipo o frente que gestiono

Con esas respuestas, actualiza canon/operating_rules.md para reemplazar cualquier referencia genérica y añadir mi contexto al inicio del archivo.

**PASO 4 — Confirmación**

Al final muéstrame:
- La lista de archivos eliminados
- La estructura de carpetas final
- Cómo puedo empezar a usar el agente (primer comando recomendado)
```

---

## Estructura del agente (qué hace cada parte)

```
.agents/
  agents.md              → roles disponibles (Analyst, Delivery Controller, etc.)
  conversation_rules.md  → cuándo usar modo borrador vs. modo oficial
  skills/                → comandos especializados (/asis-tobe-analyst, /kickoff-creator, etc.)

canon/
  operating_rules.md     → reglas del sistema (qué es borrador, qué es oficial)
  dropi_methodology.md   → metodología de épicas e HUs
  e2e_methodology.md     → formato E2E de proyectos
  impact_matrix_template.md → plantilla de impacto cruzado

schema/
  supabase_schema.sql    → DDL completo (útil si después quieres conectar Supabase)

context/                 → se crea en el setup (tu datos van aquí)
  projects/              → un .md por proyecto
  approved/              → contexto oficial aprobado
  drafts/                → borradores en progreso
```

## Copilotos de IA (Agentes Claude)

En la carpeta `.claude/agents/` del monorepo viven las definiciones de los agentes Claude especializados que actúan como "cerebros" del equipo. Puedes invocarlos directamente en el entorno de desarrollo:

1. **Agente de Discovery (`discovery.md`):**
   - **Propósito:** El estratega conductual y de producto. Diseña hipótesis conductuales, evalúa flujos visuales y redacta el *Intervention Brief* (el sustento conductual obligatorio para las épicas).
   - **Manual de uso:** Toda la teoría de Fogg ($B=MAP$), Procesamiento Dual y el ciclo de decisión está documentada en [manual_uso_agente_discovery.md](file:///Users/santiago.herrera/.gemini/antigravity-ide/brain/e04d1a50-a314-4625-b7d1-6369cc84f23f/manual_uso_agente_discovery.md).
   - **Triggers de activación:** Escribe `B=MAP`, `Intervention Brief`, `sesgo`, o `comportamiento` para activarlo.

2. **Agente Dropi Brain (`dropi-brain.md`):**
   - **Propósito:** Validador del canon estructural. Mantiene unificado el formato de los documentos y el indexado del Research Brain (`research-brain/`).
   - **Triggers de activación:** Escribe `dropi-brain` o pregunta `¿esto sigue el formato oficial?` para activarlo.

## Comandos principales

| Skill | Qué hace |
|---|---|
| `/asis-tobe-analyst` | Analiza una transcripción y genera borradores AS-IS / TO-BE |
| `/canon-keeper` | Promueve un borrador aprobado a contexto oficial |
| `/delivery-controller` | Revisa avance real vs. OKRs e hitos |
| `/kickoff-creator` | Genera documento de kickoff para una épica |
| `/epic-creator` | Redacta épicas en formato oficial |
| `/historia-creator` | Genera historias de usuario con criterios Gherkin |

## Si después quieres conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Abre el SQL Editor y ejecuta `schema/supabase_schema.sql`
3. Copia tu `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` al archivo `.env`
4. Cambia `LOCAL_MODE=false` en `.env`
