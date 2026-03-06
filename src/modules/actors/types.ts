export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
}

export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies: Movie[];
}

export type ActorFormValues = {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movieIds: string[];
};
