/* eslint-disable @next/next/no-img-element -- Fotograma editorial remoto y pósteres de OMDb. */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Movie, MovieSummary, SearchResult } from "@/lib/movies";
import { mediaLabel } from "@/lib/movies";
import Icon from "./Icon";
import MoviePoster from "./MoviePoster";
import MovieModal from "./MovieModal";

const genres = [
  { label: "Todos los géneros", value: "" }, { label: "Ciencia ficción", value: "Sci-Fi" },
  { label: "Drama", value: "Drama" }, { label: "Acción", value: "Action" }, { label: "Animación", value: "Animation" },
];

const gridClasses = "movie-grid grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

export default function CinemaApp({ initialMovies, initialError }: { initialMovies: Movie[]; initialError: string | null }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult>({ movies: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<MovieSummary | null>(null);
  const [saved, setSaved] = useState<MovieSummary[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const catalogue = useRef<HTMLElement>(null);
  const cleanQuery = query.trim();
  const searching = cleanQuery.length >= 3;
  const featured = initialMovies.find(movie => movie.imdbID === "tt0816692") ?? initialMovies[0];

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("plano-watchlist") ?? "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((item): item is MovieSummary => item && /^tt\d+$/.test(item.imdbID) && typeof item.Title === "string" && typeof item.Poster === "string" && typeof item.Type === "string" && typeof item.Year === "string"));
    } catch { /* La lista es opcional si el navegador restringe el almacenamiento. */ }
  }, []);

  useEffect(() => {
    if (!searching || savedOnly) { setLoading(false); setError(""); return; }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    // Esperar a que el usuario deje de escribir evita consultas innecesarias.
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: cleanQuery, type, page: String(page) });
        const response = await fetch(`/api/movies?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResult(data);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "No pudimos buscar. Intenta nuevamente.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 450);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [cleanQuery, type, page, searching, savedOnly, retry]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const movies = useMemo(() => {
    if (searching && !savedOnly) return result.movies;
    return (savedOnly ? saved : initialMovies).filter(movie =>
      (!type || movie.Type === type) &&
      (!savedOnly || !cleanQuery || movie.Title.toLowerCase().includes(cleanQuery.toLowerCase())) &&
      (!genre || ((movie as Movie).Genre ?? initialMovies.find(item => item.imdbID === movie.imdbID)?.Genre ?? "").includes(genre)),
    );
  }, [searching, savedOnly, saved, initialMovies, type, genre, result.movies, cleanQuery]);

  function toggleSaved(movie: MovieSummary) {
    const exists = saved.some(item => item.imdbID === movie.imdbID);
    const next = exists ? saved.filter(item => item.imdbID !== movie.imdbID) : [...saved, movie];
    setSaved(next);
    try { localStorage.setItem("plano-watchlist", JSON.stringify(next)); } catch { /* Mantener la lista en memoria. */ }
    setToast(exists ? "Título eliminado de tu lista" : "Una buena historia más en tu lista");
  }

  function navigate(nextType = "", onlySaved = false) {
    setType(nextType); setSavedOnly(onlySaved); setQuery(""); setGenre(""); setPage(1);
    catalogue.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const totalPages = Math.min(100, Math.ceil(result.total / 10));
  const visibleError = searching ? error : savedOnly ? null : initialError;

  return <div className="cinema-site">
    <a className="skip-link" href="#catalogo">Saltar al catálogo</a>
    <header className="site-header">
      <a href="/" className="wordmark" aria-label="Plano, inicio"><span className="brand-symbol"><span/><span/><span/><span/></span>plano<span className="brand-dot">.</span></a>
      <nav aria-label="Navegación principal" className="main-nav">
        <button className={!type && !savedOnly ? "active" : ""} onClick={() => navigate()}>Descubrir</button>
        <button className={type === "movie" && !savedOnly ? "active" : ""} onClick={() => navigate("movie")}>Películas</button>
        <button className={type === "series" && !savedOnly ? "active" : ""} onClick={() => navigate("series")}>Series</button>
      </nav>
      <div className="header-actions"><button className="icon-button search-shortcut" aria-label="Ir al buscador" onClick={() => { catalogue.current?.scrollIntoView({ behavior: "smooth" }); input.current?.focus({ preventScroll: true }); }}><Icon name="search"/></button><span className="header-divider"/><button className={`watchlist-button ${savedOnly ? "active" : ""}`} onClick={() => navigate("", true)}><Icon name="bookmark" size={17}/><span>Mi lista</span><span className="list-count">{saved.length.toString().padStart(2, "0")}</span></button></div>
    </header>

    <main>
      {!savedOnly && !searching && <section className="film-hero" aria-labelledby="hero-title">
        <img className="hero-backdrop" src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/xJHokMbljvjADYdit5fK5VQsXEG.jpg" alt="Un astronauta explora el paisaje helado de Interstellar" fetchPriority="high"/>
        <div className="hero-shade"/>
        <div className="hero-topline"><span><span className="live-dot"/> EL CINE SE VIVE. LAS HISTORIAS SE QUEDAN.</span><span className="hero-edition">SELECCIÓN PLANO / 001</span></div>
        <div className="hero-copy"><p className="eyebrow"><span className="little-line"/> EN PRIMER PLANO</p><p className="hero-director">Una película de Christopher Nolan</p><h1 id="hero-title">Más allá de<br/>lo <em>imposible.</em></h1><div className="hero-movie-line"><strong>INTERSTELLAR</strong><span>2014</span><span>169 min</span><span className="hero-rating"><Icon name="star" size={14}/>{featured?.imdbRating ?? "8.7"}</span></div><p className="hero-description">Un viaje a los confines del universo. Una historia sobre lo que nos hace humanos. Hay películas que merecen quedarse contigo.</p><div className="hero-buttons"><button className="primary-button" disabled={!featured} onClick={() => featured && setSelected(featured)}>Explorar película <Icon name="arrow" size={18}/></button><button className="hero-save" disabled={!featured} aria-label={featured && saved.some(movie => movie.imdbID === featured.imdbID) ? "Quitar Interstellar de mi lista" : "Guardar Interstellar en mi lista"} onClick={() => featured && toggleSaved(featured)}><Icon name={featured && saved.some(movie => movie.imdbID === featured.imdbID) ? "check" : "plus"} size={21}/></button></div></div>
        <div className="hero-bottom"><span>BUENAS HISTORIAS.<br/><strong>SIN SCROLL INFINITO.</strong></span><a href="#catalogo" className="hero-discover">Encuentra tu próxima historia <span>↓</span></a><span className="hero-index"><b>PLANO</b><span/>001</span></div>
      </section>}

      <section className="catalogue section-wrap" id="catalogo" ref={catalogue} aria-labelledby="catalogue-title">
        <div className="catalogue-heading"><div><p className="eyebrow accent-text">{savedOnly ? "TU PROPIA SELECCIÓN" : searching ? "SIGUE TU CURIOSIDAD" : "MENOS BUSCAR. MÁS DESCUBRIR."}</p><h2 id="catalogue-title">{savedOnly ? "Historias para después." : searching ? "El próximo gran hallazgo." : <>Tu próxima <em>obsesión.</em></>}</h2></div><p className="catalogue-intro">{savedOnly ? "Ese título que no quieres olvidar.\nTu lista se guarda en este navegador." : "Películas que dejan huella. Series que atrapan.\nEncuentra algo que valga tu tiempo."}</p></div>

        <div className="discovery-toolbar">
          <div className="type-tabs" role="group" aria-label="Tipo de contenido">{[{ label: "Todo", value: "" }, { label: "Películas", value: "movie" }, { label: "Series", value: "series" }].map(tab => <button aria-pressed={type === tab.value} className={type === tab.value ? "selected" : ""} key={tab.value} onClick={() => { setType(tab.value); setPage(1); }}>{tab.label}</button>)}</div>
          <form className="movie-search" role="search" onSubmit={event => { event.preventDefault(); input.current?.blur(); }}><Icon name="search" size={19}/><label className="sr-only" htmlFor="movie-query">Buscar películas y series por título</label><input ref={input} id="movie-query" type="search" autoComplete="off" maxLength={100} placeholder="¿Qué historia tienes en mente?" value={query} onChange={event => { setQuery(event.target.value); setPage(1); setGenre(""); }}/>{query ? <button type="button" aria-label="Limpiar búsqueda" onClick={() => { setQuery(""); setPage(1); input.current?.focus(); }}><Icon name="close" size={16}/></button> : <span className="search-hint">BUSCAR</span>}</form>
        </div>

        <div className="catalogue-subbar"><div className="genre-filters" role="group" aria-label="Géneros">{!searching && !savedOnly ? genres.map(item => <button key={item.value} className={genre === item.value ? "selected" : ""} aria-pressed={genre === item.value} onClick={() => setGenre(item.value)}>{item.label}</button>) : <span className="results-description">{savedOnly ? "Tu colección personal" : <>Resultados para <strong>“{cleanQuery}”</strong></>}</span>}</div><span className="results-count" aria-live="polite">{loading ? "Buscando…" : `${searching && !savedOnly ? result.total : movies.length} títulos`}</span></div>
        {cleanQuery.length > 0 && cleanQuery.length < 3 && !savedOnly && <p className="search-guidance">Escribe al menos 3 letras para buscar en todo el catálogo.</p>}

        <div aria-busy={loading}>
          {visibleError ? <div className="empty-state" role="alert"><Icon name="info" size={34}/><h3>Una pequeña pausa.</h3><p>{visibleError}</p><button className="primary-button" onClick={() => searching ? setRetry(value => value + 1) : window.location.reload()}>Volver a intentar <Icon name="arrow" size={17}/></button></div> : loading ? <div className={gridClasses} role="status" aria-label="Buscando películas">{Array.from({ length: 6 }, (_, index) => <div className="movie-skeleton" key={index}><div/><span/><small/></div>)}</div> : movies.length ? <div className={gridClasses}>{movies.map((movie, index) => {
            const detail = initialMovies.find(item => item.imdbID === movie.imdbID);
            const isSaved = saved.some(item => item.imdbID === movie.imdbID);
            return <article className="movie-card" key={movie.imdbID} style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}>
              <div className="poster-shell"><button className="poster-open" onClick={() => setSelected(movie)} aria-label={`Ver detalles de ${movie.Title}`}><MoviePoster movie={movie} eager={index < 6}/><span className="poster-gradient"/><span className="poster-view">Ver la historia <Icon name="arrow" size={17}/></span></button>{detail?.imdbRating && detail.imdbRating !== "N/A" && <span className="poster-rating"><Icon name="star" size={12}/>{detail.imdbRating}</span>}<button className={`poster-save ${isSaved ? "is-saved" : ""}`} aria-label={`${isSaved ? "Quitar" : "Guardar"} ${movie.Title} ${isSaved ? "de" : "en"} mi lista`} aria-pressed={isSaved} onClick={() => toggleSaved(movie)}><Icon name={isSaved ? "check" : "plus"} size={19}/></button><span className="poster-type">{mediaLabel(movie.Type)}</span></div>
              <div className="movie-card-heading"><button onClick={() => setSelected(movie)}>{movie.Title}</button><Icon name="arrow" size={15}/></div><p className="movie-card-meta"><span>{movie.Year}</span><span className="meta-dot"/><span>{detail?.Genre.split(", ").slice(0, 2).join(" · ") ?? mediaLabel(movie.Type)}</span></p>
            </article>;
          })}</div> : <div className="empty-state"><Icon name={savedOnly ? "bookmark" : "search"} size={36}/><h3>{savedOnly ? "Tu próxima historia empieza aquí." : "Todavía no dimos con esa historia."}</h3><p>{savedOnly ? "Guarda películas y series con el botón + para encontrarlas después." : "Prueba con otro título o cambia el filtro entre películas y series."}</p><button className="text-button" onClick={() => navigate()}>Volver a descubrir <Icon name="arrow" size={17}/></button></div>}
        </div>

        {searching && !savedOnly && !loading && !error && totalPages > 1 && <nav className="pagination" aria-label="Páginas de resultados"><button disabled={page === 1} onClick={() => { setPage(value => value - 1); catalogue.current?.scrollIntoView({ behavior: "smooth" }); }}><Icon name="chevron" size={16} style={{ transform: "rotate(180deg)" }}/> Anterior</button><span>Página <strong>{page}</strong> de {totalPages}</span><button disabled={page === totalPages} onClick={() => { setPage(value => value + 1); catalogue.current?.scrollIntoView({ behavior: "smooth" }); }}>Siguiente <Icon name="chevron" size={16}/></button></nav>}
        {!searching && !savedOnly && <div className="selection-note"><span className="tiny-cross">✳</span><p>Una selección con intención.<span>Títulos elegidos para empezar. El resto del universo está a una búsqueda.</span></p><span className="note-line"/><span className="selection-signature">El equipo de Plano.</span></div>}
      </section>

      {!savedOnly && !searching && <section className="editorial-banner section-wrap"><div><p className="eyebrow">LA MEJOR PARTE DEL CINE</p><h2>Siempre hay una historia<br/>que todavía <em>no conoces.</em></h2></div><button className="round-arrow" aria-label="Buscar mi próxima película" onClick={() => { catalogue.current?.scrollIntoView({ behavior: "smooth" }); input.current?.focus({ preventScroll: true }); }}><Icon name="arrow" size={31}/></button><span className="editorial-mark" aria-hidden="true">p.</span></section>}
    </main>

    <footer className="site-footer section-wrap"><div className="footer-main"><a href="/" className="wordmark">plano<span className="brand-dot">.</span></a><p>Para quienes creen que una buena historia<br/>puede cambiar un día entero.</p><span className="footer-tag"><span className="live-dot"/> HECHO PARA DESCUBRIR</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Plano. Un proyecto para amantes del cine.</span><span>Datos de <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb</a> · Fotograma de <a href="https://www.themoviedb.org/movie/157336-interstellar" target="_blank" rel="noreferrer">TMDB</a></span><span>Una buena historia lo cambia todo.</span></div></footer>
    {selected && <MovieModal key={selected.imdbID} selected={selected} knownMovie={initialMovies.find(item => item.imdbID === selected.imdbID)} saved={saved.some(item => item.imdbID === selected.imdbID)} onSave={toggleSaved} onClose={() => setSelected(null)}/>}
    {toast && <div className="save-toast" role="status"><Icon name="check" size={18}/>{toast}</div>}
  </div>;
}
