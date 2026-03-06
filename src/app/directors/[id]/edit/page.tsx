"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getDirector, updateDirector } from "@/modules/directors/api";
import { DirectorForm } from "@/modules/directors/components/DirectorForm";
import { DirectorFormValues } from "@/modules/directors/types";
import styles from "@/app/directors/[id]/edit/edit.module.css";

function toDateInputValue(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<DirectorFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const director = await getDirector(id);
        setInitialValues({
          name: director.name,
          photo: director.photo,
          nationality: director.nationality,
          birthDate: toDateInputValue(director.birthDate),
          biography: director.biography,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("No se pudo cargar el director.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDirector();
  }, [id]);

  const handleSubmit = async (values: DirectorFormValues) => {
    if (!id || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateDirector(id, values);
      router.push("/directors");
    } catch {
      setError("No se pudo actualizar el director.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Editar director</h1>
          <Link className={styles.backLink} href="/directors">
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
        <h1 className={styles.title}>Editar director</h1>
        <Link className={styles.backLink} href="/directors">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {initialValues ? (
        <DirectorForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitting ? "Guardando..." : "Guardar"}
        />
      ) : null}
    </main>
  );
}
