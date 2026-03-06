"use client";

import Link from "next/link";
import { useState } from "react";

import { Actor } from "@/modules/actors/types";
import styles from "@/modules/actors/components/ActorCard.module.css";

type ActorCardProps = {
  actor: Actor;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function ActorCard({ actor, onDelete, showActions = true }: ActorCardProps) {
  const fallbackSrc = `https://picsum.photos/seed/actor-${actor.id}/800/450`;
  const [imageSrc, setImageSrc] = useState(actor.photo || fallbackSrc);

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/actors/${actor.id}`}>
        <div className={styles.media}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={`Foto de ${actor.name}`}
            onError={() => setImageSrc(fallbackSrc)}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>{actor.name}</h3>
        <p className={styles.nationality}>{actor.nationality}</p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/actors/${actor.id}/edit`}>
              Editar
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(actor.id)}>
              Eliminar
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
