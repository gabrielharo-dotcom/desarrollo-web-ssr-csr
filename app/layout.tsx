import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeApp | Laboratorio 09",
  description: "Ejercicio 1.1: comparación de Client-Side Rendering y Server-Side Rendering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
