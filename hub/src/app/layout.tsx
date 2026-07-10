import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dropi PM Tools",
  description: "Hub de herramientas de Brands Success",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
