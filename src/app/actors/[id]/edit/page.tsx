"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getActor, updateActor } from "@/modules/actors/api";
import { ActorForm } from "@/modules/actors/components/ActorForm";
import { ActorFormValues } from "@/modules/actors/types";
import styles from "@/app/actors/[id]/edit/edit.module.css";

function toDateInputValue(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<ActorFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const actor = await getActor(id);
        setInitialValues({
          name: actor.name,
          photo: actor.photo,
          nationality: actor.nationality,
          birthDate: toDateInputValue(actor.birthDate),
          biography: actor.biography,
          movieIds: actor.movies?.map((movie) => movie.id) ?? [],
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("No se pudo cargar el actor.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadActor();
  }, [id]);

  const handleSubmit = async (values: ActorFormValues) => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateActor(id, values);
      router.push("/actors");
    } catch {
      setError("No se pudo actualizar el actor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>Editar actor</h1>
          <Link className={styles.backLink} href="/actors">
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
        <h1 className={styles.title}>Editar actor</h1>
        <Link className={styles.backLink} href="/actors">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {initialValues ? (
        <ActorForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitting ? "Guardando..." : "Guardar"}
        />
      ) : null}
    </main>
  );
}
