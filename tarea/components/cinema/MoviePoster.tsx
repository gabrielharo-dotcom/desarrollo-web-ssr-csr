/* eslint-disable @next/next/no-img-element -- Pósteres externos servidos por OMDb. */
"use client";

import { useState } from "react";
import type { MovieSummary } from "@/lib/movies";
import Icon from "./Icon";

export default function MoviePoster({ movie, className = "", eager = false }: { movie: MovieSummary; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return movie.Poster && movie.Poster !== "N/A" && !failed ? (
    <img className={className} src={movie.Poster} alt={`Póster de ${movie.Title}`} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} />
  ) : (
    <div className={`poster-fallback ${className}`}><Icon name="film" size={34}/><span>{movie.Title}</span><small>Póster no disponible</small></div>
  );
}
