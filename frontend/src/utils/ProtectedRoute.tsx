

{/* =============== packages ============ */ }
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner';

{/* =============== services ============ */ }
import { isTokenvalid } from '@utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isValid] = useState<boolean | null>(null);

  if (isValid === null) {
    return <div className="flex justify-center items-center h-screen"><Spinner loadingLabel='Loading' /></div>; // Or a spinner
  }

  if (!isValid) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}