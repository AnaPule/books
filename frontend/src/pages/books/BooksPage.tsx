{/* =============== packages ============ */ }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

{/* =============== models ============ */ }
import type { Book as Bk } from "@models/Book";

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";

{/* =============== components ============ */ }
import { Shelves } from "@components/skeleton/shelves/Shelves";
import { ReadingGoals, CurrentReads } from "@pages/profile/profile";
import { NoResults } from "@components/skeleton/noResults";
import { WordOfTheDay } from "@components/skeleton/WordofTheDay";
import { DateTimeCard } from '@components/skeleton/DateTimeCard';
import { Calendar } from "@components/skeleton/calendar/Calendar";
import { Search, Bell, ChevronLeft, ChevronRight, Clock, Bookmark, Menu, Book, Sparkles, Feather, Target } from "lucide-react";

interface Book {
    id: string;
    title: string;
    author: string;
    cover: string;
    genre?: string;
}

interface CardProps {
    book: Bk;
    action?: () => void;
}

export const SmallCard: React.FC<CardProps> = ({
    book,
    action
}: CardProps) => {
    return (
        <div
            onClick={action}
            key={book.id}
            className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
            <div
                className="w-full aspect-[2/3] rounded-lg shadow-md mb-3 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-[#e8cfc5]/30 relative overflow-hidden bg-[#fcf9f4]"
                style={{
                    backgroundImage: `url(${book.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Light academia overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f5d6d4]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="font-sans font-medium text-sm text-[#5a4d41] line-clamp-2 mb-1 group-hover:text-[#c9a394] transition-colors">
                {book.name}
            </h3>
            <p className="text-xs text-[#7e6957] italic">{book.author.name}</p>
        </div>
    );
};

const BooksPage = () => {
    const navigate = useNavigate();
    const { user, recommends, genre, author, popular, discover } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data (your existing mock data stays exactly the same)
    const continueReading = {
        title: "The Cambers of Secrets",
        author: "JK Rowlings",
        progress: 154,
        total: 300,
        cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
        preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    };

    const popularNow: Book[] = [
        { id: 'fa3e1102-cabc-4a95-8268-43527b730a5d', title: 'The World of Ice and Fire', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop' },
        { id: 'e136c7a7-6ff5-4382-a1f2-37c348e67068', title: 'Fantastic Beasts', author: 'J.K. Rowling', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop' },
        { id: '2b5352a2-6fcf-42aa-b497-5d7944203f7c', title: 'Game of Thrones', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop' },
        { id: '5c076ba9-6ef0-4ae7-91e5-e0e1c0c26cd6', title: "The Wise Man's Fear", author: 'Patrick Rothfuss', cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop' },
    ];

    const newCollection = {
        title: "A Legend of Ice and Fire: The Ice Horse",
        volumes: 2,
        chaptersPerVol: 8,
        cover1: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
        cover2: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop'
    };

    const readerFriends = [
        {
            name: "Roberto Jordan",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            activity: "What a delightful and magical chapter it is! It indeed transports readers to the wizarding world.",
            chapter: "Chapter Five: Diagon Alley",
            time: "2 min ago"
        },
        {
            name: "Anna Henry",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            activity: "I finished reading the chapter last night and",
            chapter: "",
            time: "5 min ago"
        }
    ];

    return (
        <div className="min-h-screen bg-[#faf5ea] text-[#5a4d41] font-sans relative pt-20 md:pt-20 sm:pt-20">
            {/* Light academia decorative blurs */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#e8cfc5]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 z-0" />

            {/* Corner flourishes */}
            <div className="fixed top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#c9a394]/20 z-0" />
            <div className="fixed top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#c9a394]/20 z-0" />
            <div className="fixed bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#c9a394]/20 z-0" />
            <div className="fixed bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#c9a394]/20 z-0" />

            {/* Paper texture overlay - very subtle */}
            <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjczNTUiLz48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0iI2Q0Yjg4YSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay z-0" />

            {/* Header */}
            <div className="relative z-10 bg-[#fcf9f4]/80 backdrop-blur-sm border-b border-[#e8cfc5]/50 px-4 sm:px-6 md:px-8 py-4 md:py-5 sticky top-0">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
                    <div className="w-full sm:flex-1 sm:max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c9a394]" size={20} />
                            <input
                                type="text"
                                placeholder="Search book name, author, edition ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#fcf9f4] text-[#5a4d41] placeholder-[#b8a58f] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a394]/30 border border-[#e8cfc5]/50 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:ml-8 w-full sm:w-auto justify-center sm:justify-end">
                        <img
                            src={user?.profilePhoto || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"}
                            alt={user?.username}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#c9a394]/30"
                        />
                        <span className="font-medium text-[#5a4d41] hidden sm:block">{user?.username}</span>
                        <button className="border-none bg-transparent p-2 hover:scale-110 transition-all duration-300">
                            <Bell size={20} className="text-[#c9a394] hover:text-[#8d6c45]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 overflow-y-auto">
                {/* Content Grid */}
                <div className="max-w-12xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-6 space-y-8 md:space-y-12">
                            {/* Welcome Header */}
                            <div className="relative">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-2 text-[#5a4d41] tracking-wide">
                                    Happy reading, <span className="text-[#c9a394]">{user?.username}</span>!
                                </h2>
                                <div className="absolute -top-4 -left-4 w-8 h-8 md:w-12 md:h-12 border-l-2 border-t-2 border-[#c9a394]/20 hidden sm:block" />
                            </div>

                            {/* Popular Now - Mobile responsive grid */}
                            <section>
                                <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                    <h2 className="text-xl sm:text-2xl uppercase font-sans text-[#5a4d41] tracking-wide">popular</h2>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                        SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                    </button>
                                </div>
                                {
                                    !popular || popular.length === 0 ? (
                                        <NoResults
                                            WarningLabel="We have no popular books! Dear me"
                                        />
                                    ) : (
                                        <div className="relative">
                                            {/* Scrollable container */}
                                            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scroll-smooth hide-scrollbar">
                                                {popular.map((book) => (
                                                    <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                                                        <SmallCard
                                                            action={() => navigate(`/book/${book.id}`)}
                                                            book={book}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Optional: Scroll buttons */}
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: -200, behavior: 'smooth' });
                                                }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: 200, behavior: 'smooth' });
                                                }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )
                                }
                            </section>

                            {/* New Series Collection */}
                            <section>
                                <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                    <h2 className="text-xl sm:text-2xl font-sans text-[#5a4d41] tracking-wide">NEW SERIES COLLECTION</h2>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] transition-colors text-xl leading-none">⋯</button>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#fcf9f4] p-4 sm:p-6 rounded-xl border border-[#e8cfc5]/50 shadow-md relative group hover:border-[#c9a394]/50 transition-all duration-300">
                                    {/* Decorative corner */}
                                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-[#c9a394]/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex gap-2 sm:gap-3">
                                        <div
                                            className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 rounded-lg shadow-md border border-[#e8cfc5]/30 relative overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${newCollection.cover1})`,
                                                backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#f5d6d4]/10 to-transparent" />
                                        </div>
                                        <div
                                            className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 rounded-lg shadow-md border border-[#e8cfc5]/30 relative overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${newCollection.cover2})`,
                                                backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#f5d6d4]/10 to-transparent" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-base sm:text-lg font-sans text-[#5a4d41] mb-1 sm:mb-2">{newCollection.title}</h3>
                                        <p className="text-xs sm:text-sm text-[#7e6957]">{newCollection.chaptersPerVol} chapters each vol</p>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <span className="text-2xl sm:text-3xl font-sans text-[#c9a394]">{newCollection.volumes}</span>
                                        <p className="text-xs text-[#7e6957]">volumes</p>
                                    </div>
                                </div>
                            </section>

                            {/* Recommended For You */}
                            <section>
                                <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                    <h2 className="text-xl sm:text-2xl font-sans text-[#5a4d41] tracking-wide">RECOMMENDED FOR YOU</h2>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                        SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                    </button>
                                </div>
                                {
                                    !recommends || recommends.length === 0 ? (
                                        <NoResults
                                            WarningLabel="We currently have no books recommended for you. Sorry!"
                                        />
                                    ) : (
                                        <div className="relative">
                                            {/* Scrollable container */}
                                            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scroll-smooth hide-scrollbar">
                                                {recommends.map((book) => (
                                                    <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                                                        <SmallCard
                                                            action={() => navigate(`/book/${book.id}`)}
                                                            book={book}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Optional: Scroll buttons */}
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: -200, behavior: 'smooth' });
                                                }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: 200, behavior: 'smooth' });
                                                }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )
                                }
                            </section>

                            {/* User Genres */}
                            <section>
                                <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                    <h2 className="text-xl sm:text-2xl font-sans text-[#5a4d41] tracking-wide uppercase">based on your favourite genres</h2>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                        SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                    </button>
                                </div>
                                {
                                    !genre || genre.length === 0 ? (
                                        <NoResults
                                            WarningLabel="We currently have no books recommended for you. Sorry!"
                                        />
                                    ) : (
                                        <div className="relative">
                                            {/* Scrollable container */}
                                            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scroll-smooth hide-scrollbar">
                                                {genre.map((book) => (
                                                    <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                                                        <SmallCard
                                                            action={() => navigate(`/book/${book.id}`)}
                                                            book={book}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Optional: Scroll buttons */}
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: -200, behavior: 'smooth' });
                                                }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: 200, behavior: 'smooth' });
                                                }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )
                                }
                            </section>

                            {/* By Favorite Author */}
                            <section>
                                <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                    <h2 className="text-xl sm:text-2xl font-sans text-[#5a4d41] tracking-wide uppercase">more by {author[0]?.author.name}</h2>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                        SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                    </button>
                                </div>
                                {
                                    !author || author.length === 0 ? (
                                        <NoResults
                                            WarningLabel="We currently have no books recommended for you. Sorry!"
                                        />
                                    ) : (
                                        <div className="relative">
                                            {/* Scrollable container */}
                                            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scroll-smooth hide-scrollbar">
                                                {author.map((book) => (
                                                    <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                                                        <SmallCard
                                                            action={() => navigate(`/book/${book.id}`)}
                                                            book={book}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Optional: Scroll buttons */}
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: -200, behavior: 'smooth' });
                                                }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const container = document.querySelector('.scroll-container');
                                                    container?.scrollBy({ left: 200, behavior: 'smooth' });
                                                }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )
                                }
                            </section>

                            {/* Bottom Banner */}
                            <div className="bg-[#fcf9f4] p-4 sm:p-5 rounded-xl border border-[#e8cfc5]/50 shadow-md flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between relative group hover:border-[#c9a394]/50 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-[#c9a394]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#7e6957]">
                                    <span className="text-[#c9a394] text-base sm:text-lg">✧</span>
                                    <span>Got chance to check out the <span className="text-[#c9a394] font-medium">new collection</span> of Harry Potter? It's a must-read for any fan of the series, don't miss out!</span>
                                </div>
                                <span className="text-[#c9a394] font-sans text-base sm:text-lg">04 <span className="text-[#7e6957] text-xs sm:text-sm">/ 60 books</span></span>
                            </div>
                        </div>


                        {/* middle column - discover */}
                        {
                            discover && discover.length > 0 &&
                            <>
                                <div className="lg:col-span-3 space-y-2">
                                    {/* heading */}
                                    <div className="flex items-center justify-between mb-4 border-b border-[#e8cfc5]/30 pb-2">
                                        <h2 className="text-xl sm:text-2xl uppercase font-sans text-[#5a4d41] tracking-wide">Discover</h2>
                                        <button className="text-[#c9a394] hover:text-[#8d6c45] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                            SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                        </button>
                                    </div>

                                    {/* content */}
                                    <section>
                                        {/* Desktop view - vertical scroll */}
                                        <div className="hidden lg:block h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#c9a394]/30 scrollbar-track-[#e8cfc5]/10">
                                            {discover.map((book) => (
                                                <div
                                                    key={book.id}
                                                    onClick={() => navigate(`/book/${book.id}`)}
                                                    className="group cursor-pointer transition-all duration-300 hover:-translate-x-1"
                                                >
                                                    <div className="flex gap-3 items-center bg-[#fcf9f4] rounded-lg p-3 border border-[#e8cfc5]/30 hover:border-[#c9a394]/50 shadow-sm hover:shadow-md transition-all duration-300">
                                                        {/* Book cover thumbnail */}
                                                        <div
                                                            className="w-12 h-16 rounded-md shadow-sm flex-shrink-0 bg-cover bg-center border border-[#e8cfc5]/30"
                                                            style={{
                                                                backgroundImage: `url(${book.coverArt})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'
                                                            }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm text-[#5a4d41] line-clamp-1 group-hover:text-[#c9a394] transition-colors">
                                                                {book.name}
                                                            </h4>
                                                            <p className="text-xs text-[#7e6957] mt-1">{book.author.name}</p>
                                                        </div>
                                                        <ChevronRight size={16} className="text-[#c9a394] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Mobile view - horizontal scroll like popular section */}
                                        <div className="lg:hidden relative">
                                            <div className="flex overflow-x-auto gap-4 pb-4 scroll-smooth hide-scrollbar">
                                                {discover.map((book) => (
                                                    <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                                                        <SmallCard
                                                            action={() => navigate(`/book/${book.id}`)}
                                                            book={book}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Scroll buttons for mobile */}
                                            {discover.length > 3 && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            const container = document.querySelector('#discover-scroll');
                                                            if (container) {
                                                                container.scrollBy({ left: -200, behavior: 'smooth' });
                                                            }
                                                        }}
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition lg:hidden"
                                                    >
                                                        ←
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const container = document.querySelector('#discover-scroll');
                                                            if (container) {
                                                                container.scrollBy({ left: 200, behavior: 'smooth' });
                                                            }
                                                        }}
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition lg:hidden"
                                                    >
                                                        →
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </>
                        }

                        {/* Right Sidebar - Profile Components */}
                        <div className="lg:col-span-3 space-y-4 md:space-y-6">
                            {/* Current Reading Card - Updated colors */}
                            <CurrentReads />

                            {/*
                            <div className="bg-[#fcf9f4] rounded-xl p-4 md:p-6 border border-[#e8cfc5]/50 shadow-md relative group hover:border-[#c9a394]/50 transition-all duration-300">
                                <div className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 border-r-2 border-t-2 border-[#c9a394]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                        alt="User"
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#c9a394]/30"
                                    />
                                    <div>
                                        <span className="font-medium text-[#5a4d41] text-sm md:text-base">Alexander Mark</span>
                                        <p className="text-[10px] md:text-xs text-[#7e6957]">Current Read</p>
                                    </div>
                                </div>
                                
                                <div className="relative mb-4">
                                    <div
                                        className="w-full h-24 md:h-32 rounded-lg border border-[#e8cfc5]/30 relative overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${continueReading.preview})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f4] via-transparent to-transparent" />
                                    </div>
                                    <div className="absolute -bottom-3 md:-bottom-4 left-3 md:left-4">
                                        <div
                                            className="w-14 h-18 md:w-16 md:h-20 rounded-lg shadow-md border-2 border-[#c9a394]/30"
                                            style={{
                                                backgroundImage: `url(${continueReading.cover})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-6 md:mt-8">
                                    <h3 className="text-base md:text-lg font-sans text-[#5a4d41] mb-1 leading-tight">{continueReading.title}</h3>
                                    <p className="text-[#7e6957] text-xs md:text-sm italic mb-3 md:mb-4">~ {continueReading.author}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs md:text-sm">
                                            <span className="text-[#7e6957]">Progress</span>
                                            <span className="text-[#c9a394]">{continueReading.progress} <span className="text-[#7e6957]">/ {continueReading.total}</span></span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#c9a394] to-[#b58b7c] rounded-full transition-all duration-500"
                                                style={{ width: `${(continueReading.progress / continueReading.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs md:text-sm text-[#7e6957] mt-3 md:mt-4 leading-relaxed line-clamp-2">
                                        Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that...
                                    </p>
                                </div>
                            </div>
*/}
                            {/* Word of the Day */}
                            <WordOfTheDay />

                            {/* DateTime Card */}
                            <DateTimeCard />

                            {/* Calendar */}
                            <Calendar />

                            {/* Reading Goals */}
                            <ReadingGoals />

                            {/* Reader Friends - Updated colors */}
                            <div className="bg-[#fcf9f4] rounded-xl p-4 md:p-6 border border-[#e8cfc5]/50 shadow-md relative group hover:border-[#c9a394]/50 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4 md:mb-5 border-b border-[#e8cfc5]/30 pb-2">
                                    <h3 className="text-base md:text-lg font-sans text-[#5a4d41] tracking-wide">READER FRIENDS</h3>
                                    <button className="text-[#c9a394] hover:text-[#8d6c45] transition-colors text-xl leading-none">⋯</button>
                                </div>
                                <div className="space-y-4 md:space-y-5">
                                    {readerFriends.map((friend, idx) => (
                                        <div key={idx}>
                                            {idx > 0 && <div className="h-px bg-[#e8cfc5]/30 my-3 md:my-4" />}
                                            <div className="flex items-start gap-3 group/item">
                                                <img
                                                    src={friend.avatar}
                                                    alt={friend.name}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 border border-[#c9a394]/30"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#5a4d41] mb-1 text-xs md:text-sm">{friend.name}</p>
                                                    <p className="text-[10px] md:text-xs text-[#7e6957] leading-relaxed mb-1">
                                                        {friend.activity}
                                                    </p>
                                                    {friend.chapter && (
                                                        <p className="text-[10px] md:text-xs text-[#c9a394] mb-1">✓ {friend.chapter}</p>
                                                    )}
                                                    <p className="text-[8px] md:text-[10px] text-[#7e6957]">{friend.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="text-center text-[#c9a394] text-[10px] md:text-xs pt-2 md:pt-4">
                                <span className="tracking-[0.3em]">✧ ✧ ✧</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksPage;