"use client";

import { DirectorCard } from "@/modules/directors/components/DirectorCard";
import { Director } from "@/modules/directors/types";
import styles from "@/modules/directors/components/DirectorList.module.css";

type DirectorListProps = {
  directors: Director[];
  onDelete: (id: string) => Promise<void> | void;
};

export function DirectorList({ directors, onDelete }: DirectorListProps) {
  if (directors.length === 0) {
    return <p className={styles.empty}>No hay directores para mostrar.</p>;
  }

  return (
    <ul className={styles.grid}>
      {directors.map((director) => (
        <li className={styles.item} key={director.id}>
          <DirectorCard director={director} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
