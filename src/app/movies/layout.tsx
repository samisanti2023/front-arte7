import { ReactNode } from "react";

import styles from "@/app/movies/layout.module.css";

type MoviesLayoutProps = {
  children: ReactNode;
};

export default function MoviesLayout({ children }: MoviesLayoutProps) {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
