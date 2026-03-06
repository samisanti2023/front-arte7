"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailBackground } from "@/components/DetailBackground";
import { getPrize } from "@/modules/prizes/api";
import { PrizeCard } from "@/modules/prizes/components/PrizeCard";
import { Prize } from "@/modules/prizes/types";
import styles from "@/app/entity-detail.module.css";

export default function PrizeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [prize, setPrize] = useState<Prize | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    const loadPrize = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPrize(id);
        setPrize(data);
      } catch {
        setError("No se pudo cargar el detalle del premio.");
      } finally {
        setLoading(false);
      }
    };

    void loadPrize();
  }, [id]);

  return (
    <DetailBackground seedPrefix={`prize-${id ?? "unknown"}`}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Detalle premio</h1>
          <div className={styles.topActions}>
            <Link className={styles.link} href="/prizes">
              Volver
            </Link>
            {id ? (
              <Link className={styles.link} href={`/prizes/${id}/edit`}>
                Editar
              </Link>
            ) : null}
          </div>
        </header>

        {loading ? <p className={styles.status}>Cargando...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {prize ? (
          <div className={styles.contentGrid}>
            <PrizeCard prize={prize} showActions={false} />

            <section className={styles.detailsPanel}>
              <h2 className={styles.detailsTitle}>Informacion general</h2>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nombre:</span> {prize.name}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Categoria:</span> {prize.category}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Anio:</span> {prize.year}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Estado:</span> {prize.status}
                </li>
              </ul>

              <ul className={styles.chipList}>
                {prize.movies?.map((movie) => (
                  <li className={styles.chip} key={`movie-${movie.id}`}>
                    <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
                  </li>
                ))}
                {prize.actors?.map((actor) => (
                  <li className={styles.chip} key={`actor-${actor.id}`}>
                    <Link href={`/actors/${actor.id}`}>{actor.name}</Link>
                  </li>
                ))}
                {prize.directors?.map((director) => (
                  <li className={styles.chip} key={`director-${director.id}`}>
                    <Link href={`/directors/${director.id}`}>{director.name}</Link>
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
