import { data } from "react-router-dom";
import { authHeader } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

// Get Building
export async function getBuilding() {
  try {
    const res = await fetch(`${API_URL}/buildings/`, {
      headers: authHeader(),
    });
    return res.json();
  } catch (err) {
    console.error(err);
  }
}

// Add Building
export async function addBuilding(building: any) {
  const res = await fetch(`${API_URL}/buildings/`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(building),
  });

  const json = await res.json();

  if (!res.ok) {
    // Throw the JSON error so frontend catch can handle
    throw json;
  }

  return json;
}

// Update Building
export async function updateBuilding(id: number, building: any) {
  const res = await fetch(`${API_URL}/buildings/${id}/`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(building),
  });

  if (!res.ok) {
    const text = await res.text();

    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return res.json();
}

// Delete Building
export async function deleteBuilding(id: number) {
  const res = await fetch(`${API_URL}/buildings/${id}/`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) {
    const text = await res.text();

    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return res.ok;
}
