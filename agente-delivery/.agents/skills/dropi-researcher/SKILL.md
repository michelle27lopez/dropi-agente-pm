# Dropi Researcher Skill (Discovery & Research)

Este documento traduce la lógica de la actual gema "Dropi Researcher" al nuevo modelo de ciclo de vida del PM Operating System. El objetivo es pasar de un "prompt largo de 10 pasos" a un **flujo de trabajo (pipeline) gobernable**.

## Visión General de la Habilidad
En el PM OS, "Dropi Researcher" ya no es un chat al que hay que alimentarle contexto desde cero. Es la **Habilidad (Skill)** que asume el control cuando una oportunidad entra en la fase de **Discovery & Research**.

Al activarse, la habilidad hereda el contexto de la oportunidad (el problema que estamos intentando resolver) y comienza a guiar al PM a través de "Checkpoints". Cada checkpoint requiere la aprobación del PM para avanzar.

## El Pipeline de Research (Checkpoints)

### 1. Checkpoint: Preparación (Fases A y B originales)
*   **Contexto automático:** El sistema ya conoce la oportunidad. En lugar de preguntar todo desde cero, sugiere: *"Veo que estamos investigando el problema X. Sugiero enfocarnos en los roles de Dropshippers y Proveedores. ¿Estás de acuerdo?"*
*   **Acción del Sistema:** Genera un **Borrador de Plan de Investigación (Planning)** y un **Borrador de Guion de Entrevista**.
*   **Gate de Aprobación:** El PM revisa, ajusta y aprueba.
*   **Resultado:** El plan y los guiones se convierten en **Contexto Oficial** de la oportunidad.

### 2. Checkpoint: Recolección y Análisis (Fases C, D y E originales)
*   **Interacción:** El PM aporta las transcripciones de las entrevistas y evidencias de Social Listening.
*   **Acción del Sistema:** Procesa los datos crudos y extrae "Hallazgos por Categoría". 
*   **Regla de Gobierno:** El sistema *vincula* cada hallazgo directamente a una cita textual (evidencia). Nada se inventa.
*   **Gate de Aprobación:** El PM valida qué hallazgos son reales y accionables.

### 3. Checkpoint: Síntesis de Usuario (Fases F, G y H originales)
*   **Acción del Sistema:** Usando *únicamente* los hallazgos aprobados en el paso anterior, el sistema construye:
    *   Mapas de Empatía por rol validado.
    *   Journey Map de la experiencia actual.
*   **Gate de Aprobación:** El PM aprueba estos artefactos visuales/tabulares.

### 4. Checkpoint: Priorización y Salida (Fase I original)
*   **Acción del Sistema:** Con el Journey y los dolores claros, el sistema propone una lista de necesidades/funcionalidades a resolver y aplica la técnica **MoSCoW**.
*   **Gate de Aprobación:** El PM ajusta qué es *Must have* y qué es *Won't have*.
*   **Resultado Final (Transición):** Al aprobar este MoSCoW, se genera el "Research Outcome" oficial. La oportunidad está lista para avanzar a la fase de **Ideación/PRD**.

## Beneficios de este Mapeo
1. **No hay pérdida de memoria:** Si en la fase de PRD alguien pregunta "¿por qué esto es un *Must have*?", el sistema puede trazar la línea: *Must have -> Hallazgo 3 -> Cita de la Entrevista 2 -> Problema X*.
2. **Modularidad:** El PM puede pausar la investigación en el paso 2, irse una semana, volver, y el sistema sabe exactamente que está esperando transcripciones para generar los hallazgos.
3. **Reutilización de Herramientas:** Las plantillas (planning.pdf, entrevista.pdf, MoSCoW.pdf) dejan de ser archivos sueltos y se convierten en los **esquemas de datos (schemas)** que el sistema usa por debajo para estructurar la información automáticamente.
