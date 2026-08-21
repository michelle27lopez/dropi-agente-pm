import type { NextRequest } from "next/server";

// Rate limit en memoria, por IP — best effort. En un runtime serverless
// (Vercel) esto solo limita dentro de una misma instancia caliente, no de
// forma global entre todas las instancias. Para un límite duro y confiable
// a nivel de plataforma, usar Vercel Firewall / Rate Limiting (dashboard,
// sin código) además de esto.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest): string {
  // x-real-ip lo fija la plataforma; el primer valor de x-forwarded-for lo
  // puede prefijar el cliente. Ver AGP-38.
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    return parts[parts.length - 1] ?? "unknown";
  }
  return "unknown";
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
