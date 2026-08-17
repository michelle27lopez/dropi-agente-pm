# **Documento E2E de Iniciativa: Reorganización de Navegación y Pantallas Dropi**

**Fuente de Verdad del Proyecto | Estándar de Documentación E2E Dropi**

| 📖 Guía Rápida de Uso y Principios Rectores Producto (PM/PO 🧠): Define el *QUÉ*, el *POR QUÉ* y el *PARA QUÉ*. Product Design (PD 🪵/🔍): Discovery, arquitectura UX, prototipado y validación de usuario. Marketing (⭐️): Define la estrategia de comunicación interna y externa. Tecnología (TI 💻): Define el *CÓMO* y el *CUÁNDO* (Arquitectura C4 N2-4, PERT, estimaciones). Gobierno (TDL/TPL 💻): Matriz RACI, Risk Heat Map, DORA Metrics y Traffic Light de entrega. 🚫 Regla Clave: Si un apartado no aplica en este proyecto, registrar "N/A" explícitamente para confirmar su revisión. |
| :---- |

## **1\. 🧠 Kick-off \[Producto \- PM/PO\]**

### **1.1. ¿Qué buscamos? (Problema y Propósito)**

> * **Reorganización de pantallas:** Ubicar cada pantalla dentro del módulo correspondiente para maximizar la descubribilidad y la usabilidad general de la plataforma.  
> * **Mantener la versión actual:** Garantizar que la interfaz conserve y aplique rigurosamente los componentes y estilos estandarizados del sistema de diseño versión 2.0.  
> * **Optimización de la navegación:** Mejorar la estructura de navegación global reduciendo la fricción y la carga cognitiva sin alterar la lógica de negocio subyacente.

### **1.2. Público Objetivo**

| Segmento / Rol | Descripción e Impacto   |
| :---- | :---- |
| **Usuarios Dropi (Core)** | Todos los perfiles activos de la plataforma: Dropshippers, Proveedores, Marcas |
| **Equipo de Diseño y Desarrollo** | Responsables directos de maquetar, iterar, prototipar y validar la nueva arquitectura de información. |
| **Equipo de Producto** | Supervisión estratégica, alineación del roadmap y garantía del éxito funcional del proyecto. |

### **1.3. Alcance e Impacto Regional**

> * **Impacta Marcas Blancas:** Sí (Aplica a todas las instancias y variaciones de marcas blancas conectadas a la infraestructura).  
> * **Países:** Todos los países donde opera Dropi actualmente.

## **2\. 🔍 Discovery & Levantamiento \[Product Design \- PD\]**

### **2.1. ¿Qué vamos a hacer? (Acciones y Prototipado)**

> 1. **Duplicación segura de pantallas:** Copiar las pantallas actuales para evitar interrupciones o afectaciones en el entorno de producción existente.  
> 2. **Reorganización modular:** Reubicar las pantallas dentro de los módulos adecuados según su afinidad funcional y la lógica del usuario.  
> 3. **Seguimiento y telemetría de usuarios:** Implementar eventos de seguimiento analítico para medir el comportamiento del usuario con la nueva estructura.  
> 4. **Pruebas de usabilidad:** Ejecutar pruebas con prototipos de alta fidelidad para validar la tasa de éxito de tareas y la satisfacción del usuario.  
> 5. **Preservación de configuraciones:** Mantener la configuración actual de tiendas sin modificaciones en esta fase del proyecto.  
> 6. **Exploración de componentes Tab:** Explorar e implementar el uso de tabs para estructurar y dividir el contenido, alineándolo con el sistema de diseño v2.0.

### **2.2. Comparativo Estructural (AS-IS vs. TO-BE)**

| Perspectiva AS-IS (Actual) | Propuesta TO-BE (Optimizada)   |
| :---- | :---- |
| Pantallas dispersas entre menús principales con alta carga cognitiva para el usuario. | Agrupación modular por dominio de funcionalidad con pestañas (*tabs*). |
| Duplicación de rutas e inconsistencias para encontrar herramientas secundarias. | Navegación unificada bajo componentes estandarizados del UI Kit v2.0. |

## **3\. 🪵 Definición & Alcance \[Product Design / Producto\]**

### **3.1. Criterios de Éxito del Proyecto**

| Criterio de Éxito | Métrica / Objetivo | Método de Validación   |
| :---- | :---- | :---- |
| **Mejor experiencia de usuario** | Reducción de fricción navegacional y menor tasa de abandono de tareas. | Pruebas de usabilidad y mapa de calor. |
| **Aumento en la eficiencia** | Reducción del tiempo promedio para encontrar funcionalidades clave. | Telemetría de tiempo en pantalla (Time-on-task). |
| **Satisfacción del usuario** | Feedback positivo en encuestas post-implementación (\>80% CSAT/SUS). | Encuestas In-App y entrevistas con usuarios. |
| **Compatibilidad y estabilidad** | Cero regresiones en lógica de negocio o errores críticos de navegación. | Pruebas QA, Smoke Tests y monitoreo en producción. |

### **3.2. Límites y No-Objetivos (Out of Scope)**

> * **No-Objetivo 1:** Modificaciones o reestructuración en la configuración interna de tiendas en esta fase del proyecto.  
> * **No-Objetivo 2:** Cambios en la lógica de procesamiento de pedidos, inventario o pasarelas de pago.

## **4\. 🪵 Following y Lanzamiento \[Product Design / Producto\]**

**Plan de Medición:** Monitoreo post-entrega basado en datos de analítica de producto, comparando la adopción de las nuevas rutas y evaluando la retención en los nuevos módulos visuales.

## **5\. ⭐️ Estrategia de Comunicación \[Marketing\]**

**Estado del apartado: N/A** — Pendiente de definición detallada por el equipo de Marketing para comunicar las mejoras de navegación a usuarios activos y aliados de Marcas Blancas.

## **6\. 🧠 Hand-off \- DEV & Stakeholders \[Producto\]**

### **6.1. Contexto C4 \- Nivel 1 (Insumos de Producto)**

> * **Actores:** Dropshippers, Proveedores, Emprendedores/Marcas, Administradores y Vendedores.  
> * **Sistemas y Dominios impactados:** Plataforma Dropi Core, UI Kit 2.0 y subsistemas de Marcas Blancas.  
> * **Flujo de datos:** Entrada mediante nueva estructura de menús y tabs; persistencia y consumo de APIs de negocio sin alteraciones.

### **6.2. Hand-off a Stakeholders**

> * Entrega de prototipos navegables en Figma (Alta fidelidad).  
> * Guía de equivalencias de navegación (Matriz de mapeo de pantallas viejas vs. nuevas).

## **7\. 💻 Activación de TDL / TPL \[Tecnología \- TI\]**

### **7.1. Responsabilidades Técnicas (CÓMO y CUÁNDO)**

> * **Arquitectura C4:** Elaboración de los Niveles 2 (Contenedores), 3 (Componentes) y 4 (Código).  
> * **Planificación de Desarrollo:** Estimaciones de esfuerzo, construcción de diagrama PERT y definición de fases técnicas de despliegue.

### **7.2. Gobierno y Ejecución de la Entrega**

> * Matriz RACI consolidada para la fase de desarrollo.  
> * Mapa de Riesgos (Risk Heat Map) y mitigación de posibles cuellos de botella.  
> * Métricas DORA objetivo y seguimiento semanal mediante estatus Traffic Light.

## **8\. 🪵 Hallazgos Following \[Product Design / Producto\]**

**Estado del apartado: N/A** — Se completará con hallazgos cuantitativos e insights una vez recolectada la data posterior al lanzamiento.

## **9\. 📋 Apéndice Checklist**

| Entregable / Hito | Responsable | Estado   |
| :---- | :---- | :---- |
| Documento de Kick-off y Alcance | Producto (PM/PO) | **Completado** |
| Prototipo de Alta Fidelidad en Figma | Product Design (PD) | **En Progreso** |
| Estrategia de Comunicación a Usuarios | Marketing | **Pendiente (N/A)** |
| Arquitectura C4 N2-4 y PERT | Tecnología (TI) | **En Progreso** |

