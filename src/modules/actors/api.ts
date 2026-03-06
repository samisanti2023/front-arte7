import { Actor, ActorFormValues } from "@/modules/actors/types";

const API_URL = "http://localhost:3000/api/v1";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

function toIsoDate(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
}

function normalizeActorPayload(data: ActorFormValues) {
  const uniqueMovieIds = [...new Set(data.movieIds)];

  return {
    name: data.name,
    photo: data.photo,
    nationality: data.nationality,
    birthDate: toIsoDate(data.birthDate),
    biography: data.biography,
    movies: uniqueMovieIds.map((id) => ({ id })),
  };
}

export async function getActors(): Promise<Actor[]> {
  return await requestJson<Actor[]>(`${API_URL}/actors`);
}

export async function getActor(id: string): Promise<Actor> {
  return await requestJson<Actor>(`${API_URL}/actors/${id}`);
}

export async function createActor(data: ActorFormValues): Promise<Actor> {
  return await requestJson<Actor>(`${API_URL}/actors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeActorPayload(data)),
  });
}

export async function updateActor(id: string, data: ActorFormValues): Promise<Actor> {
  return await requestJson<Actor>(`${API_URL}/actors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeActorPayload(data)),
  });
}

export async function deleteActor(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/actors/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${API_URL}/actors/${id} failed: ${res.status} ${res.statusText}`);
  }
}
