"use client";

import { useState } from "react";
import { Card, Pill, SectionTitle, DataList, Stat, Disclosure } from "@/app/proyectos/logistica/_components/ui";

// Contenido interactivo del POC Autoconfirmacion x ChateaPro.
//
// Tres pestanas: Concepto (wizard de 3 pasos), Hallazgos ChateaPro (sesiones
// de discovery), y Gates y proximos pasos. Usa las clases `.exp-tabs` /
// `.exp-tab` de tablero.css y los primitivos del sistema de diseno.

type Tab = "concepto" | "hallazgos" | "gates";

// ── Datos del simulador (paso 3 del wizard) ────────────────────────────────

type OrdenSim = {
  id: string;
  producto: string;
  flete: string;
  accion: string;
  accionTono: "ok" | "warn" | "info" | "risk";
  resultado: string;
};

const ORDENES_SIM: OrdenSim[] = [
  { id: "ORD-4281", producto: "Serum Vitamina C", flete: "$8.500", accion: "Confirmada", accionTono: "ok", resultado: "+$42.500" },
  { id: "ORD-4282", producto: "Faja Reductora", flete: "$12.300", accion: "Confirmada", accionTono: "ok", resultado: "+$67.200" },
  { id: "ORD-4283", producto: "Cargador 15W", flete: "$9.800", accion: "Verificacion IA", accionTono: "info", resultado: "+$31.400" },
  { id: "ORD-4284", producto: "Kit Maquillaje Pro", flete: "$15.200", accion: "Confio (anticipo)", accionTono: "warn", resultado: "+$89.100" },
  { id: "ORD-4285", producto: "Audifonos TWS", flete: "$7.600", accion: "Confirmada", accionTono: "ok", resultado: "+$24.800" },
  { id: "ORD-4286", producto: "Zapatos Ortopedicos", flete: "$18.900", accion: "Escalamiento", accionTono: "risk", resultado: "Manual" },
  { id: "ORD-4287", producto: "Bolsa Gato Premium", flete: "$6.200", accion: "Confirmada", accionTono: "ok", resultado: "+$18.600" },
  { id: "ORD-4288", producto: "Crema Antiedad", flete: "$11.400", accion: "Verificacion IA", accionTono: "info", resultado: "+$55.300" },
  { id: "ORD-4289", producto: "Reloj Deportivo", flete: "$22.100", accion: "Escalamiento", accionTono: "risk", resultado: "Manual" },
  { id: "ORD-4290", producto: "Protector Solar SPF50", flete: "$8.100", accion: "Confirmada", accionTono: "ok", resultado: "+$36.700" },
  { id: "ORD-4291", producto: "Plancha Alisadora", flete: "$14.700", accion: "Confio (anticipo)", accionTono: "warn", resultado: "+$72.400" },
  { id: "ORD-4292", producto: "Collar Artesanal", flete: "$5.900", accion: "Confirmada", accionTono: "ok", resultado: "+$15.200" },
  { id: "ORD-4293", producto: "Silla Ergonomica", flete: "$35.600", accion: "Escalamiento", accionTono: "risk", resultado: "Manual" },
  { id: "ORD-4294", producto: "Aceite Esencial", flete: "$7.300", accion: "Confirmada", accionTono: "ok", resultado: "+$22.100" },
  { id: "ORD-4295", producto: "Termo Acero 500ml", flete: "$9.200", accion: "Verificacion IA", accionTono: "info", resultado: "+$28.900" },
  { id: "ORD-4296", producto: "Billetera Cuero", flete: "$6.800", accion: "Confio (anticipo)", accionTono: "warn", resultado: "+$41.200" },
  { id: "ORD-4297", producto: "Lampara LED Mesa", flete: "$11.500", accion: "Confirmada", accionTono: "ok", resultado: "+$33.800" },
  { id: "ORD-4298", producto: "Perfume 100ml", flete: "$13.400", accion: "Confirmada", accionTono: "ok", resultado: "+$58.600" },
];

const ACCIONES_CHATEAPRO = [
  {
    nombre: "Confirmacion",
    tono: "ok" as const,
    descripcion: "ChateaPro contacta al cliente final por WhatsApp, confirma datos de entrega y valida la orden. Mensaje personalizable por producto.",
    ejemplo: "Hola [nombre], tu pedido de [producto] esta confirmado y sera enviado a [direccion]. Responde SI para confirmar o escribe tu direccion correcta.",
  },
  {
    nombre: "Verificacion IA de direccion",
    tono: "info" as const,
    descripcion: "Cuando la direccion tiene senales de riesgo (incompleta, zona rural, formato ambiguo), ChateaPro solicita verificacion al cliente antes de despachar.",
    ejemplo: "Hola [nombre], necesitamos verificar tu direccion: [direccion]. Parece incompleta. Puedes enviarnos la direccion completa con barrio y referencias?",
  },
  {
    nombre: "Confio (pago anticipado)",
    tono: "warn" as const,
    descripcion: "Para ordenes de alto valor o clientes con historial de devolucion, ChateaPro ofrece 3 modalidades de pago anticipado antes del despacho: transferencia, link de pago, o consignacion.",
    ejemplo: "Hola [nombre], para asegurar tu pedido de [producto] ($[valor]), te ofrecemos asegurar el envio con un anticipo. Elige: 1) Transferencia 2) Link de pago 3) Consignacion",
  },
  {
    nombre: "Escalamiento",
    tono: "risk" as const,
    descripcion: "Ordenes que no pasan los guardarrailes (zona rural confirmada, duplicada, tope de flete superado) se escalan al operador para revision manual. ChateaPro no las procesa.",
    ejemplo: "No aplica: la orden se devuelve al flujo manual con el motivo de rechazo visible para el operador.",
  },
];

export default function PocAutoconfirmacionContent() {
  const [tab, setTab] = useState<Tab>("concepto");

  return (
    <>
      <div className="exp-tabs">
        <button
          className={`exp-tab${tab === "concepto" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("concepto")}
        >
          Concepto
        </button>
        <button
          className={`exp-tab${tab === "hallazgos" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("hallazgos")}
        >
          Hallazgos ChateaPro
          <span className="exp-tab-badge">4 acciones</span>
        </button>
        <button
          className={`exp-tab${tab === "gates" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("gates")}
        >
          Gates y proximos pasos
          <span className="exp-tab-badge">3 gates</span>
        </button>
      </div>

      {tab === "concepto" && <TabConcepto />}
      {tab === "hallazgos" && <TabHallazgos />}
      {tab === "gates" && <TabGates />}
    </>
  );
}

// ── Tab 1: Concepto ────────────────────────────────────────────────────────

function TabConcepto() {
  return (
    <div>
      <p className="sim-sub">
        El wizard guia al autoconfirmador en 3 pasos: definir reglas, configurar
        la comunicacion con el cliente via ChateaPro, y simular el impacto sobre
        sus ordenes reales.
      </p>

      {/* Paso 1 — Reglas */}
      <SectionTitle hint="Paso 1 del wizard">Reglas de autoconfirmacion</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <StepNumber n={1} />
          <span style={{ fontSize: "var(--fs-title)", fontWeight: 600 }}>
            Reglas: que se autoconfirma y que no
          </span>
        </div>
        <p className="u-prose" style={{ marginBottom: 16 }}>
          El autoconfirmador activa o desactiva la autoconfirmacion con un toggle
          principal. Debajo, dos bloques de reglas filtran las ordenes que pasan.
        </p>

        <div className="u-grid" style={{ "--u-min": "240px" } as React.CSSProperties}>
          <Card tone="risk">
            <strong style={{ fontSize: "var(--fs-body)", display: "block", marginBottom: 6 }}>
              Guardarrailes fijos (no editables)
            </strong>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: "var(--fs-body)", lineHeight: 1.6, color: "var(--muted)" }}>
              <li>Zona rural detectada</li>
              <li>Orden duplicada (mismo destinatario + producto en 48h)</li>
            </ul>
            <p style={{ margin: "8px 0 0", fontSize: "var(--fs-label)", color: "var(--muted)" }}>
              Estas reglas siempre estan activas. Si se cumplen, la orden se escala
              al flujo manual sin importar las demas configuraciones.
            </p>
          </Card>

          <Card tone="warn">
            <strong style={{ fontSize: "var(--fs-body)", display: "block", marginBottom: 6 }}>
              Reglas configurables
            </strong>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: "var(--fs-body)", lineHeight: 1.6, color: "var(--muted)" }}>
              <li><strong style={{ color: "var(--text)" }}>Tope de flete:</strong> umbral maximo de flete para autoconfirmar</li>
              <li><strong style={{ color: "var(--text)" }}>Direccion verificada:</strong> solo autoconfirmar si la direccion ya fue validada</li>
              <li><strong style={{ color: "var(--text)" }}>Variantes de producto:</strong> excluir ordenes con variantes (talla, color) sin confirmar</li>
              <li><strong style={{ color: "var(--text)" }}>Huella de comprador:</strong> historial del cliente final como filtro</li>
            </ul>
          </Card>
        </div>
      </Card>

      {/* Paso 2 — Comunicacion ChateaPro */}
      <SectionTitle hint="Paso 2 del wizard">Comunicacion ChateaPro</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <StepNumber n={2} />
          <span style={{ fontSize: "var(--fs-title)", fontWeight: 600 }}>
            Que le dice ChateaPro al cliente final
          </span>
        </div>
        <p className="u-prose" style={{ marginBottom: 16 }}>
          Cada orden autoconfirmada dispara una accion de ChateaPro. El tipo de
          accion depende del perfil de riesgo de la orden, no de la voluntad del
          operador. El operador solo personaliza el mensaje de confirmacion.
        </p>

        <div className="u-grid" style={{ "--u-min": "260px" } as React.CSSProperties}>
          {/* Confirmacion */}
          <Card tone="ok">
            <DataList
              columns={1}
              items={[
                { label: "Accion", value: <Pill tone="ok">Confirmacion</Pill> },
                { label: "Trigger", value: "Orden pasa todas las reglas" },
                { label: "Personalizable", value: "Si — mensaje por producto" },
              ]}
            />
          </Card>

          {/* Verificacion IA */}
          <Card tone="info">
            <DataList
              columns={1}
              items={[
                { label: "Accion", value: <Pill tone="info">Verificacion IA</Pill> },
                { label: "Trigger", value: "Direccion con senales de riesgo" },
                { label: "Personalizable", value: "No — template fijo de verificacion" },
              ]}
            />
          </Card>

          {/* Confio */}
          <Card tone="warn">
            <DataList
              columns={1}
              items={[
                { label: "Accion", value: <Pill tone="warn">Confio (anticipo)</Pill> },
                { label: "Trigger", value: "Alto valor o historial de devolucion" },
                { label: "Modalidades", value: "3: transferencia, link de pago, consignacion" },
              ]}
            />
          </Card>
        </div>
      </Card>

      {/* Paso 3 — Simulador */}
      <SectionTitle hint="Paso 3 del wizard">Simulador de impacto</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <StepNumber n={3} />
          <span style={{ fontSize: "var(--fs-title)", fontWeight: 600 }}>
            Proyeccion sobre 18 ordenes con 4 acciones ChateaPro
          </span>
        </div>
        <p className="u-prose" style={{ marginBottom: 16 }}>
          El simulador toma las ordenes recientes del autoconfirmador, aplica las
          reglas configuradas en los pasos 1 y 2, y proyecta el resultado de cada
          una: confirmada, verificacion, confio o escalamiento.
        </p>

        {/* Stats resumen */}
        <div className="u-grid" style={{ "--u-min": "140px", marginBottom: 16 } as React.CSSProperties}>
          <Stat label="Confirmadas" value="9" tone="ok" hint="Autoconfirmacion directa" />
          <Stat label="Verificacion IA" value="3" tone="info" hint="Direccion a verificar" />
          <Stat label="Confio" value="3" tone="warn" hint="Pago anticipado" />
          <Stat label="Escaladas" value="3" tone="risk" hint="Revision manual" />
        </div>

        {/* Tabla de ordenes simuladas */}
        <div className="u-table-wrap">
          <table className="u-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Producto</th>
                <th data-align="right">Flete</th>
                <th>Accion ChateaPro</th>
                <th data-align="right">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {ORDENES_SIM.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontFamily: "var(--dropi-font-mono)", fontWeight: 600, fontSize: "var(--fs-label)" }}>
                      {o.id}
                    </span>
                  </td>
                  <td>{o.producto}</td>
                  <td data-align="right" style={{ fontVariantNumeric: "tabular-nums" }}>{o.flete}</td>
                  <td><Pill tone={o.accionTono}>{o.accion}</Pill></td>
                  <td data-align="right" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                    {o.resultado === "Manual" ? (
                      <span style={{ color: "var(--muted)" }}>{o.resultado}</span>
                    ) : (
                      <span style={{ color: "var(--green)" }}>{o.resultado}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ margin: "12px 0 0", fontSize: "var(--fs-label)", color: "var(--muted)" }}>
          Datos de ejemplo. El simulador real corre sobre las ordenes del ultimo mes del autoconfirmador
          y muestra la ganancia/perdida proyectada por orden con las reglas que configuro.
        </p>
      </Card>
    </div>
  );
}

// ── Tab 2: Hallazgos ChateaPro ─────────────────────────────────────────────

function TabHallazgos() {
  return (
    <div>
      <p className="sim-sub">
        Hallazgos clave de las sesiones de discovery con ChateaPro. El insight
        central: sin comunicacion al cliente, la autoconfirmacion no sirve.
      </p>

      {/* Insight central */}
      <SectionTitle>Insight central</SectionTitle>
      <Card tone="brand">
        <blockquote
          style={{
            margin: 0,
            padding: "0 0 0 14px",
            borderLeft: "3px solid var(--brand)",
            fontSize: "var(--fs-title)",
            fontWeight: 600,
            lineHeight: 1.45,
          }}
        >
          &ldquo;Si no hay comunicacion, la autoconfirmacion no sirve&rdquo;
        </blockquote>
        <p className="u-prose" style={{ marginTop: 12 }}>
          La autoconfirmacion sin un canal de comunicacion al cliente final genera
          ordenes &ldquo;fantasma&rdquo;: confirmadas en sistema pero sin que el
          comprador sepa que su pedido esta en camino, que datos se usaron, ni como
          corregirlos. El resultado es mas devoluciones, no menos trabajo manual.
        </p>
        <p className="u-prose" style={{ marginTop: 8 }}>
          ChateaPro cierra esa brecha: cada orden autoconfirmada dispara una
          conversacion por WhatsApp que confirma, verifica o escala segun el perfil
          de riesgo. El operador no desaparece del flujo — cambia de confirmar
          ordenes a supervisar excepciones.
        </p>
      </Card>

      {/* 4 acciones ChateaPro */}
      <SectionTitle hint="Modeladas durante las sesiones de discovery">
        4 acciones ChateaPro
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ACCIONES_CHATEAPRO.map((a) => (
          <Card key={a.nombre} tone={a.tono}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Pill tone={a.tono}>{a.nombre}</Pill>
            </div>
            <p className="u-prose" style={{ margin: "0 0 10px" }}>{a.descripcion}</p>
            <Disclosure summary="Ejemplo de mensaje">
              <div
                style={{
                  background: "var(--soft)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontFamily: "var(--dropi-font-mono)",
                  fontSize: "var(--fs-label)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {a.ejemplo}
              </div>
            </Disclosure>
          </Card>
        ))}
      </div>

      {/* Gate abierto */}
      <SectionTitle>Gate abierto</SectionTitle>
      <Card tone="warn">
        <strong style={{ display: "block", fontSize: "var(--fs-body)", marginBottom: 6 }}>
          ChateaPro tolera esperar la decision del autoconfirmador?
        </strong>
        <p className="u-prose" style={{ margin: 0 }}>
          Hoy ChateaPro se dispara de inmediato al crear la orden. Con
          autoconfirmacion, necesita esperar a que el motor de reglas decida si la
          orden pasa o se escala. Esto introduce un delay que ChateaPro no maneja
          hoy: su arquitectura asume que el trigger es sincronico.
        </p>
        <p className="u-prose" style={{ margin: "8px 0 0" }}>
          El gate no esta cerrado. Requiere validacion tecnica con el equipo de
          ChateaPro para confirmar si el trigger puede ser condicional (post-reglas)
          en vez de inmediato (post-creacion).
        </p>
      </Card>

      {/* Link al prototipo */}
      <SectionTitle>Prototipo RPP</SectionTitle>
      <Card>
        <DataList
          columns={1}
          items={[
            {
              label: "Prototipo Angular (RPP)",
              value: (
                <a
                  className="u-link"
                  href="https://dropitesters.co/old/configuraciones/configuracion-de-tienda?wizard=autoconfirmacion"
                  target="_blank"
                  rel="noreferrer"
                >
                  rpplab.vercel.app/autoconfirmacion
                </a>
              ),
              hint: "Prototipo funcional del wizard de 3 pasos. Sirve para probar el flujo, no para produccion.",
            },
            {
              label: "Estado",
              value: <Pill tone="info">Prototipo funcional</Pill>,
            },
            {
              label: "Uso",
              value: "Sesiones de discovery y validacion con usuarios. No tiene conexion a datos reales.",
            },
          ]}
        />
      </Card>
    </div>
  );
}

// ── Tab 3: Gates y proximos pasos ──────────────────────────────────────────

function TabGates() {
  return (
    <div>
      <p className="sim-sub">
        Tres gates tecnicos pendientes y los proximos pasos para pasar del POC
        a la implementacion.
      </p>

      <SectionTitle>Gates pendientes</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Gate 1 */}
        <Card tone="risk">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Pill tone="risk">Gate 1</Pill>
            <strong style={{ fontSize: "var(--fs-body)" }}>
              ChateaPro acepta trigger condicional
            </strong>
          </div>
          <DataList
            columns={1}
            items={[
              {
                label: "Pregunta",
                value: "Puede ChateaPro dispararse DESPUES de que el motor de reglas decida, en vez de al crear la orden?",
              },
              {
                label: "Riesgo",
                value: "Si ChateaPro no tolera el delay, el concepto entero se cae. Es el gate mas critico.",
              },
              {
                label: "Responsable",
                value: "Equipo ChateaPro (validacion tecnica de arquitectura de triggers)",
              },
              {
                label: "Estado",
                value: <Pill tone="risk">Abierto</Pill>,
              },
            ]}
          />
        </Card>

        {/* Gate 2 */}
        <Card tone="warn">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Pill tone="warn">Gate 2</Pill>
            <strong style={{ fontSize: "var(--fs-body)" }}>
              Trazabilidad manual vs automatica
            </strong>
          </div>
          <DataList
            columns={1}
            items={[
              {
                label: "Pregunta",
                value: "Quien rastrea el resultado de cada accion ChateaPro? El autoconfirmador lo ve en un dashboard o el sistema lo registra automaticamente?",
              },
              {
                label: "Impacto",
                value: "Sin trazabilidad, el autoconfirmador no puede ajustar sus reglas porque no sabe que paso con cada orden despues de ChateaPro.",
              },
              {
                label: "Opciones",
                value: "A) Dashboard con resultados por accion. B) Log en la timeline de la orden. C) Ambos.",
              },
              {
                label: "Estado",
                value: <Pill tone="warn">En exploracion</Pill>,
              },
            ]}
          />
        </Card>

        {/* Gate 3 */}
        <Card tone="warn">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Pill tone="warn">Gate 3</Pill>
            <strong style={{ fontSize: "var(--fs-body)" }}>
              Guardarrailes: ruralidad y duplicidad
            </strong>
          </div>
          <DataList
            columns={1}
            items={[
              {
                label: "Pregunta",
                value: "Como detecta el sistema que una direccion es zona rural? Y como define 'duplicada' (mismo destinatario + producto en 48h, o criterio distinto)?",
              },
              {
                label: "Dependencia",
                value: "La deteccion de ruralidad depende de la cobertura del API de transportadoras. La duplicidad requiere un indice sobre ordenes recientes.",
              },
              {
                label: "Riesgo",
                value: "Sin estos guardarrailes, la autoconfirmacion despacha ordenes que hoy se rechazan manualmente por razones validas.",
              },
              {
                label: "Estado",
                value: <Pill tone="warn">Pendiente definicion tecnica</Pill>,
              },
            ]}
          />
        </Card>
      </div>

      {/* Proximos pasos */}
      <SectionTitle>Proximos pasos</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <StepNumber n={1} />
            <strong style={{ fontSize: "var(--fs-body)" }}>Resolver gate ChateaPro</strong>
          </div>
          <p className="u-prose" style={{ margin: 0 }}>
            Sesion tecnica con el equipo de ChateaPro para validar si el trigger
            puede ser condicional. Si no puede, explorar alternativa: cola de
            mensajes con delay configurable.
          </p>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <StepNumber n={2} />
            <strong style={{ fontSize: "var(--fs-body)" }}>Corregir pantalla de impacto economico</strong>
          </div>
          <p className="u-prose" style={{ margin: 0 }}>
            El simulador actual muestra una tasa T4 del 17% que no refleja el
            escenario real. Recalcular con datos actualizados y validar la formula
            de ganancia/perdida por orden con el equipo de data.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "var(--fs-label)", color: "var(--muted)" }}>
            Referencia: T4 = ordenes no entregadas / total ordenes autoconfirmables.
            El 17% es un placeholder que se sabe incorrecto.
          </p>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <StepNumber n={3} />
            <strong style={{ fontSize: "var(--fs-body)" }}>Prueba de outcome</strong>
          </div>
          <p className="u-prose" style={{ margin: 0 }}>
            Disenar una prueba controlada con un grupo de autoconfirmadores reales:
            medir tiempo de confirmacion, tasa de entrega y tasa de devolucion
            antes/despues de activar ChateaPro. El outcome no es &ldquo;se
            autoconfirmaron mas ordenes&rdquo; sino &ldquo;las ordenes
            autoconfirmadas se entregaron mas&rdquo;.
          </p>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <StepNumber n={4} />
            <strong style={{ fontSize: "var(--fs-body)" }}>Definir antes/despues del simulador</strong>
          </div>
          <p className="u-prose" style={{ margin: 0 }}>
            El paso 3 del wizard necesita mostrar dos estados: como se ven las
            ordenes HOY (sin autoconfirmacion) vs como se verian CON las reglas
            configuradas. La comparacion es lo que convence al autoconfirmador de
            activar la funcionalidad.
          </p>
        </Card>
      </div>
    </div>
  );
}

// ── Utilidad: numero de paso ───────────────────────────────────────────────

function StepNumber({ n }: { n: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 12,
        background: "var(--brand)",
        color: "#fff",
        fontSize: "var(--fs-label)",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}
