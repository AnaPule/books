import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, List, ChevronUp, ChevronDown } from 'lucide-react';
import { classicalPlaylist, animePlaylist, moviesPlaylist, ambientPlaylist, rnbPlaylist, PLAYLIST, type Song } from '@models/Song';

// Random atmospheric images for the player
const atmoshpericImages = [
    "https://i.pinimg.com/736x/0d/23/75/0d2375a300ab16c365d226b8575c4465.jpg",
    "https://i.pinimg.com/736x/e7/22/01/e7220149ade242210c2db5cd48b9652c.jpg",
    "https://i.pinimg.com/1200x/c2/13/e3/c213e38917796b009bf3ca022238b49c.jpg",
    "https://i.pinimg.com/736x/ed/aa/7d/edaa7df872ee8fcf39a6180ae709ff25.jpg",
    "https://i.pinimg.com/736x/33/58/98/3358981de9da34e91e1e497950f459b1.jpg",
    "https://i.pinimg.com/736x/de/fc/04/defc04ad71befa930a8829ebcd3b6f0a.jpg",
    "https://i.pinimg.com/736x/4a/0e/e5/4a0ee54f03d9e4824b3604aecf652335.jpg",
    "https://i.pinimg.com/webp/1200x/fe/6c/27/fe6c27628a38ccc348e2a4795e3c932b.webp"
];

type Category = 'all' | 'classical' | 'anime' | 'movies' | 'ambient' | 'rnb';

const AudioPlayer: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
    const [trackIdx, setTrackIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [isMuted, setIsMuted] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [currentImage, setCurrentImage] = useState(atmoshpericImages[0]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const getPlaylistByCategory = (category: Category): Song[] => {
        switch (category) {
            case 'all': return [...PLAYLIST];
            case 'classical': return [...classicalPlaylist];
            case 'anime': return [...animePlaylist];
            case 'movies': return [...moviesPlaylist];
            case 'ambient': return [...ambientPlaylist];
            case 'rnb': return [...rnbPlaylist];
            default: return [...PLAYLIST];
        };
    };

    const shuffleArray = (arr: Song[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Load playlist when category changes
    useEffect(() => {
        const newPlaylist = getPlaylistByCategory(activeCategory);
        const shuffled = shuffleArray(newPlaylist);
        setCurrentPlaylist(shuffled);
        setTrackIdx(0);

        // Reset audio element
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Get new random image
        const randomImage = atmoshpericImages[Math.floor(Math.random() * atmoshpericImages.length)];
        setCurrentImage(randomImage);
    }, [activeCategory]);

    const currentTrack = currentPlaylist[trackIdx];

    // Auto-play next track or loop
    useEffect(() => {
        if (!currentTrack?.file) return;

        if (audioRef.current) {
            audioRef.current.load();

            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        setIsPlaying(false);
                    });
                }
            }
        }
    }, [trackIdx, currentTrack]);

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        // FIXED: Use a function that reads the CURRENT trackIdx
        const handleEnded = () => {
            setTrackIdx((prevIdx) => {
                if (prevIdx + 1 < currentPlaylist.length) {
                    return prevIdx + 1;
                } else {
                    return 0;
                }
            });
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
    }, [currentPlaylist.length]);

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
        const currentBasePlaylist = getPlaylistByCategory(activeCategory);
        const shuffled = shuffleArray(currentBasePlaylist);
        setCurrentPlaylist(shuffled);
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
            <audio ref={audioRef} src={currentTrack?.file} preload="metadata" />

            {/* Category Selector */}
            <div className="relative z-3 flex gap-2 mb-4 flex-wrap justify-center">
                <button
                    onClick={
                        () => {
                            setActiveCategory('all')
                        }
                    }
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'classical'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                >
                    Music
                </button>
                <button
                    onClick={
                        () => {
                            setActiveCategory('classical')
                        }
                    }
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'classical'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                >
                    Classical
                </button>
                <button
                    onClick={
                        () => {
                            setActiveCategory('anime')
                        }
                    }
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'anime'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                >
                    Anime
                </button>
                <button
                    onClick={
                        () => {
                            setActiveCategory('movies')
                        }
                    }
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'movies'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                >
                    Movies
                </button>
                <button
                    onClick={
                        () => {
                            setActiveCategory('ambient')
                        }
                    }
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'ambient'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                >
                    Ambient
                </button>
                <button
                    onClick={() => setActiveCategory('rnb')}
                    className={`relative z-50 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${activeCategory === 'rnb'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    type="button"
                >
                    R&B
                </button>
            </div>

            {/* Music Player */}
            <div className="w-full bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">

                <div className="flex justify-center items-center pt-5">
                    <div className="aspect-square w-48 sm:w-56 md:w-64 overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/20 to-black/50 shadow-xl border border-white/10">
                        <img
                            src={currentImage}
                            alt="Album art"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="px-5 pt-5 pb-2 text-center">
                    <h3 className="font-medium text-white text-base tracking-tight line-clamp-1 capitalize">
                        {currentTrack?.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 capitalize">
                        {currentTrack?.artist}
                    </p>
                </div>

                <div className="px-5 pt-2 pb-1">
                    <div
                        ref={progressBarRef}
                        onClick={handleSeek}
                        className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                    >
                        <div
                            className="h-full bg-white/60 rounded-full relative group-hover:bg-white transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/25 mt-1.5 px-0.5">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-3">
                    <button
                        onClick={() => setTrackIdx((i) => (i - 1 + currentPlaylist.length) % currentPlaylist.length)}
                        className="text-white/40 hover:text-white/80 transition-all p-1"
                    >
                        <SkipBack size={20} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-105 transition-all shadow-lg hover:bg-white"
                    >
                        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} className="ml-0.5" fill="black" />}
                    </button>

                    <button
                        onClick={() => setTrackIdx((i) => (i + 1) % currentPlaylist.length)}
                        className="text-white/40 hover:text-white/80 transition-all p-1"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>

                <div className="px-5 pb-4 pt-2 flex items-center justify-between gap-3 border-t border-white/5 mt-1">
                    <div className="flex items-center gap-2 flex-1">
                        <button onClick={toggleMute} className="text-white/30 hover:text-white/60 transition-all">
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
                                background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%)`
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={reshuffle}
                            className="text-white/30 hover:text-white/60 transition-all p-1"
                            title="Reshuffle playlist"
                        >
                            <Shuffle size={13} />
                        </button>
                        <button
                            onClick={() => setShowQueue(!showQueue)}
                            className="text-white/30 hover:text-white/60 transition-all p-1 flex items-center gap-1"
                        >
                            <List size={13} />
                            {showQueue ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        </button>
                    </div>
                </div>

                {showQueue && (
                    <div className="border-t border-white/5 max-h-40 overflow-y-auto">
                        <div className="px-3 py-2 bg-white/5">
                            <p className="text-[9px] text-white/30 uppercase tracking-wider font-medium px-2">Playing Next</p>
                        </div>
                        {currentPlaylist.map((song, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectTrack(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all text-left group ${idx === trackIdx ? 'bg-white/5' : ''}`}
                            >
                                <div className={`w-0.5 h-4 rounded-full ${idx === trackIdx ? 'bg-white/60' : 'bg-white/10'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs truncate ${idx === trackIdx ? 'text-white/80 font-medium' : 'text-white/40 group-hover:text-white/60'}`}>
                                        {song.title}
                                    </p>
                                    <p className="text-[10px] text-white/20 truncate">{song.artist}</p>
                                </div>
                                {idx === trackIdx && (
                                    <div className="w-1 h-1 rounded-full bg-white/40" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AudioPlayer;