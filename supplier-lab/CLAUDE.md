@AGENTS.md

# Supplier Lab — Reglas de trabajo

## Qué es este proyecto

El Supplier Lab es un **clon fiel de app.dropi.co** construido para dos propósitos:

1. **Clon base**: Replica los flujos reales de Dropi tal como existen en producción. Cada flujo base es la "Variante A (Base actual)" de ese flujo.
2. **Laboratorio de experimentos**: Sobre esa base fiel se construyen variantes experimentales (B, C...) para testear mejoras de UX con perfiles sintéticos, antes de desarrollar en producción.

## Regla fundamental — NUNCA violar

> Al agregar una variante experimental, **nunca modificar ni mezclar los flujos base**. La Variante A siempre queda intacta como referencia de comparación.

## Flujos base implementados

### Onboarding / Creación de producto simple
- **Variante A (Base)**: `ProductCreateForm` — pestañas libres (General, Stock, Imágenes, Recursos Adicionales, Productos privados, Garantías). Navegación libre, todos los errores al guardar.
  - Archivo: `src/app/dashboard/productos/page.tsx`
- **Variante B**: `ProductCreateWizard` — wizard secuencial 4 pasos, validación uno a uno.
  - Archivo: `src/components/ProductCreateWizard.tsx`
- Entrypoint: `/dashboard/productos` → Agregar → "Nuevo Producto"

### Creación de Combo de Productos *(en construcción)*
- **Variante A (Base)**: Clon fiel del flujo real de Dropi. Pantalla full-screen, sidebar de 8 pasos con navegación libre.
  - Archivo destino: `src/app/dashboard/productos/combo/page.tsx` *(pendiente)*
- Entrypoint: `/dashboard/productos` → Agregar → "Combo de productos"
- El flujo se documenta paso a paso conforme Jaime pasa las pantallas reales.

## Laboratorio (`/dashboard/laboratorio`)
- Simula flujos con perfiles sintéticos (Novato Offline / Experto Impaciente)
- Motor determinista o LLM (gpt-4o-mini)
- Actualmente cubre onboarding de producto simple (Var A vs B)
- Al agregar un flujo base nuevo, también se agrega como variante testeable en el lab

## Cómo construir un nuevo flujo

1. Esperar a que Jaime pase las pantallas reales una por una
2. Replicar fielmente — sin inventar ni anticipar pasos
3. Documentar cada paso en la memoria y en este archivo
4. Solo cuando la base esté completa y aprobada, crear variantes experimentales
