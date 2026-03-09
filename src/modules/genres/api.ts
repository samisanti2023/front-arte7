import { Genre, GenreFormValues } from "@/modules/genres/types";

const API_URL = "http://localhost:3000/api/v1";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getGenres(): Promise<Genre[]> {
  return await requestJson<Genre[]>(`${API_URL}/genres`);
}

export async function getGenre(id: string): Promise<Genre> {
  return await requestJson<Genre>(`${API_URL}/genres/${id}`);
}

export async function createGenre(data: GenreFormValues): Promise<Genre> {
  return await requestJson<Genre>(`${API_URL}/genres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateGenre(id: string, data: GenreFormValues): Promise<Genre> {
  return await requestJson<Genre>(`${API_URL}/genres/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteGenre(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/genres/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${API_URL}/genres/${id} failed: ${res.status} ${res.statusText}`);
  }
}
