"use client";

import { SectionCard, H1, H2, P, Fuente, Vacio, Callout, Tabla, Td, Tag, KPI, KPIRow } from "../_components/ui";

type Uso = "Proveedor" | "Equipo interno" | "Ambos";

const HERRAMIENTAS: { nombre: string; uso: Uso; owner: string; paraQue: string; nota?: string }[] = [
  {
    nombre: "Plataforma Dropi",
    uso: "Ambos",
    owner: "Producto y Tecnología",
    paraQue: "Catálogo, bodegas, productos, órdenes, guías, garantías, combos y negociaciones",
  },
  {
    nombre: "Ecom Scanner",
    uso: "Proveedor",
    owner: "Logistic Success",
    paraQue: "Escaneo y control del despacho",
    nota: "Obligatorio a partir del nivel Verificado. Dejar de usarlo es uno de los motivos de descenso que evalúa el comercial",
  },
  {
    nombre: "Chatea Pro",
    uso: "Proveedor",
    owner: "Venture Products (holding)",
    paraQue: "Confirmación de pedidos por WhatsApp",
    nota: "El proveedor Verificado carga con un paso extra: sus pedidos requieren confirmación por este canal. Además no sabe responder por combos",
  },
  {
    nombre: "WhatsApp",
    uso: "Ambos",
    owner: "Growth y célula",
    paraQue: "Canal principal de contacto, distribución de catálogo de campañas y seguimiento de activación",
  },
  {
    nombre: "Academy",
    uso: "Proveedor",
    owner: "Growth",
    paraQue: "Formación en plataforma",
    nota: "Existe como módulo, no tiene documentación de producto propia, y en la investigación de activación de marcas ningún usuario reportó haberse activado con ella",
  },
  {
    nombre: "UserPilot",
    uso: "Equipo interno",
    owner: "Laura Contreras",
    paraQue: "Encuestas, perfilamiento de entrada, NPS, avisos in-app y segmentación",
    nota: "La fuente número uno de datos del proveedor. La tabla sincronizada tiene 103.892 registros",
  },
  {
    nombre: "GoHighLevel",
    uso: "Equipo interno",
    owner: "Enrique López (Growth y CRM)",
    paraQue: "Pipeline comercial de activación de 11 etapas y secuencias de contacto",
    nota: "Arrastra un blocker abierto: el identificador de usuario del backend no coincide con el de UserPilot",
  },
  {
    nombre: "Metabase",
    uso: "Equipo interno",
    owner: "Enrique López",
    paraQue: "Tablero de seguimiento de activación en vivo",
    nota: "Es la fuente de las cifras de activación bruta y neta desde julio",
  },
  {
    nombre: "Supabase",
    uso: "Equipo interno",
    owner: "Jaime Guevara",
    paraQue: "Base del hub: métricas, cohortes de activación, panel de ascensos y campañas",
  },
  {
    nombre: "Power BI",
    uso: "Equipo interno",
    owner: "Data",
    paraQue: "Métricas de producto para el equipo de Cuidado de Campañas",
    nota: "Los operadores solo pueden consultar: no editan ni pueden descargar el identificador del producto, así que terminan trabajando en Excel",
  },
  {
    nombre: "PostHog",
    uso: "Equipo interno",
    owner: "Célula Supplier Success",
    paraQue: "Instrumentación del laboratorio de activación",
    nota: "Solo en el laboratorio, no en producción. La regla interna es que ninguna pantalla del lab se da por terminada sin trazabilidad",
  },
  {
    nombre: "Evolution API",
    uso: "Equipo interno",
    owner: "Célula Supplier Success",
    paraQue: "Escucha de grupos y canales de WhatsApp para detectar fricción cualitativa",
    nota: "Requiere una línea telefónica dedicada del área",
  },
  {
    nombre: "Jira",
    uso: "Equipo interno",
    owner: "Producto",
    paraQue: "Épicas e historias del portafolio del vertical",
  },
];

export default function HerramientasPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Inventario de software interno y externo del vertical">
          Ecosistema de herramientas
        </H1>

        <P>
          No existía un inventario de esto en ninguna parte: estaba repartido en menciones sueltas por todo
          el repositorio. La columna que más importa es quién usa cada herramienta, porque cambia por
          completo a quién hay que preguntarle cuando algo falla.
        </P>

        <KPIRow>
          <KPI valor="13" label="Herramientas en el ecosistema" />
          <KPI valor="5" label="Las usa el proveedor" sub="Incluidas las compartidas" />
          <KPI valor="10" label="Las usa el equipo" sub="Incluidas las compartidas" />
          <KPI valor="4" label="Con problema documentado" sub="Chatea Pro, GoHighLevel, Academy y Power BI" color="var(--warning)" />
        </KPIRow>
      </SectionCard>

      <SectionCard>
        <H2>Inventario</H2>

        <Tabla min={940} head={["Herramienta", "Quién la usa", "Owner", "Para qué", "Estado conocido"]}>
          {HERRAMIENTAS.map((h) => (
            <tr key={h.nombre}>
              <Td bold>{h.nombre}</Td>
              <Td>
                <Tag color={h.uso === "Proveedor" ? "var(--dropi)" : h.uso === "Ambos" ? "#8B5CF6" : "var(--info)"}>
                  {h.uso}
                </Tag>
              </Td>
              <Td>{h.owner}</Td>
              <Td>{h.paraQue}</Td>
              <Td color={h.nota ? "var(--warning)" : "var(--muted)"}>{h.nota ?? "Sin observaciones"}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="Reconstruido de research-brain/RB-004 y RB-005, supplier-lab/docs, hub/src/app/proyectos/time-to-value, hub/supabase y los cierres de semana de la célula"
          corte="ago-2026"
        />
      </SectionCard>

      <SectionCard>
        <H2>Lo que la lista deja ver</H2>

        <Callout icon="⚖️" color="var(--warning)">
          Diez herramientas sirven para observar y contactar al proveedor. Cinco son suyas. Sabemos mucho más
          sobre cómo mirarlo que sobre cómo ayudarlo a operar.
        </Callout>

        <P>
          Las tres herramientas propias del proveedor que no son la plataforma cargan un peso particular. Ecom
          Scanner es obligatorio desde Verificado y su desuso es motivo de descenso. Chatea Pro le agrega un
          paso a cada venta y no cubre combos. Academy es la única pieza de formación y no hay evidencia de
          que active a nadie.
        </P>

        <Vacio
          pregunta="¿Qué herramientas usa el proveedor por fuera de Dropi para operar su negocio?"
          dueno="Michelle López (UX)"
          detalle="El 62,02% declara que gestiona sus propios envíos y el 49,41% recibe pedidos por su tienda en línea. Eso implica un stack propio de inventario, facturación y ventas del que no sabemos nada. Es una pregunta natural para las entrevistas pendientes."
        />

        <Vacio
          pregunta="¿Qué tanto se usa Academy y qué pasa después de usarla?"
          dueno="Growth"
          detalle="No hay documentación de producto ni métricas de adopción del módulo para el perfil proveedor. La épica de knowledge base para proveedores (PROD-1495) apunta al mismo problema desde otro ángulo."
        />

        <Vacio
          pregunta="¿Existe alguna herramienta de soporte formal para el proveedor además del CAS?"
          dueno="Backoffice"
          detalle="El CAS aparece como el canal de casos y tiene encuestas asociadas, pero no está documentado cómo se escala un caso que el proveedor no puede resolver ahí."
        />
      </SectionCard>
    </>
  );
}
