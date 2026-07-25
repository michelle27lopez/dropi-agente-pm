import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darwin",
  description: "Hub de herramientas de Supplier Success",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
