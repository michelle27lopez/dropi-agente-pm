// Recordatorio semanal de arranque de sprint.
//
// El mensaje cambia cada semana para que no se lea como un bot: el "tema"
// rota por número de semana ISO (recorre los 14 antes de repetir, así nunca
// caen dos iguales seguidos) y el saludo se escoge al azar dentro del tema.
// El cuerpo del recordatorio —lo que de verdad hay que hacer— es siempre
// igual y siempre claro; lo que varía es el envoltorio.

export type Tema = {
  id: string;
  emoji: string;
  asunto: string;
  titulo: string;
  gancho: string;
  cierre: string;
};

export const TEMAS: Tema[] = [
  {
    id: "cafe",
    emoji: "☕",
    asunto: "Arranca el sprint — el café ya está servido",
    titulo: "El café ya está servido",
    gancho: "Lunes, tinto en mano y sprint nuevo. La mejor combinación que existe.",
    cierre: "Que rinda la semana.",
  },
  {
    id: "f1",
    emoji: "🏁",
    asunto: "Arranca el sprint — semáforo en verde",
    titulo: "Semáforo en verde",
    gancho: "Se apagaron las luces y arrancamos. Ojalá esta vuelta sin pits innecesarios.",
    cierre: "A darle con todo.",
  },
  {
    id: "cohete",
    emoji: "🚀",
    asunto: "Arranca el sprint — cuenta regresiva",
    titulo: "3… 2… 1…",
    gancho: "Torre de control confirma: tenemos sprint. Solo falta cargar el combustible.",
    cierre: "Buen despegue.",
  },
  {
    id: "cocina",
    emoji: "👨‍🍳",
    asunto: "Arranca el sprint — mise en place",
    titulo: "Mise en place",
    gancho: "Todo buen cocinero organiza los ingredientes antes de prender la estufa. Nosotros igual.",
    cierre: "Buen provecho.",
  },
  {
    id: "videojuego",
    emoji: "🎮",
    asunto: "Arranca el sprint — nueva partida",
    titulo: "Nueva partida",
    gancho: "Empieza el nivel. Y como en todo buen juego, primero se reparten los puntos de habilidad.",
    cierre: "Sin perder vidas, ojalá.",
  },
  {
    id: "futbol",
    emoji: "⚽",
    asunto: "Arranca el sprint — pitazo inicial",
    titulo: "Pitazo inicial",
    gancho: "Sonó el pito. Noventa minutos por delante y la alineación se define ahora, no al minuto 80.",
    cierre: "A jugar bonito.",
  },
  {
    id: "concierto",
    emoji: "🎸",
    asunto: "Arranca el sprint — prueba de sonido",
    titulo: "Probando, uno, dos…",
    gancho: "Antes de que se abra el telón toca afinar. Nadie quiere improvisar frente al público.",
    cierre: "Que suene bien.",
  },
  {
    id: "montana",
    emoji: "🏔️",
    asunto: "Arranca el sprint — campamento base",
    titulo: "Desde el campamento base",
    gancho: "La cumbre se ve lejos los lunes. Por eso se sube por etapas y con el morral bien armado.",
    cierre: "Paso firme.",
  },
  {
    id: "cine",
    emoji: "🎬",
    asunto: "Arranca el sprint — ¡acción!",
    titulo: "Luces, cámara…",
    gancho: "Arranca el rodaje de la semana. El guion lo escribimos hoy, no el viernes.",
    cierre: "Que sea un buen corte.",
  },
  {
    id: "navegacion",
    emoji: "⛵",
    asunto: "Arranca el sprint — zarpamos",
    titulo: "Zarpamos",
    gancho: "Se soltaron amarras. Con el rumbo puesto desde el principio, el viento siempre ayuda más.",
    cierre: "Buen viento.",
  },
  {
    id: "panaderia",
    emoji: "🥐",
    asunto: "Arranca el sprint — recién horneado",
    titulo: "Sprint recién horneado",
    gancho: "Salió calientico del horno. Como todo pan bueno, necesita su tiempo de reposo bien medido.",
    cierre: "Que quede esponjoso.",
  },
  {
    id: "tren",
    emoji: "🚂",
    asunto: "Arranca el sprint — sale el tren",
    titulo: "Sale el tren",
    gancho: "Andén uno, salida puntual. El que no marcó su tiquete se queda mirando el vagón irse.",
    cierre: "Buen viaje.",
  },
  {
    id: "detective",
    emoji: "🔍",
    asunto: "Arranca el sprint — caso abierto",
    titulo: "Caso abierto",
    gancho: "Nuevo expediente sobre el escritorio. Todo buen detective empieza organizando las pistas.",
    cierre: "A resolverlo.",
  },
  {
    id: "jardin",
    emoji: "🌱",
    asunto: "Arranca el sprint — temporada de siembra",
    titulo: "Temporada de siembra",
    gancho: "Lo que se siembra el lunes se cosecha el viernes. Y lo que no se siembra… pues nada.",
    cierre: "Buena cosecha.",
  },
];

const SALUDOS = [
  "Hola",
  "Buenos días",
  "Qué más",
  "Hey",
  "Buen lunes",
];

/** Número de semana ISO — sirve de índice estable para rotar el tema. */
export function semanaISO(fecha: Date): number {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7);
}

export function temaDeLaSemana(fecha: Date): Tema {
  return TEMAS[semanaISO(fecha) % TEMAS.length];
}

export type Destinatario = {
  email: string;
  nombre: string;
  celula: string | null;
  rol: "PM" | "PD" | "PO";
};

/** Primer nombre, para que el saludo no suene a carta de banco. */
function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0];
}

export function asunto(tema: Tema): string {
  return `${tema.emoji} ${tema.asunto}`;
}

/**
 * Mensaje para el espacio de Google Chat.
 *
 * Uno solo para todo el equipo, no un DM por persona: el recordatorio de
 * arranque de sprint funciona mejor en público — todos ven que a todos les
 * llegó. Se listan las duplas por nombre para que nadie lo lea como genérico.
 *
 * Formato de Chat: *negrita*, _cursiva_, viñetas con "•".
 */
export function mensajeChat(
  destinatarios: Destinatario[],
  tema: Tema,
  fecha: Date
): string {
  const esMartes = fecha.getDay() === 2;
  const nota = esMartes ? "\n_(El lunes fue festivo, así que el sprint arranca hoy.)_\n" : "";

  // Agrupa por célula conservando el orden en que vienen declaradas.
  const porCelula = new Map<string, Destinatario[]>();
  for (const d of destinatarios) {
    const key = d.celula ?? "Sin célula";
    if (!porCelula.has(key)) porCelula.set(key, []);
    porCelula.get(key)!.push(d);
  }

  const duplas = [...porCelula.entries()]
    .map(([celula, gente]) => `• *${celula}* — ${gente.map((g) => primerNombre(g.nombre)).join(" y ")}`)
    .join("\n");

  return `${tema.emoji} *${tema.titulo}*

_${tema.gancho}_
${nota}
*Hoy arranca sprint.* El recordatorio de siempre:

• Carga tus *horas estimadas* de la semana
• Aplica igual para *Product Designers* y para *PM/PO* — es de los dos, no de uno solo
• Cuadra con tu dupla para que ninguno quede por fuera

Son *52 horas semanales*. Dejarlas planeadas hoy es lo que permite que el viernes no aparezcan sorpresas.

*Van por dupla:*
${duplas}

${tema.cierre}`;
}

export function cuerpoTexto(dest: Destinatario, tema: Tema, fecha: Date): string {
  const saludo = SALUDOS[Math.floor(Math.random() * SALUDOS.length)];
  const esMartes = fecha.getDay() === 2;
  const nota = esMartes
    ? "\n(El lunes fue festivo, así que el sprint arranca hoy.)\n"
    : "";

  return `${saludo}, ${primerNombre(dest.nombre)} 👋

${tema.titulo}

${tema.gancho}
${nota}
Hoy arranca sprint. El recordatorio de siempre:

  • Carga tus horas estimadas de la semana
  • Aplica igual para Product Designers y para PM/PO — es de los dos, no de uno solo
  • Cuadra con tu dupla para que ninguno quede por fuera

Son 52 horas semanales. Dejarlas planeadas hoy es lo que permite que el
viernes no aparezcan sorpresas.

${tema.cierre}
—
Este recordatorio se manda solo cada arranque de sprint.`;
}

export function cuerpoHtml(dest: Destinatario, tema: Tema, fecha: Date): string {
  const saludo = SALUDOS[Math.floor(Math.random() * SALUDOS.length)];
  const esMartes = fecha.getDay() === 2;
  const nota = esMartes
    ? `<p style="margin:0 0 16px;padding:10px 14px;background:#FEF3C7;border-radius:8px;font-size:13px;color:#92400E;">
         El lunes fue festivo, así que el sprint arranca hoy.
       </p>`
    : "";

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;">
  <div style="background:#111827;padding:26px 24px;text-align:center;">
    <div style="font-size:34px;line-height:1;margin-bottom:8px;">${tema.emoji}</div>
    <div style="color:#F77F00;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">
      Arranca el sprint
    </div>
  </div>

  <div style="padding:28px 24px;">
    <p style="font-size:16px;color:#111827;margin:0 0 4px;">${saludo}, <strong>${primerNombre(dest.nombre)}</strong> 👋</p>
    <h2 style="font-size:20px;color:#111827;margin:16px 0 8px;">${tema.titulo}</h2>
    <p style="font-size:14px;color:#4B5563;line-height:1.6;margin:0 0 18px;">${tema.gancho}</p>

    ${nota}

    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:18px 20px;margin:0 0 18px;">
      <p style="font-size:13px;font-weight:700;color:#111827;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">
        El recordatorio de siempre
      </p>
      <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:1.8;">
        <li>Carga tus <strong>horas estimadas</strong> de la semana</li>
        <li>Aplica <strong>igual para Product Designers y para PM/PO</strong> — es de los dos, no de uno solo</li>
        <li>Cuadra con tu dupla para que ninguno quede por fuera</li>
      </ul>
    </div>

    <p style="font-size:13px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      Son <strong>52 horas semanales</strong>. Dejarlas planeadas hoy es lo que permite
      que el viernes no aparezcan sorpresas.
    </p>

    <p style="font-size:15px;color:#111827;font-weight:600;margin:0;">${tema.cierre}</p>
  </div>

  <div style="border-top:1px solid #E5E7EB;padding:14px 24px;text-align:center;">
    <p style="font-size:11px;color:#9CA3AF;margin:0;">
      Este recordatorio se manda solo cada arranque de sprint · Producto Dropi
    </p>
  </div>
</div>`.trim();
}
