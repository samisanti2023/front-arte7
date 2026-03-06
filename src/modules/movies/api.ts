import { Movie, MovieDirector, MovieFormValues, MovieGenre, MovieYoutubeTrailer } from "@/modules/movies/types";

const API_URL = "http://localhost:3000/api/v1";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

function toIsoDate(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
}

async function getFirstGenreId(): Promise<string> {
  const genres = await requestJson<MovieGenre[]>(`${API_URL}/genres`);

  if (!genres.length) {
    throw new Error("No genres disponibles en backend.");
  }

  return genres[0].id;
}

async function getFirstDirectorId(): Promise<string> {
  const directors = await requestJson<MovieDirector[]>(`${API_URL}/directors`);

  if (!directors.length) {
    throw new Error("No directors disponibles en backend.");
  }

  return directors[0].id;
}

async function createYoutubeTrailer(title: string): Promise<MovieYoutubeTrailer> {
  const suffix = Date.now();

  return await requestJson<MovieYoutubeTrailer>(`${API_URL}/youtube-trailers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Trailer ${title}`.slice(0, 90),
      url: `https://example.com/trailer-${suffix}`,
      duration: 2,
      channel: "Codex",
    }),
  });
}

function buildMoviePayload(
  data: MovieFormValues,
  relationIds: { genreId: string; directorId: string; youtubeTrailerId: string },
) {
  return {
    title: data.title,
    poster: data.poster,
    duration: data.duration,
    country: data.country,
    releaseDate: toIsoDate(data.releaseDate),
    popularity: data.popularity,
    genre: { id: relationIds.genreId },
    director: { id: relationIds.directorId },
    youtubeTrailer: { id: relationIds.youtubeTrailerId },
  };
}

export async function getMovies(): Promise<Movie[]> {
  return await requestJson<Movie[]>(`${API_URL}/movies`);
}

export async function getMovie(id: string): Promise<Movie> {
  return await requestJson<Movie>(`${API_URL}/movies/${id}`);
}

export async function createMovie(data: MovieFormValues): Promise<Movie> {
  const [genreId, directorId] = await Promise.all([getFirstGenreId(), getFirstDirectorId()]);
  const trailer = await createYoutubeTrailer(data.title);

  return await requestJson<Movie>(`${API_URL}/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildMoviePayload(data, {
        genreId,
        directorId,
        youtubeTrailerId: trailer.id,
      }),
    ),
  });
}

export async function updateMovie(id: string, data: MovieFormValues): Promise<Movie> {
  const current = await getMovie(id);
  const genreId = current.genre?.id ?? (await getFirstGenreId());
  const directorId = current.director?.id ?? (await getFirstDirectorId());
  const youtubeTrailerId = current.youtubeTrailer?.id ?? (await createYoutubeTrailer(data.title)).id;

  return await requestJson<Movie>(`${API_URL}/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildMoviePayload(data, {
        genreId,
        directorId,
        youtubeTrailerId,
      }),
    ),
  });
}

export async function deleteMovie(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${API_URL}/movies/${id} failed: ${res.status} ${res.statusText}`);
  }
}
