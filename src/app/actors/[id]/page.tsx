"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailBackground } from "@/components/DetailBackground";
import { getActor } from "@/modules/actors/api";
import { ActorCard } from "@/modules/actors/components/ActorCard";
import { Actor } from "@/modules/actors/types";
import styles from "@/app/entity-detail.module.css";

function formatDate(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function ActorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    const loadActor = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getActor(id);
        setActor(data);
      } catch {
        setError("No se pudo cargar el detalle del actor.");
      } finally {
        setLoading(false);
      }
    };

    void loadActor();
  }, [id]);

  return (
    <DetailBackground seedPrefix={`actor-${id ?? "unknown"}`}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Detalle actor</h1>
          <div className={styles.topActions}>
            <Link className={styles.link} href="/actors">
              Volver
            </Link>
            {id ? (
              <Link className={styles.link} href={`/actors/${id}/edit`}>
                Editar
              </Link>
            ) : null}
          </div>
        </header>

        {loading ? <p className={styles.status}>Cargando...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {actor ? (
          <div className={styles.contentGrid}>
            <ActorCard actor={actor} showActions={false} />

            <section className={styles.detailsPanel}>
              <h2 className={styles.detailsTitle}>Informacion general</h2>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nombre:</span> {actor.name}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nacionalidad:</span> {actor.nationality}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Nacimiento:</span> {formatDate(actor.birthDate)}
                </li>
              </ul>

              <p className={styles.detailsText}>{actor.biography}</p>

              <ul className={styles.chipList}>
                {actor.movies?.map((movie) => (
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
