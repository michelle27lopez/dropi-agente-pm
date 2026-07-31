# Leyendas Dropi — Programa de Gamificación y Fidelización

> **v7.0 · Junio 2026 · Uso interno · Área Growth**
> Estado MVP: en desarrollo, lanzamiento **septiembre 2026**.
> Esta versión incorpora los lineamientos de la reunión del 24 jun 2026.

---

## TL;DR para decidir

**Qué es:** sistema de gamificación transversal de Dropi que lleva al usuario desde su primer día hasta operador consolidado, con dos perfiles (dropshippers y líderes de comunidad), cada uno con su propia mecánica.

**La tesis que justifica todo:** el churn cae **82%** cuando el dropshipper llega a **100 órdenes/mes** (≈ $10M COP en ventas). Todo el diseño está orientado a empujar al usuario a ese umbral y luego retenerlo.

**Qué sí entra al MVP:** drops, 6 niveles de dropshipper con evaluación mensual, los 3 ejes de líderes, Dropicoins para líderes (1 DC por orden en su red), rankings, actualización diaria, operation por país e integración con el Programa de Iniciación.

**Qué NO entra:** redención de Dropicoins (canje), puntos por calidad operativa (v2), acumulación global entre países, grupo empresarial, perfiles de proveedor.

### Decisiones y pendientes que bloquean desarrollo

| Pendiente | Responsable | Qué bloquea | Criticidad |
|---|---|---|---|
| Tasa de conversión drops → Dropicoins | Growth + Finanzas | Capa de redención (post-MVP) | Crítico para no desbordar costos |
| Valor monetario de 1 Dropicoin | Growth + Finanzas | Capa de redención (post-MVP) | Crítico para no desbordar costos |
| Umbrales de líderes (Efectividad y Popularidad) | Growth + Líder comercial | Desarrollo de líderes en el MVP | Bloquea MVP |
| Fórmulas y promedios de segmentación por mes | Data + Producto | Base de datos de Leyendas | Bloquea MVP |
| Definición técnica de "orden completada" | Data + Producto | Algoritmo de acumulación | Bloquea MVP |
| Diseño front-end embebido en Dropy | Producto + Diseño | Lanzamiento MVP | Bloquea MVP |
| Tiempos de permanencia por nivel (dropshipper) | Growth | Reglas de descenso | Definición de negocio |
| Arquitectura de grupo empresarial (aunque no se lance) | Producto + Fabian Castro | Costo de implementar retroactivo | Recomendado resolver ya |

**Riesgo abierto señalado en el propio doc:** si los umbrales de popularidad de líderes (1K/10K/20K afiliados activos) no son alcanzables con la base actual, el eje no genera aspiracionalidad. Hay que validarlo antes de fijarlos.

---

## 1. Alcance general y principios

Leyendas acompaña al usuario desde su primer día hasta operador consolidado, generando hábitos de venta sostenidos, pertenencia y progresión continua. Opera sobre dos perfiles con mecánicas propias:

- **Dropshippers (vendedores individuales):** foco en escalar órdenes mensuales y mantener calidad operativa.
- **Líderes de comunidad:** foco en hacer crecer y mantener activa una red de afiliados.

**Principios del programa:**

- **Progresión visible:** el usuario siempre sabe en qué nivel está y qué le falta.
- **Datos del día anterior:** el sistema se actualiza una vez al día. Lo que completa hoy lo ve mañana. **Debe comunicarse claro en la interfaz.**
- **Independencia por país:** umbrales, niveles y beneficios se calibran según capacidad operativa local.
- **Sin redención en el MVP:** gamificación pura; los Dropicoins no se canjean hasta fase posterior.
- **Transversal al ecosistema:** debe conocerse desde el ingreso a Dropy e integrarse al onboarding.

---

## 2. Sistema de puntos — Dropicoins

Moneda única: **Dropicoins (DC)**. Unidad base de acumulación: **drop**.

| Concepto | Descripción |
|---|---|
| Nombre de la moneda | Dropicoins (DC) |
| Unidad de acumulación | Drop — 1 drop por cada orden completada |
| Conversión drops → DC | **Por definir** (pendiente análisis de costos) |
| Valor monetario de 1 DC | **Por definir** (pendiente análisis de costos) |
| Redención en MVP | No disponible — solo gamificación |
| Ciclo de datos | Actualización diaria (datos del día anterior) |

> ⚠ **Pendiente crítico:** definir cuántos drops = 1 Dropicoin y cuánto vale monetariamente. Es clave para evitar que el sistema se desborde en costos. Debe hacerse antes de desarrollar la capa de redención (fuera del MVP).

**Cómo se acumulan los drops:**

*Dropshippers*
- 1 orden completada = 1 drop al **saldo histórico acumulado**.
- La posición de nivel se calcula sobre las **órdenes del mes en curso** (no el acumulado histórico).
- Puntos adicionales por desempeño (tasa de entrega, devoluciones): contemplados para **v2**.

*Líderes de comunidad*
- 1 orden completada por cualquier usuario de su red = **1 Dropicoin (DC) directo al líder**.
- Acumulación simultánea: cuando una orden se completa en la red, el líder gana su DC al mismo tiempo que el dropshipper gana su drop.
- No es bonificación por salud de la red: es **acumulación paralela directa**.

---

## 3. Módulo Dropshippers

Progresión medida por **órdenes completadas en el mes en curso** (no acumulado histórico).

### 3.1 Niveles

| Nivel | Nombre | Órdenes mensuales | Perfil |
|---|---|---|---|
| 1 | Bienvenido | 0 – 100 | Nuevo, en activación |
| 2 | Explorador | 101 – 1.000 | Primeras ventas sostenidas |
| 3 | Master | 1.001 – 2.500 | Operador establecido, flujo estable |
| 4 | Experto | 2.501 – 5.000 | Alto volumen, empieza a optimizar |
| 5 | Sabio VIP | 5.001 – 20.000 | Consolidado, referente del ecosistema |
| 6 | Leyenda | 20.001+ | Élite del ecosistema |

*Fuente de umbrales:* Programa de Dropshippers 2026 — equipo comercial Dropi.

**Regla de nivel:** se evalúa mensualmente sobre las órdenes del mes; puede subir o bajar mes a mes. El **saldo histórico de drops se acumula permanentemente** — solo los niveles tienen evaluación mensual.

### 3.2 Motor de activación — Programa de Iniciación Dropshipping

Los niveles **Bienvenido** y **Explorador** están integrados con el Programa de Iniciación, que actúa como motor de activación para usuarios nuevos. Cruza dos dimensiones:

- **Dimensión 1 — Volumen:** Bienvenido (0–100) / Explorador (101–1.000).
- **Dimensión 2 — Conocimiento:** Aprendiz / Operador / Escalador / Experimentado.

La doble segmentación personaliza el acompañamiento (no es lo mismo un Aprendiz con 20 órdenes que un Experimentado con 80).

### 3.3 Detalle por nivel

#### Nivel 1 — Bienvenido · 0–100 órdenes/mes · Activación
**Perfil:** usuario en sus primeros pasos, conociendo el modelo, construyendo confianza. Objetivo central: cruzar el umbral de **100 órdenes** (el punto de no-churn).
**Beneficios:** atención al cliente vía botón flotante · eventos en línea abiertos · atención logística vía CAS · Dropi Academy (ruta de primeras ventas) · acumula Dropicoins (BASE 1 + BASE 2) desde la primera orden.
**Ascenso:** +100 órdenes en el mes · sin reportes de publicidad engañosa · perfil actualizado · uso correcto de módulos básicos.
**Descenso:** no aplica (nivel de entrada universal). Puede aplicar suspensión por malas prácticas graves.

#### Nivel 2 — Explorador · 101–1.000 órdenes/mes · Escalamiento inicial
**Perfil:** ya cruzó el umbral de no-churn, construye operación sostenida. **Segmento más grande: 44% de las órdenes activas en marzo 2026.**
**Beneficios:** botón flotante · eventos abiertos · CAS · Dropi Academy intermedio · BASE 1 + BASE 2 + bonus por nivel · aparición en ranking de top vendedores del mes (si aplica).
**Ascenso:** +1.000 órdenes/mes · sin publicidad engañosa · uso correcto de módulos · perfil actualizado.
**Descenso:** caer bajo el mínimo de permanencia de 100 drops por 2 meses consecutivos → baja a Bienvenido · 3 malas prácticas en 3 meses activan revisión.

#### Nivel 3 — Master · 1.001–2.500 órdenes/mes · Escalamiento
**Perfil:** desempeño aceptable, ya vende y necesita aprender a escalar.
**Beneficios:** botón flotante · eventos abiertos · CAS · Dropicard Virtual (solo top 3 de la categoría) · flujo exclusivo de atención vía botón flotante · bonus por nivel Master.
**Ascenso:** +2.501 órdenes/mes · sin publicidad engañosa · uso adecuado de módulos · confirmación de pedidos en tiempos · datos vigentes.
**Descenso:** volumen sostenido < 1.000 órdenes por 2 meses → baja a Explorador · 3 malas prácticas (publicidad engañosa) en 3 meses.

#### Nivel 4 — Experto · 2.501–5.000 órdenes/mes · Perfeccionamiento
**Perfil:** alto potencial de escala, en consolidación. Foco: optimización operativa y control estratégico. *Subcategorías internas:* Experto en Riesgo (falla 3+ criterios), Experto para seguimiento (falla 2), Experto Consolidado (falla máx. 1).
**Beneficios:** intermediación directa con áreas internas · cuidado de campañas (optimización/eficiencia) · ranking de ventas · conexión directa con proveedores e importadores · desarrollo de producto propio (ideal para escalar o crear marca) · bonus por nivel Experto.
**Ascenso:** +5.001 órdenes/mes · 3 meses de antigüedad como Experto · devoluciones ≤ 20% · cancelaciones ≤ 17% · sin publicidad engañosa.
**Descenso:** volumen < 2.500 sostenido → baja a Master · puntaje < 60 en matriz de evaluación · 3 malas prácticas en 3 meses.

#### Nivel 5 — Sabio VIP · 5.001–20.000 órdenes/mes · Excelencia operativa
**Perfil:** aliado estratégico de alto rendimiento; excelencia en ventas, logística y compromiso ético.
**Beneficios:** aplicativo de servicio (optimiza gestión de solicitudes) · visibilidad en el Home de Dropi (marketing de sus tiendas) · círculo de excelencia élite · "Conversemos con Lucho" (podcast exclusivo con los top) · eventos y reuniones exclusivas · bonus tasa diferenciada Sabio VIP.
**Ascenso:** +20.001 órdenes/mes · puntaje ≥ 80 en matriz · sin publicidad engañosa.
**Descenso:** < 5.000 órdenes sostenido 2 meses · 3 malas prácticas en 3 meses · manipulación de datos → revocatoria directa · publicidad engañosa confirmada → descenso inmediato.

#### Nivel 6 — Leyenda · 20.001+ órdenes/mes · Distinción máxima
**Perfil:** máxima distinción; resultados extraordinarios, crecimiento sostenido, excelencia operativa e impacto en comunidad.
**Beneficios:** todos los de Sabio VIP · beneficios exclusivos "It's Coming" (por definir con comercial) · acceso prioritario a nuevas verticales/productos · máxima tasa de acumulación de Dropicoins · reconocimiento como referente.
**Ascenso:** +20.001 órdenes/mes sostenidas · mantener estándares de calidad de Sabio VIP.
**Descenso:** volumen inferior recurrente → baja a Sabio VIP · publicidad engañosa → descenso inmediato · manipulación de datos → revocatoria directa.

> **Nota sobre permanencia (pendiente de negocio):** definir tiempos de permanencia por nivel. Propuesta: dar **1 mes** para que el usuario viva la experiencia del nivel antes de aplicar reglas de descenso. Para descender debe quedar por debajo del umbral **2 meses seguidos**.

### 3.4 Acumulación histórica
Mantener el número de **órdenes históricas** de cada usuario para evaluar su historial y premiar también por números históricos dentro de la plataforma.

---

## 4. Módulo Líderes de comunidad

El líder gestiona una red de afiliados y es el **principal agente de impulso y activación** del programa entre los dropshippers de su red. **Incluido en el MVP desde el lanzamiento**, no como fase posterior.

> **Regla anti-multinivel:** el líder **NO puede transferir Dropicoins a sus afiliados**. Si lo hiciera, el modelo se convertiría en esquema multinivel. La acumulación del líder es exclusivamente personal.

### 4.1 Tres ejes independientes

Un líder puede destacar en uno, dos o los tres a la vez.

| Eje | Métrica | Medición | ¿Acumula? |
|---|---|---|---|
| Efectividad | Órdenes entregadas totales (comunidad) | Permanente / acumulado | Sí — nunca baja |
| Popularidad | Afiliados activos en el mes | Mensual | No — se mide cada mes |
| Impacto Económico | Comunidades con GMV > USD 1M en el mes | Mensual | No — se mide cada mes |

### 4.2 Eje 1 — Efectividad (entrega de órdenes)
Premia el volumen **acumulado** de órdenes entregadas por la red. Permanente: el nivel solo sube.

| Nivel | Nombre | Umbral acumulado | Cinturón | Permanencia |
|---|---|---|---|---|
| 1 | Maestro | +10.000 órdenes entregadas | Bronce | Permanente |
| 2 | Élite | +50.000 órdenes entregadas | Plata | Permanente |
| 3 | Leyenda (líder) | +100.000 órdenes entregadas | Oro | Permanente |

*Solo órdenes con estado "Entregado confirmado", consolidando todas las cuentas del líder según el algoritmo de matching de Data.*

### 4.3 Eje 2 — Popularidad (afiliados activos)
Premia construir, activar y retener afiliados. Se evalúa mensualmente por **afiliados activos** (≥ 1 orden en los últimos 90 días) al cierre del mes.

| Nivel | Nombre | Umbral entrada | Cinturón | Permanencia |
|---|---|---|---|---|
| 1 | Estrella | +1.000 afiliados activos | Estrella | Insignia mensual renovable |
| 2 | Rockstar | +10.000 afiliados activos | Esmeralda | Placa permanente + insignia mensual |
| 3 | Ícono | +20.000 afiliados activos | Diamante | Placa permanente + insignia mensual |

> **Pendiente (con líder comercial):** validar si 1K/10K/20K activos es alcanzable con la base actual. **Si ningún líder está cerca, el eje no genera aspiracionalidad.** Propuesta de permanencia: 80% del umbral de entrada por nivel, a calibrar con la volatilidad mensual real.

### 4.4 Eje 3 — Impacto económico (nivel supremo)
El reconocimiento más exclusivo. Mensual, al líder cuya comunidad supere **USD 1.000.000 de GMV** en el mes. No acumulativo — se gana activamente cada mes.

| Opción | Nombre propuesto | Umbral | Cinturón físico | Tipo |
|---|---|---|---|---|
| A | Arquitecto de Millones | ≥ USD 1M GMV/mes | Negro / Plata | Alternativa |
| B | Forjador de Imperios | ≥ USD 1M GMV/mes | Negro / Oro 24K | **Recomendado** |
| C | Titán de Comunidad | ≥ USD 1M GMV/mes | Negro / Rubí | Alternativa |

*Dos meses consecutivos = placa adicional de permanencia. Superar USD 5M en un mes = subnivel Gran Forjador.*

### 4.5 Reconocimiento físico — Cinturones de campeonato
Reconocimiento flagship, inspirado en la lucha libre; representa el más alto nivel del ecosistema.
- Se diseñan y producen por categoría de reconocimiento.
- Se entregan en eventos especiales.
- **Lead time mínimo de producción: 60 días** (planear con anticipación).

---

## 5. Acumulación de Dropicoins — Líderes

| Evento | Acción del líder | Ganancia |
|---|---|---|
| Orden completada en la red | Ninguna (automático) | 1 DC por cada orden completada en su red |

Automática y simultánea: al completarse la orden de un afiliado, el sistema registra 1 DC para el líder al mismo tiempo, sin paso adicional ni condición sobre la salud de la red. La ganancia depende del **volumen de la red, no de la intervención** del líder → alinea su incentivo con el crecimiento real de la comunidad.

---

## 6. Alcance del MVP — Septiembre 2026

**Incluido:**
- Sistema de drops: 1 orden completada = 1 drop acumulado.
- 6 niveles de dropshipper con evaluación mensual.
- Reconocimiento de líderes en los 3 ejes.
- Dropicoins para líderes: 1 DC por orden completada en su red.
- Rankings y visualización de posición.
- Actualización de datos una vez al día (día anterior).
- Operación independiente por país.
- Integración con el Programa de Iniciación Dropshipping.

**Fuera del MVP:**
- Redención de Dropicoins (canje por productos/beneficios).
- Puntos por calidad operativa (v2).
- Acumulación global entre países (futuro).
- Grupo empresarial (múltiples cuentas del mismo operador) — ver §7.
- Perfiles de proveedor y otros actores (fases posteriores).

---

## 7. Grupo empresarial — Feature futuro

Varios dropshippers operan con **múltiples cuentas por razones tributarias**. Hoy acumulan drops por separado, lo que no refleja la realidad de su negocio.

**Propuesta:** permitir un "grupo empresarial" — cuentas que agregan sus drops a un perfil principal único.

**Reglas:**
- La agregación aplica solo a **drops y niveles**, no a pagos ni datos monetarios.
- Cada grupo tiene una **cuenta principal** (titular); los drops de las secundarias suman a esa cuenta.
- Todas las cuentas del grupo deben estar en el **mismo país**.
- La validación de asociación entre cuentas se define con el equipo financiero.

**Impacto técnico transversal:**
- **Atom:** las cuentas del grupo deberían aparecer como una sola en el panel.
- **Chatea Pro:** misma lógica de agregación.
- **Dropy Turbo:** integración a revisar.
- **Pay:** NO aplica agregación — los pagos se mantienen individualizados.

> **Recomendación:** diseñar la arquitectura del grupo empresarial **desde ahora**, aunque no se lance en el MVP. Implementarlo retroactivo sobre una base desplegada es mucho más costoso.
> **Acción:** agendar sesión de diseño técnico con **Fabian Castro** antes de iniciar el desarrollo del MVP.

---

## 8. Consideraciones técnicas

Basado en la experiencia de Dropy Turbo y los lineamientos de producto.

**Infraestructura de datos:**
- **Base de datos exclusiva para Leyendas:** almacena niveles, drops y segmento mensual por usuario. No consulta en tiempo real la base transaccional principal.
- **Job diario de procesamiento:** cada día actualiza el estado de cada usuario con las órdenes del día anterior.
- **Definición de "orden completada":** estado validado (hoy con período de espera de ~20 días), no un evento en tiempo real.
- Se conecta a **Chronos** (sistema interno de data de Dropi), igual que Dropy Turbo.

**Arquitectura general:**
- **Frontend embebido en Dropy:** módulo nativo, no portal externo.
- **Multipaís desde el diseño:** independencia por país desde el día uno.
- **Sin motor de redención en el MVP:** simplifica el alcance técnico inicial.

---

## 9. Equipo y próximos pasos

| Rol | Persona / Área |
|---|---|
| Líder de programa — Growth | Laura Sánchez |
| Sponsor ejecutivo | Jose Giraldo |
| Líder técnico / Producto | Fabian Castro Peralta |
| Embajadores del programa | Diwer Martinez / Laura Mira |
| Alineación comercial (umbrales) | Líder comercial (por confirmar) |

**Próximos pasos:**
1. Compartir el documento con Fabian Castro Peralta para revisión técnica.
2. Agendar sesión con líder comercial para definir umbrales de líderes (Efectividad y Popularidad).
3. Iniciar análisis de costos para la tasa drops → Dropicoins.
4. Agendar sesión de diseño de grupo empresarial antes del desarrollo.
5. Definir equipo de diseño y desarrollo front para la integración en Dropy.
6. Kick-off de desarrollo — meta: lanzamiento MVP septiembre 2026.

---

## 10. Identidad de marca — Playbook Leyendas

*Fuente: Playbook digital `cdropi.github.io/Playbook-Leyendas`. Documento de marca/diseño, complementario al programa. Buena parte de la copy narrativa todavía está en placeholder (ver "pendientes de marca").*

### 10.1 Objetivos comerciales (3)
1. **Fidelizar comunidad** — descripción pendiente.
2. **Impulsar ventas** — meta comercial concreta pendiente.
3. **Posicionar la marca** — percepción de marca a instalar, pendiente.

### 10.2 Línea visual

**Paleta de colores** (cada color está nombrado por rango, lo que confirma la intención de mapear color ↔ nivel):

| Color | Nombre | HEX |
|---|---|---|
| Blanco | Iniciado | #EAEAEA |
| Gris | Experto | #191919 |
| Naranja | Maestro | #FF8500 |
| Flama | Sabia | #FF4800 |
| Rojo | Leyenda | #FF0000 |

**Tipografías:**
- **Chakra Petch Bold** — títulos, encabezados y palabras clave.
- **Chakra Petch Regular** — párrafos, descripciones y etiquetas.
- **Rationale Regular** — uso exclusivo del logo.

**Logo:** "LEYENDAS" en mayúsculas, interletrado 300 pts. Variaciones monocromo sobre claro y sobre oscuro.

### 10.3 Insignias (sistema de rangos del Playbook)

| Rango | Nombre | Metal | Sub-niveles |
|---|---|---|---|
| 01 | Iniciado | Bronce | I · II · III |
| 02 | Experto | Plata | I · II · III |
| 03 | Master | Oro | I · II |
| 04 | Sabio | Platino | Única |
| 05 | Leyenda | — | Única |

*Requisitos y beneficios por insignia: pendientes en el Playbook.*

### 10.4 Premiación (premios físicos)
Cinturón (2 variantes), cajas de premio (2 variantes) y pin. Se conectan con el reconocimiento físico de líderes descrito en §4.5 (cinturones de campeonato, lead time 60 días).

### 10.5 Pendientes de marca (placeholders sin resolver)
- Descripción de "¿Qué es Leyendas?".
- Descripciones de los 3 objetivos comerciales.
- Tagline y los 3 pilares del concepto de marca.
- Título y contenido del manifiesto.
- Requisitos y beneficios de cada insignia.

---

## ⚠ Inconsistencia entre documentos (resolver antes de desarrollo)

Los dos documentos usan **estructuras de niveles distintas**. Esto no es cosmético: define cómo se nombran los niveles en el front, en la base de datos y en el algoritmo de evaluación.

| | Programa (PDF v7.0) | Playbook (marca) |
|---|---|---|
| Cantidad de niveles | **6** | **5** |
| Nombres | Bienvenido · Explorador · Master · Experto · Sabio VIP · Leyenda | Iniciado · Experto · Master · Sabio · Leyenda |
| Sub-niveles | No (solo subcategorías internas de Experto) | Sí (I/II/III por rango) |

**Diferencias concretas a alinear:**
- El PDF abre con **Bienvenido** y **Explorador** (dos niveles de entrada); el Playbook los colapsa en un solo **Iniciado**. El programa pierde o fusiona un nivel.
- El orden de rango no coincide: en el PDF **Master** (nivel 3) va **antes** de **Experto** (nivel 4); en el Playbook **Experto** (02) va **antes** de **Master** (03). Están invertidos.
- El Playbook introduce **sub-niveles I/II/III** que el programa no contempla en la mecánica de órdenes/mes.
- Naming suelto: "Sabio VIP" (PDF) vs "Sabio" (Playbook); "Maestro" (paleta) vs "Master" (insignias).

**Por qué importa:** si diseño y desarrollo arrancan con nomenclaturas distintas, el front dirá "Iniciado" y la base de datos "Bienvenido", y los sub-niveles del Playbook no tendrán regla de negocio que los soporte. Conviene una fuente única de verdad de niveles (nombres + orden + sub-niveles + umbrales) antes del kick-off, alineada entre Growth (Laura Sánchez), comercial y diseño.

---
*Dropi — Programa Leyendas v7.0 · Junio 2026 · Uso interno. Integra Playbook de marca (2026).*
