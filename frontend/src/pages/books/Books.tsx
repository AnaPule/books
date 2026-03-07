//react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//models
import type { Book as Bk} from "@models/Book";

//components
import { NoResults } from "@components/skeleton/noResults";
import { Search, Bell, ChevronLeft, ChevronRight, Clock, Bookmark, Menu, Book } from "lucide-react";

//import services
import { useAuth } from "@context/AuthContext";

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
                className="w-full aspect-[2/3] rounded-lg shadow-xl mb-3 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/10 relative overflow-hidden"
                style={{
                    backgroundImage: `url(${book.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Vintage overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="font-sans font-medium text-sm text-[#f0e0c0] line-clamp-2 mb-1 group-hover:text-[#d4b88a] transition-colors">
                {book.name}
            </h3>
            <p className="text-xs text-[#8b7355] italic">{book.author.name}</p>
        </div>
    );
};

const BooksPage = () => {
    const navigate = useNavigate();
    const { user, recommends } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data
    const continueReading = {
        title: "The Cambers of Secrets",
        author: "JK Rowlings",
        progress: 154,
        total: 300,
        cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
        preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    };

    const popularNow: Book[] = [
        { id: '1', title: 'The World of Ice and Fire', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop' },
        { id: '2', title: 'Fantastic Beasts', author: 'J.K. Rowling', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop' },
        { id: '3', title: 'Game of Thrones', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop' },
        { id: '4', title: "The Wise Man's Fear", author: 'Patrick Rothfuss', cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop' },
    ];

    const newCollection = {
        title: "A Legend of Ice and Fire: The Ice Horse",
        volumes: 2,
        chaptersPerVol: 8,
        cover1: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
        cover2: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop'
    };

    const recommendedForYou: Book[] = [
        { id: '5', title: 'The Name of the Wind', author: 'Patrick Rothfuss', cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=300&h=450&fit=crop', genre: 'Fantasy' },
        { id: '6', title: 'Mistborn', author: 'Brandon Sanderson', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', genre: 'Fantasy' },
        { id: '7', title: 'The Way of Kings', author: 'Brandon Sanderson', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', genre: 'Fantasy' },
        { id: '8', title: 'Blood Song', author: 'Anthony Ryan', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop', genre: 'Fantasy' },
    ];

    const fantasyBooks: Book[] = [
        { id: '9', title: 'The Blade Itself', author: 'Joe Abercrombie', cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop' },
        { id: '10', title: 'The Fifth Season', author: 'N.K. Jemisin', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop' },
        { id: '11', title: 'The Lies of Locke Lamora', author: 'Scott Lynch', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop' },
        { id: '12', title: 'Gardens of the Moon', author: 'Steven Erikson', cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=300&h=450&fit=crop' },
    ];

    const byFavoriteAuthor: Book[] = [
        { id: '13', title: 'A Storm of Swords', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop' },
        { id: '14', title: 'A Feast for Crows', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop' },
        { id: '15', title: 'A Dance with Dragons', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop' },
        { id: '16', title: 'Fire and Blood', author: 'George R.R. Martin', cover: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=300&h=450&fit=crop' },
    ];

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
        <div className="min-h-screen bg-[#0b0702] text-[#d2b48c] font-sans relative">
            {/* Vignette overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />
            
            {/* Additional vignette layer */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
                    mixBlendMode: 'multiply',
                    zIndex: 2,
                }}
            />

            {/* Paper texture overlay */}
            <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjczNTUiLz48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0iI2Q0Yjg4YSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay z-0" />

            {/* Header */}
            <div className="relative z-10 backdrop-blur-sm border-b border-white/10 px-8 py-5 sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8b7355]" size={20} />
                            <input
                                type="text"
                                placeholder="Search book name, author, edition ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#1a0f05]/50 text-[#f0e0c0] placeholder-[#8b7355] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4b88a]/30 border border-white/10 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-8">
                        <img
                            src={`${user?.profilePhoto}`}
                            alt={user?.username}
                            className="w-11 h-11 rounded-full border-2 border-[#d4b88a]/30"
                        />
                        <span className="font-medium text-[#f0e0c0]">{user?.username}</span>
                        <button className="border-none bg-transparent p-2 hover:scale-110 transition-all duration-300">
                            <Bell size={20} className="text-[#8b7355] hover:text-[#d4b88a]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 overflow-y-auto">
                {/* Content Grid */}
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="col-span-8 space-y-12">
                            {/* Welcome Header */}
                            <div className="relative">
                                <h2 className="text-5xl font-serif mb-2 text-[#f0e0c0] tracking-wide">
                                    Happy reading, <span className="text-[#d4b88a]">{user?.username}</span>!
                                </h2>
                                <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-[#d4b88a]/20" />
                            </div>

                            {/* Popular Now */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                                    <h2 className="text-2xl font-serif text-[#f0e0c0] tracking-wide">POPULAR NOW</h2>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] transition-colors text-xl leading-none">⋯</button>
                                </div>
                                <div className="grid grid-cols-4 gap-6">
                                    {popularNow.map((book) => (
                                        <div key={book.id} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                                            <div
                                                className="w-full aspect-[2/3] bg-[#1a0f05] rounded-lg shadow-xl mb-3 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/10 relative overflow-hidden"
                                                style={{
                                                    backgroundImage: `url(${book.cover})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <h3 className="font-sans font-medium text-sm text-[#f0e0c0] line-clamp-2 mb-1 group-hover:text-[#d4b88a] transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-[#8b7355] italic">{book.author}</p>
                                        </div>
                                    ))}
                </div>
                            </section>

                            {/* New Series Collection */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                                    <h2 className="text-2xl font-serif text-[#f0e0c0] tracking-wide">NEW SERIES COLLECTION</h2>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] transition-colors text-xl leading-none">⋯</button>
                                </div>
                                <div className="flex items-center gap-6 bg-[#1a0f05]/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 relative group hover:border-[#d4b88a]/30 transition-all duration-300">
                                    {/* Decorative corner */}
                                    <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[#d4b88a]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex gap-3">
                                        <div
                                            className="w-24 h-36 rounded-lg shadow-xl border border-white/10 relative overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${newCollection.cover1})`,
                                                backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        </div>
                                        <div
                                            className="w-24 h-36 rounded-lg shadow-xl border border-white/10 relative overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${newCollection.cover2})`,
                                                backgroundSize: 'cover'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-serif text-[#f0e0c0] mb-2">{newCollection.title}</h3>
                                        <p className="text-sm text-[#8b7355]">{newCollection.chaptersPerVol} chapters each vol</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-serif text-[#d4b88a]">{newCollection.volumes}</span>
                                        <p className="text-sm text-[#8b7355]">volumes</p>
                                    </div>
                                </div>
                            </section>

                            {/* Recommended For You */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                                    <h2 className="text-2xl font-serif text-[#f0e0c0] tracking-wide">RECOMMENDED FOR YOU</h2>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] flex items-center gap-2 transition-colors text-sm">
                                        SEE ALL <ChevronRight size={16} />
                                    </button>
                                </div>
                                {
                                    recommends.length === 0 ? (
                                        <NoResults
                                            WarningLabel="We currently have no books recommended for you. Sorry!"
                                        />
                                    ) : (
                                        <div className="grid grid-cols-4 gap-6">
                                            {recommends.slice(0, 4).map((book) => (
                                                <SmallCard
                                                    key={book.id}
                                                    action={() => navigate(`/individual-book/${book.id}`)}
                                                    book={book}
                                                />
                                            ))}
                                        </div>
                                    )
                                }
                            </section>

                            {/* Fantasy Genre */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                                    <h2 className="text-2xl font-serif text-[#f0e0c0] tracking-wide">EXPLORE FANTASY</h2>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] flex items-center gap-2 transition-colors text-sm">
                                        SEE ALL <ChevronRight size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-6">
                                    {fantasyBooks.map((book) => (
                                        <div key={book.id} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                                            <div
                                                className="w-full aspect-[2/3] rounded-lg shadow-xl mb-3 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/10 relative overflow-hidden"
                                                style={{
                                                    backgroundImage: `url(${book.cover})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <h3 className="font-sans font-medium text-sm text-[#f0e0c0] line-clamp-2 mb-1 group-hover:text-[#d4b88a] transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-[#8b7355] italic">{book.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* By Favorite Author */}
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                                    <h2 className="text-2xl font-serif text-[#f0e0c0] tracking-wide">MORE BY GEORGE RR MARTIN</h2>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] flex items-center gap-2 transition-colors text-sm">
                                        SEE ALL <ChevronRight size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-6">
                                    {byFavoriteAuthor.map((book) => (
                                        <div key={book.id} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                                            <div
                                                className="w-full aspect-[2/3] rounded-lg shadow-xl mb-3 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/10 relative overflow-hidden"
                                                style={{
                                                    backgroundImage: `url(${book.cover})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <h3 className="font-sans font-medium text-sm text-[#f0e0c0] line-clamp-2 mb-1 group-hover:text-[#d4b88a] transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-[#8b7355] italic">{book.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Bottom Banner */}
                            <div className="bg-[#1a0f05]/30 backdrop-blur-sm p-5 rounded-xl border border-white/10 flex items-center justify-between relative group hover:border-[#d4b88a]/30 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#d4b88a]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 text-sm text-[#d2b48c]">
                                    <span className="text-[#8b7355] text-lg">✧</span>
                                    <span>Got chance to check out the <span className="text-[#d4b88a] font-medium">new collection</span> of Harry Potter? It's a must-read for any fan of the series, don't miss out!</span>
                                </div>
                                <span className="text-[#d4b88a] font-serif text-lg">04 <span className="text-[#8b7355]">/ 60 books</span></span>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="col-span-4 space-y-6">
                            {/* Current Reading Card */}
                            <div className="bg-[#1a0f05]/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group hover:border-[#d4b88a]/30 transition-all duration-300">
                                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[#d4b88a]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                        alt="User"
                                        className="w-12 h-12 rounded-full border-2 border-[#d4b88a]/30"
                                    />
                                    <div>
                                        <span className="font-medium text-[#f0e0c0]">Alexander Mark</span>
                                        <p className="text-xs text-[#8b7355]">Current Read</p>
                                    </div>
                                </div>
                                
                                <div className="relative mb-4">
                                    <div
                                        className="w-full h-32 rounded-lg border border-white/10 relative overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${continueReading.preview})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0702] via-transparent to-transparent" />
                                    </div>
                                    <div className="absolute -bottom-4 left-4">
                                        <div
                                            className="w-16 h-20 rounded-lg shadow-xl border-2 border-[#d4b88a]/30"
                                            style={{
                                                backgroundImage: `url(${continueReading.cover})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-8">
                                    <h3 className="text-lg font-serif text-[#f0e0c0] mb-1 leading-tight">{continueReading.title}</h3>
                                    <p className="text-[#8b7355] text-sm italic mb-4">~ {continueReading.author}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#d2b48c]">Progress</span>
                                            <span className="text-[#d4b88a]">{continueReading.progress} <span className="text-[#8b7355]">/ {continueReading.total}</span></span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#d4b88a] rounded-full transition-all duration-500"
                                                style={{ width: `${(continueReading.progress / continueReading.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-[#d2b48c] mt-4 leading-relaxed line-clamp-2">
                                        Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that...
                                    </p>
                                </div>
                            </div>

                            {/* Schedule Reading */}
                            <div className="bg-[#1a0f05]/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group hover:border-[#d4b88a]/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-2">
                                    <h3 className="text-lg font-serif text-[#f0e0c0] tracking-wide">SCHEDULE READING</h3>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-[#d4b88a]/10 rounded transition-colors">
                                            <ChevronLeft size={18} className="text-[#8b7355]" />
                                        </button>
                                        <button className="p-1.5 hover:bg-[#d4b88a]/10 rounded transition-colors">
                                            <ChevronRight size={18} className="text-[#8b7355]" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                                        <div key={day} className="text-center">
                                            <div className="text-xs text-[#8b7355] mb-2 font-medium">{day}</div>
                                            <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-105
                                                ${idx === 0
                                                    ? 'bg-[#d4b88a] text-[#0b0702] font-bold shadow-lg'
                                                    : 'border border-white/10 text-[#d2b48c] hover:border-[#d4b88a]/30'
                                                } text-sm`}>
                                                {11 + idx}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reader Friends */}
                            <div className="bg-[#1a0f05]/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group hover:border-[#d4b88a]/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-2">
                                    <h3 className="text-lg font-serif text-[#f0e0c0] tracking-wide">READER FRIENDS</h3>
                                    <button className="text-[#8b7355] hover:text-[#d4b88a] transition-colors text-xl leading-none">⋯</button>
                                </div>
                                <div className="space-y-5">
                                    {readerFriends.map((friend, idx) => (
                                        <div key={idx}>
                                            {idx > 0 && <div className="h-px bg-white/5 my-5" />}
                                            <div className="flex items-start gap-3 group/item">
                                                <img
                                                    src={friend.avatar}
                                                    alt={friend.name}
                                                    className="w-10 h-10 rounded-full flex-shrink-0 border border-[#d4b88a]/30"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#f0e0c0] mb-1 text-sm">{friend.name}</p>
                                                    <p className="text-xs text-[#d2b48c] leading-relaxed mb-1">
                                                        {friend.activity}
                                                    </p>
                                                    {friend.chapter && (
                                                        <p className="text-xs text-[#d4b88a] mb-1">✓ {friend.chapter}</p>
                                                    )}
                                                    <p className="text-xs text-[#8b7355]">{friend.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="text-center text-[#8b7355] text-xs pt-4">
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