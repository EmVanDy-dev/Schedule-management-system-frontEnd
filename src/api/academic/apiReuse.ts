import { authHeader } from "../auth";
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  // DELETE usually has no body
  if (res.status === 204) return null;

  return res.json();
}
