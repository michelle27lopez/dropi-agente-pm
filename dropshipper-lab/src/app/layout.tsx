import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropi Dropshipper Lab",
  description: "Entorno simulado para dropshippers de Dropi",
  icons: {
    icon: "https://api.dropi.co/brands/1/rzo8FvI6oz1YkdxxwjmE3MUyPYQ2kp6z0ADFeamU.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased font-sans`}>
      <body className="h-full">
        <div className="flex h-screen overflow-hidden bg-zinc-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
