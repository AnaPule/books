

{/* =============== packages ============ */ }
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner';

{/* =============== services ============ */ }
import { isTokenvalid } from '@utils/auth';
import { useAuth } from '@context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [routeReady, setRouteReady] = useState(false);
  const token = sessionStorage.getItem('token');

  // Give AuthProvider ~500ms to finish setting user after login/refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setRouteReady(true);
    }, 800)
    return () => clearTimeout(timer);
  }, [])

  if (authLoading || !routeReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner loadingLabel="Verifying session..." />
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}