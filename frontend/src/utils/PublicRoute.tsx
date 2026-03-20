
{/* =============== packages ============ */ }
import { Navigate, useNavigate } from "react-router-dom";

{/* =============== services ============ */ }
import { isTokenvalid } from "./auth";
import { useAuth } from '@context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({children}: PublicRouteProps) {
    const navigate = useNavigate();
    const { isLoggedIn, loading } = useAuth();
    const token = sessionStorage.getItem('token');
    const validToken = token && isTokenvalid(token);

    if (validToken){
        navigate('/profile',{replace:true})
    }

    if (isLoggedIn){
        navigate('/profile',{replace:true})
    }

    return <>{children}</>
}