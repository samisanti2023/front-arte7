"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import { getGenre, updateGenre } from "@/modules/genres/api";
import { GenreForm } from "@/modules/genres/components/GenreForm";
import { GenreFormValues } from "@/modules/genres/types";
import styles from "@/app/genres/[id]/edit/edit.module.css";

export default function Page() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<GenreFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const genre = await getGenre(id);
        setInitialValues({
          type: genre.type,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("No se pudo cargar el genero.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadGenre();
  }, [id]);

  const handleSubmit = async (values: GenreFormValues) => {
    if (!id || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateGenre(id, values);
      router.push("/genres");
    } catch {
      setError("No se pudo actualizar el genero.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>{t("Editar genero")}</h1>
          <Link className={styles.backLink} href="/genres">
            {t("Volver")}
          </Link>
        </header>
        <p className={styles.status}>{t("Cargando...")}</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>{t("Editar genero")}</h1>
        <Link className={styles.backLink} href="/genres">
          {t("Volver")}
        </Link>
      </header>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      {initialValues ? (
        <GenreForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitting ? t("Guardando...") : t("Guardar")}
        />
      ) : null}
    </main>
  );
}
