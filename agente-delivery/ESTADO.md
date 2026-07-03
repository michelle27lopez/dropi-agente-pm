# 🧭 ESTADO ACTUAL — handoff entre chats

> El "save game" del sistema. Un chat nuevo lee esto + `README.md` antes de actuar.
> Se actualiza al **cerrar** cada chat (o cuando Michelle diga "cerremos / guarda el estado").
> Aquí va lo VIVO (dónde vamos, decisiones recientes, próximo paso, bloqueos). Lo estable
> vive en `canon/`, `context/approved` (Supabase) y `Documentos/`.

**Última actualización:** 2026-07-02

## Dónde vamos (resumen de 30 seg)
- **NEG-002** (Negociaciones Directas Proveedor–Dropshipper) es el proyecto principal de Michelle,
  célula Supplier Success. Kick-off hecho (01/07/2026), en fase **Definición/Wireframes**.
  Diseño del modal (Paso 1) cerrado excepto el trigger de búsqueda (Enter / botón / ambos) — **bloqueante**.
- **NEG-001** (Negociaciones Proveedor–Líder de Comunidad) está **live** desde 27/05/2026,
  fue retirado ~1 semana por riesgo legal (faltaba T&Cs) y reactivado 05/06/2026. Michelle no es la
  diseñadora (fue Aleja); Jaime Guevara es PM de ambos proyectos.

## Próximo paso
- Resolver con Michelle el trigger de búsqueda del Paso 1 de NEG-002 (bloqueante para cerrar el modal).
- Completar la sección Definición del doc E2E de NEG-002.
- Confirmar stakeholder principal de NEG-002 (hoy "[por confirmar]" en el kickoff doc).

## Pendientes / bloqueos abiertos
- NEG-002: alinear con Legal sobre T&Cs antes de desarrollo.
- NEG-002: solicitud de Datamart — agregar `community_dropshippers_count`, resolver snapshot vs. histórico.
- NEG-002: bug — cuenta `uxdropi@gmail.com` no ve el módulo desde el 16/06 (verificar vigencia).
- NEG-001: verificar si el bug de visibilidad del módulo (redirige a Home) sigue abierto — el último
  reporte conocido es un snapshot de ~05/06, no hay doc dedicado NEG-001 (fuente: `hub/scratch/`).

## Decisiones recientes (no reabrir sin validación de Michelle)
- NEG-002 reutiliza los patrones de NEG-001 en vez de diseñar desde cero.
- NEG-002: cardinalidad 1 a 1, elegibilidad = cualquier dropshipper, identificador = correo electrónico.
- NEG-002: equidad entre dropshippers queda fuera de alcance.

## Protocolo de continuidad entre chats
- **Al iniciar un chat** (o si Michelle dice "continuemos"): leer este archivo + `README.md` +
  el archivo del proyecto relevante (`Documentos/NEG-00X-*`, `context/approved` en Supabase) antes
  de actuar. Resumir en 2-3 líneas dónde vamos.
- **Al cerrar un chat** (Michelle dice "cerremos / guarda el estado"): actualizar este archivo
  (dónde vamos, próximo paso, decisiones, bloqueos) — no dejar nada solo en el chat.
- **Archivar, no acumular:** cuando la sección "Dónde vamos" quede desactualizada, mover el detalle
  viejo a un changelog aparte (`ESTADO-archivo-<trimestre>.md`) en vez de dejar crecer este archivo
  sin límite — mantenerlo corto y legible en cada apertura de chat.
