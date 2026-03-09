export interface GenreMovieRef {
  id: string;
  title: string;
}

export interface Genre {
  id: string;
  type: string;
  movies?: GenreMovieRef[];
}

export type GenreFormValues = {
  type: string;
};
