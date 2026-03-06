export interface MovieGenre {
  id: string;
  type: string;
}

export interface MovieDirector {
  id: string;
  name: string;
}

export interface MovieActor {
  id: string;
  name: string;
}

export interface MoviePrize {
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
  actors?: MovieActor[];
  prizes?: MoviePrize[];
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

export type PrincipalActorInput = {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

export type PrizeStatus = "won" | "nominated";

export type PrizeInput = {
  name: string;
  category: string;
  year: number;
  status: PrizeStatus;
};

export type MovieCreationWithAssociationsInput = {
  movie: MovieFormValues;
  principalActor: PrincipalActorInput;
  prize: PrizeInput;
};
