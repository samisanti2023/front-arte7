"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteMovie, getMovies } from "@/modules/movies/api";
import { MovieList } from "@/modules/movies/components/MovieList";
import { Movie } from "@/modules/movies/types";
import { getPrizes } from "@/modules/prizes/api";
import styles from "@/app/movies/movies.module.css";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const [moviesData, prizesData] = await Promise.all([getMovies(), getPrizes()]);

      const movieToPrizes = new Map<string, { id: string; name: string }[]>();

      for (const prize of prizesData) {
        for (const movieRef of prize.movies ?? []) {
          const current = movieToPrizes.get(movieRef.id) ?? [];
          current.push({ id: prize.id, name: prize.name });
          movieToPrizes.set(movieRef.id, current);
        }
      }

      const merged = moviesData.map((movie) => ({
        ...movie,
        prizes: movieToPrizes.get(movie.id) ?? [],
      }));

      setMovies(merged);
    } catch {
      setError("No se pudo cargar la lista de movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMovies();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      await loadMovies();
    } catch {
      setError("No se pudo eliminar la movie.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Movies</h1>
        </div>
        <Link className={styles.createLink} href="/movies/new">
          Crear movie
        </Link>
      </header>

      {loading ? <p className={styles.status}>Cargando...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <MovieList movies={movies} onDelete={onDelete} />
    </main>
  );
}
