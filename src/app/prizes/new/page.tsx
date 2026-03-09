"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import { createPrize } from "@/modules/prizes/api";
import { PrizeForm } from "@/modules/prizes/components/PrizeForm";
import { PrizeFormValues } from "@/modules/prizes/types";
import styles from "@/app/prizes/new/new.module.css";

export default function NewPrizePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: PrizeFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await createPrize(values);
      router.push("/prizes");
    } catch {
      setError("No se pudo crear el premio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>{t("Crear premio")}</h1>
        <Link className={styles.backLink} href="/prizes">
          {t("Volver")}
        </Link>
      </header>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      {loading ? <p className={styles.status}>{t("Guardando...")}</p> : null}
      <PrizeForm onSubmit={handleSubmit} submitLabel={t("Crear")} />
    </main>
  );
}
