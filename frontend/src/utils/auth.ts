
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

export function isTokenvalid(token:string | null): boolean {
    if (!token) return false;

    try{
        const decoded = jwtDecode<tokenResponse>(token);
        
        if (!decoded.exp || !decoded) return false; // No expiration = assume invalid // exp is in seconds
        return decoded.exp*1000 > Date.now();
    }catch(error){
        toast.error(`FATAL SYSTEM ERROR: Token unavailable`, {description: `${error}`});
        console.error('Invalid error: ',error)
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