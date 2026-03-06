"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMovie, updateMovie } from "@/modules/movies/api";
import { MovieForm } from "@/modules/movies/components/MovieForm";
import { MovieFormValues } from "@/modules/movies/types";
import styles from "@/app/movies/[id]/edit/edit.module.css";

function toDateInputValue(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<MovieFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const movie = await getMovie(id);
        setInitialValues({
          title: movie.title,
          poster: movie.poster,
          duration: movie.duration,
          country: movie.country,
          releaseDate: toDateInputValue(movie.releaseDate),
          popularity: movie.popularity,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("No se pudo cargar la movie.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadMovie();
  }, [id]);

  const handleSubmit = async (values: MovieFormValues) => {
    if (!id || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateMovie(id, values);
      router.push("/movies");
    } catch {
      setError("No se pudo actualizar la movie.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Editar movie</h1>
          <Link className={styles.backLink} href="/movies">
            Volver
          </Link>
        </header>
        <p className={styles.status}>Cargando...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Editar movie</h1>
        <Link className={styles.backLink} href="/movies">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {initialValues ? (
        <MovieForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitting ? "Guardando..." : "Guardar"}
        />
      ) : null}
    </main>
  );
}
