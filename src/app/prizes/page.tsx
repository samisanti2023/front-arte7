"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deletePrize, getPrizes } from "@/modules/prizes/api";
import { PrizeList } from "@/modules/prizes/components/PrizeList";
import { Prize } from "@/modules/prizes/types";
import styles from "@/app/prizes/prizes.module.css";

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrizes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPrizes();
      setPrizes(data);
    } catch {
      setError("No se pudo cargar la lista de premios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPrizes();
  }, []);

  const onDelete = async (id: string) => {
    try {
      await deletePrize(id);
      await loadPrizes();
    } catch {
      setError("No se pudo eliminar el premio.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Premios</h1>
        </div>
        <Link className={styles.createLink} href="/prizes/new">
          Crear premio
        </Link>
      </header>

      {loading ? <p className={styles.status}>Cargando...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <PrizeList prizes={prizes} onDelete={onDelete} />
    </main>
  );
}
