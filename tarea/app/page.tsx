import type { Metadata } from "next";
import CinemaApp from "@/components/cinema/CinemaApp";
import { getSelection } from "@/lib/omdb";
import "./cinema.css";

export const metadata: Metadata = {
  title: "Plano. — Tu próxima buena historia",
  description: "Descubre películas que dejan huella y series que atrapan. Explora nuestra selección, busca tu próximo título y guarda tus favoritos.",
  openGraph: {
    title: "Plano. — Tu próxima buena historia",
    description: "Menos buscar. Más descubrir. Una galería de películas y series para amantes del cine.",
    locale: "es_PE",
    type: "website",
  },
};

export default async function Home() {
  // Los datos se obtienen antes de generar el HTML de la página (SSR).
  const { movies, error } = await getSelection();
  return <CinemaApp initialMovies={movies} initialError={error}/>;
}
