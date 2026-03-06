"use client";

import { FormEvent, useState } from "react";

import { directorFormSchema } from "@/modules/directors/schemas";
import { DirectorFormValues } from "@/modules/directors/types";
import styles from "@/modules/directors/components/DirectorForm.module.css";

type DirectorFormProps = {
  initialValues?: DirectorFormValues;
  onSubmit: (values: DirectorFormValues) => Promise<void> | void;
  submitLabel: string;
};

type FieldErrors = Partial<Record<keyof DirectorFormValues, string>>;

export function DirectorForm({ initialValues, onSubmit, submitLabel }: DirectorFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [photo, setPhoto] = useState(initialValues?.photo ?? "");
  const [nationality, setNationality] = useState(initialValues?.nationality ?? "");
  const [birthDate, setBirthDate] = useState(initialValues?.birthDate ?? "");
  const [biography, setBiography] = useState(initialValues?.biography ?? "");
  const fallbackPreview = "https://picsum.photos/seed/director-form-preview/800/450";
  const [previewFailed, setPreviewFailed] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const previewCandidate = photo.trim() || fallbackPreview;
  const previewSrc = previewFailed ? fallbackPreview : previewCandidate;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = directorFormSchema.safeParse({ name, photo, nationality, birthDate, biography });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        photo: fieldErrors.photo?.[0],
        nationality: fieldErrors.nationality?.[0],
        birthDate: fieldErrors.birthDate?.[0],
        biography: fieldErrors.biography?.[0],
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
          alt="Vista previa del director"
          onError={() => setPreviewFailed(true)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Nombre
        </label>
        <input
          className={styles.input}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="photo">
          Foto
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
        {errors.photo ? <p className={styles.error}>{errors.photo}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="nationality">
          Nacionalidad
        </label>
        <input
          className={styles.input}
          id="nationality"
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
        {errors.nationality ? <p className={styles.error}>{errors.nationality}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="birthDate">
          Fecha de nacimiento
        </label>
        <input
          className={styles.input}
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        {errors.birthDate ? <p className={styles.error}>{errors.birthDate}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="biography">
          Biografia
        </label>
        <textarea
          className={styles.textarea}
          id="biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
        {errors.biography ? <p className={styles.error}>{errors.biography}</p> : null}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
