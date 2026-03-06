import { Prize, PrizeFormValues } from "@/modules/prizes/types";

const API_URL = "http://localhost:3000/api/v1";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

async function requestVoid(url: string, init?: RequestInit): Promise<void> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}`);
  }
}

export async function getPrizes(): Promise<Prize[]> {
  return await requestJson<Prize[]>(`${API_URL}/prizes`);
}

export async function getPrize(id: string): Promise<Prize> {
  return await requestJson<Prize>(`${API_URL}/prizes/${id}`);
}

export async function createPrize(data: PrizeFormValues): Promise<Prize> {
  return await requestJson<Prize>(`${API_URL}/prizes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updatePrize(id: string, data: PrizeFormValues): Promise<Prize> {
  return await requestJson<Prize>(`${API_URL}/prizes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deletePrize(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/prizes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${API_URL}/prizes/${id} failed: ${res.status} ${res.statusText}`);
  }
}

export async function assignPrizeToMovie(prizeId: string, movieId: string): Promise<void> {
  await requestVoid(`${API_URL}/movies/${movieId}/prizes/${prizeId}`, {
    method: "POST",
  });
}
