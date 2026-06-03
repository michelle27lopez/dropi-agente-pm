import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client not initialized" },
        { status: 500 }
      );
    }

    // 1. Obtener cantidad de proveedores
    const { count, error: countError } = await supabase
      .from("userpilot_suppliers")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // 2. Obtener fecha del último registro creado
    const { data: lastRow, error: lastRowError } = await supabase
      .from("userpilot_suppliers")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (lastRowError) throw lastRowError;

    const lastSync = lastRow && lastRow.length > 0 ? lastRow[0].created_at : null;
    const hasApiKey = !!process.env.USERPILOT_API_KEY;

    return NextResponse.json({
      count: count || 0,
      lastSync,
      hasApiKey,
    });
  } catch (error: any) {
    console.error("[SYNC_GET_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve sync status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, csvData, startDate } = body;

    // Resolver rutas
    const projectRoot = "/Users/jaime.guevara/Documents/proyectos/Agente delivery manager/hub";
    const scriptPath = path.join(projectRoot, "supabase", "sync_userpilot.py");
    const scratchDir = path.join(projectRoot, "scratch");

    if (mode === "csv") {
      if (!csvData) {
        return NextResponse.json(
          { error: "No CSV data provided for upload" },
          { status: 400 }
        );
      }

      // Crear directorio scratch si no existe
      await fs.mkdir(scratchDir, { recursive: true });

      // Guardar CSV temporal
      const tempFileName = `temp_upload_${Date.now()}.csv`;
      const tempFilePath = path.join(scratchDir, tempFileName);
      await fs.writeFile(tempFilePath, csvData, "utf-8");

      try {
        console.log(`[SYNC_CSV] Running sync script for uploaded file: ${tempFilePath}`);
        const cmd = `python3 "${scriptPath}" --csv-file "${tempFilePath}"`;
        const { stdout, stderr } = await execPromise(cmd, { cwd: projectRoot });

        // Eliminar archivo temporal
        await fs.unlink(tempFilePath);

        console.log("[SYNC_CSV_SUCCESS]", stdout);
        return NextResponse.json({
          success: true,
          message: "CSV synchronized successfully",
          output: stdout,
          errorOutput: stderr,
        });
      } catch (scriptErr: any) {
        // Asegurar limpieza de archivo temporal en error
        try {
          await fs.unlink(tempFilePath);
        } catch {}
        console.error("[SYNC_CSV_SCRIPT_ERROR]", scriptErr);
        return NextResponse.json(
          {
            error: "Error executing synchronization script",
            details: scriptErr.message,
            output: scriptErr.stdout,
            errorOutput: scriptErr.stderr,
          },
          { status: 500 }
        );
      }
    } else {
      // Modo API
      console.log("[SYNC_API] Triggering Userpilot API Bulk Export...");
      let cmd = `python3 "${scriptPath}"`;
      if (startDate) {
        // Validar formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
          cmd += ` --start-date "${startDate}"`;
        }
      }

      try {
        const { stdout, stderr } = await execPromise(cmd, { cwd: projectRoot });
        console.log("[SYNC_API_SUCCESS]", stdout);
        return NextResponse.json({
          success: true,
          message: "API synchronization completed successfully",
          output: stdout,
          errorOutput: stderr,
        });
      } catch (scriptErr: any) {
        console.error("[SYNC_API_SCRIPT_ERROR]", scriptErr);
        return NextResponse.json(
          {
            error: "Error executing API synchronization script",
            details: scriptErr.message,
            output: scriptErr.stdout,
            errorOutput: scriptErr.stderr,
          },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error("[SYNC_POST_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to process synchronization request" },
      { status: 500 }
    );
  }
}
