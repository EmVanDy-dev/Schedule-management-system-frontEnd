import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext2";
import Login from "./pages/auth/Login";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Room from "./pages/admin/Room";
import Building from "./pages/admin/Building";
import Department from "./pages/admin/Department";
import Subject from "./pages/admin/academic/Subject";
import Major from "./pages/admin/academic/Major";
import StudentGroups from "./pages/admin/academic/StudentGroup";
import StudentGroupMemmber from "./pages/admin/academic/StudentGroupMemmber";
import StudentGroupMemberTap from "./pages/admin/academic/StudentGroupMemmberTap";

import StudentDashboard from "./pages/student/StudentDashboard";

import ProtectedLayout from "./components/common/ProtectedLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* Admin Form  */}
        <Route element={<ProtectedLayout />}>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/rooms" element={<Room />} />
            <Route path="/admin/buildings" element={<Building />} />
            <Route path="/admin/departments" element={<Department />} />
            <Route path="/admin/majors" element={<Major />} />
            <Route path="/admin/subjects" element={<Subject />} />
            <Route path="/admin/studentgroups" element={<StudentGroups />} />
            <Route path="/admin/studentgroupmembers/:groupId" element={<StudentGroupMemmber />} />
            <Route path="/admin/studentgroupmembertaps/" element={<StudentGroupMemberTap />} />

            <Route index element={<Navigate to="/admin" />} />
          </Route>

          <Route element={<ProtectedRoute role="teacher" />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>

          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
