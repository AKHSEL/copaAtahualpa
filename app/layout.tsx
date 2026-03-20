import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Copa Atahualpa",
  description: "Resultados y tabla de posiciones de la Copa Atahualpa"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}

