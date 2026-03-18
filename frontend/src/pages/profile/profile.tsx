
{/* =============== images ============ */ }
import Flower_0 from '@assets/bouqet.jpeg';
import Flower_1 from '@assets/Flower_1.jpeg';
import Flower_2 from '@assets/Flower_2.jpeg';
import Flower_3 from '@assets/Flower_3.jpeg';
import Flower_4 from '@assets/Flower_4.jpeg';
import Flower_5 from '@assets/Flower_5.jpeg';
import Flower_6 from '@assets/Flower_6.jpeg';
import Flower_7 from '@assets/Flower_7.jpeg';
import Flower_8 from '@assets/Flower_8.jpeg';

{/* =============== packages ============ */ }
import { useState, useEffect } from "react";
import {
    Bell, BookOpen,
    Star, Target, BookMarked,
    Sparkles, Quote
    , CheckCircle, Plus
    , Heart, Menu
} from 'lucide-react';

{/* =============== models ============ */ }

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";

{/* =============== components ============ */ }
import { AccountSettings } from './AccountSettings';
import { Calendar } from "@components/skeleton/calendar/Calendar";

const ProfileHeader: React.FC = () => {
    const { user } = useAuth();
    {/* account settings */ } const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <AccountSettings
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif text-[#5a4d41]">{user?.username}</h1>
                        <p className="text-[10px] md:text-xs text-[#7e6957] italic flex items-center gap-1">
                            <Quote size={10} className="text-[#d9b6a8]" />
                            {user?.bio || "No enjoyment like reading"}
                        </p>
                        <section className='text-sm cursor-pointer hover:text-underline' >12 Communities</section>
                    </div>
                    <button className="p-1.5 md:p-2 hover:bg-[#f5d6d4]/30 rounded-full transition relative">
                        <Bell size={16} className="text-[#c9a394]" />
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#d9b6a8] rounded-full"></span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 py-2 md:py-2.5 bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] text-white text-xs md:text-sm rounded-lg hover:from-[#b58b7c] hover:to-[#c9a394] transition flex items-center justify-center gap-1 shadow-sm">
                        <BookOpen size={14} />
                        <span className="hidden sm:inline">Library</span>
                        <span className="sm:hidden">Lib</span>
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex-1 py-2 md:py-2.5 border border-[#e8bfb0] text-[#5a4d41] text-xs md:text-sm rounded-lg hover:bg-[#fceae8] transition">
                        Edit
                    </button>
                </div>
            </div>
        </>

    );
};
const DateTimeCard: React.FC = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return (
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <p className="text-[10px] md:text-xs text-[#d9b6a8] mb-2 md:mb-3 flex items-center gap-1">
                <Heart size={10} className="text-[#c9a394]" /> 02 41 PM · SAT
            </p>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl md:text-4xl font-serif text-[#5a4d41]">{hours}</span>
                <span className="text-xl md:text-2xl text-[#d9b6a8] font-light">:</span>
                <span className="text-3xl md:text-4xl font-serif text-[#5a4d41]">{minutes}</span>
            </div>
            <p className="text-[10px] md:text-xs text-[#7e6957] text-center mt-1 md:mt-2">TUESDAY</p>
        </div>
    );
};
const WordOfTheDay: React.FC = () => {
    const { word } = useAuth();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousImageIndex, setPreviousImageIndex] = useState(0);
    const flowerImages = [Flower_0, Flower_1, Flower_2, Flower_3, Flower_4, Flower_5, Flower_6, Flower_7, Flower_8];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setPreviousImageIndex(activeImageIndex);
            setActiveImageIndex((prev) => (prev + 1) % flowerImages.length);
            setTimeout(() => setIsTransitioning(false), 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeImageIndex]);

    return (
        <div className=" rounded-2xl border border-[#e8bfb0] p-4 md:p-5 relative overflow-hidden min-h-[180px] md:min-h-[220px]">
            {/* Background Images - Reduced opacity significantly */}
            <img
                src={flowerImages[previousImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{
                    filter: 'blur(3px) brightness(0.8)'
                }}
            />
            <img
                src={flowerImages[activeImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{
                    filter: 'blur(3px) brightness(0.6)'
                }}
            />

            <div className="relative z-10 text-center text-[var(--latte)]">
                <p className="text-[10px] md:text-md tracking-wider mb-1 md:mb-2 flex items-center gap-1 font-semibold">
                    <Sparkles size={10} /> WORD OF THE DAY
                </p>
                <h3 className="text-2xl md:text-3xl font-serif mb-0.5 md:mb-1 font-bold">
                    {word?.word || "Sonder"}
                </h3>
                <p className="text-[10px] md:text-xs italic mb-2 md:mb-3 font-medium">
                    {word?.phonetic && word?.meanings?.[0]?.partsOfSpeech
                        ? `${word.phonetic} — ${word.meanings[0].partsOfSpeech}`
                        : "/sɒn.dər/ — noun"}
                </p>
                <p className="text-sm md:text-sm leading-relaxed font-medium">
                    {word?.meanings?.[0]?.definitions?.[0]?.definition ||
                        "the realization that every passerby has a life as vivid and complex as your own."}
                </p>
            </div>
        </div>
    );
};
const JournalMenu: React.FC = () => {
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
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <h2 className="text-base md:text-lg font-serif text-[#5a4d41] mb-3 md:mb-4 flex items-center gap-2">
                <BookMarked size={16} className="text-[#c9a394]" /> journal
            </h2>
            <div className="space-y-1 md:space-y-2">
                {menuItems.map((item, idx) => (
                    <button key={idx} className="w-full text-left py-1 text-xs md:text-sm text-[#5a4d41] hover:text-[#c9a394] transition border-b border-[#e8bfb0]/20 last:border-0">
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};
const CurrentReads: React.FC = () => {
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
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg text-[#5a4d41] flex items-center gap-2">
                    <BookOpen size={16} className="text-[#c9a394]" /> Reading
                </h2>
            </div>

            <div className="space-y-3 md:space-y-4">
                {books.map((book, idx) => (
                    <div key={idx} className="border border-[#e8bfb0]/30 rounded-lg p-3 md:p-4 hover:border-[#c9a394] transition bg-white/30">
                        <div className="flex gap-3 md:gap-4">
                            <div className="w-12 h-16 md:w-16 md:h-20 bg-gradient-to-br from-[#f5d6d4] to-[#e8bfb0]/40 rounded flex items-center justify-center text-2xl md:text-3xl shrink-0">
                                {book.cover}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-medium text-[#5a4d41] truncate">{book.title}</h3>
                                <p className="text-[10px] md:text-xs text-[#7e6957] mb-1 md:mb-2 truncate">{book.author} · {book.genre}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 h-1 md:h-1.5 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] rounded-full"
                                            style={{ width: `${book.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-[#c9a394]">{book.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-2 md:py-3 border-2 border-dashed border-[#e8bfb0]/50 rounded-lg text-[#c9a394] hover:bg-[#f5d6d4]/20 transition flex items-center justify-center gap-2 text-xs md:text-sm">
                    <Plus size={14} /> New
                </button>
            </div>
        </div>
    );
};
const Shelves: React.FC = () => {
    const readingBooks = [
        { title: "The Midnight\nLibrary", w: 65, h: 90, bg: "#F0D9D4", textColor: "#5A3A3A", progress: 35 },
        { title: "The Art of\nThinking", w: 68, h: 90, bg: "#D4C0B8", textColor: "#3A2A2A", progress: 60 },
        { title: "Strategic\nWriting", w: 64, h: 90, bg: "#F5E0D8", textColor: "#2A2A2A", progress: 20 },
    ];

    const nextUpBooks = [
        { title: "Lietuvos\nPaukščiai", w: 62, h: 88, bg: "#E8D0C8", textColor: "#2A4A5A" },
        { title: "The Lord of\nthe Rings", w: 64, h: 88, bg: "#C0A8A0", textColor: "#F0E0C0" },
        { title: "Around the\nWorld", w: 62, h: 88, bg: "#F0D0A8", textColor: "#5A3A10" },
    ];

    const finishedBooks = [
        { title: "Steve Jobs", w: 62, h: 86, bg: "#E8E0D8", textColor: "#1A1A1A" },
        { title: "Profesionalas", w: 64, h: 86, bg: "#F0E0D0", textColor: "#3A2A1A" },
        { title: "One Year\nin a Ring", w: 62, h: 86, bg: "#C0D0D8", textColor: "#1A2A3A" },
    ];

    type Book = {
        title: string;
        w: number;
        h: number;
        bg: string;
        textColor: string;
        progress?: number;
    };

    function BookCover({ book }: { book: Book }) {
        const { w, h, bg, textColor, title, progress } = book;
        const lines = title.split("\n");
        const mid = h / 2;

        return (
            <div className="flex flex-col items-center" style={{ width: w }}>
                <div
                    className="rounded-sm overflow-hidden"
                    style={{ width: w, height: h, boxShadow: "2px 3px 12px rgba(181,139,124,0.25)", flexShrink: 0 }}
                >
                    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                        <rect width={w} height={h} fill={bg} rx={2} />
                        <text x={w / 2} y={mid} textAnchor="middle" fontSize={8} fill={textColor} fontFamily="Georgia,serif">
                            {lines.map((line, i) => (
                                <tspan key={i} x={w / 2} dy={i === 0 ? 0 : 10}>{line}</tspan>
                            ))}
                        </text>
                        <rect x={0} y={0} width={3} height={h} fill="rgba(0,0,0,0.08)" />
                    </svg>
                </div>
                {progress !== undefined && (
                    <div className="mt-1 rounded-sm overflow-hidden" style={{ width: w - 10, height: 3, background: "#F0D9D4" }}>
                        <div style={{ width: `${progress}%`, height: "100%", background: "#D9B6A8" }} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#FAF0E8] rounded-2xl border border-[#E8BFB0] p-4 md:p-6 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)] overflow-x-auto">
            <div className="min-w-[600px] md:min-w-0">
                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Currently reading</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {readingBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Next up</span>
                        <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {nextUpBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>

                <div>
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Finished</span>
                        <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {finishedBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>
            </div>
        </div>
    );
};
const ReadingGoals: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <h2 className="text-base md:text-lg font-serif text-[#5a4d41] mb-2 md:mb-3 flex items-center gap-2">
                <Target size={14} className="text-[#c9a394]" /> GOALS
            </h2>

            <div className="mb-2 md:mb-3">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-[#5a4d41]">2024: 20 books</span>
                    <span className="text-[#c9a394]">12/20</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="border border-[#e8bfb0]/30 rounded-lg p-2 text-center bg-white/30">
                    <p className="text-[10px] md:text-xs text-[#7e6957]">TBR</p>
                    <p className="text-base md:text-xl text-[#5a4d41] font-serif">24</p>
                </div>
                <div className="border border-[#e8bfb0]/30 rounded-lg p-2 text-center bg-white/30">
                    <p className="text-[10px] md:text-xs text-[#7e6957]">Reading</p>
                    <p className="text-base md:text-xl text-[#5a4d41] font-serif">5</p>
                </div>
            </div>

            <p className="text-[10px] md:text-xs text-[#c9a394] italic text-center">it's always a good day to read.</p>
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
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <h2 className="text-base md:text-lg font-serif text-[#5a4d41] mb-2 md:mb-3 flex items-center gap-2">
                <Plus size={14} className="text-[#c9a394]" /> QUICK
            </h2>
            <div className="space-y-0.5">
                {buttons.map((btn, idx) => (
                    <button key={idx} className="w-full text-left py-1 px-1 text-xs md:text-sm text-[#5a4d41] hover:bg-[#f5d6d4]/20 rounded-lg transition">
                        + {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};
const BooksRead: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <h2 className="text-base md:text-lg font-serif text-[#5a4d41] mb-2 md:mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-[#c9a394]" /> READ
            </h2>

            <div className="space-y-2">
                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs md:text-sm text-[#5a4d41]">I Like to Read</span>
                        <span className="text-xs md:text-sm text-[#c9a394]">100%</span>
                    </div>
                    <div className="w-full h-1 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] rounded-full" />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs md:text-sm text-[#5a4d41]">Full of Secrets</span>
                        <span className="text-xs md:text-sm text-[#c9a394]">50%</span>
                    </div>
                    <div className="w-full h-1 bg-[#f5d6d4]/30 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] rounded-full" />
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
        <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <h2 className="text-base md:text-lg font-serif text-[#5a4d41] mb-2 md:mb-3 flex items-center gap-2">
                <Star size={14} className="text-[#c9a394]" /> RECS
            </h2>

            <div className="space-y-2">
                {recs.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-1 border-b border-[#e8bfb0]/20 last:border-0">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-[#5a4d41] truncate">{rec.title}</p>
                            <p className="text-[10px] md:text-xs text-[#7e6957] truncate">{rec.books}</p>
                        </div>
                        <button className="text-[10px] px-2 py-0.5 border border-[#c9a394] text-[#c9a394] rounded hover:bg-[#c9a394] hover:text-white transition ml-2 shrink-0">
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
            <div className="absolute right-0 top-0 h-full w-64 bg-[#fcf9f4] p-5 shadow-lg border-l border-[#e8bfb0]" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#5a4d41]" onClick={onClose}>✕</button>
                <div className="mt-10 space-y-4">
                    <JournalMenu />
                    <QuickButtons />
                </div>
            </div>
        </div>
    );
};
export default function ProfilePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-[#faf5ea] pt-16 md:pt-20 px-3 md:px-6 pb-8">
            {/* Decorative elements */}
            <div className="fixed top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#e8bfb0]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Mobile menu button */}
            <button
                className="fixed bottom-4 right-4 z-40 md:hidden bg-[#c9a394] text-white p-3 rounded-full shadow-lg"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu size={20} />
            </button>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Jane Austen Quote */}
                <div className="text-center mb-3 md:mb-4 px-2">
                    <p className="text-xs md:text-base font-serif text-[#5a4d41] italic flex items-center justify-center gap-1 md:gap-2">
                        <Quote size={12} className="text-[#c9a394]" />
                        "I declare after all there is no enjoyment like reading."
                        <Quote size={12} className="text-[#c9a394]" />
                    </p>
                    <p className="text-[10px] md:text-xs text-[#c9a394] mt-0.5">— Jane Austen</p>
                </div>

                {/* Mobile layout - stack everything */}
                <div className="block md:hidden space-y-4">
                    <ProfileHeader />
                    <DateTimeCard />
                    <Calendar />
                    <WordOfTheDay />
                    <Shelves />
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
                            <section className="col-span-2"><Shelves /></section>
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