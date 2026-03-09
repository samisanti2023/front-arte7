"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import { getPrize, updatePrize } from "@/modules/prizes/api";
import { PrizeForm } from "@/modules/prizes/components/PrizeForm";
import { PrizeFormValues } from "@/modules/prizes/types";
import styles from "@/app/prizes/[id]/edit/edit.module.css";

export default function Page() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<PrizeFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID invalido.");
      setLoading(false);
      return;
    }

    const loadPrize = async () => {
      setLoading(true);
      setError(null);

      try {
        const prize = await getPrize(id);
        setInitialValues({
          name: prize.name,
          category: prize.category,
          year: prize.year,
          status: prize.status,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("No se pudo cargar el premio.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadPrize();
  }, [id]);

  const handleSubmit = async (values: PrizeFormValues) => {
    if (!id || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await updatePrize(id, values);
      router.push("/prizes");
    } catch {
      setError("No se pudo actualizar el premio.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <h1 className={styles.title}>{t("Editar premio")}</h1>
          <Link className={styles.backLink} href="/prizes">
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
        <h1 className={styles.title}>{t("Editar premio")}</h1>
        <Link className={styles.backLink} href="/prizes">
          {t("Volver")}
        </Link>
      </header>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      {initialValues ? (
        <PrizeForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitting ? t("Guardando...") : t("Guardar")}
        />
      ) : null}
    </main>
  );
}
