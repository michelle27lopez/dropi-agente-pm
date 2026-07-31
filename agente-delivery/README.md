# PM Operating System

Sistema operativo de gestión de proyectos para PMs que trabajan con IA conversacional (Claude Code / Claude Desktop). Integra Supabase como base de datos y Claude como agente de análisis, síntesis y seguimiento.

> **Punto de entrada de cada chat nuevo:** leer [`ESTADO.md`](ESTADO.md) primero (dónde vamos,
> próximo paso, bloqueos) y [`equipo/_index.md`](equipo/_index.md) para saber quién es quién.

## ¿Qué hace este sistema?

Te permite trabajar de forma estructurada con transcripciones de reuniones, borradores iterativos y contexto oficial aprobado, usando un agente de IA como copiloto de PM.

El flujo base es:

1. **Ingestas una transcripción** de reunión (discovery, planning, follow-up, etc.)
2. **El agente analiza** y genera borradores: AS-IS, TO-BE, capacidades, HUs, riesgos, decisiones
3. **Iteras conversacionalmente** hasta que el contenido es correcto
4. **Apruebas** explícitamente → el sistema promueve esa versión a memoria oficial en Supabase
5. **El seguimiento posterior** compara siempre contra lo aprobado, nunca contra borradores

---

## Arquitectura del sistema

```
.agents/
  agents.md               → roles de los agentes (Architect, Analyst, Canon Keeper, etc.)
  conversation_rules.md   → reglas de modo borrador vs. modo publicación oficial
  workflows/              → comandos de alto nivel (/bootstrap-pm-os, /ingest-transcript, etc.)
  skills/
    pm-bootstrap/         → verifica el schema en Supabase y reporta diferencias
    canon-keeper/         → promueve contenido aprobado a Supabase y canon/
    asis-tobe-analyst/    → analiza transcripciones y genera borradores
    delivery-controller/  → compara ejecución real contra OKRs, hitos y decisiones
    transcript-intake/    → clasifica e ingesta transcripciones crudas
schema/
  supabase_schema.sql     → DDL completo para crear las tablas en Supabase
canon/
  operating_rules.md      → reglas inmutables del sistema (qué es borrador, qué es oficial)
.env.example              → variables de entorno requeridas
requirements.txt          → dependencias Python
```

---

## Base de datos (Supabase)

El sistema usa las siguientes tablas en Supabase (PostgreSQL):

| Tabla | Propósito |
|---|---|
| `projects` | Proyectos gestionados |
| `teams` | Equipos responsables |
| `meetings` | Registro maestro de reuniones |
| `transcripts` | Evidencia cruda e inmutable |
| `draft_insights` | Capa temporal de trabajo iterativo |
| `approved_context` | Memoria oficial aprobada por el usuario |
| `okrs` | OKRs y métricas por proyecto |
| `capabilities` | Capacidades del mapa de impacto |
| `features` | Features derivadas de capacidades |
| `user_stories` | Historias de usuario |
| `decisions` | Decisiones oficiales del proyecto |
| `risks` | Riesgos identificados y seguimiento |
| `followups` | Compromisos y seguimiento operativo |
| `milestones` | Hitos de entrega |

---

## Requisitos

- Python 3.11+
- Proyecto en [Supabase](https://supabase.com) con las tablas creadas
- Claude Code o Claude Desktop con acceso al workspace

---

## Primer arranque

```bash
# 1. Clonar y preparar el entorno
git clone https://github.com/jaimeguevara-dropi/agente_pm.git
cd agente_pm
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tu SUPABASE_URL y SUPABASE_SERVICE_KEY

# 3. Aplicar el schema en Supabase
# Abre Supabase > SQL Editor > pega el contenido de schema/supabase_schema.sql > Run

# 4. Verificar que todo está bien
python .agents/skills/pm-bootstrap/scripts/supabase_bootstrap.py
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL de tu proyecto Supabase (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | Service role key de Supabase (Settings → API) |
| `BOOTSTRAP_REPORT_PATH` | Ruta del reporte de bootstrap (default: `logs/bootstrap_report.md`) |

---

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `/bootstrap-pm-os` | Verifica el schema en Supabase y reporta diferencias |
| `/ingest-transcript` | Ingesta y clasifica una transcripción cruda |
| `/promote-to-canon` | Promueve un borrador aprobado a memoria oficial |
| `/weekly-control-tower` | Genera corte semanal de estado del portafolio |
| `/project-followup` | Seguimiento de compromisos y riesgos de un proyecto |
| `/update-business-context` | Actualiza el contexto de negocio de un proyecto |

---

## Principios del sistema

- **Los borradores no son verdad.** Ningún agente usa `draft_insights` como fuente oficial.
- **La aprobación es explícita.** Solo el usuario puede promover contenido a `approved_context`.
- **Las transcripciones son inmutables.** Se registran tal cual, sin resúmenes encima.
- **No se borra estructura automáticamente.** El sistema agrega, nunca elimina sin instrucción humana.
