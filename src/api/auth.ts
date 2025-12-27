const API_URL = "http://127.0.0.1:8000/api";

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Get all users
export async function getUser() {
  const res = await fetch(`${API_URL}/users`, {
    headers: authHeader(),
  });
  return res.json();
}

// Create a new user
export async function createUser(data: any) {
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    // Throw the JSON error so frontend catch can handle
    throw json;
  }

  return json;
}

// Update an existing user
export async function updateUser(id: number, data: any) {
  const res = await fetch(`${API_URL}/users/${id}/`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    
    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return true;
}

// Delete a user
export async function deleteUser(id: number) {
  const res = await fetch(`${API_URL}/users/${id}/`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    const text = await res.text();
    
    throw text ? JSON.parse(text) : { message: "Delete failed" };
  }
  return res.ok;
}
