"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailBackground } from "@/components/DetailBackground";
import { getDirector } from "@/modules/directors/api";
import { DirectorCard } from "@/modules/directors/components/DirectorCard";
import { Director } from "@/modules/directors/types";
import styles from "@/app/entity-detail.module.css";

function formatDate(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function DirectorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [director, setDirector] = useState<Director | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    const loadDirector = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getDirector(id);
        setDirector(data);
      } catch {
        setError("No se pudo cargar el detalle del director.");
      } finally {
        setLoading(false);
      }
    };

    void loadDirector();
  }, [id]);

  return (
    <DetailBackground seedPrefix={`director-${id ?? "unknown"}`}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Detalle director</h1>
          <div className={styles.topActions}>
            <Link className={styles.link} href="/directors">
              Volver
            </Link>
            {id ? (
              <Link className={styles.link} href={`/directors/${id}/edit`}>
                Editar
              </Link>
            ) : null}
          </div>
        </header>

        {loading ? <p className={styles.status}>Cargando...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {director ? (
          <div className={styles.contentGrid}>
            <DirectorCard director={director} showActions={false} />

            <section className={styles.detailsPanel}>
              <h2 className={styles.detailsTitle}>Informacion general</h2>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nombre:</span> {director.name}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nacionalidad:</span> {director.nationality}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nacimiento:</span> {formatDate(director.birthDate)}
                </li>
              </ul>

              <p className={styles.detailsText}>{director.biography}</p>

              <ul className={styles.chipList}>
                {director.movies?.map((movie) => (
                  <li className={styles.chip} key={movie.id}>
                    <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}
      </main>
    </DetailBackground>
  );
}
