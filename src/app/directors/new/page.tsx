"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createDirector } from "@/modules/directors/api";
import { DirectorForm } from "@/modules/directors/components/DirectorForm";
import { DirectorFormValues } from "@/modules/directors/types";
import styles from "@/app/directors/new/new.module.css";

export default function NewDirectorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: DirectorFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await createDirector(values);
      router.push("/directors");
    } catch {
      setError("No se pudo crear el director.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Crear director</h1>
        <Link className={styles.backLink} href="/directors">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.status}>Guardando...</p> : null}
      <DirectorForm onSubmit={handleSubmit} submitLabel="Crear" />
    </main>
  );
}
