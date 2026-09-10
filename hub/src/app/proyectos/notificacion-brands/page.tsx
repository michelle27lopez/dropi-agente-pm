"use client";

/**
 * Notificación Brands · Prototipo
 * Experimento (célula Brands): avisar al consumidor final el estado de su orden por WhatsApp.
 *
 * Insumo: export real de órdenes de UNA marca (CSV/Excel). La vista muestra el ESTADO ACTUAL
 * de cada orden (último status conocido). Por defecto oculta las órdenes en estado final
 * (entregadas, devoluciones, reemplazadas, canceladas, rechazadas) porque la vista es para
 * la actividad diaria: lo que todavía necesita gestión hoy.
 *
 * El botón "Enviar WA" abre wa.me con el mensaje del estado prellenado — el envío lo confirma
 * la persona en WhatsApp. Ruta: /proyectos/notificacion-brands
 */

import React, { useMemo, useRef, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import { Upload, Send, MessageCircle, Copy, Check, RefreshCw, AlertTriangle } from "lucide-react";

/* ----------------------------- helpers ----------------------------- */

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isNullish = (v: string) => {
  const t = (v ?? "").toString().trim();
  return t === "" || /^(null|nan|none|n\/a|-)$/i.test(t);
};

const cleanCell = (v: unknown): string => {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  let s = String(v).trim();
  if (/^-?\d+\.0+$/.test(s)) s = s.replace(/\.0+$/, ""); // 3148161393.0 -> 3148161393
  return s;
};

type FieldKey =
  | "cliente"
  | "apellido"
  | "ciudad"
  | "telefono"
  | "guia"
  | "transportadora"
  | "estado"
  | "novedad"
  | "fechaGen"
  | "fechaEnt"
  | "marca";

const FIELDS: { key: FieldKey; label: string; syn: string[]; required?: boolean }[] = [
  { key: "cliente", label: "Nombre cliente", required: true, syn: ["name", "cliente", "nombre cliente", "nombre del cliente", "nombre", "destinatario", "customer", "nombre destinatario"] },
  { key: "apellido", label: "Apellido (opcional)", syn: ["surname", "apellido", "apellidos", "last name", "lastname"] },
  { key: "ciudad", label: "Ciudad", syn: ["city", "ciudad", "ciudad destino", "ciudad cliente", "ciudad de entrega", "municipio"] },
  { key: "telefono", label: "Teléfono", required: true, syn: ["phone", "telefono", "celular", "whatsapp", "tel", "movil", "contacto", "numero de contacto", "telefono cliente", "celular cliente"] },
  { key: "guia", label: "Guía", syn: ["shipping guide", "guide", "guia", "numero guia", "numero de guia", "no guia", "nro guia", "tracking", "guia transportadora", "guia de envio"] },
  { key: "transportadora", label: "Transportadora", syn: ["shipping company", "transportadora", "carrier", "courier", "operador logistico", "transportador", "empresa de envio", "company"] },
  { key: "estado", label: "Estado", required: true, syn: ["status", "estado", "estado orden", "estado de la orden", "estado envio", "estado guia", "estatus"] },
  { key: "novedad", label: "Novedad", syn: ["novedad", "novedad servientrega", "observacion", "observaciones", "motivo novedad", "detalle novedad", "nota", "comentario", "incidencia", "motivo"] },
  { key: "fechaGen", label: "Fecha generación", syn: ["created at", "fecha generacion", "fecha de generacion", "fecha creacion", "fecha de creacion", "fecha orden", "fecha de la orden", "fecha", "fecha registro"] },
  { key: "fechaEnt", label: "Fecha entrega (opcional)", syn: ["date entregado o devuelto", "fecha entrega", "fecha de entrega", "fecha entregado", "delivered at", "fecha real de entrega", "updated at"] },
  { key: "marca", label: "Marca / tienda (opcional)", syn: ["marca", "tienda", "empresa", "negocio", "remitente", "nombre tienda", "store", "shop"] },
];

function autodetect(headers: string[]): Record<FieldKey, string> {
  const nh = headers.map((h) => ({ raw: h, n: norm(h) }));
  const out = {} as Record<FieldKey, string>;
  const taken = new Set<string>();
  for (const f of FIELDS) {
    let hit = "";
    for (const s of f.syn) {
      const exact = nh.find((h) => h.n === s && !taken.has(h.raw));
      if (exact) { hit = exact.raw; break; }
    }
    if (!hit) {
      for (const s of f.syn) {
        const partial = nh.find((h) => !taken.has(h.raw) && (h.n.includes(s) || s.includes(h.n)));
        if (partial) { hit = partial.raw; break; }
      }
    }
    if (hit) taken.add(hit);
    out[f.key] = hit;
  }
  return out;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const t = String(s).trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  m = t.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (m) {
    let y = +m[3];
    if (y < 100) y += 2000;
    return new Date(y, +m[2] - 1, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  }
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

const DAY = 86400000;
const diffDays = (a: Date, b: Date) => Math.max(0, Math.floor((b.getTime() - a.getTime()) / DAY));

const CC_OPTIONS = [
  { code: "57", label: "🇨🇴 Colombia (+57)" },
  { code: "52", label: "🇲🇽 México (+52)" },
  { code: "593", label: "🇪🇨 Ecuador (+593)" },
  { code: "51", label: "🇵🇪 Perú (+51)" },
  { code: "56", label: "🇨🇱 Chile (+56)" },
];

function waNumber(raw: string, cc: string): string {
  let d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith(cc)) return d;
  d = d.replace(/^0+/, "");
  if (d.length <= 10) return cc + d;
  return d;
}

type EstadoKey =
  | "PENDIENTE_CONF"
  | "EN_PROCESO"
  | "GUIA_GENERADA"
  | "EN_BODEGA"
  | "EN_TRANSITO"
  | "EN_REPARTO"
  | "INTENTO_ENTREGA"
  | "NOVEDAD"
  | "RECLAME_OFICINA"
  | "ENTREGADO"
  | "DEVUELTA"
  | "REEMPLAZADA"
  | "RECHAZADO"
  | "CANCELADO"
  | "GENERICO";

function estadoKey(estado: string): EstadoKey {
  const n = norm(estado);
  if (!n) return "GENERICO";
  if (n.includes("pendiente") && (n.includes("confirm") || n.includes("conf"))) return "PENDIENTE_CONF";
  if (n.includes("telemercadeo")) return "PENDIENTE_CONF";
  if (n.includes("reclame") || n.includes("reclamar") || n.includes("en oficina")) return "RECLAME_OFICINA";
  if (n.includes("reemplaz")) return "REEMPLAZADA";
  if (n.includes("rechaz")) return "RECHAZADO";
  if (n.includes("cancel") || n.includes("anulad")) return "CANCELADO";
  if (n.includes("intento de entrega") || n.includes("intento entrega")) return "INTENTO_ENTREGA";
  if (n.includes("entregad")) return "ENTREGADO";
  if (n.includes("devol") || n.includes("devuelt") || n.includes("a remitente")) return "DEVUELTA";
  if (n.includes("novedad")) return "NOVEDAD";
  if (n.includes("reparto") || n.includes("en ruta") || n.includes("distribucion")) return "EN_REPARTO";
  if (n.includes("bodega") && n.includes("origen")) return "EN_PROCESO";
  if (n.includes("espera de ruta") || n.includes("transito") || n.includes("camino") || n.includes("transporte") || n.includes("despachad")) return "EN_TRANSITO";
  if (n.includes("bodega") || n.includes("admitid") || n.includes("recolectad") || n.includes("recogid")) return "EN_BODEGA";
  if (n.includes("procesamiento") || n.includes("en proceso") || n === "pendiente" || n.includes("pendiente")) return "EN_PROCESO";
  if (n.includes("generad") || n.includes("guia") || n.includes("creada")) return "GUIA_GENERADA";
  return "GENERICO";
}

const ESTADO_UI: Record<EstadoKey, { label: string; fg: string; bg: string; terminal: boolean; delivered: boolean }> = {
  PENDIENTE_CONF: { label: "Pendiente confirmación", fg: "#92400E", bg: "#FEF3C7", terminal: false, delivered: false },
  EN_PROCESO: { label: "En procesamiento", fg: "#3730A3", bg: "#EEF2FF", terminal: false, delivered: false },
  GUIA_GENERADA: { label: "Guía generada", fg: "#3730A3", bg: "#EEF2FF", terminal: false, delivered: false },
  EN_BODEGA: { label: "En bodega transp.", fg: "#3730A3", bg: "#EEF2FF", terminal: false, delivered: false },
  EN_TRANSITO: { label: "En tránsito", fg: "#1D4ED8", bg: "#EFF6FF", terminal: false, delivered: false },
  EN_REPARTO: { label: "En reparto", fg: "#0369A1", bg: "#E0F2FE", terminal: false, delivered: false },
  INTENTO_ENTREGA: { label: "Intento de entrega", fg: "#B45309", bg: "#FFFBEB", terminal: false, delivered: false },
  NOVEDAD: { label: "Novedad", fg: "#B45309", bg: "#FFFBEB", terminal: false, delivered: false },
  RECLAME_OFICINA: { label: "Reclame en oficina", fg: "#7C2D12", bg: "#FFEDD5", terminal: false, delivered: false },
  ENTREGADO: { label: "Entregado", fg: "#15803D", bg: "#F0FDF4", terminal: true, delivered: true },
  DEVUELTA: { label: "Devolución", fg: "#B91C1C", bg: "#FEF2F2", terminal: true, delivered: false },
  REEMPLAZADA: { label: "Reemplazada", fg: "#6B7280", bg: "#F3F4F6", terminal: true, delivered: false },
  RECHAZADO: { label: "Rechazado", fg: "#B91C1C", bg: "#FEF2F2", terminal: true, delivered: false },
  CANCELADO: { label: "Cancelado", fg: "#6B7280", bg: "#F3F4F6", terminal: true, delivered: false },
  GENERICO: { label: "Sin estado", fg: "#6B7280", bg: "#F3F4F6", terminal: false, delivered: false },
};

function waMessage(
  k: EstadoKey,
  c: { nombre: string; marca: string; transportadora: string; guia: string; ciudad: string; estado: string; novedad: string }
): string {
  const marca = c.marca || "tu tienda";
  const transp = c.transportadora || "la transportadora";
  const guia = c.guia || "—";
  const ciudad = c.ciudad ? ` en ${c.ciudad}` : "";
  const solucionada = norm(c.estado).includes("solucion");
  switch (k) {
    case "PENDIENTE_CONF":
      return `Hola ${c.nombre} 👋 Te escribimos de ${marca}. Tu pedido está pendiente de confirmación para poder despacharlo${ciudad}. ¿Nos confirmas que lo quieres recibir? Responde SÍ y lo enviamos hoy.`;
    case "EN_PROCESO":
      return `Hola ${c.nombre} 🧾 Tu pedido de ${marca} está en preparación. Apenas lo despachemos con la transportadora te compartimos el número de guía para que lo sigas.`;
    case "GUIA_GENERADA":
      return `Hola ${c.nombre} 🎉 Tu pedido en ${marca} quedó confirmado y ya lo estamos alistando. En breve te compartimos el número de guía para que sigas tu envío.`;
    case "INTENTO_ENTREGA":
      return `Hola ${c.nombre} 🚪 ${transp} intentó entregar tu pedido de ${marca}${ciudad} y no fue posible (guía ${guia}). Respóndenos con un horario y un punto de referencia para el nuevo intento de entrega.`;
    case "EN_BODEGA":
      return `Hola ${c.nombre} 📦 Tu pedido de ${marca} ya fue entregado a ${transp} (guía ${guia}). Pronto sale a ruta, te avisamos en cada paso.`;
    case "EN_TRANSITO":
      return `Hola ${c.nombre} 🛣️ Tu pedido de ${marca} va en camino con ${transp}. Guía ${guia}. Te escribimos cuando salga a reparto a tu dirección.`;
    case "EN_REPARTO":
      return `Hola ${c.nombre} 🚚 ¡Buenas noticias! Tu pedido de ${marca} sale hoy a reparto con ${transp}. Ten a la mano el pago contra entrega. Guía ${guia}.`;
    case "NOVEDAD":
      return solucionada
        ? `Hola ${c.nombre} ✅ La novedad de tu pedido de ${marca} (guía ${guia}) quedó resuelta y sigue su camino. Te avisamos cuando salga a reparto.`
        : `Hola ${c.nombre} ⚠️ Tuvimos un inconveniente para entregar tu pedido de ${marca} (guía ${guia}).${c.novedad ? ` Motivo: ${c.novedad}.` : ""} Respóndenos con tu dirección exacta y un horario de contacto y lo reprogramamos.`;
    case "RECLAME_OFICINA":
      return `Hola ${c.nombre} 📢 Tu pedido de ${marca} está en la oficina de ${transp}${ciudad} listo para reclamar. Guía ${guia}. Lleva tu documento de identidad. Si prefieres reenvío a tu dirección, respóndenos este mensaje.`;
    case "ENTREGADO":
      return `Hola ${c.nombre} ✅ Tu pedido de ${marca} fue entregado. ¡Esperamos que lo disfrutes! 💛 Cuéntanos qué te pareció respondiendo este mensaje.`;
    case "DEVUELTA":
      return `Hola ${c.nombre} Tu pedido de ${marca} (guía ${guia}) entró en proceso de devolución. Si aún lo quieres, escríbenos y coordinamos un nuevo envío.`;
    case "REEMPLAZADA":
      return `Hola ${c.nombre} Tu pedido de ${marca} fue reemplazado por una nueva guía. Apenas esté disponible te compartimos el nuevo número de seguimiento.`;
    case "RECHAZADO":
      return `Hola ${c.nombre} Registramos que tu pedido de ${marca} fue rechazado en la entrega. Si fue un error, respóndenos y coordinamos un nuevo envío.`;
    case "CANCELADO":
      return `Hola ${c.nombre} Tu pedido de ${marca} fue cancelado. Si fue un error o quieres retomarlo, respóndenos y te ayudamos.`;
    default:
      return `Hola ${c.nombre} 👋 Te escribimos de ${marca} sobre tu pedido (guía ${guia}). Estado actual: ${c.estado || "en gestión"}.`;
  }
}

/* ----------------------------- sample data (formato real) ----------------------------- */

const SAMPLE_HEADERS = ["country_code", "id", "created_at", "user_id", "status", "shipping_company", "shipping_guide", "total_order", "dir", "phone", "updated_at", "name", "surname", "city", "novedad_servientrega", "date_entregado_o_devuelto"];
const SAMPLE_ROWS: string[][] = [
  ["CO", "89019824", "2026-09-10T01:23:23", "653912", "PENDIENTE CONFIRMACION", "INTERRAPIDISIMO", "", "84900", "Interrapidísimo Troncal", "3105075781", "2026-09-10T01:23:24", "Yureidys", "Muñeton", "TARAZA", "", ""],
  ["CO", "89007478", "2026-09-09T21:51:16", "653912", "PENDIENTE", "ENVIA", "", "84900", "Cra 7 calle 5 # 5-04 El oasis", "3205860607", "2026-09-09T22:01:15", "Ana maría", "Cañizares", "SAN ALBERTO", "", ""],
  ["CO", "88950011", "2026-09-07T08:00:00", "653912", "EN PROCESAMIENTO", "COORDINADORA", "", "84900", "Calle 10 # 2-3", "3147583447", "2026-09-09T09:00:00", "Carmen", "Alvis", "EL DIFICIL", "", ""],
  ["CO", "88800022", "2026-09-05T11:00:00", "653912", "DESPACHADA", "ENVIA", "24099887766", "74900", "Calle 5 # 6-7", "3008711530", "2026-09-09T07:00:00", "Vanessa", "Ortiz", "BARRANQUILLA", "", ""],
  ["CO", "88700033", "2026-09-04T10:00:00", "653912", "EN REPARTO", "INTERRAPIDISIMO", "240059335964", "79900", "Cra 8 # 12-30", "3009476882", "2026-09-10T06:00:00", "Verónica", "Pérez", "MONTELIBANO", "", ""],
  ["CO", "88500044", "2026-09-02T08:00:00", "653912", "INTENTO DE ENTREGA", "COORDINADORA", "36395858368", "89900", "Av 3 # 4-5", "3225892173", "2026-09-09T09:00:00", "Yuliana", "Mena", "QUIBDO", "DESTINATARIO NO SE ENCONTRABA", ""],
  ["CO", "88300055", "2026-08-25T09:00:00", "653912", "NOVEDAD", "COORDINADORA", "36395858111", "89900", "Cll 9 # 1-1", "3113306853", "2026-09-08T09:00:00", "Jazmin", "Rúa", "QUINCHIA", "NO SE LOCALIZA DIRECCION DEL DESTINATARIO", ""],
  ["CO", "86326407", "2026-08-17T09:20:00", "653912", "RECLAME EN OFICINA", "INTERRAPIDISIMO", "240059698103", "79900", "Cra 8 # 12-30", "3113306853", "2026-09-07T14:00:00", "Verónica", "Salas", "MONTELIBANO", "", ""],
  ["CO", "87001900", "2026-08-30T20:22:36", "653912", "ENTREGADO", "ENVIA", "24033794121", "79800", "Calle 47 # 10-06", "3148062337", "2026-09-04T00:55:35", "Ausberto", "Gómez", "RIOHACHA", "", "2026-09-04T00:55:35"],
  ["CO", "77508289", "2026-08-20T14:37:47", "653912", "REEMPLAZADA", "COORDINADORA", "", "79900", "Centro Rovira", "3132467349", "2026-08-28T15:32:42", "Yoselin", "Díaz", "ROVIRA", "SE VISITA NO SE LOGRA ENTREGA", ""],
];

/* ----------------------------- styles ----------------------------- */

const card: React.CSSProperties = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 18 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--muted)", borderBottom: "2px solid var(--border)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "9px 10px", fontSize: 12.5, color: "var(--fg)", borderBottom: "1px solid var(--border)", verticalAlign: "middle" };
const btnPrimary: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, background: "#25D366", color: "#04310f", border: "none", borderRadius: 9, padding: "7px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" };
const chip = (active: boolean): React.CSSProperties => ({ padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer", border: `1px solid ${active ? "var(--dropi)" : "var(--border)"}`, background: active ? "var(--dropi-light)" : "var(--card)", color: active ? "var(--dropi)" : "var(--muted)" });

/* ----------------------------- types ----------------------------- */

interface Row {
  idx: number;
  cliente: string;
  ciudad: string;
  telefono: string;
  guia: string;
  transportadora: string;
  estado: string;
  novedad: string;
  fechaGen: Date | null;
  fechaEnt: Date | null;
  marca: string;
  ek: EstadoKey;
}

/* ----------------------------- page ----------------------------- */

const SENT_KEY = "notif-brands-sent-v1";
const loadSent = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || "{}");
  } catch {
    return {};
  }
};

export default function NotificacionBrandsPage() {
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [map, setMap] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [marcaOverride, setMarcaOverride] = useState("");
  const [cc, setCc] = useState("57");
  const [q, setQ] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoKey | "TODOS">("TODOS");
  const [soloActividad, setSoloActividad] = useState(true);
  const [sent, setSent] = useState<Record<string, string>>(() => (typeof window === "undefined" ? {} : loadSent()));
  const [modal, setModal] = useState<Row | null>(null);
  const [modalMsg, setModalMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function ingest(headers: string[], rows: Record<string, string>[], name: string) {
    setRawHeaders(headers);
    setRawRows(rows);
    setMap(autodetect(headers));
    setFileName(name);
    setParseError("");
    setEstadoFilter("TODOS");
  }

  async function handleFile(file: File) {
    setParseError("");
    try {
      const XLSX = await import("xlsx");
      const isCsv = /\.csv$/i.test(file.name) || file.type === "text/csv" || file.type === "text/plain";
      let wb;
      if (isCsv) {
        // Detecta el separador (Dropi exporta con ";", Excel-US con ","): cuenta
        // en la primera línea y usa el que más aparezca.
        const text = await file.text();
        const nl = text.search(/\r?\n/);
        const firstLine = nl >= 0 ? text.slice(0, nl) : text.slice(0, 4000);
        const c = (ch: string) => (firstLine.match(new RegExp("\\" + ch, "g")) || []).length;
        const semi = c(";"), comma = c(","), tab = (firstLine.match(/\t/g) || []).length;
        const FS = tab > semi && tab > comma ? "\t" : semi >= comma ? ";" : ",";
        wb = XLSX.read(text, { type: "string", FS, cellDates: true });
      } else {
        const buf = await file.arrayBuffer();
        wb = XLSX.read(buf, { type: "array", cellDates: true });
      }
      const ws = wb.Sheets[wb.SheetNames[0]];
      const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "", blankrows: false });
      if (!aoa.length) {
        setParseError("El archivo no tiene filas.");
        return;
      }
      const headers = (aoa[0] || []).map((h) => String(h ?? "").trim()).filter(Boolean);
      const rows = aoa.slice(1).map((r) => {
        const o: Record<string, string> = {};
        headers.forEach((h, i) => (o[h] = cleanCell((r as unknown[])[i])));
        return o;
      });
      ingest(headers, rows, file.name);
    } catch (e) {
      setParseError("No se pudo leer el archivo. Verifica que sea un CSV o Excel válido. " + String(e));
    }
  }

  function loadSample() {
    const rows = SAMPLE_ROWS.map((r) => {
      const o: Record<string, string> = {};
      SAMPLE_HEADERS.forEach((h, i) => (o[h] = r[i] ?? ""));
      return o;
    });
    ingest(SAMPLE_HEADERS, rows, "datos de ejemplo");
  }

  const rows: Row[] = useMemo(() => {
    if (!rawRows.length) return [];
    const g = (r: Record<string, string>, k: FieldKey) => {
      const raw = map[k] ? r[map[k]] || "" : "";
      return isNullish(raw) ? "" : raw;
    };
    return rawRows.map((r, idx) => {
      const estado = g(r, "estado");
      const nombre = [g(r, "cliente"), g(r, "apellido")].filter(Boolean).join(" ").trim();
      return {
        idx,
        cliente: nombre,
        ciudad: g(r, "ciudad"),
        telefono: g(r, "telefono"),
        guia: g(r, "guia"),
        transportadora: g(r, "transportadora"),
        estado,
        novedad: g(r, "novedad"),
        fechaGen: parseDate(g(r, "fechaGen")),
        fechaEnt: parseDate(g(r, "fechaEnt")),
        marca: marcaOverride || g(r, "marca"),
        ek: estadoKey(estado),
      };
    });
  }, [rawRows, map, marcaOverride]);

  const rowKey = (r: Row) => r.guia || `row-${r.idx}`;

  const counts = useMemo(() => {
    let actividad = 0, pendConf = 0, novedad = 0, oficina = 0, notificadas = 0;
    for (const r of rows) {
      if (!ESTADO_UI[r.ek].terminal) actividad++;
      if (r.ek === "PENDIENTE_CONF") pendConf++;
      if (r.ek === "NOVEDAD") novedad++;
      if (r.ek === "RECLAME_OFICINA") oficina++;
      if (sent[rowKey(r)]) notificadas++;
    }
    return { total: rows.length, actividad, pendConf, novedad, oficina, notificadas };
  }, [rows, sent]);

  const filtered = useMemo(() => {
    const nq = norm(q);
    return rows.filter((r) => {
      if (soloActividad && ESTADO_UI[r.ek].terminal) return false;
      if (estadoFilter !== "TODOS" && r.ek !== estadoFilter) return false;
      if (nq) {
        const hay = norm(`${r.cliente} ${r.ciudad} ${r.guia} ${r.telefono} ${r.transportadora} ${r.novedad}`);
        if (!hay.includes(nq)) return false;
      }
      return true;
    });
  }, [rows, q, estadoFilter, soloActividad]);

  function tiempo(r: Row): { label: string; fg: string } {
    const ui = ESTADO_UI[r.ek];
    if (ui.delivered) {
      if (r.fechaGen && r.fechaEnt) return { label: `Entregada en ${diffDays(r.fechaGen, r.fechaEnt)} d`, fg: "#15803D" };
      return { label: "Entregada", fg: "#15803D" };
    }
    if (ui.terminal) return { label: "Cerrada", fg: "var(--muted)" };
    if (!r.fechaGen) return { label: "—", fg: "var(--muted)" };
    const d = diffDays(r.fechaGen, new Date());
    const fg = d >= 15 ? "#B91C1C" : d >= 7 ? "#B45309" : "var(--fg)";
    return { label: `${d} d en curso`, fg };
  }

  function openModal(r: Row) {
    setModal(r);
    setModalMsg(
      waMessage(r.ek, {
        nombre: r.cliente || "",
        marca: r.marca || "",
        transportadora: r.transportadora || "",
        guia: r.guia || "",
        ciudad: r.ciudad || "",
        estado: r.estado || "",
        novedad: r.novedad || "",
      })
    );
    setCopied(false);
  }

  function markSent(r: Row) {
    const next = { ...sent, [rowKey(r)]: new Date().toISOString() };
    setSent(next);
    try {
      localStorage.setItem(SENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function sendWa() {
    if (!modal) return;
    const num = waNumber(modal.telefono, cc);
    if (!num) {
      alert("Esta fila no tiene un teléfono válido.");
      return;
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(modalMsg)}`, "_blank", "noopener");
    markSent(modal);
    setModal(null);
  }

  const missingRequired = FIELDS.filter((f) => f.required && !map[f.key]);
  const hasData = rows.length > 0;
  const estadosPresentes = (Object.keys(ESTADO_UI) as EstadoKey[]).filter(
    (k) => k !== "GENERICO" && rows.some((r) => r.ek === k) && (!soloActividad || !ESTADO_UI[k].terminal)
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Notificación Brands · Prototipo"
        subtitle="Experimento — avisar al cliente final el estado de su orden por WhatsApp"
        currentSlug="notificacion-brands"
      />

      <main style={{ maxWidth: 1240, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ ...card, background: "var(--dropi-light)", borderColor: "var(--dropi)" }}>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)" }}>
            <strong>Update actual.</strong> Cada fila es el <em>último estado conocido</em> de una orden de la
            marca. Por defecto se ocultan las órdenes en estado final (entregada, devolución, reemplazada,
            cancelada, rechazada): esta vista es para la <strong>actividad diaria</strong> — lo que todavía
            necesita gestión hoy. Quita el check “Solo actividad diaria” para ver el histórico completo.
          </div>
        </div>

        {/* Carga */}
        <div style={card}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <button onClick={() => fileRef.current?.click()} style={{ ...btnPrimary, background: "var(--dropi)", color: "#fff" }}>
              <Upload size={15} /> Cargar CSV / Excel
            </button>
            <button onClick={loadSample} style={{ ...btnPrimary, background: "var(--card)", color: "var(--fg)", border: "1px solid var(--border)" }}>
              <RefreshCw size={14} /> Usar datos de ejemplo
            </button>
            {fileName && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {fileName} · {rawRows.length} órdenes en el archivo
              </span>
            )}
          </div>
          {parseError && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#B91C1C", display: "flex", gap: 6 }}>
              <AlertTriangle size={14} /> {parseError}
            </div>
          )}

          {rawHeaders.length > 0 && (
            <details style={{ marginTop: 14 }} open={missingRequired.length > 0}>
              <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 800, color: "var(--fg)" }}>
                Mapeo de columnas{" "}
                {missingRequired.length > 0 && (
                  <span style={{ color: "#B91C1C" }}>· falta asignar {missingRequired.map((f) => f.label).join(", ")}</span>
                )}
              </summary>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                {FIELDS.map((f) => (
                  <label key={f.key} style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
                    {f.label}
                    {f.required && <span style={{ color: "#B91C1C" }}> *</span>}
                    <select
                      value={map[f.key] || ""}
                      onChange={(e) => setMap((m) => ({ ...m, [f.key]: e.target.value }))}
                      style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", fontSize: 12 }}
                    >
                      <option value="">— sin asignar —</option>
                      {rawHeaders.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
                  Marca (si el archivo no la trae)
                  <input
                    value={marcaOverride}
                    onChange={(e) => setMarcaOverride(e.target.value)}
                    placeholder="Ej: Aura Cosmética"
                    style={{ display: "block", marginTop: 4, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", fontSize: 12 }}
                  />
                </label>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
                  Indicativo país
                  <select
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    style={{ display: "block", marginTop: 4, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", fontSize: 12 }}
                  >
                    {CC_OPTIONS.map((o) => (
                      <option key={o.code} value={o.code}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </details>
          )}
        </div>

        {!hasData && (
          <div style={{ ...card, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
            Carga el export de órdenes de la marca (CSV/Excel) o usa los datos de ejemplo. Reconoce
            automáticamente columnas tipo <code>status</code>, <code>shipping_company</code>,{" "}
            <code>shipping_guide</code>, <code>created_at</code>, <code>name</code>, <code>city</code>,{" "}
            <code>phone</code> y <code>novedad_*</code>.
          </div>
        )}

        {hasData && (
          <>
            {/* Resumen */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                { k: "En actividad", v: counts.actividad, c: "var(--dropi)" },
                { k: "Pendiente confirm.", v: counts.pendConf, c: "#92400E" },
                { k: "Reclame en oficina", v: counts.oficina, c: "#7C2D12" },
                { k: "Con novedad", v: counts.novedad, c: "#B45309" },
                { k: "Notificadas", v: counts.notificadas, c: "#15803D" },
              ].map((s) => (
                <div key={s.k} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 16px", minWidth: 120 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{s.k}</div>
                </div>
              ))}
              <div style={{ alignSelf: "center", fontSize: 11, color: "var(--muted)" }}>de {counts.total} órdenes en el archivo</div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar cliente, ciudad, guía, novedad…"
                style={{ padding: "7px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", fontSize: 12.5, minWidth: 240 }}
              />
              <span style={chip(estadoFilter === "TODOS")} onClick={() => setEstadoFilter("TODOS")}>
                Todos
              </span>
              {estadosPresentes.map((k) => (
                <span key={k} style={chip(estadoFilter === k)} onClick={() => setEstadoFilter(k)}>
                  {ESTADO_UI[k].label}
                </span>
              ))}
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", display: "flex", gap: 5, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={soloActividad} onChange={(e) => setSoloActividad(e.target.checked)} />
                Solo actividad diaria
              </label>
            </div>

            {/* Tabla */}
            <div style={{ ...card, padding: 0, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1080 }}>
                <thead>
                  <tr>
                    <th style={th}>Cliente</th>
                    <th style={th}>Ciudad</th>
                    <th style={th}>Teléfono</th>
                    <th style={th}>Guía</th>
                    <th style={th}>Transportadora</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Novedad</th>
                    <th style={th}>Fecha generación</th>
                    <th style={th}>Tiempo</th>
                    <th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const ui = ESTADO_UI[r.ek];
                    const t = tiempo(r);
                    const sentAt = sent[rowKey(r)];
                    const num = waNumber(r.telefono, cc);
                    return (
                      <tr key={r.idx}>
                        <td style={{ ...td, fontWeight: 700 }}>{r.cliente || "—"}</td>
                        <td style={td}>{r.ciudad || "—"}</td>
                        <td style={{ ...td, whiteSpace: "nowrap", color: num ? "var(--fg)" : "#B91C1C" }}>{r.telefono || "—"}</td>
                        <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontSize: 11.5 }}>{r.guia || "—"}</td>
                        <td style={td}>{r.transportadora || "—"}</td>
                        <td style={td}>
                          <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: ui.fg, background: ui.bg }}>
                            {ui.label}
                          </span>
                        </td>
                        <td style={{ ...td, maxWidth: 220, color: "var(--muted)" }}>{r.novedad || "—"}</td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}>{r.fechaGen ? r.fechaGen.toLocaleDateString("es-CO") : "—"}</td>
                        <td style={{ ...td, whiteSpace: "nowrap", fontWeight: 700, color: t.fg }}>{t.label}</td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}>
                          <button style={{ ...btnPrimary, opacity: num ? 1 : 0.45 }} disabled={!num} onClick={() => openModal(r)} title={num ? `WhatsApp a +${num}` : "Sin teléfono válido"}>
                            <Send size={13} /> Enviar WA
                          </button>
                          {sentAt && (
                            <div style={{ fontSize: 10, color: "#15803D", fontWeight: 700, marginTop: 3 }}>
                              ✓ {new Date(sentAt).toLocaleString("es-CO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td style={{ ...td, textAlign: "center", color: "var(--muted)" }} colSpan={10}>
                        {soloActividad ? "No hay órdenes en actividad con esos filtros — todo está en estado final." : "Ninguna orden con esos filtros."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, display: "flex", gap: 6 }}>
              <AlertTriangle size={13} /> El botón abre WhatsApp con el número real de la fila. Revisa que la
              columna de teléfono esté bien mapeada antes de enviar en volumen. El “✓ enviado” se guarda solo en
              este navegador.
            </div>
          </>
        )}
      </main>

      {/* Modal WA */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", width: "100%", maxWidth: 460, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <MessageCircle size={18} color="#25D366" />
              <strong style={{ fontSize: 15 }}>Enviar por WhatsApp</strong>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
              {modal.cliente || "Cliente"} · +{waNumber(modal.telefono, cc)} · {ESTADO_UI[modal.ek].label}
            </div>
            <textarea
              value={modalMsg}
              onChange={(e) => setModalMsg(e.target.value)}
              rows={6}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)", fontSize: 13, lineHeight: 1.5, resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button style={btnPrimary} onClick={sendWa}>
                <MessageCircle size={14} /> Abrir WhatsApp
              </button>
              <button
                style={{ ...btnPrimary, background: "var(--card)", color: "var(--fg)", border: "1px solid var(--border)" }}
                onClick={() => {
                  navigator.clipboard?.writeText(modalMsg);
                  setCopied(true);
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar"}
              </button>
              <button style={{ ...btnPrimary, background: "transparent", color: "var(--muted)", border: "none", marginLeft: "auto" }} onClick={() => setModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <HubFooter />
    </div>
  );
}
