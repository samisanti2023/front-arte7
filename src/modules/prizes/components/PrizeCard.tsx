"use client";

import Link from "next/link";

import { useI18n } from "@/components/I18nProvider";
import { Prize } from "@/modules/prizes/types";
import styles from "@/modules/prizes/components/PrizeCard.module.css";

type PrizeCardProps = {
  prize: Prize;
  onDelete?: (id: string) => Promise<void> | void;
  showActions?: boolean;
};

export function PrizeCard({ prize, onDelete, showActions = true }: PrizeCardProps) {
  const { t } = useI18n();
  const cover = `https://picsum.photos/seed/prize-${prize.id}/800/450`;

  return (
    <article className={styles.card}>
      <Link className={styles.mediaLink} href={`/prizes/${prize.id}`}>
        <div className={styles.media}>
          <img className={styles.image} src={cover} alt={`${t("Imagen de")} ${prize.name}`} />
        </div>
      </Link>

      <div className={styles.content}>
        <h3 className={styles.name}>{prize.name}</h3>
        <p className={styles.meta}>
          {prize.category} | {prize.year}
        </p>
        <p className={styles.status}>{t(prize.status)}</p>

        {showActions ? (
          <div className={styles.actions}>
            <Link className={styles.editButton} href={`/prizes/${prize.id}/edit`}>
              {t("Editar")}
            </Link>
            <button className={styles.deleteButton} type="button" onClick={() => onDelete?.(prize.id)}>
              {t("Eliminar")}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
