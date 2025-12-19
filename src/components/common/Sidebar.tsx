import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext2";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: "230px" }}>
      <h6 className="text-muted mb-3">MENU</h6>

      {user?.role === "admin" && (
        <>
          <Link className="list-group-item list-group-item-action mb-1" to="/admin">
            Dashboard
          </Link>
          <Link className="list-group-item list-group-item-action mb-1" to="/admin/schedule">
            Create Schedule
          </Link>
          <Link className="list-group-item list-group-item-action mb-1" to="/admin/rooms">
            Rooms
          </Link>
        </>
      )}

      {user?.role === "teacher" && (
        <>
          <Link className="list-group-item list-group-item-action mb-1" to="/teacher">
            Dashboard
          </Link>
          <Link className="list-group-item list-group-item-action mb-1" to="/teacher/schedule">
            My Schedule
          </Link>
        </>
      )}

      {user?.role === "student" && (
        <>
          <Link className="list-group-item list-group-item-action mb-1" to="/student">
            Dashboard
          </Link>
          <Link className="list-group-item list-group-item-action mb-1" to="/student/schedule">
            My Schedule
          </Link>
        </>
      )}
    </div>
  );
}
