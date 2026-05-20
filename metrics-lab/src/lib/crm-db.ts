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
