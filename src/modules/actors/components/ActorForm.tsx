"use client";

import { FormEvent, useEffect, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import { actorFormSchema } from "@/modules/actors/schemas";
import { ActorFormValues } from "@/modules/actors/types";
import { getMovies } from "@/modules/movies/api";
import { Movie } from "@/modules/movies/types";
import styles from "@/modules/actors/components/ActorForm.module.css";

type ActorFormProps = {
  initialValues?: ActorFormValues;
  onSubmit: (values: ActorFormValues) => Promise<void> | void;
  submitLabel: string;
};

type FieldErrors = Partial<Record<keyof ActorFormValues, string>>;

export function ActorForm({ initialValues, onSubmit, submitLabel }: ActorFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [photo, setPhoto] = useState(initialValues?.photo ?? "");
  const [nationality, setNationality] = useState(initialValues?.nationality ?? "");
  const [birthDate, setBirthDate] = useState(initialValues?.birthDate ?? "");
  const [biography, setBiography] = useState(initialValues?.biography ?? "");
  const [movieIds, setMovieIds] = useState<string[]>(initialValues?.movieIds ?? []);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const fallbackPreview = "https://picsum.photos/seed/form-preview/800/450";
  const [previewFailed, setPreviewFailed] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const previewCandidate = photo.trim() || fallbackPreview;
  const previewSrc = previewFailed ? fallbackPreview : previewCandidate;

  useEffect(() => {
    const loadMovies = async () => {
      setMoviesLoading(true);
      setMoviesError(null);

      try {
        const data = await getMovies();
        setMovies(data);
      } catch {
        setMoviesError("No se pudo cargar la lista de peliculas.");
      } finally {
        setMoviesLoading(false);
      }
    };

    void loadMovies();
  }, []);

  const toggleMovie = (id: string) => {
    setMovieIds((prev) => (prev.includes(id) ? prev.filter((movieId) => movieId !== id) : [...prev, id]));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = actorFormSchema.safeParse({ name, photo, nationality, birthDate, biography, movieIds });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        photo: fieldErrors.photo?.[0],
        nationality: fieldErrors.nationality?.[0],
        birthDate: fieldErrors.birthDate?.[0],
        biography: fieldErrors.biography?.[0],
        movieIds: fieldErrors.movieIds?.[0],
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
          alt={t("Vista previa del actor")}
          onError={() => setPreviewFailed(true)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          {t("Nombre")}
        </label>
        <input
          className={styles.input}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name ? <p className={styles.error}>{t(errors.name)}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="photo">
          {t("Foto")}
        </label>
        <input
          className={styles.input}
          id="photo"
          type="url"
          value={photo}
          onChange={(e) => {
            setPhoto(e.target.value);
            setPreviewFailed(false);
          }}
        />
        {errors.photo ? <p className={styles.error}>{t(errors.photo)}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="nationality">
          {t("Nacionalidad")}
        </label>
        <input
          className={styles.input}
          id="nationality"
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
        {errors.nationality ? <p className={styles.error}>{t(errors.nationality)}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="birthDate">
          {t("Fecha de nacimiento")}
        </label>
        <input
          className={styles.input}
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        {errors.birthDate ? <p className={styles.error}>{t(errors.birthDate)}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="biography">
          {t("Biografia")}
        </label>
        <textarea
          className={styles.textarea}
          id="biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
        {errors.biography ? <p className={styles.error}>{t(errors.biography)}</p> : null}
      </div>

      <div className={styles.field}>
        <p className={styles.label}>{t("Peliculas asociadas")}</p>

        {moviesLoading ? <p className={styles.movieHint}>{t("Cargando peliculas...")}</p> : null}
        {moviesError ? <p className={styles.error}>{t(moviesError)}</p> : null}

        {!moviesLoading && !moviesError ? (
          <div className={styles.movieGrid}>
            {movies.map((movie) => (
              <label className={styles.movieOption} key={movie.id}>
                <input
                  checked={movieIds.includes(movie.id)}
                  type="checkbox"
                  onChange={() => toggleMovie(movie.id)}
                />
                <span className={styles.movieLabel}>{movie.title}</span>
                <span className={styles.movieMeta}>({movie.country})</span>
              </label>
            ))}
          </div>
        ) : null}

        {errors.movieIds ? <p className={styles.error}>{t(errors.movieIds)}</p> : null}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
