"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";

type Mode = "password" | "magic";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Supplier Lab</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceso interno — mismo login de Darwin</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 grid grid-cols-2 gap-0.5 rounded-lg border border-border bg-background p-1">
            {(["password", "magic"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); setSent(false); }}
                className={`rounded-md py-2 text-xs font-semibold transition-colors ${
                  mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {m === "password" ? "🔑 Contraseña" : "✉️ Link mágico"}
              </button>
            ))}
          </div>

          {mode === "password" && (
            <form onSubmit={handlePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@dropi.co"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <Button type="submit" disabled={loading} className="mt-1 w-full">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          )}

          {mode === "magic" && !sent && (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Te enviamos un link de acceso al correo. Solo funciona si tu email está autorizado en Darwin.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@dropi.co"
                  className={inputClass}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <Button type="submit" disabled={loading} className="mt-1 w-full">
                {loading ? "Enviando..." : "Enviar link"}
              </Button>
            </form>
          )}

          {mode === "magic" && sent && (
            <div className="py-2 text-center">
              <div className="mb-4 text-4xl">📬</div>
              <p className="mb-2 text-base font-bold text-foreground">Link enviado</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Revisa tu correo <strong className="text-foreground">{email}</strong>.<br />
                El link expira en 1 hora.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-5 text-xs text-muted-foreground underline"
              >
                Reenviar a otro correo
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
      {msg}
    </p>
  );
}
