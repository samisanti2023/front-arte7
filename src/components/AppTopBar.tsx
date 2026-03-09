"use client";

import Link from "next/link";

import { useI18n } from "@/components/I18nProvider";
import styles from "@/components/AppTopBar.module.css";

export function AppTopBar() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link className={styles.repoTitle} href="/actors">
          front-arte7
        </Link>

        <nav className={styles.nav} aria-label={t("mainNavigation")}>
          <Link className={styles.navButton} href="/actors">
            {t("actors")}
          </Link>
          <Link className={styles.navButton} href="/movies">
            {t("movies")}
          </Link>
          <Link className={styles.navButton} href="/genres">
            {t("genres")}
          </Link>
          <Link className={styles.navButton} href="/directors">
            {t("directors")}
          </Link>
          <Link className={styles.navButton} href="/prizes">
            {t("prizes")}
          </Link>

          <div className={styles.localeWrap}>
            <label className={styles.localeLabel} htmlFor="app-locale">
              {t("language")}
            </label>
            <select
              id="app-locale"
              className={styles.localeSelect}
              value={locale}
              onChange={(e) => setLocale(e.target.value as "es" | "en")}
            >
              <option value="es">{t("spanish")}</option>
              <option value="en">{t("english")}</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
