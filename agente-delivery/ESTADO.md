# 🧭 ESTADO ACTUAL — handoff entre chats

> El "save game" del sistema. Un chat nuevo lee esto + `README.md` antes de actuar.
> Se actualiza al **cerrar** cada chat (o cuando se sincroniza nueva memoria). 
> Aquí va lo VIVO (dónde vamos, decisiones recientes, próximo paso, bloqueos). Lo estable vive en `canon/`, `context/approved` (Supabase) y `Documentos/`.

**Última actualización:** 2026-08-28 (vía Granola AI Sync)

## Dónde vamos (resumen de 30 seg)
- **Expowinners (Product Lab):** Tendremos una "isla" propia en la app del evento al mismo nivel que Academy. Se probarán 3 flujos experimentales: Copiloto IA (Gali) con catálogo cerrado de 25 productos, Escanear to Winner (OpenAI score), y Únete a Pulso.
- **Gali Copilot:** Foco total en activación de dropshippers huérfanos (40% de la base, 99% inactivos). Funcionará como un mini-ecommerce (vitrina) embebido en Dropi para usuarios inexpertos.
- **PULSO:** El experimento manual de negociaciones (lanzado 21 ago) con Tula Store y 3 proveedores top fue un éxito, pero validó que el flujo manual es insostenible operativamente. **Próximo paso:** Construir aplicativo web para autogestión de proveedores.
- **Rearquitectura Dropi:** Lanzamiento fijo para 12 de septiembre (14 bugs UI críticos mapeados). Producto se reserva el "Go/No-Go". Se trabaja en campaña de ciberseguridad y mitigación de fricción para usuarios de bodega.
- **Darwin (Roadmap):** Migrando el tracking de Excel (Laura Torres) a los *Delivery Projects* en Darwin para comprometer tiempos de TI.

## Próximo paso
- **Expowinners:** Alinear UI del "Product Lab" web con el ADN de la app móvil del evento (Carlos y Luisa). Validar con Diana Sierra el paso del `ID` en la URL para trackear usuarios sin comprometer seguridad.
- **Gali:** Definir los diseños preconfigurados y el catálogo de 25 productos para "primera venta".
- **Rearquitectura:** Identificar usuarios operativos clave (bodega) para enviarles tutoriales de Intercom desde sandbox antes del lanzamiento.

## Pendientes / bloqueos abiertos
- **Page Pilot:** Lanzamiento frenado. José Giraldo (TI) está listo, pero marketing (Maho) no ha entregado el video de onboarding (bloqueante único).
- **Logística / Novedades:** El 30% de las novedades fallidas son por dirección incompleta, y el flujo no tiene un campo para corregirla. Juan reportará hotfix urgente.
- **Marketing Bandwidth:** La campaña de expectativa de Rearquitectura depende de Majo, quien está saturada con Expowinners.

## Decisiones recientes (no reabrir)
- **Gali (Catálogo):** Se descartó conectar el flujo de "primera venta" de Gali vía APIs complejas o MCP. Se usará un catálogo hardcodeado de 25 productos ganadores para evitar lentitud y problemas técnicos en el workshop.
- **Darwin Roadmap:** El hub de Darwin solo expondrá fechas de *Delivery* para tecnología. Todo lo de *Discovery/POCs* se maneja en los espacios privados para no generar ruido con el C-level.

## Protocolo de continuidad entre chats
- **Al iniciar un chat:** Leer este archivo + `README.md` antes de actuar.
- **Al cerrar un chat:** Actualizar este archivo (dónde vamos, próximo paso, decisiones, bloqueos) — no dejar nada solo en la memoria del chat.
- **Archivar, no acumular:** Cuando la sección "Dónde vamos" quede desactualizada, mover el detalle a un changelog aparte (`ESTADO-archivo-<trimestre>.md`).
