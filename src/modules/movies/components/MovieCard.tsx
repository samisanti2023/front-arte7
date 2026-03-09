"use client";

import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import { Movie } from "@/modules/movies/types";
import styles from "@/modules/movies/components/MovieCard.module.css";

type MovieCardProps = {
  movie: Movie;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function MovieCard({ movie, onDelete, showActions = true }: MovieCardProps) {
  const { t } = useI18n();
  const fallbackSrc = `https://picsum.photos/seed/movie-${movie.id}/800/450`;
  const [imageSrc, setImageSrc] = useState(movie.poster || fallbackSrc);
  const releaseDate = movie.releaseDate?.includes("T")
    ? movie.releaseDate.slice(0, 10)
    : movie.releaseDate || t("N/A");
  const actorName = movie.actors?.[0]?.name ?? t("Sin actor");
  const prizeName = movie.prizes?.[0]?.name ?? t("Sin premio");

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/movies/${movie.id}`}>
        <div className={styles.media}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={`${t("Poster de")} ${movie.title}`}
            onError={() => setImageSrc(fallbackSrc)}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>
          {t("Fecha lanzamiento:")} {releaseDate}
        </p>
        <p className={styles.metaSecondary}>
          {t("Actor:")} {actorName}
        </p>
        <p className={styles.metaSecondary}>
          {t("Premio:")} {prizeName}
        </p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/movies/${movie.id}/edit`}>
              {t("Editar")}
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(movie.id)}>
              {t("Eliminar")}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
