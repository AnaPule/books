/// <reference lib="esnext" />
{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext, useContext, useCallback, type ReactNode } from 'react';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner/spinner';

{/* =============== services ============ */ }
import { isTokenvalid, getTimeLeft } from '@utils/auth';

{/* =============== utils ============ */ }
import { request } from "@utils/ApiRequest";

{/* =============== models ============ */ }
import type { Room } from '@models/Book';
import type { User } from "@models/User";
import type { Notification } from '@models/Notice';
import { RelationshipType, type Book } from "@models/Book";
import { type Word, type Quote, wordList } from '@models/Word';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;

    wishlist: Book[] | [];
    setWishlist: (books: Book[] | []) => void;

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

    recommendRooms: Room[] | [],
    setRecommendRooms: (room: Room[] | []) => void;

    pings: Notification[] | [];
    setPings: (pings: Notification[] | []) => void;

    popular: Book[] | [],
    discover: Book[] | [],
    trending: Book[] | [],
    isLoggedIn: Boolean;
    logout: () => void;
    loading: boolean;
    word: Word | null;
    quote: Quote | null;
}

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
    pings: [],
    recommends: [],
    recommendRooms: [],
    isLoggedIn: false,

    logout: () => { },
    setUser: () => { },
    setGenre: () => [],
    setPings: () => [],
    setAuthor: () => [],
    setLibrary: () => [],
    setWishlist: () => [],
    setDislike: () => [],
    setRecommends: () => [],
    setRecommendRooms: () => [],

    loading: false,
    word: null,
    quote: null
});

const WordOfTheDay = async (userId: String) => {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const dto = { userId: userId, word: word }
    const res = await request.post<Word>(`/auth/word`, dto);
    return res;
}

const QuoteOfTheDay = async (userId: string) => {
    const dto = { userId: userId, quote: '', author: '' }
    const res = await request.post<Quote>('/auth/quote', dto);
    return res;
}

const getToken = () => {
    let token = sessionStorage.getItem('token');
    if (!token || token.length === 0 || token === 'null' || token === '') { token = ''; }
    return token;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [word, setWord] = useState<Word | any>(null);
    const [pings, setPings] = useState<Notification[] | []>([]);
    const [quote, setQuote] = useState<Quote | any>(null);
    const isLoggedIn = !!user;
    const [dislike, setDislike] = useState<Book[] | []>([]);
    const [discover, setDiscover] = useState<Book[] | []>([]);
    const [popular, setPopular] = useState<Book[] | []>([]);
    const [wishlist, setWishlist] = useState<Book[] | []>([]);
    const [library, setLibrary] = useState<Book[] | []>([]);
    const [genre, setGenre] = useState<Book[] | []>([]);
    const [author, setAuthor] = useState<Book[] | []>([]);
    const [trending, setTrending] = useState<Book[] | []>([]);
    const [recommends, setRecommends] = useState<Book[] | []>([]);
    const [recommendRooms, setRecommendRooms] = useState<Room[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const hasShownExpiryToast = useRef(false);

    const logout = useCallback((message?: string) => {
        if (hasShownExpiryToast.current && message?.includes('expired')) {
            return;
        }
        sessionStorage.removeItem('token');
        setUser(null);
        request.setAuthToken(null);
        if (message) {
            toast.error('Pages & Parchment', { description: message });
            if (message.includes('expired')) {
                hasShownExpiryToast.current = true;
            }
        }
        navigate(`/home`, { replace: true });
    }, [navigate]);

    // Auth check effect
    useEffect(() => {
        const publicPaths = [
            '/auth/verify', '/auth/reset-password', '/auth/resubscribe',
            '/home', '/unauthorised', '/not-found', '/too-many-requests'
        ];
        if (publicPaths.some(p => location.pathname.includes(p))) {
            setLoading(false);
            return;
        }

        const token = getToken();
        let warningTimeout: ReturnType<typeof setTimeout> | null = null;
        let expiryTimeout: ReturnType<typeof setTimeout> | null = null;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const initAuth = async () => {
            if (user) return;
            if (!token) {
                setLoading(false);
                return;
            }
            if (!isTokenvalid(token)) {
                logout('Your session has expired. Please log in again.');
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                request.setAuthToken(token);
                const res = await request.get<any>('/auth/user');

                //console.log('user res',res);
                const actualUser = res.user as User;

                if (!actualUser) throw new Error("No user object in response");

                setUser(actualUser);
                setPings(res.pings as Notification[] | []);

                const timeLeftMs = getTimeLeft(token);
                if (timeLeftMs > 0) {
                    if (timeLeftMs > 5 * 60 * 1000) {
                        warningTimeout = setTimeout(() => {
                            toast.warning('Pages & Parchment', {
                                description: "Less than 5 minutes left. Save your work!",
                                duration: 10000
                            });
                        }, timeLeftMs - 5 * 60 * 1000);
                    }
                    expiryTimeout = setTimeout(() => {
                        logout('Your session has expired.');
                    }, timeLeftMs);
                }
            } catch (error) {
                console.log('auth failed: ', error);
                logout('Please log in again.');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        intervalId = setInterval(() => {
            const currentToken = getToken();
            if (currentToken && !isTokenvalid(currentToken)) {
                logout('Session expired');
            }
        }, 300000);

        return () => {
            if (warningTimeout) clearTimeout(warningTimeout);
            if (expiryTimeout) clearTimeout(expiryTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [logout, navigate]);

    // Single effect to load ALL user data when user changes
    useEffect(() => {
        if (!user?.id) {
            console.log("No user ID yet, skipping data fetch");
            return;
        }

        let isCurrent = true;

        const loadAllUserData = async () => {
            try {
                // Fetch ALL data in parallel
                const [
                    wordRes,
                    quoteRes,
                    discoverRes,
                    recommendsRes,
                    genreRes,
                    authorRes,
                    trendsRes,
                    popularRes,
                    libraryRes,
                    wishlistRes,
                    pingsRes,
                ] = await Promise.all([
                    WordOfTheDay(user.id),
                    QuoteOfTheDay(user.id),
                    request.get<any>(`/recs/random`),
                    request.get<any>(`/recs/user/${user.id}`),
                    request.get<any>(`/recs/user/${user.id}/genre`),
                    request.get<any>(`/recs/user/${user.id}/author`),
                    request.get<any>(`/recs/user/${user.id}/trending`),
                    request.get<any>(`/recs/user/${user.id}/popular`),
                    request.get<any>(`/auth/${user.id}/books/${RelationshipType.LIBRARY}`),
                    request.get<any>(`/auth/${user.id}/books/${RelationshipType.WISHLIST}`),
                    request.get<any>(`/auth/notice/user/${user.id}`)
                ]);

                if (!isCurrent) return;

                // Set word and quote - they're valid or undefined
                if (wordRes) setWord(wordRes);
                if (quoteRes) setQuote(quoteRes);

                // Set book lists - ensure they're arrays
                setDiscover(discoverRes?.books || []);
                setRecommends(recommendsRes?.books || []);
                setRecommendRooms(recommendsRes?.rooms || []); //console.log('recommened rooms: ', recommendsRes?.rooms)
                setGenre(genreRes?.books || []);
                setAuthor(authorRes?.books || []);
                setTrending(trendsRes?.books || []);
                setPopular(popularRes?.books || []);
                setLibrary(libraryRes?.books || []);
                setWishlist(wishlistRes?.books || []);
                setPings(pingsRes?.pings || []);

            } catch (err) {
                console.error("Failed to load user data:", err);
                // Set empty arrays on error so components don't crash
                setDiscover([]);
                setRecommends([]);
                setRecommendRooms([]);
                setGenre([]);
                setAuthor([]);
                setTrending([]);
                setPopular([]);
                setLibrary([]);
                setWishlist([]);
                setPings([]);
            }
        };

        loadAllUserData();

        return () => {
            isCurrent = false;
        };
    }, [user?.id]); // Only runs when user ID changes (login/logout)

    //when user details changes
    useEffect(() => {
        const RefetchUser = async () => {
            const res = await request.get<any>('/auth/user');
            //request.setAuthToken(token);

            //console.log('user res',res);
            const actualUser = res.user as User;

            if (!actualUser) throw new Error("No user object in response");

            setUser(actualUser);
            setPings(res.pings as Notification[] | []);
        }
        try {
            RefetchUser()
        } catch (err) {
            console.log('Exception while fetching user: ', err)
        }
    }, [user?.username, user?.profilePhoto, user?.cellphone, user?.email, user?.bio]);

    return (
        <AuthContext.Provider value={{
            user, setUser,
            recommends, setRecommends,
            recommendRooms, setRecommendRooms,
            wishlist, setWishlist,
            library, setLibrary,
            genre, setGenre,
            author, setAuthor,
            dislike, setDislike,
            word, quote,
            popular, discover,
            trending, pings, setPings,
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
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};