
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import { toast } from "sonner";
import Spinner from "./spinner/spinner";
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

interface BookGridProps {
    title: string;
    books: Book[];
    onSeeAll?: () => void;
    cardType?: 'small' | 'medium' | 'large';
    itemWidth?: string;  // add this
}

const randomColour = () => {
    const covers = [
        'https://i.pinimg.com/736x/25/3c/9a/253c9a4865b62f9733ef868b490fb2ac.jpg',
        'https://i.pinimg.com/736x/dd/a1/fe/dda1fe74288e92ee643261f1f94e8a29.jpg',

    ];

    return covers[Math.floor(Math.random() * covers.length)];
}

export const Card: React.FC<CardProps> = ({
    book
}: CardProps) => {
    return (
        <div
            className="w-80">
            <div
                style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '--bg-image': book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`,
                    background: 'var(--bg-image, var(--alternative)) center center / cover no-repeat'
                } as React.CSSProperties}
                className="bg-transparent rounded-xl shadow-xl overflow-hidden w-64 h-96 cursor-pointer transition-transform duration-300 hover:scale-90 control-component"
            >
                {
                    !book.coverArt ?
                        (
                            <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                                <span className="
                                    text-black text-[clamp(5px,1.8vw,8px)]
                                    text-center leading-tight
                                    tracking-wide uppercase
                                    drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]
                                ">
                                    {book.name.length > 30 ? book.name.slice(0, 10) + '…' : book.name}
                                </span>
                            </div>
                        ) : null
                }
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
            key={book.id}
            className="group cursor-pointer w-full"
        >
            <div
                className="w-full aspect-[2/3] rounded-lg shadow-sm mb-2 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative"
                style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '--bg-image': book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`,
                    background: 'var(--bg-image, var(--alternative)) center center / cover no-repeat'
                } as React.CSSProperties}

            >

                {
                    !book.coverArt ?
                        (
                            <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                                <span className="
                                    text-black text-[clamp(5px,1.8vw,8px)]
                                    text-center leading-tight
                                    tracking-wide uppercase
                                    drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]
                                ">
                                    {book.name.length > 30 ? book.name.slice(0, 10) + '…' : book.name}
                                </span>
                            </div>
                        ) : null
                }
            </div>
            <h3 className="font-sans font-medium text-sm text-[#5A4D41] line-clamp-2 mb-1 group-hover:text-[#9FB89F] transition-colors">
                {book.name}
            </h3>
            <p className="text-xs text-[#7E6957] italic">{book.author.name}</p>
        </div>
    );
};

export const MediumCard: React.FC<CardProps> = ({ book, action }) => (
    <div onClick={action} className="group cursor-pointer w-full">
        <div
            className="w-full aspect-[2/3] rounded-xl shadow-md mb-3 group-hover:shadow-lg group-hover:-translate-y-3 transition-all duration-300 bg-[#F5F0E8]/90 relative"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '--bg-image': book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`,
                background: 'var(--bg-image, var(--alternative)) center center / cover no-repeat'
            } as React.CSSProperties}

        >
        </div>

        <h3 className="font-sans font-medium text-sm text-[#5A4D41] line-clamp-2 mb-1">{book.name}</h3>
        <p className="text-xs text-[#7E6957] italic">{book.author.name}</p>
    </div>
);

export const LargeCard: React.FC<CardProps> = ({
    book,
    action
}: CardProps) => {
    return (
        <div
            onClick={action}
            key={book.id}
            className="group cursor-pointer w-full"
        >
            <div
                className="w-full aspect-[2/3] rounded-xl shadow-md mb-4 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 bg-[var(--sage-mist)]/90"
                style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '--bg-image': book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`,
                    background: 'var(--bg-image, var(--alternative)) center center / cover no-repeat'
                } as React.CSSProperties}

            >
            </div>
            <h3 className="font-sans font-medium text-base md:text-lg text-[#5A4D41] line-clamp-2 mb-1.5 group-hover:text-[#9FB89F] transition-colors">
                {book.name}
            </h3>
            <p className="text-sm text-[#7E6957] italic">{book.author.name}</p>
        </div>
    );
};

export const BookGrid: React.FC<BookGridProps> = ({
    title,
    books,
    onSeeAll,
    cardType = 'small',
    itemWidth = 'w-36',   // sensible default
}) => {
    const navigate = useNavigate();
    const CardComponent = cardType === 'large' ? LargeCard : cardType === 'medium' ? MediumCard : SmallCard;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#7E6957] text-sm tracking-[0.18em] uppercase font-bold opacity-80">{title}</h2>
                {onSeeAll && (
                    <button onClick={onSeeAll} className="text-[#9FB89F] hover:text-[#8AA88A] text-sm transition-colors">
                        See all
                    </button>
                )}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                {books.map((book) => (
                    <div key={book.id} className={`flex-shrink-0 ${itemWidth}`}>
                        <CardComponent book={book} action={() => navigate(`/book/${book.id}`)} />
                    </div>
                ))}
            </div>
        </div>
    );
};
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