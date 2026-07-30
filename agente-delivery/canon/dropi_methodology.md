# Metodología de producto — Dropi

## Jerarquía de incidencias (Jira)

```
Épica
  → Historia (UX / UI / Frontend / Backend / DBA / QA / Legal / Lanzamiento)
      → Subtarea
  → Incidencia de Producto
      → Subtarea
  → Subtarea (directa de épica)
```

---

## Siglas de producto

| Sigla | Aplica a |
|---|---|
| `DROPI` | Core de la plataforma web (lo que ven los usuarios) |
| `DROPI APP` | Proyecto DROPI APP |
| `ADMIN` | Funcionalidades administrativas |
| `CAS` | Proyecto CAS |

---

## Épica

### Formato del título
`[Sigla del producto]: [Nombre de la épica]_[País]_[Usuarios afectados]`

**Ejemplo:** `DROPI: Validación de cuentas bancarias_Colombia_Todos los usuarios`

### Descripción de la épica

**Contexto**
- Descripción del problema:
  - ¿Qué problema estamos resolviendo?
  - ¿Por qué es importante?
  - ¿A qué usuarios afecta?
  - Datos relevantes que justifiquen la solución

**¿Qué buscamos?**
- Detalle de lo que vamos a lograr
- ¿Qué vamos a hacer?
- Fases del proceso (con posibles bloqueantes y entregable esperado por fase)

**Criterios de éxito**
- Métricas a impactar
- Público objetivo (tipos de usuario, países, marcas blancas)

**Documentación**
- Kickoff (link)
- Flujo general
- Figma / FigJam
- Documentos relacionados

---

## Historia

### Formato del título
`[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

**Ejemplo:** `[UX] DROPI Informe general de productos para Dropshippers`

### Etiquetas y su contenido esperado

| Etiqueta | Contenido esperado en la historia |
|---|---|
| `UX` | Flujo de interacción, wireframes en baja, investigaciones, benchmarks, pruebas de usuarios |
| `UI` | Benchmarks visuales, diseños en alta con especificaciones para handoff, prototipos en alta |
| `Frontend` | Componentes visuales requeridos, conexión con APIs backend, endpoints |
| `Backend` | APIs necesarias, esquema de datos, procesos automatizados |
| `DBA` | Estructura de tablas, validaciones y restricciones |
| `QA` | Procesos a validar, revisión de flujos |
| `Legal` | Revisión de requerimientos, adiciones a términos y condiciones |
| `Lanzamiento` | Beneficios por tipo de usuario, video Tango de las funcionalidades |

### Descripción de la historia

**Historia (formato)**
```
Como [tipo de usuario],
Puedo [acción],
Para [resultado].
```

Tipos de usuario válidos: Dropshipper, Proveedor, Emprendedor, Marca Blanca, Seller, Administrador, Super Administrador.

**Descripción del proceso**
Detalle de cómo se realizaría el proceso: documentación, flujos, paso a paso y detalles relevantes.

**Flujo del usuario (user flow)**
Paso a paso que debe realizar el usuario para completar la tarea.
- Separado por viñetas o números
- Incluir diagrama UML si aplica

**Criterios de aceptación (formato Gherkin)**
```
Escenario: [Nombre del escenario]
  Dado que [precondición / escenario inicial]
  Cuando [acción que ejecuta el usuario]
  Entonces [resultado esperado / validación]
```

**Condiciones adicionales**
- Versión del sistema de diseño (1.0 = componentes actuales; 2.0 = sistema de diseño nuevo)
- Es nuevo o rediseño
- Resoluciones: Desktop, tablet, laptop, responsive (móvil)

**Definición de Hecho (DoD)**
Resultados esperados para cada acción o requerimiento.

---

## Subtarea

### Formato del título
`[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

**Ejemplo:** `[UX] DROPI APP Diseño del nuevo flujo de pantalla favoritos Dropi app`

### Descripción de la subtarea
Pasos a seguir para completar la tarea:
- Actividades concretas (investigaciones, benchmarking, definiciones de épica, sesiones de ideación, etc.)

---

## Incidencia de Producto

Va dentro de una épica. Agrupa actividades que desarrolla el equipo de producto para el avance de la épica.

---

## Documento de Kickoff

### Estructura oficial

**1. Título del Proyecto**
El mismo título del pitch aprobado.

**2. Introducción**
- Contexto: breve resumen del problema y por qué es importante.
- Objetivos del Proyecto: resultados específicos esperados.
- Apetencia: tiempo y recursos asignados al proyecto.

**3. Problema**
- Descripción Detallada: amplía el problema con datos, ejemplos y contexto adicional.
- Impacto: efecto en usuarios, negocio o ambos.
- Soluciones Actuales: cómo se aborda hoy y limitaciones de esas soluciones.

**4. Riesgos de Producto**

| Riesgo | Pregunta clave |
|---|---|
| Riesgo de valor | ¿El cliente encontrará valor en esta solución? |
| Riesgo de usabilidad | ¿Los usuarios podrán usarla efectivamente? |
| Riesgo de factibilidad | ¿Podemos construirla con los recursos y tecnologías disponibles? |
| Riesgo de viabilidad empresarial | ¿Esta solución funcionará para nuestro negocio? |
| Riesgo Legal | ¿Cumplimos con todos los requerimientos de ley? |

**5. Preguntas Abiertas**
- Preguntas Clave: preguntas que deben responderse en la fase de shaping.
- Hipótesis: posibles soluciones o enfoques a explorar.

**6. Escenarios**
- Posibles casos que pueden suceder durante el desarrollo.

**7. Primeras Ideas**
- Ideas iniciales que existen alrededor del proyecto.

**8. Equipo del Proyecto**
- Roles y Responsabilidades: rol, nombre, responsabilidades específicas.
- Contacto: información de contacto de cada miembro.

**9. Próximos Pasos**
- Plan de Trabajo Inicial: primeros pasos concretos.
- Reuniones de Seguimiento: calendario de revisiones periódicas.

**10. Apéndices (Opcional)**
- Datos de investigación, feedback de usuarios.
- Wireframes o bocetos iniciales.

---

## Pitch

Documento para generar interés y obtener aprobación para pasar a la fase de shaping.

### Estructura oficial

**Título del Pitch**
Breve y descriptivo. Captura la esencia de la idea.

**1. Problema**
- ¿Qué problema estamos resolviendo? (claro y conciso)
- ¿Por qué es importante? (datos o ejemplos concretos del impacto)
- ¿Cómo se está resolviendo actualmente? (soluciones actuales y sus limitaciones)

**2. Apetencia**
- ¿Cuánto tiempo estamos dispuestos a invertir? (tiempo máximo realista)
- ¿Qué restricciones tenemos? (técnicas, presupuestarias, de recursos)

**3. Solución** *(Opcional)*
- ¿Cómo podríamos resolver el problema? (ideas generales, sin detalle técnico)
- ¿Qué beneficios aportaría? (para usuarios y para el negocio)
- ¿Qué riesgos existen?

**4. Consideraciones Adicionales** *(Opcional)*
- ¿Qué datos o investigaciones respaldan esta idea?
- ¿Qué preguntas abiertas tenemos? (para la fase de shaping)
- ¿Quién sería el responsable del proyecto?

---

## Brief de Lanzamiento

Documento que se entrega al equipo de comunicaciones para coordinar el lanzamiento de una funcionalidad o producto.

### Estructura oficial

**1. Título del Proyecto**
Nombre oficial del producto o funcionalidad.

**2. Descripción General**
- ¿Qué es? (2-3 líneas)
- ¿Para quién está dirigido? (segmento o tipo de usuario)

**3. Beneficios Clave**
- Beneficio principal: el valor agregado central.
- Beneficios secundarios: otros puntos fuertes (viñetas, máximo 5).

**4. Objetivo del Lanzamiento**
- Meta principal de la campaña.
- Fechas de lanzamiento o ventana aproximada.
- Estrategia de producto: requerimientos puntuales del equipo de producto para el lanzamiento.

**5. Mensajes y Ángulos de Comunicación**
- Mensaje clave: frase o tagline que resume la propuesta de valor.
- Puntos de apoyo: ideas o frases que refuerzan la comunicación.

**6. Recursos Disponibles**
- Video demostrativo (enlace si aplica).
- Documentación paso a paso en Tango.
- Enlace a Figma / prototipo (solo si el equipo de comunicaciones lo requiere).
- Documentos o presentaciones (PDF de funcionalidades destacadas, etc.).

**7. Contacto Principal**
- Persona de producto responsable de resolver dudas de posicionamiento, tono o alcance.
- Fecha límite para enviar solicitudes de información adicional.

---

## Documento de Research (Research Brain, RB-XXX)

Vive en `research-brain/` (un archivo por research, indexado en `research-brain/INDEX.md`) y se sincroniza con la tabla `research_documents` en Supabase. Es la fuente de verdad para cualquier pregunta sobre usuarios, dolores u oportunidades.

### Formato del ID y título
`RB-[número secuencial]-[slug del tema]` — ej. `RB-001-dropshippers-creativos-ventas.md`

### Estructura oficial (secciones EN ESTE ORDEN)

**Metadatos** (tabla): ID, Fecha de investigación, Iniciativa relacionada, Segmento investigado, Etapa del journey, Fuente, Tipo de fuente, Nivel de confianza, Tags.

**Problema investigado** — qué bloqueo o pregunta motivó el research.

**Preguntas de investigación** — lista numerada.

**Participantes** (tabla): Participante, Perfil, Tiempo/antigüedad, Nicho o segmento.

**Hallazgos principales** — subsecciones numeradas, cada una con evidencia o cita de respaldo.

**Dolores detectados** (tabla): #, Dolor, Intensidad (Crítico/Alto/Medio/Bajo), Segmento afectado, Evidencia.

**Oportunidades identificadas** (tabla): #, Oportunidad, Quién la señaló, Relacionada con (dolor(es)).

**Hipótesis** — subsecciones `Validadas ✅` y `Descartadas ❌`, cada hipótesis con su evidencia.

**Evidencia y citas relevantes** — citas textuales en blockquote con atribución.

**Métricas mencionadas** (tabla): Métrica, Qué mide, Umbral/referencia, Quién la usa.

**Herramientas mencionadas** (tabla): Categoría, Herramientas, Uso reportado.

**Análisis de herramientas competencia (benchmark)** *(Opcional — solo si el research incluyó benchmark competitivo)*.

**Relación con iniciativas Dropi** (tabla): Iniciativa/Área, Conexión con este research.

**Vacíos de información** — limitaciones del research (sesgo de muestra, falta de datos cuantitativos, etc.).

**Recomendaciones para nuevo research** — qué continuar, qué research nuevo se necesita, qué datos recopilar.

**Fuentes** (tabla): Tipo, Descripción (incluir ruta al documento original si existe).

### Regla dura
Ningún hallazgo, dolor u oportunidad se registra sin evidencia (cita o dato) que lo respalde. Si no hay evidencia suficiente, el research lo dice explícitamente en "Vacíos de información" en vez de inventar.

---

## Documento de Discovery Conductual (Intervention Brief)

Formato oficial para intervenciones basadas en diseño conductual, coordinado por el Agente de Discovery.

### Estructura oficial (secciones EN ESTE ORDEN)

**1. Problema conductual** — definición del comportamiento actual de los usuarios, comportamiento objetivo esperado y la brecha (gap) a resolver.

**2. Diagnóstico conductual** — causa raíz analizada bajo B=MAP (Motivación/Ability/Prompt), nivel cognitivo (Sistema 1/Sistema 2), marcadores somáticos de relevancia, sesgos conductuales presentes y evidencia de soporte.

**3. Intervención propuesta** — descripción detallada de la propuesta, cambios funcionales en el flujo y análisis del trilema de fricción (fricciones a eliminar, a preservar y a invertir).

**4. El Loop Conductual** — diseño específico del disparador (Trigger), la acción (Action), la recompensa variable (Variable Reward) y la inversión del usuario (Investment).

**5. Guardarraíles de Experiencia** — alineación con la teoría de la autodeterminación (SDT: Autonomía, Mastery/Competencia, y Relatedness/Relación).

**6. Validación de Supuestos** — el supuesto de mayor riesgo identificado, el test conductual de validación elegido (Wizard of Oz, Fake Door, Concierge, etc.) y el costo estimado de estar equivocados (downside).

**7. Métricas de Éxito** — métricas de actividad (adopción/uso), el outcome conductual principal, proxy de comportamiento y baselines cuantitativos frente a metas.

### Regla dura
Este documento es obligatorio para el 100% de los cambios conductuales o funcionales en la plataforma, independientemente del tamaño de la iniciativa, garantizando el rigor científico y de producto antes de pasar a desarrollo. Se debe anexar su enlace oficial bajo el apartado "Documentación / Research" de la Épica Jira correspondiente.

---

## Flujo de Usuario (User Flow)

### Estructura oficial (secciones EN ESTE ORDEN)

**a) Flujo narrativo** — lista numerada de pasos desde el punto de entrada hasta el resultado final, indicando qué hace el usuario y qué hace el sistema en cada paso, con bifurcaciones (si X entonces Y, si no entonces Z).

**b) Diagrama Mermaid** — el mismo flujo en `flowchart TD` válido y ejecutable.

**c) Casos alternativos y de error** — al menos 2-3 escenarios relevantes con su propio flujo.

El nivel de detalle se ajusta según la etiqueta de la historia a la que pertenece (UX: perspectiva y emociones del usuario; Frontend: navegación y estados de UI; Backend: llamadas a API y validaciones).

---

## Página de Conocimiento de Módulo (Confluence — Dropi Brain)

Vive en Confluence, dentro de la carpeta del módulo correspondiente (Home, Dashboard, Productos, Pedidos/Órdenes, Logística, Reportes, Financiero, Marketing, CAS, Academy, Configuraciones, Dropi app, Ecomscanner — todas bajo "Dropi CORE" en el espacio Product Discovery). Es la traducción del "cerebro del negocio" (sesiones de Product Lab u otras fuentes) a cada sección funcional de la plataforma. **Confluence es el registro del Dropi Brain**: esta es la estructura oficial que toda página de conocimiento de módulo debe seguir para que ese registro sea consistente, citable y fácil de recuperar (por humanos y por IA).

### Regla de fuente única
Un tema vive en **una sola página canónica**. Antes de crear una página nueva, se busca si ya existe contenido relacionado (misma carpeta u otra) y se enriquece esa página en vez de duplicar. Si un módulo tiene dos nombres (ej. "Órdenes" internamente / "Mis Pedidos" en la plataforma), se usa un solo nombre canónico y se deja explícita la equivalencia en la página. Antes de publicar, se consulta el "Mapa de fuente única" (página índice en Confluence) para confirmar dónde vive cada tema.

### Estructura oficial (secciones EN ESTE ORDEN)

**Ficha de fuente** (tabla, al inicio de la página):

| Campo | Valor |
|---|---|
| Fuente | Nombre y fecha de la sesión/documento origen |
| Facilitador/a | Quién lideró la sesión |
| Grabación | Link a Drive |
| Notas / Transcripción | Link a Drive |
| Enlace(s) en Dropi | Link(s) directo(s) a la(s) pantalla(s) de la plataforma de la(s) que habla la página (opcional — se agrega cuando se consigue) |
| Estado del contenido | `Validado` / `Pendiente de validar` / `Hipótesis` |

Si la página se amplía con una sesión nueva, se **agrega una fila nueva** a la ficha de fuente (no se reemplaza la anterior) para conservar el historial de de dónde vino cada parte del contenido.

**Contenido** — secciones con encabezados según el tema, redactadas en lenguaje de negocio (nunca transcripción cruda pegada). Usa paneles: `info` para contexto importante, `warning` para riesgos/gaps operativos, `error` para un dato en disputa pendiente de validar.

**Gaps de conocimiento y acciones pendientes** — panel al final de la página con lo que quedó sin resolver, y con quién debería resolverlo si se mencionó a alguien responsable.

### Regla dura
Ningún dato numérico (tiempos, porcentajes, montos) se afirma como definitivo si dos fuentes lo contradicen entre sí. Se marca `Estado del contenido: Pendiente de validar`, se deja un panel `error` señalando el conflicto y el link a ambas fuentes, y se avisa a quien pueda confirmarlo — nunca se elige arbitrariamente cuál de los dos dueños tiene razón.

### Labels obligatorios en Confluence
- `dropi-brain` — en toda página de conocimiento de módulo.
- `modulo-[nombre]` — uno por carpeta/módulo (ej. `modulo-ordenes`, `modulo-productos`, `modulo-logistica`).
- `product-lab` (u otra etiqueta que identifique el tipo de fuente, si no es Product Lab).
- Estado: `validado` / `pendiente-validar` / `hipotesis`.

---

## Tipos de usuarios en Dropi

- Dropshipper
- Proveedor
- Emprendedor
- Marca Blanca
- Seller
- Administrador
- Super Administrador
