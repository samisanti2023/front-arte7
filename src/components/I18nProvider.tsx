"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Locale = "es" | "en";

const STORAGE_KEY = "front-arte7-locale";

const MESSAGES: Record<string, { es: string; en: string }> = {
  mainNavigation: {
    es: "Navegacion principal",
    en: "Main navigation",
  },
  actors: {
    es: "Actores",
    en: "Actors",
  },
  movies: {
    es: "Peliculas",
    en: "Movies",
  },
  genres: {
    es: "Generos",
    en: "Genres",
  },
  directors: {
    es: "Directores",
    en: "Directors",
  },
  prizes: {
    es: "Premios",
    en: "Prizes",
  },
  language: {
    es: "Idioma",
    en: "Language",
  },
  spanish: {
    es: "Espanol",
    en: "Spanish",
  },
  english: {
    es: "Ingles",
    en: "English",
  },
  "Editar": { es: "Editar", en: "Edit" },
  "Eliminar": { es: "Eliminar", en: "Delete" },
  "Volver": { es: "Volver", en: "Back" },
  "Crear": { es: "Crear", en: "Create" },
  "Guardar": { es: "Guardar", en: "Save" },
  "Guardando...": { es: "Guardando...", en: "Saving..." },
  "Cargando...": { es: "Cargando...", en: "Loading..." },
  "ID invalido.": { es: "ID invalido.", en: "Invalid ID." },
  "Informacion general": { es: "Informacion general", en: "General information" },
  "Nombre": { es: "Nombre", en: "Name" },
  "Foto": { es: "Foto", en: "Photo" },
  "Nacionalidad": { es: "Nacionalidad", en: "Nationality" },
  "Fecha de nacimiento": { es: "Fecha de nacimiento", en: "Birth date" },
  "Biografia": { es: "Biografia", en: "Biography" },
  "Categoria": { es: "Categoria", en: "Category" },
  "Anio": { es: "Anio", en: "Year" },
  "Estado": { es: "Estado", en: "Status" },
  "Genero": { es: "Genero", en: "Genre" },
  "Director": { es: "Director", en: "Director" },
  "Peliculas": { es: "Peliculas", en: "Movies" },
  "Actores": { es: "Actores", en: "Actors" },
  "Premios": { es: "Premios", en: "Prizes" },
  "Directores": { es: "Directores", en: "Directors" },
  "Generos": { es: "Generos", en: "Genres" },
  "No hay actores para mostrar.": { es: "No hay actores para mostrar.", en: "No actors to display." },
  "No hay directores para mostrar.": {
    es: "No hay directores para mostrar.",
    en: "No directors to display.",
  },
  "No hay premios para mostrar.": { es: "No hay premios para mostrar.", en: "No prizes to display." },
  "No hay generos para mostrar.": { es: "No hay generos para mostrar.", en: "No genres to display." },
  "No hay movies para mostrar.": { es: "No hay movies para mostrar.", en: "No movies to display." },
  "Vista previa del actor": { es: "Vista previa del actor", en: "Actor preview" },
  "Vista previa del director": { es: "Vista previa del director", en: "Director preview" },
  "Vista previa de la movie": { es: "Vista previa de la movie", en: "Movie preview" },
  "Foto de": { es: "Foto de", en: "Photo of" },
  "Poster de": { es: "Poster de", en: "Poster of" },
  "Imagen de": { es: "Imagen de", en: "Image of" },
  "Peliculas asociadas": { es: "Peliculas asociadas", en: "Associated movies" },
  "Cargando peliculas...": { es: "Cargando peliculas...", en: "Loading movies..." },
  "No se pudo cargar la lista de peliculas.": {
    es: "No se pudo cargar la lista de peliculas.",
    en: "Could not load the movies list.",
  },
  "No se pudo cargar la lista de actores.": {
    es: "No se pudo cargar la lista de actores.",
    en: "Could not load the actors list.",
  },
  "No se pudo eliminar el actor.": {
    es: "No se pudo eliminar el actor.",
    en: "Could not delete the actor.",
  },
  "Crear actor": { es: "Crear actor", en: "Create actor" },
  "No se pudo crear el actor.": { es: "No se pudo crear el actor.", en: "Could not create the actor." },
  "Editar actor": { es: "Editar actor", en: "Edit actor" },
  "No se pudo cargar el actor.": { es: "No se pudo cargar el actor.", en: "Could not load the actor." },
  "No se pudo actualizar el actor.": {
    es: "No se pudo actualizar el actor.",
    en: "Could not update the actor.",
  },
  "Detalle actor": { es: "Detalle actor", en: "Actor detail" },
  "No se pudo cargar el detalle del actor.": {
    es: "No se pudo cargar el detalle del actor.",
    en: "Could not load actor detail.",
  },
  "Nombre:": { es: "Nombre:", en: "Name:" },
  "Nacionalidad:": { es: "Nacionalidad:", en: "Nationality:" },
  "Nacimiento:": { es: "Nacimiento:", en: "Birth date:" },
  "No se pudo cargar la lista de directores.": {
    es: "No se pudo cargar la lista de directores.",
    en: "Could not load the directors list.",
  },
  "No se pudo eliminar el director.": {
    es: "No se pudo eliminar el director.",
    en: "Could not delete the director.",
  },
  "Crear director": { es: "Crear director", en: "Create director" },
  "No se pudo crear el director.": {
    es: "No se pudo crear el director.",
    en: "Could not create the director.",
  },
  "Editar director": { es: "Editar director", en: "Edit director" },
  "No se pudo cargar el director.": { es: "No se pudo cargar el director.", en: "Could not load the director." },
  "No se pudo actualizar el director.": {
    es: "No se pudo actualizar el director.",
    en: "Could not update the director.",
  },
  "Detalle director": { es: "Detalle director", en: "Director detail" },
  "No se pudo cargar el detalle del director.": {
    es: "No se pudo cargar el detalle del director.",
    en: "Could not load director detail.",
  },
  "No se pudo cargar la lista de movies.": {
    es: "No se pudo cargar la lista de movies.",
    en: "Could not load the movies list.",
  },
  "No se pudo eliminar la movie.": { es: "No se pudo eliminar la movie.", en: "Could not delete the movie." },
  "Crear movie": { es: "Crear movie", en: "Create movie" },
  "No se pudo crear la movie.": { es: "No se pudo crear la movie.", en: "Could not create the movie." },
  "Editar movie": { es: "Editar movie", en: "Edit movie" },
  "No se pudo cargar la movie.": { es: "No se pudo cargar la movie.", en: "Could not load the movie." },
  "No se pudo actualizar la movie.": {
    es: "No se pudo actualizar la movie.",
    en: "Could not update the movie.",
  },
  "Detalle movie": { es: "Detalle movie", en: "Movie detail" },
  "No se pudo cargar el detalle de la movie.": {
    es: "No se pudo cargar el detalle de la movie.",
    en: "Could not load movie detail.",
  },
  "Datos requeridos de la movie": { es: "Datos requeridos de la movie", en: "Required movie data" },
  "Selecciona un genero": { es: "Selecciona un genero", en: "Select a genre" },
  "Selecciona un director": { es: "Selecciona un director", en: "Select a director" },
  "Nombre del trailer": { es: "Nombre del trailer", en: "Trailer name" },
  "URL del trailer": { es: "URL del trailer", en: "Trailer URL" },
  "Duracion trailer (min)": { es: "Duracion trailer (min)", en: "Trailer duration (min)" },
  "Canal del trailer": { es: "Canal del trailer", en: "Trailer channel" },
  "Actor principal": { es: "Actor principal", en: "Lead actor" },
  "Foto (URL)": { es: "Foto (URL)", en: "Photo (URL)" },
  "Premio para la pelicula": { es: "Premio para la pelicula", en: "Prize for the movie" },
  "Nombre del premio": { es: "Nombre del premio", en: "Prize name" },
  "Selecciona estado": { es: "Selecciona estado", en: "Select status" },
  "No se pudieron cargar genero y director.": {
    es: "No se pudieron cargar genero y director.",
    en: "Could not load genre and director.",
  },
  "Aun se estan cargando genero y director.": {
    es: "Aun se estan cargando genero y director.",
    en: "Genre and director are still loading.",
  },
  "Completa todos los campos requeridos.": {
    es: "Completa todos los campos requeridos.",
    en: "Complete all required fields.",
  },
  "La URL del trailer debe ser valida.": {
    es: "La URL del trailer debe ser valida.",
    en: "Trailer URL must be valid.",
  },
  "La duracion del trailer debe ser un numero mayor a 0.": {
    es: "La duracion del trailer debe ser un numero mayor a 0.",
    en: "Trailer duration must be a number greater than 0.",
  },
  "La foto del actor principal debe ser una URL valida.": {
    es: "La foto del actor principal debe ser una URL valida.",
    en: "Lead actor photo must be a valid URL.",
  },
  "La fecha del actor principal debe tener formato YYYY-MM-DD.": {
    es: "La fecha del actor principal debe tener formato YYYY-MM-DD.",
    en: "Lead actor date must have YYYY-MM-DD format.",
  },
  "La biografia del actor principal debe tener al menos 10 caracteres.": {
    es: "La biografia del actor principal debe tener al menos 10 caracteres.",
    en: "Lead actor biography must have at least 10 characters.",
  },
  "El anio del premio debe ser un numero valido.": {
    es: "El anio del premio debe ser un numero valido.",
    en: "Prize year must be a valid number.",
  },
  "Fecha lanzamiento:": { es: "Fecha lanzamiento:", en: "Release date:" },
  "Actor:": { es: "Actor:", en: "Actor:" },
  "Premio:": { es: "Premio:", en: "Prize:" },
  "Sin actor": { es: "Sin actor", en: "No actor" },
  "Sin premio": { es: "Sin premio", en: "No prize" },
  "N/A": { es: "N/D", en: "N/A" },
  "ID:": { es: "ID:", en: "ID:" },
  "Titulo:": { es: "Titulo:", en: "Title:" },
  "Poster:": { es: "Poster:", en: "Poster:" },
  "Pais:": { es: "Pais:", en: "Country:" },
  "Estreno:": { es: "Estreno:", en: "Release:" },
  "Duracion:": { es: "Duracion:", en: "Duration:" },
  "Popularidad:": { es: "Popularidad:", en: "Popularity:" },
  "Genero:": { es: "Genero:", en: "Genre:" },
  "Director:": { es: "Director:", en: "Director:" },
  "Trailer:": { es: "Trailer:", en: "Trailer:" },
  "No tiene actores asociados.": {
    es: "No tiene actores asociados.",
    en: "It has no associated actors.",
  },
  "No tiene premios asociados.": {
    es: "No tiene premios asociados.",
    en: "It has no associated prizes.",
  },
  "URL trailer:": { es: "URL trailer:", en: "Trailer URL:" },
  "Canal trailer:": { es: "Canal trailer:", en: "Trailer channel:" },
  "Duracion trailer:": { es: "Duracion trailer:", en: "Trailer duration:" },
  "No se pudo cargar la lista de premios.": {
    es: "No se pudo cargar la lista de premios.",
    en: "Could not load the prizes list.",
  },
  "No se pudo eliminar el premio.": {
    es: "No se pudo eliminar el premio.",
    en: "Could not delete the prize.",
  },
  "Crear premio": { es: "Crear premio", en: "Create prize" },
  "No se pudo crear el premio.": { es: "No se pudo crear el premio.", en: "Could not create the prize." },
  "Editar premio": { es: "Editar premio", en: "Edit prize" },
  "No se pudo cargar el premio.": { es: "No se pudo cargar el premio.", en: "Could not load the prize." },
  "No se pudo actualizar el premio.": {
    es: "No se pudo actualizar el premio.",
    en: "Could not update the prize.",
  },
  "Detalle premio": { es: "Detalle premio", en: "Prize detail" },
  "No se pudo cargar el detalle del premio.": {
    es: "No se pudo cargar el detalle del premio.",
    en: "Could not load prize detail.",
  },
  "Categoria:": { es: "Categoria:", en: "Category:" },
  "Anio:": { es: "Anio:", en: "Year:" },
  "Estado:": { es: "Estado:", en: "Status:" },
  "No se pudo cargar la lista de generos.": {
    es: "No se pudo cargar la lista de generos.",
    en: "Could not load the genres list.",
  },
  "No se pudo eliminar el genero.": {
    es: "No se pudo eliminar el genero.",
    en: "Could not delete the genre.",
  },
  "Crear genero": { es: "Crear genero", en: "Create genre" },
  "No se pudo crear el genero.": { es: "No se pudo crear el genero.", en: "Could not create the genre." },
  "Editar genero": { es: "Editar genero", en: "Edit genre" },
  "No se pudo cargar el genero.": { es: "No se pudo cargar el genero.", en: "Could not load the genre." },
  "No se pudo actualizar el genero.": {
    es: "No se pudo actualizar el genero.",
    en: "Could not update the genre.",
  },
  "Detalle genero": { es: "Detalle genero", en: "Genre detail" },
  "No se pudo cargar el detalle del genero.": {
    es: "No se pudo cargar el detalle del genero.",
    en: "Could not load genre detail.",
  },
  "Tipo": { es: "Tipo", en: "Type" },
  "Tipo:": { es: "Tipo:", en: "Type:" },
  "Peliculas:": { es: "Peliculas:", en: "Movies:" },
  "No tiene peliculas asociadas.": {
    es: "No tiene peliculas asociadas.",
    en: "It has no associated movies.",
  },
  "Titulo": { es: "Titulo", en: "Title" },
  "Poster": { es: "Poster", en: "Poster" },
  "Duracion (min)": { es: "Duracion (min)", en: "Duration (min)" },
  "Pais": { es: "Pais", en: "Country" },
  "Fecha de estreno": { es: "Fecha de estreno", en: "Release date" },
  "Popularidad (1-5)": { es: "Popularidad (1-5)", en: "Popularity (1-5)" },
  "Nombre requerido": { es: "Nombre requerido", en: "Name required" },
  "La foto debe ser una URL valida": { es: "La foto debe ser una URL valida", en: "Photo must be a valid URL" },
  "Nacionalidad requerida": { es: "Nacionalidad requerida", en: "Nationality required" },
  "Fecha requerida": { es: "Fecha requerida", en: "Date required" },
  "Formato esperado YYYY-MM-DD": { es: "Formato esperado YYYY-MM-DD", en: "Expected format YYYY-MM-DD" },
  "Biografia requerida": { es: "Biografia requerida", en: "Biography required" },
  "Debes asociar al menos una pelicula": {
    es: "Debes asociar al menos una pelicula",
    en: "You must associate at least one movie",
  },
  "Titulo requerido": { es: "Titulo requerido", en: "Title required" },
  "Poster invalido": { es: "Poster invalido", en: "Invalid poster" },
  "Duracion requerida": { es: "Duracion requerida", en: "Duration required" },
  "Pais requerido": { es: "Pais requerido", en: "Country required" },
  "Popularidad minima 1": { es: "Popularidad minima 1", en: "Minimum popularity is 1" },
  "Popularidad maxima 5": { es: "Popularidad maxima 5", en: "Maximum popularity is 5" },
  "Categoria requerida": { es: "Categoria requerida", en: "Category required" },
  "Anio invalido": { es: "Anio invalido", en: "Invalid year" },
  "Tipo requerido": { es: "Tipo requerido", en: "Type required" },
  nominated: { es: "nominado", en: "nominated" },
  won: { es: "ganado", en: "won" },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "es";
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isLocale(saved)) {
      return saved;
    }

    const browserLocale = window.navigator.language.toLowerCase();
    return browserLocale.startsWith("en") ? "en" : "es";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => MESSAGES[key]?.[locale] ?? key,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de I18nProvider");
  }

  return ctx;
}
