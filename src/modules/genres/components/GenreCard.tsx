"use client";

import Link from "next/link";

import { useI18n } from "@/components/I18nProvider";
import { Genre } from "@/modules/genres/types";
import styles from "@/modules/genres/components/GenreCard.module.css";

type GenreCardProps = {
  genre: Genre;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function GenreCard({ genre, onDelete, showActions = true }: GenreCardProps) {
  const { t } = useI18n();
  const cover = `https://picsum.photos/seed/genre-${genre.id}/800/450`;

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/genres/${genre.id}`}>
        <div className={styles.media}>
          <img className={styles.image} src={cover} alt={`${t("Imagen de")} ${genre.type}`} />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>{genre.type}</h3>
        <p className={styles.meta}>
          {t("Peliculas:")} {genre.movies?.length ?? 0}
        </p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/genres/${genre.id}/edit`}>
              {t("Editar")}
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(genre.id)}>
              {t("Eliminar")}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
