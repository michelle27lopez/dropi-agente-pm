import { NextResponse } from "next/server";
import { getCRMSnapshot } from "@/lib/crm-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCRMSnapshot();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[CRM API]", err);
    return NextResponse.json({ error: "Error al conectar con CRM" }, { status: 500 });
  }
}
