"use client";

import { useEffect, useRef, useState } from "react";
import type { Movie, MovieSummary } from "@/lib/movies";
import { mediaLabel, readable } from "@/lib/movies";
import MoviePoster from "./MoviePoster";
import Icon from "./Icon";

export default function MovieModal({ selected, knownMovie, saved, onSave, onClose }: {
  selected: MovieSummary; knownMovie?: Movie; saved: boolean; onSave: (movie: MovieSummary) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [movie, setMovie] = useState<Movie | null>(knownMovie ?? null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; element?.close(); previousFocus?.focus(); };
  }, []);

  useEffect(() => {
    if (knownMovie) return;
    const controller = new AbortController();
    async function load() {
      setError("");
      try {
        const response = await fetch(`/api/movies?id=${selected.imdbID}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setMovie(data);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "No pudimos cargar los detalles.");
      }
    }
    void load();
    return () => controller.abort();
  }, [selected.imdbID, knownMovie, retry]);

  return (
    <dialog ref={dialog} className="movie-dialog" aria-labelledby="movie-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-inner">
        <button type="button" className="icon-button dialog-close" onClick={onClose} aria-label="Cerrar detalles"><Icon name="close"/></button>
        <div className="dialog-poster"><MoviePoster movie={selected} eager/><span className="dialog-poster-caption">CADA HISTORIA, UN UNIVERSO.</span></div>
        <div className="dialog-content">
          <p className="eyebrow accent-text">LA FICHA · {mediaLabel(selected.Type)}</p>
          <h2 id="movie-title">{selected.Title}</h2>
          <div className="movie-meta"><span>{selected.Year}</span>{movie && <><span>{readable(movie.Runtime)}</span><span className="age-rating">{readable(movie.Rated)}</span></>}</div>
          {error ? <div className="inline-error" role="alert"><p>{error}</p><button className="text-button" onClick={() => setRetry(value => value + 1)}>Volver a intentar <Icon name="arrow" size={16}/></button></div> : !movie ? <div className="detail-loading" role="status"><span className="spinner"/> Buscando la historia detrás de la película…</div> : <>
            <div className="detail-ratings">
              <div><Icon name="star" className="star-icon"/><strong>{readable(movie.imdbRating)}<small>/10</small></strong><span>IMDb · {readable(movie.imdbVotes)} votos</span></div>
              {movie.Metascore !== "N/A" && <div><strong>{movie.Metascore}<small>/100</small></strong><span>Metascore</span></div>}
            </div>
            <div className="detail-genres">{movie.Genre.split(", ").map(genre => <span key={genre}>{genre}</span>)}</div>
            <h3>La historia</h3><p className="detail-plot">{readable(movie.Plot)}</p><span className="original-note">Sinopsis original de OMDb</span>
            <dl className="detail-facts">
              <div><dt>Dirección</dt><dd>{readable(movie.Director)}</dd></div>
              <div><dt>Reparto</dt><dd>{readable(movie.Actors)}</dd></div>
              <div><dt>Guion</dt><dd>{readable(movie.Writer)}</dd></div>
              <div><dt>Estreno</dt><dd>{readable(movie.Released)}</dd></div>
              <div><dt>País · Idioma</dt><dd>{readable(movie.Country)} · {readable(movie.Language)}</dd></div>
              {movie.totalSeasons && <div><dt>Temporadas</dt><dd>{readable(movie.totalSeasons)}</dd></div>}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && <div><dt>Recaudación</dt><dd>{movie.BoxOffice}</dd></div>}
            </dl>
            {movie.Awards !== "N/A" && <p className="awards"><Icon name="star" size={17}/>{movie.Awards}</p>}
            <div className="detail-actions"><button className="primary-button" onClick={() => onSave(selected)}><Icon name={saved ? "check" : "plus"} size={18}/>{saved ? "Guardada en mi lista" : "Añadir a mi lista"}</button><a className="text-button" href={`https://www.imdb.com/title/${selected.imdbID}/`} target="_blank" rel="noreferrer">Ver en IMDb <Icon name="arrow" size={17}/></a></div>
          </>}
        </div>
      </div>
    </dialog>
  );
}
