"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMovieWithAssociations } from "@/modules/movies/api";
import { MovieForm } from "@/modules/movies/components/MovieForm";
import { MovieFormValues, PrizeStatus } from "@/modules/movies/types";
import styles from "@/app/movies/new/new.module.css";

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actorName, setActorName] = useState("");
  const [actorPhoto, setActorPhoto] = useState("");
  const [actorNationality, setActorNationality] = useState("");
  const [actorBirthDate, setActorBirthDate] = useState("");
  const [actorBiography, setActorBiography] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeCategory, setPrizeCategory] = useState("");
  const [prizeYear, setPrizeYear] = useState("");
  const [prizeStatus, setPrizeStatus] = useState<PrizeStatus>("nominated");

  const handleSubmit = async (values: MovieFormValues) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const trimmedActorName = actorName.trim();
      const trimmedActorPhoto = actorPhoto.trim();
      const trimmedActorNationality = actorNationality.trim();
      const trimmedActorBirthDate = actorBirthDate.trim();
      const trimmedActorBiography = actorBiography.trim();
      const trimmedPrizeName = prizeName.trim();
      const trimmedPrizeCategory = prizeCategory.trim();
      const parsedYear = Number(prizeYear);

      const isActorPhotoUrl = /^https?:\/\/.+/i.test(trimmedActorPhoto);
      const isActorBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(trimmedActorBirthDate);
      const isPrizeYearValid = Number.isInteger(parsedYear) && parsedYear >= 1900;

      if (
        !trimmedActorName ||
        !trimmedActorPhoto ||
        !trimmedActorNationality ||
        !trimmedActorBirthDate ||
        !trimmedActorBiography ||
        !trimmedPrizeName ||
        !trimmedPrizeCategory ||
        !prizeYear.trim()
      ) {
        setError("Completa todos los campos de actor principal y premio.");
        setLoading(false);
        return;
      }

      if (!isActorPhotoUrl) {
        setError("La foto del actor principal debe ser una URL valida.");
        setLoading(false);
        return;
      }

      if (!isActorBirthDate) {
        setError("La fecha del actor principal debe tener formato YYYY-MM-DD.");
        setLoading(false);
        return;
      }

      if (trimmedActorBiography.length < 10) {
        setError("La biografia del actor principal debe tener al menos 10 caracteres.");
        setLoading(false);
        return;
      }

      if (!isPrizeYearValid) {
        setError("El anio del premio debe ser un numero valido.");
        setLoading(false);
        return;
      }

      await createMovieWithAssociations({
        movie: values,
        principalActor: {
          name: trimmedActorName,
          photo: trimmedActorPhoto,
          nationality: trimmedActorNationality,
          birthDate: trimmedActorBirthDate,
          biography: trimmedActorBiography,
        },
        prize: {
          name: trimmedPrizeName,
          category: trimmedPrizeCategory,
          year: parsedYear,
          status: prizeStatus,
        },
      });
      router.push("/movies");
    } catch {
      setError("No se pudo crear la movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Crear movie</h1>
        <Link className={styles.backLink} href="/movies">
          Volver
        </Link>
      </header>
      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.status}>Guardando...</p> : null}

      <section className={styles.extraSection}>
        <h2 className={styles.sectionTitle}>Actor principal</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="actorName">
              Nombre
            </label>
            <input
              className={styles.input}
              id="actorName"
              type="text"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="actorPhoto">
              Foto (URL)
            </label>
            <input
              className={styles.input}
              id="actorPhoto"
              type="url"
              value={actorPhoto}
              onChange={(e) => setActorPhoto(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="actorNationality">
              Nacionalidad
            </label>
            <input
              className={styles.input}
              id="actorNationality"
              type="text"
              value={actorNationality}
              onChange={(e) => setActorNationality(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="actorBirthDate">
              Fecha de nacimiento
            </label>
            <input
              className={styles.input}
              id="actorBirthDate"
              type="date"
              value={actorBirthDate}
              onChange={(e) => setActorBirthDate(e.target.value)}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label} htmlFor="actorBiography">
              Biografia
            </label>
            <textarea
              className={styles.textarea}
              id="actorBiography"
              value={actorBiography}
              onChange={(e) => setActorBiography(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.extraSection}>
        <h2 className={styles.sectionTitle}>Premio para la pelicula</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="prizeName">
              Nombre del premio
            </label>
            <input
              className={styles.input}
              id="prizeName"
              type="text"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="prizeCategory">
              Categoria
            </label>
            <input
              className={styles.input}
              id="prizeCategory"
              type="text"
              value={prizeCategory}
              onChange={(e) => setPrizeCategory(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="prizeYear">
              Anio
            </label>
            <input
              className={styles.input}
              id="prizeYear"
              type="number"
              value={prizeYear}
              onChange={(e) => setPrizeYear(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="prizeStatus">
              Estado
            </label>
            <select
              className={styles.input}
              id="prizeStatus"
              value={prizeStatus}
              onChange={(e) => setPrizeStatus(e.target.value as PrizeStatus)}
            >
              <option value="nominated">nominated</option>
              <option value="won">won</option>
            </select>
          </div>
        </div>
      </section>

      <MovieForm onSubmit={handleSubmit} submitLabel="Crear" />
    </main>
  );
}
