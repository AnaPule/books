// pages/books/SeeAllPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Filter, ChevronDown, X } from "lucide-react";
import { BookGrid } from "@components/skeleton/BookCard";
import { LoadingCards } from "@components/skeleton/LoadingCard";
import { request } from "@utils/ApiRequest";
import { useAuth } from "@context/AuthContext";
import type { Book } from "@models/Book";

interface SeeAllPageProps {
    title: string;
    endpoint: string;
    filterable?: boolean;
    filterOptions?: { value: string; label: string }[];
}

export default function SeeAllPage({ 
    title, 
    endpoint, 
    filterable = false,
    filterOptions = []
}: SeeAllPageProps) {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"relevance" | "newest" | "oldest">("relevance");

    useEffect(() => {
        fetchBooks();
    }, [endpoint]);

    useEffect(() => {
        filterAndSortBooks();
    }, [books, activeFilters, sortBy]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            console.log('rendpoint', endpoint)
            const res = await request.get<any>(endpoint);
            setBooks(res.books || []);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBooks = () => {
        let result = [...books];

        // Apply filters
        if (activeFilters.length > 0) {
            result = result.filter(book => 
                activeFilters.some(filter => 
                    book.genre?.name?.toLowerCase().includes(filter.toLowerCase()) ||
                    book.author?.name?.toLowerCase().includes(filter.toLowerCase())
                )
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime());
                break;
            default:
                // relevance - keep original order
                break;
        }

        setFilteredBooks(result);
    };

    const toggleFilter = (filter: string) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(activeFilters.filter(f => f !== filter));
        } else {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setSortBy("relevance");
    };

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 md:px-8 pb-12">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#5A4D41] hover:text-[#C9A394] transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-[#5A4D41]">{title}</h1>
                        <p className="text-[#7E6957] text-sm mt-2">
                            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {/* Filter button */}
                        {filterable && filterOptions.length > 0 && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    activeFilters.length > 0
                                        ? "bg-[#C9A394] text-white border-[#C9A394]"
                                        : "bg-white text-[#5A4D41] border-[#E2E9DC] hover:border-[#C9A394]"
                                }`}
                            >
                                <Filter size={16} />
                                Filter
                                {activeFilters.length > 0 && (
                                    <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        )}

                        {/* Sort dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-4 py-2 rounded-lg border border-[#E2E9DC] bg-white text-[#5A4D41] focus:outline-none focus:border-[#C9A394] cursor-pointer"
                        >
                            <option value="relevance">Sort by: Relevance</option>
                            <option value="newest">Sort by: Newest</option>
                            <option value="oldest">Sort by: Oldest</option>
                        </select>
                    </div>
                </div>

                {/* Filter panel */}
                {showFilters && filterOptions.length > 0 && (
                    <div className="mt-6 p-4 bg-white rounded-xl border border-[#E2E9DC] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-[#5A4D41]">Filter by</h3>
                            {activeFilters.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-[#C9A394] hover:text-[#B58B7C] flex items-center gap-1"
                                >
                                    <X size={12} /> Clear all
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => toggleFilter(option.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                        activeFilters.includes(option.value)
                                            ? "bg-[#C9A394] text-white"
                                            : "bg-[#F5F0E8] text-[#5A4D41] hover:bg-[#E2E9DC]"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active filters display */}
                {activeFilters.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                            <span
                                key={filter}
                                className="px-2 py-1 bg-[#C9A394]/10 text-[#C9A394] text-sm rounded-full flex items-center gap-1"
                            >
                                {filter}
                                <button onClick={() => toggleFilter(filter)}>
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <LoadingCards LoadingSelection="books" count={12} />
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-[#7E6957] mb-4">No books found matching your filters.</p>
                        <button
                            onClick={clearFilters}
                            className="text-[#C9A394] hover:text-[#B58B7C] underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                onClick={() => navigate(`/book/${book.id}`)}
                                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className="w-full aspect-[2/3] rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-[#E8CFC5]/50 relative overflow-hidden bg-[#FCF9F4]"
                                    style={{
                                        backgroundImage: `url(${book.coverArt})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-medium text-sm text-[#5A4D41] line-clamp-2 mt-2 group-hover:text-[#C9A394] transition-colors">
                                    {book.name}
                                </h3>
                                <p className="text-xs text-[#7E6957] italic">{book.author?.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}