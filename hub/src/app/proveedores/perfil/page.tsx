"use client";

import { SectionCard, H1, H2, H3, P, Fuente, Vacio, Discrepancia, Callout, Tabla, Td, Tag, KPI, KPIRow, Barra } from "../_components/ui";

// ── Distribución por nivel · Supabase userpilot_suppliers, registros al 3-ago-2026
const NIVELES = [
  { nivel: "No Verificado", total: 102751, co: "—", mx: "—", ec: "—", color: "#9CA3AF" },
  { nivel: "Verificado", total: 696, co: "664", mx: "3", ec: "2", color: "var(--info)" },
  { nivel: "Premium", total: 96, co: "93", mx: "0", ec: "0", color: "var(--dropi)" },
  { nivel: "Premium Exclusivo", total: 61, co: "58", mx: "0", ec: "0", color: "#8B5CF6" },
];

// Valores que aparecen en la base y no existen en ninguna regla de negocio escrita.
const NO_DOCUMENTADOS = [
  { valor: "PARETO 360", n: 250, nota: "El valor no oficial más frecuente. Ni RB-004 ni el panel de ascensos lo mencionan." },
  { valor: "ESTÁNDAR", n: 36, nota: "RB-004 declara explícitamente que este nombre no corresponde a ningún nivel real de negocio." },
  { valor: "Catálogo mixto", n: 2, nota: "Parece una categoría de catálogo escrita en el campo de nivel." },
];

// ── Requisitos oficiales de ascenso · RB-004
const REQUISITOS = [
  { req: "Órdenes movilizadas por trimestre", nv: "Sin mínimo", v: "Mínimo 3.000", p: "Mínimo 20.000" },
  { req: "Antigüedad activa", nv: "Ninguna", v: "Mínimo 3 meses", p: "Mínimo 6 meses" },
  { req: "Certificación de uso de la plataforma", nv: "No exigida", v: "Obligatoria", p: "Obligatoria" },
  { req: "Gestión de garantías", nv: "Sin exigencia", v: "100% en menos de 24h", p: "100% en menos de 24h" },
  { req: "Uso de Ecom Scanner", nv: "Sin exigencia", v: "Obligatorio", p: "Obligatorio" },
  { req: "Tiempo promedio de despacho", nv: "Sin exigencia", v: "Menor a 48h", p: "Menor a 24h" },
  { req: "Registro en Cámara de Comercio", nv: "No exigido", v: "No exigido", p: "Exigido" },
  { req: "Historial y comportamiento comercial", nv: "Sin filtro", v: "Óptimo", p: "Óptimo" },
];

// ── Perfilamiento de entrada · UserPilot survey 32, ene–ago 2026, Colombia
const ETAPA = [
  { label: "Explorando, aún sin productos", n: 1544, pct: 35.78 },
  { label: "Tiene productos, nunca fue proveedor de dropshipping", n: 1500, pct: 34.76 },
  { label: "Tiene productos y ya vende online, nunca fue proveedor", n: 1035, pct: 23.99 },
  { label: "Ya ha sido proveedor de dropshipping", n: 236, pct: 5.47 },
];

const PEDIDOS = [
  { label: "Aún no gestiona pedidos", n: 811, pct: 29.48 },
  { label: "Menos de 50 al mes", n: 891, pct: 32.39 },
  { label: "51 a 300 al mes", n: 668, pct: 24.28 },
  { label: "301 a 1.000 al mes", n: 226, pct: 8.22 },
  { label: "Más de 1.000 al mes", n: 155, pct: 5.63 },
];

const CATEGORIAS = [
  { label: "Belleza, salud, cuidado personal y moda", n: 740, pct: 33.12 },
  { label: "Catálogo mixto", n: 630, pct: 28.2 },
  { label: "Tecnología, gadgets, accesorios y herramientas", n: 358, pct: 16.03 },
  { label: "Hogar, cocina y organización", n: 283, pct: 12.67 },
  { label: "Otra categoría", n: 135, pct: 6.04 },
  { label: "Mascotas, bebés, deportes y vehículos", n: 88, pct: 3.94 },
];

// ── Perfil cuantitativo por nivel — síntesis de reglas + conteo real, no investigación cualitativa
const PERFIL_NIVEL = [
  {
    nivel: "No Verificado",
    color: "#9CA3AF",
    n: "102.751 (98,9% del total, nivel por defecto)",
    entra: "Sin requisitos de entrada, sin antigüedad mínima",
    comportamiento: "Excluido del sistema de recomendación de catálogo: no aparece cuando Gali/ADA Spy sugiere proveedores a un dropshipper",
    gana: "Solo la plataforma base, sin beneficios comerciales adicionales",
  },
  {
    nivel: "Verificado",
    color: "var(--info)",
    n: "696 (664 en Colombia)",
    entra: "Mínimo 3.000 órdenes/trimestre, 3 meses de antigüedad, certificación obligatoria",
    comportamiento: "Uso obligatorio de Ecom Scanner (dejar de usarlo es motivo de descenso) y confirmación de pedidos por Chatea Pro; despacho menor a 48h",
    gana: "Visibilidad, catálogo, aprobación automática, insignias y Plan Kanguro de garantías",
  },
  {
    nivel: "Premium",
    color: "var(--dropi)",
    n: "96 (93 en Colombia)",
    entra: "Mínimo 20.000 órdenes/trimestre (o 45.000 según la otra fuente, ver discrepancia abajo), 6 meses de antigüedad, Cámara de Comercio",
    comportamiento: "Despacho menor a 24h, garantías 100% en menos de 24h; primero en el sistema de recomendación de catálogo",
    gana: "Todo lo de Verificado, más atención personalizada, informe mensual, back office logístico y presencia en showroom",
  },
  {
    nivel: "Premium Exclusivo",
    color: "#8B5CF6",
    n: "61 (58 en Colombia)",
    entra: "Contrato propio negociado con Dropi (requisitos operativos no confirmados, ver discrepancia abajo)",
    comportamiento: "Prioridad total en recomendación de catálogo",
    gana: "Todo lo de Premium, más créditos de importación y gestión de inventarios",
  },
];

const BENEFICIOS = [
  {
    nivel: "Verificado",
    color: "var(--info)",
    texto: "Visibilidad y exposición de productos, catálogo de productos, aprobación automática de productos, atención preferencial, tiempos de respuesta rápidos, insignias y Plan Kanguro de garantías.",
  },
  {
    nivel: "Premium",
    color: "var(--dropi)",
    texto: "Todo lo de Verificado, más atención personalizada y directa, informe mensual de actividades, reuniones semanales, back office de procesos logísticos, exposición en home, reuniones con líderes de comunidad y presencia en showroom.",
  },
  {
    nivel: "Premium Exclusivo",
    color: "#8B5CF6",
    texto: "Todo lo de Premium, más prioridad en gestiones logísticas, créditos para importaciones internacionales, atención prioritaria, gestión de inventarios y estrategias personalizadas.",
  },
];

export default function PerfilPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Definición y segmentación del público objetivo">Perfil del proveedor</H1>

        <P>
          Dropi clasifica a sus proveedores en cuatro niveles: No Verificado, Verificado, Premium y Premium
          Exclusivo. Es la única segmentación oficial y la que gobierna beneficios, visibilidad y trato
          comercial. Sobre ella se apoya todo lo demás.
        </P>

        <Callout icon="ℹ️" color="var(--info)">
          El 98,9% de los registros está en No Verificado — el nivel por defecto antes de que un proveedor
          se verifique. En la base esto no se escribe como un valor propio: el campo queda vacío o con «-»
          (48.508 nulos y 54.241 con guion, ambos leídos como No Verificado). No es un dato faltante, es
          cómo se representa este nivel. El vacío real es otro: 288 registros con un valor que no es
          ninguno de los 4 niveles oficiales (ver más abajo).
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Cuántos hay en cada nivel</H2>

        <KPIRow>
          <KPI valor="103.892" label="Registros de proveedor" sub="CO 87.107 · MX 929 · EC 766" />
          <KPI valor="102.751" label="No Verificado" sub="98,9% · nivel por defecto, campo vacío o «-»" color="#9CA3AF" />
          <KPI valor="853" label="Con nivel oficial superior" sub="Verificado, Premium o Exclusivo · 0,8%" color="var(--info)" />
          <KPI valor="288" label="Con valor no documentado" sub="0,3% · nivel que no existe en ninguna regla" color="var(--danger)" />
        </KPIRow>

        <Tabla head={["Nivel", "Total", "Colombia", "México", "Ecuador"]}>
          {NIVELES.map((n) => (
            <tr key={n.nivel}>
              <Td bold color={n.color}>{n.nivel}</Td>
              <Td bold>{n.total.toLocaleString("es-CO")}</Td>
              <Td>{n.co}</Td>
              <Td>{n.mx}</Td>
              <Td>{n.ec}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="Supabase · tabla userpilot_suppliers, campo tipo_proveedor. El campo se llena cruzando el export de Dropi contra los registros de UserPilot (hub/supabase/seed_operational_data.py)"
          corte="registros hasta el 3-ago-2026"
          nota="No Verificado no se escribe como valor explícito en el campo: agrupa 48.508 registros nulos y 54.241 con «-», que es como la base representa a quien todavía no se ha verificado."
        />

        <Callout icon="🌎" color="var(--info)">
          La pirámide de niveles es un fenómeno colombiano. Fuera de Colombia hay cinco proveedores con
          nivel oficial: tres Verificados en México y dos en Ecuador. Ni un solo Premium ni Premium
          Exclusivo. Cualquier lectura de la segmentación aplica a Colombia y a nadie más.
        </Callout>

        <H3>Valores que están en la base y no existen en ninguna regla</H3>
        <Tabla head={["Valor encontrado", "Registros", "Por qué llama la atención"]}>
          {NO_DOCUMENTADOS.map((v) => (
            <tr key={v.valor}>
              <Td bold color="var(--danger)">{v.valor}</Td>
              <Td bold>{v.n}</Td>
              <Td>{v.nota}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="Supabase · userpilot_suppliers.tipo_proveedor, conteo exacto por valor" corte="19-ago-2026" />
        <Vacio
          pregunta="¿Qué es «PARETO 360» y por qué hay 250 proveedores marcados así?"
          dueno="Jaime Guevara (PM) o el equipo comercial que mantiene el archivo de niveles"
          detalle="Es el tercer valor más frecuente del campo de nivel, por encima de Premium (96) y Premium Exclusivo (61). Hasta saber qué significa, no se puede afirmar cuántos proveedores hay realmente en cada nivel."
        />
      </SectionCard>

      <SectionCard>
        <H2>Cómo se sube de nivel</H2>
        <P>
          La ruta oficial es No Verificado → Verificado → Premium → Premium Exclusivo. Estos son los
          requisitos publicados.
        </P>

        <Tabla head={["Requisito", "No Verificado", "Verificado", "Premium"]}>
          {REQUISITOS.map((r) => (
            <tr key={r.req}>
              <Td bold>{r.req}</Td>
              <Td>{r.nv}</Td>
              <Td>{r.v}</Td>
              <Td>{r.p}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="research-brain/RB-004-personas-journey-proveedores.md · requisitos oficiales confirmados por Michelle el 8-jul-2026"
          corte="jul-2026"
        />

        <Discrepancia
          titulo="El umbral de órdenes para llegar a Premium no coincide entre fuentes"
          a="RB-004 dice 20.000 órdenes movilizadas por trimestre."
          b="El panel de ascensos usa 45.000 como umbral objetivo del salto Verificado → Premium (hub/supabase/019_supplier_ascenso_panel.sql, campo umbral_objetivo con valores 3000 y 45000)."
          estado="Pendiente de confirmar cuál rige hoy. Mientras tanto, ninguna comunicación al proveedor debería citar una cifra concreta."
        />

        <Discrepancia
          titulo="Qué distingue a Premium Exclusivo"
          a="RB-004 dice que no tiene requisitos publicados y se accede por contrato propio negociado con Dropi."
          b="El panel de indicadores dice que los requisitos operativos son idénticos a Premium y que la diferencia es el compromiso de exclusividad: no operar en otras plataformas de dropshipping."
          estado="La segunda versión es más reciente y más operativa, pero no está confirmada como regla oficial."
        />

        <H3>Qué gana el proveedor en cada nivel</H3>
        {BENEFICIOS.map((b) => (
          <div key={b.nivel} style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 6 }}>
              <Tag color={b.color}>{b.nivel}</Tag>
            </div>
            <P>{b.texto}</P>
          </div>
        ))}
        <Fuente origen="Página pública dropi.co/soluciones-para-proveedores, recogida en RB-004" corte="jul-2026" />

        <Callout icon="🎯" color="var(--dropi)">
          El nivel no es una insignia: define si el catálogo se vende. Cuando el sistema de recomendación
          sugiere proveedores a un dropshipper, Premium y Premium Exclusivo van primero, Verificado va
          segundo y exige confirmación adicional del pedido por WhatsApp, y No Verificado queda excluido de
          las recomendaciones. Un proveedor sin nivel no compite: no aparece.
        </Callout>
        <Fuente origen="Reglas de recomendación de catálogo del agente Gali/ADA Spy, documentadas en RB-004 §1" corte="jul-2026" />
      </SectionCard>

      <SectionCard>
        <H2>Perfil por nivel</H2>
        <P>
          Esto no es investigación cualitativa ni personas de research: es una síntesis de las reglas
          oficiales y el conteo real de usuarios por nivel. No hay entrevistas a proveedores todavía (ver
          «Lo que sigue sin saberse», al final), así que ningún nivel tiene una historia, una foto ni una
          cita — solo lo que las reglas de negocio y la base de datos confirman.
        </P>

        {PERFIL_NIVEL.map((p) => (
          <div key={p.nivel} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <Tag color={p.color}>{p.nivel}</Tag>
            </div>
            <Tabla head={["Cuántos hay", "Cómo se entra", "Comportamiento confirmado", "Qué gana"]}>
              <tr>
                <Td bold>{p.n}</Td>
                <Td>{p.entra}</Td>
                <Td>{p.comportamiento}</Td>
                <Td>{p.gana}</Td>
              </tr>
            </Tabla>
          </div>
        ))}
        <Fuente
          origen="Síntesis propia sobre research-brain/RB-004, hub/supabase/019_supplier_ascenso_panel.sql y Supabase userpilot_suppliers — mismas fuentes ya citadas arriba, sin dato nuevo"
          corte="jul–ago 2026"
        />

        <Callout icon="⚠️" color="var(--warning)">
          El perfilamiento de entrada de UserPilot (siguiente sección, n=7.678) es agregado: no está cruzado
          contra el nivel oficial del proveedor. No se puede afirmar, por ejemplo, qué categoría vende más un
          Premium que un Verificado — esa pregunta no tiene respuesta con los datos disponibles hoy.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Quién llega, en sus propias palabras</H2>
        <P>
          El perfilamiento de entrada es la fuente más grande que existe sobre el proveedor: se pregunta en
          el registro y lleva más de siete mil respuestas. No es investigación cualitativa, es
          autodeclaración, pero describe a quién estamos recibiendo mejor que cualquier otra cosa disponible.
        </P>

        <H3>Experiencia previa: casi nadie ha hecho esto antes</H3>
        {ETAPA.map((e) => (
          <Barra key={e.label} label={e.label} pct={e.pct} valor={`${e.n.toLocaleString("es-CO")} · ${e.pct}%`} />
        ))}
        <Fuente origen="UserPilot survey 32 · «¿Cuéntanos en qué etapa estás?» · n=4.315" corte="ene–ago 2026 · Colombia" />
        <Callout icon="📎" color="var(--info)">
          El 94,53% nunca ha sido proveedor de dropshipping y más de un tercio ni siquiera tiene productos
          todavía. El onboarding no le está enseñando a alguien a usar una herramienta nueva: le está
          enseñando un modelo de negocio nuevo.
        </Callout>

        <H3>Volumen que declaran gestionar</H3>
        {PEDIDOS.map((e) => (
          <Barra key={e.label} label={e.label} pct={e.pct} valor={`${e.n.toLocaleString("es-CO")} · ${e.pct}%`} color="var(--info)" />
        ))}
        <Fuente origen="UserPilot survey 32 · «¿Cuántos pedidos gestionas al mes?» · n=2.751" corte="ene–ago 2026 · Colombia" />
        <Callout icon="⚠️" color="var(--warning)">
          Este dato hay que leerlo con pinzas. En julio el equipo comprobó que el formulario de entrada no
          es confiable: muchos proveedores declaran un volumen que no tienen, y eso contaminó la lista de
          «alto potencial» del plan de activación. Por eso se pivotó a calificar por comportamiento real
          antes del contacto humano.
        </Callout>
        <Fuente origen="hub/src/app/weekly/data/2026-07-31.ts · cierre de semana de la célula" corte="31-jul-2026" />

        <H3>Qué venden</H3>
        {CATEGORIAS.map((e) => (
          <Barra key={e.label} label={e.label} pct={e.pct} valor={`${e.n.toLocaleString("es-CO")} · ${e.pct}%`} color="#8B5CF6" />
        ))}
        <Fuente origen="UserPilot survey 32 · «¿Cuál es la categoría principal de tus productos?» · n=2.234" corte="ene–ago 2026 · Colombia" />

        <H3>Cómo quieren operar</H3>
        <Tabla head={["Pregunta", "Respuesta mayoritaria", "La otra opción", "n"]}>
          <tr>
            <Td bold>¿Cómo quieres usar Dropi?</Td>
            <Td>Proveedor · 57,79%</Td>
            <Td>Marca · 42,21%</Td>
            <Td>7.678</Td>
          </tr>
          <tr>
            <Td bold>¿Cómo quieres vender tus productos?</Td>
            <Td>Por dropshippers y por mis canales · 65,58%</Td>
            <Td>Solo por dropshippers · 34,42%</Td>
            <Td>4.259</Td>
          </tr>
          <tr>
            <Td bold>¿Cómo prefieres gestionar tus envíos?</Td>
            <Td>Yo almaceno, empaco y despacho · 62,02%</Td>
            <Td>Que Dropi lo haga · 37,98%</Td>
            <Td>3.099</Td>
          </tr>
          <tr>
            <Td bold>¿A quién vendes tus productos?</Td>
            <Td>Catálogo público · 53,16%</Td>
            <Td>Solo clientes autorizados · 46,84%</Td>
            <Td>696</Td>
          </tr>
        </Tabla>
        <Fuente origen="UserPilot survey 32 · [Evergreen] Clasificación Proveedores y Marcas" corte="ene–ago 2026 · Colombia" />

        <Callout icon="🔍" color="var(--dropi)">
          Dos de cada tres quieren vender por dropshippers y por sus propios canales a la vez. El proveedor
          puro, que solo expone inventario y espera, es la minoría de quienes se registran: uno de cada tres.
          La deuda técnica de que proveedor y marca compartan el mismo rol no es solo un problema de
          arquitectura, es lo que la gente efectivamente quiere hacer.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Lo que sigue sin saberse</H2>

        <Vacio
          pregunta="¿Cómo es el proveedor cuando habla de sí mismo, y no cuando marca una opción en un formulario?"
          dueno="Michelle López (UX) — hay una guía de entrevista lista para proveedores de 0 a 30 días"
          detalle="No existen entrevistas de proveedor como persona. Las entrevistas que sí se hicieron (8-jul-2026, con Gisela de Gold Stone International y Andrés de Katz Supply) fueron sobre features concretos: Caza Productos, categorización y descuentos. Sirven como evidencia de esas funcionalidades, no como retrato del segmento."
        />

        <Vacio
          pregunta="¿Qué sub-perfiles operativos existen dentro de cada nivel?"
          dueno="Sin dueño asignado"
          detalle="Importador, manufacturero, distribuidor y marca-supplier aparecen nombrados en logistica-lab/conocimiento/temas/16 pero el propio archivo los marca como pendientes de definir. Un importador y un laboratorio con producción propia cumplen el mismo requisito de volumen y no operan igual."
        />

        <Vacio
          pregunta="¿Qué pasa cuando un proveedor deja de cumplir los requisitos de su nivel?"
          dueno="Kevin Castro (comercial) — ya explicó el proceso, falta convertirlo en regla escrita"
          detalle="Hoy el descenso es 100% manual y sin flujo formal. Se usa el mismo informe del ascenso, se le muestra al proveedor y a los tres meses puede volver a postularse. Los motivos que evalúa el comercial son: no cumplir el mínimo de órdenes, no usar Ecom Scanner, no gestionar garantías, no responder, o una reclamación fuerte con otra área."
        />
      </SectionCard>
    </>
  );
}
