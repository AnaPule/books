{/* =============== react ============ */ }
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

{/* =============== services ============ */ }
import { request } from "@utils/ApiRequest";
import { useAuth } from "@context/AuthContext";
import { TabProvider } from "@context/TabsContext";

{/* =============== model ============ */ }
import type { Book } from "@models/Book";
import { BookGrid } from "@components/skeleton/BookCard";
import { NoResults } from "@components/skeleton/noResults";

{/* =============== components ============ */ }
import Tabs from "@components/Tabs";
import { Search, BookMarked, Sparkles, BookOpen, Users, Clock, Star, Filter } from "lucide-react";

{/* =============== utils ============ */ }
import { highlightMatch } from "@utils/highlightMatch";

interface searchForm {
    search: string;
}
const handleSearchChange = (field: keyof searchForm, value: string) => {
        setSearchForm((prev) => ({ ...prev, [field]: value }));
    };
const [searchQuery, setSearchForm] = useState<searchForm>({
        search: ''
    });
interface Genre {
    id: string;
    name: string;
    description: string;
    count: number;
}

interface TrendingTopic {
    id: string;
    name: string;
    category: string;
}
// Mock data for discovery
const genres: Genre[] = [
    { id: "1", name: "Literary Fiction", description: "Timeless stories of the human condition", count: 234 },
    { id: "2", name: "Classics", description: "Enduring works that shaped literature", count: 189 },
    { id: "3", name: "Poetry", description: "Verses that speak to the soul", count: 156 },
    { id: "4", name: "Philosophy", description: "Meditations on life and meaning", count: 98 },
    { id: "5", name: "History", description: "Tales from ages past", count: 167 },
    { id: "6", name: "Biography", description: "Lives that inspire", count: 143 },
];

const readingChallenges = [
    { title: "The Classics Challenge", books: 12, progress: 45, color: "from-[#9FB89F] to-[#8AA88A]" },
    { title: "Around the World in 80 Books", books: 80, progress: 12, color: "from-[#B0C4D0] to-[#9CB0C0]" },
    { title: "Poetry Month", books: 30, progress: 60, color: "from-[#ECD0A5] to-[#D9B890]" },
];

const staffPicks = [
    { name: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", reason: "A heartwarming journey of self-discovery" },
    { name: "The House in the Cerulean Sea", author: "T.J. Klune", reason: "Pure joy wrapped in beautiful prose" },
    { name: "Circe", author: "Madeline Miller", reason: "A spellbinding retelling of Greek mythology" },
];

export const Trending: React.FC = () => {
    // variables
    const { user, recommends } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<Boolean>(false);

    const [featuredBooks, setFeaturedBooks] = useState<Book[] | []>([]);
    const [trendTopic, setTrendTopic] = useState<any[]>([]);

    useEffect(() => {
        // Mock API call - replace with real endpoint
        const fetchDiscovery = async () => {
            setLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const featured = await request.get<any>(`/recs/featured/week`);
                const trendingGenre = await request.get<any>(`/recs/trending/topics`);
                setFeaturedBooks(featured.featured);
                setTrendTopic(trendingGenre.topics);

            } finally {
                setLoading(false);
            }
        };
        fetchDiscovery();
    }, []);

    //const search = useMemo(() => {console.log(searchQuery) }, [searchQuery])
    return (
        <>
            {/* Featured Books Carousel */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                </div>
                <div className="flex overflow-y-scroll gap-6">
                    <BookGrid
                        title="Featured This Week"
                        books={featuredBooks}
                        onSeeAll={() => navigate('/books/recommended')}
                        cardType="small"
                        itemWidth="w-40" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Genres */}
                <div className="space-y-6">
                    <div className="bg-[#FFFCF7] rounded-xl p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Filter size={18} className="text-[#9FB89F]" />
                            Browse by Genre
                        </h3>
                        <div className="space-y-3">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    className="w-full text-left group hover:bg-[#F5F0E8] p-2 rounded-lg transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#5A4D41] group-hover:text-[#9FB89F] transition-colors">
                                            {highlightMatch(genre.name,searchQuery.search)}
                                        </span>
                                        <span className="text-xs text-[#C3BDB8]">{genre.count}</span>
                                    </div>
                                    <p className="text-xs text-[#7E6957] mt-1">{genre.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reading Challenges */}
                    <div className="bg-[#FFFCF7] rounded-xl p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-[#9FB89F]" />
                            Reading Challenges
                        </h3>
                        <div className="space-y-4">
                            {readingChallenges.map((challenge, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#5A4D41]">{challenge.title}</span>
                                        <span className="text-[#9FB89F]">{challenge.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#E2E9DC] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${challenge.color} rounded-full`}
                                            style={{ width: `${challenge.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-[#7E6957] mt-1">{challenge.books} books to read</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-[#9FB89F] text-[#9FB89F] text-sm rounded-lg hover:bg-[#9FB89F] hover:text-white transition-colors">
                            Join a Challenge
                        </button>
                    </div>
                </div>

                {/* Middle Column - Trending Topics & Recommended */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trending Topics */}
                    <div className="bg-[#FFFCF7] rounded-xl p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-lg text-[#5A4D41] mb-4">Trending Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {trendTopic.map((topic) => (
                                <button
                                    key={topic.id}
                                    className="
                                    px-4 py-2 bg-[#F5F0E8] rounded-full 
                                    text-sm text-[#5A4D41] hover:bg-[#E2E9DC] 
                                    transition-colors uppercase
                                    "
                                >
                                    {topic.name.includes('+') ? topic.name.split('+')[0] : topic.name}
                                    <span className="text-xs font-bold text-[#9FB89F] ml-1">· Trending</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recommended for You */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                        </div>
                        <BookGrid
                            title="Recommended for You"
                            books={recommends}
                            onSeeAll={() => navigate('/books/recommended')}
                            cardType="large"
                            itemWidth="w-80"
                        />
                    </div>

                    {/* Staff Picks */}
                    <div className="bg-gradient-to-r from-[#F5F0E8] to-[#FFFCF7] rounded-xl p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Star size={18} className="text-[#9FB89F] fill-[#9FB89F]" />
                            Staff Picks
                        </h3>
                        <div className="space-y-4">
                            {staffPicks.map((pick, idx) => (
                                <div key={idx} className="border-l-2 border-[#9FB89F] pl-4">
                                    <p className="font-medium text-[#5A4D41]">{pick.name}</p>
                                    <p className="text-sm text-[#7E6957]">{pick.author}</p>
                                    <p className="text-xs text-[#9FB89F] italic mt-1">"{pick.reason}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const NewRelease: React.FC = () => {
    return (
        <>hi im new release</>
    );
}

export const Classics: React.FC = () => {
    return (
        <>hi im classics</>
    );
}

export const StaffPicks: React.FC = () => {
    return (
        <>hi im trending</>
    );
}

export const Discover: React.FC = () => {
    return (
        <>hi im discovery</>
    );
}

const tabContent = [
    { label: "Discover", icon: <BookMarked size={16} />, content: <Discover /> },
    { label: "Trending", icon: <Sparkles size={16} />, content: <Trending /> },
    { label: "New Releases", icon: <BookOpen size={16} />, content: <NewRelease /> },
    { label: "Classics", icon: <Clock size={16} />, content: <Classics /> },
    { label: "Staff Picks", icon: <Users size={16} />, content: <StaffPicks /> },
];

export default function DiscoveryPage() {
    return (
        <TabProvider>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
            </div>
            <div className="container mx-auto mt-8 px-4 py-8">
                <h1 className="text-3xl font-serif text-[#5A4D41] mb-8 text-center">Discover Books</h1>
                {/* search bar */}
                <div className="relative my-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9FB89F]" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, author, genre..."
                        value={searchQuery.search}
                        maxLength={40}
                        onChange={(e) => handleSearchChange("search",e.target.value)}
                        className="w-full h-[3rem] pl-12 pr-4 py-4 bg-[#FFFCF7] text-[#5A4D41] placeholder-[#C3BDB8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9FB89F]/30 border border-[#E2E9DC] shadow-sm"
                    />
                </div>
                <Tabs tabs={tabContent} />
            </div>
        </TabProvider>
    );
}