"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
      }}>
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
            Supplier Success · Acceso interno
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "32px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@dropi.co"
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--fg)",
                  background: "var(--bg)",
                  outline: "none",
                  width: "100%",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dropi)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--fg)",
                  background: "var(--bg)",
                  outline: "none",
                  width: "100%",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--dropi)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
            </div>

            {error && (
              <p style={{
                fontSize: 13,
                color: "#DC2626",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "10px 14px",
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
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
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
