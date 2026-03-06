import Link from "next/link";

import styles from "@/components/AppTopBar.module.css";

export function AppTopBar() {
  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link className={styles.repoTitle} href="/actors">
          front-arte7
        </Link>

        <nav className={styles.nav} aria-label="Navegacion principal">
          <Link className={styles.navButton} href="/actors">
            Actors
          </Link>
          <Link className={styles.navButton} href="/movies">
            Movies
          </Link>
          <Link className={styles.navButton} href="/directors">
            Directors
          </Link>
        </nav>
      </div>
    </header>
  );
}
