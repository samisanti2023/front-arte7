"use client";

import { useI18n } from "@/components/I18nProvider";
import { GenreCard } from "@/modules/genres/components/GenreCard";
import { Genre } from "@/modules/genres/types";
import styles from "@/modules/genres/components/GenreList.module.css";

type GenreListProps = {
  genres: Genre[];
  onDelete: (id: string) => Promise<void> | void;
};

export function GenreList({ genres, onDelete }: GenreListProps) {
  const { t } = useI18n();

  if (genres.length === 0) {
    return <p className={styles.empty}>{t("No hay generos para mostrar.")}</p>;
  }

  return (
    <ul className={styles.grid}>
      {genres.map((genre) => (
        <li className={styles.item} key={genre.id}>
          <GenreCard genre={genre} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
