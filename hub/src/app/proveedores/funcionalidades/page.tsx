"use client";

import { SectionCard, H1, H2, H3, P, Fuente, Vacio, Callout, Tabla, Td, Tag, KPI, KPIRow } from "../_components/ui";

// ── Qué puede hacer un proveedor hoy · grafo supplier-success-graph-v4 (22 flujos)
const FLUJOS: { grupo: string; color: string; items: { nombre: string; que: string }[] }[] = [
  {
    grupo: "Entrar y quedar operativo",
    color: "var(--info)",
    items: [
      { nombre: "Registro", que: "Creación de cuenta con datos básicos, correo y contraseña" },
      { nombre: "Diagnóstico inicial", que: "Perfilamiento: tipo de negocio, categorías y volumen esperado" },
      { nombre: "Completar datos", que: "Datos legales, bancarios, dirección fiscal y documentación de respaldo" },
      { nombre: "Crear bodega", que: "Espacio de almacenamiento con dirección física y transportadoras disponibles" },
      { nombre: "Validación externa", que: "Verificación de la información y la capacidad operativa del proveedor" },
    ],
  },
  {
    grupo: "Construir catálogo",
    color: "var(--dropi)",
    items: [
      { nombre: "Crear producto", que: "Nombre, descripción, categoría, precio, stock, imágenes y garantías" },
      { nombre: "Editar producto", que: "Modificación de un producto ya creado" },
      { nombre: "Cargar imágenes", que: "Imagen principal y galería, con requisitos de formato y resolución" },
      { nombre: "Configurar garantías", que: "Políticas de garantía: tipo, duración y condiciones" },
      { nombre: "Actualizar stock", que: "Sincronización o actualización manual del inventario" },
      { nombre: "Crear combo", que: "Agrupar varios productos en una oferta conjunta" },
      { nombre: "Publicación de producto", que: "Hace el producto visible en el catálogo para los dropshippers" },
      { nombre: "Habilitación para catálogo público", que: "Validación adicional para exponer productos al catálogo abierto" },
    ],
  },
  {
    grupo: "Vender y negociar",
    color: "#8B5CF6",
    items: [
      { nombre: "Negociaciones y descuentos", que: "Precios especiales para dropshippers seleccionados" },
      { nombre: "Proponer combo", que: "El dropshipper arma la propuesta con productos del proveedor" },
      { nombre: "Aprobar combo", que: "El proveedor revisa productos, precio y solicitante, y aprueba" },
    ],
  },
  {
    grupo: "Operar el día a día",
    color: "var(--success)",
    items: [
      { nombre: "Gestión de órdenes", que: "Confirmación, preparación y seguimiento de pedidos" },
      { nombre: "Generación de guías", que: "Etiqueta de envío con transportadora y código de rastreo" },
      { nombre: "Despacho", que: "Entrega del paquete a la transportadora y actualización del estado" },
      { nombre: "Gestión de novedades", que: "Devoluciones, no entregados y reclamaciones" },
    ],
  },
  {
    grupo: "Crecer",
    color: "var(--warning)",
    items: [
      { nombre: "Medición de desempeño", que: "Tasa de entrega, calificaciones y tiempos de respuesta" },
      { nombre: "Escalamiento de nivel supplier", que: "Ascenso a niveles comerciales superiores" },
    ],
  },
];

// ── Pipeline · roadmap S2 2026 del hub, verificado contra Jira PROD el 19-ago-2026
const PIPELINE = [
  {
    proyecto: "Negociaciones Supplier ↔ Dropshipper",
    codigo: "NEG-001 / NEG-002",
    epica: "PROD-490",
    producto: "3 de 3 historias cerradas",
    dev: "En desarrollo · fin estimado 18-ago",
    color: "var(--success)",
  },
  {
    proyecto: "Combos desde el Dropshipper",
    codigo: "COM-002",
    epica: "PROD-545",
    producto: "2 de 2 historias cerradas",
    dev: "En cola · arranque tras Negociaciones, fin estimado 29-sep",
    color: "var(--info)",
  },
  {
    proyecto: "Descuentos · Precio Antes / Ahora",
    codigo: "DESC-001",
    epica: "PROD-1164",
    producto: "4 de 4 historias cerradas",
    dev: "En cola · ~12 semanas de espera, fin estimado 10-nov",
    color: "var(--info)",
  },
  {
    proyecto: "Dinámicas de catálogo · herramienta de campañas",
    codigo: "DCA-001",
    epica: "PROD-72",
    producto: "9 de 10 historias cerradas",
    dev: "En cola Q4 · fin estimado 22-dic",
    color: "var(--warning)",
  },
  {
    proyecto: "Categorización del catálogo",
    codigo: "CAT-001",
    epica: "No existe en Jira",
    producto: "Handoff listo desde el 28-jul",
    dev: "Sin slot hasta ~feb 2027",
    color: "var(--danger)",
  },
  {
    proyecto: "Caza Productos",
    codigo: "CAZ-001",
    epica: "PROD-1290",
    producto: "2 de 4 historias cerradas",
    dev: "En paralelo, no ocupa la cola de desarrollo",
    color: "var(--warning)",
  },
  {
    proyecto: "Time to Value · postulaciones a Verificado y Premium",
    codigo: "TTV-001",
    epica: "PROD-1305",
    producto: "3 de 5 historias cerradas",
    dev: "Operativo vía pipeline manual, sin desarrollo asignado",
    color: "var(--warning)",
  },
  {
    proyecto: "Inteligencia de catálogo",
    codigo: "DAT-001",
    epica: "PROD-337",
    producto: "0 de 2 historias cerradas",
    dev: "Sin arrancar",
    color: "var(--muted)",
  },
];

// Épicas que tocan al proveedor y no son de la célula Supplier Success.
const OTRAS_EPICAS = [
  { key: "PROD-552", nombre: "Validación de identidad multipaís (KYC/KYB/KYT)", quien: "Backoffice · Catalina Giraldo", porque: "Toca la puerta de entrada del proveedor: hoy el 40% de las validaciones en Colombia son manuales y la meta es bajarlo a 8%" },
  { key: "PROD-501", nombre: "Reporte de facturación de proveedores a dropshippers", quien: "En curso · CO, CL y MX", porque: "Única épica del listado que aparece en estado En curso" },
  { key: "PROD-348", nombre: "Conexión de stock con Chatea Pro", quien: "Sin asignar", porque: "Mejora la visibilidad de los productos del proveedor en el canal conversacional" },
  { key: "PROD-1495", nombre: "Knowledge base para proveedores", quien: "Jaime Guevara", porque: "Es la respuesta estructural al vacío de formación que hoy no cubre Academy" },
  { key: "PROD-1127", nombre: "Same day para proveedores, marcas y fulfillment", quien: "Logistic Success · Juan Diego Bautista", porque: "Cambia el compromiso de despacho del proveedor" },
];

export default function FuncionalidadesPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Estado del producto: qué existe hoy y qué está en camino">
          Inventario de funcionalidades
        </H1>

        <P>
          Dos preguntas distintas, dos tablas distintas: qué puede hacer un proveedor hoy en la plataforma,
          y qué se está construyendo para él.
        </P>

        <KPIRow>
          <KPI valor="22" label="Flujos del proveedor" sub="Mapeados en el grafo de la célula" />
          <KPI valor="8" label="Proyectos en el portafolio" sub="Del roadmap S2 2026" />
          <KPI valor="1" label="Desarrollador asignado" sub="~6 semanas por proyecto" color="var(--danger)" />
          <KPI valor="~feb 2027" label="Slot libre más cercano" sub="Para lo que no está en cola" color="var(--warning)" />
        </KPIRow>
      </SectionCard>

      <SectionCard>
        <H2>En producción: qué puede hacer un proveedor hoy</H2>

        <Callout icon="⚠️" color="var(--warning)">
          Esta tabla está construida desde el mapa de flujos de la célula, no desde la interfaz real. El
          único inventario de módulos que existe en el repositorio corresponde a la vista del dropshipper, y
          el propio archivo deja anotado que falta mapear la del proveedor. Tómala como el alcance funcional
          acordado, no como el menú exacto que ve un proveedor al entrar.
        </Callout>

        {FLUJOS.map((g) => (
          <div key={g.grupo} style={{ marginBottom: 20 }}>
            <H3>{g.grupo}</H3>
            <Tabla head={["Flujo", "Qué permite hacer"]}>
              {g.items.map((f) => (
                <tr key={f.nombre}>
                  <Td bold color={g.color}>{f.nombre}</Td>
                  <Td>{f.que}</Td>
                </tr>
              ))}
            </Tabla>
          </div>
        ))}
        <Fuente
          origen="supplier-lab/src/data/supplier-success-graph-v4.json · 22 nodos de tipo flow, contrastados con el sidebar del prototipo de proveedor"
          corte="jul-2026"
        />

        <Vacio
          pregunta="¿Qué módulos ve realmente un proveedor cuando entra a Dropi?"
          dueno="Michelle López o Jaime Guevara, con una cuenta de proveedor real"
          detalle="Hace falta recorrer la plataforma con un usuario proveedor y capturar su menú. Sin eso, no se puede afirmar qué está disponible por nivel ni qué se le oculta a un No Verificado."
        />
      </SectionCard>

      <SectionCard>
        <H2>En construcción: el pipeline</H2>

        <P>
          El portafolio no está limitado por ideas ni por definición de producto: está limitado por
          capacidad de desarrollo. Hay un solo desarrollador asignado y cada proyecto ocupa alrededor de seis
          semanas, así que la cola es literalmente secuencial.
        </P>

        <Tabla min={880} head={["Proyecto", "Código", "Épica", "Producto", "Desarrollo"]}>
          {PIPELINE.map((p) => (
            <tr key={p.codigo}>
              <Td bold>{p.proyecto}</Td>
              <Td><Tag color={p.color}>{p.codigo}</Tag></Td>
              <Td>{p.epica}</Td>
              <Td>{p.producto}</Td>
              <Td color={p.color}>{p.dev}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="Estado de producto verificado en Jira PROD (conteo de historias por épica). Fechas y cola de desarrollo del roadmap S2 2026 del hub"
          corte="Jira al 19-ago-2026 · fechas del roadmap con corte de julio"
          nota="En el proyecto PROD, «hecho» significa trabajo de producto entregado a desarrollo, no funcionalidad en producción."
        />

        <Callout icon="🧊" color="var(--danger)">
          Categorización del catálogo es el caso extremo: producto lo entregó el 28 de julio, no tiene una
          sola incidencia creada en Jira, y su turno de desarrollo cae alrededor de febrero de 2027. Entre
          el trabajo terminado y el primer commit hay medio año de espera.
        </Callout>

        <H3>Épicas que tocan al proveedor desde otras células</H3>
        <Tabla head={["Épica", "Nombre", "Quién", "Por qué importa aquí"]}>
          {OTRAS_EPICAS.map((e) => (
            <tr key={e.key}>
              <Td bold>{e.key}</Td>
              <Td bold>{e.nombre}</Td>
              <Td>{e.quien}</Td>
              <Td>{e.porque}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="Jira PROD · búsqueda de épicas que mencionan proveedor, supplier o catálogo" corte="19-ago-2026" />
      </SectionCard>

      <SectionCard>
        <H2>Lo que sigue sin saberse</H2>

        <Vacio
          pregunta="¿Qué funcionalidades están disponibles solo a partir de cierto nivel?"
          dueno="Jaime Guevara (PM)"
          detalle="Los beneficios por nivel están descritos en lenguaje comercial (atención preferencial, exposición en home). Falta traducirlos a permisos concretos del producto: qué botón aparece, qué pantalla se habilita, qué se bloquea."
        />

        <Vacio
          pregunta="¿Cuánta gente usa realmente cada funcionalidad?"
          dueno="Laura Contreras (UserPilot) y el equipo de Data"
          detalle="Existe instrumentación de eventos en el laboratorio de activación, pero no un tablero de adopción por funcionalidad del proveedor en producción. Sin eso, el inventario dice qué existe pero no qué sirve."
        />
      </SectionCard>
    </>
  );
}
