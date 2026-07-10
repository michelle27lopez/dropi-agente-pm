"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  const inputStyle = {
    padding: "10px 14px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--fg)",
    background: "var(--bg)",
    outline: "none",
    width: "100%",
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--bg)",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "var(--dropi)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 16px",
          }}>
            🧩
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)" }}>
            Dropi PM Tools
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Brands Success · Acceso interno
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "32px",
        }}>

          {/* Mode toggle */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 3,
            marginBottom: 24,
            gap: 3,
          }}>
            {(["password", "magic"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSent(false); }}
                style={{
                  padding: "8px 0",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: mode === m ? "var(--card)" : "transparent",
                  color: mode === m ? "var(--fg)" : "var(--muted)",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {m === "password" ? "🔑 Contraseña" : "✉️ Link mágico"}
              </button>
            ))}
          </div>

          {/* Password form */}
          {mode === "password" && (
            <form onSubmit={handlePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@dropi.co"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dropi)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dropi)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          {/* Magic link form */}
          {mode === "magic" && !sent && (
            <form onSubmit={handleMagicLink} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Te enviamos un link de acceso al correo. Solo funciona si tu email está autorizado.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@dropi.co"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dropi)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          )}

          {/* Magic link sent */}
          {mode === "magic" && sent && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
                Link enviado
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                Revisa tu correo <strong style={{ color: "var(--fg)" }}>{email}</strong>.<br />
                El link expira en 1 hora.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: 20, fontSize: 12, color: "var(--muted)",
                  background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
                }}
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
    <p style={{
      fontSize: 13, color: "#DC2626",
      background: "#FEF2F2", border: "1px solid #FECACA",
      borderRadius: 8, padding: "10px 14px", margin: 0,
    }}>
      {msg}
    </p>
  );
}

function btnStyle(loading: boolean): React.CSSProperties {
  return {
    marginTop: 4,
    padding: "11px 0",
    background: loading ? "var(--border)" : "var(--dropi)",
    color: loading ? "var(--muted)" : "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity 0.15s",
  };
}
