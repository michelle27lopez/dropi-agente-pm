import { NextRequest, NextResponse } from "next/server";
import { esDiaDeRecordatorio, esFestivo, fechaISO } from "@/lib/festivos-co";
import { temaDeLaSemana, mensajeChat, semanaISO } from "@/lib/sprint-reminder";
import { DESTINATARIOS } from "@/lib/sprint-reminder-destinatarios";

// Recordatorio de arranque de sprint → espacio de Google Chat.
//
// Vercel Cron invoca por GET y adjunta `Authorization: Bearer $CRON_SECRET`.
// De ahí que el envío viva en el GET y no en un POST: sin ese header la misma
// ruta solo previsualiza, así que abrirla desde el navegador nunca dispara
// nada. El cron corre lunes y martes; `esDiaDeRecordatorio` decide si el día
// realmente toca (el martes solo pasa si el lunes fue festivo).

function hoyEnBogota(): Date {
  // El servidor corre en UTC; el calendario del equipo es de Bogotá.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const partes = Object.fromEntries(
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return new Date(Number(partes.year), Number(partes.month) - 1, Number(partes.day));
}

async function enviarAChat(texto: string): Promise<void> {
  const url = process.env.GCHAT_WEBHOOK_URL;
  if (!url) throw new Error("GCHAT_WEBHOOK_URL no configurado");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ text: texto }),
  });

  if (!res.ok) {
    throw new Error(`Google Chat respondió ${res.status}: ${await res.text()}`);
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const secret = process.env.CRON_SECRET;
  const autorizado = !!secret && request.headers.get("authorization") === `Bearer ${secret}`;

  // Permite previsualizar otra fecha: ?fecha=2026-08-18
  const param = params.get("fecha");
  const fecha = param ? new Date(`${param}T12:00:00`) : hoyEnBogota();
  const tema = temaDeLaSemana(fecha);
  const texto = mensajeChat(DESTINATARIOS, tema, fecha);
  const toca = esDiaDeRecordatorio(fecha);

  // Sin credencial de cron: solo se mira, nunca se manda.
  if (!autorizado) {
    return NextResponse.json({
      modo: "preview — no se envió nada",
      fecha: fechaISO(fecha),
      dia: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][fecha.getDay()],
      es_festivo: esFestivo(fecha),
      toca_enviar_hoy: toca,
      semana_iso: semanaISO(fecha),
      tema: tema.id,
      destinatarios_mencionados: DESTINATARIOS.length,
      mensaje: texto,
    });
  }

  if (!toca && params.get("force") !== "true") {
    return NextResponse.json({
      enviado: false,
      motivo: "hoy no es el primer día hábil de la semana",
      fecha: fechaISO(fecha),
      es_festivo: esFestivo(fecha),
    });
  }

  // `dry=true` deja probar la ruta autenticada sin escribir en el espacio.
  if (params.get("dry") === "true") {
    return NextResponse.json({ modo: "dry-run", fecha: fechaISO(fecha), tema: tema.id, mensaje: texto });
  }

  try {
    await enviarAChat(texto);
  } catch (error) {
    return NextResponse.json(
      { enviado: false, error: error instanceof Error ? error.message : "desconocido" },
      { status: 500 }
    );
  }

  return NextResponse.json({ enviado: true, fecha: fechaISO(fecha), tema: tema.id });
}
