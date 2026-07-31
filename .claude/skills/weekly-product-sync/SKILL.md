---
name: weekly-product-sync
description: Use this skill when Laura wants to synthesize the "Weekly Product" meeting (with CEO/CPO) into a per-célula visual artifact. Triggered by "sintetiza la weekly de producto", "resume la weekly de esta semana", "arma el artifact de la reunión semanal de producto", "sube la weekly a un artifact".
---

# Weekly Product Sync

## Objetivo

Convertir las notas de la Weekly Product (transcripción/notas de Gemini + chat en vivo de la reunión) en un artifact HTML organizado por célula, listo para distribuir a cada equipo. Formato validado por Laura el 23-jul-2026 — ver `template.html` en esta misma carpeta.

## Cuándo usarlo

- "sintetiza la weekly de producto"
- "resume la weekly de esta semana"
- "arma el artifact de la reunión semanal de producto"
- Laura pega dos bloques de texto: notas estructuradas por célula (con timestamps) + comentarios de chat en vivo de la reunión

## Insumos esperados

1. **Notas estructuradas** — normalmente ya vienen organizadas por célula o iniciativa (Transversal/Darwin, Supplier Success, Growth/Comercial, Brands, Seller, Backoffice, Logística, Feature Strategy/Experience — pero la lista real de células puede variar semana a semana), con timestamps entre paréntesis referenciando el minuto de la transcripción.
2. **Chat en vivo de la reunión** — mensajes sueltos, a veces sin estructura clara, con acciones/aclaraciones puntuales que hay que cruzar con el tema correspondiente de las notas estructuradas.

Si falta alguno de los dos insumos, pregunta explícitamente antes de sintetizar — la calidad del cruce depende de tener ambas fuentes.

## Instrucciones

### Paso 1 — Organizar por célula

Agrupa cada punto de las notas estructuradas bajo su célula. Si un tema es transversal (no pertenece a una sola célula — ej. iniciativas de Growth/Comercial, infraestructura de Darwin), no lo fuerces dentro de una célula: documéntalo aparte, tal como lo haya tratado la fuente original.

### Paso 2 — Cruzar el chat con las notas

Por cada comentario del chat, ubica a qué punto de las notas estructuradas corresponde y agrégalo ahí como una adición marcada — con una etiqueta visual ("Del chat"), nunca mezclado de forma indistinguible con la transcripción. Si un comentario no tiene contexto suficiente para ubicarlo con confianza, no lo fuerces: va a la sección de pendientes por aclarar (Paso 3).

### Paso 3 — Marcar lo ambiguo, nunca forzarlo

Cualquier dato que no cuadre (una métrica que no coincide con otra ya mencionada, una acción con responsable ambiguo, un término sin contexto suficiente) va en una sección final **"Pendientes por aclarar"** — nunca se adivina ni se fuerza a encajar en una categoría existente. Regla dura: prefiere "no está claro, confirmar" a una inferencia incorrecta.

### Paso 4 — Resumen ejecutivo

Antes del detalle por célula, escribe 4–6 bullets con lo más importante de toda la reunión, pensado para alguien que solo tiene 2 minutos para leer.

### Paso 5 — Construir el artifact

Copia `template.html` de esta carpeta como punto de partida (masthead con ficha de metadatos, nav sticky con un pill por célula, resumen ejecutivo destacado, tarjetas por entrada con chip "Del chat" cuando aplique, callouts ámbar para pendientes por aclarar). No rediseñes desde cero cada semana — el formato visual ya está validado; lo único que cambia es el contenido y la lista de secciones del nav (ajústala a las células que realmente aparezcan esa semana, no siempre son las mismas).

### Paso 6 — Publicar

Publica con la herramienta Artifact. Usa el mismo favicon (🧭) que las weeklies anteriores para mantener continuidad visual — mismo emoji siempre, cambia solo en un pivote real de tema.

## Notas

- Los entregables para "el negocio" o para distribuir entre células **siempre** van como artifact diseñado, nunca como markdown plano — Laura ya rechazó una versión sin diseñar una vez.
- El "doc de necesidades por célula" (Google Docs) que a veces se menciona en la agenda de la Weekly es un documento aparte — no lo confundas con esta síntesis de reunión ni asumas que están sincronizados.
