"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createActor } from "@/modules/actors/api";
import { ActorForm } from "@/modules/actors/components/ActorForm";
import { ActorFormValues } from "@/modules/actors/types";
import styles from "@/app/actors/new/new.module.css";

export default function NewActorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ActorFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await createActor(values);
      router.push("/actors");
    } catch {
      setError("No se pudo crear el actor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Crear actor</h1>
        <Link className={styles.backLink} href="/actors">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.status}>Guardando...</p> : null}
      <ActorForm onSubmit={handleSubmit} submitLabel="Crear" />
    </main>
  );
}
