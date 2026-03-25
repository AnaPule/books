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

{/* =============== components ============ */ }
import Tabs from "@components/Tabs";
import { BookGrid } from "@components/skeleton/BookCard";
import Spinner from "@components/skeleton/spinner/spinner";
import { LoadingCards } from "@components/skeleton/LoadingCard";
import { Shelves, TopBooksShelves } from "@components/skeleton/shelves/Shelves";
import { Search, BookMarked, Sparkles, Clock, Filter } from "lucide-react";

{/* =============== utils ============ */ }
import type { User } from "@models/User";

interface searchForm {
    search: string;
}

const readingChallenges = [
    { title: "The Classics Challenge", books: 12, progress: 45, color: "from-[#9FB89F] to-[#8AA88A]" },
    { title: "Around the World in 80 Books", books: 80, progress: 12, color: "from-[#B0C4D0] to-[#9CB0C0]" },
    { title: "Poetry Month", books: 30, progress: 60, color: "from-[#ECD0A5] to-[#D9B890]" },
];


export const Classics: React.FC<{ navigateM: (page: string) => void }> = ({
    navigateM
}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<Boolean>(false);
    const [classics, setClassics] = useState<Book[]>([]);
    const [newReleases, setNewReleases] = useState<Book[]>([]);
    const [genreClassics, setUserClassics] = useState<Book[]>([]);

    const goToClassics = () => navigateM('/books/classics');
    const goToNewReleases = () => navigateM('/books/NewReleases');
    const goToUserClassics = () => navigateM('/books/userGenreClassics');

    useEffect(() => {
        setLoading(true)
        const initClassics = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const [
                    classRes,
                    newRes,
                    genreClassRes,
                ] = await Promise.all([
                    request.get<any>(`/recs/classics`),
                    request.get<any>(`/recs/new-releases`),
                    request.get<any>(`/recs/classics/user/${user?.id}`),
                ]);

                setClassics(classRes.books);
                setNewReleases(newRes.books);
                setUserClassics(genreClassRes.books);
            } finally {
                setLoading(false)
            }
        }
        initClassics();
    }, [user?.id]);

    return (
        <>
            {
                loading && (
                    <div className="flex flex-col gap-6 mx-6">
                        <LoadingCards
                            LoadingSelection="shelves"
                            shelfCount={2}
                            booksPerShelf={5}
                        />

                        <LoadingCards
                            LoadingSelection="books"
                            primaryBg="#D4E3D4"
                            secondaryBg="#E2E9DC"
                            cardBg="#E2E9DC"
                            count={4}
                        />
                    </div>
                )
            }

            <div className="flex flex-col gap-4 mx-6">
                <Shelves
                    shelf1Caption="Timeless Pieces"
                    shelf1={classics}
                    shelf1SeeAll={goToClassics}

                    shelf2Caption={`Classics in your favorite genre: ${genreClassics[0]?.genre?.name || "chaai"}`}
                    shelf2={genreClassics}
                    shelf2SeeAll={goToUserClassics}
                />

                <section className="my-8 md:mb-16">
                    <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4">
                        <BookGrid
                            title="New Releases"
                            books={newReleases.slice(0, 6)}
                            onSeeAll={goToNewReleases}
                            cardType="small"
                            itemWidth="w-32 md:w-40"
                        />
                    </div>
                </section>
            </div>
        </>
    );
}

export const Trending: React.FC<{ genres: string[] }> = ({ genres }) => {
    const { recommends, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<Boolean>(false);
    const [filters, setFilters] = useState<string[]>([]);
    const [trendTopic, setTrendTopic] = useState<any[]>([]);
    const [featuredBooks, setFeaturedBooks] = useState<Book[] | []>([]);

    const goToRecommends = () => navigate('/books/recommends');
    const goToWeek = () => navigate('/books/week/trending');


    useEffect(() => {
        const fetchDiscovery = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const featured = await request.get<any>(`/recs/trending/week`);
                const trendingGenre = await request.get<any>(`/recs/trending/topics`);
                setFeaturedBooks(featured.featured);
                setTrendTopic(trendingGenre.topics);
            } finally {
                setLoading(false)
            }
        };
        fetchDiscovery();
    }, []);

    // Toggle filter selection
    const toggleFilter = (genre: string) => {
        if (filters && filters.includes(genre)) {
            setFilters(filters.filter(g => g !== genre));
        } else {
            setFilters([...filters, genre]);
        }
    };

    const filterFeatured = useMemo(() => {
        if (filters.length == 0) return featuredBooks;

        return featuredBooks.filter((f) => {
            const bookGenres = f.genre?.name.toLowerCase().split('+');
            return filters.some(filter =>
                bookGenres?.some(bookGenre => bookGenre.includes(filter.toLowerCase()))
            );
        })
    }, [filters, featuredBooks])

    const filterRecommends = useMemo(() => {
        if (filters.length == 0) return recommends;

        return recommends.filter((f) => {
            const bookGenres = f.genre?.name.toLowerCase().split('+');
            return filters.some(filter =>
                bookGenres?.some(bookGenre => bookGenre.includes(filter.toLowerCase()))
            );
        })
    }, [filters, recommends])

    return (
        <>
            {
                loading ?
                    (
                        <div className="grid grid-cols-10 gap-4">
                            <section className="col-span-10">
                                <LoadingCards
                                    LoadingSelection="books"
                                    primaryBg="#D4E3D4"
                                    secondaryBg="#E2E9DC"
                                    cardBg="#E2E9DC"
                                    count={6}
                                />
                            </section>

                            <section className="col-span-4 space-y-4">
                                <LoadingCards
                                    LoadingSelection="genres"
                                    primaryBg="#D4E3D4"
                                    secondaryBg="#D4E3D4"
                                    cardBg="#FFFCF7"
                                />

                                <LoadingCards
                                    LoadingSelection="info"
                                    primaryBg="#D4E3D4"
                                    secondaryBg="#D4E3D4"
                                    cardBg="#FFFCF7"
                                />
                            </section>
                            <section className="col-span-6 space-y-6">
                                <LoadingCards
                                    LoadingSelection="trendingTopics"
                                    primaryBg="#D4E3D4"
                                    secondaryBg="#D4E3D4"
                                    cardBg="#FFFCF7"
                                />

                                <LoadingCards
                                    LoadingSelection="books"
                                    primaryBg="#D4E3D4"
                                    secondaryBg="#E2E9DC"
                                    cardBg="#E2E9DC"
                                    count={6}
                                />
                            </section>
                        </div>) : (
                        <>
                            {/* featured books */}
                            <section className="mb-8 md:mb-16">
                                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4">
                                    <BookGrid
                                        title="Featured This Week"
                                        books={filterFeatured}
                                        onSeeAll={goToWeek}
                                        cardType="small"
                                        itemWidth="w-32 md:w-40"
                                    />
                                </div>
                            </section>

                            {/* genres filter */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                <div className="space-y-6">
                                    {/* Browse by Genre */}
                                    <div className="bg-[#FFFCF7] h-[40rem] overflow-y-auto rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                                        <div className="flex items-center justify-between sticky top-0 bg-[#FFFCF7] pb-2">
                                            <h3 className="text-base md:text-lg font-serif text-[#5A4D41] flex items-center gap-2">
                                                <Filter size={16} className="text-[#9FB89F]" />
                                                Browse by Genre
                                            </h3>
                                            {filters.length > 0 && (
                                                <button
                                                    onClick={() => setFilters([])}
                                                    className="text-xs text-[#9FB89F] hover:text-[#8AA88A] transition-colors"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {genres.map((genre, idx: number) => {
                                                const isSelected = filters?.includes(genre);
                                                const displayName = genre.includes('+')
                                                    ? `${genre.split('+')[0]}, ${genre.split('+')[1]}`
                                                    : genre;

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleFilter(genre)}
                                                        className={`
                            w-full text-left group p-2.5 rounded-lg transition-all duration-200
                            ${isSelected
                                                                ? 'border-b-3 border-t-[var(--sage-mist)]/70'
                                                                : 'hover:border border-b-[var(--sage-mist)]'
                                                            }
                        `}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className={`
                                text-sm md:text-base transition-colors
                                ${isSelected
                                                                    ? 'text-[#9FB89F] font-medium'
                                                                    : 'text-[#5A4D41] group-hover:text-[#9FB89F]'
                                                                }
                            `}>
                                                                {displayName}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="text-xs text-[#9FB89F]">✓</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Reading Challenges */}
                                    <div className="bg-[#FFFCF7] rounded-xl p-4 md:p-6 border border-[#E2E9DC] shadow-sm">
                                        <h3 className="text-base md:text-lg font-serif text-[#5A4D41] mb-4 flex items-center gap-2">
                                            <Sparkles size={16} className="text-[#9FB89F]" />
                                            Reading Challenges
                                        </h3>
                                        <div className="space-y-5">
                                            {readingChallenges.map((challenge, idx) => (
                                                <div key={idx} className="group">
                                                    <div className="flex justify-between text-xs md:text-sm mb-1">
                                                        <span className="text-[#5A4D41] font-medium">{challenge.title}</span>
                                                        <span className="text-[#9FB89F] font-semibold">{challenge.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-[#E2E9DC] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${challenge.color} rounded-full transition-all duration-500 group-hover:opacity-80`}
                                                            style={{ width: `${challenge.progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-[#7E6957] mt-1.5">{challenge.books} books to read</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-5 py-2.5 border border-[#9FB89F] text-[#9FB89F] text-xs md:text-sm rounded-lg hover:bg-[#9FB89F] hover:text-white transition-all duration-300 hover:shadow-md">
                                            Join a Challenge
                                        </button>
                                    </div>
                                </div>

                                {/* trending topics */}
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

                                {/* recommended books */}
                                    <div>
                                        <BookGrid
                                            title="Recommended for You"
                                            books={filterRecommends}
                                            onSeeAll={goToRecommends}
                                            cardType="large"
                                            itemWidth="w-40 md:w-80"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )
            }



        </>
    );
}

export const Discover: React.FC<{
    user: User | null,

    books: Book[],
    genres: string[],
    authors: string[],
    recommends: Book[],

    loading: Boolean,
    setLoading?: (state: boolean) => void
}> = ({
    recommends, books, genres, authors,
    user, loading, setLoading,
}) => {
        const navigate = useNavigate();
        const [userGenres, setUserGenres] = useState<Book[] | []>([]);
        const [userAuthors, setUserAuthors] = useState<Book[] | []>([]);
        const [searchQuery, setSearchForm] = useState<searchForm>({
            search: '',
        });

        const handleSearchChange = (field: keyof searchForm, value: string) => {
            setSearchForm((prev) => ({ ...prev, [field]: value }));
        };

        const goToRecommends = () => navigate('/books/recommends');
        const goToGenres = () => navigate('/books/genres');
        const goToAuthors = () => navigate('/books/authors');

        useEffect(() => {
            const initDiscoveryComp = async () => {
                try {
                    const userGenresRes = await request.get<any>(`/recs/user/${user?.id}/genre`);
                    setUserGenres(userGenresRes.books);

                    const userAuthorsRes = await request.get<any>(`/recs/user/${user?.id}/author`);
                    setUserAuthors(userAuthorsRes.books);
                } catch (error: any) {
                    toast.error('Pages & Parchment', { description: error.message });
                } finally {
                    if (setLoading)
                        setLoading(false);
                }
            };
            initDiscoveryComp();
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
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
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
                    <div className="col-span-12 lg:col-span-9">
                        <Shelves
                            shelf1Caption={searchQuery.search ? `Search Results for "${searchQuery.search}"` : "Recommended for you"}
                            shelf1={searchBooks || searchRecommends || recommends}
                            shelf1SeeAll={goToRecommends}

                            shelf2Caption="Your Favourite Authors"
                            shelf2={userAuthors}
                            shelf2SeeAll={goToAuthors}

                            shelf3Caption="Your favourite Genres"
                            shelf3={userGenres}
                            shelf3SeeAll={goToGenres}
                        />
                    </div>
                </div>
            </>
        );
    }

export default function DiscoveryPage() {
    const navigate = useNavigate();
    const { user, recommends } = useAuth();
    const [mainTab, setMainTab] = useState(0);
    const [top5Tab, setTop5Tab] = useState(0);

    const [books, setBooks] = useState<Book[] | []>([]);
    const [authors, setAuthors] = useState<string[] | []>([]);
    const [genres, setGenres] = useState<string[] | []>([]);

    const [loading, setLoading] = useState<Boolean>(false);

    const [dayPopular, setDayPopular] = useState<Book[]>([]);
    const [weekPopular, setWeekPopular] = useState<Book[]>([]);
    const [monthPopular, setMonthPopular] = useState<Book[]>([]);

    const NavMethod = (page: string) => {
        navigate(page)
    }

    const tabContent = [
        { label: "Discover", icon: <BookMarked size={16} />, content: <Discover recommends={recommends} user={user} loading={loading} books={books} genres={genres} authors={authors} /> },
        { label: "Trending", icon: <Sparkles size={16} />, content: <Trending genres={genres} /> },
        { label: "Classics", icon: <Clock size={16} />, content: <Classics navigateM={NavMethod} /> },
    ];

    useEffect(() => {
        setLoading(true);

        const initDiscovery = async () => {
            try {
                const res = await request.get<any>(`/books/all`);
                const day = await request.get<any>(`/recs/trending/today`);
                const week = await request.get<any>(`/recs/trending/week`);
                const month = await request.get<any>(`/recs/trending/month`);

                setBooks(res.books);
                const genreList: string[] = [];
                const authorList: string[] = [];
                res.books.forEach((b: Book) => {
                    if (b.genre?.name) genreList.push(b.genre.name);
                    if (b.author?.name) authorList.push(b.author.name);
                });
                setGenres([...new Set(genreList)]);
                setAuthors([...new Set(authorList)]);

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

    return (
        <TabProvider>
            <div className="container mx-auto mt-6 md:mt-8 px-3 md:px-4 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl text-[#5A4D41] mb-6 md:mb-8 text-center">Discover Books</h1>
                <div className="flex flex-col lg:grid lg:grid-cols-10 gap-10 lg:gap-2">
                    {/* section 1 - tabs */}
                    <section className="lg:col-span-8">
                        <Tabs
                            activeTab={mainTab}
                            onTabChange={setMainTab}
                            tabs={tabContent}
                        />
                    </section>
                    {/* section 2 - tops */}
                    <section className="md:mt-6 lg:col-span-2">
                        <h3 className="text-center text-lg md:text-xl mb-2">Top Books</h3>
                        <div className="max-h-[50rem] px-6 overflow-y-auto">
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
                    </section>
                </div>

            </div>
        </TabProvider>
    );
}