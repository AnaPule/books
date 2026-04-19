
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { toast } from 'sonner';
import {
    MessageSquare, Heart, ThumbsUp, ThumbsDown, Flag, Share2,
    Send, Users, Hash, DoorOpen, ChevronLeft, ChevronRight,
    X, Maximize2, Minimize2, Volume2, VolumeX, Sparkles,
    BookOpen, Clock, Pin, Reply, MoreHorizontal, Image, Link2,
    CornerDownRight, Activity, Flame, Star, Music, Headphones,
    Search, Bell, Settings, Plus, ChevronDown, Mic, MicOff
} from 'lucide-react';
import Room2 from '@assets/quite_space/Room2.gif';
import { request } from '@utils/ApiRequest';
import type { Book, Room, Comment, } from '@models/Book';

interface BigRoom {
    id: string;
    name: string;
    book: Book;
    members: number;
    comments: Comment[];
    subRooms: Room[];
}

// ─── Using your index.css blues directly ──────────────────────────
// These match your CSS variables from index.css
const colors = {
    // Your blues from index.css
    powderBlue: '#E0E9F0',
    skyMist: '#D0E0E8',
    periwinkle: '#C0D4E0',
    mistyLavender: '#B0C4D0',
    dustyBlue: '#9CB0C0',
    slatePastel: '#8098A8',

    // Your existing accent colors
    rose: '#c9a394',
    roseDeep: '#b58b7c',

    // Text colors (dark for contrast on your light blue background)
    text: {
        primary: '#2C3E4E',
        secondary: '#5A6E7E',
        muted: '#8A9AAA',
    }
};

// Profile colors - from your palette
const AVATAR_COLORS = [
    colors.slatePastel,
    colors.dustyBlue,
    colors.mistyLavender,
    colors.periwinkle,
    colors.rose,
    colors.roseDeep,
];

function avatarColor(name: string) {
    let n = 0;
    for (const c of name) n += c.charCodeAt(0);
    return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

// ─── mock data (same as before) ─────────────────────────────────
const MOCK_ROOM = {
    id: 'room-1',
    name: 'The Great Gatsby',
    bookId: 'book-1',
    bookName: 'The Great Gatsby',
    bookAuthor: 'F. Scott Fitzgerald',
    bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300',
    description: "Diving deep into Fitzgerald's masterpiece — themes of wealth, love, and the American Dream.",
    memberCount: 234,
    isUserMember: true,
};

const MOCK_CATEGORIES = [
    {
        id: 'cat-1', name: 'Text Channels',
        subRooms: [
            { id: 'sub-1', name: 'general', memberCount: 156, isActive: true, lastActive: 'just now' },
            { id: 'sub-2', name: 'chapter-1-3', memberCount: 89, isActive: true, lastActive: '2 min ago' },
            { id: 'sub-3', name: 'chapter-4-6', memberCount: 67, isActive: false, lastActive: '1 hr ago' },
            { id: 'sub-4', name: 'chapter-7-9', memberCount: 54, isActive: false, lastActive: '3 hrs ago' },
        ],
    },
    {
        id: 'cat-2', name: 'Analysis',
        subRooms: [
            { id: 'sub-5', name: 'character-analysis', memberCount: 43, isActive: true, lastActive: '5 min ago' },
            { id: 'sub-6', name: 'themes-symbolism', memberCount: 38, isActive: false, lastActive: 'yesterday' },
            { id: 'sub-7', name: 'adaptations', memberCount: 29, isActive: false, lastActive: '2 days ago' },
        ],
    },
];

const MOCK_QUIET_COMMENTS = [
    { user: 'Clara', message: 'This is so peaceful…', time: new Date(Date.now() - 1000 * 60 * 5) },
    { user: 'Rowan', message: 'I could stay here forever', time: new Date(Date.now() - 1000 * 60 * 3) },
    { user: 'Theo', message: 'The perfect reading atmosphere', time: new Date(Date.now() - 1000 * 60 * 2) },
    { user: 'Elise', message: 'Has anyone read chapter 7 yet? 😭', time: new Date(Date.now() - 1000 * 60 * 1) },
    { user: 'Marcus', message: 'The confrontation scene is devastating', time: new Date(Date.now() - 1000 * 30) },
];

function timeAgo(ts: string) {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT - NO BACKGROUND COLOR SET
// ═══════════════════════════════════════════════════════════════

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name[0].toUpperCase();
};

export const DiscussionRoomPage: React.FC = () => {
    const { user } = useAuth();
    const [room] = useState(MOCK_ROOM);
    const [testRoom, setRoom] = useState<BigRoom | null>(null);
    const [categories] = useState(MOCK_CATEGORIES);
    const [activeSubRoom, setActiveSubRoom] = useState<Room | null>(null);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [isQuietMode, setIsQuietMode] = useState(false);
    const [showBookInfo, setShowBookInfo] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    //const commentsEndRef = useRef<HTMLDivElement>(null);
    const { book_id, room_id } = useParams();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await request.get<any>(`/rooms/book/${book_id}`);
                //console.log('room', res);

                const fetchedRoom = res.room;
                setRoom(fetchedRoom);

                if (fetchedRoom?.id === room_id) {
                    //console.log('selected room: ', fetchedRoom);
                    setActiveSubRoom(fetchedRoom);
                } else {
                    const foundSubRoom = fetchedRoom?.subRooms?.find((r: any) => r.id === room_id);
                    if (foundSubRoom) {
                        setActiveSubRoom(foundSubRoom);
                        console.log('selected room: ', foundSubRoom);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch room:', error);
            }
        };

        fetchRoom();
    }, [book_id, room_id]);
    /*
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);
    */

    const handlePost = async () => {
        if (!newComment.trim()) return;

        const commentData = {
            roomId: activeSubRoom?.id,
            userId: user?.id,
            parentId: replyTo?.id || null,
            content: newComment,
        };

        try {
            await request.post(`/rooms/post-comment`, commentData);

            // Refresh the room data to get the new comment with proper structure
            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}`);
            setRoom(refreshedRoom.room);

            setNewComment('');
            setReplyTo(null);
        } catch (error) {
            console.error('Failed to post comment:', error);
            toast.error('Failed to post comment');
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            await request.post(`/rooms/interact`, {
                commentId: commentId,
                userId: user?.id,
                type: 1  // 1 = like
            });

            // Refresh to get updated likes
            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}`);
            setRoom(refreshedRoom.room);
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const handleDislike = async (commentId: string) => {
        try {
            await request.post(`/rooms/interact`, {
                commentId: commentId,
                userId: user?.id,
                type: 2  // 2 = dislike
            });

            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}`);
            setRoom(refreshedRoom.room);
        } catch (error) {
            console.error('Failed to dislike comment:', error);
        }
    };

    if (isQuietMode) return <QuietRoom room={room} onExit={() => setIsQuietMode(false)} />;

    return (
        <div className="min-h-screen pt-16">
            <div className="flex h-screen overflow-hidden">
                <SubRoomSidebar
                    room={testRoom || null}
                    categories={categories}
                    activeSubRoom={activeSubRoom}
                    onSelect={setActiveSubRoom}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(v => !v)}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* header with notifications */}
                    <ChatHeader
                        room={testRoom || null}
                        activeSubRoom={activeSubRoom}
                        onQuietMode={() => setIsQuietMode(true)}
                        onToggleBookInfo={() => setShowBookInfo(v => !v)}
                    />

                    {/* system rules and guidlines */}
                    <div className="flex-1 overflow-y-auto px-4">
                        {(() => {
                            const pinnedComment = testRoom?.comments.find(c => c.user.user_id == 'system');
                            if (!pinnedComment) return null;

                            return (
                                <div className="mb-6 rounded-xl border" style={{ borderColor: `${colors.dustyBlue}25`, backgroundColor: `${colors.dustyBlue}05` }}>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-t-xl" style={{ backgroundColor: `${colors.dustyBlue}10`, borderBottom: `1px solid ${colors.dustyBlue}15` }}>
                                        <Pin size={12} color={colors.dustyBlue} />
                                        <span className="text-xs font-medium" style={{ color: colors.dustyBlue }}>Welcome to {testRoom?.name}</span>
                                    </div>
                                    <div className="px-4 py-3">
                                        <div dangerouslySetInnerHTML={{ __html: pinnedComment?.content || '' }} />
                                    </div>
                                </div>
                            );
                        })()}

                        {/* room comments */}
                        <div className="space-y-1">
                            {/* Main room comments */}
                            {activeSubRoom?.id === testRoom?.id &&
                                testRoom?.comments?.map(c => (
                                    <CommentThread
                                        key={c.id}
                                        comment={c}
                                        onLike={handleLike}
                                        onDislike={handleDislike}
                                        onReply={setReplyTo}
                                        depth={0}
                                    />
                                ))}

                            {/* Subroom comments */}
                            {activeSubRoom?.id !== testRoom?.id && testRoom?.subRooms?.find(s => s.id === activeSubRoom?.id)?.comments?.map(c => (
                                <CommentThread
                                    comment={c}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    onReply={setReplyTo}
                                    depth={0}
                                />
                            ))}
                        </div>
                    </div>

                    {replyTo && (
                        <div className="px-4 py-1.5 flex items-center justify-between" style={{ backgroundColor: `${colors.dustyBlue}10`, borderTop: `1px solid ${colors.periwinkle}` }}>
                            <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.secondary }}>
                                <CornerDownRight size={13} />
                                Replying to <strong className="" style={{ color: colors.text.primary }}>{replyTo?.user?.username}</strong>
                            </div>
                            <button onClick={() => setReplyTo(null)} className="hover:opacity-70" style={{ color: colors.text.muted }}>
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <ChatInput value={newComment} onChange={setNewComment} onSend={handlePost} channelName={activeSubRoom?.name} />
                </div>

                <BookInfoSidebar room={testRoom || null} isOpen={showBookInfo} onClose={() => setShowBookInfo(false)} />
            </div>
        </div>
    );
};

// Sidebar component - uses your blues
const SubRoomSidebar: React.FC<{
    room: BigRoom | null,
    categories: any,
    activeSubRoom: any
    onSelect: any,
    collapsed: any,
    onToggle: any
}> = ({ room, activeSubRoom, onSelect, collapsed, onToggle }) => {
    const { room_id } = useParams();
    const { user } = useAuth();
    const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});
    const toggleCat = (id: string) => setCollapsedCats(v => ({ ...v, [id]: !v[id] }));

    return (
        <aside className={`flex flex-col border-r transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-60'} bg-white/40`} style={{ borderColor: colors.periwinkle }}>
            {/* ----------- BOOK NAME - HEADER ---------- */}
            <div className="p-3 border-b flex items-center justify-between cursor-pointer" style={{ borderColor: colors.periwinkle }}>
                {!collapsed ? (
                    <span className="font-bold text-sm truncate" style={{ color: colors.text.primary }}>{room?.name}</span>
                ) : (
                    <span className="font-bold text-sm mx-auto" style={{ color: colors.text.primary }}>{room?.name[0]}</span>
                )}
                <button onClick={onToggle} className="hover:opacity-70" style={{ color: colors.text.muted }}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* ----- SEARCH BAR -------*/}
            {!collapsed && (
                <div className="p-2">
                    <div className="flex items-center gap-1.5 rounded-md px-2 py-1" style={{ backgroundColor: colors.powderBlue }}>
                        <Search size={13} style={{ color: colors.text.muted }} />
                        <span className="text-xs" style={{ color: colors.text.muted }}>Search channels</span>
                    </div>
                </div>
            )}

            {/* ----- CHANNELS -------*/}
            <nav className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* ----- TEXT CHANNELS -------*/}
                {!collapsed && (
                    <button onClick={() => toggleCat('cat-1')} className="w-full flex items-center gap-1 px-1 py-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: colors.text.muted }}>
                        <ChevronDown size={12} className={`transition-transform ${collapsedCats['cat-1'] ? '-rotate-90' : ''}`} />
                        text channels
                    </button>
                )}
                {/* general */}
                {
                    !collapsedCats['cat-1']
                    && room
                    && (
                        <button
                            key={room.id}
                            onClick={() => onSelect(room)}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all pl-5`}
                            style={{
                                backgroundColor: activeSubRoom?.id === room?.id ? `${colors.dustyBlue}20` : 'transparent',
                                color: activeSubRoom.id === room?.id ? colors.text.primary : colors.text.secondary,
                            }}
                        >
                            <Hash size={12} className="flex-shrink-0" style={{ color: colors.text.muted }} />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate text-sm">general</span>
                                    {room?.id == room_id && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dustyBlue }} />}
                                </>
                            )}
                        </button>
                    )
                }
                {/* the rest of the sub rooms */}
                {
                    !collapsedCats['cat-1']
                    && room?.subRooms.filter(s => s.type == 2)
                        .map((s) => (
                            <button
                                key={s.id}
                                onClick={() => onSelect(s)}
                                className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all pl-5`}
                                style={{
                                    backgroundColor: activeSubRoom?.id === s.id ? `${colors.dustyBlue}20` : 'transparent',
                                    color: activeSubRoom.id === s.id ? colors.text.primary : colors.text.secondary,
                                }}
                            >
                                <Hash size={12} className="flex-shrink-0" style={{ color: colors.text.muted }} />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 truncate text-sm">{s.name}</span>
                                        {s.id == room_id && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dustyBlue }} />}
                                    </>
                                )}
                            </button>
                        ))
                }

                {/* ----- ANALYSIS CHANNELS -------*/}
                {!collapsed && (
                    <button onClick={() => toggleCat('cat-2')} className="w-full flex items-center gap-1 px-1 py-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: colors.text.muted }}>
                        <ChevronDown size={12} className={`transition-transform ${collapsedCats['cat-2'] ? '-rotate-90' : ''}`} />
                        analysis channels
                    </button>
                )}
                {
                    !collapsedCats['cat-2']
                    && room?.subRooms.filter(s => s.type == 3)
                        .map((s) => (
                            <button
                                key={s.id}
                                onClick={() => onSelect(s)}
                                className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all pl-5`}
                                style={{
                                    backgroundColor: activeSubRoom?.id === s.id ? `${colors.dustyBlue}20` : 'transparent',
                                    color: activeSubRoom?.id === s.id ? colors.text.primary : colors.text.secondary,
                                }}
                            >
                                <Hash size={12} className="flex-shrink-0" style={{ color: colors.text.muted }} />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 truncate text-sm">{s.name}</span>
                                        {s.id == room_id && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dustyBlue }} />}
                                    </>
                                )}
                            </button>
                        ))
                }
            </nav>

            {!collapsed && (
                <div className="p-2 border-t flex items-center gap-2" style={{ backgroundColor: `${colors.mistyLavender}40`, borderColor: colors.periwinkle }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarColor('user'), color: colors.powderBlue }}>
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                className='rounded-full w-9 h-9'
                            />
                        ) : (
                            getInitials(user?.username || 'P')
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: colors.text.primary }}>{user?.username}</div>
                        <div className="text-xs" style={{ color: colors.text.muted }}>Online</div>
                    </div>
                    {/* <Settings size={15} className="cursor-pointer flex-shrink-0 hover:opacity-70" style={{ color: colors.text.muted }} /> */}
                    {/* DISCUSSION ROOM SETTINGS ..?*/}
                </div>
            )}
        </aside>
    );
};

// Header component
const ChatHeader: React.FC<{ room: BigRoom | null, activeSubRoom: any, onQuietMode: any, onToggleBookInfo: any }> = ({ room, activeSubRoom, onQuietMode, onToggleBookInfo }) => (
    <div className="h-13 flex items-center justify-between px-4 border-b flex-shrink-0 bg-white/40" style={{ borderColor: colors.periwinkle }}>
        <div className="flex items-center gap-2">
            <Hash size={18} style={{ color: colors.dustyBlue }} />
            <span className="font-bold text-base" style={{ color: colors.text.primary }}>{activeSubRoom?.type == 1 ? 'general' : activeSubRoom?.name}</span>
            <div className="w-px h-5 mx-1" style={{ backgroundColor: colors.periwinkle }} />
            <span className="text-sm" style={{ color: colors.text.secondary }}>{room?.name}</span>
            {activeSubRoom?.isActive && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.dustyBlue}10` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dustyBlue }} />
                    <span className="text-xs" style={{ color: colors.dustyBlue }}>{activeSubRoom?.memberCount} online</span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md transition-opacity hover:opacity-70" style={{ color: colors.text.muted }}>
                <Bell size={18} />
            </button>
            <button className="p-1.5 rounded-md transition-opacity hover:opacity-70" style={{ color: colors.text.muted }}>
                <Search size={18} />
            </button>
            <button onClick={onToggleBookInfo} className="p-1.5 rounded-md transition-opacity hover:opacity-70" style={{ color: colors.text.muted }}>
                <BookOpen size={18} />
            </button>
            <button
                onClick={onQuietMode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: `${colors.dustyBlue}15`, color: colors.dustyBlue, border: `1px solid ${colors.dustyBlue}30` }}
            >
                <Headphones size={14} />
                Quiet Room
            </button>
        </div>
    </div>
);

// Comment thread component
const CommentThread: React.FC<any> = ({ comment, onLike, onDislike, onReply, depth }) => {
    const [showReplies, setShowReplies] = useState(true);
    const [hovered, setHovered] = useState(false);

    // Handle both possible data structures
    const username = comment.user?.name || comment.username || 'Unknown';
    const avatarInitial = username[0]?.toUpperCase() || '?';
    const isSystemUser = comment.user?.user_id === 'system' || comment.user?.name === 'Pages ń Parchment';

    return (
        <div className={`${depth > 0 ? 'ml-4' : ''}`}>
            <div
                className={`relative p-1 rounded-md transition-all ${hovered ? 'bg-opacity-5' : ''}`}
                style={{ backgroundColor: hovered ? `${colors.dustyBlue}10` : 'transparent' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {comment.user?.user_id != 'system' && (<div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: isSystemUser ? colors.dustyBlue : avatarColor(username), color: colors.powderBlue }}>
                        {isSystemUser ? '📖' : avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-bold text-sm" style={{ color: colors.text.primary }}>{username}</span>
                            <span className="text-xs" style={{ color: colors.text.muted }}>{timeAgo(comment.createdAt || new Date().toISOString())}</span>
                        </div>
                        <div className="mt-0.5 text-sm leading-relaxed" style={{ color: colors.text.primary }} dangerouslySetInnerHTML={{ __html: comment.content }} />
                        {!isSystemUser && (
                            <div className={`flex items-center gap-3 mt-1.5 transition-opacity ${hovered ? 'opacity-100' : 'opacity-50'}`}>
                                <button onClick={() => onLike(comment.id)} className="flex items-center gap-1 text-xs hover:opacity-70" style={{ color: colors.text.muted }}>
                                    <ThumbsUp size={13} /> {comment.likes || 0}
                                </button>
                                <button onClick={() => onDislike(comment.id)} className="flex items-center gap-1 text-xs hover:opacity-70" style={{ color: colors.text.muted }}>
                                    <ThumbsDown size={13} /> {comment.dislikes || 0}
                                </button>
                                <button
                                    onClick={() => onReply(comment)}
                                    className="flex items-center gap-1 text-xs hover:opacity-70" style={{ color: colors.text.muted }}>
                                    <Reply size={13} /> Reply
                                </button>
                            </div>
                        )}
                    </div>
                </div>)}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12">
                    <button onClick={() => setShowReplies(v => !v)} className="flex items-center gap-1.5 text-xs mb-1 hover:opacity-70" style={{ color: colors.dustyBlue }}>
                        <ChevronRight size={12} className={`transition-transform ${showReplies ? 'rotate-90' : ''}`} />
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    {showReplies && (
                        <div className="pl-3" style={{ borderLeft: `2px solid ${colors.periwinkle}` }}>
                            {comment.replies.map((r: any) => (
                                <CommentThread key={r.id} comment={r} onLike={onLike} onDislike={onDislike} onReply={onReply} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Input component
const ChatInput: React.FC<any> = ({ value, onChange, onSend, channelName }) => {
    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
    };

    return (
        <div className="p-4 flex-shrink-0">
            <div className="flex items-center gap-2 rounded-xl px-3" style={{ backgroundColor: colors.powderBlue, border: `1px solid ${colors.periwinkle}` }}>
                <button className="p-2 hover:opacity-70" style={{ color: colors.text.muted }}>
                    <Sparkles size={10} />
                </button>
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Message #${channelName}`}
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-sm"
                    style={{ color: colors.text.primary }}
                />
                <button
                    onClick={onSend}
                    disabled={!value.trim()}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                    style={{ backgroundColor: colors.dustyBlue, color: colors.powderBlue }}
                >
                    <Send size={14} />
                </button>
            </div>
            <p className="text-xs mt-1.5 pl-1" style={{ color: colors.text.muted }}>
                Press <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${colors.dustyBlue}20` }}>Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${colors.dustyBlue}20` }}>Shift+Enter</kbd> for new line
            </p>
        </div>
    );
};

// Book sidebar
const BookInfoSidebar: React.FC<{ room: BigRoom | null, isOpen: boolean, onClose: any }> = ({ room, isOpen, onClose }) => (
    <aside className={`flex flex-col border-l transition-all duration-200 ${isOpen ? 'w-72' : 'w-0'}`} style={{ backgroundColor: colors.skyMist, borderColor: colors.periwinkle, overflow: 'hidden' }}>
        {isOpen && (
            <>
                <div className="relative h-44 flex-shrink-0">
                    <img src={room?.book.coverArt} alt={room?.book.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E4E] via-transparent to-transparent" />
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/40 rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/60">
                        <X size={14} className="text-white" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                        <div className="font-bold text-white">{room?.book.name}</div>
                        <div className="text-xs text-white/65">{room?.book.author.name}</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1 text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.dustyBlue}10` }}>
                            <div className="text-lg font-bold" style={{ color: colors.text.primary }}>{room?.members ?? 0}</div>
                            <div className="text-xs" style={{ color: colors.text.muted }}>Members</div>
                        </div>
                        <div className="flex-1 text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.dustyBlue}10` }}>
                            <div className="text-lg font-bold" style={{ color: colors.text.primary }}>{room?.comments.length}</div>
                            <div className="text-xs" style={{ color: colors.text.muted }}>Posts</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: colors.text.muted }}>About</div>
                        <p className="text-sm leading-relaxed" style={{ color: colors.text.secondary }}>{room?.book.synopsis}</p>
                    </div>

                    {/* feature is still under debate */}
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: colors.text.muted }}>Your Progress</div>
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: colors.text.secondary }}>
                            <span>Chapters 1–3</span><span>33%</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.dustyBlue}20` }}>
                            <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: colors.dustyBlue }} />
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: colors.text.muted }}>Quick Links</div>
                        {['Get the book', 'Author biography', 'Reading guide'].map(link => (
                            <button key={link} className="block w-full text-left text-sm py-1 transition-opacity hover:opacity-70" style={{ color: colors.dustyBlue }}>
                                {link} →
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-3 border-t" style={{ borderColor: colors.periwinkle }}>
                    <button className="w-full py-2 rounded-lg font-bold text-sm transition-opacity hover:opacity-80" style={{ backgroundColor: colors.dustyBlue, color: colors.powderBlue }}>
                        {'Join discussion'}
                    </button>
                </div>
            </>
        )}
    </aside>
);

// Quiet Room component
const PLAYLIST = [
    { title: 'Clair de Lune', artist: 'Debussy' },
    { title: 'Gymnopédie No.1', artist: 'Satie' },
    { title: 'Nocturne in E♭ Major', artist: 'Chopin' },
];

const QuietRoom: React.FC<any> = ({ room, onExit }) => {
    const [liveComments, setLiveComments] = useState(MOCK_QUIET_COMMENTS);
    const [liveComment, setLiveComment] = useState('');
    const [trackIdx, setTrackIdx] = useState(0);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [liveComments]);

    const postWhisper = () => {
        if (!liveComment.trim()) return;
        setLiveComments(prev => [...prev, { user: 'You', message: liveComment, time: new Date() }]);
        setLiveComment('');
    };

    const track = PLAYLIST[trackIdx];

    return (
        <div className="fixed inset-0 z-[999]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Room2})` }} />
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
                <h1 className="font-serif text-5xl md:text-7xl font-light text-white mb-4">{room.bookName}</h1>
                <p className="italic text-lg text-white/55 max-w-md">"So we beat on, boats against the current…"</p>
                <p className="text-xs text-white/30 mt-2">— F. Scott Fitzgerald</p>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                <div className="w-64 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
                        <Music size={13} className="text-blue-300" />
                        <span className="text-[11px] font-bold tracking-wide text-blue-300 uppercase">Now playing</span>
                    </div>
                    <div className="p-3">
                        <div className="font-semibold text-white text-sm">{track.title}</div>
                        <div className="text-xs text-white/50 mb-3">{track.artist}</div>
                        <div className="h-0.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                            <div className="h-full w-2/5 bg-blue-400 rounded-full" />
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setTrackIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)} className="text-white/60 hover:text-white transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-black hover:bg-blue-300 transition-colors">
                                <Volume2 size={14} />
                            </button>
                            <button onClick={() => setTrackIdx((i) => (i + 1) % PLAYLIST.length)} className="text-white/60 hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
                        <Activity size={13} className="text-blue-300" />
                        <span className="text-[11px] font-bold tracking-wide text-blue-300 uppercase">Whispers</span>
                        <span className="text-xs text-white/50 ml-auto">{liveComments.length} messages</span>
                    </div>
                    <div className="h-40 overflow-y-auto p-3 space-y-1.5">
                        {liveComments.map((c: any, i: number) => (
                            <div key={i} className="text-sm flex gap-2">
                                <span className="text-blue-300 font-semibold flex-shrink-0">{c.user}</span>
                                <span className="text-white/70">{c.message}</span>
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
    );
};

export default DiscussionRoomPage;