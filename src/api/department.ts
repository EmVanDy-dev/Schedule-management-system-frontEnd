import { authHeader } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function getDeparetment() {
  const res = await fetch(`${API_URL}/departments/`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function addDepartment(data: any) {
  const res = await fetch(`${API_URL}/departments/`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateDepartment(id: number, data: any) {
  const res = await fetch(`${API_URL}/departments/${id}/`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();

    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return res.json();
}

export async function deleteDepartment(id: number) {
    const res = await fetch(`${API_URL}/departments/${id}/`,{
        method: "DELETE",
        headers: authHeader()
    });

    return res.ok;
}
