"use client";

import { useI18n } from "@/components/I18nProvider";
import { PrizeCard } from "@/modules/prizes/components/PrizeCard";
import { Prize } from "@/modules/prizes/types";
import styles from "@/modules/prizes/components/PrizeList.module.css";

type PrizeListProps = {
  prizes: Prize[];
  onDelete: (id: string) => Promise<void> | void;
};

export function PrizeList({ prizes, onDelete }: PrizeListProps) {
  const { t } = useI18n();

  if (prizes.length === 0) {
    return <p className={styles.empty}>{t("No hay premios para mostrar.")}</p>;
  }

  return (
    <ul className={styles.grid}>
      {prizes.map((prize) => (
        <li className={styles.item} key={prize.id}>
          <PrizeCard prize={prize} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
