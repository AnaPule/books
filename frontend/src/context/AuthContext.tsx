
/// <reference lib="esnext" />
{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext, useContext, useCallback, type ReactNode } from 'react';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner';

{/* =============== services ============ */ }
//import { useAuth } from '@context/AuthContext';
import { isTokenvalid, getTimeLeft } from '@utils/auth';

{/* =============== utils ============ */ }
import { request } from "@utils/ApiRequest";

{/* =============== models ============ */ }
import type { User } from "@models/User";
import type { Book } from "@models/Book";

{/* =============== env variables ============ */ }
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface AuthContextType {
    user: User | null; // Current user object or null if not logged in
    setUser: (user: User | null) => void; // Function to update user state

    //wishlist: Book[] | [];
    //setWishlist: (books: Book[] | []) => void; // Function to update book state

    //library: Book[] | [],
    //setLibrary: (book: Book[] | []) => void;

    recommends: Book[] | [],
    setRecommends: (book: Book[] | []) => void;

    isLoggedIn: Boolean;
    logout: () => void;
    loading: boolean;
}

// **Note: Context provides a way to pass data through the component tree without having to pass props down manually at every level.
// ** Note: Context is designed to share data that can be considered “global” for a tree of React components
const AuthContext = createContext<AuthContextType>({
    user: null,
    //wishlist: [],
    //library: [],
    recommends: [],
    isLoggedIn: false,
    logout: () => { },

    setUser: () => { },
    //setLibrary: () => [],
    //setWishlist: () => [],
    setRecommends: () => [],
    loading: false
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate(); //For redirecting users
    const [user, setUser] = useState<User | null>(null);
    const isLoggedIn = !!user;
    //const [isLoggedIn, setLoggedIn] = useState<Boolean>(false);
    //const [wishlist, setWishlist] = useState<Book[] | []>([]);
    //const [library, setLibrary] = useState<Book[] | []>([]);
    const [recommends, setRecommends] = useState<Book[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const hasShownExpiryToast = useRef(false);

    const logout = useCallback((message?: string) => {
        if (hasShownExpiryToast.current && message?.includes('expired')) {
            return; // prevent duplicate toasts for expiry
        }

        sessionStorage.removeItem('token');
        setUser(null);
        request.setAuthToken(null);

        if (message) {
            toast.error('Session ended', { description: message });
            if (message.includes('expired')) {
                hasShownExpiryToast.current = true;
            }
        } else {
            toast.error('Session Terminated');
        }

        navigate(`/auth`, { replace: true });
    }, [navigate])

    /// cut out some code for now
    useEffect(() => {
        let warningTimeout: ReturnType<typeof setTimeout> | null = null;
        let expiryTimeout: ReturnType<typeof setTimeout> | null = null;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const initAuth = async () => {
            // Skip if we already have user data
            if (user) {
                return;
            }
            setLoading(true);

            const token = sessionStorage.getItem('token');

            if (!token || !isTokenvalid(token)) {
                logout('Your session has expired. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                request.setAuthToken(token);
                const res = await request.get<User>('/auth/user');
                //console.log("User fetched successfully:", res?.username || res?.email || 'no name');
                setUser(res);  // ← This line is critical!

                // Schedule timers only after user is set
                const timeLeftMs = getTimeLeft(token);

                if (timeLeftMs > 0) {
                    if (timeLeftMs > 5 * 60 * 1000) {
                        warningTimeout = setTimeout(() => {
                            toast.warning('Session expiring soon', {
                                description: 'Less than 5 minutes remaining. Save your work!',
                                duration: 20000,
                            });
                        }, timeLeftMs - 5 * 60 * 1000);
                    }

                    expiryTimeout = setTimeout(() => {
                        logout('Your session has expired.');
                    }, timeLeftMs);
                }
            } catch (err) {
                console.error('Failed to load user:', err);
                logout('Session invalid. Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Safety periodic check (every 3 minutes)
        intervalId = setInterval(() => {
            const token = sessionStorage.getItem('token');
            if (token && !isTokenvalid(token)) {
                logout('Session expired (periodic check).');
            }
        }, 180_000);

        return () => {
            console.log("AuthProvider cleanup: clearing timers");
            if (warningTimeout) clearTimeout(warningTimeout);
            if (expiryTimeout) clearTimeout(expiryTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [logout]);
    
   
    return (
        <AuthContext.Provider value={{ user, setUser, setRecommends, recommends, isLoggedIn, logout, loading }}>
            {loading ? (
                <div className='flex items-center justify-center h-screen'>
                    <Spinner loadingLabel="Please Wait" />
                </div>
            ) : (
                <>{children}</>
            )}
        </AuthContext.Provider>
    );
};// end if AuthProvider

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};