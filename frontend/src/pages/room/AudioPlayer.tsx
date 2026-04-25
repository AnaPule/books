import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Shuffle, List, X } from 'lucide-react';
import { type Song } from '@models/Song';

// Random atmospheric images for the player
const atmoshpericImages = [
    "https://i.pinimg.com/736x/e0/13/9d/e0139d2f2f2193fcd0d7ae3e0d1121e4.jpg", // piano keys
    "https://i.pinimg.com/736x/ab/f9/2c/abf92c4dd00490f9a9c848028fe6e7a6.jpg", // if its meant to be it will be
    "https://i.pinimg.com/webp/1200x/b0/c9/90/b0c990d89921732ed030b3ae8adced6e.webp", // butterflies
    "https://i.pinimg.com/736x/90/13/12/90131274ebb698c6e7eb0dee72a67758.jpg", // sketched butterflies
    "https://i.pinimg.com/webp/1200x/8b/f0/59/8bf059e03c80709426699f96f80a2f79.webp", // repunzel flower
    "https://i.pinimg.com/736x/6d/b1/4a/6db14afa7b78ccbe883887bfb00dcb08.jpg", // hands
    "https://i.pinimg.com/1200x/cf/fc/80/cffc802b53b5ea30cc36fd1762a6d3ad.jpg", // books
    "https://i.pinimg.com/webp/1200x/7e/73/1b/7e731b7b83cd27126cf86415102d1bc9.webp", // books and coffee
];

interface AudioPlayerProps {
    playlist: Song[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist: originalPlaylist }) => {
    const [shuffledPlaylist, setShuffledPlaylist] = useState<Song[]>([]);
    const [trackIdx, setTrackIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.1);
    const [isMuted, setIsMuted] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [currentImage, setCurrentImage] = useState(atmoshpericImages[0]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    
    // Shuffle function
    const shuffleArray = (arr: Song[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Initialize shuffled playlist (auto-shuffle on mount)
    useEffect(() => {
        const shuffled = shuffleArray([...originalPlaylist]);
        setShuffledPlaylist(shuffled);
        // Set random image
        const randomImage = atmoshpericImages[Math.floor(Math.random() * atmoshpericImages.length)];
        setCurrentImage(randomImage);
        
        // Attempt autoplay on mount
        setTimeout(() => {
            if (audioRef.current) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            }
        }, 500);
    }, []);

    const currentPlaylist = shuffledPlaylist;
    const currentTrack = currentPlaylist[trackIdx];

    // Change image when track changes
    useEffect(() => {
        const randomImage = atmoshpericImages[Math.floor(Math.random() * atmoshpericImages.length)];
        setCurrentImage(randomImage);
    }, [trackIdx]);

    // Setup audio element events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (trackIdx + 1 < currentPlaylist.length) {
                setTrackIdx(trackIdx + 1);
            } else {
                setTrackIdx(0);
            }
        };
        const handleCanPlay = () => {
            audio.volume = volume;
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [trackIdx, currentPlaylist.length]);

    // Load new track
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.load();
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                setIsPlaying(false);
            });
        }
    }, [trackIdx]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    setIsPlaying(false);
                });
            }
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = progressBarRef.current?.getBoundingClientRect();
        if (rect && audioRef.current && duration > 0) {
            const x = e.clientX - rect.left;
            const percent = Math.min(1, Math.max(0, x / rect.width));
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(false);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
            } else {
                audioRef.current.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    const reshuffle = () => {
        const shuffled = shuffleArray([...originalPlaylist]);
        setShuffledPlaylist(shuffled);
        setTrackIdx(0);
    };

    const selectTrack = (index: number) => {
        setTrackIdx(index);
        setShowQueue(false);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <>
            <audio 
                ref={audioRef} 
                src={currentTrack?.file} 
                preload="metadata"
            />
            
            {/* Dark Apple-style player */}
            <div className="w-80 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Album Art / Atmospheric Image */}
                <div className="relative h-32 overflow-hidden">
                    <img 
                        src={currentImage} 
                        alt="Now playing"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Glass overlay for track info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-semibold text-white text-sm tracking-tight line-clamp-1 capitalize">{currentTrack?.title}</h3>
                        <p className="text-xs text-white/50 mt-0.5 capitalize">{currentTrack?.artist}</p>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="px-4 pt-3 pb-1">
                    <div 
                        ref={progressBarRef}
                        onClick={handleSeek}
                        className="h-1 bg-white/15 rounded-full overflow-hidden cursor-pointer group"
                    >
                        <div 
                            className="h-full bg-white/80 rounded-full relative group-hover:bg-white transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/30 mt-1.5 px-0.5">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-5 pb-3 pt-1">
                    <button 
                        onClick={() => setTrackIdx((i) => (i - 1 + currentPlaylist.length) % currentPlaylist.length)}
                        className="text-white/50 hover:text-white transition-all p-1"
                    >
                        <SkipBack size={20} />
                    </button>
                    
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-all shadow-lg"
                    >
                        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} className="ml-0.5" fill="black" />}
                    </button>
                    
                    <button 
                        onClick={() => setTrackIdx((i) => (i + 1) % currentPlaylist.length)}
                        className="text-white/50 hover:text-white transition-all p-1"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>
                
                {/* Bottom bar with volume and queue */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-3 border-t border-white/10 mt-1">
                    <div className="flex items-center gap-2 flex-1">
                        <button onClick={toggleMute} className="text-white/40 hover:text-white/70 transition-all">
                            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-1 rounded-full cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                            }}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={reshuffle}
                            className="text-white/40 hover:text-white/70 transition-all p-1"
                            title="Reshuffle playlist"
                        >
                            <Shuffle size={14} />
                        </button>
                        <button 
                            onClick={() => setShowQueue(!showQueue)}
                            className="text-white/40 hover:text-white/70 transition-all p-1"
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Queue Modal */}
            {showQueue && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setShowQueue(false)}
                    />
                    <div className="fixed bottom-24 left-6 right-6 max-w-sm mx-auto bg-black/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl z-50 overflow-hidden animate-slide-up">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <h3 className="font-semibold text-white text-sm">Playing Next</h3>
                            <button onClick={() => setShowQueue(false)} className="p-1 -mr-1">
                                <X size={16} className="text-white/50" />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {currentPlaylist.map((song, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectTrack(idx)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all text-left ${idx === trackIdx ? 'bg-white/5' : ''}`}
                                >
                                    <div className={`w-0.5 h-6 rounded-full ${idx === trackIdx ? 'bg-white' : 'bg-white/20'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${idx === trackIdx ? 'text-white' : 'text-white/60'}`}>
                                            {song.title}
                                        </p>
                                        <p className="text-xs text-white/30 truncate">{song.artist}</p>
                                    </div>
                                    {idx === trackIdx && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AudioPlayer;