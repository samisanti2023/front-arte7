"use client";

import { ReactNode } from "react";

import styles from "@/components/DetailBackground.module.css";

type DetailBackgroundProps = {
  seedPrefix: string;
  children: ReactNode;
};

export function DetailBackground({ seedPrefix, children }: DetailBackgroundProps) {
  const backgroundUrl = `https://picsum.photos/seed/${seedPrefix}-bg-1/1600/900`;

  return (
    <section className={styles.root} style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </section>
  );
}
