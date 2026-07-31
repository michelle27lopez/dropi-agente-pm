# Metodología de Documentación de Proyectos E2E (Producto)

Esta guía establece el canon de documentación que Producto (PM/PO y Product Designers) debe completar obligatoriamente para cada iniciativa marcada con `requires_e2e_format = true` antes de pasarla formalmente a desarrollo (TI). 

El flujo consta de **5 entregables de Producto** consecutivos. Cada uno posee campos específicos y un checklist de calidad en el apéndice que el agente (`Delivery Controller`) validará de forma estricta.

---

## 1. Kick-off de Producto

**Propósito:** Punto de partida. Documenta el **QUÉ** y el **POR QUÉ** inicial del proyecto para alinear al equipo. No incluye estimaciones técnicas ni decisiones de arquitectura.

### Plantilla de Documento

#### 1.1 Información General & Equipo del Proyecto
| Campo | Contenido |
| --- | --- |
| **Nombre del proyecto** | [Título corto y memorable] |
| **Célula** | [Equipo asignado] |
| **Owner / PM** | [Responsable de producto] |
| **Product Designer** | [Responsable de diseño] |
| **Stakeholder principal** | [Persona a quien se le reporta el avance] |
| **Fecha de kick-off** | [DD/MM/AAAA] |
| **Estado** | Discovery / Definición / Hand-off / En desarrollo / Lanzado |

#### 1.2 Introducción y Contexto. POR QUÉ ahora
* **Contexto:** Breve resumen de la fricción o la oportunidad que nos trae aquí.
* **Cambio externo:** (Movimiento del mercado, competencia, regulación).
* **Cambio interno:** (Señales de datos, feedback recurrente, decisión estratégica).
* **Costo de no hacerlo:** (Qué perdemos o qué pasa si postergamos esto 6 meses).

#### 1.3 Definición del Problema, Impacto y Painpoints. QUÉ se va a construir
* **Descripción Detallada:** Ampliación del problema con datos y ejemplos.
* **Frecuencia del problema:** Diario / Semanal / Mensual / Otro.
* **Importancia del problema:** Alta / Media / Baja.
* **Segmento/Target:**
  * *Target description:* Segmento de usuario impactado (ej. marcas activas con más de N órdenes).
  * *País/mercado objetivo:* (ej. Colombia primero, México en fase 2).
  * *Target size:* Volumen de usuarios alcanzados en la fase 1.
* **Painpoints (Dolores específicos):**
  * **Dolor 1:** [Descripción del obstáculo actual]
  * **Dolor 2:** [Descripción del obstáculo actual]

#### 1.4 Objetivos. PARA QUÉ
* **Objetivo Principal de Negocio:** [Resultado de negocio esperado]
* **Objetivo de Experiencia de Usuario (UX):** [Mejora esperada en usabilidad/satisfacción]
* **Alineación Estratégica (Business Impact):**
  * *OKR (Objetivo Trimestral):* El objetivo macro de la compañía a impactar.
  * *KR (Key Result):* El resultado clave numérico que este proyecto moverá.
  * *Data:* Eventos, logs o KPIs específicos a trackear (ej. `conversion_rate`).

#### 1.5 Enlaces
* **Épica:** [Link a Jira/Linear]
* **Figma Kick-off:** [Link al canvas de bocetos iniciales]
* **Research inicial:**
  * *Hallazgo principal:* Lo más relevante aprendido de las marcas.
  * *Fuentes:* [Link a entrevistas, encuestas o Mixpanel]

#### 1.6 Dudas e incógnitas iniciales
* [Pregunta de negocio o de usuario por resolver]
* [Dependencia con otra área a confirmar]

> [!NOTE]
> **Lo que NO va en el Kick-off:** Esfuerzo técnico, tiempo estimado de desarrollo, dispositivos soportados, restricciones de performance, stack o dependencias de infraestructura.

---

## 2. Discovery & Levantamiento

**Propósito:** Profundiza en el **POR QUÉ**. Documenta la investigación de campo, el estado actual (AS-IS), las hipótesis y los riesgos iniciales del producto.

### Plantilla de Documento

#### 2.1 Usuarios Implicados & Estado de Madurez
* **Perfil Principal:** [Ej. Dueños de marcas con inventario propio] — *Madurez:* [Novato / En consolidación / Avanzado]
* **Perfil Secundario:** [Ej. Operadores logísticos] — *Madurez:* [En aprendizaje / Consolidado]

#### 2.2 El "AS-IS" (Soluciones Actuales y Limitaciones)
* **Soluciones Actuales:** ¿Cómo abordan los usuarios este problema hoy en día? (Procesos manuales, parches, herramientas externas).
* **Limitaciones:** Por qué la solución actual no es escalable o daña la experiencia del usuario.

#### 2.3 Discovery por Áreas, Bench e Investigación
* **Resultados de Research:** Hallazgo principal del research cuantitativo o cualitativo.
* **Fuentes y Datos:** Enlaces a entrevistas, encuestas, dashboards de Mixpanel o registros de soporte.
* **Benchmark:** Cómo competidores o plataformas análogas resuelven este dolor.

#### 2.4 Gestión de Riesgos de Producto
* **Riesgo de Valor:** ¿El cliente encontrará valor en esto y lo usará?
* **Riesgo de Usabilidad:** ¿Los usuarios podrán entender e interactuar efectivamente con el diseño?
* **Riesgo de Factibilidad:** ¿Es viable construir esto con la tecnología, infraestructura y APIs disponibles?
* **Riesgo de Viabilidad Empresarial:** ¿Se alinea con las reglas de negocio, costos y márgenes de Dropi?
* **Riesgo Legal:** ¿Cumple con regulaciones locales, términos de uso y tratamiento de datos?

#### 2.5 Hipótesis, Validaciones y Preguntas Abiertas
* **Preguntas Clave:** Incógnitas críticas que deben ser respondidas durante la definición.
* **Hipótesis:** Supuestos funcionales o de comportamiento que el equipo validará.

#### 2.6 Conclusiones del Discovery
* **Síntesis Ejecutiva:** Qué aprendimos, qué decisiones tomamos y qué queda fuera del alcance por ahora.

#### 2.7 Requerimientos Generales, Compatibilidad y Performance
* **Descripción de la Solución:** Definición clara de la funcionalidad.
* **Dispositivos:** Mobile-first / Desktop-only / Responsivo.
* **Restricciones y Performance:** Tiempos de carga esperados (ej. < 2s), límites de APIs, compatibilidad de navegadores.

---

## 3. Definición & Alcance

**Propósito:** Cierra el **PARA QUÉ**. Concreta la propuesta de solución y define las fases funcionales, delimitando lo que no entra en el alcance (no-objetivos).

### Plantilla de Documento

#### 3.1 Primeras Ideas y Propuestas
* **Primeras Ideas:** Lluvias de ideas o enfoques de diseño/arquitectura discutidos.
* **Escenarios:** Mapeo de casos que pueden suceder en el flujo de usuario o en el sistema.

#### 3.2 Fases del Proyecto y Alcance
* **Fase 1 (MVP):** Lo mínimo indispensable para salir a producción, validar valor y mitigar riesgos.
* **Fase 2 (Evolutivo):** Funcionalidades incrementales que no detienen el lanzamiento inicial.
* **Fase 3 (Optimización):** UX fina, automatizaciones avanzadas y escalabilidad.
* **Lo que NO entra (no-objetivos):**
  * *No-objetivo 1:* [Descripción de lo que queda fuera y la razón]
  * *No-objetivo 2:* [Descripción de lo que queda fuera y la razón]

#### 3.3 Estimación de Recursos y Esfuerzo (Perspectiva de Producto)
* **Tiempo Estimado de Desarrollo en Producto:** [Ej. 2 Sprints / 1 Mes]

#### 3.4 Segmento y País de Implementación
* *Target description:* Segmento exacto impactado.
* *País/mercado objetivo:* Países de lanzamiento inicial y posteriores.
* *Target size:* Volumen de usuarios proyectados para el lanzamiento.

#### 3.5 Supuestos
* **Supuesto 1:** (ej. El usuario tiene una cuenta bancaria activa).
* **Supuesto 2:** (ej. El integrador externo X seguirá dando soporte gratuito).

#### 3.6 Próximos Pasos & Entregables
* **Plan de Trabajo Inicial:** Siguientes pasos inmediatos.
* **Reuniones de Seguimiento:** Calendario de revisiones de avances y bloqueantes.
* **Entregables requeridos:** Figma Final (link) / TANGO (link) / Loom (link).

---

## 4. Following y Lanzamiento (Esquema de Medición y Marketing)

**Propósito:** Establece el plan para medir el éxito funcional e instruir al equipo de Marketing para el lanzamiento.

### Plantilla de Documento

#### 4.1 Contexto y Objetivo de Medición
* **Contexto del Problema:** Resumen breve de la fricción actual.
* **Objetivo de la Feature / Propuesta de Valor:** Jobs to be done para el usuario.
* **Impacto esperado (Experiencia):** Reducción de pasos, clics, carga cognitiva, etc.
* **Alcance:** Segmento y países.

#### 4.2 Métricas de Impacto (Negocio - Data Warehouse)
*Métricas basadas en el framework HEART (Happiness, Engagement, Adoption, Retention, Task Success).*
* **[Métrica de Negocio 1]**
  * *¿Por qué medirlo?:* Razón estratégica.
  * *Fórmula:* Lógica de cálculo matemático (ej. *ventas mes 2 / ventas mes 1*).
  * *Criterio de Éxito:* Meta esperada (ej. aumento del 15%).
  * *Segmentación técnica:* Filtros de BD (ej. `user_type = 'Supplier'`).

#### 4.3 Métricas de Comportamiento (UX - Userpilot / Analytics)
* **Target (Población Objetivo):** Descripción del segmento de comportamiento (ej. marcas con menos de 50 órdenes).
* **Adopción de nuevas funcionalidades (Engagement):**
  * *Acción clave:* Momento exacto donde el usuario experimenta el valor por primera vez (ej. cuando procesa su primera orden masiva).
  * *Fórmula de adopción:* `(Usuarios que disparan evento X) / (Total de usuarios en la pantalla Y)`.
  * *Criterio de éxito:* (ej. > 30% de adopción).
* **Retención:**
  * *Frecuencia natural:* Diaria / Semanal / Mensual / Configuración única.
  * *Meta de retención:* (ej. > 50% regresan en el segundo período).
* **Satisfacción (Happiness):**
  * *Pregunta clave SEQ:* *"¿Qué tan fácil fue para ti [completar la tarea] hoy?"*
  * *Respuestas:* Mucho más difícil / Como esperaba / Mucho más fácil.
  * *Meta:* > 80% de respuestas positivas.

#### 4.4 Metodología de Validación (Micro-surveys SEQ)
* **Encuesta 1 (Flujo Crítico):**
  * *Trigger (Cuándo):* Momento exacto de disparo.
  * *Frecuencia:* Cuándo se vuelve a mostrar (ej. mostrar la primera vez, luego a los 30 días).
  * *Escala:* Estrictamente 1 al 5.
  * *Lógica Condicional:* Qué hacer si la nota es baja (1 o 2) $\rightarrow$ abrir caja de texto.

#### 4.5 Esquema de Seguimiento (Piloto de 12 Semanas)
* **Mes 1 (semanas 1-4) — Semanal:** Monitoreo de adopción inicial, detección de bugs y fricción.
* **Mes 2 (semanas 5-8) — Quincenal:** Análisis de uso repetitivo y encuestas SEQ.
* **Mes 3 (semanas 9-12) — Mensual:** Evaluación de impacto final en métricas de negocio.

#### 4.6 Lanzamiento y Kick-off a Marketing (Comunicación)
* **Descripción breve (2-3 líneas):** Qué es y para quién.
* **Dolor vs Solución:** Resumen comercial.
* **Beneficios clave:** Beneficio principal y secundarios.
* **Mensaje clave / taglines:** Angles de comunicación.
* **Recursos de soporte:** Tango (enlace), Video Loom (enlace), Figma (enlace).
* **Contacto de Producto:** PM encargado y fecha límite para preguntas adicionales.

---

## 5. Hand-off a DEV & Stakeholders

**Propósito:** Entrega formal a TI. Reúne toda la información para que TI defina el **CÓMO** y el **CUÁNDO**. Insumo para que arquitectura dibuje C4 Nivel 2-4 y estime tareas.

### Plantilla de Documento

#### 5.1 Información General del Hand-off
* **Segmento:** Brands / Sellers / Suppliers / Logistics / Otro.
* **Equipo de TI receptor:** Nombre de la célula técnica.
* **Tech Lead asignado:** Nombre del TL.
* **Fecha de hand-off:** [DD/MM/AAAA]
* **Documentos previos:** Links a Kick-off, Discovery y Definición aprobados.

#### 5.2 Job to be Done (JTBD)
* *Formato:* *"Cuando [situación/contexto], quiero [acción/solución], para [resultado/beneficio]."*

#### 5.3 Contexto del Sistema (C4 Nivel 1)
* **Actores:** Roles humanos que interactúan con el sistema en este flujo.
* **Sistemas externos involucrados:** Terceros o APIs con los que el feature se conecta (ej. pasarelas, ERPs).
* **Dominios de negocio impactados:** Módulos de Dropi tocados (ej. Catálogo, Inventario, Facturación).
* **Flujo de datos a alto nivel:** Prosa o lista numerada que describe el recorrido de la información sin tecnicismos de código.

#### 5.4 Glosario de Dominio
| Término | Definición de negocio |
| --- | --- |
| **Término 1** | [Definición unificada para evitar ambigüedades] |

#### 5.5 Reglas de negocio consolidadas (Numeradas)
1. **Regla 1:** Condición y resultado esperado (ej. un combo debe tener mínimo 2 productos).
2. **Regla 2:** Condición de validación o rechazo.
3. **Regla 3:** Restricción de límites o cuotas.

#### 5.6 Criterios de Aceptación (Gherkin por Módulo)
* **Módulo A: [Nombre]**
  * *Escenario 1 (Flujo Exitoso):*
    * **Dado que** [Condición inicial]
    * **Cuando** [Acción del usuario o evento]
    * **Entonces** [Resultado de negocio esperado]
  * *Escenario 2 (Caso de Error/Regla):*
    * **Dado que** [Condición inicial]
    * **Cuando** [Acción que viola la regla X]
    * **Entonces** [Mostrar error descriptivo Y]

#### 5.7 Consideraciones de UX y Negocio
* Notas sobre impacto en retención, monetización o usabilidad esperada.

#### 5.8 Riesgos detectados desde Producto
* Riesgo de dependencia con terceros, cuellos de botella operativos o tiempos de respuesta.

#### 5.9 Insumo Requerido de TI (Hand-back)
*Antes de iniciar desarrollo, TI debe devolver en un documento:*
* Diagramas C4 Niveles 2 y 3 (Contenedores y Componentes).
* Estimaciones estimadas por fases técnicas (usando PERT y camino crítico).
* Restricciones técnicas detectadas y dependencias con otros equipos.
* Plan de observabilidad (logs, telemetría y alertas).
* Riesgos técnicos identificados.

---

## 🗂️ Apéndice: Checklists de Calidad

El agente auditor (`Delivery Controller`) validará cada entregable contra este checklist antes de promoverlo a Canon o marcar el proyecto como listo.

### Checklist Kick-off
- [ ] Hay un **POR QUÉ** ahora claramente articulado.
- [ ] Hay al menos 2 painpoints documentados con descripción.
- [ ] Hay un perfil principal de usuario definido.
- [ ] Hay un objetivo de negocio y uno de experiencia.
- [ ] No hay estimaciones técnicas ni decisiones de arquitectura en el documento.

### Checklist Discovery
- [ ] Hay evidencia de investigación con usuarios (no solo opinión).
- [ ] El **AS-IS** está documentado en pasos concretos.
- [ ] Las hipótesis siguen el formato sugerido y tienen evidencia.
- [ ] Hay una conclusión ejecutiva clara.

### Checklist Definición
- [ ] Hay una propuesta única elegida (no varias en paralelo sin decisión).
- [ ] Existe una lista explícita de **no-objetivos**.
- [ ] Las fases describen valor al usuario, no implementación.
- [ ] Los supuestos están explícitamente listados.

### Checklist Following y Lanzamiento
- [ ] Métricas de negocio con fórmula y criterio de éxito.
- [ ] Métricas de comportamiento (UX) definidas con eventos a trackear.
- [ ] Al menos una encuesta SEQ con trigger y frecuencia.
- [ ] Plan de 12 semanas estructurado por meses.
- [ ] Insumos completos para Marketing (Tango, Loom, beneficios).

### Checklist Hand-off a TI
- [ ] JTBD redactado en formato estándar.
- [ ] Sección C4 Nivel 1 completa: actores, sistemas externos, dominios y flujo de datos funcional.
- [ ] Glosario de dominio incluido.
- [ ] Reglas de negocio consolidadas y **numeradas**.
- [ ] Criterios de aceptación en formato **Gherkin** para todos los módulos funcionales.
- [ ] Riesgos de negocio y de experiencia listados.
