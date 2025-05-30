import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AuthLayout = ({ allowedRoles }) => {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  
  if (!isHydrated) return null;
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;