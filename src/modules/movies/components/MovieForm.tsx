"use client";

import { FormEvent, useState } from "react";

import { movieFormSchema } from "@/modules/movies/schemas";
import { MovieFormValues } from "@/modules/movies/types";
import styles from "@/modules/movies/components/MovieForm.module.css";

type MovieFormProps = {
  initialValues?: MovieFormValues;
  onSubmit: (values: MovieFormValues) => Promise<void> | void;
  submitLabel: string;
};

type FieldErrors = Partial<Record<keyof MovieFormValues, string>>;

export function MovieForm({ initialValues, onSubmit, submitLabel }: MovieFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [poster, setPoster] = useState(initialValues?.poster ?? "");
  const [duration, setDuration] = useState(
    initialValues?.duration !== undefined ? String(initialValues.duration) : "",
  );
  const [country, setCountry] = useState(initialValues?.country ?? "");
  const [releaseDate, setReleaseDate] = useState(initialValues?.releaseDate ?? "");
  const [popularity, setPopularity] = useState(
    initialValues?.popularity !== undefined ? String(initialValues.popularity) : "",
  );
  const fallbackPreview = "https://picsum.photos/seed/movie-form-preview/800/450";
  const [previewFailed, setPreviewFailed] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const previewCandidate = poster.trim() || fallbackPreview;
  const previewSrc = previewFailed ? fallbackPreview : previewCandidate;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = movieFormSchema.safeParse({
      title,
      poster,
      duration,
      country,
      releaseDate,
      popularity,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        poster: fieldErrors.poster?.[0],
        duration: fieldErrors.duration?.[0],
        country: fieldErrors.country?.[0],
        releaseDate: fieldErrors.releaseDate?.[0],
        popularity: fieldErrors.popularity?.[0],
      });
      return;
    }

    setErrors({});
    await onSubmit(result.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.preview}>
        <img
          className={styles.previewImage}
          src={previewSrc}
          alt="Vista previa de la movie"
          onError={() => setPreviewFailed(true)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Titulo
        </label>
        <input
          className={styles.input}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title ? <p className={styles.error}>{errors.title}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="poster">
          Poster
        </label>
        <input
          className={styles.input}
          id="poster"
          type="url"
          value={poster}
          onChange={(e) => {
            setPoster(e.target.value);
            setPreviewFailed(false);
          }}
        />
        {errors.poster ? <p className={styles.error}>{errors.poster}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="duration">
          Duracion (min)
        </label>
        <input
          className={styles.input}
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        {errors.duration ? <p className={styles.error}>{errors.duration}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="country">
          Pais
        </label>
        <input
          className={styles.input}
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        {errors.country ? <p className={styles.error}>{errors.country}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="releaseDate">
          Fecha de estreno
        </label>
        <input
          className={styles.input}
          id="releaseDate"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        {errors.releaseDate ? <p className={styles.error}>{errors.releaseDate}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="popularity">
          Popularidad (1-5)
        </label>
        <input
          className={styles.input}
          id="popularity"
          type="number"
          min={1}
          max={5}
          step={1}
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
        />
        {errors.popularity ? <p className={styles.error}>{errors.popularity}</p> : null}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
