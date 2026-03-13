
import { toast } from 'sonner';
import { jwtDecode } from "jwt-decode";

// =============== model ============
import {type  tokenResponse } from "@models/User";

export function isTokenvalid(token:string | null): boolean {
    if (!token) return false;

    try{
        const decoded = jwtDecode<tokenResponse>(token);
        
        if (!decoded.exp) return false; // No expiration = assume invalid

        //checking if expiration
        const currTime = Math.floor(Date.now()/ 1000);
        return decoded.exp > currTime;
    }catch(error){
        toast.error(`FATAL SYSTEM ERROR: Token unavailable`);
        console.error('Invalid error: ',error)
        return false;
    }
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