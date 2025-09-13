import { getToken } from "./session";

type Json = Record<string, unknown> | unknown[] | null;

async function safeJson(res: Response): Promise<Json> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && init?.body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, { ...init, headers });
  const data = (await safeJson(res)) as T;
  if (!res.ok) {
    const error = (data as any)?.error ?? res.statusText;
    throw new Error(typeof error === "string" ? error : `HTTP ${res.status}`);
  }
  return data;
}

export function apiGet<T>(url: string): Promise<T> {
  return request<T>(url);
}

export function apiPost<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: "POST", body: JSON.stringify(body) });
}


