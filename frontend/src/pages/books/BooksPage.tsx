{/* =============== packages ============ */ }
import { useNavigate } from "react-router-dom";

{/* =============== models ============ */ }
import type { Book as Bk } from "@models/Book";
import { RelationshipType } from "@models/Book";

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";
import { request } from "@utils/ApiRequest";

{/* =============== components ============ */ }
import { Shelves } from "@components/skeleton/shelves/Shelves";
import { DateTimeCard } from '@components/skeleton/DateTimeCard';
import { ReadingGoals, JournalMenu } from "@pages/profile/profile";
import { ChevronRight} from "lucide-react";


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
                className="w-full aspect-[2/3] rounded-lg shadow-md mb-3 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-[#E2E9DC] relative overflow-hidden bg-transparent"
                style={{
                    backgroundImage: `url(${book.coverArt})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#9FB89F]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 className="font-sans font-medium text-sm text-[#5A4D41] line-clamp-2 mb-1 group-hover:text-[#9FB89F] transition-colors">
                {book.name}
            </h3>
            <p className="text-xs text-[#7E6957] italic">{book.author.name}</p>
        </div>
    );
};

const BooksPage = () => {
    const navigate = useNavigate();
    const { user, recommends,setRecommends, genre, popular, discover } = useAuth();

    const handleBookClick = async (book: Bk) => {
        if (!recommends.find(rb => rb.id == book.id)) {
            await request.post('/recs/user/books/interact', {
                userId: user?.id,
                bookId: book.id,
                type: RelationshipType.INTERACTION
            }).then(
                (res:any) =>{
                    setRecommends(res.books);
                }
            )
        }
        navigate(`/book/${book?.id}`)
    }

    return (
        <div className="min-h-screen text-[#5A4D41] font-sans relative pt-20">
            {/* Main Content */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
                {/* Heading */}
                <h2 className="text-xl sm:text-2xl md:text-3xl mb-6 text-[#c9a394] tracking-wide">
                    Happy reading, <span className="text-[#8d6c45]">{user?.username}</span>!
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Shelves (9 columns on desktop) */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Shelves component */}
                        <Shelves
                            shelf1Caption="Your Library"
                            shelf1={popular}
                            shelf2Caption="Recommended For You"
                            shelf2={recommends}
                            shelf3Caption="Based on Your Favourite Genre"
                            shelf3={genre}
                        />

                        {/* Discover Section - appears below shelves on mobile/tablet, inside left column on desktop */}
                        {discover && discover.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-4 border-b border-[#E2E9DC] pb-2">
                                    <h2 className="text-lg sm:text-xl uppercase font-sans text-[#5A4D41] tracking-wide">Discover</h2>
                                    <button className="text-[#9FB89F] hover:text-[#8AA88A] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                                        SEE ALL <ChevronRight size={14} className="sm:size-4" />
                                    </button>
                                </div>

                                {/* Desktop view - vertical scroll list */}
                                <div className="hidden lg:block max-h-[500px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-[#9FB89F]/30 scrollbar-track-[#E2E9DC]/10">
                                    {discover.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleBookClick(book)}
                                            className="group cursor-pointer transition-all duration-300 hover:-translate-x-1"
                                        >
                                            <div className="flex gap-3 items-center rounded-lg p-3 border border-[#E2E9DC] hover:border-[#9FB89F] shadow-sm hover:shadow-md transition-all duration-300">
                                                <div
                                                    className="w-12 h-16 rounded-md shadow-sm flex-shrink-0 bg-cover bg-center border border-[#E2E9DC]"
                                                    style={{
                                                        backgroundImage: `url(${book.coverArt})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm text-[#5A4D41] line-clamp-1 group-hover:text-[#9FB89F] transition-colors">
                                                        {book.name}
                                                    </h4>
                                                    <p className="text-xs text-[#7E6957] mt-1">{book.author.name}</p>
                                                </div>
                                                <ChevronRight size={16} className="text-[#9FB89F] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile/Tablet view - horizontal scroll cards */}
                                <div className="lg:hidden relative">
                                    <div className="flex overflow-x-auto gap-4 pb-4 scroll-smooth hide-scrollbar">
                                        {discover.map((book) => (
                                            <div key={book.id} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                                                <SmallCard
                                                    action={() => handleBookClick(book)}
                                                    book={book}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Goals & Stats (3 columns on desktop) */}
                    <div className="lg:col-span-3 space-y-6">
                        <ReadingGoals />
                        <DateTimeCard />
                        <JournalMenu />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksPage;