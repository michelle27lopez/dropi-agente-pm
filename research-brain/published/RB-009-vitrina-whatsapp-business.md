# Documento de Research: Fricción Técnica en Ecosistema Meta Commerce API (RB-009)

**Iniciativa Relacionada:** Vitrina WhatsApp Business (`PROD-WPP-BIZ`)
**Segmento:** Dropshippers (Todos los niveles)
**Fecha:** 2026-08-27
**Estado:** Publicado
**Confianza:** Alta

## 1. Problema y Contexto Conductual

Muchos sellers desean vender a través de WhatsApp integrando sus catálogos, pero se enfrentan a una pared técnica al intentar configurar Meta Commerce Manager y la API de WhatsApp Business. 

### Diagnóstico B=MAP y Procesamiento Dual
- **Ability (A):** Nula. La fricción técnica para un usuario no desarrollador es un "muro". Configurar tokens, Business Portfolios y sincronizar catálogos exige un esfuerzo cognitivo intenso (Sistema 2) para el cual el seller no está capacitado ni motivado.
- **Motivación (M):** Alta (quieren el canal de ventas), pero insuficiente para superar el muro técnico.

## 2. Hallazgos del Benchmark (Exa Deep Research)

La integración con Meta Commerce Manager no es "plug-and-play" y presenta fricciones operativas severas:
1. **La falacia de la visibilidad:** Crear un catálogo en Meta Commerce Manager no lo hace visible en WhatsApp; requiere una vinculación manual explícita con la cuenta WABA.
2. **Retrasos de Verificación:** La verificación de negocios de Meta es el cuello de botella número 1, causando rechazos por diferencias menores en documentos legales.
3. **Complejidad de Infraestructura:** El manejo de webhooks, templates de mensajes y límites de tasa (rate limiting) requiere middleware o un BSP (Business Solution Provider) intermedio.

## 3. Intervención Conductual Propuesta

Para que `PROD-WPP-BIZ` sea exitoso, Dropi debe actuar como el "BSP invisible", absorbiendo toda la carga técnica.

- **Fluidez (Sistema 1):** El flujo de conexión en Dropi debe ser de "1 Clic" (Meta Embedded Signup), ocultando la creación de webhooks y el ruteo de IDs.
- **Gestión de Expectativas (Ambigüedad):** Dado que Meta puede tardar en verificar, Dropi debe mostrar estados claros ("Meta está revisando tus documentos, suele tomar 24h") para mitigar el sesgo de ambigüedad y evitar que el usuario asuma que algo falló.
- **Scaffolding:** Dropi sincroniza el inventario nativo automáticamente hacia el catálogo de Meta Commerce Manager, evitando que el usuario deba mantener dos fuentes de verdad.

## 4. Supuesto Más Riesgoso (RAT)
- **Supuesto:** "Si nosotros abstraemos la complejidad de la API de Meta, el seller adoptará el canal de WhatsApp y aumentará sus órdenes orgánicas".
- **Falsificación:** Un flujo Wizard of Oz donde conectamos manualmente el catálogo de un seller; si a pesar de tenerlo, no logra cerrar ventas en WhatsApp por falta de tráfico, el cuello de botella no era solo tecnológico, sino de adquisición de clientes.
