import { Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PublicLayout = () => {
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  // Show nothing while hydrating (brief moment)
  if (!isHydrated) return null;

  // Redirect if authenticated
  if (isAuthenticated) {
    const redirectTo = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Show public routes
  return <Outlet />;
};

export default PublicLayout;