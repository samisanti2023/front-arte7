"use client";

import { FormEvent, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import { genreFormSchema } from "@/modules/genres/schemas";
import { GenreFormValues } from "@/modules/genres/types";
import styles from "@/modules/genres/components/GenreForm.module.css";

type GenreFormProps = {
  initialValues?: GenreFormValues;
  onSubmit: (values: GenreFormValues) => Promise<void> | void;
  submitLabel: string;
};

type FieldErrors = Partial<Record<keyof GenreFormValues, string>>;

export function GenreForm({ initialValues, onSubmit, submitLabel }: GenreFormProps) {
  const { t } = useI18n();
  const [type, setType] = useState(initialValues?.type ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = genreFormSchema.safeParse({ type });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        type: fieldErrors.type?.[0],
      });
      return;
    }

    setErrors({});
    await onSubmit(result.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="type">
          {t("Tipo")}
        </label>
        <input className={styles.input} id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} />
        {errors.type ? <p className={styles.error}>{t(errors.type)}</p> : null}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
