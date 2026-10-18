import { MovieApiError, getMovie, searchMovies } from "@/lib/omdb";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  try {
    const id = params.get("id");
    if (id) {
      if (!/^tt\d{7,10}$/.test(id)) return Response.json({ error: "El identificador no es válido." }, { status: 400 });
      const movie = await getMovie(id);
      return movie ? Response.json(movie) : Response.json({ error: "No encontramos este título." }, { status: 404 });
    }
    const query = (params.get("q") ?? "").trim();
    const type = params.get("type") ?? "";
    const page = Number(params.get("page") ?? 1);
    if (query.length < 3 || query.length > 100 || !["", "movie", "series"].includes(type) || !Number.isInteger(page) || page < 1 || page > 100) {
      return Response.json({ error: "Escribe entre 3 y 100 caracteres y selecciona una página válida." }, { status: 400 });
    }
    return Response.json(await searchMovies(query, type, page));
  } catch (error) {
    return Response.json({ error: error instanceof MovieApiError ? error.message : "La conexión tardó demasiado. Intenta nuevamente." }, {
      status: error instanceof MovieApiError ? error.status : 502,
    });
  }
}
