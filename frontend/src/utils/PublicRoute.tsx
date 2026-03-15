
{/* =============== packages ============ */ }
import { Navigate } from "react-router-dom";

{/* =============== services ============ */ }
import { isTokenvalid } from "./auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({children}: PublicRouteProps) {
    const token = sessionStorage.getItem('token');
    const validToken = token && isTokenvalid(token);

    if (validToken){
        return <Navigate to='/profile' replace />
    }

    return <>{children}</>
}