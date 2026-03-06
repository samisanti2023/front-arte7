"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailBackground } from "@/components/DetailBackground";
import { getMovie } from "@/modules/movies/api";
import { MovieCard } from "@/modules/movies/components/MovieCard";
import { Movie } from "@/modules/movies/types";
import styles from "@/app/entity-detail.module.css";

function formatDate(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    const loadMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovie(id);
        setMovie(data);
      } catch {
        setError("No se pudo cargar el detalle de la movie.");
      } finally {
        setLoading(false);
      }
    };

    void loadMovie();
  }, [id]);

  return (
    <DetailBackground seedPrefix={`movie-${id ?? "unknown"}`}>
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Detalle movie</h1>
          <div className={styles.topActions}>
            <Link className={styles.link} href="/movies">
              Volver
            </Link>
            {id ? (
              <Link className={styles.link} href={`/movies/${id}/edit`}>
                Editar
              </Link>
            ) : null}
          </div>
        </header>

        {loading ? <p className={styles.status}>Cargando...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {movie ? (
          <div className={styles.contentGrid}>
            <MovieCard movie={movie} showActions={false} />

            <section className={styles.detailsPanel}>
              <h2 className={styles.detailsTitle}>Informacion general</h2>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Titulo:</span> {movie.title}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Pais:</span> {movie.country}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Estreno:</span> {formatDate(movie.releaseDate)}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Duracion:</span> {movie.duration} min
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Popularidad:</span> {movie.popularity}
                </li>
                {movie.genre?.type ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>Genero:</span> {movie.genre.type}
                  </li>
                ) : null}
                {movie.director?.name ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>Director:</span>{" "}
                    <Link href={`/directors/${movie.director.id}`}>{movie.director.name}</Link>
                  </li>
                ) : null}
              </ul>
            </section>
          </div>
        ) : null}
      </main>
    </DetailBackground>
  );
}
