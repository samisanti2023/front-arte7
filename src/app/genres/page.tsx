"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import { deleteGenre, getGenres } from "@/modules/genres/api";
import { GenreList } from "@/modules/genres/components/GenreList";
import { Genre } from "@/modules/genres/types";
import styles from "@/app/genres/genres.module.css";

export default function GenresPage() {
  const { t } = useI18n();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGenres = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGenres();
      setGenres(data);
    } catch {
      setError("No se pudo cargar la lista de generos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGenres();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteGenre(id);
      await loadGenres();
    } catch {
      setError("No se pudo eliminar el genero.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>{t("Generos")}</h1>
        </div>
        <Link className={styles.createLink} href="/genres/new">
          {t("Crear genero")}
        </Link>
      </header>

      {loading ? <p className={styles.status}>{t("Cargando...")}</p> : null}
      {error ? <p className={styles.error}>{t(error)}</p> : null}

      <GenreList genres={genres} onDelete={onDelete} />
    </main>
  );
}
