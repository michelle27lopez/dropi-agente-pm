type PostgrestErrorLike = { code?: string; message?: string } | null | undefined;

/**
 * Supabase/PostgREST reports one missing column at a time as PGRST204.
 * Used to tolerate schema drift when a migration hasn't been applied yet —
 * strip the offending field and retry instead of failing the whole write.
 */
export function extractMissingColumn(error: PostgrestErrorLike): string | null {
  if (!error || error.code !== "PGRST204") return null;
  const match = error.message?.match(/Could not find the '([^']+)' column/);
  return match ? match[1] : null;
}
