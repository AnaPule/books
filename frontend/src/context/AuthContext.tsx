
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
import { type Word, type Quote, wordList } from '@models/Word';

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

    word: Word | null;
    quote: Quote | null;
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
    loading: false,

    word: null,
    quote: null
});

/// helper methods
const WordOfTheDay = async (userId: String) => {
    const word = wordList[Math.floor(Math.random() * wordList.length)]; //floor makes sure of no decimals.
    const dto = {
        userId: userId,
        word: word
    }
    const res = await request.post<Word>(`/auth/word`, dto);
    return res;
}

const QuoteOfTheDay = async (userId: string) => {
    const dto = {
        userId: userId,
        quote: '',
        author: ''
    }
    const res = await request.post<Quote>('/auth/quote', dto);
    return res;
}

const getToken = () => {
    let token = sessionStorage.getItem('token');
    if (!token || token.length === 0 || token === 'null' || token === '') { token = ''; }
    //alert('altered token: '+token)
    return token;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate(); //For redirecting users
    const [user, setUser] = useState<User | null>(null);
    const [word, setWord] = useState<Word | any>(null);
    const [quote, setQuote] = useState<Quote | any>(null);
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


        //show message only if there is one
        if (message) {
            toast.error('Pages ń Parchments', { description: message });
            if (message.includes('expired')) {
                hasShownExpiryToast.current = true;
            }
        } 
        navigate(`/home`, { replace: true });
    }, [navigate]);

    /// cut out some code for now
    useEffect(() => {
        const token = getToken();
        //if this is the email auth page, then skip all the mess about sessions and such...
        if (window.location.pathname.includes('/auth/verify') ||
            window.location.pathname.includes('/home')) {
            setLoading(false);
            return;
        }

        let warningTimeout: ReturnType<typeof setTimeout> | null = null;
        let expiryTimeout: ReturnType<typeof setTimeout> | null = null;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const initAuth = async () => {
            // Skip if we already have user data
            if (user) { return; }
            if (token === '') { return; } // of there is absolutely no tokenthen dont check anything, they didnt log in
            setLoading(true);


            if (!token || !isTokenvalid(token)) {
                logout('Your session has expired. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                request.setAuthToken(token);
                const res = await request.get<any>('/auth/user');

                const actualUser = res.user as User;
                if (!actualUser) {
                    throw new Error("No user object in response");
                }
                setUser(actualUser);
                //console.log(actualUser)

                // Schedule timers only after user is set
                const timeLeftMs = getTimeLeft(token);

                if (timeLeftMs > 0) {
                    if (timeLeftMs <= 5 * 60 * 1000) {
                        //console.log('Time leftMs', timeLeftMs)
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
                logout('Session Error invalid. Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Safety periodic check (every 3 minutes)
        intervalId = setInterval(() => {
            const token = getToken();

            if (token && token != '' && !isTokenvalid(token)) {
                logout('Session expired (periodic check).');
            }
        }, 180_000);

        return () => {
            //console.log("AuthProvider cleanup: clearing timers");
            if (warningTimeout) clearTimeout(warningTimeout);
            if (expiryTimeout) clearTimeout(expiryTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [logout]);

    //for word and quote of the day
    useEffect(() => {
        if (!user?.id) return;

        let isCurrent = true;

        const loadExtras = async () => {
            try {
                const word = await WordOfTheDay(user.id);
                const quote = await QuoteOfTheDay(user.id);

                if (isCurrent) {
                    setWord(word);
                    setQuote(quote);
                }
            } catch (err) {
                console.error("Failed to load word/quote:", err);
            }
        };

        loadExtras();

        return () => {
            isCurrent = false;
        };
    }, [user?.id]); // only when user ID changes


    return (
        <AuthContext.Provider value={{ user, setUser, setRecommends, recommends, isLoggedIn, logout, loading, word, quote }}>
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