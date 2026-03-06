import { ReactNode } from "react";

import styles from "@/app/prizes/layout.module.css";

type PrizesLayoutProps = {
  children: ReactNode;
};

export default function PrizesLayout({ children }: PrizesLayoutProps) {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
