"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/I18nProvider";
import {
  createMovieWithAssociations,
  getMovieDirectors,
  getMovieGenres,
} from "@/modules/movies/api";
import { MovieForm } from "@/modules/movies/components/MovieForm";
import { MovieDirector, MovieFormValues, MovieGenre, PrizeStatus } from "@/modules/movies/types";
import styles from "@/app/movies/new/new.module.css";

export default function NewMoviePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [directors, setDirectors] = useState<MovieDirector[]>([]);
  const [genreId, setGenreId] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [trailerName, setTrailerName] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [trailerDuration, setTrailerDuration] = useState("");
  const [trailerChannel, setTrailerChannel] = useState("");
  const [actorName, setActorName] = useState("");
  const [actorPhoto, setActorPhoto] = useState("");
  const [actorNationality, setActorNationality] = useState("");
  const [actorBirthDate, setActorBirthDate] = useState("");
  const [actorBiography, setActorBiography] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeCategory, setPrizeCategory] = useState("");
  const [prizeYear, setPrizeYear] = useState("");
  const [prizeStatus, setPrizeStatus] = useState<PrizeStatus | "">("");

  useEffect(() => {
    let ignore = false;

    const loadOptions = async () => {
      setOptionsLoading(true);
      setError(null);

      try {
        const [genresData, directorsData] = await Promise.all([getMovieGenres(), getMovieDirectors()]);

        if (ignore) return;
        setGenres(genresData);
        setDirectors(directorsData);
      } catch {
        if (ignore) return;
        setError("No se pudieron cargar genero y director.");
      } finally {
        if (!ignore) {
          setOptionsLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (values: MovieFormValues) => {
    if (loading) return;
    if (optionsLoading) {
      setError("Aun se estan cargando genero y director.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trimmedGenreId = genreId.trim();
      const trimmedDirectorId = directorId.trim();
      const trimmedTrailerName = trailerName.trim();
      const trimmedTrailerUrl = trailerUrl.trim();
      const trimmedTrailerChannel = trailerChannel.trim();
      const parsedTrailerDuration = Number(trailerDuration);
      const trimmedActorName = actorName.trim();
      const trimmedActorPhoto = actorPhoto.trim();
      const trimmedActorNationality = actorNationality.trim();
      const trimmedActorBirthDate = actorBirthDate.trim();
      const trimmedActorBiography = actorBiography.trim();
      const trimmedPrizeName = prizeName.trim();
      const trimmedPrizeCategory = prizeCategory.trim();
      const parsedYear = Number(prizeYear);

      const isTrailerUrl = /^https?:\/\/.+/i.test(trimmedTrailerUrl);
      const isTrailerDurationValid = Number.isInteger(parsedTrailerDuration) && parsedTrailerDuration > 0;
      const isActorPhotoUrl = /^https?:\/\/.+/i.test(trimmedActorPhoto);
      const isActorBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(trimmedActorBirthDate);
      const isPrizeYearValid = Number.isInteger(parsedYear) && parsedYear >= 1900;

      if (
        !trimmedGenreId ||
        !trimmedDirectorId ||
        !trimmedTrailerName ||
        !trimmedTrailerUrl ||
        !trailerDuration.trim() ||
        !trimmedTrailerChannel ||
        !trimmedActorName ||
        !trimmedActorPhoto ||
        !trimmedActorNationality ||
        !trimmedActorBirthDate ||
        !trimmedActorBiography ||
        !trimmedPrizeName ||
        !trimmedPrizeCategory ||
        !prizeYear.trim() ||
        !prizeStatus
      ) {
        setError("Completa todos los campos requeridos.");
        setLoading(false);
        return;
      }

      if (!isTrailerUrl) {
        setError("La URL del trailer debe ser valida.");
        setLoading(false);
        return;
      }

      if (!isTrailerDurationValid) {
        setError("La duracion del trailer debe ser un numero mayor a 0.");
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
          status: prizeStatus as PrizeStatus,
        },
        relations: {
          genreId: trimmedGenreId,
          directorId: trimmedDirectorId,
        },
        youtubeTrailer: {
          name: trimmedTrailerName,
          url: trimmedTrailerUrl,
          duration: parsedTrailerDuration,
          channel: trimmedTrailerChannel,
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
        <h1 className={styles.title}>{t("Crear movie")}</h1>
        <Link className={styles.backLink} href="/movies">
          {t("Volver")}
        </Link>
      </header>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      {loading ? <p className={styles.status}>{t("Guardando...")}</p> : null}
      {optionsLoading ? <p className={styles.status}>{t("Cargando genero y director...")}</p> : null}

      <section className={styles.extraSection}>
        <h2 className={styles.sectionTitle}>{t("Datos requeridos de la movie")}</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="genreId">
              {t("Genero")}
            </label>
            <select
              className={styles.input}
              id="genreId"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
            >
              <option value="">{t("Selecciona un genero")}</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.type}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="directorId">
              {t("Director")}
            </label>
            <select
              className={styles.input}
              id="directorId"
              value={directorId}
              onChange={(e) => setDirectorId(e.target.value)}
            >
              <option value="">{t("Selecciona un director")}</option>
              {directors.map((director) => (
                <option key={director.id} value={director.id}>
                  {director.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="trailerName">
              {t("Nombre del trailer")}
            </label>
            <input
              className={styles.input}
              id="trailerName"
              type="text"
              value={trailerName}
              onChange={(e) => setTrailerName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="trailerUrl">
              {t("URL del trailer")}
            </label>
            <input
              className={styles.input}
              id="trailerUrl"
              type="url"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="trailerDuration">
              {t("Duracion trailer (min)")}
            </label>
            <input
              className={styles.input}
              id="trailerDuration"
              type="number"
              min={1}
              value={trailerDuration}
              onChange={(e) => setTrailerDuration(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="trailerChannel">
              {t("Canal del trailer")}
            </label>
            <input
              className={styles.input}
              id="trailerChannel"
              type="text"
              value={trailerChannel}
              onChange={(e) => setTrailerChannel(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.extraSection}>
        <h2 className={styles.sectionTitle}>{t("Actor principal")}</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="actorName">
              {t("Nombre")}
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
              {t("Foto (URL)")}
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
              {t("Nacionalidad")}
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
              {t("Fecha de nacimiento")}
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
              {t("Biografia")}
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
        <h2 className={styles.sectionTitle}>{t("Premio para la pelicula")}</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="prizeName">
              {t("Nombre del premio")}
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
              {t("Categoria")}
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
              {t("Anio")}
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
              {t("Estado")}
            </label>
            <select
              className={styles.input}
              id="prizeStatus"
              value={prizeStatus}
              onChange={(e) => setPrizeStatus(e.target.value as PrizeStatus | "")}
            >
              <option value="">{t("Selecciona estado")}</option>
              <option value="nominated">{t("nominated")}</option>
              <option value="won">{t("won")}</option>
            </select>
          </div>
        </div>
      </section>

      <MovieForm onSubmit={handleSubmit} submitLabel={t("Crear")} />
    </main>
  );
}
