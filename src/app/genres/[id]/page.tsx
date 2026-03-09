"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import { DetailBackground } from "@/components/DetailBackground";
import { getGenre } from "@/modules/genres/api";
import { GenreCard } from "@/modules/genres/components/GenreCard";
import { Genre } from "@/modules/genres/types";
import styles from "@/app/entity-detail.module.css";

export default function GenreDetailPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID invalido.");
      setLoading(false);
      return;
    }

    const loadGenre = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getGenre(id);
        setGenre(data);
      } catch {
        setError("No se pudo cargar el detalle del genero.");
      } finally {
        setLoading(false);
      }
    };

    void loadGenre();
  }, [id]);

  return (
    <DetailBackground seedPrefix={`genre-${id ?? "unknown"}`}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>{t("Detalle genero")}</h1>
          <div className={styles.topActions}>
            <Link className={styles.link} href="/genres">
              {t("Volver")}
            </Link>
            {id ? (
              <Link className={styles.link} href={`/genres/${id}/edit`}>
                {t("Editar")}
              </Link>
            ) : null}
          </div>
        </header>

        {loading ? <p className={styles.status}>{t("Cargando...")}</p> : null}
        {error ? <p className={styles.error}>{t(error)}</p> : null}

        {genre ? (
          <div className={styles.contentGrid}>
            <GenreCard genre={genre} showActions={false} />

            <section className={styles.detailsPanel}>
              <h2 className={styles.detailsTitle}>{t("Informacion general")}</h2>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>{t("ID:")}</span> {genre.id}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>{t("Tipo:")}</span> {genre.type}
                </li>
              </ul>

              <h2 className={styles.detailsTitle}>{t("Peliculas")}</h2>
              {genre.movies?.length ? (
                <ul className={styles.chipList}>
                  {genre.movies.map((movie) => (
                    <li className={styles.chip} key={movie.id}>
                      <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.detailsText}>{t("No tiene peliculas asociadas.")}</p>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </DetailBackground>
  );
}
