import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext2";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const [component, setComponent] = useState<boolean>(false);
  const [component2, setComponent2] = useState<boolean>(false);

  const linkClass = (path: string): string =>
    `list-group-item list-group-item-action mb-2 rounded ${
      location.pathname === path ? "active fw-semibold" : ""
    }`;

  // For active on Manage Tap
  const toggleClass = (paths: string[]) =>
    `list-group-item list-group-item-action mb-2 rounded ${
      paths.some((p) => location.pathname.startsWith(p))
        ? "active fw-semibold"
        : ""
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

            <Link className={linkClass("/admin/schedule")} to="/admin/schedule">
              🗓 Create Schedule
            </Link>
            {/* ROOMS TOGGLE */}

            {/* <button
              className="list-group-item list-group-item-action mb-2 rounded"
              onClick={() => setComponent(!component)}
              style={{ cursor: "pointer" }}
            >
              🧑🏿‍💼 Manage
              <span className="float-end">{component ? "▲" : "▼"}</span>
            </button> */}
            <button
              className={toggleClass([
                "/admin/majors",
                "/admin/subjects",
                "/admin/studentgroups",
                "/admin/studentgroupmembertaps",
              ])}
              onClick={() => setComponent(!component)}
              style={{ cursor: "pointer" }}
            >
              Manage Academic
              <span className="float-end">{component ? "▲" : "▼"}</span>
            </button>
            {component && (
              <div style={{ fontSize: "14px" }} className="ms-3">
                <Link
                  className={linkClass("/admin/majors") + ""}
                  to="/admin/majors"
                >
                  Create Majors
                </Link>

                <Link
                  className={linkClass("/admin/subjects")}
                  to="/admin/subjects"
                >
                  Create Subject
                </Link>

                <Link
                  className={linkClass("/admin/studentgroups")}
                  to="/admin/studentgroups"
                >
                  Student Group
                </Link>
                <Link
                  className={linkClass("/admin/studentgroupmembertaps")}
                  to="/admin/studentgroupmembertaps"
                >
                  Group Student Memmbers
                </Link>
              </div>
            )}

            <button
              className={toggleClass([
                "/admin/rooms",
                "/admin/departments",
                "/admin/buildings",
              ])}
              onClick={() => setComponent2(!component2)}
              style={{ cursor: "pointer" }}
            >
              👩🏿‍💼 Manage
              <span className="float-end">{component2 ? "▲" : "▼"}</span>
            </button>

            {component2 && (
              <div style={{ fontSize: "14px" }} className="ms-3">
                <Link
                  className={linkClass("/admin/rooms") + ""}
                  to="/admin/rooms"
                >
                  ➕ Create Room
                </Link>

                <Link
                  className={linkClass("/admin/departments")}
                  to="/admin/departments"
                >
                  🏢 Departments
                </Link>

                <Link
                  className={linkClass("/admin/buildings")}
                  to="/admin/buildings"
                >
                  🏗 Buildings
                </Link>
              </div>
            )}

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
