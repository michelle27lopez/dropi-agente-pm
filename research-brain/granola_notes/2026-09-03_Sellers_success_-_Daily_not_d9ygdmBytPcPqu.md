# Sellers success - Daily

- **ID:** `not_d9ygdmBytPcPqu`
- **Fecha:** 2026-09-03T13:32:31.029Z
- **Owner:** Santiago Herrera Acosta (santiago.herrera@dropi.co)
- **URL Granola:** [Ver en Granola](https://notes.granola.ai/d/81208349-ac99-41b6-9ba4-75b04c59eb8d)
- **Asistentes:** Santiago Herrera Acosta, Alejandra Melo, Diana Margarita Aldana Echeverry

---

## Resumen de la Reunión
### Estado del Flujo y Coordinación con Logística

- Flujo de onboarding revisado: arranca desde registro/centración, termina en tarjeta que lleva a Expo Winners (Gali, escáner de productos)
- Equipo de logística (Juan Diego y Pino) va a agregar su tarjeta al flujo
  - Actualmente hay tres tarjetas: Pulso, escáner, Gali
  - Logística será una cuarta
- Coordinación vía PR: Jaime debe pasar accesos al repo a Juan Diego y Pino
  - Santiago les escribirá para coordinar que actualicen sobre lo que Alejandra ya subió

### Dominios y Generación de Landings

- Pendiente definir el dominio sobre el cual se montarán las landings generadas

  - Santiago está hablando con Jaime y Laura Sánchez (Roax) para resolver esto
  - También evaluando si Roax alcanza a hacer la parte de pauta

- Generación de landings: Alejandra la cubre hasta ese punto (incluyendo calculadora, resultados y ángulos de venta)

  - Santiago tomará la parte de generación de landings una vez Alejandra avance

### Métricas y Recopilación de Data

- Documento de métricas por fases ya actualizado (tiempos por etapa, desde selección de producto en adelante)
- Próximo paso: mapear qué eventos está generando el código actualmente
  - El código aún no tiene conexión con backend
  - Integración con Clarity propuesta para empezar a capturar eventos de usuario
- Herramientas a revisar para monitoreo: Clarity + otras opciones disponibles
- Estrategia: primero terminar el flujo completo, luego instrumentar eventos y Clarity

### Análisis de Data con Darwin y RStudio

- RStudio expone un MCP, lo que permite pedirle análisis estadísticos de forma semántica
- Idea: usar Darwin como puente entre data bruta y lenguaje de producto
  - Darwin recibirá data de eventos (tiempos, botones, productos escogidos) y la analizará con RStudio por debajo
  - Podrá sacar correlaciones, causalidades, segmentos y ponderados reales, no solo supuestos cualitativos
- Aplicación inmediata: analizar data del evento próximo; también útil para estudios futuros

### Naming del Copiloto

- El nombre actual en el repo es “Copiloto”, pero Alejandra quiere cambiarlo
  - Fluxy (competidor) también usa “Copiloto” como nombre de su IA
- Decisión: explorar naming alternativo; si no se encuentra algo mejor, se deja “Copiloto de Dropi”

### Próximos Pasos

- **Escribir a Juan Diego y Pino para coordinar PRs sobre el repo actualizado** (Santiago)

  Confirmar que Jaime ya les pasó los accesos y alinear sobre los cambios de Alejandra.

- **Hacer seguimiento con Jaime y Laura Sánchez sobre dominio para las landings** (Santiago)

  Definir el dominio y confirmar si Roax alcanza a cubrir la parte de pauta.

- **Actualizar repo local y empezar a trabajar la generación de landings** (Santiago)

  Revisar cambios de Alejandra y arrancar la parte que le corresponde.

- **Revisar herramientas de monitoreo disponibles (Clarity y otras) para mapear eventos** (Santiago)

  Definir estrategia de recopilación antes de instrumentar el flujo.

- **Terminar el flujo completo punta a punta** (Alejandra)

  Incluye calculadora, resultados, ángulos de venta y generación de landing; luego se instrumenta.

# Estado del Flujo y Coordinación con Logística

- Flujo de onboarding revisado: arranca desde registro/centración, termina en tarjeta que lleva a Expo Winners (Gali, escáner de productos)
- Equipo de logística (Juan Diego y Pino) va a agregar su tarjeta al flujo
  - Actualmente hay tres tarjetas: Pulso, escáner, Gali
  - Logística será una cuarta
- Coordinación vía PR: Jaime debe pasar accesos al repo a Juan Diego y Pino
  - Santiago les escribirá para coordinar que actualicen sobre lo que Alejandra ya subió

# Dominios y Generación de Landings

- Pendiente definir el dominio sobre el cual se montarán las landings generadas
  - Santiago está hablando con Jaime y Laura Sánchez (Roax) para resolver esto
  - También evaluando si Roax alcanza a hacer la parte de pauta
- Generación de landings: Alejandra la cubre hasta ese punto (incluyendo calculadora, resultados y ángulos de venta)
  - Santiago tomará la parte de generación de landings una vez Alejandra avance

# Métricas y Recopilación de Data

- Documento de métricas por fases ya actualizado (tiempos por etapa, desde selección de producto en adelante)
- Próximo paso: mapear qué eventos está generando el código actualmente
  - El código aún no tiene conexión con backend
  - Integración con Clarity propuesta para empezar a capturar eventos de usuario
- Herramientas a revisar para monitoreo: Clarity + otras opciones disponibles
- Estrategia: primero terminar el flujo completo, luego instrumentar eventos y Clarity

# Análisis de Data con Darwin y RStudio

- RStudio expone un MCP, lo que permite pedirle análisis estadísticos de forma semántica
- Idea: usar Darwin como puente entre data bruta y lenguaje de producto
  - Darwin recibirá data de eventos (tiempos, botones, productos escogidos) y la analizará con RStudio por debajo
  - Podrá sacar correlaciones, causalidades, segmentos y ponderados reales, no solo supuestos cualitativos
- Aplicación inmediata: analizar data del evento próximo; también útil para estudios futuros

# Naming del Copiloto

- El nombre actual en el repo es “Copiloto”, pero Alejandra quiere cambiarlo
  - Fluxy (competidor) también usa “Copiloto” como nombre de su IA
- Decisión: explorar naming alternativo; si no se encuentra algo mejor, se deja “Copiloto de Dropi”

# Próximos Pasos

- **Escribir a Juan Diego y Pino para coordinar PRs sobre el repo actualizado** (Santiago)

  Confirmar que Jaime ya les pasó los accesos y alinear sobre los cambios de Alejandra.
- **Hacer seguimiento con Jaime y Laura Sánchez sobre dominio para las landings** (Santiago)

  Definir el dominio y confirmar si Roax alcanza a cubrir la parte de pauta.
- **Actualizar repo local y empezar a trabajar la generación de landings** (Santiago)

  Revisar cambios de Alejandra y arrancar la parte que le corresponde.
- **Revisar herramientas de monitoreo disponibles (Clarity y otras) para mapear eventos** (Santiago)

  Definir estrategia de recopilación antes de instrumentar el flujo.
- **Terminar el flujo completo punta a punta** (Alejandra)

  Incluye calculadora, resultados, ángulos de venta y generación de landing; luego se instrumenta.

---

Chat with meeting transcript: [https://notes.granola.ai/t/cf563141-c90a-45e0-adb6-1f10895d782b](https://notes.granola.ai/t/cf563141-c90a-45e0-adb6-1f10895d782b)

## Transcripción Completa (Palabra por Palabra)
- **[13:32] Yo:** Triste un hombre que ha llegado atrás de él. En su mirada yo no vi la misma de ayer, esa luz que brillaba a través del desempate.
- **[13:33] Alejandra Melo:** Hola, Santi.
- **[13:33] Yo:** Hola, Aleja, ¿cómo estás?
- **[13:33] Alejandra Melo:** Bien, bien. ¿Y tú?
- **[13:33] Yo:** Bien, bien.
- **[13:33] Yo:** Bueno, ahora sí quieres, o sea, como súper rápido para que igual no rinda.
- **[13:33] Yo:** Nada, sí, sí, yo estuve revisando ayer antes del segundo PR lo que habías montado, entiendo ese flujo parte de 2, o sea, esa animación arranca de aquí igual.
- **[13:33] Yo:** O sea, ya esa parte de registro con la centración y demás ya existe, ¿cierto? Entiendo que está la tarjeta de abajo, que es como la que llevaría a la aplicación de Gali, donde tenemos lo demás, ¿verdad?
- **[13:33] Alejandra Melo:** Sí.
- **[13:33] Alejandra Melo:** Uh-huh.
- **[13:33] Yo:** Ok.
- **[13:33] Yo:** Y ahí arranca, ya se disparan los diferentes flujos, ¿cierto?
- **[13:34] Alejandra Melo:** Santi.
- **[13:34] Yo:** Hola, dímelo.
- **[13:34] Yo:** Emojis.
- **[13:34] Alejandra Melo:** Ahí me escucha.
- **[13:35] Yo:** Melo, che ya estoy.
- **[13:35] Yo:** ¿Tú a mí me escuchas?
- **[13:35] Alejandra Melo:** Sí, ya, qué pena.
- **[13:35] Yo:** Y entonces, ¿qué?
- **[13:35] Yo:** El flujo listo. Entonces ya cuando tocas la última tarjeta, la que te lleva a todo lo que tenemos de Expo Winners, que está Gali, lo del escáner de productos y todo eso, ¿verdad?
- **[13:35] Alejandra Melo:** Sí.
- **[13:35] Yo:** Listo, de una.
- **[13:35] Alejandra Melo:** Mm-hmm.
- **[13:35] Yo:** Ayer yo estaba hablando con Juan Diego y con Pino, la idea es de que ellos van a poner su parte.
- **[13:35] Yo:** De logística dentro de
- **[13:35] Yo:** dentro pues sí de toda la experiencia de nosotros pues no en gales sino como otra tarjeta sí como son en estos momentos son tres no está lo de pulso lo del escáner lo de gali verdad van a poner la la parte de ellos de logística. Entonces lo que quedamos fue que ellos, o sea, primero
- **[13:35] Alejandra Melo:** Sí.
- **[13:36] Yo:** producto va a tener como su versión.
- **[13:36] Yo:** Y de ahí la pasamos a
- **[13:36] Yo:** La pasamos a que la pasamos a la principal. Entonces ya Jaime, Jaime, pero te echo la pregunta a ver si ya lo hizo.
- **[13:36] Yo:** Jaime le ha pasado los accesos del repo.
- **[13:36] Yo:** A ellos para que también hagan PR. Entonces ya nos toca estarnos coordinando pues de que ellos estén actualizando con lo que tú subiste. Ya les voy a escribir también de eso. Y ya le han listo. Bueno, de los grupos principales, entonces, ¿qué está haciendo falta en este momento?
- **[13:36] Yo:** Ya estoy revisando lo de los flujos con Jaime. Ve lo de los flujos, no, perdóname, lo de las URL, porque hay que saber sobre cuál dominio vamos a montar las landings que se van generando.
- **[13:36] Alejandra Melo:** ¿Cómo?
- **[13:37] Alejandra Melo:** Lo de las landings, esa es toda esa parte hace falta. Lo que pasa que como me tocó devolverme, tú estás haciendo la parte de
- **[13:37] Yo:** Sí, sí.
- **[13:37] Yo:** Sí, yo estoy hablando.
- **[13:37] Yo:** Yo estoy, yo estoy hablando es con Jaime y con Laura Sánchez.
- **[13:37] Alejandra Melo:** Sí.
- **[13:37] Yo:** De rocks.
- **[13:37] Yo:** Para saber cuáles son los dominios, los dominios o el dominio que nos van a entregar, para saber sobre cuál se van a generar esas landings, y además si Roax va a alcanzar a hacer esa parte de la pauta, porque ellos apenas lo están evaluando. Yo le estoy haciendo seguimiento a eso. Listo, ahora sobre la parte de la generación de las landings.
- **[13:37] Yo:** Pues yo no le he metido mano a esa parte, pues porque justamente tú estás actualizando ese repo. ¿Tú vas a hacer hasta que se genera la landing o cómo quedamos en eso?
- **[13:37] Yo:** O sea, tú haces esa parte o esa parte necesitas que la haga yo.
- **[13:37] Alejandra Melo:** Yo creo que es mejor que la vayas haciendo porque, bueno, de aquí ya paso, sabes. Espérate, que estoy mirando acá.
- **[13:38] Alejandra Melo:** Una cosa así.
- **[13:38] Alejandra Melo:** Selecciona el proveedor, aquí está la calculadora.
- **[13:38] Alejandra Melo:** Esa calculadora me ha costado trabajo, tengo que volverlo a organizar.
- **[13:38] Alejandra Melo:** Siguiente, vale. Resultados, de continuar con este precio, pues puedes probarlo con cuidado.
- **[13:38] Yo:** Dale.
- **[13:38] Alejandra Melo:** Elegir ese producto, y aquí es donde se pierde todo. Entonces, de aquí ya paso a los ángulos de venta. Sí, voy a hacer la sala de la landing.
- **[13:38] Yo:** Ok, listo. Entonces, ¿sabes qué voy a trabajarle ahora? Porque ya actualicé el documento con lo que hablamos en la, creo que fue Ayer, ah no, en la, en la, en la planning, mentiras, que decía la Contreras sobre ya métricas específicas sobre las diferentes fases, sí.
- **[13:39] Yo:** Sobre las diferentes fases, es decir, cuánto se demora en cada parte del proceso, no, desde escoger el producto, como ya definiendo esas métricas. Ese documento ya está. Te voy a preguntar, Aleja, si entonces cómo vas Vamos a hacer hasta lo que se genera la landing y todo. O sea, vas a hacerlo completo, vas a hacer el punta a punta, correcto.
- **[13:39] Yo:** Entonces sí, iba revisando ya.
- **[13:39] Yo:** El tema de cómo vamos a recopilar la data.
- **[13:39] Yo:** Es decir, revisar de que no se ve, o no sé si tú estás haciendo esa parte. O sea, no quiero es que justamente nos vaya, vaya, vaya a afectarte a lo que estés haciendo, pero ya el proceso como tal de, por ejemplo, Tomar el tiempo, los eventos de cuando hace X o Y cosa el usuario, eso, eso lo está mapeando el código. Creería que no, por eso te digo, si te parece, pudiera Por ejemplo, Pino, a meterle creo que la integración con Clarity. Puedo revisar es qué herramientas podemos tener ahí a la mano para hacer el estudio.
- **[13:40] Alejandra Melo:** Eso sí, dale de una.
- **[13:40] Yo:** Listo.
- **[13:40] Alejandra Melo:** Yo voy a ir haciendo el flujo. Yo creo que uno lo termina, lo deja listo, y entonces ya decimos listo. Ahora sí metámosle clarity, metámosle los eventos, metámosle todo.
- **[13:40] Yo:** Sí, sí, por cierto, o sea, solamente hacer un mapa de qué se está generando, como para lo mismo hacer la estrategia ya de cómo lo vamos a empezar a monitorear, dónde va a quedar guardada la información. Porque lo que estuvo haciendo ayer, de hecho, fue a ver lo que está pasando ahora con, por ejemplo, con Darwin, es que los agentes toman Insights, cierto. Entonces tú le dices el 80% de los usuarios no usan activamente la plataforma y solo se genera en 10% los pedidos. Entonces, ¿qué pasa? Que, por ejemplo, si las ventas de vestidos están concentradas en el 10% del catálogo, por ejemplo, entonces él como que toma insights y empieza a generar o a tratar de unir, unir puntos, ¿no? Ah, no, entonces puede haber una correlación entre Entre esto y esto, o haría que pase esto y que pase eso. O sea, muy normal, como lo haría alguien de producto, sí, una persona de producto sin mayor información. Pero entonces escuché el programa
- **[13:41] Yo:** De R, RStudio.
- **[13:41] Yo:** Bueno, RStudio no es nada hecho del mundo de producto ni diseño directamente.
- **[13:41] Yo:** Yo lo conozco es porque es un programa estadístico, ya.
- **[13:41] Yo:** Pues por la preguerna economía.
- **[13:41] Yo:** Y RStudio.
- **[13:41] Yo:** Es uno de los programas que, por ejemplo, utilizan los equipos de ciencia de datos. Entonces lo que encontré es que RStudio ya Me habría servido mucho que lo terminé pregrado, pero RStudio ya expone un MCP, es decir, que de forma semántica tú le puedes pedir a R que haga cosas. Lo que tenía en mente ya hacia él. Bueno, ya cuando, o sea, claramente estamos con hiperfoco de lo que se va a presentar, pero luego tenemos que es como, cómo vamos a utilizar lo que se va a presentar. Y pues es lo que vamos a hacer, vamos a empezar a recoger información, vamos a empezar a recolectar, ¿no? Para tomar las decisiones. Y de hecho lo empecé a trabajar fue ayer, ya haciendo los cambios sobre el documento de la estrategia. Dijo, bueno, como vamos a empezar a medir y Entonces lo que hice fue empezar a hacer unas pruebas con el MCP de RStudio, y él obviamente es un software, es un open source
- **[13:42] Yo:** súper estadístico, o sea, ya te habla directamente de temas muy, muy densos, pero como es semántico, ya él te lo, y está Darwin, ya lo que se hace es como un poco la transición y el puente entre lo estadístico y el lenguaje producto. El punto es que ya no va a ser como que solamente, ya es pasar que la data, de la data en bruto hacemos directamente el insight, pero que lo haga directamente Darwin. Entonces, cuando empecemos a recopilar información, por ejemplo, de los usuarios que están terminando el flujo, los tiempos, los botones que más se usan, los productos que más están escogiendo, todo eso. Ya lo que va a pasar es que directamente se la vamos a poder pasar al mismo Darwin porque por debajo va a tener RStudio. Entonces ahí sí va a analizar de verdad data, o sea, va a sacar ponderados, va a sacar absolutamente todo, va a sacar segmentos, va a sacar cuando haya
- **[13:43] Yo:** correlación y cuando no haya correlación, cuando haya causalidad y cuando no haya causalidad. Sí, porque mucho, mira que son igual supuestos de que no, cuando yo muevo esto se me mueve esto. Entonces lo que haríamos con eso es que como Darwin ya no solamente se va a quedar en el, en la retórica de producto, que es en la que todos estamos, sino que de verdad va a ir a ver el dato matemáticamente, nos va a decir decir si eso de verdad sí tiene correlación.
- **[13:44] Yo:** Porque puede que aparentemente la tenga.
- **[13:44] Yo:** Pero que cuando cruza el dato dice eso no tiene nada que ver una cosa con la otra, sino que da la casualidad de que no sé, que el experimento como se hizo en condiciones X, entonces nos dio B. Puede que no le saquemos el 100% del provecho ahora para el evento porque igual está pues muy encima, pero igual sí nos va a servir para analizar data porque pues no lo necesitamos tener antes del evento. Inclusive podríamos con la data Ya recopilada, después igual montarlo bien, pero si nos va a servir mucho es para muchos otros estudios, listo. Pero quiero aplicarlo ahora para el evento porque Pues creo que nos va a servir bastante. Por eso tocaba el tema de, bueno, ya cómo vamos a recopilar información de qué eventos están generando y todo. Yo ya voy a actualizar mi mi repositorio local para ver cuáles fueron los cambios sobre los que montaste, porque yo creería que es igual, todavía no tiene ningún tipo de conexión con backend ni nada.
- **[13:45] Yo:** Entonces empezar a ver cómo lo montamos. Listo.
- **[13:45] Alejandra Melo:** Listo, pero ahí de pronto tú vas a ver que se copió todavía, pero yo lo voy a cambiar el nombre. Hay que mirar cómo lo llamamos porque estaba viendo ayer un video Y lo de Fluxy, la IA de Fluxy se llama copiloto.
- **[13:45] Yo:** Okay.
- **[13:45] Alejandra Melo:** Entonces, como para no tener como eso de
- **[13:45] Yo:** ves un montón de ellas que son copilotos como el concepto pero listo de uno pues sí juguemos con el naming pues tenemos flexibilidad en eso
- **[13:45] Alejandra Melo:** Sí.
- **[13:45] Alejandra Melo:** O sea, lo hace gironeando. Sí, luego pensamos en eso. Si no, pues se deja copiloto.
- **[13:45] Yo:** Sí, igual es el copiloto de Dropy.
- **[13:45] Alejandra Melo:** Listo.
- **[13:45] Yo:** Listo, de una leja.
- **[13:46] Alejandra Melo:** Bueno.
- **[13:46] Alejandra Melo:** Hagámoslo.
- **[13:46] Yo:** Chau.
- **[13:46] Alejandra Melo:** Chau, que estés bien. Cualquier cosa.
- **[13:46] Yo:** Bueno.