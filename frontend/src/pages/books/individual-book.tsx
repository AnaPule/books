import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

//components
import { toast } from "sonner";
import { Shelves } from "@components/skeleton/Shelves";
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

// Mock data for shelves
const mockSimilarBooks = [
    { id: '1', name: 'The World of Ice and Fire', coverArt: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
    { id: '2', name: 'Fantastic Beasts', coverArt: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', author: { name: 'J.K. Rowling' } },
    { id: '3', name: 'Game of Thrones', coverArt: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
    { id: '4', name: "The Wise Man's Fear", coverArt: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop', author: { name: 'Patrick Rothfuss' } },
    { id: '5', name: 'The Name of the Wind', coverArt: null, author: { name: 'Patrick Rothfuss' } },
    { id: '6', name: 'Mistborn', coverArt: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', author: { name: 'Brandon Sanderson' } },
];

const mockAuthorBooks = [
    { id: '7', name: 'A Storm of Swords', coverArt: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
    { id: '8', name: 'A Feast for Crows', coverArt: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
    { id: '9', name: 'A Dance with Dragons', coverArt: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
    { id: '10', name: 'Fire and Blood', coverArt: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop', author: { name: 'George R.R. Martin' } },
];

const CircleButton: React.FC<CircleButtonProps> = ({ buttonLabel: IconComponent, size = 20, Label, fill, color, action }) => {
    return (
        <div className="relative group">
            <button
                onClick={action}
                className="relative rounded-full bg-[#f5e6d7] text-[#5a4d41] p-3 hover:bg-[#e8cfc5] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label={Label}
            >
                <IconComponent size={size} fill={fill ?? "none"} color={color ?? "#5a4d41"} />
            </button>
            {/* Tooltip */}
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

    // Add this function to generate consistent colors from book ID
    const getBookColor = (id: string) => {
        const colors = [
            'from-[#f5e6d7] to-[#e8cfc5]', // soft blush
            'from-[#f0ddd5] to-[#d9c0b5]', // dusty rose
            'from-[#f2e0d8] to-[#dbc6bb]', // warm cream
            'from-[#edd9d0] to-[#d6bfb4]', // soft pink
            'from-[#e8d5cc] to-[#d1bbb0]', // muted peach
            'from-[#f5e0d9] to-[#decbc2]', // light terra
        ];

        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    const getDarkerShade = (id: string) => {
        const darkShades = [
            '#b58b7c', // darker dusty pink
            '#5a4d41', // darker warm brown
            '#c9a394', // darker light pink
            '#4a3f38', // darker taupe
            '#d9b6a8', // darker blush
            '#7e6957', // darker aged gold
        ];

        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % darkShades.length;
        return darkShades[index];
    };

    // Handle back navigation
    const handleGoBack = () => {
        if (location.key !== 'default') {
            navigate(-1); // Go back to previous page
        } else {
            navigate('/books'); // Fallback to books page
        }
    };

    //methods
    const handleBookToWishlist = () => {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading book' }), 2000));
        const dto = {
            userId: user?.id,
            book: book,
            type: RelationshipType.WISHLIST
        }
        if (!wishlist.find(wl => wl.id === book.id)) {
            // add book to wishlist
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => {
                                return `${res.message}`;
                            },
                            error: 'Error',
                        });

                        // updating the wish list as well
                        setWishlist([...wishlist, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to the wishlist: ${error}`)
            }
        } else {
            try {
                //remove from wishlist
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.WISHLIST}`)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => {
                                return `${res.message}`;
                            },
                            error: 'Error',
                        });

                        // updating the wish list as well
                        setWishlist(wishlist.filter(wishlistBook => wishlistBook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error adding book to the wishlist: ${error}`)
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
            // add book to library
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => {
                                return `${res.message}`;
                            },
                            error: 'Error',
                        });

                        // updating the wish list as well
                        setLibrary([...library, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to your library: ${error}`)
            }
        } else {
            //remove book from wishlist
            try {
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.LIBRARY}`)
                    .then((res: any) => {
                            toast.promise(promise, {
                                loading: 'Please wait...',
                                success: () => {
                                    return `${res.message}`;
                                },
                                error: 'Error',
                            });

                        // updating the wish list as well
                        setLibrary(library.filter(libraryBook => libraryBook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error adding book to your library: ${error}`)
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
            // add book to library
            try {
                request.post<any>(`/auth/user/books`, dto)
                    .then((res: any) => {
                        toast.promise(promise, {
                            loading: 'Please wait...',
                            success: () => {
                                return `${res.message}`;
                            },
                            error: 'Error',
                        });

                        // updating the wish list as well
                        setDislike([...dislike, book]);
                    })
            } catch (error) {
                toast.error(`Error adding book to your library: ${error}`)
            }
        } else {
            //remove book from wishlist
            try {
                request.delete<any>(`/auth/${user?.id}/books/${book.id}?type=${RelationshipType.DISLIKE}`)
                    .then((res: any) => {
                            toast.promise(promise, {
                                loading: 'Please wait...',
                                success: () => {
                                    return `${res.message}`;
                                },
                                error: 'Error',
                            });

                        // updating the wish list as well
                        setDislike(dislike.filter(dbook => dbook.id !== book.id));
                    })
            } catch (error) {
                toast.error(`Error adding book to your library: ${error}`)
            }
        }
    }

    return (
        <div className="bg-gradient-to-br from-[#faf5ea] to-[#fcf9f4] py-8 px-4 sm:px-6 md:px-8 w-full border-b border-[#e8cfc5]/50 relative">
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c9a394]/20" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c9a394]/20" />

            {/* Back button */}
            <button
                onClick={handleGoBack}
                className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-[#5a4d41] hover:text-[#c9a394] transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="max-w-7xl mx-auto mt-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                {/* Book Cover with 3D effect */}
                <div className="relative flex-shrink-0">
                    <div
                        style={!book.coverArt ? {} : {
                            backgroundImage: `url(${book.coverArt})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                        className="w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] md:w-[280px] md:h-[420px] lg:w-[320px] lg:h-[480px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#e8cfc5]/50 relative overflow-hidden"
                    >
                        {!book.coverArt && (
                            <div className={`absolute inset-0 bg-gradient-to-br 'from-[#f5e0d9] to-[#decbc2] flex flex-col items-center justify-center p-6`}>
                                {/* Spine line - darker version of the same color */}
                                <div
                                    className="absolute left-0 top-1 bottom-2 w-[10px] h-full rounded-r"
                                    style={{ backgroundColor: '#7e6957' }}
                                ></div>
                                <h1 className="text-[#5a4d41] font-serif text-xl sm:text-2xl md:text-3xl font-medium text-center break-words px-2">
                                    {book.name}
                                </h1>
                            </div>
                        )}
                    </div>
                    {/* Subtle shadow */}
                    <div className="absolute inset-0 bg-[#c9a394]/5 rounded-lg -z-10 blur-md transform translate-y-4" />
                </div>

                {/* Book Info */}
                <div className="flex-1 text-[#5a4d41] w-full max-w-6xl text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-3 w-full leading-tight">{book.name}</h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-[#7e6957] mb-4">{book.author.name}</p>

                    {/* Quick stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                        <span className="text-sm text-[#c9a394] flex items-center gap-1">
                            <BookOpen size={16} /> {book.pageCount || '?'} pages
                        </span>
                        <span className="text-sm text-[#c9a394] flex items-center gap-1">
                            <Calendar size={16} /> {new Date(book.publicationDate).getFullYear()}
                        </span>
                        <span className="text-sm text-[#c9a394] flex items-center gap-1">
                            <Users size={16} /> {book.language}
                        </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#7e6957] italic mb-8 lg:mb-10 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                        {book.synopsis?.slice(0, 220)}...
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4">
                        <button className="bg-gradient-to-r from-[#c9a394] to-[#b58b7c] text-white px-6 lg:px-8 py-3 rounded-full hover:from-[#b58b7c] hover:to-[#a68569] transition-all duration-300 flex items-center gap-3 text-sm lg:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Start reading
                            <ExternalLink size={18} />
                        </button>
                        <CircleButton
                            buttonLabel={Bookmark}
                            Label={"Add To Library"}
                            action={handleBookToLibrary}
                            fill={isInLibrary ? "#c9a394" : "none"}
                            color={isInLibrary ? "#c9a394" : "#5a4d41"}
                        />
            
                        <CircleButton
                            buttonLabel={Heart}
                            Label={"Wishlist"}
                            action={handleBookToWishlist}
                            fill={isInWishlist ? "#c9a394" : "none"}
                            color={isInWishlist ? "#c9a394" : "#5a4d41"}
                        />

                        <CircleButton
                            buttonLabel={ThumbsDown}
                            Label={"Dislike"}
                            action={handleBookToDislike}
                            fill={isInDislike ? "#c9a394" : "none"}
                            color={isInDislike ? "#c9a394" : "#5a4d41"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const BookDetails: React.FC<Book> = (book) => {
    const { wishlist, setWishlist, library, setLibrary, dislike, setDislike, user } = useAuth();
    return (
        <div className="min-h-screen bg-[#faf5ea] py-12 px-4 sm:px-6 md:px-8">
            {/* Decorative elements */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#e8cfc5]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Description */}
                        <section className="bg-[#fcf9f4] rounded-xl p-6 md:p-8 border border-[#e8cfc5]/50 shadow-md">
                            <h2 className="text-2xl md:text-3xl font-serif text-[#5a4d41] mb-6 border-b border-[#e8cfc5]/30 pb-2">
                                About the Book
                            </h2>
                            <div className="space-y-4 text-[#7e6957] text-sm md:text-base leading-relaxed">
                                <p>{book.synopsis}</p>
                                <p className="italic text-[#c9a394]">
                                    "A beautifully crafted tale that transports readers to another world."
                                </p>
                            </div>
                        </section>

                        {/* More Like This - Using Shelves Component */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl md:text-3xl font-serif text-[#5a4d41]">Readers Also Loved</h2>
                                <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 text-sm transition-colors">
                                    See all <ChevronRight size={16} />
                                </button>
                            </div>
                            <Shelves shelf1Caption="" shelf1={wishlist} /> {/* // TO DO: change this up */}
                        </section>

                        {/* More by Author - Using Shelves Component */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl md:text-3xl font-serif text-[#5a4d41]">More by {book.author.name}</h2>
                                <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 text-sm transition-colors">
                                    See all <ChevronRight size={16} />
                                </button>
                            </div>
                            <Shelves shelf1Caption="" shelf1={wishlist} /> {/* // TO DO: change this up */}
                        </section>
                    </div>

                    {/* Right Column - Metadata Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Metadata Card */}
                        <div className="bg-[#fcf9f4] rounded-xl p-6 md:p-8 border border-[#e8cfc5]/50 shadow-md relative">
                            <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-[#c9a394]/20" />

                            <h3 className="text-lg font-serif text-[#5a4d41] mb-6 border-b border-[#e8cfc5]/30 pb-2">
                                Book Details
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">Author</h4>
                                    <p className="text-[#5a4d41] font-medium">{book.author.name}</p>
                                </div>

                                <div className="h-px bg-[#e8cfc5]/30" />

                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">Language</h4>
                                    <p className="text-[#5a4d41] font-medium capitalize">{book.language}</p>
                                </div>

                                <div className="h-px bg-[#e8cfc5]/30" />

                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">Format</h4>
                                    <p className="text-[#5a4d41] font-medium">Paperback, {book.pageCount || '?'} pages</p>
                                </div>

                                <div className="h-px bg-[#e8cfc5]/30" />

                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">Publisher</h4>
                                    <p className="text-[#5a4d41] font-medium">{book.publisher || 'Unknown Publisher'}</p>
                                </div>

                                <div className="h-px bg-[#e8cfc5]/30" />

                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">ISBN</h4>
                                    <p className="text-[#5a4d41] font-mono text-sm break-all">{book.isbn}</p>
                                </div>

                                <div className="h-px bg-[#e8cfc5]/30" />

                                <div>
                                    <h4 className="text-xs font-semibold text-[#c9a394] uppercase tracking-wider mb-2">Publication Date</h4>
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

                        {/* Reading Challenge Widget */}
                        <div className="bg-[#fcf9f4] rounded-xl p-6 border border-[#e8cfc5]/50 shadow-md">
                            <h3 className="text-lg font-serif text-[#5a4d41] mb-4">Reading Challenge</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#7e6957]">Pages read</span>
                                    <span className="text-[#c9a394] font-medium">0 / {book.pageCount || '?'}</span>
                                </div>
                                <div className="w-full h-2 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                                    <div className="w-0 h-full bg-gradient-to-r from-[#c9a394] to-[#b58b7c] rounded-full" />
                                </div>
                                <button className="w-full mt-3 py-2 border border-[#c9a394] text-[#c9a394] rounded-lg hover:bg-[#c9a394] hover:text-white transition-colors text-sm">
                                    Start Reading
                                </button>
                            </div>
                        </div>

                        {/* Community Stats */}
                        <div className="bg-[#fcf9f4] rounded-xl p-6 border border-[#e8cfc5]/50 shadow-md">
                            <h3 className="text-lg font-serif text-[#5a4d41] mb-4">Community</h3>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xl font-serif text-[#c9a394]">2.4k</p>
                                    <p className="text-xs text-[#7e6957]">Readers</p>
                                </div>
                                <div>
                                    <p className="text-xl font-serif text-[#c9a394]">847</p>
                                    <p className="text-xs text-[#7e6957]">Reviews</p>
                                </div>
                                <div>
                                    <p className="text-xl font-serif text-[#c9a394]">4.5</p>
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
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [book, setBook] = useState<Book>({
        id: params.id?.toString() || '',
        name: "",
        coverArt: '',
        author: {
            id: "",
            name: ""
        },
        isbn: '',
        synopsis: "",
        publisher: '',
        publicationDate: "",
        pageCount: 0,
        language: ''
    });

    useEffect(() => {
        if (!params.id) {
            navigate('/not-found', { replace: true });
            return;
        }

        setLoading(true);
        //const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading book' }), 5000));
        request.get<any>(`/books/${params.id}`)
            .then(
                (res: any) => {
                    const b: Book = {
                        id: res.book.id,
                        name: res.book.name,
                        coverArt: res.book.coverArt,
                        author: {
                            id: res.author.id,
                            name: res.author.name
                        },
                        isbn: res.book.isbn,
                        synopsis: res.book.synopsis,
                        publisher: res.book.publisher,
                        publicationDate: res.book.publicationDate,
                        pageCount: res.book.pageCount,
                        language: res.book.language
                    };
                    setBook(b)
                }
            ).catch(
                (error) => {
                    navigate('/not-found', { replace: true });
                    console.error('Fetch error', error);
                    toast.error("Pages ń Parchment", {
                        description: error.message || "Book not found"
                    });
                }
            ).finally(
                () => {
                    setLoading(false);
                }
            )
    }, [params.id, navigate]);

    return (
        <div className="min-h-screen bg-[#faf5ea]">
            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#e8cfc5]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none z-0" />

            <div className="relative z-10">
                {loading ? (
                    <LoadingCards LoadingSelection="BookHeader" />
                ) : (
                    <>
                        <BookHeader book={book} />
                        <BookDetails {...book} />
                    </>
                )}
            </div>
        </div>
    );
}