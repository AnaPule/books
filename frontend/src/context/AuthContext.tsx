import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

//models
import type { User } from "@models/User";
import type { Book } from "@models/Book";

//components
import Spinner from "@components/skeleton/spinner";
// env variables
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
}

// **Note: Context provides a way to pass data through the component tree without having to pass props down manually at every level.
// ** Note: Context is designed to share data that can be considered “global” for a tree of React components
const AuthContext = createContext<AuthContextType>({
    user: null,
    //wishlist: [],
    //library: [],
    recommends: [],
    isLoggedIn: false,

    setUser: () => { },
    //setLibrary: () => [],
    //setWishlist: () => [],
    setRecommends: () => []
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const navigate = useNavigate(); //For redirecting users
    const [user, setUser] = useState<User | null>(null); //Tracks if someone is logged in
    const [isLoggedIn, setLoggedIn] = useState<Boolean>(true);
    //const [wishlist, setWishlist] = useState<Book[] | []>([]);
    //const [library, setLibrary] = useState<Book[] | []>([]);
    const [recommends, setRecommends] = useState<Book[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true); //Shows spinner while checking authentication

    /// cut out some code for now
    useEffect(() => {
        if (!user){
            setLoading(false);
        }
    },[navigate])

    return (
        <AuthContext.Provider value={{user, setUser, setRecommends, recommends, isLoggedIn }}>
            {loading ? (
                <div>
                    <p style={{ display: "flex", alignItems: "center",justifyContent: "center", gap:'5px', width: "fit-content",}}>
                        <Spinner loadingLabel="Please Wait"/>
                    </p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}// end if AuthProvider

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};