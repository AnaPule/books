
import { useState, useEffect } from "react";

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";

{/* =============== components ============ */ }
import { PageTemplate } from "@utils/PageTemplate";

{/* =============== components ============ */ }
import Flower_0 from '@assets/Flower_0.jpeg';
import Flower_1 from '@assets/Flower_1.jpeg';
import Flower_2 from '@assets/Flower_2.jpeg';
import Flower_3 from '@assets/Flower_3.jpeg';
import Flower_4 from '@assets/Flower_4.jpeg';
import Flower_5 from '@assets/Flower_5.jpeg';
import Flower_6 from '@assets/Flower_6.jpeg';
import Flower_7 from '@assets/Flower_7.jpeg';
import Flower_8 from '@assets/Flower_8.jpeg';

const ProfileHeader: React.FC = () => {
    const { user } = useAuth();
    //console.log(user)
    return (
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-6 relative z-5 font-sans">
            <div className="flex items-start flex-col md:flex-row gap-6 md:gap-8">
                {/*Profile Card*/}
                <div className="
                    rounded
                    border border-[white]/40 md:rounded-2xl 
                    shadow-xl w-full md:w-2/3 p-6 md:p-8 relative
                ">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjczNTUiLz48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0iI2Q0Yjg4YSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay" />

                    <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-center">
                        {/* Profile image with vintage frame */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#8b7355]/40 rounded-full opacity-20"></div>
                            <img
                                src={user?.profilePhoto || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"}
                                alt="Your portrait"
                                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#b8860b] relative z-10"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl text-[#f0e0c0] mb-1 tracking-wide uppercase">
                                {user?.username}
                            </h1>
                            <p className="text-[#c4a07c] italic text-sm mb-3 border-b border-[#8b7355]/30 pb-2 inline-block">
                                {user?.email || "scholar@oldlibrary.edu"}
                            </p>

                            <p className="text-[#d2b48c] text-sm leading-relaxed max-w-lg font-light">
                                {user?.bio || "Keeper of quiet pages • Seeker in candlelit corners."}
                            </p>

                            <div className="flex gap-6 mt-4 text-[#d4b88a] text-sm">
                                <div>
                                    <span className="font-bold text-xl">200</span>
                                    <span className="ml-1 text-xs uppercase opacity-80">Followers</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl">200</span>
                                    <span className="ml-1 text-xs uppercase opacity-80">Following</span>
                                </div>
                            </div>

                            <div className="flex lg:justify-start md:justify-start justify-center gap-3 mt-5">
                                <button className="px-6 py-2 bg-[#8b7355] text-[#f0e0c0] border border-[#d4b88a] text-sm hover:bg-[#6b5436] transition uppercase tracking-wider">
                                    EDIT
                                </button>
                                <button className="px-6 py-2 bg-transparent text-[#d4b88a] border border-[#d4b88a] text-sm hover:bg-[#d4b88a]/10 transition uppercase tracking-wider">
                                    WISHLIST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="border border-[white]/40 rounded-2xl 
                    md:w-1/3 p-6 flex flex-col justify-center
                    shadow-xl w-full h-[100%] md:p-8 relative
                    font-sans
                ">
                    <h3 className="text-xl text-[#d4b88a] mb-4 uppercase tracking-widest text-center border-b border-[#8b7355]/30 pb-2">
                        CLASSICS
                    </h3>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-3xl text-[#f0e0c0] font-bold">14h 37m</p>
                            <p className="text-[#c4a07c] text-sm uppercase tracking-wide">Reading This Month</p>
                        </div>
                        <div className="text-center pt-2 border-t border-[#8b7355]/30">
                            <p className="text-[#d2b48c]/30 text-xs italic">
                                ope is the thing with feathers that perches in the soul
                                <br />
                                ~ Dickinson
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WordOfTheDay: React.FC = () => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [previousImageIndex, setPreviousImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const flowerImages = [
        Flower_0, Flower_1, Flower_2, Flower_3,
        Flower_4, Flower_5, Flower_6, Flower_7, Flower_8
    ];

    const totalImages = flowerImages.length;

    useEffect(() => {
        // 5 minutes = 300,000 milliseconds
        const imageDuration = 300000;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setPreviousImageIndex(activeImageIndex);
            const nextIndex = (activeImageIndex + 1) % totalImages;
            setActiveImageIndex(nextIndex);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 1000);

        }, imageDuration);

        return () => clearInterval(interval);
    }, [activeImageIndex, totalImages]);

    return (
        <div className="border border-white/40 rounded p-6 text-center relative z-5 min-h-[350px] flex flex-col items-center justify-center overflow-hidden">
            {/* Previous Image (fading out) */}
            <img
                src={flowerImages[previousImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                style={{
                    filter: 'blur(2px) brightness(0.45)',
                    opacity: isTransitioning ? 0 : 1,
                    zIndex: isTransitioning ? 2 : 1,
                }}
            />

            {/* Current Image (fading in) */}
            <img
                src={flowerImages[activeImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                style={{
                    filter: 'blur(3px) brightness(0.45)',
                    opacity: isTransitioning ? 1 : 1,
                    zIndex: isTransitioning ? 3 : 2,
                }}
            />

            {/* vignette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            {/* Additional vignette layer */}
            <div
                className="absolute inset-0 pointer-events-none z-21"
                style={{
                    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
                    mixBlendMode: 'multiply'
                }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 z-22" />

            {/* Strong vignette – focus in center/left */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 35% 45%, transparent 18%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.98) 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />
            {/* Content */}
            <div className="relative z-30">
                <h3 className="text-lg text-[#d4b88a] mb-3 uppercase tracking-widest">
                    WORD OF THE DAY
                </h3>
                <p className="text-4xl text-[#f0e0c0] font-bold font-sans uppercase mb-2">Orenda</p> {/* word */}
                <p className="text-sm italic test-[#f0e0c0]">noun</p> {/* parts of speech */}
                <p className="text-sm italic text-[#f0e0c0] mb-2">o • ren • da / (n)</p> {/* latin/ pronunciation */}
                <p className="text-[#c4a07c] italic text-sm">a mystical force present in all people that empowers them to affect the world, or to effect change in their own lives.</p> {/* meaning */}
                <div className="mt-4 pt-4 border-t border-[#8b7355]/30">
                    <p className="text-[#d2b48c] text-xs italic">
                        "The beautiful thing about learning is that nobody can take it away from you."
                    </p> {/* qoute of the day */}
                    <p className="text-[#8b7355] text-xs mt-1">— B.B. King</p>
                </div>

                {/* Image indicator */}
                <div className="flex justify-center gap-1 mt-4">
                    {flowerImages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-0.5 rounded-full transition-all duration-300 ${index === activeImageIndex
                                ? 'bg-[#d4b88a] w-6'
                                : 'bg-[#8b7355]/50 w-4 hover:bg-[#8b7355]'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CommunitiesSection: React.FC = () => {
    const communities = [
        { name: "MIDNIGHT CODEX", readers: 162, threads: 38, description: "Secret society of night readers" },
        { name: "ASH & VELLUM", readers: 89, threads: 24, description: "For lovers of rare books" },
        { name: "CANDLELIT NOTES", readers: 215, threads: 52, description: "Poetry and prose circle" },
        { name: "FORGOTTEN SCRIPT", readers: 134, threads: 41, description: "Ancient texts discussion" },
    ];

    return (
        <div className=" border border-[#8b7355]/40 rounded-2xl p-6 relative z-5">
            <h2 className="text-2xl text-[#f0e0c0] mb-6 uppercase tracking-wider border-b border-[#8b7355]/30 pb-2 flex items-center justify-between">
                <span>COMMUNITIES</span>
                <span className="text-xs text-[#c4a07c]">FIND YOUR CIRCLE</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communities.map((comm) => (
                    <div key={comm.name} className="
                        border border-[white]/30 p-4 hover:border-[#d4b88a] transition-all
                        font-sans
                    ">
                        <h3 className=" text-lg text-[#d4b88a] mb-2">{comm.name}</h3>
                        <p className="text-[#c4a07c] text-xs mb-3 italic">{comm.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-[#8b7355] text-xs">{comm.readers} READERS • {comm.threads} THREADS</span>
                            <button className="px-4 py-1 border border-[#d4b88a] text-[#d4b88a] text-xs hover:bg-[#d4b88a] hover:text-[#1a0f05] transition uppercase">
                                JOIN
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FavoritesSection: React.FC = () => {
    const favorites = [
        { title: "THE SECRET HISTORY", author: "DONNA TARTT", year: "1992" },
        { title: "IF WE WERE VILLAINS", author: "M.L. RIO", year: "2017" },
        { title: "NINTH HOUSE", author: "LEIGH BARDUGO", year: "2019" },
        { title: "DORIAN GRAY", author: "OSCAR WILDE", year: "1890" },
    ];

    return (
        <div className="rounded-2xl border border-[#8b7355]/40 p-6 relative z-5">
            <h2 className="text-2xl text-[#f0e0c0] mb-6 uppercase tracking-wider border-b border-[#8b7355]/30 pb-2">
                FAVORITES
            </h2>

            <div className="space-y-3">
                {favorites.map((book, idx) => (
                    <div key={book.title} className="
            flex items-center gap-4 p-3 border border-[#8b7355]/30
            hover:border-[#d4b88a] transition-all group font-sans
          ">
                        <span className="text-[#8b7355] text-xl w-6">{idx + 1}</span>
                        <div className="flex-1">
                            <h4 className="text-base text-[#f0e0c0] group-hover:text-[#d4b88a]">
                                {book.title}
                            </h4>
                            <p className="text-[#c4a07c] text-xs">{book.author} • {book.year}</p>
                        </div>
                        <div className="w-10 h-14 bg-[#8b7355]/30 flex items-center justify-center text-[0.65rem] text-[#d2b48c]">
                            COVER
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DraftsSection: React.FC = () => {
    const drafts = [
        { title: "UNTITLED MYSTERY", lastEdited: "2 DAYS AGO", words: 1240 },
        { title: "POEMS FROM THE ATTIC", lastEdited: "1 WEEK AGO", words: 856 },
        { title: "WHISPERS IN LIBRARY", lastEdited: "3 WEEKS AGO", words: 2341 },
    ];

    return (
        <div className="rounded-2xl border border-[#8b7355]/40 p-6 relative z-5">
            <h2 className="text-2xl text-[#f0e0c0] mb-6 uppercase tracking-wider border-b border-[#8b7355]/30 pb-2">
                DRAFTS
            </h2>

            <div className="grid grid-cols-1 gap-3">
                {drafts.map((draft) => (
                    <div key={draft.title} className="
                        border border-[#8b7355]/30 p-4 hover:border-[#d4b88a] transition-all font-sans
                    ">
                        <div className="flex justify-between items-start">
                            <h4 className="text-base text-[#f0e0c0]">{draft.title}</h4>
                            <span className="text-[#8b7355] text-xs">{draft.words} WORDS</span>
                        </div>
                        <p className="text-[#c4a07c] text-xs mt-1">LAST EDITED: {draft.lastEdited}</p>
                        <button className="mt-3 text-[#d4b88a] text-xs underline hover:text-[#f0e0c0] transition uppercase">
                            CONTINUE WRITING →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NotificationsSection: React.FC = () => {
    const notifications = [
        { content: "New message from @litlover", time: "1h", type: "message" },
        { content: "Follow request from @bookwhisperer", time: "3h", type: "follow" },
        { content: "Midnight Codex: 2 new replies", time: "Yesterday", type: "thread" },
        { content: "@candlelitnotes followed you", time: "2d", type: "follow" },
    ];

    return (
        <div className="border border-[#8b7355]/40 p-6 rounded-2xl relative z-5">
            <h2 className="text-2xl text-[#f0e0c0] mb-6 uppercase tracking-wider border-b border-[#8b7355]/30 pb-2">
                NOTIFICATIONS
            </h2>

            <div className="space-y-3">
                {notifications.map((notif, index) => (
                    <div key={index} className="
            border border-[#8b7355]/30 p-3 hover:border-[#d4b88a] transition-all
            flex justify-between items-center
          ">
                        <p className="text-[#d2b48c] text-sm">{notif.content}</p>
                        <span className="text-[#8b7355] text-xs">{notif.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Footer: React.FC = () => (
    <footer className="font-sans border-t border-[#8b7355]/30 py-8 text-center mt-10">
        <p className=" italic text-[#d4b88a]">HARMONY — PRIVATE. SECURE. TIMELESS.</p>
        <p className="mt-2 text-[#8b7355] text-xs">© {new Date().getFullYear()} • RETURN WHEN THE WORLD GROWS LOUD</p>
        <div className="flex justify-center gap-6 mt-4 text-[#8b7355] text-xs">
            <a href='/home#home'>HOME</a>
            <a href='/home#about'>ABOUT</a>
            <a href='/home#features'>FEATURES</a>
            <a>ACCOUNT</a>
        </div>
    </footer>
);

export default function ProfilePage() {
    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
                    pointerEvents: 'none',
                }}
            />

            <div className="min-h-screen text-[#d2b48c] mt-20">
                <ProfileHeader />

                {/* Word of the Day - Full width like in your screenshot */}
                <div className="max-w-6xl mx-auto px-5 md:px-8 mt-8">
                    <WordOfTheDay />
                </div>

                {/* Main grid layout - Like Dark Academia planner */}
                <div className="max-w-6xl mx-auto px-5 md:px-8 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CommunitiesSection />
                        <FavoritesSection />
                    </div>
                </div>

                {/* Secondary grid */}
                <div className="max-w-6xl mx-auto px-5 md:px-8 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DraftsSection />
                        <NotificationsSection />
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}