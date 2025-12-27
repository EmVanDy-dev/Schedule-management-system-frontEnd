import { authHeader } from "./auth";

const API_URL = "http://127.0.0.1:8000/api";

// Get All room
export async function getRoom() {
  const res = await fetch(`${API_URL}/rooms/`, {
    headers: authHeader(),
  });
  return res.json();
}

// Create a new room
export async function createRoom(dataRoom: any) {
  const res = await fetch(`${API_URL}/rooms/`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dataRoom),
  });

  const json = await res.json();

  if (!res.ok) {
    // Throw the JSON error so frontend catch can handle
    throw json;
  }

  return json;
}

// Update a existing room
export async function updateRoom(id: number, dataRoom: any) {
  const res = await fetch(`${API_URL}/rooms/${id}/`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(dataRoom),
  });

  if (!res.ok) {
    const text = await res.text();

    throw text ? JSON.parse(text) : { message: "update failed" };
  }
  console.log(dataRoom)
  return res.ok;
}

// Delete a room
export async function deleteRoom(id: number) {
  const res = await fetch(`${API_URL}/rooms/${id}/`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    const text = await res.text();

    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return res.ok;
}
