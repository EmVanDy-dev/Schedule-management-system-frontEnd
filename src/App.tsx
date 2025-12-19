import {  Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext2";
import Login from "./pages/auth/Login";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
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

        <Route element={<ProtectedLayout />}>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
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
