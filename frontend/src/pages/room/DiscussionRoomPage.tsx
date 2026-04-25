
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { toast } from 'sonner';
import {
    MessageSquare, Heart, ThumbsUp, ThumbsDown, Flag, Share2,
    Send, Users, Hash, DoorOpen, ChevronLeft, ChevronRight,
    X, Maximize2, Minimize2, Volume2, Smile, Sparkles,
    BookOpen, Clock, Pin, Reply, MoreHorizontal, Image, Link2,
    CornerDownRight, Activity, Flame, Star, Music, Headphones,
    Search, Bell, Gift, ChevronDown, Mic, MicOff
} from 'lucide-react';

/*
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
*/

import { request } from '@utils/ApiRequest';
import type { Book, Room, Comment } from '@models/Book';
import type { Quote } from '@models/Word';
import EmojiPicker from 'emoji-picker-react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { NoticeType } from '@models/Notice';

import { PLAYLIST } from '@models/Song';
import AudioPlayer from './AudioPlayer';
interface BigRoom {
    id: string;
    name: string;
    book: Book;
    members: number;
    comments: Comment[];
    quietRoom: Comment[];
    subRooms: Room[];
}

const gf = new GiphyFetch('3badXghEvmM6yeAbWPgNYcyOBy6E82K1');
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
    const { user, setPings } = useAuth();
    const [room] = useState(MOCK_ROOM);
    const [isMember, setIsMember] = useState(false);
    const [testRoom, setRoom] = useState<BigRoom | null>(null);
    const [activeSubRoom, setActiveSubRoom] = useState<Room | null>(null);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(testRoom?.comments[1] || null);
    const [isQuietMode, setIsQuietMode] = useState(false);
    const [showBookInfo, setShowBookInfo] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    //const commentsEndRef = useRef<HTMLDivElement>(null);
    const { book_id, room_id } = useParams();

    useEffect(() => {

        const getIsMember = async () => {
            if (!user?.id || !room_id) return;
            try {
                const res = await request.get<any>(`/rooms/member/${user?.id}/room/${activeSubRoom?.id}`);
                setIsMember(res.member || false);
                //console.log('member?: ',res.member)
            } catch (error) {
                console.error('Failed to check membership:', error);
            }
        };

        const fetchRoom = async () => {
            try {
                const res = await request.get<any>(`/rooms/book/${book_id}/${user?.id}`);
                //console.log('room', res);

                const fetchedRoom = res.room;
                setRoom(fetchedRoom);

                if (fetchedRoom?.id === room_id) {
                    console.log('selected room: ', fetchedRoom);
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

        getIsMember();
        fetchRoom();

    }, [book_id, testRoom?.id, isMember]);

    const handlePost = async (content?: string, quiet_room?: boolean) => {

        //console.log('posting to the quite room: ',quiet_room)
        const message = content || newComment;
        if (!message.trim()) return;

        const commentData = {
            roomId: quiet_room ? testRoom?.id : activeSubRoom?.id,
            userId: user?.id,
            parentId: replyTo?.id || null,
            content: message,
            quietRoom: quiet_room ?? false
        };

        try {
            await request.post<any>(`/rooms/post-comment`, commentData)

            // Refresh the room data to get the new comment with proper structure
            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}/${user?.id}`);
            setRoom(refreshedRoom.room);

            setNewComment('');

            //if this is a reply, then send a message to the original commenter
            if (replyTo) {
                const ping = {
                    type: NoticeType.ROOM_ACTIVITY,
                    title: 'Someone replied to your comment',
                    preview: `${user?.username} replied to your comment in ${activeSubRoom?.name}`,
                    message:
                        `<div style="display: flex; flex-direction: column; background: #f5f5f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                            <div style="padding: 16px 16px 40px 16px;">
                                <div style="background: white; border: 1px solid #d4d4d4; border-radius: 10px; overflow: hidden; width: 80%; margin: 5rem auto;">

                                    <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 20px; border-bottom: 1px solid #ececec;">
                                        <div style="width: 34px; height: 34px; border-radius: 50%; background: #b0b0b0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; margin-top: 2px;">pP</div>
                                        <div style="flex: 1; min-width: 0;">
                                            <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0;">Pages &amp; Parchment <span style="color: #888; font-weight: normal;">&lt;noreply@pagesparchment.com&gt;</span></p>
                                            <p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">Pages &amp; Parchment 2026: Someone replied to your comment</p>
                                            <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">Reply-To: Pages &amp; Parchment — help@pagesparchment.com</p>
                                        </div>
                                        <div style="text-align: right; flex-shrink: 0;">
                                            <p style="font-size: 11px; color: #888; white-space: nowrap; margin: 0;">Inbox · Discussion &nbsp; Tue, 14 Apr 2026</p>
                                            <span style="display: inline-block; margin-top: 4px; font-size: 10px; background: #ebebeb; color: #555; border-radius: 4px; padding: 2px 6px;">pages_parchment_2026</span>
                                            <p style="color: #947EB0; font-size: 13px; margin-top: 6px; margin-bottom: 0;">⚑</p>
                                        </div>
                                    </div>

                                    <div style="padding: 32px 56px;">
                                        <!-- Purple whimsical divider -->
                                        <div style="text-align: center; margin-bottom: 20px;">
                                            <span style="display: inline-block; width: 40px; height: 1px; background: #d4d4d4;"></span>
                                            <span style="display: inline-block; margin: 0 8px; font-size: 12px; color: #947EB0;">✦</span>
                                            <span style="display: inline-block; width: 40px; height: 1px; background: #d4d4d4;"></span>
                                        </div>

                                        <p style="text-align: center; font-size: 12px; font-weight: 600; color: #999; letter-spacing: 0.2px; margin: 0 0 4px 0;">pages_parchment_2026</p>
                                        <p style="text-align: center; font-size: 22px; color: #bbb; font-weight: 300; margin: 0 0 16px 0;">Pages &amp; Parchment 2026</p>
                                        <h1 style="text-align: center; font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 0 0 20px 0;">Someone replied to your comment</h1>
                                        
                                        <!-- Avatar -->
                                        <div style="text-align: center; margin-bottom: 16px;">
                                            <div style="display: inline-block; position: relative;">
                                                <div style="width: 64px; height: 64px; border-radius: 50%; background: #E8E0F0; border: 3px solid white; box-shadow: 0 2px 8px rgba(148, 126, 176, 0.3); text-align: center; line-height: 58px; font-size: 22px; font-weight: 400; color: black; overflow: hidden;">
                                                    ${replyTo?.user?.profile
                            ? `<img src="${replyTo.user.profile}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
                            : replyTo?.user?.name?.[0]?.toUpperCase() || '?'
                        }
                                                </div>
                                            </div>
                                            <div style="display: inline-block; position: relative; margin-left: -20px;">
                                                <div style="width: 64px; height: 64px; border-radius: 50%; background: #D8CFE8; border: 3px solid white; box-shadow: 0 2px 8px rgba(148, 126, 176, 0.3); text-align: center; line-height: 58px; font-size: 22px; font-weight: 600; color: black; overflow: hidden;">
                                                    ${user?.profilePhoto
                            ? `<img src="${user.profilePhoto}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
                            : user?.username?.[0]?.toUpperCase() || '?'
                        }
                                                </div>
                                            </div>
                                        </div>

                                        <p style="font-size:17px;font-weight:600;color:#1d1d1f; text-align: center; text-transform: uppercase;">${user?.username}</p>
                                        <p style="font-size:13px;color:#6e6e73;margin:0 0 20px; text-align: center;">replied to your comment in <strong style="font-weight:600; color:#947EB0;">${activeSubRoom?.name}</strong> discussion room</p>

                                    <div style="max-width: 500px; margin: 0 auto;">
                                            <!-- Your comment box -->
                                            <div style="border-radius: 10px; padding: 14px 16px; margin: 0 0 12px 0;">
                                                <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px;">
                                                    <span style="font-size: 11px; font-weight: 500; color: black; text-transform: uppercase; letter-spacing: 0.3px;">You</span>
                                                    <span style="width: 3px; height: 3px; background: var(--orchid); border-radius: 50%;"></span>
                                                    <span style="font-size: 11px; color: gray;">said</span>
                                                </div>
                                                <p style="margin-left: 30px; font-size: 14px; color: black; line-height: 1.45; margin: 0 0 0 0; font-size:12px;">"${replyTo?.content}"</p>
                                            </div>

                                            <!-- Reply box -->
                                            <div style="border-radius: 10px; padding: 14px 16px; margin: 0 0 28px 0;">
                                                <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px;">
                                                    <span style="font-size: 11px; font-weight: 500; color: black; text-transform: uppercase; letter-spacing: 0.3px;">${user?.username}</span>
                                                    <span style="width: 3px; height: 3px; background: var(--dusty-lavender); border-radius: 50%;"></span>
                                                    <span style="font-size: 11px; color: gray;">replied</span>
                                                </div>
                                                <p style="font-size: 14px; color: black; line-height: 1.45; margin: 0; font-size: 12px;">"${message}"</p>
                                            </div>
                                        </div>

                                        <!-- Purple button -->
                                        <div style="text-align: center; margin-bottom: 16px;">
                                            <a href="/book/${book_id}/room/${activeSubRoom?.id}" style="display: inline-block; background: #1d1d1f; color: white; text-decoration: none; padding: 13px 80px; font-size: 15px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">View reply</a>
                                        </div>

                                        <!-- Whimsical closing -->
                                        <div style="text-align: center; margin-top: 8px;">
                                            <span style="font-size: 11px; color: #947EB0;">✦</span>
                                            <span style="margin: 0 4px; font-size: 10px; color: var(--wisteria);">✧</span>
                                            <span style="font-size: 11px; color: #947EB0;">✦</span>
                                        </div>
                                        <p style="text-align: center; font-size: 13px; color: #999; font-style: italic; margin: 8px 0 0;">The fellowship grows with every reader</p>
                                    </div>

                                    <div style="background: #f0f0f0; border-top: 1px solid #e0e0e0; padding: 20px 56px;">
                                        <p style="font-size: 12px; color: #999; margin: 0 0 2px 0;">Email brought to you by</p>
                                        <p style="font-size: 15px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">Pages &amp; Parchment</p>
                                        <p style="font-size: 13px; font-weight: 500; color: #1d1d1f; margin: 0 0 2px 0;">Need help with your account? *</p>
                                        <p style="font-size: 13px; color: #666; margin: 0 0 12px 0;">Contact support at help@pagesparchment.com</p>
                                        <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">*This message supports account security and member records. It doesn't offer the option to be removed from the recipients list.</p>
                                    </div>
                                </div>
                            </div>
                        </div>`,
                    recipient: replyTo?.user.user_id,
                    timestamp: new Date(),
                    read: false,
                    from: {
                        id: user?.id,
                        username: user?.username
                    }
                }
                await request.post(`/auth/notice`, ping);
                const pings = await request.get<any>(`/auth/notice/user/${user?.id}`)
                setPings(pings.pings);
            }

            setReplyTo(null);
        } catch (error) {
            console.error('Failed to post comment:', error);
            toast.error('Failed to post comment');
        }
    };

    const handleLike = async (comment: Comment) => {
        try {
            const dto = {
                commentId: comment.id,
                userId: user?.id,
                type: 1  // 1 = like
            }

            if (comment?.isLikedByUser) {
                await request.delete<any>(`/rooms/delete-interact/comment/${dto.commentId}/user/${dto.userId}/type/${dto.type}`)
            } else {
                await request.post(`/rooms/interact`, dto);
            }

            // Refresh to get updated likes
            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}/${user?.id}`);
            setRoom(refreshedRoom.room);
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const handleDislike = async (comment: Comment) => {
        console.log('Dislike comment action:', comment);
        try {
            const dto = {
                commentId: comment.id,
                userId: user?.id,
                type: 2  // 2 = dislike
            };

            if (comment?.isDislikedByUser) {
                await request.delete<any>(`/rooms/delete-interact/comment/${dto.commentId}/user/${dto.userId}/type/${dto.type}`) // remove the dislike
            } else {
                //console.log('dislike comment');
                await request.post<any>(`/rooms/interact`, dto); //dislike the commet
            }

            const refreshedRoom = await request.get<any>(`/rooms/book/${book_id}/${user?.id}`);
            setRoom(refreshedRoom.room);
        } catch (error) {
            console.error('Failed to dislike comment:', error);
        }
    };

    const handleMembers = () => {
        let mem: number = 0;
        testRoom?.subRooms.map((s) => {
            mem = mem + Number(s.members);
        })
        return mem + Number(testRoom?.members || 0);
    }

    {/* if (isQuietMode) return <QuietRoom room={testRoom || null} onExit={() => setIsQuietMode(false)} onSend={handlePost} book_id={book_id ?? ''} />; */}

    return (
        <>
            <div className="min-h-screen pt-16">
                <div className="flex h-screen overflow-hidden">
                    <SubRoomSidebar
                        room={testRoom || null}
                        activeSubRoom={activeSubRoom}
                        onSelect={setActiveSubRoom}
                        collapsed={sidebarCollapsed}
                        onToggle={() => setSidebarCollapsed(v => !v)}
                    />

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* header with notifications */}
                        <ChatHeader
                            room={testRoom || null}
                            isMember={isMember}
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
                                {activeSubRoom?.id !== testRoom?.id &&
                                    testRoom?.subRooms?.find(s => s.id === activeSubRoom?.id)?.comments?.map((c, idx) => (
                                        <CommentThread
                                            key={c?.id}
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
                                    Replying to <strong className="" style={{ color: colors.text.primary }}>{replyTo?.user?.name}</strong>
                                </div>
                                <button onClick={() => setReplyTo(null)} className="hover:opacity-70" style={{ color: colors.text.muted }}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        {isMember &&
                            <ChatInput
                                value={newComment}
                                onChange={setNewComment}
                                onSend={handlePost}
                                channelName={activeSubRoom?.name} />}
                    </div>

                    <BookInfoSidebar
                        user_id={user?.id || ''}
                        room_id={room_id || ''}
                        isMember={isMember}
                        room={testRoom || null}
                        isOpen={showBookInfo}
                        members={handleMembers()}
                        onClose={() => setShowBookInfo(false)} />
                </div>
            </div>
        </>

    );
};

// Sidebar component - uses your blues
const SubRoomSidebar: React.FC<{
    room: BigRoom | null,
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
const ChatHeader: React.FC<{ room: BigRoom | null, activeSubRoom: any, onQuietMode: any, onToggleBookInfo: any, isMember: boolean }> = ({ room, activeSubRoom, onQuietMode, onToggleBookInfo, isMember }) => {
    const navigate = useNavigate();

    return (
        <div className="h-13 flex items-center justify-between px-4 border-b flex-shrink-0 bg-white/40" style={{ borderColor: colors.periwinkle }}>
            <div className="flex items-center gap-2">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 rounded-md transition-opacity hover:opacity-70 mr-1"
                    style={{ color: colors.text.muted }}
                    title="Go back"
                >
                    <ChevronLeft size={18} />
                </button>
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

                {isMember && <button
                    onClick={onQuietMode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor: `${colors.dustyBlue}15`, color: colors.dustyBlue, border: `1px solid ${colors.dustyBlue}30` }}
                >
                    <Headphones size={14} />
                    Quiet Room
                </button>}
            </div>
        </div>
    );
};

// Comment thread component
const CommentThread: React.FC<{ comment: Comment, onLike: any, onDislike: any, onReply: any, depth: any }> = ({ comment, onLike, onDislike, onReply, depth }) => {
    const [showReplies, setShowReplies] = useState(true);
    const [hovered, setHovered] = useState(false);

    // Handle both possible data structures
    const username = comment.user ? (comment.user.name ? comment.user.name : 'Pp') : 'Pages ń Parchment';
    const avatarInitial = username[0]?.toUpperCase() || '?';
    const isSystemUser = comment.user?.user_id === 'system' || comment.user?.name === 'Pages ń Parchment';


    // If comment is deleted, show generic message instead of normal content
    if (comment.deleted) {
        return (
            <div className="py-2 px-3 rounded-md my-2" style={{ backgroundColor: `${colors.dustyBlue}05`, borderLeft: `3px solid ${colors.dustyBlue}` }}>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: colors.dustyBlue, color: colors.powderBlue }}>
                        📖
                    </div>
                    <span className="text-xs italic" style={{ color: colors.text.muted }}>
                        This comment has been removed due to community guidelines violations.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${depth > 0 ? 'ml-4' : ''}`}>
            <div
                className={`relative p-1 rounded-md transition-all ${hovered ? 'bg-opacity-5' : ''}`}
                style={{ backgroundColor: hovered ? `${colors.dustyBlue}10` : 'transparent' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {
                    comment.deleted ? (
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: isSystemUser ? colors.dustyBlue : avatarColor(username), color: colors.powderBlue }}>
                                Pp
                            </div>
                            <div>This comment has been removed due to community guidelines violations.</div>
                        </div>
                    ) : (
                        <>
                            {comment.user?.user_id != 'system' && (
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: isSystemUser ? colors.dustyBlue : avatarColor(username), color: colors.powderBlue }}>
                                        {isSystemUser ? '📖' : avatarInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <span className="font-bold text-sm" style={{ color: colors.text.primary }}>{username}</span>
                                            <span className="text-xs" style={{ color: colors.text.muted }}>{timeAgo(new Date(comment.createdAt).toISOString() || new Date().toISOString())}</span>
                                        </div>
                                        <div className="mt-0.5 text-sm leading-relaxed" style={{ color: colors.text.primary }} dangerouslySetInnerHTML={{ __html: comment.content }} />

                                        {!isSystemUser && (
                                            <div className={`text-[${colors.text.secondary}] flex items-center gap-3 mt-1.5 transition-opacity ${hovered ? 'opacity-100' : 'opacity-50'}`}>
                                                <button
                                                    onClick={() => onLike(comment)}
                                                    className="flex items-center gap-1 text-xs hover:opacity-70">
                                                    <ThumbsUp size={14} color={colors.text.secondary} fill={comment.isLikedByUser ? colors.dustyBlue : 'transparent'} /> {comment.likes || 0}
                                                </button>
                                                <button
                                                    onClick={() => onDislike(comment)}
                                                    className="flex items-center gap-1 text-xs hover:opacity-70">
                                                    <ThumbsDown size={13} color={colors.text.secondary} fill={comment.isDislikedByUser ? colors.dustyBlue : 'transparent'} /> {comment.dislikes || 0}
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
                        </>
                    )
                }

            </div>

            {!comment.deleted && comment.replies && comment.replies.length > 0 && (
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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifSearch, setGifSearch] = useState('');
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const gifPickerRef = useRef<HTMLDivElement>(null);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
    };

    const onEmojiClick = (emojiObject: any) => {
        onChange(value + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const onGifClick = (gif: any) => {
        // Insert GIF as markdown image or HTML
        const gifMarkdown = `![gif](${gif.images.original.url})`;
        onChange(value + gifMarkdown);
        setShowGifPicker(false);
        setGifSearch('');
    };

    // Close pickers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (gifPickerRef.current && !gifPickerRef.current.contains(event.target as Node)) {
                setShowGifPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch GIFs based on search
    const fetchGifs = (offset: number) => {
        if (gifSearch.trim()) {
            return gf.search(gifSearch, { offset, limit: 12 });
        }
        return gf.trending({ offset, limit: 12 });
    };

    return (
        <div className="p-4 flex-shrink-0">
            <div className="flex items-center gap-2 rounded-xl px-3" style={{ backgroundColor: colors.powderBlue, border: `1px solid ${colors.periwinkle}` }}>
                {/* Emoji Picker Button */}
                <div className="relative" ref={emojiPickerRef}>
                    <button
                        onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                            setShowGifPicker(false);
                        }}
                        className="p-2 hover:opacity-70 transition-all hover:scale-110"
                        style={{ color: colors.text.muted }}
                        type="button"
                        title="Add emoji"
                    >
                        <Smile size={16} />
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 z-50">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={300}
                                height={400}
                            />
                        </div>
                    )}
                </div>

                {/* GIF Picker Button */}
                <div className="relative" ref={gifPickerRef}>
                    <button
                        onClick={() => {
                            setShowGifPicker(!showGifPicker);
                            setShowEmojiPicker(false);
                        }}
                        className="p-2 hover:opacity-70 transition-all hover:scale-110"
                        style={{ color: colors.text.muted }}
                        type="button"
                        title="Add GIF"
                    >
                        <Gift size={16} />
                    </button>
                    {showGifPicker && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-xl shadow-xl border border-[#e9e9ef] w-80 overflow-hidden" style={{ maxHeight: '400px' }}>
                            {/* Search Header */}
                            <div className="p-2 border-b border-[#e9e9ef] flex items-center gap-2">
                                <Search size={14} className="text-[#86868b]" />
                                <input
                                    type="text"
                                    placeholder="Search GIFs..."
                                    value={gifSearch}
                                    onChange={(e) => setGifSearch(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm"
                                    autoFocus
                                />
                                {gifSearch && (
                                    <button onClick={() => setGifSearch('')} className="p-1 hover:opacity-70">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            {/* GIF Grid */}
                            <div className="overflow-y-auto" style={{ maxHeight: '350px' }}>
                                <Grid
                                    key={gifSearch}
                                    width={320}
                                    columns={2}
                                    fetchGifs={fetchGifs}
                                    onGifClick={onGifClick}
                                    hideAttribution={true}
                                    noLink={true}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Message #${channelName}`}
                    rows={1}
                    cols={20}
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
                <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${colors.dustyBlue}20` }}>Enter</kbd> to send ·
                <kbd className="px-1.5 py-0.5 rounded text-[10px] ml-1" style={{ backgroundColor: `${colors.dustyBlue}20` }}>Shift+Enter</kbd> for new line
            </p>
        </div>
    );
};

// Book sidebar
const BookInfoSidebar: React.FC<{
    user_id: string;
    room_id: string;
    room: BigRoom | null,
    isOpen: boolean, onClose: any,
    isMember: boolean
    members: number;
}> = ({ room, isOpen, onClose, isMember, user_id, room_id, members }) => {
    const onJoinRoom = async (user_id: string, room_id: string) => {
        await request.post(`/rooms/add-member/${user_id}/${room_id}`)
            .then(
                (res: any) => {
                    console.log(res.message)
                    //showNewMessageToast();
                    toast("New Message", {
                        description: res.message
                    })
                }
            )
            .catch(
                (err: any) => {
                    console.log(err.message)
                }
            )

    }
    return (
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
                                <div className="text-lg font-bold" style={{ color: colors.text.primary }}>{members ?? 0}</div>
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

                    {!isMember ? (
                        <div className="p-3 border-t" style={{ borderColor: colors.periwinkle }}>
                            <button
                                onClick={() => onJoinRoom(user_id, room_id)}
                                className="w-full py-2 rounded-lg font-bold text-sm transition-opacity hover:opacity-80" style={{ backgroundColor: colors.dustyBlue, color: colors.powderBlue }}>
                                {'Join discussion'}
                            </button>
                        </div>) : null}
                </>
            )}
        </aside>
    )

};

// Quiet Room component

{/*
const QuietRoom: React.FC<{ room: BigRoom | null, onExit: any, onSend: (content: string, quiet_room: boolean) => void, book_id: String }> = ({ room, onExit, onSend, book_id }) => {
    const { quote } = useAuth();
    const [liveComment, setLiveComment] = useState('');
    const [trackIdx, setTrackIdx] = useState(0);
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
    ].filter(Boolean);

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
                {/*
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
    );
};
*/}

export default DiscussionRoomPage;