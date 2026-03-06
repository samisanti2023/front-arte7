"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteDirector, getDirectors } from "@/modules/directors/api";
import { DirectorList } from "@/modules/directors/components/DirectorList";
import { Director } from "@/modules/directors/types";
import styles from "@/app/directors/directors.module.css";

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDirectors = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDirectors();
      setDirectors(data);
    } catch {
      setError("No se pudo cargar la lista de directores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDirectors();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteDirector(id);
      await loadDirectors();
    } catch {
      setError("No se pudo eliminar el director.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Directores</h1>
        </div>
        <Link className={styles.createLink} href="/directors/new">
          Crear director
        </Link>
      </header>

      {loading ? <p className={styles.status}>Cargando...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <DirectorList directors={directors} onDelete={onDelete} />
    </main>
  );
}
