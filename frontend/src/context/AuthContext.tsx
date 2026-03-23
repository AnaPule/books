
/// <reference lib="esnext" />
{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext, useContext, useCallback, type ReactNode } from 'react';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner/spinner';

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

    wishlist: Book[] | [];
    setWishlist: (books: Book[] | []) => void; // Function to update book state

    library: Book[] | [],
    setLibrary: (book: Book[] | []) => void;

    genre: Book[] | [],
    setGenre: (book: Book[] | []) => void;

    author: Book[] | [],
    setAuthor: (book: Book[] | []) => void;

    dislike: Book[] | [],
    setDislike: (book: Book[] | []) => void;

    recommends: Book[] | [],
    setRecommends: (book: Book[] | []) => void;

    popular: Book[] | [],
    discover: Book[] | [],
    trending: Book[] |[],
    //setRecommends: (book: Book[] | []) => void; 

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
    wishlist: [],
    library: [],
    genre: [],
    author: [],
    dislike: [],
    popular: [],
    discover: [],
    trending: [],
    recommends: [],
    isLoggedIn: false,
    logout: () => { },

    setUser: () => { },
    setGenre: () => [],
    setAuthor: () => [],
    setLibrary: () => [],
    setWishlist: () => [],
    setDislike: () => [],
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
    const [dislike, setDislike] = useState<Book[] | []>([]);
    const [discover, setDiscover] = useState<Book[] | []>([]);
    const [popular, setPopular] = useState<Book[] | []>([]);
    const [wishlist, setWishlist] = useState<Book[] | []>([]);
    const [library, setLibrary] = useState<Book[] | []>([]);
    const [genre, setGenre] = useState<Book[] | []>([]);
    const [author, setAuthor] = useState<Book[] | []>([]);
    const [trending, setTrending] = useState<Book[] | []>([]);
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

    useEffect(() => {

        //skip the auth mess on every path stipulated in the follwoing
        const publicPaths = [
            '/auth/verify',
            '/auth/reset-password',
            '/auth/resubscribe',
            '/home',
            '/unauthorised',
            '/not-found',
            '/too-many-requests'
        ];
        if (publicPaths.some(p => location.pathname.includes(p))) {
            setLoading(false);
            return;
        }

        //otherwise procedd

        const token = getToken();
        // session timer clean ups
        let warningTimeout: ReturnType<typeof setTimeout> | null = null;
        let expiryTimeout: ReturnType<typeof setTimeout> | null = null;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const initAuth = async () => {
            if (user) return;
            //cehck token validity
            if (!token) {
                setLoading(false);
                return;
            }

            //if invalid, logout immediately
            if (!isTokenvalid(token)) {
                logout('Your session has expired. Please log in again.');
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                request.setAuthToken(token); // this is set so the valid token can be added to the header for other requests to the backend
                //now we need the user details of the logged in user
                await request.get<any>('/auth/user')
                    .then(
                        (res: any) => {
                            //right now the json is in any format in ts, and we need to extract the user details from the res and they need to be in User format.
                            const actualUser = res.user as User;
                            if (!actualUser) {
                                throw new Error("No user object in response");
                            }
                            setUser(actualUser);
                        }
                    )

                // session timers
                const timeLeftMs = getTimeLeft(token);
                if (timeLeftMs > 0) {
                    if (timeLeftMs > 5 * 60 * 100) {
                        //if time left imore than 0 and more 
                        warningTimeout = setTimeout(() => {
                            toast.warning('Pages ń Parchment', {
                                description: "Less that 5 minutes left. Save your work!",
                                duration: 10000
                            });
                        }, timeLeftMs - 5 * 60 * 1000);
                    }
                }

                expiryTimeout = setTimeout(() => {
                    logout('Your session has expired.')
                }, timeLeftMs);
            } catch (error) {
                console.log('auth failed: ', error)
                logout('Please log in again.');
            } finally {
                setLoading(false);
            }
            navigate('/profile')
        }
        initAuth();
        // periodic check for valid session (5 minutes)
        intervalId = setInterval(() => {
            if (token && !isTokenvalid(token)) {
                logout('Session expired')
            }
        }, 300_000);

        return () => {
            warningTimeout && clearTimeout(warningTimeout);
            expiryTimeout && clearTimeout(expiryTimeout);
            intervalId && clearInterval(intervalId);
        }

    }, [logout, navigate]); //It prevents the effect from running on every render. logout very rarely changes - it only changes when navigate changes , meaning its stable.

    useEffect(() => {
        if (!user?.id) return;

        let isCurrent = true;

        const loadAlgorithm = async () => {
            try {
                const popular = await request.get<any>(`/recs/popular`);
                const discover = await request.get<any>(`/recs/random`);
                const trends = await request.get<any>(`/recs/user/${user.id}/trending`);
                //const recommends = await request.get<any>(`/recs/user/${user.id}`);
                const genre = await request.get<any>(`/recs/user/${user.id}/genre`);
                const author = await request.get<any>(`/recs/user/${user.id}/author`);

                if (isCurrent) {
                    setGenre(genre.books);
                    setAuthor(author.books);
                    setTrending(trends.books);
                    setPopular(popular.books)
                    setDiscover(discover.books);
                    //setRecommends(recommends.books);
                }
            } catch (err) {
                console.error("Failed to load word/quote:", err);
            }
        };

        loadAlgorithm();

        return () => {
            isCurrent = false;
        };
    }, [wishlist, dislike, library]); // only when user ID changes

    useEffect(() => {
        if (!user?.id) return;

        let isCurrent = true;

        const loadExtras = async () => {
            try {
                const word = await WordOfTheDay(user.id);
                const quote = await QuoteOfTheDay(user.id);
                const discover = await request.get<any>(`/recs/random`);
                const trends = await request.get<any>(`/recs/user/${user.id}/trending`);
                const popular = await request.get<any>(`/recs/user/${user.id}/popular`);
                const recommends = await request.get<any>(`/recs/user/${user.id}`);
                const genre = await request.get<any>(`/recs/user/${user.id}/genre`);
                const author = await request.get<any>(`/recs/user/${user.id}/author`);

                if (isCurrent) {
                    setWord(word);
                    setQuote(quote);
                    setGenre(genre.books);
                    setAuthor(author.books);
                    setTrending(trends.books);
                    setPopular(popular.books)
                    setDiscover(discover.books);
                    setRecommends(recommends.books);
                }
            } catch (err) {
                console.error("Failed to load word/quote:", err);
            }
        };

        loadExtras();

        return () => {
            isCurrent = false;
        };
    }, [user?.id]);


    return (
        <AuthContext.Provider value={{
            user, setUser,
            recommends, setRecommends,
            wishlist, setWishlist,
            library, setLibrary,
            genre, setGenre,
            author, setAuthor,
            dislike, setDislike,
            word, quote,
            popular, discover,
            trending,
            isLoggedIn, logout,
            loading
        }}>
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