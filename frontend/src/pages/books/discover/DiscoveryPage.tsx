{/* =============== react ============ */ }
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";

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
import Spinner from "@components/skeleton/spinner/spinner";
import { Shelves, TopBooksShelves } from "@components/skeleton/shelves/Shelves";
import { Search, BookMarked, Sparkles, BookOpen, Users, Clock, Star, Filter } from "lucide-react";

{/* =============== utils ============ */ }
import { highlightMatch } from "@utils/highlightMatch";
import type { User } from "@models/User";

interface searchForm {
    search: string;
    searchResult: Book[] | [];
}
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
    const { user, recommends } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<Boolean>(false);
    const [featuredBooks, setFeaturedBooks] = useState<Book[] | []>([]);
    const [trendTopic, setTrendTopic] = useState<any[]>([]);

    useEffect(() => {
        const fetchDiscovery = async () => {
            setLoading(true);
            try {
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

    return (
        <>
            <section className="mb-8 md:mb-16">
                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4">
                    <BookGrid
                        title="Featured This Week"
                        books={featuredBooks}
                        onSeeAll={() => navigate('/books/recommended')}
                        cardType="small"
                        itemWidth="w-32 md:w-40"
                    />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="space-y-6">
                    <div className="bg-[#FFFCF7] rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-base md:text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Filter size={16} className="text-[#9FB89F]" />
                            Browse by Genre
                        </h3>
                        <div className="space-y-2 md:space-y-3">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    className="w-full text-left group hover:bg-[#F5F0E8] p-2 rounded-lg transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm md:text-base text-[#5A4D41] group-hover:text-[#9FB89F] transition-colors">
                                            {genre.name}
                                        </span>
                                        <span className="text-xs text-[#C3BDB8]">{genre.count}</span>
                                    </div>
                                    <p className="text-xs text-[#7E6957] mt-1">{genre.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#FFFCF7] rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-base md:text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-[#9FB89F]" />
                            Reading Challenges
                        </h3>
                        <div className="space-y-4">
                            {readingChallenges.map((challenge, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs md:text-sm mb-1">
                                        <span className="text-[#5A4D41]">{challenge.title}</span>
                                        <span className="text-[#9FB89F]">{challenge.progress}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-[#E2E9DC] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${challenge.color} rounded-full`}
                                            style={{ width: `${challenge.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-[#7E6957] mt-1">{challenge.books} books to read</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-[#9FB89F] text-[#9FB89F] text-xs md:text-sm rounded-lg hover:bg-[#9FB89F] hover:text-white transition-colors">
                            Join a Challenge
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#FFFCF7] rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-base md:text-lg text-[#5A4D41] mb-4">Trending Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {trendTopic.map((topic) => (
                                <button
                                    key={topic.id}
                                    className="px-3 py-1 md:px-4 md:py-2 bg-[#F5F0E8] rounded-full text-xs md:text-sm text-[#5A4D41] hover:bg-[#E2E9DC] transition-colors uppercase"
                                >
                                    {topic.name.includes('+') ? topic.name.split('+')[0] : topic.name}
                                    <span className="text-[10px] md:text-xs font-bold text-[#9FB89F] ml-1">· Trending</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <BookGrid
                            title="Recommended for You"
                            books={recommends}
                            onSeeAll={() => navigate('/books/recommended')}
                            cardType="large"
                            itemWidth="w-40 md:w-80"
                        />
                    </div>

                    <div className="bg-gradient-to-r from-[#F5F0E8] to-[#FFFCF7] rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                        <h3 className="text-base md:text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                            <Star size={16} className="text-[#9FB89F] fill-[#9FB89F]" />
                            Staff Picks
                        </h3>
                        <div className="space-y-4">
                            {staffPicks.map((pick, idx) => (
                                <div key={idx} className="border-l-2 border-[#9FB89F] pl-3 md:pl-4">
                                    <p className="text-sm md:text-base font-medium text-[#5A4D41]">{pick.name}</p>
                                    <p className="text-xs md:text-sm text-[#7E6957]">{pick.author}</p>
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
    return <>hi im new release</>;
}

export const Classics: React.FC = () => {
    return <>hi im classics</>;
}

export const StaffPicks: React.FC = () => {
    return <>hi im trending</>;
}

export const Discover: React.FC<{ recommends: Book[], user: User | null }> = ({ recommends, user }) => {
    const [books, setBooks] = useState<Book[] | []>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [userGenres, setUserGenres] = useState<Book[] | []>([]);
    const [dayPopular, setDayPopular] = useState<Book[]>([]);
    const [weekPopular, setWeekPopular] = useState<Book[]>([]);
    const [monthPopular, setMonthPopular] = useState<Book[]>([]);
    const [userAuthors, setUserAuthors] = useState<Book[] | []>([]);
    const [genres, setGenres] = useState<string[] | []>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [searchQuery, setSearchForm] = useState<searchForm>({
        search: '',
        searchResult: []
    });
    const [top5Tab, setTop5Tab] = useState(0);

    const handleSearchChange = (field: keyof searchForm, value: string) => {
        setSearchForm((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        setLoading(true);
        const initDiscovery = async () => {
            try {
                const res = await request.get<any>(`/books`);
                setBooks(res.books);
                const genreList: string[] = [];
                const authorList: string[] = [];
                res.books.forEach((b: Book) => {
                    if (b.genre?.name) genreList.push(b.genre.name);
                    if (b.author?.name) authorList.push(b.author.name);
                });
                setGenres([...new Set(genreList)]);
                setAuthors([...new Set(authorList)]);

                const userGenresRes = await request.get<any>(`/recs/user/${user?.id}/genre`);
                setUserGenres(userGenresRes.books);

                const userAuthorsRes = await request.get<any>(`/recs/user/${user?.id}/author`);
                setUserAuthors(userAuthorsRes.books);

                const day = await request.get<any>(`/recs/trending/today`);
                const week = await request.get<any>(`/recs/trending/week`);
                const month = await request.get<any>(`/recs/trending/month`);

                setDayPopular(day.books);
                setWeekPopular(week.featured);
                setMonthPopular(month.books);
            } catch (error: any) {
                toast.error('Pages & Parchment', { description: error.message });
            } finally {
                setLoading(false);
            }
        };
        initDiscovery();
    }, [user?.id]);

    const searchBooks = useMemo(() => {
        if (!searchQuery.search) return null;
        const query = searchQuery.search.toLowerCase();
        return books.filter(book =>
            book.isbn?.toLowerCase().includes(query) ||
            book.name?.toLowerCase().includes(query) ||
            book.author?.name?.toLowerCase().includes(query) ||
            book.genre?.name?.toLowerCase().includes(query)
        );
    }, [searchQuery.search, books]);

    const searchRecommends = useMemo(() => {
        if (!searchQuery.search) return recommends;
        const query = searchQuery.search.toLowerCase();
        return recommends.filter(book =>
            book.isbn?.toLowerCase().includes(query) ||
            book.name?.toLowerCase().includes(query) ||
            book.author?.name?.toLowerCase().includes(query) ||
            book.genre?.name?.toLowerCase().includes(query)
        );
    }, [searchQuery.search, recommends]);

    if (loading) {
        return <Spinner colour="#C0D4E0" loadingLabel="Summoning books from the shelves" />;
    }

    return (
        <>
            <div className="relative my-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9FB89F]" size={20} />
                <input
                    type="text"
                    value={searchQuery.search}
                    placeholder="Search by ISBN, title, author, genre..."
                    onChange={(e) => handleSearchChange("search", e.target.value)}
                    maxLength={40}
                    className="w-full h-12 pl-12 pr-4 py-3 bg-[#FFFCF7] text-[#5A4D41] placeholder-[#C3BDB8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9FB89F]/30 border border-[#E2E9DC] shadow-sm text-sm md:text-base"
                />
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-6">
                {/* Left Sidebar - Genres & Authors (hidden on mobile, visible on desktop) */}
                <div className="hidden lg:block lg:col-span-2 space-y-6">
                    <div className="my-4">
                        <h3 className="flex items-center text-base md:text-lg text-[#5A4D41] border-b border-[var(--periwinkle-light)] pb-2 mb-4 gap-2">
                            <span className="genres-gradient">Genres</span> to explore
                        </h3>
                        <div className="max-h-[20rem] overflow-y-auto pr-2">
                            {genres.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((g, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearchChange("search", g)}
                                            className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-[#FFFCF7] text-[#7E6957] rounded-full border border-[#E2E9DC] hover:border-[#9FB89F] hover:text-[#9FB89F] hover:bg-[#F5F0E8] transition-all duration-200"
                                        >
                                            {g.includes('+') ? g.split('+')[0] : g.includes('ya') ? 'young adult' : g}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center py-8">
                                    <Spinner loadingLabel="Loading genres..." />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="my-4">
                        <h3 className="flex items-center text-base md:text-lg text-[#5A4D41] border-b border-[var(--misty-lavender)] pb-2 mb-4 gap-2">
                            <span className="authors-gradient">Authors</span> to explore
                        </h3>
                        <div className="max-h-[20rem] overflow-y-auto pr-2">
                            {authors.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {authors.map((a, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearchChange("search", a)}
                                            className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-[#FFFCF7] text-[#7E6957] rounded-full border border-[#E2E9DC] hover:border-[#C9A394] hover:text-[#C9A394] hover:bg-[#F5F0E8] transition-all duration-200"
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center py-8">
                                    <Spinner loadingLabel="Loading authors..." />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - Shelves */}
                <div className="col-span-12 lg:col-span-7">
                    <Shelves
                        shelf1Caption={searchQuery.search ? `Search Results for "${searchQuery.search}"` : "Recommended for you"}
                        shelf1={searchBooks || searchRecommends || recommends}
                        
                        shelf2Caption="Your Favourite Authors"
                        shelf2={userAuthors}
                        
                        shelf3Caption="Your favourite Genres"
                        shelf3={userGenres}
                    />
                </div>

                {/* Right Sidebar - Top Books */}
                <div className="col-span-12 lg:col-span-3 mt-6 lg:mt-0">
                    <h3 className="text-center text-lg md:text-xl mb-2">Top Books</h3>
                    <div className="max-h-[50rem] overflow-y-auto">
                        <Tabs
                            activeTab={top5Tab}
                            onTabChange={setTop5Tab}
                            tabs={[
                                { label: "today", content: <TopBooksShelves books={dayPopular.slice(0, 5)} /> },
                                { label: "week", content: <TopBooksShelves books={weekPopular.slice(0, 5)} /> },
                                { label: "month", content: <TopBooksShelves books={monthPopular.slice(0, 5)} /> },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default function DiscoveryPage() {
    const { user, recommends } = useAuth();
    const [mainTab, setMainTab] = useState(0);

    const tabContent = [
        { label: "Discover", icon: <BookMarked size={16} />, content: <Discover recommends={recommends} user={user} /> },
        { label: "Trending", icon: <Sparkles size={16} />, content: <Trending /> },
        { label: "New Releases", icon: <BookOpen size={16} />, content: <NewRelease /> },
        { label: "Classics", icon: <Clock size={16} />, content: <Classics /> },
        { label: "Staff Picks", icon: <Users size={16} />, content: <StaffPicks /> },
    ];

    return (
        <TabProvider>
            <div className="container mx-auto mt-6 md:mt-8 px-3 md:px-4 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl text-[#5A4D41] mb-6 md:mb-8 text-center">Discover Books</h1>
                <Tabs
                    activeTab={mainTab}
                    onTabChange={setMainTab}
                    tabs={tabContent}
                />
            </div>
        </TabProvider>
    );
}