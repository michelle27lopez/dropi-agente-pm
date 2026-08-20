"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Esta ruta plana se reemplazó por /celula/[slug]/following (2026-08-17,
// Jaime) para que el switcher de célula y el sidebar cuenten la misma
// historia. Se deja como redirect a la célula propia para no romper los
// links viejos que apuntan acá.
export default function MetricasRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const slug = data?.profile?.celulas?.slug;
        router.replace(slug ? `/celula/${slug}/following` : "/");
      })
      .catch(() => router.replace("/"));
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 13, color: "var(--muted)" }}>Redirigiendo…</p>
    </main>
  );
}
