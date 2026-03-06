"use client";

import Link from "next/link";
import { useState } from "react";

import { Director } from "@/modules/directors/types";
import styles from "@/modules/directors/components/DirectorCard.module.css";

type DirectorCardProps = {
  director: Director;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function DirectorCard({ director, onDelete, showActions = true }: DirectorCardProps) {
  const fallbackSrc = `https://picsum.photos/seed/director-${director.id}/800/450`;
  const [imageSrc, setImageSrc] = useState(director.photo || fallbackSrc);

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/directors/${director.id}`}>
        <div className={styles.media}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={`Foto de ${director.name}`}
            onError={() => setImageSrc(fallbackSrc)}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>{director.name}</h3>
        <p className={styles.nationality}>{director.nationality}</p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/directors/${director.id}/edit`}>
              Editar
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(director.id)}>
              Eliminar
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
