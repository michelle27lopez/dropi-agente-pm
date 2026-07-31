# Experimento 01: Pestañas de Navegación Libre vs. Wizard Secuencial con Bloqueo

Este documento define la estructura, hipótesis y métricas del primer experimento a correr dentro del **Supplier Journey Lab**.

## 1. Contexto y Problema

Actualmente, el flujo de creación de producto (Variante A) permite al supplier navegar libremente entre pestañas (General, Stock, Imágenes, Garantías). Las validaciones fuertes (ej. stock > 100, > 3 imágenes) se evalúan únicamente cuando el usuario hace clic en "Guardar" al final del proceso. 

**Riesgo detectado (Fricción):** Un supplier novato puede omitir pasos clave, llegar al final, y recibir múltiples errores simultáneos que lo abrumen, incrementando la probabilidad de abandono (Drop-off).

## 2. Hipótesis del Experimento

> **Si** reemplazamos la navegación libre por pestañas con un **Wizard secuencial con bloqueo activo** (donde no se puede avanzar al siguiente paso sin completar las reglas duras del actual), **entonces** reduciremos la tasa de errores al momento de intentar guardar el producto y disminuiremos la carga cognitiva, resultando en un aumento en la tasa de finalización del hito `product_saved`.

## 3. Definición de Variantes

### Variante A (Control): Pestañas de Navegación Libre
- **Diseño:** Menú lateral con pestañas navegables en cualquier orden.
- **Interacción:** El supplier puede saltar de "General" a "Imágenes" sin llenar nada.
- **Validación:** Pasiva. El sistema evalúa todo al presionar "Guardar". Muestra un modal de errores agrupados si algo falla.

### Variante B (Test): Wizard Secuencial con Bloqueo
- **Diseño:** Pasos numerados (1. General -> 2. Stock -> 3. Imágenes -> 4. Garantías).
- **Interacción:** Navegación forzada de izquierda a derecha. Botones de "Siguiente" y "Atrás".
- **Validación:** Activa por paso. El botón "Siguiente" está deshabilitado o arroja un error in-line si las condiciones de ese paso no se cumplen (ej. no deja pasar de "Stock" si no hay 100 unidades).

## 4. Perfiles de Prueba (Testers Sintéticos)

Para este experimento usaremos dos perfiles diametralmente opuestos para maximizar el contraste de los resultados:

1. **El Novato Offline (Baja madurez digital, alto riesgo de abandono):**
   - Tiende a ignorar campos técnicos.
   - Si recibe un error masivo al final, su respuesta simulada es el abandono.
   - *Comportamiento esperado:* Fracasará en la Variante A; se beneficiará de las micro-validaciones de la Variante B.

2. **El Experto Impaciente (Alta madurez digital, busca velocidad):**
   - Conoce los campos de memoria. Sabe qué es obligatorio.
   - Prefiere saltar directamente a los campos clave.
   - *Comportamiento esperado:* Completará la Variante A muy rápido. Podría sentir que la Variante B (Wizard) es más lenta o restrictiva.

## 5. Métricas de Éxito (Cómo evaluar la efectividad)

El motor de evaluación medirá y comparará las siguientes métricas entre ambas variantes:

### Métricas Principales (Primary)
- **Tasa de Finalización (`product_saved`):** % de simulaciones que llegan exitosamente al final del flujo.
- **Tasa de Errores de Guardado (`product_save_validation_failed`):** Cantidad de veces que el usuario intenta guardar y es rechazado por el sistema.

### Métricas Secundarias (Secondary)
- **Tiempo Simulado (Fricción Cognitiva):** Estimación del esfuerzo o tiempo que el perfil sintético reporta tomarle completar el flujo.
- **Puntos de Abandono (Drop-off points):** En qué campo o paso específico el tester decidió rendirse.

## 6. Motores de Simulación a Comparar

Tal como se acordó, este experimento correrá bajo dos motores de simulación para comparar su robustez:

1. **Motor Determinista (Reglas Duras):** Un script con un árbol de decisión pre-programado ("Si el tester es 'Novato', entonces falla al llenar Imágenes si no se le obliga"). Rápido, predecible.
2. **Motor LLM (IA Generativa):** El estado de la UI se le pasa a un modelo de IA parametrizado con el prompt del perfil, y la IA decide autónomamente si hace clic, avanza o abandona, justificando su acción. Ideal para descubrir fricciones no contempladas en las reglas duras.

## 7. Criterio de Decisión (Actionable Outcome)
- Si la Variante B incrementa la finalización del "Novato" en >30% sin aumentar significativamente el abandono por frustración del "Experto", **se declarará ganadora** y pasará al backlog para prueba con usuarios reales.
