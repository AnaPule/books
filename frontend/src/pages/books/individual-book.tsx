import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

//components
import { toast } from "sonner";
import { Shelves } from "@components/skeleton/shelves/Shelves";
import { LoadingCards } from "@components/skeleton/LoadingCard";

//models
import { RelationshipType, type Book } from "@models/Book";
import type { LucideProps } from 'lucide-react';

//services
import { useAuth } from "@context/AuthContext";
import { request } from "@utils/ApiRequest";
import {
    Bookmark, Download, ExternalLink, Share2,
    ChevronLeft, ChevronRight, ThumbsDown, Heart,
    ArrowLeft, Calendar, Users, BookOpen,
} from "lucide-react";

interface CircleButtonProps {
    buttonLabel: React.ComponentType<LucideProps>;
    size?: number;
    Label: string;
    fill?: string;
    color?: string;
    action?: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ buttonLabel: IconComponent, size = 20, Label, fill, color, action }) => {
    return (
        <div className="relative group">
            <button
                onClick={action}
                className="relative rounded-full bg-[#E0E9F0] text-[#5a4d41] p-3 hover:bg-[#D0E0E8] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label={Label}
            >
                <IconComponent size={size} fill={fill ?? "none"} color={color ?? "#5a4d41"} />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#5a4d41] text-[#fcf9f4] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                {Label}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#5a4d41] rotate-45"></div>
            </div>
        </div>
    );
};

export const BookHeader: React.FC<{ book: Book }> = ({ book }) => {
    const { wishlist, setWishlist, library, setLibrary, dislike, setDislike, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isInWishlist = Array.isArray(wishlist) && wishlist.some(wishlistBook => wishlistBook.id === book.id);
    const isInLibrary = Array.isArray(library) && library.some(LibraryBook => LibraryBook.id === book.id);
    const isInDislike = Array.isArray(dislike) && dislike.some(disbook => disbook.id === book.id);

    const handleGoBack = () => {
        if (location.key !== 'default') {
            navigate(-1);
        } else {
            navigate('/books');
        }
    };

    const handleBookToWishlist = () => {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading book' }), 2000));
        const dto = {
            userId: user?.id,
            book: book,
            type: RelationshipType.WISHLIST
        }
        if (!wishlist.find(wl => wl.id === book.id)) {
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setWishlist([...wishlist, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to the wishlist: ${error}`)
            }
        } else {
            try {
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.WISHLIST}`)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setWishlist(wishlist.filter(wishlistBook => wishlistBook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error removing book from wishlist: ${error}`)
            }
        }
    }

    const handleBookToLibrary = () => {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading book' }), 2000));
        const dto = {
            userId: user?.id,
            book: book,
            type: RelationshipType.LIBRARY
        }
        if (!library.find(ll => ll.id === book.id)) {
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setLibrary([...library, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to your library: ${error}`)
            }
        } else {
            try {
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.LIBRARY}`)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setLibrary(library.filter(libraryBook => libraryBook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error removing book from library: ${error}`)
            }
        }
    }

    const handleBookToDislike = () => {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading book' }), 2000));
        const dto = {
            userId: user?.id,
            book: book,
            type: RelationshipType.DISLIKE
        }
        if (!dislike.find(dl => dl.id === book.id)) {
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setDislike([...dislike, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to dislikes: ${error}`)
            }
        } else {
            try {
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.DISLIKE}`)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => `${res.message}`,
                            error: 'Error',
                        });
                        setDislike(dislike.filter(dbook => dbook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error removing book from dislikes: ${error}`)
            }
        }
    }

    return (
        <div className="bg-gradient-to-br from-[#E0E9F0] to-[#D0E0E8] py-8 px-4 sm:px-6 md:px-8 w-full border-b border-[#B0C4D0]/50 relative">
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#9CB0C0]/40" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#9CB0C0]/40" />

            <button
                onClick={handleGoBack}
                className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-[#5a4d41] hover:text-[#8098A8] transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="max-w-7xl mx-auto mt-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                <div className="relative flex-shrink-0">
                    <div
                        style={!book.coverArt ? {} : {
                            backgroundImage: `url(${book.coverArt})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                        className="w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] md:w-[280px] md:h-[420px] lg:w-[320px] lg:h-[480px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#B0C4D0]/50 relative overflow-hidden"
                    >
                        {!book.coverArt && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C0D4E0] to-[#B0C4D0] flex flex-col items-center justify-center p-6">
                                <div className="absolute left-0 top-1 bottom-2 w-[10px] h-full rounded-r bg-[#8098A8]" />
                                <h1 className="text-[#5a4d41] font-serif text-xl sm:text-2xl md:text-3xl font-medium text-center break-words px-2">
                                    {book.name}
                                </h1>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-[#9CB0C0]/10 rounded-lg -z-10 blur-md transform translate-y-4" />
                </div>

                <div className="flex-1 text-[#5a4d41] w-full max-w-6xl text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-3 w-full leading-tight">{book.name}</h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-[#7e6957] mb-4">{book.author.name}</p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                        <span className="text-sm text-[#8098A8] flex items-center gap-1">
                            <BookOpen size={16} /> {book.pageCount || '?'} pages
                        </span>
                        <span className="text-sm text-[#8098A8] flex items-center gap-1">
                            <Calendar size={16} /> {new Date(book.publicationDate).getFullYear()}
                        </span>
                        <span className="text-sm text-[#8098A8] flex items-center gap-1">
                            <Users size={16} /> {book.language}
                        </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#7e6957] italic mb-8 lg:mb-10 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                        {book.synopsis?.slice(0, 220)}...
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4">
                        <button className="bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white px-6 lg:px-8 py-3 rounded-full hover:from-[#9CB0C0] hover:to-[#8098A8] transition-all duration-300 flex items-center gap-3 text-sm lg:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Start reading
                            <ExternalLink size={18} />
                        </button>
                        <CircleButton
                            buttonLabel={Bookmark}
                            Label={"Add To Library"}
                            action={handleBookToLibrary}
                            fill={isInLibrary ? "#8098A8" : "none"}
                            color={isInLibrary ? "#8098A8" : "#5a4d41"}
                        />
                        <CircleButton
                            buttonLabel={Heart}
                            Label={"Wishlist"}
                            action={handleBookToWishlist}
                            fill={isInWishlist ? "#8098A8" : "none"}
                            color={isInWishlist ? "#8098A8" : "#5a4d41"}
                        />
                        <CircleButton
                            buttonLabel={ThumbsDown}
                            Label={"Dislike"}
                            action={handleBookToDislike}
                            fill={isInDislike ? "#8098A8" : "none"}
                            color={isInDislike ? "#8098A8" : "#5a4d41"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const BookDetails: React.FC<{ book: Book, similar: Book[], alsoLike: Book[], moreBy: Book[] }> = ({ book, similar, alsoLike, moreBy }) => {
    return (
        <div className="py-12 px-4 sm:px-6 md:px-8">
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#C0D4E0]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#B0C4D0]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-10xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-7 space-y-10">
                        <section className="bg-[#fcf9f4] rounded-xl p-6 md:p-8 border border-[#B0C4D0]/50 shadow-md">
                            <h2 className="text-2xl md:text-3xl font-serif text-[#5a4d41] mb-6 border-b border-[#B0C4D0]/30 pb-2">
                                About the Book
                            </h2>
                            <div className="space-y-4 text-[#7e6957] text-sm md:text-base leading-relaxed">
                                <p>{book.synopsis}</p>
                                <p className="italic text-[#8098A8]">
                                    "A beautifully crafted tale that transports readers to another world."
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <Shelves
                                shelf1Caption="Readers also Like"
                                shelf1={alsoLike.filter(b => b.id != book.id)}
                                shelf2Caption={"More like this"}
                                shelf2={similar.filter(b => b.id != book.id)}
                                shelf3Caption={`More by ${book.author.name}`}
                                shelf3={moreBy.filter(mb => mb.id != book.id)}
                            />
                        </section>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#fcf9f4] rounded-xl p-6 md:p-8 border border-[#B0C4D0]/50 shadow-md relative">
                            <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-[#9CB0C0]/30" />
                            <h3 className="text-lg font-serif text-[#5a4d41] mb-6 border-b border-[#B0C4D0]/30 pb-2">
                                Book Details
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Author</h4>
                                    <p className="text-[#5a4d41] font-medium">{book.author.name}</p>
                                </div>

                                {book.genre &&
                                    <>
                                        <div className="h-px bg-[#B0C4D0]/30" />
                                        <div>
                                            <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Genre</h4>
                                            <p className="text-[#5a4d41] font-medium capitalize">
                                                {book.genre.name.includes('+') ? `${book.genre.name.split('+')[0]}, ${book.genre.name.split('+')[1]}` : book.genre.name}
                                            </p>
                                        </div>
                                    </>
                                }

                                <div className="h-px bg-[#B0C4D0]/30" />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Language</h4>
                                    <p className="text-[#5a4d41] font-medium capitalize">{book.language}</p>
                                </div>

                                <div className="h-px bg-[#B0C4D0]/30" />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Format</h4>
                                    <p className="text-[#5a4d41] font-medium">Paperback, {book.pageCount || '?'} pages</p>
                                </div>

                                <div className="h-px bg-[#B0C4D0]/30" />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Publisher</h4>
                                    <p className="text-[#5a4d41] font-medium">{book.publisher || 'Unknown Publisher'}</p>
                                </div>

                                <div className="h-px bg-[#B0C4D0]/30" />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">ISBN</h4>
                                    <p className="text-[#5a4d41] font-mono text-sm break-all">{book.isbn}</p>
                                </div>

                                <div className="h-px bg-[#B0C4D0]/30" />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#8098A8] uppercase tracking-wider mb-2">Publication Date</h4>
                                    <p className="text-[#5a4d41] font-medium">
                                        {new Date(book.publicationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#fcf9f4] rounded-xl p-6 border border-[#B0C4D0]/50 shadow-md">
                            <h3 className="text-lg font-serif text-[#5a4d41] mb-4">Reading Challenge</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#7e6957]">Pages read</span>
                                    <span className="text-[#8098A8] font-medium">0 / {book.pageCount || '?'}</span>
                                </div>
                                <div className="w-full h-2 bg-[#C0D4E0]/30 rounded-full overflow-hidden">
                                    <div className="w-0 h-full bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] rounded-full" />
                                </div>
                                <button className="w-full mt-3 py-2 border border-[#8098A8] text-[#8098A8] rounded-lg hover:bg-[#8098A8] hover:text-white transition-colors text-sm">
                                    Start Reading
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#fcf9f4] rounded-xl p-6 border border-[#B0C4D0]/50 shadow-md">
                            <h3 className="text-lg font-serif text-[#5a4d41] mb-4">Community</h3>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xl font-serif text-[#8098A8]">2.4k</p>
                                    <p className="text-xs text-[#7e6957]">Readers</p>
                                </div>
                                <div>
                                    <p className="text-xl font-serif text-[#8098A8]">847</p>
                                    <p className="text-xs text-[#7e6957]">Reviews</p>
                                </div>
                                <div>
                                    <p className="text-xl font-serif text-[#8098A8]">4.5</p>
                                    <p className="text-xs text-[#7e6957]">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookPage() {
    const { user } = useAuth();
    const params = useParams();
    const [similar, setSimilar] = useState<Book[] | []>([]);
    const [alsoLike, setAlsoLike] = useState<Book[] | []>([]);
    const [moreAuthor, setMoreAuthor] = useState<Book[] | []>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [book, setBook] = useState<Book>({
        id: params.id?.toString() || '',
        name: "",
        coverArt: '',
        author: { id: "", name: "" },
        isbn: '',
        synopsis: "",
        publisher: '',
        publicationDate: "",
        pageCount: 0,
        language: '',
        genre: { id: "", name: '' }
    });

    useEffect(() => {
        if (!params.id) {
            navigate('/not-found', { replace: true });
            return;
        }

        setLoading(true);
        const initBook = async () => {
            try {
                const res = await request.get<any>(`/books/${params.id}`);
                const b: Book = {
                    id: res.book.id,
                    name: res.book.name,
                    coverArt: res.book.coverArt,
                    author: { id: res.author.id, name: res.author.name },
                    isbn: res.book.isbn,
                    synopsis: res.book.synopsis,
                    publisher: res.book.publisher,
                    publicationDate: res.book.publicationDate,
                    pageCount: res.book.pageCount,
                    language: res.book.language,
                    genre: { id: res.genre.id, name: res.genre.name }
                };
                setBook(b);

                const authorBooks = await request.get<any>(`/books/author/${res.author.id}`);
                setMoreAuthor(authorBooks.books);

                await request.get<any>(`/recs/user/${user?.id}/collaborative`)
                    .then((res: any) => setAlsoLike(res.books))
                    .catch((error: any) => console.log('Also like error', error));

                await request.get<any>(`/recs/book/${book?.id}/similar`)
                    .then((res: any) => setSimilar(res.similar))
                    .catch((error: any) => console.log('Similar error', error));

            } catch (error: any) {
                navigate('/not-found', { replace: true });
                toast.error("Pages & Parchment", { description: error.message || "Book not found" });
            } finally {
                setLoading(false);
            }
        };
        initBook();
    }, [params.id, navigate]);

    return (
        <div className="min-h-screen mt-16">
            <div className="fixed top-0 left-0 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none z-0" />
            <div className="relative z-10">
                {loading ? (
                    <LoadingCards LoadingSelection="BookHeader" />
                ) : (
                    <>
                        <BookHeader book={book} />
                        <BookDetails book={book} similar={similar} alsoLike={alsoLike} moreBy={moreAuthor} />
                    </>
                )}
            </div>
        </div>
    );
}