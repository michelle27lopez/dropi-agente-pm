import { NextRequest, NextResponse } from "next/server";
import { procesarLoteCuidadoCampanas } from "@/lib/webhooks/cuidadoCampanas";

// Runtime nodejs (no edge): el destino final es Postgres/Supabase por el
// cliente `pg`/REST que abre socket TCP normal — el punto 9.1 del contrato
// pide decidir esto explícitamente.
export const runtime = "nodejs";
// El techo real de lote no es el tamaño del body (4,5 MB duros en Vercel),
// es cuánto tarda la función en escribir. 60s da margen a un arranque en
// frío + upsert de 500 filas en una sola sentencia (punto 7 y 9.1).
export const maxDuration = 60;

const CUIDADO_CAMPANAS_TOKEN = process.env.CUIDADO_CAMPANAS_TOKEN || "";

export async function POST(req: NextRequest) {
  // 1. Auth ANTES de leer el cuerpo (punto 9.1 del contrato).
  const authHeader = req.headers.get("authorization") || "";
  if (!CUIDADO_CAMPANAS_TOKEN || authHeader !== `Bearer ${CUIDADO_CAMPANAS_TOKEN}`) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body no es JSON válido" }, { status: 400 });
  }

  const { status, acuse } = await procesarLoteCuidadoCampanas(body, "externo");
  return NextResponse.json(acuse, { status });
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/cuidado-de-campanas",
    description: "Receptor de ventas dropshipper × producto (CO, ventana 8 días) para cuidado de campañas.",
    auth: "Authorization: Bearer <CUIDADO_CAMPANAS_TOKEN>",
    contrato: "hub/doc hub/webhook_especificacion.md",
  });
}
