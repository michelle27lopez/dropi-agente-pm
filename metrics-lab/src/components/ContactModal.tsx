"use client";

type Contact = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  pipeline?: string;
  stage_name?: string;
};

type Props = {
  contact: Contact | null;
  onClose: () => void;
};

export function ContactModal({ contact, onClose }: Props) {
  if (!contact) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, padding: 28,
          width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.3 }}>
              {contact.full_name}
            </p>
            {contact.pipeline && (
              <p style={{ fontSize: 11, color: "#F77F00", fontWeight: 600, marginTop: 4 }}>
                {contact.pipeline}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
            { label: "Teléfono", value: contact.phone, href: `tel:${contact.phone}` },
            { label: "País", value: contact.country, href: null },
            ...(contact.stage_name ? [{ label: "Etapa", value: contact.stage_name, href: null }] : []),
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {f.label}
              </p>
              {f.href ? (
                <a
                  href={f.href}
                  style={{ fontSize: 13, color: "#2563EB", textDecoration: "none", fontWeight: 500 }}
                >
                  {f.value || "—"}
                </a>
              ) : (
                <p style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{f.value || "—"}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
