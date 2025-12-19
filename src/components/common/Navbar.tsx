import { useAuth } from "../../context/AuthContext2";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand">
        📅 Schedule Management
      </span>

      <div className="d-flex align-items-center gap-3 text-white">
        <span>{user?.username} </span>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
