import {toast} from 'sonner';
import { Navigate } from 'react-router-dom';
import Spinner from '@components/skeleton/spinner';
import { isTokenvalid } from '@utils/auth';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const valid = isTokenvalid(token);
    setIsValid(valid);
    
    if (!valid) {
      sessionStorage.removeItem('token');
      toast.error('Session expired', {
        description: 'Please log in again'
      });
    }
  }, []);
  
  if (isValid === null) {
    return <div>Loading...</div>; // Or a spinner
  }
  
  if (!isValid) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}