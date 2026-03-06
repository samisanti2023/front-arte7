export interface MovieGenre {
  id: string;
  type: string;
}

export interface MovieDirector {
  id: string;
  name: string;
}

export interface MovieYoutubeTrailer {
  id: string;
  name: string;
  url: string;
  duration: number;
  channel: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  genre?: MovieGenre;
  director?: MovieDirector;
  youtubeTrailer?: MovieYoutubeTrailer;
}

export type MovieFormValues = {
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
};
