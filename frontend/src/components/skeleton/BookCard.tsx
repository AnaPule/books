
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import { toast } from "sonner";
import Spinner from "./spinner";
import { NoResults } from "./noResults";
import { LoadingCards } from "@components/skeleton/LoadingCard";

//models
import type { Book, Author } from "@models/Book";

//services
import { useAuth } from "@context/AuthContext";
import { request } from "@utils/ApiRequest";

interface CardProps {
    book: Book;
    action?: () => void;
}

export const Card: React.FC<CardProps> = ({
    book
}: CardProps) => {
    return (
        <div
            className="w-80">
            <div
                style={{
                    'backgroundImage': `url(${book.coverArt})`,
                    'backgroundSize': 'cover',
                    'backgroundPosition': 'center',
                    'backgroundRepeat': 'no-repeat'
                }}
                className="bg-transparent rounded-xl shadow-xl overflow-hidden w-64 h-96 cursor-pointer transition-transform duration-300 hover:scale-90 control-component"
            >
                <div className="tooltip">{book.name}</div>
            </div>
            <h2 className="font-bold w-64 text-lg text-left pt-4 truncate ">{book.name ?? "Default Book Name"}</h2>
            <p className="text-left text-sm px-2">by {book.author.name ?? 'Unknown Author'}</p>
        </div>
    );
}

export const SmallCard: React.FC<CardProps> = ({
    book,
    action
}: CardProps) => {
    return (
        <div 
        onClick={action}
        key={book.id} className="group cursor-pointer">
            <div
                className="w-full aspect-[2/3] bg-gray-800 rounded-lg shadow-xl mb-3 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-gray-800"
                style={{
                    backgroundImage: `url(${book.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <h3 className="font-semibold text-sm text-white line-clamp-2 mb-1">{book.name}</h3>
            <p className="text-xs text-gray-500 italic">{book.author.name}</p>

        </div>
    );
}

export const BookCard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        setLoading(true);
        request.get<Book[]>(`/library/get-user-library/${user?.id}`)
            .then((res: Book[]) => {
                setBooks(res)
                //console.log('response: ', res);
            }).catch(
                (error) => {
                    toast.error('Something went wrong while loading your library. Please reload your page.');
                    console.error(error);
                }
            ).finally(
                () => {
                    setLoading(false);
                }
            )
    }, []);

    return (
        <>
            <span className="w-full flex justify-between items-center px-10 py-4">
                <h2 className=" text-2xl font-bold text-left text-white">Your Books</h2>
                {books.length !== 0 &&
                    <h2 className="underline font-bold text-indigo-500 cursor-pointer hover:text-indigo-900">see all</h2>
                }

            </span>
            <div className="pt-2 flex items-start gap-2 mx-4 overflow-x-auto scroll-smooth">
                {loading ? (
                    <>
                        <LoadingCards LoadingSelection="books" />
                    </>

                ) : books.length == 0 ? (
                    <>
                        <NoResults
                            actionLabel="browse for books"
                            action={() => navigate('/browse-books')}
                            WarningLabel="You have no books in your library. Browse and get reading!!" />
                    </>
                ) : (
                    <>
                        {books.map(
                            (b, idx) => {
                                return (
                                    <div
                                        onClick={() => navigate(`/individual-book/${b.id}`)}
                                    >
                                        <Card book={b} />
                                    </div>
                                );

                            }
                        )}
                    </>
                )}
            </div>
        </>
    );
}