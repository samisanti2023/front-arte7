export interface DirectorMovie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
}

export interface Director {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies: DirectorMovie[];
}

export type DirectorFormValues = {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};
