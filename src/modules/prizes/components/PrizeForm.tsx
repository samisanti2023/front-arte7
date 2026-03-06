"use client";

import { FormEvent, useState } from "react";

import { prizeFormSchema } from "@/modules/prizes/schemas";
import { PrizeFormValues, PrizeStatus } from "@/modules/prizes/types";
import styles from "@/modules/prizes/components/PrizeForm.module.css";

type PrizeFormProps = {
  initialValues?: PrizeFormValues;
  onSubmit: (values: PrizeFormValues) => Promise<void> | void;
  submitLabel: string;
};

type FieldErrors = Partial<Record<keyof PrizeFormValues, string>>;

export function PrizeForm({ initialValues, onSubmit, submitLabel }: PrizeFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [year, setYear] = useState(initialValues?.year !== undefined ? String(initialValues.year) : "");
  const [status, setStatus] = useState<PrizeStatus>(initialValues?.status ?? "nominated");
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = prizeFormSchema.safeParse({ name, category, year, status });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        category: fieldErrors.category?.[0],
        year: fieldErrors.year?.[0],
        status: fieldErrors.status?.[0],
      });
      return;
    }

    setErrors({});
    await onSubmit(result.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Nombre
        </label>
        <input className={styles.input} id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">
          Categoria
        </label>
        <input
          className={styles.input}
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {errors.category ? <p className={styles.error}>{errors.category}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="year">
          Anio
        </label>
        <input className={styles.input} id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        {errors.year ? <p className={styles.error}>{errors.year}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="status">
          Estado
        </label>
        <select
          className={styles.input}
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PrizeStatus)}
        >
          <option value="nominated">nominated</option>
          <option value="won">won</option>
        </select>
        {errors.status ? <p className={styles.error}>{errors.status}</p> : null}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
