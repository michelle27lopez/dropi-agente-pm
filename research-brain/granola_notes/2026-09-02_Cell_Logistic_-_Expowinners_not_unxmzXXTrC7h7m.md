# Cell Logistic - Expowinners

- **ID:** `not_unxmzXXTrC7h7m`
- **Fecha:** 2026-09-02T20:30:18.488Z
- **Owner:** Santiago Herrera Acosta (santiago.herrera@dropi.co)
- **URL Granola:** [Ver en Granola](https://notes.granola.ai/d/492859b4-3a6d-4888-8e96-051229bc799a)
- **Asistentes:** Santiago Herrera Acosta, Jaime Guevara, Michel Pino, Juan Bautista

---

## Resumen de la Reunión
M

# Flujo de Selección de Transportadoras para Expo Winners

- Demo del flujo mobile-first para el evento: simulación de selección de transportadoras con IA
  - Usuario elige un escenario preconfigurado (ej. tecnología en Bogotá, moda en Medellín)
  - Asigna puntaje a criterios: efectividad de entrega, costo, tiempo, cobertura, contra entrega
  - Resultado: ranking de transportadoras según prioridades del usuario
  - Opción de personalizar el ranking con drag and drop
  - Al final: CNPS del esfuerzo + código de validación para gamificación del evento
- Academy tiene un flujo similar de selección de transportadoras, pero sin componente de IA
  - Oportunidad de reforzar el copy: posicionar el flujo de la célula como la evolución inteligente del módulo

# Segunda Idea: Encuesta de Dolores y Prioridades

- Flujo más abierto para recopilar data sobre roles y dolores de los usuarios
  - Cards con proyectos de la célula: usuario da skip o asigna valor, sin carga cognitiva alta
  - Según respuestas, se conectan las ideas con la necesidad detectada (transportadoras, novedades, devoluciones, productos)
  - Permite clasificar madurez del usuario: cómo escoge transportadora hoy, si usa la asignada por Dropi, etc.
- Registro del flujo de Expo Winners ya captura correo y celular desde el inicio

# Gamificación e Incentivos

- Intención: alinear el código de validación a la ruta de puntos/niveles del evento
  - Jaime confirmó: no hay premios tangibles definidos ni integración formal con el modelo de incentivos del evento
  - Prioridad es desplegar y pasar validación de seguridad; incentivos son secundarios
- Juan propone gestionar con marketing algún incentivo físico sencillo (gorras, lapiceros, baterías portátiles)
  - Jaime sugiere mencionarlo en el grupo y negociar con Andrés Felipe

# Plan de Despliegue y Próximos Pasos

- Flujo de transportadoras activo los 2 días del evento, no solo en el workshop
  - Workshop (\~20 min disponibles para logística): sin intervención directa; se impulsa desde la app
  - Jaime presentará estilo Jobs el flujo de Pulso; \~60 asistentes objetivo, 10 por tipología de dropshipper
- Estructura de repos:
  - Repo de transportadoras → merge al repo interno de producto (Expo Winners producto, donde está Galí)
  - Luego entrega al repo principal del evento (de marketing/desarrollo)
- Clarity: Michel lo está instalando en el repo de transportadoras; se usará también en Galí para mapeo de comportamiento en pantalla
- Reunión de validación prevuelo propuesta para el martes en la tarde con Lau Contreras

# Próximos Pasos

- **Dar acceso al repo de Expo Winners producto a Michel** (Jaime)

  Michel necesita el acceso para hacer el pull request y que se apruebe el merge.
- **Hacer merge del repo de transportadoras al repo interno de producto esta semana** (Michel)

  Permite tener la semana del 7 al 11 de septiembre libre para ajustes sobre el repo principal.
- **Negociar incentivo físico con Andrés Felipe o marketing** (Juan Bautista)

  Mencionar en el grupo; explorar si marketing tiene mercancía disponible de proveedores Dropi.
- **Confirmar agenda de reunión de validación prevuelo para el martes en la tarde** (Santiago)

  Propuesta a Lau Contreras; chequeo punta a punta de Galí, transportadoras, seguridad y Clarity.

---

Chat with meeting transcript: [https://notes.granola.ai/t/7094189b-6bc9-4425-8f0e-640122e41ce2](https://notes.granola.ai/t/7094189b-6bc9-4425-8f0e-640122e41ce2)

## Transcripción Completa (Palabra por Palabra)
- **[20:31] Yo:** Que rende ganância.
- **[20:31] Juan Diego Bautista Vasquez:** Hola, Santi, ¿qué más? ¿Cómo vamos? ¿Qué tal todo?
- **[20:31] Yo:** Todo y en cuanto estés cumpliendo.
- **[20:31] Juan Diego Bautista Vasquez:** Yo, chau.
- **[20:31] Yo:** Ah, y para felicitar.
- **[20:31] Juan Diego Bautista Vasquez:** Que más, bien, chau, amigos.
- **[20:31] Michel David Pino Aguilar:** ¿Vosotros me hablaban a 21,
- **[20:31] Juan Diego Bautista Vasquez:** Juan Diego?
- **[20:31] Michel David Pino Aguilar:** Sí, marica. A veces conseguía
- **[20:31] Juan Diego Bautista Vasquez:** más agua yo. No, marica.
- **[20:31] Juan Diego Bautista Vasquez:** Todo comenzó cuando entré al colegio como al año y medio.
- **[20:31] Michel David Pino Aguilar:** Era como el mero mero filósofo ya.
- **[20:31] Juan Diego Bautista Vasquez:** Sí, todo comenzó realmente cuando entré al colegio al año y medio. Ya de ahí para adelante todos se
- **[20:32] Michel David Pino Aguilar:** fueron. Ah, sí.
- **[20:32] Juan Diego Bautista Vasquez:** ¿Qué más? ¿Cómo van?
- **[20:32] Yo:** Todo y en todo y en todo y en.
- **[20:32] Michel David Pino Aguilar:** Todo bien, todo bien.
- **[20:32] Juan Diego Bautista Vasquez:** No tenemos media horita, hagámoslo. Que
- **[20:32] Michel David Pino Aguilar:** antes,
- **[20:32] Juan Diego Bautista Vasquez:** pues primero nosotros estuvimos echando cabeza y tenemos una idea sobre ver cómo mostrarlo de selección de transportadoras. Pero también teníamos otra y que le estábamos como echando cabeza también más como general para ver. Entonces, si quieren, veamos primero la selección y también mostramos la otra. Listo.
- **[20:32] Yo:** De una.
- **[20:32] Jaime Guevara:** Feliz cumpleaños.
- **[20:32] Juan Diego Bautista Vasquez:** Adiós.
- **[20:32] Michel David Pino Aguilar:** Bueno.
- **[20:32] Michel David Pino Aguilar:** Además, Jaime, todo bien. Ahí es donde yo
- **[20:32] Jaime Guevara:** te he saludado.
- **[20:32] Michel David Pino Aguilar:** Bueno, Jaime, Santi en especial.
- **[20:32] Michel David Pino Aguilar:** Que no, pues no tienen contexto sobre esto. La idea es como tal simulación de lo que son el flujo de selección de transportadoras. que busca realmente es poder tener previo a esta pantalla que está viendo aquí un call to action que le diga pues sí a los asistentes al evento Expo Winners que hay una forma de priorizar sus transportadoras con IA. ¿Qué pasa?
- **[20:33] Michel David Pino Aguilar:** Esto sería un link público.
- **[20:33] Michel David Pino Aguilar:** Que se redireccionaría.
- **[20:33] Michel David Pino Aguilar:** Es de lo que pues ya está Expo Winners en esa app de reserva.
- **[20:33] Michel David Pino Aguilar:** Entonces, cuando los héroes ya entren aquí, le den comenzar.
- **[20:33] Michel David Pino Aguilar:** Ellos van a ver estos escenarios como tal. Entonces le dice que elija un escenario. Estos escenarios como tal lo que traen es un tipo de actividad de un usuario cero pues sobre la venta.
- **[20:33] Michel David Pino Aguilar:** De algún tipo de producto. Por ejemplo, en este caso son escenarios ya quemados, que son tecnología en Bogotá, Moás de Medellín, salud y belleza. Entonces, un ejemplo, en un caso hipotético, que seleccionen tecnología en Bogotá y le den continuar. Entonces, si ellos quieren continuar, lo que se les va a presentar es que ellos tengan este, esta barra de progreso y den un score a qué es más importante. Es de como tal de lo que ellos consideran que es más importante para pues que se dé de manera efectiva el proceso de la logística. Hay varias oportunidades que nosotros vimos que podíamos brindar a los usuarios, que igual estamos con el proceso de cambiar las etiquetas y homologar otras cosas, pero dentro de lo que ya está planteado tenemos La efectividad de entrega, el costo del flete, el tiempo de entrega.
- **[20:34] Michel David Pino Aguilar:** La cobertura nacional y este el manejo contra entrega lo estábamos analizando. Entonces qué pasa si los héroes por ejemplo dice que la efectividad de entrega tiene que ser lo más importante y el tiempo de entrega también. Y el manejo de contraintrega pues no tanto, por ejemplo, y la cobertura nacional no tanto, por ejemplo, de pronto sí muy alta.
- **[20:35] Michel David Pino Aguilar:** del comportamiento de las transportadoras que ya nos lo han compartido, hacer una interacción de que el usuario vea similar lo que vería pues dentro del módulo de selección de transportadoras. Pero sin hacerlo como tan engorroso y mostrarle como todo ese prototipo gigante, sino crear algo en mobile first que esté alineado al look and feel de lo que ya se está planteando dentro de Expo Winners y que ellos puedan ver ese interacción. Entonces, cuando le des a disponibilidad, él va a tener una simulación de un resultado de ella sobre la fórmula pues con la que se trabaja en el POC de selección de transportadoras. Donde esto le arma como tal el top de las transportadoras de acuerdo a sus necesidades, a lo que él prioriza.
- **[20:35] Michel David Pino Aguilar:** Entonces pues le muestra rapidísimo con su puntaje la efectividad del flete y el tiempo promedio de entrega. Y aquí tiene una forma de ver el porqué. El porqué es Entonces, ¿qué prioriza? Entonces, ¿qué prioriza? de acuerdo a su criterio propio el resultado como tal de este top entonces pues pueden ir también a esa parte que donde le dice personaliza tu ranking y lo que se plantea es como que no estás de acuerdo entonces hay que hacer drag and drop para reorganizar arrastra para reorganizar pues dentro de un lenguaje más fácil De entender. Y lo que va a pasar aquí es lo que pueden ver en el punto inicial del módulo de selección de transportadora. Entonces, digamos, yo quiero esta aquí, está acá, etcétera.
- **[20:36] Michel David Pino Aguilar:** El lanzamiento de un video visual.
- **[20:36] Yo:** Les voy a mostrar, ustedes ya vieron lo que está proponiendo Academi para el evento y que está relacionado con transportadoras.
- **[20:36] Michel David Pino Aguilar:** No, no, pero para ti un momentico, yo terminé y ya me mostraré, ¿te parece?
- **[20:37] Yo:** Listo, Dani.
- **[20:37] Michel David Pino Aguilar:** Dale.
- **[20:37] Michel David Pino Aguilar:** Entonces, teniendo en cuenta pues la personalización del ranking, pues se muestra lo que se modificó para que usted lo tenga claridad, pues, de cuáles fueron las posiciones que cambió, de qué transporte Y confirma la configuración. Ahora bien, al final se le presenta CNPS pues del esfuerzo como tal de usar las herramientas, tanto la de priorizar, ver el resultado y configurar de manera personalizada el ranking. Y pues él envía un serving.
- **[20:37] Michel David Pino Aguilar:** Entonces aquí dice es que ese es un código de validación. Entonces, ¿qué pasa? La idea detrás de esto es que esto sea, que sea aplicable a la gamificación de lo que el staff del evento Está planteando. No sé si hay algún tipo de exchange ahí, como de la forma en la que ellos van adquiriendo como más puntos dentro del evento, de acuerdo a gamificación y demás. Pero entonces la idea es que este código, cuando ellos terminen esta configuración, pues le muestren el código para ganar así una estrella. Desde aquí entonces continúa. Y la idea es que desde aquí, desde este punto, pueda volver al enlace que está planteado acá.
- **[20:38] Michel David Pino Aguilar:** Que nos envió Jaime hoy de Expo Winners. Igual, bajo eso como tal, lo que ellos están haciendo dentro del evento, pero teniendo en cuenta pues que hicieron esa interacción y que con este código pues hay algún tipo de recompensa. Y ya, esa es como la idea que tenemos. Y tenemos otra, que esa solamente es el bien transportado, solo tenemos otra para recopilar más data sobre roles y dolores que están asociados a ideas que que ya hemos tenido dentro de la célula, para así también poder entender un poco más el valor. Y sí, como la
- **[20:38] Michel David Pino Aguilar:** la importancia que los usuarios pueden percibir dentro de lo que estamos planteando de experimento en la célula, pues para poner al usuario en el centro y aprovechar este evento que nos va a permitir como poder diseñar mucho más de la idea. que ya hemos planteado a lo largo pues del tiempo de que planteó las células. Pero listo, vale, interesante la palabra. Te dejo con Paco.
- **[20:39] Yo:** Si no, les quiero mostrar qué va a hacer Academy, más es para que, pues no sé si James lo había visto antes o no, yo lo vine apenas a conocer ayer.
- **[20:39] Yo:** Ellos quieren hacer un flujo bastante similar.
- **[20:39] Yo:** Desde una app de Academy, y una de esas es ruta logística y selección de transportadoras, análisis de transportadoras. Listo, se los digo más para que sepan que digamos que hay otra parte que no No sé si quieran incluir, no es para que lo tengan en el radar, solamente es por eso, es que ellos tienen la misma analiza de transportadoras. Claramente los En algunas cosas no es exactamente igual, pero llega un punto en donde tratan de gamificar y como bueno, ahora ordena cuál va, es más para enseñar, termina siendo más un tema claramente de e-learning.
- **[20:40] Yo:** De, si tienes esas opciones, ¿cuál usarías primero? Ta ta ta. Y luego es como que listo, transportador, ranking completado, transportadora 1, quien tiene mejor equilibrio, mayor cobertura, y ya. Y así como para varias cosas también, para selección de productos. Y por acá creo que tenían otra que era de
- **[20:40] Yo:** Centro de Novedades, pero bueno, esto, esto lo están planteando ellos, entonces no sé.
- **[20:40] Yo:** Es más hacia que lo tengan presente, de que desde Academia también se quiere abordar. Y si es más como es tan similar, no sé si quieran hacer una diferenciación en Entiendo que ese es el flujo que ustedes quieren también priorizar con desarrollo, ¿cierto? Como, no sé si es exactamente el mismo flujo.
- **[20:40] Yo:** Mitch o Juan Di es el mismo que se está en el handoff para tratar de que yo lo priorice.
- **[20:41] Michel David Pino Aguilar:** Sí, sí, en parte.
- **[20:41] Juan Diego Bautista Vasquez:** Mira
- **[20:41] Michel David Pino Aguilar:** que lo que están planteando aquí de Acami es de selección de transportadora, pero de lo actual, ¿no? No está alineado la parte de inteligencia artificial para recomendación.
- **[20:41] Yo:** Sí, claro, no, por eso le digo, creo que por eso les muestro, es para que vean qué tienen ellos y que ustedes puedan aprovechar un poco, qué quieren plantear ellos y que ustedes puedan aprovechar un poco. Para de pronto, no sé, hacer más explícito, cierto, de que es una evolución del módulo. Porque claro, ellos aquí la intención es que ellos aprendan con lo que hay y cómo funciona hoy. Entonces Como para que lo tengan ahí presente, si quieren como hacerle como un refuerzo más al discurso, al copy de lo que lee, de que es la evolución de cómo trabajar la selección de transportadoras en lo más inteligente. Bueno, ustedes me entienden. Como hacia dónde quiero ir. Es más para que lo tengan en el radar, solo por eso. Igual como va a estar dentro del, digamos, el hub de producto.
- **[20:41] Yo:** Está con GAL y con lo de escáner, está lo de selección de transportadoras, pues igual se va a entender. No me quedó muy claro fue la parte de lo del código. Ahí, Mitch, si te Podría, si te puedes devolver, porque entiendo que se genera un código y sé que hay un tema de incentivos para que los asistentes vayan recorriendo todo el evento.
- **[20:42] Yo:** Pero ahí, Jaime, nosotros de alguna forma estamos participando dentro de eso.
- **[20:42] Yo:** Está participando.
- **[20:42] Yo:** Generar, generar.
- **[20:42] Yo:** También lo mismo, estrellas.
- **[20:42] Jaime Guevara:** Premios, no.
- **[20:42] Yo:** No.
- **[20:42] Jaime Guevara:** No, no.
- **[20:42] Yo:** Okay.
- **[20:42] Jaime Guevara:** No, otro sí, baila, se jode.
- **[20:42] Yo:** O sea que esa parte, esa parte que presentan, bueno, es la intención que tenían ustedes ahí cuando image de que eso aportara dentro de la ruta winner.
- **[20:42] Yo:** O es otro, otro modelo que están tratando de proponer.
- **[20:42] Michel David Pino Aguilar:** Sí, no, ya es.
- **[20:43] Michel David Pino Aguilar:** Cómo alinearlo a la gamificación del evento y la forma en la que como que van a poder ir
- **[20:43] Jaime Guevara:** subiendo de nivel
- **[20:43] Michel David Pino Aguilar:** los asistentes, ¿no? Como que al final ya cada acción Piensa un pedo, sé que vayamos a tratar de aliar por medio pues de un discurso, de mostrar una herramienta, de que escaneen un QR y te interactúen con algo, o al final sería tan o como Ellos sientan que forma parte de ese proceso de entendimiento y de ganancia, ¿no? Obviamente no sé, cuando digo premio, no es premio como que un premio literal, algo tangible, pero para algunos podemos inventar, ¿no? Igual yo creo que eso forma parte también como el entusiasmo y como quedan, digamos, ah, mira que me dieron ese código, ah, entonces mira que me dieron tal cosa para avanzar, entonces eso lo van También de eso genera un evento, eso genera también una disposición para que la gente pruebe los distintos nodos de las distintas células dentro de la misma ruta de Expo Winner, ¿no? Yo lo veo así.
- **[20:44] Yo:** Sí, de acuerdo, pero ahí, James, que se ha hablado con los otros equipos.
- **[20:44] Yo:** La integración con, no sé si han tenido otros espacios de incluir algo también.
- **[20:44] Jaime Guevara:** No, no, nada, no, o sea, en este momento no tenemos así como que nosotros podamos dar incentivos, no, la verdad no.
- **[20:44] Jaime Guevara:** Creo que no estamos como en el, con el tiempo como para movilizarlo.
- **[20:44] Yo:** Para agregarlo.
- **[20:44] Yo:** Si usted pregunta por qué no entiendo igual en este momento.
- **[20:44] Jaime Guevara:** Sí.
- **[20:44] Yo:** La profundidad del modelo de incentivo.
- **[20:44] Yo:** Que tiene la ruta winner. Sé que van acumulando, pero no sé cómo las unidades que manejan ni si hay algún ponderado, no sé eso.
- **[20:44] Yo:** Me parecería chévere aplicarlo, pero pienso que pasa lo mismo de que como no tenemos, no tenemos diseñado nuestro lado.
- **[20:44] Jaime Guevara:** Sí, de pronto igual, igual démosle prioridad a sacar lo básico y si nos queda tiempo de
- **[20:44] Yo:** Al menos para que la demás ahora pueda.
- **[20:44] Yo:** Sí.
- **[20:44] Jaime Guevara:** Para negociar si podemos generar un incentivo y eso, pues.
- **[20:45] Jaime Guevara:** O sea, que no sea eso lo prioritario, no. Ahorita lo prioritario es que podamos desplegar y que nos valide seguridad.
- **[20:45] Yo:** Y el incentivo solamente sería que agreguemos lo que sea que sea la ruta winner, y como yo lo estoy dibujando, o sea, que si es por puntos, pues que nosotros aportemos puntos. Si es medallitas, estrellitas, Algo a la hora de progreso, pues que lo hagamos, porque lo que dice Imich es no haríamos nada tangible, solo es que trata de incentivar la participación para lograr cumplir Y también, ¿qué pasa si logran completar la ruta? Más allá, o sea, en este momento no sé qué se entiende por completar la ruta más que lograr el 100%. No sé eso qué significa para un asistente, si eso de alguna forma van a haber premios o algo, o van a participar Para otras cosas, pero bueno, somos un tema de mercadeo realmente.
- **[20:45] Jaime Guevara:** Mm-hmm.
- **[20:45] Yo:** No, pues a mí me queda clara la intención ahí. Entonces, bueno, ¿cómo hacemos ustedes? ¿Qué les faltaría de la parte funcional para que esté a tope?
- **[20:45] Yo:** Al 100%, o ya está.
- **[20:46] Michel David Pino Aguilar:** Pues dentro de lo funcional.
- **[20:46] Michel David Pino Aguilar:** Está completo.
- **[20:46] Michel David Pino Aguilar:** Dentro de lo medible estamos aplicando lo que es Clarity al repositorio donde va a estar desplegado esto para recopilar información como tal de comportamiento. Y la vaina es que ahí tenemos otra idea, que yo creo que ya Juan tiene algo de eso, que nos permita también recopilar como La priorización de lo que ya tenemos planteado en los pedoces de la célula, de una manera pues muy sutil en la que los usuarios como que den skip o le den valor.
- **[20:46] Michel David Pino Aguilar:** Asierta.
- **[20:46] Michel David Pino Aguilar:** Como como ciertas cards que traen consigo información de los proyectos que ya estamos desarrollando dentro de la célula, pero sin cargar cognitivamente a los usuarios. Es como lo más importante de esos pequeños pasos que vamos a tener para poder recopilar la mayor cantidad de data posible sin hacer una tarea hiper mega compleja pues para los asistentes. Entonces ya Juan Diego
- **[20:47] Yo:** Una duda.
- **[20:47] Yo:** Tratando de imaginar.
- **[20:47] Yo:** ¿Cuál va a ser el storytelling dentro del workshop? Ahora, uno, este flujo solamente se va a activar dentro del workshop o va a ser un flujo activo durante los 2 días de eventos.
- **[20:47] Juan Diego Bautista Vasquez:** No, yo siento que todo debería ser más activo. No sé, yo por ejemplo pensando en el AI Summit, que fueron más o menos unas 1000
- **[20:47] Jaime Guevara:** personas.
- **[20:47] Juan Diego Bautista Vasquez:** La mayoría, o sea, los que asistían en realidad al workshop fueron como 30, 40. También los Colombia, el Colombia Fest, el Colombia Tech y todos estos que yo asistió la mayoría de gente en verdad a los workshops como que tiene un poquito más de recelo como que prefiere estar por ahí tanteando por todos lados y creo que los proveedores también van a llevar cada uno como su medio dinámica había un man que era Todo loco que queríais que llevara un Ferrari. Obviamente no lo dejaron, pero entonces creo que eso también da pie a que los proveedores también quieren generar como dinámica en cada uno de los stands para que asistan. Incluso yo le decía a Pino como que hasta qué punto llegamos como de lo que se está trabajando tanto de los equipos de marketing como de nosotros, o sea, y hasta qué
- **[20:48] Juan Diego Bautista Vasquez:** punto queremos traer información y cómo mostrar e incentivar y yo creo que los incentivos sí pueden ayudar bastante pueden ser cosas muy sencillas como es que no sé marketing tiene trescientas gorras ahí recibe una Gorra, pues, y si completas los primeros, no sé si quedas en primer lugar y hacen un ranking en vivo, yo no sé, alguna vaina así, que creo que eso no es tan complejo. Y también hay cosas más chiquitas Creo que alguna vez veía como lapiceros, y seguramente pues para el evento cada uno tendrá cientos de cientos de comercial. No sé, que nos den 10 termos o nos den 5 vainas como no tan comunes, 5 baterías portátiles. Creo que las que más regalan. Yo tengo como dos, yo puedo donar una o algo así me refiero, porque también pues la otra idea que teníamos es ahora hacer el nuestro, era un poco más abierta. como para ver qué otras cosas metíamos digamos que estuvimos va y cogiendo a la maldita sea a ver qué nos salía y entonces lo que necesitábamos era era algo así como un drop y
- **[20:49] Juan Diego Bautista Vasquez:** encuesta más que todo como para ir conociendo al tipo de usuario que faltaría seguramente marca y entonces después vas como en cada uno de los flujos mirando entonces seguramente el de productos pero también tienes temas como de confirmación que estuvimos trabajando O también tienes temas como con las guías y las transportadoras, o tu mayor dolor es con las novedades, o marica, las devoluciones se tienen que invertir en plata, o en verdad es que solucionaste esto pero aún así no ves un peso. Y no sabes cuánto tiene, de pronto también toca tocarla. Entonces aquí lo que pensamos es meter como un ranking o algo donde la persona escoja su top, y después de ese, de acuerdo a las respuestas, ya le va, ya le salga aquí como, yo no estoy presentando Y aquí ya le salió como su alerta de cobertura, no sé qué. Esto me gusta, no, eso no me sirve. Drop aquí, sí, ya lo vi, pero pues qué. Elige tu transporte ahora. El que lo pide ya ha protegido Transportadora, uy sí eso me encanta lo necesito. Cartera clara de qué te deben y cuánto entra. No ya no la he revisado trabajar. No sé pero incluso casa productos también que lo hemos pensado y que no ha tenido como muy buena opción.
- **[20:50] Juan Diego Bautista Vasquez:** Ah bueno, marica, por ahí va. Resuelve tus novedades en bloque. Quiero de pronto lo que estábamos hablando un poco esta semana: selecciona 30 novedades, 30 pedidos con novedades, y aplicas la misma acción a todos en vez de entrar uno por uno.
- **[20:50] Yo:** Sabes qué pienso, Juan, que esto, esto ahora está una chimba. James, para que el próximo evento, bueno, nos vamos por irnos 4 meses antes porque historia, historia ha sido una Pero si quiere decir organismo, por ejemplo, para que explote todo este flujo, le generará la agenda. Como vea, usted está en este workshop, este otro evento. Uf, ahí está una chimba de subsito acá. Sí, sino que pues nos inundó muy hacia el final, pero ah, que el próximo se lo solteran producto completo.
- **[20:50] Juan Diego Bautista Vasquez:** Claro.
- **[20:50] Juan Diego Bautista Vasquez:** Hey, Jerry.
- **[20:50] Juan Diego Bautista Vasquez:** Claro, esa es la idea.
- **[20:50] Michel David Pino Aguilar:** Claro.
- **[20:51] Juan Diego Bautista Vasquez:** Sí, claro. Y después, eso era lo mismo. Entonces ya después con tus respuestas ya sabemos qué te interesa y le ponemos de una vez, Marica, mira lo de la transportadora. Entonces ahí Y conectamos las ideas con lo que él escogió y con su necesidad, y nos vamos más a fondo. Ya se lo puse en la cabeza, ya me dijo que no sé, que lo más difícil es encontrar un producto, trabajar las devoluciones. En este caso escogí a las transportadoras. Ah, marica, que es lo que más le gusta. ¿Cómo la escogí hoy? No, la más barata. No, la que llegue a Amazonas. No, la que menos me falla. No, la que siempre funciona. Siempre escojo la misma, nunca cambio, o no escojo la que me asigna Dropi, nunca, nunca he tocado ese, ni siquiera sé cómo se escoge. Ah, bueno, y también conocemos un poco ese tipo de madurez del usuario. Ver cómo le escoge y saber su prioridad, y así va seleccionando de lo que ya dijo que le dolía. Entonces ya de una vez lo clasificamos, lo entendimos y le propusimos, y lo llevamos en un flujo muy bueno. Y aquí
- **[20:52] Juan Diego Bautista Vasquez:** Pues también una idea de las que, de lo que decía Pino, a cómo incentivarlo, porque seguramente si alguien está más de 3 minutos llenando algo, la arma mamera y no lo va a terminar.
- **[20:52] Juan Diego Bautista Vasquez:** Y ya.
- **[20:52] Juan Diego Bautista Vasquez:** Luego reclama mi premio, alguna vaina. Ve con el código, pulso Jaime Santiago y reclama, no sé, quedas de 11 o algo así. Reclama tu gorra, tu lapicero, tu galleta, yo no sé. Comprar más harina, nos ponemos a hacer galletas o alguna vaina así, pero ponemos un logo de droguita.
- **[20:52] Juan Diego Bautista Vasquez:** Y ya esas dos eran las que pensábamos. Y aquí pues los datos son re importantes, tal vez incluso al inicio.
- **[20:52] Yo:** Igual al inicio el flujo de exponer tiene que el registro también, que es con el correo y el número celular.
- **[20:52] Yo:** Entonces ahí ya vamos.
- **[20:52] Juan Diego Bautista Vasquez:** Ahora bien,
- **[20:52] Yo:** Ya lo de la, del modelo de incentivos y demás, yo creo que no. Bueno, ahí sí no me meto. Y James, no sé si eso se puede viabilizar con ventas o con marketing o con alguien.
- **[20:53] Jaime Guevara:** Pues yo creo que
- **[20:53] Yo:** irnos del modelo que ellos tengan, más porque
- **[20:53] Jaime Guevara:** Juan de ahí.
- **[20:53] Jaime Guevara:** Yo creo que sería bueno como en el grupo mencionarlo, a ver.
- **[20:53] Jaime Guevara:** Pero eso es el único que lo va a hacer, entonces.
- **[20:53] Jaime Guevara:** Trata de negociar ahí con marketing, de pronto.
- **[20:53] Juan Diego Bautista Vasquez:** Sí, a ver si nos dan algo, no sé, algo. Ellos, pues yo sé que en la oficina y todo Lucho tiene para regalar para cualquier líder conocido, proveedor que vaya y visite, que seguramente hay de sobra, claro. Ahora el problema es sacarlo de la oficina, pero de hecho creo que se puede, seguramente.
- **[20:53] Juan Diego Bautista Vasquez:** Aparte, los proveedores que hacen eso son proveedores de drop-in, entonces no creo que tengan tanto problema en hacer más.
- **[20:53] Juan Diego Bautista Vasquez:** Pero listo, vamos a ver entonces si enviamos este como para que
- **[20:54] Jaime Guevara:** también lo vean. Te voy a etiquetar ahí, escríbelo ahí porfa, a ver qué te dice Andrés
- **[20:54] Juan Diego Bautista Vasquez:** Felipe.
- **[20:54] Yo:** Listo, les siga.
- **[20:54] Yo:** Vamos a ver, vamos a ver. ¿Qué más me preguntar entonces? Lo dejaría recapitulando, se dejaría abierto a los 2 días de evento, no se dejaría solo en el workshop. Es decir, Jaime, que tendríamos para el workshop la presentación que vas a hacer estilo jobs, ¿cierto?
- **[20:54] Yo:** Pero dígame si sí o si no, porque el martes toca confirmar eso. Si va a presentar como yo.
- **[20:54] Jaime Guevara:** Sí, sí, no, pues todo bien. Ya me embaló. Ahí ahora el busito.
- **[20:54] Yo:** Sí, sí, negro, toda la mierda.
- **[20:54] Yo:** Entonces, whatever.
- **[20:54] Yo:** Se va a presentar Pulso del lado del flujo de la asistentella.
- **[20:54] Yo:** Vamos a dejarlo abierto también a los 2 días, pero vamos a aprovechar es para hacer unas encuestas a los asistentes.
- **[20:54] Yo:** La propuesta.
- **[20:54] Yo:** Es que sean al workshop asistan 60 personas, 10 por cada tipo de dropshipper según cómo está en leyenda dropy, es decir uno de bienvenidos, de VIP, leyendas, explorar todas esas tipologías como es el que ya existe.
- **[20:55] Yo:** Más para recopilar una data sobre el comportamiento que tienen al momento de escoger productos. Para eso vamos a aprovechar el workshop sobre todo, y para que terminen el flujo completo. Ustedes, Juan D y Mich, necesitarían algo puntual del workshop.
- **[20:55] Yo:** O nada, o presentar.
- **[20:55] Yo:** ¿Quién presentará algo? O sea, esos, esa hora que vamos a tener, digamos que 30 se llevan en la parte de Gali.
- **[20:55] Yo:** Unos 10 en la parte de pulso, todavía tenemos unos 20 aproximadamente del lado de selección de transportadoras. ¿Quieren agregar algo?
- **[20:55] Yo:** Dentro de eso, o pueden aprovecharlo para igual impulsar un poco la parte de lo mismo, de que está esa opción dentro de la aplicación para que la exploren y expliquen un poco. ¿Quieren sacar un espacio ahí?
- **[20:56] Yo:** O nada.
- **[20:56] Yo:** Hablar dentro del workshop, solamente dentro de esa hora que vamos a tener.
- **[20:56] Juan Diego Bautista Vasquez:** No, yo creo que más como en la aplicación, que a lo mejor
- **[20:56] Yo:** Listo, entonces, James, nos vamos con qué.
- **[20:56] Yo:** No habría como una intervención.
- **[20:56] Yo:** Directa sobre el workshop del lado de logística, está sobre la aplicación de los 2 días, correcto.
- **[20:56] Yo:** ¿Estamos alineados con eso?
- **[20:56] Jaime Guevara:** De una.
- **[20:56] Yo:** Listo.
- **[20:56] Yo:** Entonces ahí es que yo le mandé para el martes, yo le había propuesto a Lau Contreras que para, como tenemos tantas reuniones como de 30 minutos, 15 minutos, pues claramente porque hay otros temas.
- **[20:56] Yo:** Tratamos de hacer un corte al martes.
- **[20:56] Yo:** ¿En la tarde?
- **[20:56] Yo:** Esa reunión es toda la tarde. Igual le mando una propuesta a agenda, sí.
- **[20:56] Yo:** Claramente no todos tendrán que estar toda la tarde ahí, pero es más como para que ya hagamos el barrido punta a punta. Es como esa validación prevuelo que pues es bueno hacer, como de que ya estemos Todo alineado, o sea, en que seguramente habrán ajustes menores que se harán en los últimos días, pero para que empecemos el chequeo como listo, Gali tiene completo todo, ya está integrado, ya cumplió todo lo que, o está en proceso de cumplir todo lo que pidió. Seguridad, selección de transportadora, listo, integrado, ya tiene lo de Clarity, listo, check. Empecemos a hacer el check completo, que si salen igual, seguramente salgan temas pendientes, pues los podemos resolver miércoles. Jueves y viernes, que ojalá sean menores, ¿no? Lo ven bien, quieren añadir algo ahí, cambiar algo.
- **[20:57] Juan Diego Bautista Vasquez:** No sé, ¿y dónde lo pasamos o dónde lo unificamos? O qué es, que no sé.
- **[20:57] Yo:** Listo.
- **[20:57] Yo:** Entonces, James, ahí ellos lo subirían sobre el que tenemos nosotros de Gali, ¿cierto? Iniciamos en ese y luego sí pasamos completo al que nos entregó la persona Luego lo pasamos a ese, el principal.
- **[20:58] Juan Diego Bautista Vasquez:** Liliana.
- **[20:58] Yo:** Eso lo pasamos primero entonces al interno de producto.
- **[20:58] Juan Diego Bautista Vasquez:** Ya nos sirve.
- **[20:58] Jaime Guevara:** Ajá, y de ahí ya hacemos el deploy al otro.
- **[20:58] Yo:** Acoplamos todo ahí.
- **[20:58] Yo:** Listo, ok.
- **[20:58] Yo:** ¿Hay algo que no sé para qué?
- **[20:58] Yo:** Lo validemos de hecho con Alejandra también, y es nosotros también tenemos que todavía añadirle las herramientas de seguimiento, pero no sé si Clarity, al final, como toca ejecutarlo sobre el principal, creo que es así, no se ejecuta sobre el repo principal, tendríamos que pedir también ahí las autorizaciones para que lo podamos hacer ahí. Ahí, James, que sobre el de la aplicación completa dejen que se ejecute Clarity, que no vayan a poner problema por eso, ¿no?
- **[20:58] Jaime Guevara:** Mm-hmm.
- **[20:58] Jaime Guevara:** Claridad para qué es.
- **[20:58] Yo:** Es el que hace el mapeo del comportamiento y el seguimiento en tiempo real sobre la pantalla del usuario.
- **[20:59] Yo:** Entonces, perfecto.
- **[20:59] Jaime Guevara:** La instalación de Clarity.
- **[20:59] Yo:** ¿De verdad?
- **[20:59] Jaime Guevara:** La instalación de Clarity, sí.
- **[20:59] Yo:** No, no, el que lo esté instalando, lo instalar es Mitch para transportadoras, pero nosotros seguramente no lo definimos. Con Alejandra seguramente también nos vamos a ir por Clarity para ver la conducta del usuario sobre pantalla, sobre la pantalla.
- **[20:59] Yo:** Allá eso es a nivel de herramientas que van a permitir hacer el monitoreo y luego sacar la data.
- **[20:59] Jaime Guevara:** Ok.
- **[20:59] Yo:** Porque pues no nos va a bastar, o sea, en un punto sobre productos, si hablamos métricas, llamémoslas métricas PM, nosotros a punta de eventos de backend sacamos lo que termina Y nada haciendo, no. Si lo creó, lo exportó, lo bajó, lo descargó, lo importó, lo que sea, lo podemos hacer. Pero ya sea aspectos de usabilidad, Clarity es el que lo habilita. Y Michel o Juan, dime, corrigen. Pero el que lo habilita realmente es Clarity al momento de ver por dónde, cuántos, bueno, aunque es que no vamos a mapear claramente el mouse, el cursor, porque pues no va a estar sobre la web, está sobre el Un móvil, pero sí puede ver cuántas veces escrolleó de arriba hacia abajo antes de dar clic, por ejemplo.
- **[20:59] Jaime Guevara:** Sí.
- **[21:00] Yo:** O sí, más que
- **[21:00] Jaime Guevara:** El tiempo,
- **[21:00] Michel David Pino Aguilar:** el tiempo, por ejemplo, ya los tengo que
- **[21:00] Jaime Guevara:** dejar porque el coso me cuenta en Cholín.
- **[21:00] Yo:** Bueno, pero entonces ya si quieren, Mitch, ¿ya tienes montado Clarity en el repo o apenas lo vas a hacer?
- **[21:00] Yo:** Él tuvo que empezar a estar ejecutándolo.
- **[21:00] Michel David Pino Aguilar:** Pues estoy en el proceso de hacerlo en este momento. De hecho, usando el ordenador, sí, como decía. Pero entonces mira, yo tengo una pregunta. O sea, nosotros lo que vamos a tener es un Bitly público, ¿no? Entonces Dentro de la estructura de lo que ya tienen planteado, lo único que necesitamos es un endpoint o un espacio dentro de lo que ya tengan que nos permita almacenar el URL. El proceso de medición y tal Entonces, ¿cuál va a ser el trigger del deep link externo? Y en qué punto Pero bueno, pues a ver qué tal. Y pues la implementación de la aplicación que ya tenemos, que la vamos a poner. Y pues como discutir también la representación visual de eso, ¿no? Como que vamos a decir, no, prueba aquí, por ejemplo, hablando de transporte, prueba aquí. Revisa tus transportadoras con IA, por ejemplo, así, en qué punto estaría. Y al final solamente pega una red de una vez que nosotros mismos tenemos como el control. Lo que sí habría que hacer es el link público.
- **[21:00] Yo:** Brento.
- **[21:01] Michel David Pino Aguilar:** Por tenerlo dentro del aplicativo y que también pueda retornar, que eso es algo que yo tengo que hacer desde lo que yo organicé acá. Porque si vos viste al final, dice volver a ruta winner, entonces yo necesito dentro de ese Puedo meter el URL del punto en el que el usuario es redirigido a mi Bitly, pueda volver y viceversa, para que no haya como callejones sin salida ahí.
- **[21:01] Yo:** Hombre, nosotros entonces ahí como tratando de llevar los pasos a seguir es nosotros en la, a ver.
- **[21:01] Yo:** Llamamos Kate.
- **[21:01] Yo:** Hay varios repos en este momento, entonces está el repo que tienen ustedes.
- **[21:02] Yo:** Con lo de selección de transportadores está el repo de, llamémoslo, Expo Winners producto, interno producto.
- **[21:02] Yo:** Es decir, hasta donde hemos conversado, la idea es que lo de transportadoras entre al de producto, que es donde está Gali, lo de escaneado, winner y todo eso, ¿cierto?
- **[21:02] Yo:** Pero adicional hay una capa más arriba que estaría siendo como el gran paraguas, que es el del evento.
- **[21:02] Yo:** Que es el que, de que la aplicación que está construyendo marketing con desarrollo, que es donde las personas se registran y todo esto. Entonces, si ya lo sabían, estoy solamente tratando es como de Pilar información para que todos estemos al mismo, pero la idea es que ya la aplicación de producto que embebe tanto Galí, selección de transportadoras y otras.
- **[21:02] Yo:** Entre.
- **[21:02] Yo:** En el repo principal, que es el de todo el evento.
- **[21:02] Yo:** Entonces lo que nos estuvo pidiendo Jaime, de hecho, fue entreguemos por lo menos las primeras versiones porque ellos seguramente nos van a Hacer algunas solicitudes de ajustes en temas de seguridad, buenas prácticas y demás. Listo, entonces por ahora, para que lo tengamos a pasos a seguir, es, les diría, una vez ya tengan como por lo menos el La primera versión, o no sé cuál sea como su corte ahí para definir, listo, esto ya se puede publicar, mándenlo.
- **[21:03] Yo:** Al de Galí, el principal de Galí Producto, es decir, de donde estamos haciendo todo con Aleja. Y cuando ya tratemos, si les parece, de estandarizar la entrega de producto completo Y decir listo, ya este Galí de producto está, que bueno, Expo Winners producto está con todo lo de nosotros. Ahora sí le hacemos la entrega a la aplicación principal del evento, ¿les parece? Y ahí ya vemos todo el tema El deep link y que nos entregan ellos hasta donde podríamos.
- **[21:04] Yo:** No sé, pero siento que nos pueden luego estar diciendo algunas limitaciones. Entonces quiero tratar de hacerlo lo antes posible para que si hay algo que ajustar, pues tengamos la otra semana. ¿Ustedes creen que esta semana podrían hacer Ese merge a la de producto, a la de exponer producto.
- **[21:04] Michel David Pino Aguilar:** Sí.
- **[21:04] Yo:** De hecho, Alejandra va a subir hoy una primera versión.
- **[21:04] Yo:** De los cambios que vamos a hacer sobre Gali a esa aplicación. Ahí está el juego y todo lo que ustedes han visto. Entonces, cuando, si les parece, tratemos de hacer el corte esta semana, hacemos el paso, la sincronización con principal y que tengamos de lunes a viernes de la otra semana para hacer ajustes que nos pidan, pero ya todo lo hacemos sobre él, sobre esa.
- **[21:04] Michel David Pino Aguilar:** Ya, entonces, entonces compartime.
- **[21:04] Michel David Pino Aguilar:** Ese repo para poder hacer el pull request y que hagan merge del administrador.
- **[21:04] Yo:** Ya le pido a James que te dé acceso porque está sobre la cuenta de Jaime. Ya le digo que te envíe, que te dé los accesos.
- **[21:04] Michel David Pino Aguilar:** Listo.
- **[21:05] Yo:** Listo, de una. Así quedamos entonces.
- **[21:05] Michel David Pino Aguilar:** Dale una.
- **[21:05] Michel David Pino Aguilar:** Estoy bien, vale.
- **[21:05] Yo:** Pues todo eso cuidado.
- **[21:05] Michel David Pino Aguilar:** Todo bien, Santi, gracias.
- **[21:05] Michel David Pino Aguilar:** Chao.