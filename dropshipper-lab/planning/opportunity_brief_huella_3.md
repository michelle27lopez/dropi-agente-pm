# 🛡️ OPPORTUNITY / INTERVENTION BRIEF: Huella Digital 3.0 (PROD-1546)

* **Célula:** Seller Success
* **PM:** Santiago Herrera Acosta
* **Diseño / Scope:** Alejandra Melo Salazar
* **Prioridad:** Medium
* **Universo de Datos:** Dropshippers activos que realizan despachos manuales.

---

## F0 — Frame (Encuadre)

### Outcome a mover
* **Business Outcome:** Reducir la tasa de devoluciones en el canal de órdenes manuales en $\ge 15\%$ y optimizar costos logísticos sin impactar negativamente la facturación (incrementar o mantener pedidos efectivos en $\ge 10\%$).
* **Product Outcome (Métrica Primaria):** Tasa de devoluciones por cohorte (Grupo Piloto Activo vs. Grupo de Control) en órdenes manuales. 
* **Baseline:** Pendiente de entrega por el equipo de Data/BI por país.

### ¿Por qué este tramo y no otro?
La versión actual (V2) logró cobertura multipaís y desplegó una clasificación estática tipo semáforo de riesgo e historial. Sin embargo, al ser información estática y generalizada, el dropshipper carece de visibilidad del comportamiento dinámico del comprador (evolución de entregas en el tiempo, transportadora con mejor desempeño individual, o riesgos específicos por dirección de destino). V3 transforma la data histórica en inteligencia predictiva en el punto crítico del despacho.

### ¿Qué pasa si no intervenimos?
Los comercios seguirán enviando pedidos con alta incertidumbre, ignorando las alertas pasivas (como las amarillas de "Precaución") y asumiendo fletes de devolución costosos que destruyen su margen operativo.

---

## F1 — Diagnose (Diagnóstico B=MAP)

### Causa raíz conductual
1. **Ability (Fricción Cognitiva) — Crítico:** La clasificación estática de la V2 genera desconfianza ("¿qué tan confiable es el dato?"). Además, el dropshipper no entiende el significado exacto de una alerta en "Precaución" (Amarillo) ni qué acciones preventivas puede tomar, lo que provoca que ignore la señal y despache por defecto.
2. **Prompt (Señal) — Alto:** Mientras que la Alerta Roja gatilla un modal automático (fuerte), las alertas en "Precaución" o "Probable" son visualmente pasivas y no sugieren ni facilitan ninguna acción correctiva específica en la interfaz.

### Niveles cognitivos del usuario
* **Sistema 1 (Reacción):** El color semáforo actual busca un freno inmediato. Funciona en Rojo, pero en Amarillo genera duda y parálisis por ambigüedad.
* **Sistema 2 (Evaluación):** El usuario requiere datos contextuales detallados (ej. "Esta dirección tiene 50% de devoluciones" o "El cliente devuelve pedidos caros") para racionalizar y justificar su decisión de no despachar o cambiar de transportadora.

### Guardarraíles de la Autodeterminación (SDT)
* **Autonomía:** Se prohíbe bloquear automáticamente el despacho en cualquier nivel de alerta. El dropshipper debe conservar el control final (autonomía) para asumir el riesgo logístico.
* **Competencia:** V3 debe estructurar el drawer para que el seller actúe como un tomador de decisiones estratégicas, brindándole herramientas claras de mitigación en lugar de una advertencia vacía.

---

## F2 — Design (Diseño del Piloto V3)

### Hipótesis Principal
> **Si** facilitamos un perfil de comportamiento histórico detallado (evolución mensual, efectividad de transportadoras y comparación de direcciones) en el drawer de Huella Digital,
> **entonces** los dropshippers tomarán decisiones logísticas preventivas y elegirán parámetros óptimos de despacho,
> **lo que** reducirá la tasa de devoluciones en $\ge 15\%$, porque eliminamos la fricción de interpretar una señal estática de riesgo (Ability) y guiamos la mitigación óptima (Prompt).

### Intervención Mínima Viable (MVP del Piloto)
Para el piloto de 12 semanas, priorizaremos **3 dimensiones críticas** en lugar de las 5 del alcance general, optimizando desarrollo y claridad:

1. **Evolución temporal del historial:** Historial de entregas vs. devoluciones representadas en un gráfico de barras mensual interactivo (últimos 12 meses).
2. **Recomendación de transportadora:** Etiqueta explícita in-app destacando cuál transportadora ha tenido la mayor tasa de éxito de entrega con este comprador.
3. **Alerta de dirección:** Alerta visual rápida si la dirección ingresada para la orden actual posee una efectividad de entrega menor en comparación con el histórico de direcciones del mismo cliente.

### Validación Barata (Pre-desarrollo - Prerrequisito)
* **Guerrilla Testing:** Alejandra Melo ejecutará un test de guerrilla con prototipo interactivo (Figma) con **5 comercios**. Se les expondrá un perfil en "Precaución" (Amarillo) con los nuevos datos. El criterio de paso a desarrollo es que el 100% de los testers declare entender la situación y proponga una acción preventiva coherente (ej. cambiar transportadora o confirmar dirección). Si declaran duda ("No sé qué hacer"), el diseño de Ability se iterará.

### Parámetros del Piloto
* **Muestra:** Grupo piloto de **20 sellers estratégicos** con alta frecuencia de órdenes manuales y consultas de Huella Digital.
* **Timing:** Drawer disponible en la creación, edición de órdenes y botón flotante.
* **Excluye:** Análisis por categorías de producto y marcas blancas para la primera fase.

---

## F3 — Measure (Métricas y Criterios de Decisión)

### 1. Métricas de Impacto / Outcome (Base de datos transaccional)
* **Reducción de devoluciones (Métrica North Star):** Comparativa de tasa de devoluciones del grupo piloto activo vs. su propio baseline transaccional de los 3 meses previos. Meta: 10% a 12% de reducción.

### 2. Métricas Conductuales y de UX (UserPilot / Eventos)
* **Adopción inicial:** Meta del 70% de órdenes del piloto con apertura del drawer.
* **Profundidad de uso:** Meta de 60% de aperturas interactuando con los tabs de historial o filtros avanzados de transportadora.
* **CSAT Contextual (in-app):** "¿Esta información te fue útil para tomar una decisión?" (Meta $\ge 80\%$ Sí).
* **SEQ (in-app):** "¿Qué tan fácil fue entender el nivel de riesgo?" (Meta promedio $\ge 4/5$).

### 3. Diccionario de Eventos a Instrumentar
* `hd_drawer_opened` (Propiedades: `source_page`, `delivery_probability`)
* `hd_filter_changed` (Propiedades: `selected_filter`, `source_page`)
* `hd_survey_submitted` (Propiedades: `survey_type`, `score`)

---

## F4 — Decide (Protocolo de Decisión)

* **Frecuencia de revisión:** Semanal (mes 1: salud del embudo y bugs), quincenal (mes 2: adopción y retención de uso), mensual (mes 3: consolidación de impacto en devoluciones).
* **Decisores:** Product Trio (Santiago Herrera, Alejandra Melo, Tech Lead).
* **Criterios de Cierre del Piloto:**

| Escenario | Decisión | Acción |
| :--- | :--- | :--- |
| Reducción devoluciones $\ge 10\%$ + Adopción $\ge 70\%$ | **Escalar ✅** | Rollout general del feature a todos los países y usuarios. |
| Adopción alta pero sin impacto en devoluciones | **Iterar 🔄** | El usuario entiende el dato pero no sabe cómo ejecutar la mitigación. Implementar automatización o sugerencias dinámicas de fletes. |
| Adopción $< 30\%$ o confusión alta en SEQ ($< 3.5$) | **Matar/Pausar ❌** | Problema de sobrecarga cognitiva. Simplificar visualización de datos y rediseñar el drawer. |

---

## 🏁 Definition of Done (DoD) de PROD-1546

El ticket de Jira `PROD-1546` se marcará como finalizado solo cuando se verifique el cumplimiento del siguiente checklist:
* [ ] **Prueba de usabilidad (Guerrilla Test) ejecutada** y aprobada con 5 comercios (Comprensión $\ge 80\%$).
* [ ] **Baseline de devoluciones por país documentado** por el equipo de Data/BI.
* [ ] **Confirmación de viabilidad técnica de cruces de datos** (direcciones y transportadora en BFF) validada por desarrollo.
* [ ] **Prototipos de interfaz de usuario (Figma)** del drawer diseñados y aprobados por diseño general (Michel Pino).
* [ ] **Diccionario de tracking de eventos de UserPilot definido** e instrumentado.
* [ ] **Umbrales del algoritmo de "cliente ansioso" y normalización de direcciones definidos** formalmente con desarrollo.
* [ ] **Grupo de 20 sellers piloto seleccionado** e identificado en base de datos.
