import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poke Idle World — Guia Completo",
  description: "Guia completo de Poke Idle World: tier list, rotas, calculadoras, pokédex e todas as mecânicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
