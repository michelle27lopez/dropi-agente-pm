import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metrics Lab — Dropi Supplier Success",
  description: "Dashboard de métricas CRM para Supplier Success",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
