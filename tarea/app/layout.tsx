import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plano. | Galería de películas y series",
  description: "Descubre películas y series con Plano. Tu próxima buena historia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
