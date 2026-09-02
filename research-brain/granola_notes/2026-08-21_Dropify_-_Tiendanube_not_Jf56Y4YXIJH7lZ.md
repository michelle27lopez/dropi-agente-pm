# Dropify - Tiendanube

- **ID:** `not_Jf56Y4YXIJH7lZ`
- **Fecha:** 2026-08-21T14:03:52.397Z
- **Owner:** Santiago Herrera Acosta (santiago.herrera@dropi.co)
- **URL Granola:** [Ver en Granola](https://notes.granola.ai/d/bc149bb1-0f09-4494-a588-9a297db8c3f3)
- **Asistentes:** Santiago Herrera Acosta, Paola Manjarres, Rodrigo Garcia, Jose Giraldo, Raziel Busto

---

## Resumen de la Reunión
# Error Crítico en el Flujo de Registro

- Error reportado esta semana: usuarios no logran crearse cuenta en Tiendanube
  - No es un caso aislado: múltiples canales de reporte (soporte, WhatsApp, líderes de comunidad)
  - Paola confirmó 10+ tickets en cola adicionales al que compartieron formalmente
  - Respuestas HTTP 500, sin tráfico visible en pedidos
- Desarrollo ya tiene el caso escalado, pero sin fecha ni hallazgos confirmados aún
- Santiago tiene mesa conjunta hoy con los equipos: espera al menos una macroestimación de resolución

# Seis Bugs Documentados en el Flujo

- Seis bugs identificados durante el recorrido paso a paso de la integración
- Evidencias y documentación ya enviadas al equipo de TI y desarrollo
- Confirmaron recepción, pero sin fecha de entrega aún

# Lanzamiento de Release It con Tiendanube (Urgencia)

- Tiendanube lanzará la app Release It (ya existente en Shopify) en aprox. un mes para toda Latinoamérica
- Lanzamiento conjunto: Release It + Tiendanube + Dropi
- Contexto: muchos dropshippers migrarán de Shopify a Tiendanube por costos
  - Comunidades grandes ya esperando el lanzamiento para migrar
- Riesgo: si los bugs persisten al momento del lanzamiento, los merchants nuevos (masivos y activos) verán las fallas y perderán confianza en Dropi y Tiendanube

# Información Compartida y Pendiente

- Paola enviará resumen consolidado de tickets (cantidad total) por el canal, para que Santiago pueda escalar internamente con datos concretos
- Paola buscará piezas gráficas del lanzamiento de Release It para compartir con Santiago
- Santiago solicitó el comunicado del lanzamiento para hacer un análisis de gaps entre la integración Dropi-Shopify y Dropi-Tiendanube

# Próximos Pasos

- **Compartir resumen de tickets acumulados por el canal** (Paola)

  Dato consolidado para que Santiago pueda escalar el error crítico internamente con evidencia.
- **Enviar piezas gráficas y comunicado del lanzamiento de Release It** (Paola)

  Santiago necesita el material para analizar gaps entre la integración con Shopify y con Tiendanube antes del lanzamiento.
- **Compartir macroestimación de resolución del error crítico y los seis bugs** (Santiago)

  Tras la mesa conjunta de hoy: Tiendanube necesita comunicarle a sus merchants que la situación se estabilizó.

---

Chat with meeting transcript: [https://notes.granola.ai/t/097d3df9-d52d-49a8-8cab-11c84c7b2c22](https://notes.granola.ai/t/097d3df9-d52d-49a8-8cab-11c84c7b2c22)

## Transcripción Completa (Palabra por Palabra)
- **[14:03] Paola Manjarrés Domínguez:** Hola, Santiago, ¿cómo estás?
- **[14:03] Yo:** Hola, hola, ¿cómo estás?
- **[14:03] Paola Manjarrés Domínguez:** Todo bien, estaba en orden por acá.
- **[14:03] Yo:** Bien, tú?
- **[14:03] Yo:** Me alegra.
- **[14:04] Yo:** Me alegra, me alegra.
- **[14:04] Yo:** Esperamos que alguien más se nos una o iniciamos nosotros.
- **[14:04] Paola Manjarrés Domínguez:** Aorticals Luma Rodrigo,
- **[14:04] Paola Manjarrés Domínguez:** pero si quieres arranquemos, no hay ningún problema.
- **[14:04] Yo:** De una, de una. Y
- **[14:04] Yo:** Bueno, te cuento, nosotros tenemos varios pendientes,
- **[14:04] Yo:** con tienda nube,
- **[14:04] Yo:** El principal y el más crítico claramente termina siendo el error que que
- **[14:04] Yo:** que nos informaron esta semana, el cual ya tiene el equipo de desarrollo,
- **[14:04] Yo:** sin embargo, todavía estamos a la espera de que nos den
- **[14:04] Yo:** una información más clara para poderles compartir sobre
- **[14:04] Yo:** cuáles han sido los hallazgos del error y y,
- **[14:04] Yo:** cuáles van a ser las acciones a tomar. Es lo que más nos preocupa, pues, claramente, por todo el tema del tráfico.
- **[14:04] Yo:** Desde que no es no no es solamente los dos tickets que nos manda
- **[14:04] Yo:** porque tenemos dos, un uno es el que el que
- **[14:04] Yo:** de hecho, estuvimos hablando por el WhatsApp, pero también recibimos otro desde
- **[14:05] Yo:** área de de soporte de de tiendas OLE.
- **[14:05] Yo:** Pero con las capturas que que igual nos compartieron el
- **[14:05] Yo:** en el en el correo, en el loop principal,
- **[14:05] Yo:** que claramente no solamente son casos aislados, sino que es tema de tráfico.
- **[14:05] Yo:** Que son son quinientos, a las respuestas, quinientos.
- **[14:05] Yo:** Y que no se ve no se ve ningún tipo de tráfico sobre sobre el
- **[14:05] Yo:** sobre los pedidos.
- **[14:05] Yo:** Entonces, esa esa esa tiene
- **[14:05] Yo:** la la prioridad más alta, sin embargo, pues, nada, desarrollo todavía no se ha confirmado.
- **[14:05] Yo:** Aquí estamos presionando internamente para que se
- **[14:05] Yo:** logre resolver lo más pronto posible.
- **[14:05] Paola Manjarrés Domínguez:** Bien, Cindy.
- **[14:05] Yo:** Eso es lo que
- **[14:05] Yo:** la
- **[14:05] Paola Manjarrés Domínguez:** Te te interrumpo dos
- **[14:05] Yo:** Sí, sí.
- **[14:05] Paola Manjarrés Domínguez:** Digamos que el ticket que
- **[14:05] Paola Manjarrés Domínguez:** compartimos es uno, pero
- **[14:05] Paola Manjarrés Domínguez:** tenemos otros diez en cola, es decir, otros diez clientes que han
- **[14:05] Paola Manjarrés Domínguez:** escrito a soporte, solo que, pues, no les reportamos a ustedes diez veces el mismo error,
- **[14:05] Yo:** Claro.
- **[14:05] Paola Manjarrés Domínguez:** sino que vamos sumando los merchants que han tenido el error.
- **[14:06] Paola Manjarrés Domínguez:** ¿No? Entonces, ha sido por el canal de soporte, por WhatsApp, los
- **[14:06] Paola Manjarrés Domínguez:** generadores o afiliados o líderes de comunidad
- **[14:06] Paola Manjarrés Domínguez:** llamen ustedes también nos han reportado que
- **[14:06] Paola Manjarrés Domínguez:** estudiantes no están logrando crearse la cuenta.
- **[14:06] Paola Manjarrés Domínguez:** Está como grave, está como crítico el issue.
- **[14:06] Yo:** Sì, tu tu
- **[14:06] Yo:** podrías
- **[14:06] Yo:** por favor...? No sé si lo que sería más fácil, compartirme
- **[14:06] Yo:** Te agradezco igual no no no enviar cada uno, porque eso también genera desorden, pero
- **[14:06] Paola Manjarrés Domínguez:** Está
- **[14:06] Yo:** sí tienes forma
- **[14:06] Yo:** de igual compartirme cómo nos habíamos recibido quince tickets,
- **[14:06] Yo:** veinte tickets esta semana, la cantidad que tengas, que eso me ayuda igual
- **[14:06] Yo:** aquí para generar como presión internamente.
- **[14:06] Paola Manjarrés Domínguez:** Okay.
- **[14:06] Yo:** Sí, más como un dato de de que se se notificó que no es un no es un issue
- **[14:06] Yo:** aislado de un solo usuario, sino que ya es general.
- **[14:06] Yo:** Pero sí, sí tienes como ese un correo que pueda reforzar ahí yo internamente escalarlo.
- **[14:06] Yo:** Me ayudaría un montón.
- **[14:06] Paola Manjarrés Domínguez:** Listo, de una. Te paso esa información ahoritica por
- **[14:07] Yo:** Durante
- **[14:07] Paola Manjarrés Domínguez:** por el canal.
- **[14:07] Paola Manjarrés Domínguez:** ¿Vale?
- **[14:07] Yo:** gracias. Nosotros estábamos internamente tratando... Disculpa, sí,
- **[14:07] Yo:** canal no ha sido muy atendido esta estas semanas,
- **[14:07] Yo:** Estamos en un proceso de empalme y tenemos, de hecho, un evento grande aquí en Bogotá,
- **[14:07] Yo:** le haya podido retomar.
- **[14:07] Yo:** Superjuiciosos el el la comunicación.
- **[14:07] Yo:** Y tenemos un tema pendiente, justamente, con, pues, con algunos
- **[14:07] Yo:** bugs en el flujo de los que alcanzamos a explorar.
- **[14:07] Yo:** Esos
- **[14:07] Yo:** esos ya están enlistados y están en proceso de
- **[14:07] Yo:** de trabajo por el área de TI y desarrollo. Son seis books, digamos, documentados, que fueron los los recorridos que hicimos. En el paso a paso, y esos seis ya fueron escalados, pues, todas las evidencias y demás para revisar la la documentación. La documentación asociada que tenemos y el por qué pueden estar fallando. Como flujos de aislado. Hola, Rodrigo, ¿cómo estás?
- **[14:08] Yo:** Eso sí sé que ya desarrollé los, tienen en en en
- **[14:08] Yo:** el esquema de trabajo esos, digamos que ya tenemos confirmación de que lo recibieron. Sin embargo,
- **[14:08] Yo:** todavía no tenemos una fecha de entrega
- **[14:08] Yo:** sobre esos seis.
- **[14:08] Yo:** Ya, esa, realmente ese es el estado, que sé que
- **[14:08] Yo:** preliminarmente, es como muy muy muy pobre, muy pago, pero, pues, por ahora no nos han logrado dar más
- **[14:08] Yo:** información. Ya igual el tema está bastante escalado.
- **[14:08] Yo:** ¿Vale? Entonces, esperaría que lo antes posible podamos darles una respuesta más precisa.
- **[14:08] Yo:** Tiempo, sobre todo.
- **[14:08] Paola Manjarrés Domínguez:** De acuerdo, de acuerdo, sí. Ahí más un tema
- **[14:08] Paola Manjarrés Domínguez:** y es que pronto vamos a lanzar la aplicación con release it,
- **[14:08] Paola Manjarrés Domínguez:** que tú sabes que es una aplicación, que existe
- **[14:08] Paola Manjarrés Domínguez:** Shopify y que moviliza un montón de dropshippers,
- **[14:08] Paola Manjarrés Domínguez:** Y lo que estamos viendo es que, al momento de lanzar esta aplicación, vamos a tener muchas
- **[14:08] Paola Manjarrés Domínguez:** de Shopify que se van a migrar a tienda nube
- **[14:09] Paola Manjarrés Domínguez:** más que tema más que todo por un tema de costos,
- **[14:09] Paola Manjarrés Domínguez:** es decir, Shopify sale mucho más caro que tener tienda nube,
- **[14:09] Paola Manjarrés Domínguez:** Tenemos muchas comunidades que están a la espera de
- **[14:09] Paola Manjarrés Domínguez:** de release it para empezar a migrar
- **[14:09] Paola Manjarrés Domínguez:** sus tiendas, ¿no? Entonces, vamos a tener como un flujo muy grande de clientes
- **[14:09] Paola Manjarrés Domínguez:** y sí tenemos estos books, es decir, los merchants empiezan a ver estas diferencias
- **[14:09] Paola Manjarrés Domínguez:** entre una aplicación y la otra, pues van a decir como,
- **[14:09] Paola Manjarrés Domínguez:** no sirve, ¿no? Tiendanube no sirve.
- **[14:09] Paola Manjarrés Domínguez:** Dropping no sirve en tienda nube. Y es como lo que menos quisiéramos
- **[14:09] Paola Manjarrés Domínguez:** que pasara. Yo creo que tal vez en un mes tendríamos ya esa aplicación
- **[14:09] Paola Manjarrés Domínguez:** al aire para todos los países de Latinoamérica.
- **[14:09] Paola Manjarrés Domínguez:** Entonces,
- **[14:09] Paola Manjarrés Domínguez:** ese sería como más el sentido de urgencia de que van a llegar clientes
- **[14:09] Paola Manjarrés Domínguez:** que ya venden, que son masivos y que si se van a encontrar como con estas manualidades
- **[14:09] Paola Manjarrés Domínguez:** tienen que hacer con la integración entre drop y tienda de nuevo, pues
- **[14:09] Paola Manjarrés Domínguez:** vamos a tener, uno, mucho soporte, dos, muchos clientes y Satisdictions.
- **[14:10] Paola Manjarrés Domínguez:** Bueno, creo que ahí
- **[14:10] Yo:** Sí, sí,
- **[14:10] Paola Manjarrés Domínguez:** en medio de todo, perdemos todos.
- **[14:10] Paola Manjarrés Domínguez:** No sé si lo pueden tener ahí en cuenta.
- **[14:10] Yo:** De un
- **[14:10] Paola Manjarrés Domínguez:** Sea, como que se viene ese lanzamiento.
- **[14:10] Paola Manjarrés Domínguez:** De hecho, el lanzamiento va a ser release y tienda nube dropi,
- **[14:10] Yo:** ¿Tienes, de pronto, algún algún
- **[14:10] Yo:** alguna pieza o comunicado que me pudieran compartir? ¿No no lo tenía
- **[14:10] Yo:** en radar, realmente, el lanzamiento, ¿me lo podrían compartir
- **[14:10] Yo:** por Que me, igual, me sirve un montón también para hacer un un análisis aquí interno
- **[14:10] Yo:** de
- **[14:10] Yo:** de, aparte de los errores que nos han compartido,
- **[14:10] Yo:** qué qué gaps pueden haber entre lo que un usuario experimenta
- **[14:10] Yo:** en la integración drop y
- **[14:10] Yo:** Shopify con drop y tienda nueve.
- **[14:10] Yo:** Y validar, digamos, qué qué qué vacíos pueden haber ahí,
- **[14:10] Yo:** tratando de que
- **[14:10] Yo:** puede, no sean errores, pero, pues, ver oportunidades que tengamos.
- **[14:10] Yo:** Como para no estar no estar como desfasados entre lo que ya
- **[14:10] Yo:** Tienda Mobile ofrece a los merchants y
- **[14:11] Yo:** y lo que a través de de de dropping,
- **[14:11] Yo:** y lo que Dropi hace hoy con Shopify. Entonces, si si tienes el comunicado y me lo puedes reenviar,
- **[14:11] Yo:** en él.
- **[14:11] Paola Manjarrés Domínguez:** Bien, ¿todavía están en
- **[14:11] Paola Manjarrés Domínguez:** tenemos como listas las piezas, bueno, en realidad, release y tiene la las
- **[14:11] Paola Manjarrés Domínguez:** piezas gráficas que ya coordinó con tu equipo de marketing,
- **[14:11] Paola Manjarrés Domínguez:** Voy a ver si puedo tener las piezas gráficas para compartirte, decirles, mira, esto es lo que va a pasar,
- **[14:11] Paola Manjarrés Domínguez:** apenas tengamos la integración,
- **[14:11] Paola Manjarrés Domínguez:** Y, bueno, ahí sí como las diferencias
- **[14:11] Paola Manjarrés Domínguez:** sé los books que tenemos.
- **[14:11] Paola Manjarrés Domínguez:** Pero también sé que ustedes están renderizando la nueva aplicación de Shopify Entonces, sí, no no sabía como cuáles serían como esas grandes diferencias.
- **[14:11] Paola Manjarrés Domínguez:** Entre lo uno y lo otro.
- **[14:11] Paola Manjarrés Domínguez:** Pero, bueno, de nuestro lado te podemos compartir
- **[14:11] Paola Manjarrés Domínguez:** esta información del lanzamiento
- **[14:11] Paola Manjarrés Domínguez:** de real estate en tienda Google.
- **[14:11] Yo:** De una, de una, perfecto, gracias.
- **[14:12] Yo:** Sí, no, por ahora no no no tengo más
- **[14:12] Yo:** más información sobre el estado ni el ni el error.
- **[14:12] Yo:** General ni de ni el avance con los books.
- **[14:12] Yo:** Hoy tengo un espacio con el equipo
- **[14:12] Yo:** con varios equipos hechos a mesa conjunta. Esperaría que de ahí pueda haber una
- **[14:12] Yo:** respuesta, por lo menos, de cuando
- **[14:12] Yo:** de cuándo, este, una macroestimación de cuándo podríamos tener
- **[14:12] Yo:** los bugs y, sobre todo, el error crítico resuelto, pero
- **[14:12] Yo:** tan pronto tenga una información clara, se las se las comparto. Le vamos tampoco a darles
- **[14:12] Yo:** info que puede estar cambiando
- **[14:12] Yo:** rápidamente o que sea imprecisa.
- **[14:12] Paola Manjarrés Domínguez:** ¿De una? Perfecto.
- **[14:12] Paola Manjarrés Domínguez:** Santi, bueno, estamos superatentos a a todo esto.
- **[14:12] Paola Manjarrés Domínguez:** Para poderle ya comunicar a nuestros merchants que se
- **[14:12] Paola Manjarrés Domínguez:** estabilizó la situación.
- **[14:12] Paola Manjarrés Domínguez:** ¿Vale?
- **[14:12] Yo:** Una, de una. Así que vamos, entonces.
- **[14:12] Yo:** Muchas gracias, que estén muy bien.
- **[14:12] Paola Manjarrés Domínguez:** Listo, Santi, que estés bien.
- **[14:12] Rodrigo Garcia:** Chau, chau.