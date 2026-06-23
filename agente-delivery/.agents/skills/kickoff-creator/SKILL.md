---
name: kickoff-creator
description: Use this skill when the user asks to create a kickoff document for a Dropi epic or project. Triggered by "crea un documento de kickoff para", "prepara el kickoff de".
---

# Kickoff Creator

## Objetivo

Generar el documento de kickoff de una épica o proyecto en Dropi, siguiendo el formato oficial de la compañía.

## Cuándo usarlo

- "crea un documento de kickoff para [épica / proyecto]"
- "prepara el kickoff de [iniciativa]"
- Cuando el usuario necesita estructurar la sesión de arranque de una iniciativa

## Instrucciones

1. Verifica en la tabla `projects` si el proyecto tiene `requires_e2e_format = true`.
2. Si `requires_e2e_format` es true, lee `canon/e2e_methodology.md` y genera el documento de Kick-off siguiendo estrictamente esa plantilla.
3. Si `requires_e2e_format` es false, lee `canon/dropi_methodology.md` y sigue el formato tradicional que se describe a continuación.
4. Si falta contexto, pregunta al usuario por:
   - Título del proyecto (el mismo del pitch aprobado, si existe)
   - Problema central y contexto
   - Equipo involucrado y roles
   - Tiempo y recursos asignados (apetencia)
5. Genera el documento con las siguientes secciones EN ESTE ORDEN (para formato tradicional):

---

### 1. Título del Proyecto
El mismo título del pitch aprobado.

---

### 2. Introducción

**Contexto**
Breve resumen del problema que se está abordando y por qué es importante.

**Objetivos del Proyecto**
Resultados específicos que se esperan lograr.

**Apetencia**
Tiempo y recursos asignados al proyecto.

---

### 3. Problema

**Descripción Detallada**
Ampliación del problema con datos relevantes, ejemplos y contexto adicional.

**Impacto**
Impacto del problema en los usuarios, en el negocio, o en ambos.

**Soluciones Actuales**
Cómo se aborda el problema hoy y las limitaciones de esas soluciones.

---

### 4. Riesgos

Evaluar y documentar cada tipo de riesgo de producto:

| Riesgo | Pregunta clave | Nivel (Alto/Medio/Bajo) | Mitigación |
|---|---|---|---|
| **Riesgo de valor** | ¿El cliente encontrará valor en esta solución? | | |
| **Riesgo de usabilidad** | ¿Los usuarios podrán usarla efectivamente? | | |
| **Riesgo de factibilidad** | ¿Podemos construirla con los recursos y tecnologías disponibles? | | |
| **Riesgo de viabilidad empresarial** | ¿Esta solución funcionará para nuestro negocio? | | |
| **Riesgo Legal** | ¿Cumplimos con todos los requerimientos de ley? | | |

---

### 5. Preguntas Abiertas

**Preguntas Clave**
Preguntas importantes que deben responderse durante la fase de shaping.

**Hipótesis**
Hipótesis sobre posibles soluciones o enfoques que el equipo puede explorar.

---

### 6. Escenarios

**Posibles casos**
Diferentes escenarios que pueden ocurrir durante el desarrollo del proyecto.

---

### 7. Primeras Ideas

**Descripción**
Ideas iniciales que existen alrededor de este proyecto.

---

### 8. Equipo del Proyecto

| Rol | Nombre | Responsabilidades | Contacto |
|---|---|---|---|
| | | | |

---

### 9. Próximos Pasos

**Plan de Trabajo Inicial**
Primeros pasos concretos que el equipo debe tomar.

**Reuniones de Seguimiento**
Calendario de reuniones regulares para revisar progreso y discutir desafíos.

---

### 10. Apéndices (Opcional)

- **Datos de Investigación:** datos de mercado o feedback de usuarios que respalden la solución.
- **Wireframes o Bocetos Iniciales:** si existen, incluirlos para dar al equipo una idea inicial.

---

## Restricciones

- El título debe ser exactamente el mismo que el del pitch aprobado.
- No inventar nombres de personas, fechas o niveles de riesgo sin base en el contexto dado; usar `[por definir]`.
- La tabla de riesgos es obligatoria; si no hay información suficiente, dejar el nivel y mitigación como `[por evaluar]`.
- Tono ejecutivo y directo, orientado a acción.

## Salida esperada

Documento de kickoff completo en el formato oficial de Dropi, listo para compartir con el equipo en Notion, Confluence o Google Docs.
