"use client";

import { SectionCard, H1, H2, P, Fuente, KPI, KPIRow, Tabla, Td, Tag, Callout } from "./_components/ui";

// Estado de la evidencia por tema. Es lo primero que se ve a propósito:
// antes de leer una cifra conviene saber de qué pie cojea cada sección.
const EVIDENCIA: { tema: string; href: string; nivel: "Sólida" | "Parcial" | "Débil"; color: string; base: string }[] = [
  {
    tema: "Perfil y segmentos",
    href: "/proveedores/perfil",
    nivel: "Sólida",
    color: "var(--success)",
    base: "Reglas de ascenso oficiales, distribución por nivel desde la base y 7.678 respuestas de perfilamiento de entrada",
  },
  {
    tema: "Satisfacción",
    href: "/proveedores/satisfaccion",
    nivel: "Parcial",
    color: "var(--warning)",
    base: "NPS del proveedor medible solo en Colombia. El CSAT en el que el proveedor evalúa su propia experiencia tiene n=36",
  },
  {
    tema: "Funcionalidades",
    href: "/proveedores/funcionalidades",
    nivel: "Parcial",
    color: "var(--warning)",
    base: "Pipeline verificado contra Jira. El inventario de módulos en producción está mapeado desde la vista del dropshipper, no la del proveedor",
  },
  {
    tema: "Onboarding",
    href: "/proveedores/onboarding",
    nivel: "Parcial",
    color: "var(--warning)",
    base: "Frontstage instrumentado paso a paso. El backstage (auditoría, aprobación, comercial, soporte) no está documentado",
  },
  {
    tema: "Herramientas",
    href: "/proveedores/herramientas",
    nivel: "Sólida",
    color: "var(--success)",
    base: "Reconstruido de fuentes dispersas del repositorio, con owner identificado en cada caso",
  },
];

export default function ResumenPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Base de conocimiento del vertical · Célula Supplier Success">
          El proveedor de Dropi
        </H1>

        <P>
          Todo lo que Dropi tiene documentado sobre su proveedor estaba repartido en once lugares que no se
          hablaban entre sí. Esta página lo reúne en cinco temas: quién es, qué tan satisfecho está, qué
          puede hacer hoy, cómo entra a la plataforma y con qué herramientas convive.
        </P>
        <P>
          Cada cifra lleva su fuente y su fecha de corte. Donde no hay evidencia se dice que no la hay, con
          la pregunta abierta y quién tendría la respuesta. Donde dos fuentes internas se contradicen, se
          muestran las dos.
        </P>

        <H2>Lo que hay que saber primero</H2>

        <KPIRow>
          <KPI valor="103.892" label="Registros de proveedor" sub="84% en Colombia" />
          <KPI valor="0,8%" label="Con nivel oficial superior" sub="853 de 103.892 · el resto es No Verificado, el nivel por defecto" color="var(--danger)" />
          <KPI valor="48" label="NPS del proveedor" sub="9 puntos bajo el de la plataforma" color="var(--warning)" />
          <KPI valor="1,36%" label="Completa el registro" sub="~40 de 2.212 guarda un producto" color="var(--danger)" />
        </KPIRow>

        <Fuente
          origen="Supabase userpilot_suppliers · UserPilot NPS segmento Proveedores CO · supplier-lab/docs/PROMPT_PRESENTACION.md"
          corte="registros al 3-ago-2026 · NPS ene–ago 2026 · funnel últimos 90 días"
        />

        <Callout icon="📌" color="var(--dropi)">
          Estas cuatro cifras cuentan la misma historia desde ángulos distintos: entra muchísima gente,
          casi nadie llega a operar, y de los que llegan casi nadie avanza del nivel de entrada (No
          Verificado). El vertical no tiene un problema de demanda, tiene un problema de conversión y de
          progresión.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Estado de la evidencia</H2>
        <P>
          Ninguna sección está completa. Esto es lo que sostiene cada una, para que nadie cite un número sin
          saber qué tan firme es el piso.
        </P>

        <Tabla head={["Tema", "Evidencia", "Sobre qué se apoya"]}>
          {EVIDENCIA.map((e) => (
            <tr key={e.tema}>
              <Td bold>
                <a href={e.href} style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
                  {e.tema}
                </a>
              </Td>
              <Td>
                <Tag color={e.color}>{e.nivel}</Tag>
              </Td>
              <Td>{e.base}</Td>
            </tr>
          ))}
        </Tabla>
      </SectionCard>

      <SectionCard>
        <H2>Qué es un proveedor y qué no</H2>
        <P>
          El proveedor pone su catálogo a disposición de los dropshippers, que son quienes venden. No genera
          órdenes propias hacia clientes finales: su negocio depende de que otros muevan su inventario. Eso
          lo separa de la marca o emprendedor, que despacha directo a sus clientes y tiene su propia célula
          (Brands Success).
        </P>
        <P>
          La distinción importa porque en el registro conviven: el 57,79% de quienes responden el
          perfilamiento de entrada quiere usar Dropi como proveedor y el 42,21% como marca, sobre la misma
          puerta de entrada. Y porque en la plataforma ambos comparten rol técnico.
        </P>
        <Fuente
          origen="UserPilot survey 32 · [Evergreen] Clasificación Proveedores y Marcas · n=7.678"
          corte="ene–ago 2026 · Colombia"
        />

        <H2>Alcance de esta documentación</H2>
        <P>
          Colombia, México y Ecuador. En la práctica casi todo lo medible es colombiano: México y Ecuador
          suman 1.695 registros de proveedor entre los dos, cinco proveedores con nivel oficial asignado
          (tres en México, dos en Ecuador) y ningún segmento de proveedores configurado en su instancia de
          UserPilot. Cada sección dice explícitamente cuándo un dato es solo de Colombia.
        </P>
        <Fuente origen="Supabase userpilot_suppliers · UserPilot workspaces Dropi México y Dropi Ecuador" corte="19-ago-2026" />
      </SectionCard>
    </>
  );
}
