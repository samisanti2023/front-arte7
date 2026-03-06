"use client";

import { MovieCard } from "@/modules/movies/components/MovieCard";
import { Movie } from "@/modules/movies/types";
import styles from "@/modules/movies/components/MovieList.module.css";

type MovieListProps = {
  movies: Movie[];
  onDelete: (id: string) => Promise<void> | void;
};

export function MovieList({ movies, onDelete }: MovieListProps) {
  if (movies.length === 0) {
    return <p className={styles.empty}>No hay movies para mostrar.</p>;
  }

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li className={styles.item} key={movie.id}>
          <MovieCard movie={movie} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
