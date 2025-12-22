import { useState, useEffect } from "react";
import type { User } from "../../User";
import { getUser } from "../../api/auth";

export default function AdminDashboard() {
   const [users, setUsers] = useState<User[]>([]); 

  // Fetch users
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();
        setUsers(userData.results ?? []); // <- use 'results' from API
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
