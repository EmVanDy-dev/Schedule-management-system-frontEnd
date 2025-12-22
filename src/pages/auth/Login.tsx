// import { useAuth } from "../../context/AuthContext2";

// export default function Login() {
//   const { login } = useAuth();

//   return (
//     <div>
//       <h2>Login</h2>

//       <button
//         onClick={() =>
//           login(
//             { id: 1, username: "Admin", email: "admin@example.com", role: "admin" },
//             "token"
//           )
//         }
//       >
//         Login as Admin
//       </button>

//       <button
//         onClick={() =>
//           login(
//             { id: 2, username: "Teacher", email: "teacher@example.com", role: "teacher" },
//             "token"
//           )
//         }
//       >
//         Login as Teacher
//       </button>

//       <button
//         onClick={() =>
//           login(
//             { id: 3, username: "Student", email: "student@example.com", role: "student" },
//             "token"
//           )
//         }
//       >
//         Login as Student
//       </button>
//     </div>
//   );
// }
import { useState } from "react";
import { useAuth } from "../../context/AuthContext2";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 380 }}>
        <h4 className="text-center mb-4 fw-bold">🔐 Login</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
