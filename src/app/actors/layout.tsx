import { ReactNode } from "react";

import styles from "@/app/actors/layout.module.css";

type ActorsLayoutProps = {
  children: ReactNode;
};

export default function ActorsLayout({ children }: ActorsLayoutProps) {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
