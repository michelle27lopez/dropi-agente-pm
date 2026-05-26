import { Pool } from "pg";

const pool = new Pool({
  host: process.env.CRM_PG_HOST,
  port: Number(process.env.CRM_PG_PORT) || 5432,
  database: process.env.CRM_PG_DATABASE,
  user: process.env.CRM_PG_USER,
  password: process.env.CRM_PG_PASSWORD,
  ssl: false,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const SCHEMA = process.env.CRM_PG_SCHEMA || "dropi_seguimiento_proveedores";

export type CRMLevel4Day = {
  date: string;
  new_registrations: number;
  ascension_applications: number;
  ascenso_verificado: number;
  ascenso_premium: number;
  aprobacion_visibilidad: number;
  audit_tat: number;
};

export async function getCRMLevel4Metrics(
  country: string,
  startDateStr: string
): Promise<Record<string, Partial<CRMLevel4Day>>> {
  if (!process.env.CRM_PG_HOST) {
    throw new Error("CRM PostgreSQL host is not configured");
  }

  const countryParam = country.toUpperCase();

  const [regsRes, verRes, premRes, visRes, tatRes] = await Promise.all([
    // Query de Nuevos Registros
    pool.query<{ date: string; count: number }>(
      `SELECT date_created::date::text as date, COUNT(*)::int as count
       FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
       WHERE date_created >= $1
         AND ($2 = 'ALL' OR UPPER(country) = $2)
       GROUP BY date_created::date
       ORDER BY date ASC`,
      [startDateStr, countryParam]
    ),
    // Query de Postulaciones a Ascenso Verificados
    pool.query<{ date: string; count: number }>(
      `SELECT date_created::date::text as date, COUNT(*)::int as count
       FROM ${SCHEMA}.pipeline_ascensos_proveedores_verificados
       WHERE date_created >= $1
         AND ($2 = 'ALL' OR UPPER(country) = $2)
       GROUP BY date_created::date
       ORDER BY date ASC`,
      [startDateStr, countryParam]
    ),
    // Query de Postulaciones a Premium
    pool.query<{ date: string; count: number }>(
      `SELECT date_created::date::text as date, COUNT(*)::int as count
       FROM ${SCHEMA}.pipeline_ascensos_proveedores_premium
       WHERE date_created >= $1
         AND ($2 = 'ALL' OR UPPER(country) = $2)
       GROUP BY date_created::date
       ORDER BY date ASC`,
      [startDateStr, countryParam]
    ),
    // Query de Aprobación Visibilidad (Verificación de Proveedores)
    pool.query<{ date: string; count: number }>(
      `SELECT date_created::date::text as date, COUNT(*)::int as count
       FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
       WHERE date_created >= $1
         AND ($2 = 'ALL' OR UPPER(country) = $2)
       GROUP BY date_created::date
       ORDER BY date ASC`,
      [startDateStr, countryParam]
    ),
    // Query de TAT de Auditoría (en horas)
    pool.query<{ date: string; tat: number }>(
      `SELECT date_created::date::text as date,
              ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - date_created))/3600)::numeric, 1)::float as tat
       FROM (
         SELECT date_created, updated_at, country, stage_name FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
         UNION ALL
         SELECT date_created, updated_at, country, stage_name FROM ${SCHEMA}.pipeline_ascensos_proveedores_verificados
         UNION ALL
         SELECT date_created, updated_at, country, stage_name FROM ${SCHEMA}.pipeline_ascensos_proveedores_premium
       ) t
       WHERE date_created >= $1
         AND ($2 = 'ALL' OR UPPER(country) = $2)
         AND (stage_name ILIKE '%APROBADO%' OR stage_name ILIKE '%RECHAZADO%' OR stage_name ILIKE '%DENEGADO%')
       GROUP BY date_created::date
       ORDER BY date ASC`,
      [startDateStr, countryParam]
    ),
  ]);

  const merged: Record<string, Partial<CRMLevel4Day>> = {};

  regsRes.rows.forEach((r) => {
    if (!merged[r.date]) merged[r.date] = { date: r.date };
    merged[r.date].new_registrations = r.count;
  });

  verRes.rows.forEach((r) => {
    if (!merged[r.date]) merged[r.date] = { date: r.date };
    merged[r.date].ascenso_verificado = r.count;
    merged[r.date].ascension_applications = (merged[r.date].ascension_applications || 0) + r.count;
  });

  premRes.rows.forEach((r) => {
    if (!merged[r.date]) merged[r.date] = { date: r.date };
    merged[r.date].ascenso_premium = r.count;
    merged[r.date].ascension_applications = (merged[r.date].ascension_applications || 0) + r.count;
  });

  visRes.rows.forEach((r) => {
    if (!merged[r.date]) merged[r.date] = { date: r.date };
    merged[r.date].aprobacion_visibilidad = r.count;
  });

  tatRes.rows.forEach((r) => {
    if (!merged[r.date]) merged[r.date] = { date: r.date };
    merged[r.date].audit_tat = r.tat;
  });

  return merged;
}

export type CRMAppointment = {
  ultima_cita_confirmada: string | null;
  stage_name: string;
};

export async function getCRMAppointments(): Promise<Record<string, CRMAppointment>> {
  if (!process.env.CRM_PG_HOST) {
    console.warn("[CRM] CRM PostgreSQL host is not configured, returning empty appointments map");
    return {};
  }
  try {
    const { rows } = await pool.query<{ email: string | null; phone: string | null; ultima_cita_confirmada: Date | null; stage_name: string }>(
      `SELECT email, phone, ultima_cita_confirmada, stage_name
       FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
       WHERE ultima_cita_confirmada IS NOT NULL`
    );
    const map: Record<string, CRMAppointment> = {};
    rows.forEach(r => {
      const info: CRMAppointment = {
        ultima_cita_confirmada: r.ultima_cita_confirmada ? r.ultima_cita_confirmada.toISOString() : null,
        stage_name: r.stage_name
      };
      if (r.email) {
        const cleanEmail = r.email.trim().toLowerCase();
        if (cleanEmail) map[cleanEmail] = info;
      }
      if (r.phone) {
        const cleanPhone = r.phone.trim();
        if (cleanPhone) map[cleanPhone] = info;
      }
    });
    return map;
  } catch (err: any) {
    console.error("[CRM] Error querying appointments:", err.message);
    return {};
  }
}

