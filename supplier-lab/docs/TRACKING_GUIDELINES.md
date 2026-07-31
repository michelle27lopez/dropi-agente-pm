# Directrices de Medición (PostHog)

Este documento funciona como **Regla Estricta (Skill)** para el desarrollo de nuevas features en el proyecto **Supplier Lab**. 

> [!IMPORTANT]
> **Ninguna pantalla o flujo se da por terminado si no tiene implementada la trazabilidad de PostHog.**

## Principios de Tracking

1. **Todo click importante se mide:** Botones de acción principal (CTAs), envíos de formulario, y botones de navegación clave deben tener un evento asociado.
2. **Nomenclatura clara:** Los eventos deben nombrarse con la estructura `[entidad]_[acción]`.
   - Correcto: `product_created`, `onboarding_started`, `first_sale_simulated`.
   - Incorrecto: `click_boton`, `submit_form`.
3. **Propiedades del evento (Contexto):** Todo evento debe incluir el estado actual del supplier. Como mínimo, pasar el `supplier_id` (aunque sea mockeado) y cualquier dato relevante del paso actual.

## Cómo Implementar en Código

Siempre que se cree un nuevo componente interactivo, debemos importar nuestro helper de medición (ej. `useTrackEvent` o `trackEvent` genérico) y activarlo.

### Ejemplo de componente:
```tsx
import { trackEvent } from '@/lib/analytics';

export function CreateProductButton() {
  const handleClick = () => {
    trackEvent('product_creation_started', {
      source: 'dashboard_empty_state'
    });
    // Lógica para abrir modal o ir a la ruta...
  };

  return <button onClick={handleClick}>Crear Producto</button>;
}
```

## Embudos Clave a Medir (Para PostHog)

1. **TTFV (Time to First Value):**
   - Evento 1: `supplier_registered`
   - Evento 2: `store_configured`
   - Evento 3: `product_created`
2. **Abandono de Onboarding:**
   - Evento 1: `onboarding_step_viewed` (propiedad: step=1)
   - Evento 2: `onboarding_step_completed` (propiedad: step=1)

## Check de Validación (Pre-commit)
Antes de guardar el código de una nueva funcionalidad, el sistema (o el desarrollador) debe responder:
- [ ] ¿Esta feature dispara al menos 1 evento de uso?
- [ ] ¿El evento provee contexto en sus propiedades?
- [ ] ¿Podremos construir un funnel en PostHog con este evento?
