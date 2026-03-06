"use client";

import { ActorCard } from "@/modules/actors/components/ActorCard";
import { Actor } from "@/modules/actors/types";
import styles from "@/modules/actors/components/ActorList.module.css";

type ActorListProps = {
  actors: Actor[];
  onDelete: (id: string) => Promise<void> | void;
};

export function ActorList({ actors, onDelete }: ActorListProps) {
  if (actors.length === 0) {
    return <p className={styles.empty}>No hay actores para mostrar.</p>;
  }

  return (
    <ul className={styles.grid}>
      {actors.map((actor) => (
        <li className={styles.item} key={actor.id}>
          <ActorCard actor={actor} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
