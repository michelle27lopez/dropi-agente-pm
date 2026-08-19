import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const googleOAuthConfigured = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// El redirect URI se construye a partir del origin de cada request (dev vs
// prod) — igual debe estar dado de alta tal cual en Google Cloud Console
// como "Authorized redirect URI" para cada entorno, ver
// [[project_darwin_pd_dashboard]].
function oauthClient(redirectUri: string) {
  if (!googleOAuthConfigured) {
    throw new Error("Google OAuth no configurado — faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env.local");
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
}

// `state` es obligatorio: Google lo devuelve tal cual en el callback y ahí se
// compara contra la cookie que dejó la ruta de login. Sin él, un tercero puede
// inducir a un usuario autorizado a canjear un `code` ajeno y terminar con el
// refresh_token de otra cuenta guardado a su nombre (CSRF de OAuth).
export function buildConsentUrl(redirectUri: string, state: string): string {
  const client = oauthClient(redirectUri);
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeForRefreshToken(code: string, redirectUri: string): Promise<string> {
  const client = oauthClient(redirectUri);
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error("Google no devolvió refresh_token — revoca el acceso en https://myaccount.google.com/permissions y vuelve a intentar (prompt=consent solo lo devuelve la primera vez)");
  }
  return tokens.refresh_token;
}

export type CalendarMeeting = {
  title: string;
  start_time: string;
  end_time: string;
  join_url: string | null;
  is_personal: boolean;
};

// colorId "4" = eventos personales (Almuerzo, Gym) — misma regla que ya usa
// la skill sprint-reuniones y el seed manual de today_meetings.
const PERSONAL_COLOR_ID = "4";

// redirectUri no se usa para llamar a la Calendar API (solo hace falta para
// intercambiar código por tokens), pero el cliente OAuth2 lo exige en el
// constructor — se pasa el mismo que se usó al generar el refresh_token.
export async function getTodayEvents(refreshToken: string, redirectUri: string): Promise<CalendarMeeting[]> {
  const client = oauthClient(redirectUri);
  client.setCredentials({ refresh_token: refreshToken });

  const todayBogota = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const timeMin = `${todayBogota}T00:00:00-05:00`;
  const timeMax = `${todayBogota}T23:59:59-05:00`;

  const calendar = google.calendar({ version: "v3", auth: client });
  const { data } = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  return (data.items ?? [])
    .filter((event) => event.start?.dateTime && event.end?.dateTime)
    .map((event) => ({
      title: event.summary ?? "(Sin título)",
      start_time: event.start!.dateTime!,
      end_time: event.end!.dateTime!,
      join_url: event.hangoutLink ?? event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null,
      is_personal: event.colorId === PERSONAL_COLOR_ID,
    }))
    .filter((m) => !m.is_personal);
}
