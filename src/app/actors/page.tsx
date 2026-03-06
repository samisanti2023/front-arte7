"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteActor, getActors } from "@/modules/actors/api";
import { ActorList } from "@/modules/actors/components/ActorList";
import { Actor } from "@/modules/actors/types";
import styles from "@/app/actors/actors.module.css";

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActors = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getActors();
      setActors(data);
    } catch {
      setError("No se pudo cargar la lista de actores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActors();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteActor(id);
      await loadActors();
    } catch {
      setError("No se pudo eliminar el actor.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Actores</h1>
          
        </div>
        <Link className={styles.createLink} href="/actors/new">
          Crear actor
        </Link>
      </header>

      {loading ? <p className={styles.status}>Cargando...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <ActorList actors={actors} onDelete={onDelete} />
    </main>
  );
}
