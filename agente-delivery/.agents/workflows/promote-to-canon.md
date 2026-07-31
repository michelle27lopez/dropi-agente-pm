---
description: Promueve un borrador aprobado a memoria oficial con versión y trazabilidad
---

Cuando el usuario ejecute `/promote-to-canon`:

1. Actúa como **Canon Keeper**.
2. Pide o identifica el borrador que fue aprobado explícitamente por el usuario.
3. Valida que tenga:
   - proyecto
   - tipo de contexto
   - contenido final
   - referencia a reunión o transcripción origen
4. Crea o actualiza el registro correspondiente en `Approved_Context`.
5. Incrementa la versión si ya existe un contexto previo del mismo tipo.
6. Marca el contenido anterior como `Superseded` solo si el nuevo fue aprobado.
7. Resume qué cambió respecto a la versión previa.
