// ---------------- REACT ------------------ //
import React, { useState, useRef, useEffect } from 'react';

// ---------------- SERVICES ------------------ //
import { useAuth } from '@context/AuthContext';

// ---------------- MODEL ------------------ //
import { PLAYLIST } from '@models/Song';
import { type Comment } from '@models/Book';
import { type BigRoom } from '@models/Book';

// ---------------- COMPONENTS ------------------ //
import { ChevronLeft, Minimize2, Maximize2, Send } from 'lucide-react';
import { toast } from 'sonner';
import AudioPlayer from './AudioPlayer';

// ---------------- IMAGES ------------------ //
import van from "@assets/quite_space/van.gif";
import light from "@assets/quite_space/light.gif";
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
                top left only, minimal
            ══════════════════════════════════════ */}
            <div className="absolute top-0 left-0 right-0 z-20 w-[73%] flex items-center justify-between p-5">
                <button
                    onClick={onExit}
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center group"
                >
                    <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center"
                >
                    {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
            </div>

            {/* ══════════════════════════════════════
                    LEFT COLUMN — book title + animated elements
                ══════════════════════════════════════ */}
            <div className="absolute left-0 bottom-0 flex flex-col justify-center pl-12 pr-8"
                style={{ width: '45%' }}>

                {/* Decorative element */}
                <div className="mb-8 opacity-40">
                    <div className="w-8 h-px bg-gradient-to-r from-[purple-400/60] to-transparent mb-2" />
                    <div className="w-12 h-px bg-gradient-to-r from-purple-400/40 to-transparent" />
                </div>

                {/* Room badge - subtle */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px w-8 bg-purple-300/20" />
                    <span className="text-[12px] tracking-[4px] uppercase text-purple-300/30 font-light">
                        Quiet Reading Room
                    </span>
                </div>

                {/* Book title - more dramatic */}
                <h1
                    className="text-white mb-6 font-light tracking-tight leading-[1.1]"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(48px, 7vw, 80px)',
                        fontStyle: 'italic',
                        textShadow: '0 0 60px rgba(139, 90, 200, 0.25)',
                    }}
                >
                    {room?.name}
                </h1>

                {/* Quote - more breathing room */}
                <div className="max-w-md pl-5 mb-10" style={{ borderLeft: '1px solid rgba(180,150,230,0.4)' }}>
                    <p
                        className="text-white/30 leading-relaxed mb-3"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '13px',
                            fontStyle: 'italic',
                            letterSpacing: '0.2px',
                        }}
                    >
                        "{quote?.quote}"
                    </p>
                    <p className="text-[10px] tracking-[3px] uppercase text-purple-300/40">
                        — {quote?.author}
                    </p>
                </div>

                {/* Decorative element at bottom */}
                <div className="mt-auto mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-purple-400/20" />
                        <div className="w-6 h-px bg-gradient-to-r from-purple-400/40 to-transparent" />
                        <span className="text-[6px] tracking-[3px] text-purple-300/40 uppercase">now reading</span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT COLUMN — Audio Player, Whispers 
            ══════════════════════════════════════ */}
            <div
                className="absolute right-2 top-2 bottom-2 flex flex-col z-20"
                style={{
                    width: '26%',
                    borderLeft: '0.5px solid rgba(255,255,255,0.04)',
                    background: 'rgba(5,3,12,0.3)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                }}
            >
                {/* Audio Player */}
                <div className="px-16 pt-4 pb-3">
                    <AudioPlayer  />
                </div>

                {/* Header */}
                <div
                    className="px-5 pt-7 pb-4 mt-7 flex-shrink-0 border-t border-white/5"
                    style={{
                        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
                    }}
                >
                    <p className="text-[10px] tracking-[3px] uppercase text-[var(--dusty-rose)] mb-2">
                        ✦ &nbsp;whispers
                    </p>
                    <p
                        className="text-white/45 leading-[1.25]"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px' }}
                    >
                        Join the conversation
                    </p>
                </div>

                {/* Fade */}
                <div
                    className="flex-shrink-0 h-2 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(5,3,12,0.5), transparent)' }}
                />

                {/* Feed */}
                <div
                    className="flex-1 overflow-y-auto px-5 py-2 flex flex-col gap-4"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {room?.quietRoom?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                            <span className="text-white/15 text-lg">✦</span>
                            <span
                                className="text-white/15 text-sm"
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
                                            className="text-purple-300/55 uppercase text-[10px]"
                                        >
                                            {c.user?.name || 'reader'}
                                        </span>
                                        <span className="text-white/12 text-[9px]">·</span>
                                    </div>
                                    <p className="text-white/30 text-[12px] leading-[1.65]">
                                        {c.content}
                                    </p>
                                </div>
                            ))
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div
                    className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                    style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)' }}
                >
                    <span className="text-purple-300/22 text-[10px] flex-shrink-0">✦</span>
                    <input
                        value={liveComment}
                        onChange={e => setLiveComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && postWhisper()}
                        placeholder="whisper something quietly…"
                        className="flex-1 bg-transparent border-none outline-none text-white/45 placeholder:text-white/15 text-[13px]"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                        }}
                    />
                    <button
                        onClick={postWhisper}
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
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
                        <Send size={10} />
                    </button>
                </div>
            </div>

            {/* Seam label */}
            <div
                className="absolute pointer-events-none z-5 text-white/[0.04] whitespace-nowrap"
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