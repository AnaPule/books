// ---------------- REACT ------------------ //
import React, { useState, useRef, useEffect } from 'react';

// ---------------- SERVICES ------------------ //
import { useAuth } from '@context/AuthContext';

// ---------------- MODEL ------------------ //
import { type Comment } from '@models/Book';
import { type BigRoom } from '@models/Book';

// ---------------- COMPONENTS ------------------ //
import { ChevronLeft, Minimize2, Maximize2, Send } from 'lucide-react';
import { toast } from 'sonner';
import AudioPlayer from './AudioPlayer';

// ---------------- IMAGES ------------------ //
import van from "@assets/quite_space/van.gif";
import night from "@assets/quite_space/night.jpeg";
import fire from "@assets/quite_space/fire.gif";
import fire2 from "@assets/quite_space/fire2.jpeg";

interface Props {
    room: BigRoom | null;
    onExit: any;
    onSend: (content: string, quiet_room: boolean) => void;
}

export const quiet: React.FC<Props> = ({ room, onSend, onExit }) => {
    const { quote } = useAuth();
    const [liveComment, setLiveComment] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const backgrounds: string[] = [
        van, night,
        fire, fire2
    ];

    const [backgroundImage] = useState<string>(
        () => backgrounds[Math.floor(Math.random() * backgrounds.length)]
    );

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [room?.quietRoom]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const postWhisper = async () => {
        if (!liveComment.trim()) return;
        try {
            await onSend(liveComment, true);
            setLiveComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
            toast.error('Failed to post comment');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden"
            style={{ fontFamily: "'Jost', sans-serif" }}>

            {/* ── Background gif ── */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-9000"
                style={{ backgroundImage: `url(${backgroundImage})`, filter: 'brightness(0.4) blur(1px) saturate(10%)' }}
            />

            {/* ── Left-side overlay: let gif breathe ── */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

            {/* ── Deep vignette edges ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.75)' }}
            />

            {/* ── Floating orbs / glimmers ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(24)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 12 + 3}px`,
                            height: `${Math.random() * 12 + 3}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, var(--coral-blush) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 70%)`,
                            boxShadow: `0 0 ${Math.random() * 8 + 4}px rgba(168, 85, 247, 0.5)`,
                            filter: 'blur(2px)',
                            animation: `float-glimmer ${Math.random() * 8 + 5}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 6}s`,
                            opacity: 0.5 + Math.random() * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* ── Larger ambient light orbs ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`large-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 60 + 20}px`,
                            height: `${Math.random() * 60 + 20}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`,
                            filter: 'blur(15px)',
                            animation: `float-slow ${Math.random() * 15 + 10}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 8}s`,
                        }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════
                TOP NAV - Responsive
            ══════════════════════════════════════ */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-5">
                <button
                    onClick={onExit}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center group"
                >
                    <ChevronLeft size={16} className="sm:size-[17px] group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center"
                >
                    {isFullscreen ? <Minimize2 size={14} className="sm:size-[15px]" /> : <Maximize2 size={14} className="sm:size-[15px]" />}
                </button>
            </div>

            {/* ══════════════════════════════════════
                LEFT COLUMN — Responsive
            ══════════════════════════════════════ */}
            <div className="absolute left-0 bottom-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8"
                style={{ width: '100%', maxWidth: '85%', top: '15%' }}>

                {/* Room badge - responsive */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                    <div className="h-px w-6 bg-purple-300/20" />
                    <span className="text-[8px] sm:text-[10px] md:text-[12px] tracking-[2px] sm:tracking-[4px] uppercase text-purple-300/30 font-light">
                        Quiet Reading Room
                    </span>
                </div>

                {/* Book title - responsive */}
                <h1
                    className="text-white mb-4 sm:mb-6 font-light tracking-tight leading-[1.1]"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(32px, 8vw, 80px)',
                        fontStyle: 'italic',
                        textShadow: '0 0 60px rgba(139, 90, 200, 0.25)',
                    }}
                >
                    {room?.name}
                </h1>

                {/* Quote - responsive */}
                <div className="max-w-md pl-3 sm:pl-5 mb-6 sm:mb-8 md:mb-10" style={{ borderLeft: '1px solid rgba(180,150,230,0.4)' }}>
                    <p
                        className="text-white/30 leading-relaxed mb-2 line-clamp-3"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(10px, 3vw, 13px)',
                            fontStyle: 'italic',
                            letterSpacing: '0.2px',
                        }}
                    >
                        "{quote?.quote}"
                    </p>
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[2px] sm:tracking-[3px] uppercase text-purple-300/40">
                        — {quote?.author}
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT COLUMN — Mobile: bottom sheet, Desktop: sidebar
            ══════════════════════════════════════ */}
            <div
                className="fixed lg:absolute right-0 bottom-0 lg:top-2 lg:bottom-2 flex flex-col z-20 w-full lg:w-[320px] xl:w-[26%]"
                style={{
                    maxHeight: '45vh',
                    borderTop: '0.5px solid rgba(255,255,255,0.04)',
                    background: 'rgba(5,3,12,0.85)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                }}
            >
                {/* Grab handle for mobile */}
                <div className="lg:hidden w-full flex justify-center py-2">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Audio Player - responsive padding */}
                <div className="px-3 sm:px-4 lg:px-6 pt-3 pb-2">
                    <AudioPlayer />
                </div>

                {/* Header */}
                <div
                    className="px-4 sm:px-5 pt-4 pb-3 flex-shrink-0 border-t border-white/5"
                    style={{
                        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
                    }}
                >
                    <p className="text-[8px] sm:text-[10px] tracking-[3px] uppercase text-[var(--dusty-rose)] mb-1 sm:mb-2">
                        ✦ &nbsp;whispers
                    </p>
                    <p
                        className="text-white/45 leading-[1.25] text-sm sm:text-base"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Join the conversation
                    </p>
                </div>

                {/* Feed - responsive scroll */}
                <div
                    className="flex-1 overflow-y-auto px-4 sm:px-5 py-2 flex flex-col gap-3 sm:gap-4"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {room?.quietRoom?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                            <span className="text-white/15 text-base sm:text-lg">✦</span>
                            <span
                                className="text-white/15 text-xs sm:text-sm"
                                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                            >
                                silence…
                            </span>
                        </div>
                    ) : (
                        room?.quietRoom
                            .sort((a: Comment, b: Comment) =>
                                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                            )
                            .map((c, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className="text-purple-300/55 uppercase text-[9px] sm:text-[10px]"
                                        >
                                            {c.user?.name || 'reader'}
                                        </span>
                                        <span className="text-white/12 text-[8px] sm:text-[9px]">·</span>
                                    </div>
                                    <p className="text-white/30 text-[11px] sm:text-[12px] leading-[1.65] break-words">
                                        {c.content}
                                    </p>
                                </div>
                            ))
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input - responsive */}
                <div
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 flex-shrink-0"
                    style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)' }}
                >
                    <span className="text-purple-300/22 text-[8px] sm:text-[10px] flex-shrink-0">✦</span>
                    <input
                        value={liveComment}
                        onChange={e => setLiveComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && postWhisper()}
                        placeholder="whisper something quietly…"
                        className="flex-1 bg-transparent border-none outline-none text-white/45 placeholder:text-white/15 text-xs sm:text-[13px]"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                        }}
                    />
                    <button
                        onClick={postWhisper}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                            border: '0.5px solid rgba(180,150,230,0.2)',
                            background: 'rgba(180,150,230,0.05)',
                            color: 'rgba(180,150,230,0.4)',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(180,150,230,0.15)';
                            (e.currentTarget as HTMLElement).style.color = 'rgba(180,150,230,0.8)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(180,150,230,0.05)';
                            (e.currentTarget as HTMLElement).style.color = 'rgba(180,150,230,0.4)';
                        }}
                    >
                        <Send size={12} />
                    </button>
                </div>
            </div>

            {/* Seam label - hidden on mobile */}
            <div
                className="hidden lg:block absolute pointer-events-none z-5 text-white/[0.04] whitespace-nowrap"
                style={{
                    top: '50%',
                    left: '54%',
                    transform: 'translate(-50%, -50%) rotate(90deg)',
                    fontSize: '8px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                }}
            >
                pages &amp; parchment · quiet room
            </div>

        </div>
    );
};