"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMovie } from "@/modules/movies/api";
import { MovieForm } from "@/modules/movies/components/MovieForm";
import { MovieFormValues } from "@/modules/movies/types";
import styles from "@/app/movies/new/new.module.css";

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: MovieFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await createMovie(values);
      router.push("/movies");
    } catch {
      setError("No se pudo crear la movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Crear movie</h1>
        <Link className={styles.backLink} href="/movies">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.status}>Guardando...</p> : null}
      <MovieForm onSubmit={handleSubmit} submitLabel="Crear" />
    </main>
  );
}
