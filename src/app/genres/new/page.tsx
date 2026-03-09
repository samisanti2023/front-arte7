"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import { createGenre } from "@/modules/genres/api";
import { GenreForm } from "@/modules/genres/components/GenreForm";
import { GenreFormValues } from "@/modules/genres/types";
import styles from "@/app/genres/new/new.module.css";

export default function NewGenrePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: GenreFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await createGenre(values);
      router.push("/genres");
    } catch {
      setError("No se pudo crear el genero.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>{t("Crear genero")}</h1>
        <Link className={styles.backLink} href="/genres">
          {t("Volver")}
        </Link>
      </header>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      {loading ? <p className={styles.status}>{t("Guardando...")}</p> : null}
      <GenreForm onSubmit={handleSubmit} submitLabel={t("Crear")} />
    </main>
  );
}
