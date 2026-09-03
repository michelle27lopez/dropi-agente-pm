import type { CellBoardEntry } from "../types";

// Espejo del contenido que estaba en hub/supabase/053_darwin_celula_brands_cellboard_27ago2026.sql
// Migrado al repo el 2026-09-03. HTML con diseño: agente-delivery/Documentos/cell-board-27ago2026.html
export const entry: CellBoardEntry = {
  weekDate: "2026-08-27",
  title: "Cell Board 27-ago-2026 · Resumen por embudo",
  content: `## Contexto general

North Star: seguimos ~52% por debajo del objetivo de órdenes de marcas.

El dato que reordena las prioridades: en marcas, las órdenes las mueven los recurrentes y las reactivaciones, no las activaciones nuevas ni las viejas. Esto rompe el patrón típico del dropshipper y obliga a bajar intensidad en adquisición para subirla en retención y crecimiento de la base actual.

Señales de alerta: retención cayó de 84% a 83% entre junio y julio; abandono de portafolio subió a 15%.

---
## 1 · Adquisición — Captar marcas

Qué se está trabajando:
— Contenido orgánico bajo estrategia transmedia, con parrilla aprobada para LinkedIn, YouTube, Facebook, Instagram y TikTok. En producción.
— Pauta paga en LinkedIn y Meta: presupuesto aprobado, CRM conectado, formularios y lookalikes listos (base de marcas + base extraída de Shopify). Lanzamiento previsto la próxima semana.
— Contacto 1:1 a 17 marcas priorizadas: comercial ya analizó 4 a fondo; 3 de ellas ya fueron abordadas antes y no es el momento.

Bloqueos:
🔴 No hay acceso a landings por la incidencia de dominios de Dropi → se lanza con formulario nativo, con impacto en calidad de captura.
🔴 Sin canal de contacto con decisores en las 17 marcas: Instagram no lo manejan quienes deciden, solo 3 tienen LinkedIn (sin empleados vinculados) y los correos son genéricos.

Accionables:
— @Vanessa Garay / @Carol — aprobar pautas de LinkedIn y Facebook y compartir la parrilla de contenidos con la célula.
— @Vanessa Garay / @Carol — entregar informe formal de las 17 marcas con feedback y recomendación de por dónde arrancar (grandes, medianos o pequeños).
— @Francisco Velandia — agendar la revisión de los 17 leads a partir del martes.
— @Enrique López — lanzar pautas una vez tenga aprobación y contenidos.

---
## 2 · Puente Adquisición → Activación — Carriles de comunicación

Qué se está trabajando:
— 4 carriles segmentados por volumen de ventas, con flujos de comunicación diferenciados.
— Carril de +300 órdenes: contacto telefónico inmediato por comercial. Leads de +50 pedidos: sesión con el equipo.
— Copies construidos, pendientes de aprobación comercial para pasar a implementación técnica.

Bloqueos:
🟡 Falta definir cómo se hace seguimiento a los leads calificados que deben ser atendidos primero por un humano, sin duplicar con la automatización.

Accionables:
— @Enrique López — presentar flujo de los 4 carriles y copies al equipo comercial.
— @Enrique López — proponer mecanismo de seguimiento cuando no se cumpla el SLA de contacto (propuesta: 2 horas).

---
## 3 · Activación — Que la marca llegue a su primera orden

Qué se está trabajando:
— Onboarding en producción desde el 25 de julio: ~1.100 usuarios en 33 días, ~40 activados.
— Plan de recovery: mensajes automatizados por WhatsApp vía CRM, disparados si el usuario no avanza al siguiente paso en 24 horas. Reminder + congrats.

Hallazgos:
— Fuga fuerte en el paso 1: muchos inician onboarding y nunca crean bodega; son más los que no la crean que los que sí.
— La métrica de activación está subestimada: hoy solo mide orden manual, no orden por integración. Hay 43 usuarios que crearon integración y podrían ya estar activos sin contabilizarse.
— El plan de recovery se solapa con el flujo comunicacional de Growth → se acordó empalmar ambos en uno solo.

Bloqueos:
🔴 Soporte a integraciones sin dueño ni ruta — el bloqueante más crítico de la sesión. Las integraciones son inestables, la persona del área ya no está, y comercial depende de que alguien de TI se desocupe. El canal formal responde en 48 horas, inviable para una marca. Caso Natilondon: tres reuniones para que funcionara.
🟡 Traslape de timing entre el correo de bienvenida (al registro) y el mensaje de WhatsApp (al llenar formulario en UserPilot).

Accionables:
— @Juan Sebastián Maldonado — mapear integraciones con Laura, evaluar incluir a Marlon, y traer la ruta clara de soporte (sesión mañana o lunes).
— @Vanessa Garay — consultar si su equipo tiene documentación de integraciones más allá de Dropi Academy.
— @Jose Pineda Pitre + @Juan Sebastián Maldonado — cubrir los dolores de integración desde el Help Center antes de su lanzamiento.
— @Francisco Velandia + Data — validar cuántos de los 43 con integración ya generaron orden, para sumarlos a activación.
— @Francisco Velandia — compartir plan de recovery a @Enrique López y producir las piezas visuales/video.
— Definición fina de timings y disparadores: sale de esta mesa, va a un espacio técnico aparte con @Laura Torres.

---
## 4 · Retención — Sostener y crecer a los que ya están

Qué se está trabajando:
— Foco en las ~65-70 marcas que concentran el 60-64% de las órdenes movilizadas (base actual: 293K órdenes).
— Producto ejecuta con @Laura Torres una encuesta para posibles entrevistas.
— Comercial hoy hace: mantenimiento preventivo logístico (gestión anticipada de guías sin movimiento), comité con Operaciones para ANS, y escalonamiento de descuentos/metas trimestrales con cashback dirigido.
— Propuesta de @Enrique López: control de mando operativo (dashboard) alimentado con data de detalle de órdenes, para alertar sobre marcas en decrecimiento antes de perderlas.

Hallazgos:
— Cobertura VIP incompleta: 17 marcas en "escalando" y 13 en "preescalando" no están en ningún grupo VIP, incluyendo marcas de 700-1.000 órdenes. Salen del radar.
— Hay al menos una marca en riesgo alto: venía en ~1.421 órdenes y en agosto no registra actividad.
— El criterio del grupo VIP comercial no está segmentado por volumen.
— El mantenimiento preventivo se opera por WhatsApp y no tiene medición.

Bloqueos:
🔴 Los clientes se atienden VIP hacia afuera, pero las áreas internas no responden con carácter VIP (integraciones, devoluciones injustificadas). Eso anula el efecto de la estrategia de retención.

Accionables:
— @Francisco Velandia — agendar el espacio de trabajo de retención con @Enrique López, @Vanessa Garay y comercial.
— @Katerine Pencue + @Miguel Ángel Gutiérrez + @Enrique López — definir qué data se requiere para construir el embudo de retención automatizado.
— @Vanessa Garay — documentar las prácticas de mantenimiento preventivo para llevarlas a nivel de embudo.
— @Katerine Pencue — revisar la marca sin actividad en agosto y las 30 marcas fuera de gestión VIP.

---
## Transversal — Tablero y medición

— Tablero en ajuste, pendiente el go final de @Miguel Ángel Gutiérrez.
— Se cerró la duda de marcas blancas: las 3-4 que suman son corporativas (Multitrack, Comeva), administradas por comercial y con ID asignado. El criterio es correcto.

Accionables:
— @Miguel Ángel Gutiérrez — agregar tooltip con cantidad de marcas por categoría de activación, incorporar el criterio de marcas blancas y dar el go.
— @Katerine Pencue — revisar con Data el comportamiento del filtro por ID.

---
## Lectura ejecutiva

El embudo de adquisición y activación ya está construido y ejecutándose. Los dos puntos que hoy destruyen valor no están en el diseño del embudo sino en la operación: integraciones sin ruta de soporte y cobertura VIP incompleta en marcas de alto volumen. Ambos son de proceso, no de producto, y ambos afectan directamente los indicadores que estamos midiendo.`,
};
