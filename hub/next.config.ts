import type { NextConfig } from "next";
import { resolve } from "path";

// CSP en modo Report-Only: por ahora solo registra violaciones en la consola
// del navegador, no bloquea nada. Revisar esos reportes con tráfico real
// antes de pasarla a Content-Security-Policy (enforced) — así no se rompe
// nada por un origen que falte en la lista.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.openai.com",
  // 'self', no 'none': /metricas e /informes/1-1-junio-2026 embeben páginas
  // propias del hub en iframes — bloquear todo framing rompería esas dos.
  "frame-ancestors 'self'",
].join("; ");

const workspaceRoot = resolve(import.meta.dirname, "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // SAMEORIGIN, no DENY: /metricas e /informes/1-1-junio-2026 embeben
          // páginas propias del hub en iframes (ver comentario de CSP abajo).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
        ],
      },
    ];
  },
};
export default nextConfig;
