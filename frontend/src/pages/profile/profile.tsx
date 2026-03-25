{/* =============== packages ============ */ }
import { useState } from "react";
import {
    Bell, BookOpen,
    Star, Target, BookMarked,
    Quote, CheckCircle, Plus, Menu,
    Heart, Sparkles
} from 'lucide-react';

{/* =============== models ============ */ }

{/* =============== services ============ */ }
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

{/* =============== components ============ */ }
import { AccountSettings } from './AccountSettings';
import { Shelves } from "@components/skeleton/shelves/Shelves";
import { WordOfTheDay } from "@components/WordofTheDay";
import { DateTimeCard } from '@components/DateTimeCard';
import { Calendar } from "@components/skeleton/calendar/Calendar";

const ProfileHeader: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <AccountSettings
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif text-[#5A4D41]">{user?.username}</h1>
                        <p className="text-[10px] md:text-xs text-[#7E6957] italic flex items-center gap-1">
                            <Quote size={10} className="text-[#DEA8A3]" />
                            {user?.bio || "No enjoyment like reading"}
                        </p>
                        <section className='text-sm cursor-pointer hover:text-[#DEA8A3] transition-colors' >12 Communities</section>
                    </div>
                    <button className="p-1.5 md:p-2 hover:bg-[#F5D6D4]/30 rounded-full transition relative">
                        <Bell size={16} className="text-[#DEA8A3]" />
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#DEA8A3] rounded-full"></span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 py-2 md:py-2.5 bg-gradient-to-r from-[#DEA8A3] to-[#C98F8A] text-white text-xs md:text-sm rounded-lg hover:from-[#C98F8A] hover:to-[#B57A74] transition flex items-center justify-center gap-1 shadow-sm">
                        <BookOpen size={14} />
                        <span className="hidden sm:inline">Library</span>
                        <span className="sm:hidden">Lib</span>
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex-1 py-2 md:py-2.5 border border-[#F5D6D4]/50 text-[#5A4D41] text-xs md:text-sm rounded-lg hover:bg-[#FCE9E8] transition">
                        Edit
                    </button>
                </div>
            </div>
        </>
    );
};

export const JournalMenu: React.FC = () => {
    const menuItems = [
        "my library",
        "genres",
        "authors",
        "series",
        "reviews & quotes",
        "reading goals",
        "recommendations",
        "book vocabulary"
    ];

    return (
        <div className="bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-serif text-[#5A4D41] mb-3 md:mb-4 flex items-center gap-2">
                <BookMarked size={16} className="text-[#DEA8A3]" /> journal
            </h2>
            <div className="space-y-1 md:space-y-2">
                {menuItems.map((item, idx) => (
                    <button key={idx} className="w-full text-left py-1 text-xs md:text-sm text-[#5A4D41] hover:text-[#DEA8A3] transition border-b border-[#F5D6D4]/20 last:border-0">
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const CurrentReads: React.FC = () => {
    const books = [
        {
            title: "The Picture of Dorian Gray",
            author: "Oscar Wilde",
            genre: "Fiction",
            progress: 37,
            cover: "📖"
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            progress: 100,
            cover: "📚"
        },
    ];

    return (
        <div className="my-10 bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg text-[#5A4D41] flex items-center gap-2">
                    <BookOpen size={16} className="text-[#DEA8A3]" /> Reading
                </h2>
            </div>

            <div className="space-y-3 md:space-y-4">
                {books.map((book, idx) => (
                    <div key={idx} className="border border-[#F5D6D4]/50 rounded-lg p-3 md:p-4 hover:border-[#DEA8A3] transition bg-white/30">
                        <div className="flex gap-3 md:gap-4">
                            <div className="w-12 h-16 md:w-16 md:h-20 bg-[#FCE9E8] rounded flex items-center justify-center text-2xl md:text-3xl shrink-0">
                                {book.cover}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-medium text-[#5A4D41] truncate">{book.title}</h3>
                                <p className="text-[10px] md:text-xs text-[#7E6957] mb-1 md:mb-2 truncate">{book.author} · {book.genre}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 h-1 md:h-1.5 bg-[#F5D6D4]/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#DEA8A3] to-[#C98F8A] rounded-full"
                                            style={{ width: `${book.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-[#DEA8A3]">{book.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-2 md:py-3 border-2 border-dashed border-[#F5D6D4]/50 rounded-lg text-[#DEA8A3] hover:bg-[#FCE9E8] transition flex items-center justify-center gap-2 text-xs md:text-sm">
                    <Plus size={14} /> New
                </button>
            </div>
        </div>
    );
};

export const ReadingGoals: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-serif text-[#5A4D41] mb-2 md:mb-3 flex items-center gap-2">
                <Target size={14} className="text-[#DEA8A3]" /> GOALS
            </h2>

            <div className="mb-2 md:mb-3">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-[#5A4D41]">2024: 20 books</span>
                    <span className="text-[#DEA8A3]">12/20</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-[#F5D6D4]/30 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-gradient-to-r from-[#DEA8A3] to-[#C98F8A] rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="border border-[#F5D6D4]/50 rounded-lg p-2 text-center bg-white/30">
                    <p className="text-[10px] md:text-xs text-[#7E6957]">TBR</p>
                    <p className="text-base md:text-xl text-[#5A4D41] font-serif">24</p>
                </div>
                <div className="border border-[#F5D6D4]/50 rounded-lg p-2 text-center bg-white/30">
                    <p className="text-[10px] md:text-xs text-[#7E6957]">Reading</p>
                    <p className="text-base md:text-xl text-[#5A4D41] font-serif">5</p>
                </div>
            </div>

            <p className="text-[10px] md:text-xs text-[#DEA8A3] italic text-center">it's always a good day to read.</p>
        </div>
    );
};

const QuickButtons: React.FC = () => {
    const buttons = [
        "New Book",
        "Recommendation",
        "New Author",
        "New Review",
        "New Word"
    ];

    return (
        <div className="bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-serif text-[#5A4D41] mb-2 md:mb-3 flex items-center gap-2">
                <Plus size={14} className="text-[#DEA8A3]" /> QUICK
            </h2>
            <div className="space-y-0.5">
                {buttons.map((btn, idx) => (
                    <button key={idx} className="w-full text-left py-1 px-1 text-xs md:text-sm text-[#5A4D41] hover:bg-[#FCE9E8] rounded-lg transition">
                        + {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

const BooksRead: React.FC = () => {
    return (
        <div className="bg-gradient-to-br my-10 from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-serif text-[#5A4D41] mb-2 md:mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-[#DEA8A3]" /> READ
            </h2>

            <div className="space-y-2">
                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs md:text-sm text-[#5A4D41]">I Like to Read</span>
                        <span className="text-xs md:text-sm text-[#DEA8A3]">100%</span>
                    </div>
                    <div className="w-full h-1 bg-[#F5D6D4]/30 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-[#DEA8A3] to-[#C98F8A] rounded-full" />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs md:text-sm text-[#5A4D41]">Full of Secrets</span>
                        <span className="text-xs md:text-sm text-[#DEA8A3]">50%</span>
                    </div>
                    <div className="w-full h-1 bg-[#F5D6D4]/30 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-gradient-to-r from-[#DEA8A3] to-[#C98F8A] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Recommendations: React.FC = () => {
    const recs = [
        { title: "My Favorite", books: "The Secret History" },
        { title: "The Perfect Library", books: "If We Were Villains" },
    ];

    return (
        <div className="bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] rounded-2xl border border-[#F5D6D4]/50 p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-serif text-[#5A4D41] mb-2 md:mb-3 flex items-center gap-2">
                <Star size={14} className="text-[#DEA8A3]" /> RECS
            </h2>

            <div className="space-y-2">
                {recs.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-1 border-b border-[#F5D6D4]/20 last:border-0">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-[#5A4D41] truncate">{rec.title}</p>
                            <p className="text-[10px] md:text-xs text-[#7E6957] truncate">{rec.books}</p>
                        </div>
                        <button className="text-[10px] px-2 py-0.5 border border-[#DEA8A3] text-[#DEA8A3] rounded hover:bg-[#DEA8A3] hover:text-white transition ml-2 shrink-0">
                            Save
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={onClose}>
            <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-br from-[#FFFCF7] to-[#FEF5F2] p-5 shadow-lg border-l border-[#F5D6D4]/50" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#5A4D41]" onClick={onClose}>✕</button>
                <div className="mt-10 space-y-4">
                    <JournalMenu />
                    <QuickButtons />
                </div>
            </div>
        </div>
    );
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const { quote, wishlist, library } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const goToLibrary = () => navigate('/books/library');
    const goToWishlist = () => navigate('/books/library');

    return (
        <div className="min-h-screen mt-10 pt-16 md:pt-20 px-3 md:px-6 pb-8">
            {/* Decorative elements - pink blurs */}
            <div className="fixed top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-[#F5D6D4]/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#FCE9E8]/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Mobile menu button */}
            <button
                className="fixed bottom-4 right-4 z-40 md:hidden bg-[#DEA8A3] text-white p-3 rounded-full shadow-lg"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu size={20} />
            </button>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Quote */}
                <div className="text-center mb-3 md:mb-4 px-2">
                    <p className="text-xs md:text-base font-serif text-[#5A4D41] italic flex items-center justify-center gap-1 md:gap-2">
                        <Quote size={12} className="text-[#DEA8A3]" />
                        {quote?.quote || `"I declare after all there is no enjoyment like reading."`}
                        <Quote size={12} className="text-[#DEA8A3]" />
                    </p>
                    <p className="text-[10px] md:text-xs text-[#DEA8A3] mt-0.5">~ {quote?.author || "Jane Austen"}</p>
                </div>

                {/* Mobile layout - stack everything */}
                <div className="block md:hidden space-y-4">
                    <ProfileHeader />
                    <DateTimeCard />
                    <Calendar />
                    <WordOfTheDay />
                    <Shelves shelf1Caption="Read list" shelf1={wishlist ?? []} shelf2Caption="Library" shelf2={library} />
                    <CurrentReads />
                    <BooksRead />
                    <ReadingGoals />
                    <Recommendations />
                </div>

                {/* Desktop layout - grid */}
                <div className='hidden md:grid md:grid-cols-6 gap-4'>
                    {/* Left Column */}
                    <section className='col-span-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <section><ProfileHeader /></section>
                            <section><DateTimeCard /></section>
                            <section className="col-span-2">
                                <Shelves
                                    shelf1Caption="wishlist"
                                    shelf1={wishlist}
                                    shelf1SeeAll={goToWishlist}

                                    shelf2Caption="Library"
                                    shelf2={library}
                                    shelf2SeeAll={goToLibrary}
                                />
                            </section>
                            <section><CurrentReads /></section>
                            <section className='space-y-2'>
                                <BooksRead />
                                <JournalMenu />
                            </section>
                        </div>
                    </section>

                    {/* Right Column */}
                    <section className='col-span-2'>
                        <div className='space-y-4'>
                            <Calendar />
                            <WordOfTheDay />
                            <ReadingGoals />
                            <QuickButtons />
                            <Recommendations />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}