import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './pages/auth/AuthLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import useAuthStore from './store/useAuthStore';
// Add this at the top of your App component
import { startStatusPoller, stopStatusPoller } from './utils/statusPoller';



// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'));


function App() {
   const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      startStatusPoller();
    } else {
      stopStatusPoller();
    }

    return () => {
      stopStatusPoller();
    };
  }, [isAuthenticated]);
  const { initialize } = useAuthStore();

  // Initialize auth store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const { isHydrated } = useAuthStore();

  // Show loading state until auth state is hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route index element={<Navigate to="/login" replace />} />
        </Route>

        {/* Protected admin routes */}
        <Route path="/admin" element={<AuthLayout allowedRoles={['admin']} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Protected employee routes */}
        <Route path="/employee" element={<AuthLayout allowedRoles={['employee']} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          {/* Add more employee routes here */}
        </Route>

        {/* 404 Page */}
       
      </Routes>
    </Suspense>
  );
}

export default App;