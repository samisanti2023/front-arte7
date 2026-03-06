"use client";

import Link from "next/link";
import { useState } from "react";

import { Movie } from "@/modules/movies/types";
import styles from "@/modules/movies/components/MovieCard.module.css";

type MovieCardProps = {
  movie: Movie;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function MovieCard({ movie, onDelete, showActions = true }: MovieCardProps) {
  const fallbackSrc = `https://picsum.photos/seed/movie-${movie.id}/800/450`;
  const [imageSrc, setImageSrc] = useState(movie.poster || fallbackSrc);
  const year = movie.releaseDate?.slice(0, 4) || "N/A";

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/movies/${movie.id}`}>
        <div className={styles.media}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={`Poster de ${movie.title}`}
            onError={() => setImageSrc(fallbackSrc)}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>
          {movie.country} | {year}
        </p>
        <p className={styles.metaSecondary}>
          Duracion: {movie.duration} min | Popularidad: {movie.popularity}
        </p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/movies/${movie.id}/edit`}>
              Editar
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(movie.id)}>
              Eliminar
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
