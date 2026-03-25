{/* =============== packages ============ */ }
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner/spinner';

{/* =============== services ============ */ }
import { isTokenvalid } from '@utils/auth';
import { useAuth } from '@context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const token = sessionStorage.getItem('token');

  // Only wait for auth to finish loading, no artificial delay
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner loadingLabel="Verifying session..." />
      </div>
    );
  }

  // Check if user is logged in (either via context or token)
  const hasValidToken = token && isTokenvalid(token);
  const isAuthenticated = isLoggedIn || hasValidToken;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}