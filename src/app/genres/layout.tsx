import { ReactNode } from "react";

import styles from "@/app/genres/layout.module.css";

type GenresLayoutProps = {
  children: ReactNode;
};

export default function GenresLayout({ children }: GenresLayoutProps) {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
