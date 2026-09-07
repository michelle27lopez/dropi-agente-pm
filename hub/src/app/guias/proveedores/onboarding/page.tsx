"use client";

import { SectionCard, H1, H2, H3, P, Fuente, Vacio, Callout, Tabla, Td, Tag, KPI, KPIRow } from "../_components/ui";

// ── Blueprint de servicio. Cinco carriles por paso.
const BLUEPRINT: {
  paso: string;
  proveedor: string;
  frontstage: string;
  backstage: string;
  sistemas: string;
  evidencia: string;
  evidenciaOk: boolean;
}[] = [
  {
    paso: "1 · Registro",
    proveedor: "Crea su cuenta con correo y contraseña",
    frontstage: "Formulario de registro",
    backstage: "El registro entra a GoHighLevel como «Nuevo registro» y dispara bienvenida por correo y WhatsApp",
    sistemas: "Dropi · UserPilot · GoHighLevel",
    evidencia: "2.212 inician el registro en 90 días",
    evidenciaOk: true,
  },
  {
    paso: "2 · Perfilamiento",
    proveedor: "Declara su etapa, volumen, categoría y cómo quiere operar",
    frontstage: "Encuesta de clasificación in-app",
    backstage: "Las respuestas quedan en la ficha del usuario y alimentan la priorización comercial",
    sistemas: "UserPilot · Supabase",
    evidencia: "7.678 respuestas acumuladas",
    evidenciaOk: true,
  },
  {
    paso: "3 · Datos de la empresa",
    proveedor: "Carga datos legales, bancarios y dirección fiscal",
    frontstage: "Formulario de perfil",
    backstage: "Si faltan datos mínimos, el CRM lo marca «Perfil incompleto» y envía recordatorio",
    sistemas: "Dropi · GoHighLevel",
    evidencia: "Sin medición propia de esta caída",
    evidenciaOk: false,
  },
  {
    paso: "4 · Primera bodega",
    proveedor: "Configura dirección, transportadoras y formatos de guía",
    frontstage: "Tour guiado paso a paso con tooltips",
    backstage: "Ninguno automatizado",
    sistemas: "Dropi",
    evidencia: "Eventos de tour: inicio, paso completado, paso revertido, tour terminado y bodega creada",
    evidenciaOk: true,
  },
  {
    paso: "5 · Primer producto",
    proveedor: "Llena datos generales, stock, imágenes, recursos y garantías",
    frontstage: "Formulario en pestañas: General, Stock, Imagen, Recursos, Productos privados, Garantías",
    backstage: "Ninguno automatizado",
    sistemas: "Dropi",
    evidencia: "Eventos de creación e intento de guardado",
    evidenciaOk: true,
  },
  {
    paso: "6 · Validaciones duras",
    proveedor: "Debe cumplir los tres mínimos o no puede guardar",
    frontstage: "Mensajes de error al guardar: stock bajo, faltan imágenes, faltan garantías",
    backstage: "Ninguno: la validación es automática",
    sistemas: "Dropi",
    evidencia: "El motivo del fallo queda registrado en cada intento",
    evidenciaOk: true,
  },
  {
    paso: "7 · Validación externa",
    proveedor: "Responde una encuesta sobre su capacidad operativa y financiera",
    frontstage: "Modal que lo invita a validarse, con salida a formulario externo",
    backstage: "Sin documentar quién la revisa ni qué desbloquea",
    sistemas: "Dropi · formulario externo · Supabase",
    evidencia: "Solo se registra que la encuesta se inició",
    evidenciaOk: false,
  },
  {
    paso: "8 · Auditoría",
    proveedor: "Espera",
    frontstage: "Sin visibilidad para el proveedor",
    backstage: "El CRM crea la solicitud automáticamente y la auditoría express corre en menos de 12 horas para prioridad alta",
    sistemas: "GoHighLevel",
    evidencia: "El tablero de la célula mide el tiempo de auditoría, pero con datos congelados en mayo",
    evidenciaOk: false,
  },
  {
    paso: "9 · Habilitación",
    proveedor: "Sus productos quedan visibles para dropshippers",
    frontstage: "El producto aparece en el catálogo",
    backstage: "Al aprobar la auditoría se habilita la visibilidad pública",
    sistemas: "Dropi · GoHighLevel",
    evidencia: "Sin medición de cuántos llegan aquí",
    evidenciaOk: false,
  },
  {
    paso: "10 · Primera orden",
    proveedor: "Recibe su primer pedido de un dropshipper",
    frontstage: "Notificación de orden nueva",
    backstage: "Seguimiento comercial en los días 0, 3, 7, 14 y 20; si no responde pasa a «En frío» y sale a campaña de reactivación",
    sistemas: "GoHighLevel · WhatsApp · Metabase",
    evidencia: "97 con orden generada · 18 con orden entregada",
    evidenciaOk: true,
  },
];

// ── Pipeline comercial en GoHighLevel · 11 etapas
const GHL = [
  { etapa: "Nuevo registro", accion: "Bienvenida automática por correo y WhatsApp" },
  { etapa: "Perfil incompleto", accion: "Recordatorio con link a la encuesta" },
  { etapa: "Perfil calificado", accion: "Asignación de prioridad alta, media o baja" },
  { etapa: "En activación", accion: "Secuencia de acompañamiento según prioridad" },
  { etapa: "Checklist completo", accion: "Creación automática de la solicitud de auditoría" },
  { etapa: "Pendiente auditoría", accion: "Auditoría express, menos de 12 horas si es prioridad alta" },
  { etapa: "Auditoría aprobada", accion: "Habilitación de visibilidad de productos públicos" },
  { etapa: "Proveedor activo", accion: "Seguimiento hacia la primera orden en días 0, 3, 7, 14 y 20" },
  { etapa: "Activo sin primera orden", accion: "Acción comercial o de catálogo específica" },
  { etapa: "Primera orden generada", accion: "Cierre del hito de valor, registrado en Dropi y en el CRM" },
  { etapa: "En frío", accion: "Sale de la cola activa y entra a campaña de reactivación" },
];

const GATES = [
  { gate: "Stock mínimo", regla: "100 unidades para productos públicos", motivo: "stock_low" },
  { gate: "Imágenes", regla: "Mínimo 3 imágenes cargadas", motivo: "images_low" },
  { gate: "Garantías", regla: "Las 3 obligatorias: orden incompleta, mal funcionamiento y producto roto", motivo: "warranties_missing" },
];

export default function OnboardingPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Blueprint de servicio: el proceso completo de incorporación">
          Onboarding del proveedor
        </H1>

        <P>
          El camino desde que alguien se registra hasta que recibe su primera orden entregada. Está
          instrumentado paso a paso del lado del proveedor, y casi sin documentar del lado de quienes lo
          atienden.
        </P>

        <KPIRow>
          <KPI valor="1,36%" label="Completa el registro" sub="~40 de 2.212 en 90 días" color="var(--danger)" />
          <KPI valor="97 → 18" label="De orden creada a entregada" sub="El punto exacto de fuga" color="var(--danger)" />
          <KPI valor="11" label="Etapas del pipeline comercial" sub="Automatizadas en GoHighLevel" />
          <KPI valor="620" label="Proveedores listos, meta a 6 meses" sub="Cortes de 104 · 207 · 310 · 517 · 620" />
        </KPIRow>

        <Callout icon="🕳️" color="var(--danger)">
          Hay dos fugas, no una. La primera está antes de existir como proveedor: de cada cien que empiezan
          el registro, algo más de uno termina con un producto guardado. La segunda está después: de 97 que
          logran generar una orden, solo 18 la entregan. La primera fuga es de producto, la segunda es
          operativa.
        </Callout>
        <Fuente
          origen="supplier-lab/docs/PROMPT_PRESENTACION.md (funnel UserPilot) · dashboard de activación en Metabase entregado por Enrique, reportado en el cierre de semana del 31-jul"
          corte="funnel últimos 90 días · Metabase 31-jul-2026"
        />
      </SectionCard>

      <SectionCard>
        <H2>El blueprint, paso a paso</H2>
        <P>
          Cinco carriles por cada paso: qué hace el proveedor, qué ve, qué pasa detrás, qué sistemas
          intervienen y con qué evidencia lo estamos midiendo.
        </P>

        <Tabla min={1120} head={["Paso", "Qué hace el proveedor", "Frontstage", "Backstage", "Sistemas", "Evidencia"]}>
          {BLUEPRINT.map((b) => (
            <tr key={b.paso}>
              <Td bold>{b.paso}</Td>
              <Td>{b.proveedor}</Td>
              <Td>{b.frontstage}</Td>
              <Td color={b.backstage.startsWith("Sin documentar") || b.backstage === "Ninguno automatizado" ? "var(--muted)" : "#4B5563"}>
                {b.backstage}
              </Td>
              <Td>{b.sistemas}</Td>
              <Td color={b.evidenciaOk ? "var(--success)" : "var(--warning)"}>{b.evidencia}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="supplier-lab/docs/PRODUCT_ACTIVATION_CONTEXT.md (12 hitos y eventos) · hub/src/app/proyectos/time-to-value/ (capa de activación) · UserPilot (encuesta de clasificación)"
          corte="jul–ago 2026"
        />
      </SectionCard>

      <SectionCard>
        <H2>Las tres puertas que hay que cruzar</H2>
        <P>
          Para guardar su primer producto el proveedor tiene que cumplir tres reglas duras. El sistema
          registra cuál de las tres lo detuvo cada vez que falla, así que se puede saber exactamente qué
          está frenando a la gente.
        </P>

        <Tabla head={["Puerta", "Regla", "Motivo que se registra al fallar"]}>
          {GATES.map((g) => (
            <tr key={g.gate}>
              <Td bold>{g.gate}</Td>
              <Td>{g.regla}</Td>
              <Td><Tag color="var(--muted)">{g.motivo}</Tag></Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="supplier-lab/docs/PRODUCT_ACTIVATION_CONTEXT.md · validaciones estrictas del flujo de creación de producto" corte="jul-2026" />

        <Callout icon="🔬" color="var(--info)">
          Hay un experimento diseñado alrededor de esto y todavía sin correr con usuarios reales: reemplazar
          las pestañas de navegación libre por un asistente secuencial que bloquea el paso hasta cumplir cada
          regla. La hipótesis es que hoy el proveedor novato llega al final y recibe todos los errores
          juntos, lo que dispara el abandono. El criterio para declararlo ganador ya está escrito: subir más
          de 30% la finalización del perfil novato sin frustrar al experto.
        </Callout>
        <Fuente origen="supplier-lab/docs/EXPERIMENT_01_WIZARD.md" corte="2026" />
      </SectionCard>

      <SectionCard>
        <H2>El pipeline comercial detrás</H2>
        <P>
          Lo que el proveedor no ve. Once etapas en el CRM, desde que aparece su registro hasta que se cierra
          el hito de la primera orden o se enfría.
        </P>

        <Tabla head={["#", "Etapa", "Qué se dispara"]}>
          {GHL.map((g, i) => (
            <tr key={g.etapa}>
              <Td bold>{i + 1}</Td>
              <Td bold>{g.etapa}</Td>
              <Td>{g.accion}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="hub/src/app/proyectos/time-to-value/alcance/page.tsx · pipeline de GoHighLevel definido para TTV-001" corte="jul-2026" />

        <Callout icon="⚙️" color="var(--warning)">
          Este pipeline arrastra un problema abierto desde hace meses: el identificador de usuario del
          backend no coincide con el de UserPilot, así que emparejar el comportamiento real de un proveedor
          con su ficha en el CRM sigue siendo frágil.
        </Callout>

        <H3>Qué se aprendió intentando acelerarlo</H3>
        <P>
          En julio se probó un plan de choque: diez llamadas directas a proveedores identificados como de
          alto potencial según el formulario de entrada. No funcionó. Algunos contestaron, algunos agendaron,
          pero el interés en recibir acompañamiento fue bajo. El hallazgo de fondo fue otro: el formulario no
          es confiable, mucha gente declara un volumen que no tiene, y eso contaminó la lista entera.
        </P>
        <P>
          La decisión fue pivotar. En lugar de creerle a lo que el proveedor declara, un agente de WhatsApp
          califica su comportamiento real y solo los que pasan ese filtro reciben contacto humano. El agente
          dejó de ser una automatización del onboarding para volverse el control de calidad previo.
        </P>
        <Fuente origen="hub/src/app/weekly/data/2026-07-31.ts · cierre de semana de la célula" corte="31-jul-2026" />
      </SectionCard>

      <SectionCard>
        <H2>Lo que sigue sin saberse</H2>

        <P>
          El carril de backstage es el más flaco de todo este documento. Sabemos qué se dispara
          automáticamente, pero no quién ejecuta cuando hace falta una persona.
        </P>

        <Vacio
          pregunta="¿Quién audita y aprueba la visibilidad de un producto nuevo, y con qué acuerdo de servicio?"
          dueno="Jaime Guevara (PM) o el equipo de operaciones"
          detalle="El pipeline dice «auditoría express en menos de 12 horas para prioridad alta» y el tablero de la célula mide un tiempo de auditoría en horas, pero ninguna fuente dice qué persona o equipo la ejecuta, qué revisa, ni qué pasa cuando la rechaza."
        />

        <Vacio
          pregunta="¿Quién revisa la encuesta de validación externa y qué desbloquea aprobarla?"
          dueno="Jaime Guevara (PM)"
          detalle="El proveedor la responde después de guardar su producto y sus respuestas quedan guardadas, pero no hay registro de quién las lee ni de si condicionan algo. Hoy parece un paso sin consecuencia visible."
        />

        <Vacio
          pregunta="¿En qué momento entra el comercial, y quién atiende a un proveedor nuevo?"
          dueno="Michelle López o Jaime Guevara"
          detalle="El área comercial de la célula figura a nombre de Emerson Días y Kevin Castro aparece en los procesos de ascenso y descenso, pero no hay nada escrito sobre quién toma a un proveedor recién registrado ni bajo qué criterio."
        />

        <Vacio
          pregunta="¿Soporte tiene un rol definido en el onboarding o solo reacciona?"
          dueno="Sin dueño asignado"
          detalle="Existen encuestas de satisfacción de casos de soporte para proveedor, así que el canal existe. Lo que no existe es un punto del blueprint donde soporte intervenga a propósito."
        />

        <Vacio
          pregunta="¿Cómo se comporta el onboarding en México y Ecuador?"
          dueno="Laura Contreras (UserPilot) y el equipo de Growth"
          detalle="Todo el funnel documentado es colombiano. Con 929 registros en México y 766 en Ecuador, no hay medición de si el proceso se comporta igual, y la expansión de catálogo depende de saberlo."
        />

        <Callout icon="🔗" color="var(--info)">
          Un cambio que viene desde afuera y va a tocar este flujo: la iniciativa de validación de identidad
          multipaís reporta que hoy el 40% de las validaciones en Colombia requieren revisión manual, y se
          propone bajarlo al 8%. Si eso ocurre, el paso de validación externa de este blueprint cambia de
          forma.
        </Callout>
        <Fuente origen="Jira PROD-552 · Validación de identidad multipaís (KYC/KYB/KYT), célula Backoffice" corte="19-ago-2026" />
      </SectionCard>
    </>
  );
}
