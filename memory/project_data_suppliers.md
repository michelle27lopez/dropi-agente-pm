---
name: project-data-suppliers
description: Contexto estratégico, operativo y portafolio de la Célula Suppliers (Supplier Success / Catálogo) para S2 2026. PM: Jaime Guevara. Actualizado el 24 de julio de 2026.
metadata:
  type: project
---

# Portafolio Suppliers Success (Catálogo & Proveedores) — S2 2026

Este documento centraliza el direccionamiento estratégico, los objetivos, los KPIs y el portafolio exclusivo de proyectos de la célula **Suppliers Success** (Catálogo de Productos) para el segundo semestre de 2026 (Q3 + Q4), liderada por Jaime Guevara (PM).

---

## 1. Direccionamiento Estratégico

*   **Propósito:** Optimizar y potenciar la oferta y el catálogo de proveedores dentro de Dropi, mejorando la disponibilidad de stock, reduciendo la fricción en la publicación de productos y facilitando el matching comercial con los dropshippers.
*   **Norte:** Garantizar que los dropshippers encuentren productos ganadores con stock confiable, y que los proveedores activen y roten su inventario de manera eficiente.
*   **NSM de la célula:** Conversión de catálogo y velocidad de activación de productos publicados (Time-to-Value del Proveedor).
*   **Población objetivo:** Proveedores (Suppliers / Marcas con inventario propio) y Dropshippers (como demandantes de catálogo).

---

## 2. Proyectos Destacados e Insights de Célula (Sesión 23 de Julio)

A continuación, se documenta la planeación y el refinamiento de los dos frentes clave discutidos recientemente con el equipo (Majo, Michelle, Laura Torres, Cate, Laura Contreras, Kevin).

### 2.1. Proyecto: Escucha de canales (espionaje) — [ESP-001]
*   **Objetivo:** Desarrollar un sistema de escucha cualitativa automatizada sobre grupos y canales públicos de WhatsApp y comunidades de e-commerce. Se conecta a través de un celular dedicado vía **Evolution API** para registrar la conversación, clasificarla por IA y extraer hallazgos.

#### Insights de Producto y Decisiones de la Reunión:
1.  **Análisis por Acciones Específicas (Majo Calderón / Michelle Lopez):**
    *   *Uso:* El sistema debe clasificar los datos de manera temporal para auditar el impacto inmediato de acciones puntuales (ej. el lanzamiento de *Cordia* en México o problemas específicos de recolección en días festivos).
    *   *Lente:* IA filtrará por palabras clave asociadas al evento y extraerá el resumen de dolores/oportunidades en un rango de fechas dado.
2.  **Clasificación por Funcionalidad de Plataforma (Cate Salazar / Jaime Guevara):**
    *   *Uso:* Cruzar la escucha cualitativa con el proyecto *Tars* (Lau Contreras / Diana Aldana) para mapear el CSAT y la adopción de funcionalidades específicas de la app.
    *   *Lente:* La IA interpretará cada mensaje entrante y lo asociará de manera algorítmica a las funcionalidades correspondientes (ej. buscador, wallet, integraciones), generando alertas automáticas cuando un feature concentre comentarios.
3.  **Soporte a Experimentos Activos (Laura Contreras):**
    *   *Uso:* Usar la data cualitativa del espía como evidencia para respaldar o ajustar experimentos activos en la plataforma.
    *   *Ejemplo:* Traquear menciones de problemas con el flujo de confirmación de órdenes en los estados *Pendiente* y *Pendiente por Confirmar* para soportar el escalamiento de la **Autoconfirmación**.
4.  **Generación de Contenido de Nutrición (Majo Calderón):**
    *   *Uso:* El equipo de marketing/comunidades consolidará los insights semanal y mensualmente para emitir respuestas directas y contenidos educativos en los canales de difusión oficiales (ej. aclarando dudas frecuentes sobre la wallet o transportadoras).
5.  **Ampliación del Ecosistema de Escucha:**
    *   *WhatsApp:* Canal prioritario actual. Se solicitará una línea telefónica corporativa para el área para evitar saturar el número personal de Michelle.
    *   *Futuro:* Integrar la escucha en comentarios de **YouTube** y **Facebook** (donde Dropi previamente adquirió la administración de grupos de la comunidad para mitigar hate y desinformación).

---

### 2.2. Proyecto: Campañas de Catálogo (Cyber Days) — [DESC-001 / DCA-001]
*   **Objetivo:** Permitir a los proveedores liquidar stock inactivo (sin ventas en las últimas 2 semanas y con inventario $\ge 500$ unidades) ofreciendo hasta 10 productos destacados con un descuento especial (~10%) durante temporadas comerciales críticas (Cyber Days, del 17 de agosto).

#### Flujo y Automatizaciones Clave:
1.  **Segmentación e Invitación Personalizada (Michelle / Laura Torres):**
    *   Sincronización mediante **Userpilot** para lanzar un popup in-app dirigido únicamente a la base de proveedores que cumplan con las condiciones de inventario inactivo, redirigiéndolos a su link único parametrizado.
2.  **Fase 1: Selección de Productos:**
    *   El proveedor ingresa y selecciona hasta 10 productos que cumplan las condiciones para participar.
3.  **Fase 2: Generación automática de Material (AI Frames):**
    *   El sistema fusiona las fotos de producto del catálogo con el marco oficial de la campaña (*Cyber Days*), entregando un ZIP con las imágenes optimizadas para descarga. Código reutilizado del desarrollo previo de Paola para Dropicop.
4.  **Fase 3: Automatización de Etiquetas (Jaime / Lucho):**
    *   *Problema:* Evitar que el proveedor tenga que cambiar manualmente el nombre de los productos (agregando la palabra "Hai" u otra palabra clave) o mover la categoría a *Cyber Days* uno por uno.
    *   *Solución:* El sistema actualizará las categorías y agregará las etiquetas de campaña de manera automática en la base de datos de Dropi para los productos elegidos por el proveedor, eliminando la carga operativa manual.
5.  **Fase 4: Catálogo y Compartido en WhatsApp:**
    *   Se habilita la opción de compartir el catálogo pre-filtrado de la campaña a través de WhatsApp.
6.  **Medición y Cierre (Jaime):**
    *   Primera campaña de catálogo que contará con instrumentación completa para medir visualizaciones, clics en WhatsApp y conversión de compra directa.

---

## 🧭 Alineación de Iniciativas Célula Suppliers (S2 2026)

| Proyecto / Iniciativa | Territorio Principal | Nivel de Madurez | Etapa Cadena de Valor | Lente Cognitivo / Métrica |
| :--- | :--- | :--- | :--- | :--- |
| **1. Escucha de Canales (Espía)** | Logística / Plataforma | A. Iniciando / B. Consolidando | 5. Posventa / Soporte | Reptiliano (Detección fricción cualitativa) |
| **2. Campañas Catálogo (Cyber)** | E-commerce (Margen) | A. Iniciando | 2. Producto (Catálogo) | Límbico (Activación stock inactivo) |
| **3. Caza Productos Semántico** | E-commerce (Demanda) | A. Iniciando | 2. Producto (Descubrimiento) | Reptiliano (Conversión catálogo) |
| **4. Panel de Indicadores [IND-001]** | Tecnología (Datos) | B. Consolidando | 6. Fidelización / Negocio | Neocortical (Medición de salud de bodega) |
| **5. Descuentos en Catálogo [DESC-001]** | E-commerce | A. Iniciando | 2. Producto | Reptiliano (Claridad visual antes/ahora) |
