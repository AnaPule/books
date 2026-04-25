

// ---------------- REACT ------------------ //
import React, { useState, useRef, useEffect } from 'react';

// ---------------- SERVICES ------------------ //
import { useAuth } from '@context/AuthContext';

// ---------------- MODEL ------------------ //
import { PLAYLIST } from '@models/Song';
import { type Comment } from '@models/Book';
import { type BigRoom } from '@models/Book';

// ---------------- COMPONENTS ------------------ //
import { 
    ChevronLeft, Sparkles, Activity,
    Send,
 } from 'lucide-react';
import { toast } from 'sonner';
import AudioPlayer from './AudioPlayer';

// ---------------- IMAGES ------------------ //
import city from "@assets/quite_space/City.gif";
import fire from "@assets/quite_space/fire.gif";
import fire2 from "@assets/quite_space/fire2.gif";
import fire3 from "@assets/quite_space/firework.gif";
import porch from "@assets/quite_space/porch.gif";
import rain1 from "@assets/quite_space/rain.gif";
import rain2 from "@assets/quite_space/rain2.gif";
import rain3 from "@assets/quite_space/rain3.gif"
import room1 from "@assets/quite_space/Room.gif?url";
import room2 from '@assets/quite_space/Room2.gif';
import stars from "@assets/quite_space/starts.gif";
import street1 from "@assets/quite_space/street.gif";
import street2 from "@assets/quite_space/street2.gif";
import van from "@assets/quite_space/van.gif";
import water1 from "@assets/quite_space/water.gif";
import water2 from "@assets/quite_space/water2.gif";
import window from "@assets/quite_space/window.jpeg";


interface props {
    room: BigRoom | null,
    onExit: any,
    onSend: (content: string, quiet_room: boolean) => void,
}

export const quiet: React.FC<props> = ({ room, onSend, onExit }) => {

    const { quote } = useAuth();
    const [liveComment, setLiveComment] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const backgrounds: string[] = [
        city,
        fire, fire2, fire3,
        porch,
        rain1, rain2, rain3,
        room1, room2,
        stars,
        street1, street2,
        van,
        water1, water2,
        window
    ];

    const [backgroundImage, setBackgroundImage] = useState<string>(backgrounds[0] || water1);

    useEffect(() => {
        if (backgrounds.length > 0) {
            const randomIndex = Math.floor(Math.random() * backgrounds.length);
            setBackgroundImage(backgrounds[randomIndex]);
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [room?.quietRoom]);

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
        <>
            <div className="fixed inset-0 z-[999]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={onExit} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-md hover:bg-white/20 transition-all">
                        <ChevronLeft size={16} /> Back
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                        <span className="text-sm text-white/80">12 reading together</span>
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
                        <Sparkles size={12} className="text-blue-300" />
                        <span className="text-xs text-blue-300 font-semibold tracking-wide">Quiet Reading Room</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-light text-white mb-4">{room?.name}</h1>
                    <p className="italic text-lg text-white/55 max-w-md">"{quote?.quote}</p>
                    <p className="text-xs text-white/30 capitialize mt-2">— {quote?.author}</p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex gap-4">

                    <AudioPlayer
                        playlist={PLAYLIST} />

                    <div className="flex-1 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                        <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
                            <Activity size={13} className="text-blue-300" />
                            <span className="text-[11px] font-bold tracking-wide text-blue-300 uppercase">Whispers</span>
                            <span className="text-xs text-white/50 ml-auto">{room?.quietRoom.length} messages</span>
                        </div>
                        <div className="h-40 overflow-y-auto p-3 space-y-1.5">
                            {room?.quietRoom
                                .sort((a: Comment, b: Comment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((c, idx) => (
                                    <div key={idx} className="text-sm flex gap-2">
                                        <span className="text-blue-300 font-semibold flex-shrink-0">{c.user.name}</span>
                                        <span className="text-white/70">{c.content}</span>
                                    </div>
                                ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-2 border-t border-white/10 flex gap-2">
                            <input
                                value={liveComment}
                                onChange={e => setLiveComment(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && postWhisper()}
                                placeholder="Whisper something quietly…"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/50"
                            />
                            <button onClick={postWhisper} className="px-3 rounded-lg bg-blue-400 text-black hover:bg-blue-300 transition-colors">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}