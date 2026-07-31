import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropi Supplier Lab",
  description: "Entorno simulado para proveedores de Dropi",
  icons: {
    icon: "https://api.dropi.co/brands/1/rzo8FvI6oz1YkdxxwjmE3MUyPYQ2kp6z0ADFeamU.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
