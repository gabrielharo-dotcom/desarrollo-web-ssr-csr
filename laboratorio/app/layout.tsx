import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorio 09 | CSR y SSR",
  description: "Ejercicios de Pokémon con CSR y SSR y dashboard híbrido del clima.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
