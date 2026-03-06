export type PrizeStatus = "won" | "nominated";

export interface PrizeActorRef {
  id: string;
  name: string;
}

export interface PrizeMovieRef {
  id: string;
  title: string;
}

export interface PrizeDirectorRef {
  id: string;
  name: string;
}

export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: PrizeStatus;
  actors?: PrizeActorRef[];
  movies?: PrizeMovieRef[];
  directors?: PrizeDirectorRef[];
}

export type PrizeFormValues = {
  name: string;
  category: string;
  year: number;
  status: PrizeStatus;
};
