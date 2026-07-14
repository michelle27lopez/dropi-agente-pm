import { Pool } from "pg";

const pool = new Pool({
  host: process.env.CRM_PG_HOST,
  port: Number(process.env.CRM_PG_PORT) || 5432,
  database: process.env.CRM_PG_DATABASE,
  user: process.env.CRM_PG_USER,
  password: process.env.CRM_PG_PASSWORD,
  ssl: false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const SCHEMA = process.env.CRM_PG_SCHEMA || "dropi_seguimiento_proveedores";

export type StageRow = { stage_name: string; status: string; n: number };

async function stagesByPipeline(table: string): Promise<StageRow[]> {
  const { rows } = await pool.query<StageRow>(
    `SELECT stage_name, status, COUNT(*)::int AS n
     FROM ${SCHEMA}.${table}
     GROUP BY stage_name, status
     ORDER BY n DESC`
  );
  return rows;
}

async function countByPipeline(table: string): Promise<number> {
  const { rows } = await pool.query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM ${SCHEMA}.${table}`
  );
  return rows[0]?.n ?? 0;
}

export type CRMSnapshot = {
  fetchedAt: string;
  pipelines: {
    verificacion: { total: number; stages: StageRow[] };
    ascensosVerificados: { total: number; stages: StageRow[] };
    ascensosPremium: { total: number; stages: StageRow[] };
    despacho: { total: number; stages: StageRow[] };
    transportadoras: { total: number; stages: StageRow[] };
  };
};

export type CitaStats = {
  total: number;
  avgDias: number;
  medianaDias: number;
  minDias: number;
  maxDias: number;
};

export type CitaBucket = { rango: string; n: number };

export type CitaRow = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  stage_name: string;
  date_created: string;
  ultima_cita_confirmada: string;
  dias: number;
};

export type CitasData = {
  stats: CitaStats;
  buckets: CitaBucket[];
  rows: CitaRow[];
};

export async function getCitasData(): Promise<CitasData> {
  const [statsRes, bucketsRes, rowsRes] = await Promise.all([
    pool.query<{
      total: string; avg_dias: string; mediana_dias: string;
      min_dias: string; max_dias: string;
    }>(`
      SELECT
        COUNT(*)::int AS total,
        ROUND(AVG(EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400)::numeric,1) AS avg_dias,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
          ORDER BY EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400
        )::numeric,1) AS mediana_dias,
        ROUND(MIN(EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400)::numeric,1) AS min_dias,
        ROUND(MAX(EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400)::numeric,1) AS max_dias
      FROM dropi_seguimiento_proveedores.pipeline_verificacion_de_proveedores
      WHERE ultima_cita_confirmada IS NOT NULL AND date_created IS NOT NULL
    `),
    pool.query<{ rango: string; n: string }>(`
      SELECT
        CASE
          WHEN delta < 0     THEN '< 0 días'
          WHEN delta = 0     THEN 'Mismo día'
          WHEN delta <= 7    THEN '1–7 días'
          WHEN delta <= 14   THEN '8–14 días'
          WHEN delta <= 30   THEN '15–30 días'
          WHEN delta <= 60   THEN '31–60 días'
          ELSE               '> 60 días'
        END AS rango,
        COUNT(*)::int AS n
      FROM (
        SELECT ROUND(EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400) AS delta
        FROM dropi_seguimiento_proveedores.pipeline_verificacion_de_proveedores
        WHERE ultima_cita_confirmada IS NOT NULL AND date_created IS NOT NULL
      ) t
      GROUP BY rango
      ORDER BY MIN(delta)
    `),
    pool.query<{
      full_name: string; email: string; phone: string; country: string; stage_name: string;
      date_created: string; ultima_cita_confirmada: string; dias: string;
    }>(`
      SELECT
        full_name,
        email,
        phone,
        country,
        stage_name,
        date_created::text,
        ultima_cita_confirmada::text,
        ROUND(EXTRACT(EPOCH FROM (ultima_cita_confirmada - date_created))/86400)::int AS dias
      FROM dropi_seguimiento_proveedores.pipeline_verificacion_de_proveedores
      WHERE ultima_cita_confirmada IS NOT NULL AND date_created IS NOT NULL
      ORDER BY date_created DESC
      LIMIT 200
    `),
  ]);

  const s = statsRes.rows[0];
  return {
    stats: {
      total: Number(s.total),
      avgDias: Number(s.avg_dias),
      medianaDias: Number(s.mediana_dias),
      minDias: Number(s.min_dias),
      maxDias: Number(s.max_dias),
    },
    buckets: bucketsRes.rows.map((r) => ({ rango: r.rango, n: Number(r.n) })),
    rows: rowsRes.rows.map((r) => ({ ...r, dias: Number(r.dias) })),
  };
}

export type AgingBucket = { rango: string; n: number; color: string };

export type AgingRow = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  pipeline: string;
  stage_name: string;
  date_created: string;
  dias: number;
  ultima_cita_confirmada: string | null;
};

export type AgingData = {
  totalAtascados: number;
  mas90dias: number;
  mas180dias: number;
  buckets: AgingBucket[];
  rows: AgingRow[];
};

export type ConversionStep = {
  label: string;
  total: number;
  aprobados: number;
  denegados: number;
  enEspera: number;
  tasaAprobacion: number;
  avgDiasAprobados: number;
};

export type ConversionData = {
  steps: ConversionStep[];
};

export async function getAgingData(): Promise<AgingData> {
  const query = `
    SELECT full_name, email, phone, country, stage_name, date_created::text,
      ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400)::int AS dias,
      'Activar Visibilidad' AS pipeline,
      ultima_cita_confirmada::text AS ultima_cita_confirmada
    FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
    WHERE stage_name = 'NUEVA SOLICITUD'
    UNION ALL
    SELECT full_name, email, phone, country, stage_name, date_created::text,
      ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400)::int AS dias,
      'Ascenso Verificado' AS pipeline,
      NULL AS ultima_cita_confirmada
    FROM ${SCHEMA}.pipeline_ascensos_proveedores_verificados
    WHERE stage_name = 'NUEVA SOLICITUD'
    UNION ALL
    SELECT full_name, email, phone, country, stage_name, date_created::text,
      ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400)::int AS dias,
      'Ascenso Premium' AS pipeline,
      NULL AS ultima_cita_confirmada
    FROM ${SCHEMA}.pipeline_ascensos_proveedores_premium
    WHERE stage_name = 'NUEVA SOLICITUD'
    ORDER BY dias DESC
    LIMIT 300
  `;

  const bucketsQuery = `
    SELECT
      CASE
        WHEN dias <= 30  THEN '0–30 días'
        WHEN dias <= 60  THEN '31–60 días'
        WHEN dias <= 90  THEN '61–90 días'
        WHEN dias <= 180 THEN '91–180 días'
        ELSE             '+180 días'
      END AS rango,
      COUNT(*)::int AS n
    FROM (
      SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400) AS dias
      FROM ${SCHEMA}.pipeline_verificacion_de_proveedores WHERE stage_name='NUEVA SOLICITUD'
      UNION ALL
      SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400)
      FROM ${SCHEMA}.pipeline_ascensos_proveedores_verificados WHERE stage_name='NUEVA SOLICITUD'
      UNION ALL
      SELECT ROUND(EXTRACT(EPOCH FROM (NOW() - date_created))/86400)
      FROM ${SCHEMA}.pipeline_ascensos_proveedores_premium WHERE stage_name='NUEVA SOLICITUD'
    ) t
    GROUP BY rango ORDER BY MIN(dias)
  `;

  const [rowsRes, bucketsRes] = await Promise.all([
    pool.query<{ full_name: string; email: string; phone: string; country: string; stage_name: string; date_created: string; dias: number; pipeline: string; ultima_cita_confirmada: string | null }>(query),
    pool.query<{ rango: string; n: string }>(bucketsQuery),
  ]);

  const BUCKET_COLORS: Record<string, string> = {
    "0–30 días": "#10B981",
    "31–60 días": "#F77F00",
    "61–90 días": "#F59E0B",
    "91–180 días": "#EF4444",
    "+180 días": "#7F1D1D",
  };

  const rows = rowsRes.rows.map((r) => ({ ...r, dias: Number(r.dias) }));
  const mas90 = rows.filter((r) => r.dias > 90).length;
  const mas180 = rows.filter((r) => r.dias > 180).length;

  return {
    totalAtascados: rows.length,
    mas90dias: mas90,
    mas180dias: mas180,
    buckets: bucketsRes.rows.map((r) => ({
      rango: r.rango,
      n: Number(r.n),
      color: BUCKET_COLORS[r.rango] ?? "#6B7280",
    })),
    rows,
  };
}

export async function getConversionData(): Promise<ConversionData> {
  const [verRes, ascVRes, ascPRes] = await Promise.all([
    pool.query<{ stage_name: string; n: string; avg_dias: string }>(`
      SELECT stage_name,
        COUNT(*)::int AS n,
        ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - date_created))/86400)::numeric,1) AS avg_dias
      FROM ${SCHEMA}.pipeline_verificacion_de_proveedores
      GROUP BY stage_name
    `),
    pool.query<{ stage_name: string; n: string; avg_dias: string }>(`
      SELECT stage_name,
        COUNT(*)::int AS n,
        ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - date_created))/86400)::numeric,1) AS avg_dias
      FROM ${SCHEMA}.pipeline_ascensos_proveedores_verificados
      GROUP BY stage_name
    `),
    pool.query<{ stage_name: string; n: string; avg_dias: string }>(`
      SELECT stage_name,
        COUNT(*)::int AS n,
        ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - date_created))/86400)::numeric,1) AS avg_dias
      FROM ${SCHEMA}.pipeline_ascensos_proveedores_premium
      GROUP BY stage_name
    `),
  ]);

  function toStep(label: string, rows: { stage_name: string; n: string; avg_dias: string }[]): ConversionStep {
    const find = (key: string) => rows.find((r) => r.stage_name.toUpperCase().includes(key));
    const total = rows.reduce((s, r) => s + Number(r.n), 0);
    const aprobRow = find("APROBADO");
    const denRow = find("DENEGADO") ?? find("RECHAZADO");
    const aprobados = Number(aprobRow?.n ?? 0);
    const denegados = Number(denRow?.n ?? 0);
    return {
      label,
      total,
      aprobados,
      denegados,
      enEspera: total - aprobados - denegados,
      tasaAprobacion: total > 0 ? Math.round((aprobados / total) * 1000) / 10 : 0,
      avgDiasAprobados: Number(aprobRow?.avg_dias ?? 0),
    };
  }

  return {
    steps: [
      toStep("Activar Visibilidad", verRes.rows),
      toStep("Ascenso a Verificado", ascVRes.rows),
      toStep("Ascenso a Premium", ascPRes.rows),
    ],
  };
}

export async function getCRMSnapshot(): Promise<CRMSnapshot> {
  const [
    verTotal, verStages,
    ascVTotal, ascVStages,
    ascPTotal, ascPStages,
    despTotal, despStages,
    transTotal, transStages,
  ] = await Promise.all([
    countByPipeline("pipeline_verificacion_de_proveedores"),
    stagesByPipeline("pipeline_verificacion_de_proveedores"),
    countByPipeline("pipeline_ascensos_proveedores_verificados"),
    stagesByPipeline("pipeline_ascensos_proveedores_verificados"),
    countByPipeline("pipeline_ascensos_proveedores_premium"),
    stagesByPipeline("pipeline_ascensos_proveedores_premium"),
    countByPipeline("pipeline_04_proveedores_pendientes_de_despacho"),
    stagesByPipeline("pipeline_04_proveedores_pendientes_de_despacho"),
    countByPipeline("pipeline_integracion_de_transportadoras"),
    stagesByPipeline("pipeline_integracion_de_transportadoras"),
  ]);

  return {
    fetchedAt: new Date().toISOString(),
    pipelines: {
      verificacion: { total: verTotal, stages: verStages },
      ascensosVerificados: { total: ascVTotal, stages: ascVStages },
      ascensosPremium: { total: ascPTotal, stages: ascPStages },
      despacho: { total: despTotal, stages: despStages },
      transportadoras: { total: transTotal, stages: transStages },
    },
  };
}
