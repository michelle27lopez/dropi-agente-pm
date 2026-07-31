# Dropshipper Lab — Reglas de trabajo

## Qué es este proyecto

Clon fiel de `app.dropi.co` **desde la perspectiva del dropshipper** (usuario final que vende en Dropi).
Gemelo del supplier-lab pero para la otra audiencia.

## Regla fundamental — NUNCA violar

> Al agregar una variante experimental, **nunca modificar los flujos base**.
> La Variante A siempre queda intacta como referencia.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 + shadcn/ui
- Token de color principal: `--dropi: #F77F00` → clases `bg-dropi`, `text-dropi`, `border-dropi`

## Estructura de colores Dropi

| Token CSS          | Valor     | Uso                            |
|--------------------|-----------|--------------------------------|
| `--dropi`          | `#F77F00` | Botones primarios, iconos, texto activo |
| `--dropi-light`    | `#FFF3E0` | Background hover activo        |
| `--dropi-muted`    | `#FFF8F0` | Background cards sutiles       |

Clases Tailwind: `bg-dropi`, `text-dropi`, `border-dropi`, `bg-dropi-light`, `bg-dropi-muted`

## Flujos base implementados

### Home / Inicio (`/inicio`)
- **Variante A (Base)**: Clon fiel de `app.dropi.co/dashboard/home`
  - Warning banner de completar datos
  - Promo card Mega Live + Announcement Dropi Cup
  - Sección Nueva Actualización (Huella Digital)
  - Proveedores destacados de la semana
  - FABs flotantes (Fingerprint, Wifi, Chat)
  - Archivo: `src/app/inicio/page.tsx`

## Cómo agregar un nuevo flujo base

1. Jaime pasa pantallazos reales uno por uno
2. Replicar **fielmente** sin inventar ni anticipar
3. Agregar la ruta en el Sidebar (`src/components/layout/Sidebar.tsx`)
4. Solo cuando esté aprobado, crear variantes B/C

## Componentes reutilizables de UI

- `src/components/layout/Sidebar.tsx` — navegación lateral completa
- `src/components/layout/Topbar.tsx` — barra superior con membership, wallet, avatar, toggle BETA
