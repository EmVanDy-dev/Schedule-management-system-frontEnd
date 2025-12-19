import { useAuth } from "../../context/AuthContext2";

export default function Login() {
  const { login } = useAuth();

  return (
    <div>
      <h2>Login</h2>

      <button
        onClick={() =>
          login(
            { id: 1, username: "Admin", email: "admin@example.com", role: "admin" },
            "token"
          )
        }
      >
        Login as Admin
      </button>

      <button
        onClick={() =>
          login(
            { id: 2, username: "Teacher", email: "teacher@example.com", role: "teacher" },
            "token"
          )
        }
      >
        Login as Teacher
      </button>

      <button
        onClick={() =>
          login(
            { id: 3, username: "Student", email: "student@example.com", role: "student" },
            "token"
          )
        }
      >
        Login as Student
      </button>
    </div>
  );
}
