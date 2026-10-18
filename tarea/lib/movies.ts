export interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface Movie extends MovieSummary {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
  totalSeasons?: string;
}

export interface SearchResult {
  movies: MovieSummary[];
  total: number;
}

export function readable(value?: string) {
  return value && value !== "N/A" ? value : "No disponible";
}

export function mediaLabel(type: string) {
  return type === "series" ? "Serie" : type === "episode" ? "Episodio" : "Película";
}
