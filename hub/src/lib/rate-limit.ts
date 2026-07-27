import type { NextRequest } from "next/server";

// Rate limit en memoria, por IP — best effort. En un runtime serverless
// (Vercel) esto solo limita dentro de una misma instancia caliente, no de
// forma global entre todas las instancias. Para un límite duro y confiable
// a nivel de plataforma, usar Vercel Firewall / Rate Limiting (dashboard,
// sin código) además de esto.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
