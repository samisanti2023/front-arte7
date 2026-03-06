import { ReactNode } from "react";

import styles from "@/app/directors/layout.module.css";

type DirectorsLayoutProps = {
  children: ReactNode;
};

export default function DirectorsLayout({ children }: DirectorsLayoutProps) {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
