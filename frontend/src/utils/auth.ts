
{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { jwtDecode } from "jwt-decode";

{/* =============== services ============ */ }

// =============== model ============
import {type tokenResponse } from "@models/User";

export function decodeToken(token: string | null): tokenResponse | null {
    if (!token) return null;
    try{
        return jwtDecode<tokenResponse>(token);
    }catch (err){
        console.warn('Invalid JWT format', err);
        toast.warning('JWT Token', {
            description: `${err}`
        });
        return null;
    }
}

export function isTokenvalid(token: string | null): boolean {
  if (!token || token === null) return false;

  try {
    const decoded = jwtDecode<tokenResponse>(token);

    // Only check if exp exists and is in the future
    if (!decoded.exp) {
      console.warn("Token has no expiration claim");
      return false;
    }

    const expiryTimeMs = decoded.exp * 1000;
    const isValid = expiryTimeMs > Date.now();

    // Optional debug
    console.log("Token validation:", {
      decodedExp: new Date(expiryTimeMs).toLocaleString(),
      now: new Date().toLocaleString(),
      isValid
    });

    return isValid;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

export function getTokenExpiryTime(token: string | null): number | null {
    if (!token) return null;
    const decoded = jwtDecode<tokenResponse>(token);
    return decoded?.exp ? decoded.exp * 1000 : null; //return as timestamp
}

export function getTimeLeft(token: string | null): number {
    const expiry = getTokenExpiryTime(token);
    if (!expiry) return 0;
    //console.log('Expiry time',expiry);
    return expiry - Date.now();
}

export function getTokenPayload(): tokenResponse | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try{
        return jwtDecode<tokenResponse>(token);
    }catch{
        return null;
    }
}