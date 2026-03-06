"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailBackground } from "@/components/DetailBackground";
import { getMovie } from "@/modules/movies/api";
import { MovieCard } from "@/modules/movies/components/MovieCard";
import { Movie } from "@/modules/movies/types";
import { getPrizes } from "@/modules/prizes/api";
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
        const [movieData, prizesData] = await Promise.all([getMovie(id), getPrizes()]);
        const relatedPrizes = prizesData
          .filter((prize) => (prize.movies ?? []).some((movieRef) => movieRef.id === movieData.id))
          .map((prize) => ({ id: prize.id, name: prize.name }));

        setMovie({
          ...movieData,
          prizes: relatedPrizes,
        });
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
                  <span className={styles.detailsLabel}>ID:</span> {movie.id}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Titulo:</span> {movie.title}
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsLabel}>Poster:</span>{" "}
                  <a href={movie.poster} target="_blank" rel="noreferrer">
                    {movie.poster}
                  </a>
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
                {movie.youtubeTrailer?.name ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>Trailer:</span> {movie.youtubeTrailer.name}
                  </li>
                ) : null}
              </ul>

              <h2 className={styles.detailsTitle}>Actores</h2>
              {movie.actors?.length ? (
                <ul className={styles.chipList}>
                  {movie.actors.map((actor) => (
                    <li className={styles.chip} key={actor.id}>
                      <Link href={`/actors/${actor.id}`}>{actor.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.detailsText}>No tiene actores asociados.</p>
              )}

              <h2 className={styles.detailsTitle}>Premios</h2>
              {movie.prizes?.length ? (
                <ul className={styles.chipList}>
                  {movie.prizes.map((prize) => (
                    <li className={styles.chip} key={prize.id}>
                      <Link href={`/prizes/${prize.id}`}>{prize.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.detailsText}>No tiene premios asociados.</p>
              )}

              <ul className={styles.detailsList}>
                {movie.youtubeTrailer?.url ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>URL trailer:</span>{" "}
                    <a href={movie.youtubeTrailer.url} target="_blank" rel="noreferrer">
                      {movie.youtubeTrailer.url}
                    </a>
                  </li>
                ) : null}
                {movie.youtubeTrailer?.channel ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>Canal trailer:</span> {movie.youtubeTrailer.channel}
                  </li>
                ) : null}
                {movie.youtubeTrailer?.duration ? (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsLabel}>Duracion trailer:</span>{" "}
                    {movie.youtubeTrailer.duration}
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
