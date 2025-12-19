import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../../context/AuthContext2'
import type { Role } from '../../User';

export default function ProtectedRoute({ role }: { role?: Role }) {
  const { user } = useAuth();

   if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
  
 }
