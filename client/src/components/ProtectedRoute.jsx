import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore";


const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
