"use client";

import { useMemo, useState } from "react";
import HubFooter from "@/components/HubFooter";
import Breadcrumb from "@/components/Breadcrumb";

// Dos categorías (2026-09-07, a pedido de Laura): "Herramientas" es cómo se
// usa Darwin/el repo/el proceso — mecánica, onboarding, referencia técnica.
// "Ecosistema" es entendimiento del negocio/usuario/servicio de Dropi — lo
// que alimenta discovery, no cómo se opera una herramienta. Cada guía nueva
// debe elegir una de las dos; si de verdad es ambigua, pregúntale a Laura
// antes de forzarla a una categoría.
type Categoria = "herramientas" | "ecosistema";

const CATEGORIAS: { value: Categoria; label: string; icon: string }[] = [
  { value: "herramientas", label: "Herramientas", icon: "🛠️" },
  { value: "ecosistema", label: "Ecosistema", icon: "🌎" },
];

const guias: { slug: string; icon: string; title: string; description: string; tag: string; categoria: Categoria }[] = [
  {
    slug: "entendimiento-360-ecosistema",
    icon: "🧭",
    title: "Service design: Entendimiento 360 del ecosistema",
    description: "Fundamentos del negocio (Diana Aldana) + qué sabemos hoy de arquetipos/user personas y journeys de experiencia y servicio, célula por célula.",
    tag: "Service design · Proyecto PRO-001",
    categoria: "ecosistema",
  },
  {
    slug: "conceptos-basicos",
    icon: "🧭",
    title: "Conceptos básicos",
    description: "Qué es una rama de git y cómo se usan bien, cómo están organizadas las carpetas del repo, cómo arrancar en un proyecto y qué es Antigravity.",
    tag: "Onboarding · Fundamentos",
    categoria: "herramientas",
  },
  {
    slug: "como-unirte-a-darwin",
    icon: "🧬",
    title: "Cómo unirte a Darwin",
    description: "Clonar el repo, configurar tu .env.local, correr el hub en local, entrar a tu home de célula y abrir tu primer PR.",
    tag: "Onboarding · Nueva célula",
    categoria: "herramientas",
  },
  {
    slug: "taller-pocs",
    icon: "🛠️",
    title: "Taller de POCs",
    description: "Cómo crear un POC sin romper nada: dónde va, qué es un PR y un merge, cuándo necesitas una migración SQL, qué puedes tocar y qué no. Guion del taller de 2 horas.",
    tag: "Onboarding · POCs",
    categoria: "herramientas",
  },
  {
    slug: "directorio-pocs",
    icon: "🧪",
    title: "Directorio de POCs",
    description: "Todos los POCs del equipo, de todas las células, en una sola vista — para saber qué se está probando antes de arrancar algo que quizá ya existe.",
    tag: "Referencia · POCs",
    categoria: "herramientas",
  },
  {
    slug: "skills-disponibles",
    icon: "🧩",
    title: "Directorio de Skills",
    description: "Qué skills hay disponibles, agrupadas por categoría, y cuándo usar cada una en el trabajo de un PD.",
    tag: "Referencia · Skills",
    categoria: "herramientas",
  },
  {
    slug: "nomenclatura-fases",
    icon: "🧭",
    title: "Nomenclatura de fases de proyecto",
    description: "Cómo se nombran proyectos, fases (Epic) y subfases (tarea) en Jira. Borrador para revisar con Laura Contreras.",
    tag: "Referencia · Nomenclatura",
    categoria: "herramientas",
  },
  {
    slug: "product-lab",
    icon: "🧪",
    title: "Product Lab",
    description: "Índice de sesiones de Product Lab 2.0 — fecha, facilitador y punteros al detalle completo en el Dropi Brain (Confluence).",
    tag: "Referencia · Product Lab",
    categoria: "ecosistema",
  },
  {
    slug: "userpilot-mcp",
    icon: "🔌",
    title: "Documentar tu vertical con UserPilot + Claude Code",
    description: "Cómo conectar UserPilot vía MCP con la cuenta compartida del equipo y el prompt para replicar la doc de /guias/proveedores en tu propio vertical.",
    tag: "Onboarding · Nuevo vertical",
    categoria: "herramientas",
  },
  {
    slug: "proveedores",
    icon: "🧭",
    title: "El proveedor de Dropi",
    description: "Quién es el proveedor, qué tan satisfecho está, qué puede hacer hoy, cómo entra a la plataforma y con qué herramientas convive. Cada cifra con su fuente y su fecha de corte.",
    tag: "Vertical · Supplier Success",
    categoria: "ecosistema",
  },
  {
    slug: "medicion-ces-csat-nps",
    icon: "🎯",
    title: "Métricas de CX en Dropshipping",
    description: "Simulador interactivo del recorrido de un dropshipper: dónde se captura CES, CSAT y NPS, con captura en vivo de respuestas y el dashboard agregado.",
    tag: "Referencia · Métricas",
    categoria: "ecosistema",
  },
];

function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function GuiasIndexPage() {
  const [categoria, setCategoria] = useState<Categoria>("herramientas");
  const [query, setQuery] = useState("");

  const porCategoria = guias.filter((g) => g.categoria === categoria);
  const visibles = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return porCategoria;
    return porCategoria.filter((g) =>
      normalizar(g.title).includes(q) || normalizar(g.description).includes(q) || normalizar(g.tag).includes(q),
    );
  }, [porCategoria, query]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <Breadcrumb items={[{ label: "Guías" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              📚 Guías
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Cómo se hacen las cosas en Darwin, paso a paso.
            </p>
          </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {CATEGORIAS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => { setCategoria(c.value); setQuery(""); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                  padding: "8px 16px", borderRadius: 999,
                  border: `1px solid ${categoria === c.value ? "var(--dropi)" : "var(--border)"}`,
                  background: categoria === c.value ? "var(--dropi-light)" : "var(--card)",
                  color: categoria === c.value ? "var(--dropi)" : "var(--muted)",
                }}
              >
                <span>{c.icon}</span>
                {c.label}
                <span style={{ color: "var(--muted)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                  {guias.filter((g) => g.categoria === c.value).length}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Buscar en ${categoria === "herramientas" ? "Herramientas" : "Ecosistema"}…`}
            style={{
              width: "100%", maxWidth: 420, marginBottom: 24,
              fontSize: 13, padding: "10px 14px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)",
            }}
          />

          {visibles.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)", padding: "24px 0" }}>
              Sin resultados{query ? ` para "${query}"` : ""} en {categoria === "herramientas" ? "Herramientas" : "Ecosistema"}.
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {visibles.map((g) => (
              <a
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="hub-card"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: 20, textDecoration: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flex: "none",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {g.icon}
                </div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "var(--dropi)",
                    background: "var(--dropi-light)", padding: "3px 8px", borderRadius: 999,
                  }}>
                    {g.tag}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginTop: 8, marginBottom: 4 }}>
                    {g.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    {g.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
