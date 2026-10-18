import "server-only";
import { connection } from "next/server";
import type { Movie, SearchResult } from "./movies";

type OMDbResponse = Partial<Movie> & {
  Response: "True" | "False";
  Error?: string;
  Search?: Movie[];
  totalResults?: string;
};

export class MovieApiError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

async function request(params: Record<string, string>): Promise<OMDbResponse> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new MovieApiError("Falta configurar la conexión con OMDb. Agrega OMDB_API_KEY en las variables de entorno.", 503);
  const query = new URLSearchParams({ apikey: apiKey, r: "json", ...params });
  // Cachear los datos reduce el consumo del plan gratuito. El HTML de la portada sigue siendo SSR.
  const response = await fetch(`https://www.omdbapi.com/?${query}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new MovieApiError("El catálogo no está disponible en este momento. Intenta de nuevo.");
  const data: OMDbResponse = await response.json();
  if (data.Response === "False") {
    if (data.Error?.includes("not found")) return data;
    if (data.Error?.includes("Too many results")) throw new MovieApiError("Escribe un título más específico para encontrar tu película.", 400);
    if (data.Error?.includes("limit")) throw new MovieApiError("Se alcanzó el límite diario del catálogo. Vuelve a intentarlo más tarde.", 429);
    throw new MovieApiError("No pudimos consultar OMDb. Revisa la configuración de la API.", 503);
  }
  return data;
}

export async function getMovie(id: string): Promise<Movie | null> {
  const data = await request({ i: id, plot: "full" });
  return data.Response === "True" ? data as Movie : null;
}

export async function searchMovies(query: string, type: string, page: number): Promise<SearchResult> {
  const data = await request({ s: query, page: String(page), ...(type ? { type } : {}) });
  return { movies: data.Search ?? [], total: Number(data.totalResults ?? 0) };
}

export async function getSelection(): Promise<{ movies: Movie[]; error: string | null }> {
  // Esperar una petición real: esta selección se renderiza en el servidor, no durante el build.
  await connection();
  const ids = [
    "tt0816692", "tt15239678", "tt4633694", "tt1375666", "tt6751668", "tt0245429",
    "tt0468569", "tt0111161", "tt0903747", "tt4574334", "tt7366338", "tt0944947",
  ];
  const results = await Promise.allSettled(ids.map(getMovie));
  const movies = results.flatMap(result => result.status === "fulfilled" && result.value ? [result.value] : []);
  return {
    movies,
    error: movies.length ? null : "No pudimos cargar la selección. Comprueba la conexión y la variable OMDB_API_KEY, y vuelve a intentarlo.",
  };
}
