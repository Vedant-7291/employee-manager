import { Navigate } from 'react-router-dom';
import  useAuthStore  from '../store/useAuthStore';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;

// Updated EmployeeDashboard.jsx with working ProfileForm close logic
