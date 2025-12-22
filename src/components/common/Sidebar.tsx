import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext2";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const linkClass = (path: string): string =>
    `list-group-item list-group-item-action mb-2 rounded ${
      location.pathname === path ? "active fw-semibold" : ""
    }`;

  return (
    <div
      className="bg-light border-end vh-100 p-3 shadow-sm"
      style={{ width: "240px" }}
    >
      <h5 className="text-primary fw-bold mb-4">📘 School System</h5>

      {/* ADMIN */}
      {user?.roleName === "admin" && (
        <>
          <small className="text-muted text-uppercase fw-semibold">
            Admin Menu
          </small>

          <div className="list-group list-group-flush mt-2">
            <Link className={linkClass("/admin")} to="/admin">
              📊 Dashboard
            </Link>

            <Link
              className={linkClass("/admin/schedule")}
              to="/admin/schedule"
            >
              🗓 Create Schedule
            </Link>

            <Link className={linkClass("/admin/rooms")} to="/admin/rooms">
              🏫 Rooms
            </Link>

            <Link className={linkClass("/admin/users")} to="/admin/users">
              👥 Manage Users
            </Link>
          </div>
        </>
      )}

      {/* TEACHER */}
      {user?.roleName === "teacher" && (
        <>
          <small className="text-muted text-uppercase fw-semibold">
            Teacher Menu
          </small>

          <div className="list-group list-group-flush mt-2">
            <Link className={linkClass("/teacher")} to="/teacher">
              📊 Dashboard
            </Link>

            <Link
              className={linkClass("/teacher/schedule")}
              to="/teacher/schedule"
            >
              🗓 My Schedule
            </Link>
          </div>
        </>
      )}

      {/* STUDENT */}
      {user?.roleName === "student" && (
        <>
          <small className="text-muted text-uppercase fw-semibold">
            Student Menu
          </small>

          <div className="list-group list-group-flush mt-2">
            <Link className={linkClass("/student")} to="/student">
              📊 Dashboard
            </Link>

            <Link
              className={linkClass("/student/schedule")}
              to="/student/schedule"
            >
              🗓 My Schedule
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
