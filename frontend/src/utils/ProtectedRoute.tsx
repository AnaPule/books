

{/* =============== packages ============ */ }
import { useState } from 'react';
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
  const {loading,isLoggedIn} = useAuth();

  if (isLoggedIn && isTokenvalid === null) {
    return <Navigate to="/auth" replace />;
    //return <div className="flex justify-center items-center h-screen"><Spinner loadingLabel='Loading' /></div>; 
  }

  if (!isTokenvalid || !isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoggedIn && !isTokenvalid){
    return <Navigate to="/auth" replace />;
  }

  if (loading){
    return <div className="flex justify-center items-center h-screen"><Spinner loadingLabel='Loading' /></div>; 
  }

  return <>{children}</>;
}