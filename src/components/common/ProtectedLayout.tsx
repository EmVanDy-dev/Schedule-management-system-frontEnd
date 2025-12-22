import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }} >
        <Sidebar />
        <div style={{ padding: "20px", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
