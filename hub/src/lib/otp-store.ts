// Almacén en memoria compartido entre /api/nivel/otp/request y /api/nivel/otp/verify.
// Cada route.ts es su propio módulo — si cada uno declara su propio Map,
// quedan desincronizados (request guarda en uno, verify lee de otro vacío).
// En prod esto debería vivir en una tabla (otp_challenges, ya existe en
// 050_leyendas_dropi_gamificacion.sql), no en memoria del proceso.
export const otpStore = new Map<
  string,
  { code: string; expiresAt: number; attemptsLeft: number; consumedAt?: number }
>();
