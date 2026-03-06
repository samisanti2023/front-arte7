import { Director, DirectorFormValues } from "@/modules/directors/types";

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

function normalizePayload(data: DirectorFormValues): DirectorFormValues {
  return {
    ...data,
    birthDate: toIsoDate(data.birthDate),
  };
}

export async function getDirectors(): Promise<Director[]> {
  return await requestJson<Director[]>(`${API_URL}/directors`);
}

export async function getDirector(id: string): Promise<Director> {
  return await requestJson<Director>(`${API_URL}/directors/${id}`);
}

export async function createDirector(data: DirectorFormValues): Promise<Director> {
  return await requestJson<Director>(`${API_URL}/directors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizePayload(data)),
  });
}

export async function updateDirector(id: string, data: DirectorFormValues): Promise<Director> {
  return await requestJson<Director>(`${API_URL}/directors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizePayload(data)),
  });
}

export async function deleteDirector(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/directors/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${API_URL}/directors/${id} failed: ${res.status} ${res.statusText}`);
  }
}
