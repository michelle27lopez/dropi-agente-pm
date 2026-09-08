# 🧭 ESTADO ACTUAL — handoff entre chats (Archivo Q3 2026)

**Última actualización:** 2026-07-24

## Dónde vamos (resumen de 30 seg)
- **NEG-002** (Negociaciones Directas Proveedor–Dropshipper) es el proyecto principal de Michelle, célula Supplier Success. Kick-off hecho (01/07/2026), en fase **Definición/Wireframes**. Diseño del modal (Paso 1) cerrado excepto el trigger de búsqueda (Enter / botón / ambos) — **bloqueante**.
- **NEG-001** (Negociaciones Proveedor–Líder de Comunidad) está **live** desde 27/05/2026, fue retirado ~1 semana por riesgo legal (faltaba T&Cs) y reactivado 05/06/2026. Michelle no es la diseñadora (fue Aleja); Jaime Guevara es PM de ambos proyectos.
- **PULSO** (Dropi Pulso — repo separado `jaimeguevara-dropi/dropi-pulso`, motor de matching stock quieto ↔ dropshippers) ya es un **MVP construido y en piloto interno** — no pasó por el proceso de documentación E2E en su momento. El 24/07/2026 se reconstruyeron retroactivamente los 5 entregables (`Documentos/PULSO-*.md`) leyendo código/esquema, dejando explícitos los campos que solo Producto puede confirmar (`[POR CONFIRMAR]`). Pendiente: que Jaime/Natalia (u otro PM/PD real del proyecto) validen esos campos.

## Próximo paso
- Resolver con Michelle el trigger de búsqueda del Paso 1 de NEG-002 (bloqueante para cerrar el modal).
- Completar la sección Definición del doc E2E de NEG-002.
- Confirmar stakeholder principal de NEG-002 (hoy "[por confirmar]" en el kickoff doc).
- PULSO: validar con Jaime Guevara / Natalia Cuéllar los campos `[POR CONFIRMAR]` en los 5 documentos nuevos (Owner/PM, PD, stakeholder, OKR/KR, fecha de lanzamiento, país/target size, definición de "campaña reactivada").

## Pendientes / bloqueos abiertos
- NEG-002: alinear con Legal sobre T&Cs antes de desarrollo.
- NEG-002: solicitud de Datamart — agregar `community_dropshippers_count`, resolver snapshot vs. histórico.
- NEG-002: bug — cuenta `uxdropi@gmail.com` no ve el módulo desde el 16/06 (verificar vigencia).
- NEG-001: verificar si el bug de visibilidad del módulo (redirige a Home) sigue abierto — el último reporte conocido es un snapshot de ~05/06, no hay doc dedicado NEG-001 (fuente: `hub/scratch/`).
- PULSO: definición de "campaña reactivada" pendiente con Natalia Cuéllar (bloquea esa métrica en `/metricas`). Canal real de envío (Evolution API) y "dispatcher" de `notifications` no existen todavía — bloquea el cierre real del ciclo de activación.

## Decisiones recientes (no reabrir sin validación de Michelle)
- NEG-002 reutiliza los patrones de NEG-001 en vez de diseñar desde cero.
- NEG-002: cardinalidad 1 a 1, elegibilidad = cualquier dropshipper, identificador = correo electrónico.
- NEG-002: equidad entre dropshippers queda fuera de alcance.
