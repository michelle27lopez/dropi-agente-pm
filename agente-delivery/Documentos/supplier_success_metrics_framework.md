# Framework de Métricas y Operación · Célula Supplier Success 🚀

Este framework ha sido diseñado para estructurar el monitoreo y la toma de decisiones estratégicas dentro de la célula **Supplier Success** de Dropi. Su objetivo es conectar los resultados de negocio definitivos (*Lagging*) con las palancas operativas y de producto (*Leading*) sobre las que podemos influir directamente.

---

## 1. La Pirámide de Métricas de Supplier Success

Como Gerente de Producto, tu rol no es solo reportar el volumen final, sino diagnosticar en qué parte del embudo se está trabando el crecimiento. Estructuramos las métricas en 4 niveles jerárquicos:

```mermaid
graph TD
    %% Nivel 1
    N1[<b>Nivel 1: Negocio & Impacto (Lagging)</b><br>GMV & Volumen de Órdenes] --> N2
    
    %% Nivel 2
    N2[<b>Nivel 2: Adopción & Valor (Leading)</b><br>Tasa de Activación · Proveedores Activos A30/A15 · Ticket Promedio] --> N3
    
    %% Nivel 3
    N3[<b>Nivel 3: Eficiencia & Embudos (Operativo)</b><br>Time to First Sale · % Checklist Completado · Conversión de Negociaciones] --> N4
    
    %% Nivel 4
    N4[<b>Nivel 4: Entradas & Gestión (Inputs)</b><br>Nuevos Registros · Postulaciones a Verificado · TAT de Auditoría]
    
    %% Estilos
    style N1 fill:#F77F00,stroke:#d66c00,stroke-width:2px,color:#fff
    style N2 fill:#fff3e0,stroke:#F77F00,stroke-width:1px,color:#000
    style N3 fill:#fff,stroke:#bfbfbf,stroke-width:1px,color:#333
    style N4 fill:#f9f9f9,stroke:#e0e0e0,stroke-width:1px,color:#666
```

### Nivel 1: Negocio e Impacto (Lagging)
Miden el éxito final del negocio en la plataforma. Son difíciles de mover directamente a corto plazo, pero son el resultado final de tus proyectos.
* **GMV (Gross Merchandise Value):** Valor total en dinero de las transacciones operadas por proveedores de tu célula.
* **Volumen de Órdenes Totales:** Cantidad de órdenes exitosas completadas y despachadas.

### Nivel 2: Adopción y Valor (Leading)
Miden si los usuarios están encontrando valor en la plataforma de manera recurrente.
* **Tasa de Activación de Proveedores (%):** Porcentaje de proveedores nuevos que realizan su primera venta en sus primeros 15/30 días.
* **Proveedores Activos (A15 / A30):** Cantidad de proveedores únicos con al menos 1 orden despachada en los últimos 15 o 30 días.
* **Ticket Promedio por Orden (AOV):** Monto promedio de cada orden. *Impactado directamente por el proyecto Combos (`COM-001`)*.
* **Salud del Catálogo (Catálogo Activo vs. Sano):** % de productos cargados que reciben al menos 1 orden al mes frente a productos sin ventas ("ruido").

### Nivel 3: Eficiencia y Embudos (Operativo)
Miden el desempeño de los flujos de producto y experiencia de usuario.
* **Time to First Sale (Time to Value):** Número de días promedio desde que un proveedor se registra hasta que despacha su primera orden. *Foco de `TTV-001`*.
* **% Completion Rate del Checklist (UserPilot):** Porcentaje de proveedores nuevos que completan los pasos clave del asistente flotante.
* **Tasa de Conversión de Negociaciones:** % de negociaciones iniciadas por proveedores que son formalmente aceptadas por los líderes de comunidad y generan transacciones.
* **% de Sincronización Externa:** % de proveedores que conectan su catálogo con Shopify, Tienda Nube, WooCommerce, etc.

### Nivel 4: Entradas y Gestión (Inputs)
Mapean la materia prima y el trabajo operativo diario del equipo.
* **Nuevos Registros de Proveedores:** Cantidad de cuentas de proveedor creadas por semana/país.
* **Postulaciones a Ascenso (Verificado / Premium):** Cantidad de solicitudes entrantes para subir de nivel de verificación.
* **TAT de Auditoría (Turnaround Time):** Tiempo promedio en horas que tardan los auditores (Kevin/Eric) en validar y responder una postulación en el CRM.

---

## 2. Dashboard de Control del PM (Monitoreo Semanal)

Como Gerente de Producto, tu tablero semanal debe responder a estas preguntas clave de diagnóstico los lunes por la mañana:

| Métrica | Meta / Línea Base | Pregunta Clave de Diagnóstico | Acción si la métrica cae |
| :--- | :--- | :--- | :--- |
| **Volumen de Órdenes & GMV** | Monitoreo por País | ¿Estamos creciendo en volumen o estamos estancados? | Revisar si la caída es por falta de stock de proveedores "Top" o caída en conversión de dropshippers. |
| **Tasa de Activación** | L.B. Histórica | ¿Los proveedores nuevos están llegando a su primer venta rápido? | Validar el embudo de inactividad de UserPilot. Ajustar visibilidad del checklist en UI. |
| **TAT de Auditoría (CRM)** | < 24 horas | ¿Tenemos cuellos de botella en la aprobación de nuevos proveedores? | Revisar el pipeline en CRM con Emerson y redistribuir carga de validación. |
| **Postulaciones (CRM)** | 178 acumuladas | ¿El flujo de ascensos está atrayendo leads calificados? | Evaluar si las reglas de comunicación o los requisitos son muy difíciles o confusos. |
| **Catálogo Activo Sano** | % Foco | ¿Tenemos demasiado "ruido" en el catálogo que confunde a dropshippers? | Ajustar insights de clasificación de productos y sugerir depuración de stock inactivo. |

---

## 3. Relación de Proyectos Activos vs. Palancas de Impacto

Tus proyectos actuales no son tareas aisladas; cada uno ataca una palanca del embudo:

```text
                                  ┌───────────────────────────┐
                                  │      NUEVOS REGISTROS     │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
  [Proyecto: TTV-001]             ┌───────────────────────────┐
  - Checklist UserPilot           │    ACTIVACIÓN DE LEADS    │  ───► Menor Time to Value
  - Integración CRM               └─────────────┬─────────────┘
                                                │
                                                ▼
  [Proyecto: NEG-001 & COM-001]   ┌───────────────────────────┐
  - Negociación Comunidades       │    PRODUCTIVIDAD (A15)    │  ───► Más GMV por Proveedor
  - Combos Multi-producto         └─────────────┬─────────────┘
                                                │
                                                ▼
  [Proyecto: IND-001 & CHIP]      ┌───────────────────────────┐
  - Dashboard de Indicadores      │     RETENCIÓN & ASCENSO   │  ───► Proveedores Verificados/Premium
  - Enriquecimiento de Perfil     └───────────────────────────┘
```

* **[TTV-001] Time to Value:** Impacta directamente la **Tasa de Activación** y reduce el **Time to First Sale**. Si esta métrica mejora, entra más volumen de proveedores sanos al ecosistema.
* **[COM-001] Combos:** Impacta el **Ticket Promedio por Orden (AOV)** y la **Salud del Catálogo**. Al agrupar productos, el dropshipper vende combos con mayor margen y el proveedor mueve más stock por transacción.
* **[NEG-001] Negociaciones:** Reactiva proveedores inactivos u offline que tienen stock pero necesitan un trato comercial preferente con líderes de comunidad. Aumenta los **Proveedores Activos (A15/A30)**.
* **[IND-001] Panel de Indicadores + Chip:** Impacta la **Tasa de Aprobación / Ascenso** y la **Confianza del Dropshipper** en el catálogo (al ver insignias de verificación válidas y perfiles robustos).

---

## 4. Rituales y Rutina Semanal sugerida para el PM

Para mantener el control del producto y la operación sin ahogarte en el día a día, adopta este esquema de trabajo semanal:

### Lunes: El Diagnóstico (Datos e Impacto)
* **Mañana (30 min):** Revisa el dashboard de métricas (GMV, Órdenes, Tasa de Activación de la semana anterior).
* **Mesa de Negociación:** Participa con data clara. Usa el documento que preparaste ("Carta a Eduardo Pachón") para definir prioridades de tecnología.
* **Alineación con Célula:** Envía el plan de la semana y presiona bloqueantes (ej. mensaje enviado hoy a José para estimación de combos y T&Cs de negociaciones).

### Martes/Miércoles: El Shaping & Discovery (Mirada a Futuro)
* **Revisión de Evidencia:** Lee researches cargados en el [Research Brain](file:///Users/jaime.guevara/Documents/proyectos/Agente%20delivery%20manager/research-brain) para buscar ángulos que resuelvan dolores detectados en la data.
* **Sesiones de Alineación:** Coordina con líderes de otras áreas (Growth Ops con Juan Sebastián, Integraciones con Enrique).

### Jueves: La Sesión Creativa (Alineación y Soluciones)
* **Foco:** Cero seguimiento de status.
* **Dinámica:** Poner en la mesa las preguntas abiertas y los riesgos de negocio detectados en Supabase (ej. cómo resolver la consistencia de stock en combos o la devaluación del catálogo). Invitar al equipo a retar el statu quo.

### Viernes: Cierre de Compromisos e Indicadores
* **Auditoría:** Revisa el estado de las tareas ejecutadas en el sprint.
* **Consolidación:** Asegúrate de que las decisiones creativas tomadas el jueves queden debidamente documentadas como *Draft Insights* en Supabase para que no se pierdan.
