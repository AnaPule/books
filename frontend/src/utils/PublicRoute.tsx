
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
    const { isLoggedIn } = useAuth();
    const token = sessionStorage.getItem('token');

    if (isLoggedIn && isTokenvalid(token)){
        navigate('/profile',{replace:true})
    }
    return <>{children}</>
}