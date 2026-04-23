{/* =============== REACT ============ */ }
import React, { useState, useEffect } from 'react';

{/* =============== MODELS ============ */ }
import type { Room } from '@models/Book';
import type { User } from '@models/User';
{/* =============== COMPONENTS ============ */ }
import { toast } from 'sonner';
import {
    Search, Compass, MessageSquare,
    Users, Bell, Settings, LogOut,
    X, Menu, Home, Flame, Star,
    Plus, BookOpen
} from "lucide-react";
import Board from '@components/skeleton/board';
import { useNewMessage } from "@hooks/useMessage";
import { Shelves } from '@components/skeleton/shelves/Shelves';

{/* =============== SERVICES ============ */ }
import { request } from '@utils/ApiRequest';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

{/* =============== IMAGES ============ */ }
import Avatar from '@assets/avatar.jpeg';

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name[0].toUpperCase();
};

export function DiscussionHubPage() {
    const [activeTab, setActiveTab] = useState<'discover' | 'my-rooms' | 'messages'>('discover');
    const [popularRooms, setPopularRooms] = useState<Room[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const getPopularRooms = async () => {
            const popular = await request.get<any>(`/recs/popular-rooms`);
            setPopularRooms(popular.rooms)
        }
        getPopularRooms();
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f5f7] pt-16">
            <TopNavBar activeTab={activeTab} onTabChange={setActiveTab} onMenuClick={() => setIsMobileMenuOpen(true)} />

            {isMobileMenuOpen && <MobileMenuDrawer onClose={() => setIsMobileMenuOpen(false)} />}

            <main className="max-w-7xl mx-auto px-5 py-6">
                {activeTab === 'discover' && <DiscoverContent popularRooms={popularRooms} />}
                {activeTab === 'my-rooms' && <MyRoomsContent />}
                {activeTab === 'messages' && <MessagesContent />}
            </main>
        </div>
    );
}

// TOP NAVIGATION BAR
const TopNavBar: React.FC<{
    activeTab: 'discover' | 'my-rooms' | 'messages';
    onTabChange: (tab: 'discover' | 'my-rooms' | 'messages') => void;
    onMenuClick: () => void;
}> = ({ activeTab, onTabChange, onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'discover', label: 'Discover', icon: Compass },
        { id: 'my-rooms', label: 'My Rooms', icon: MessageSquare },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
    ];

    return (
        <div className="sticky z-20 backdrop-blur-md border-b border-[#e9e9ef]">
            <div className="px-5 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#f5f5f7] rounded-lg">
                            <Menu size={20} className="text-[#86868b]" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a394] to-[#b58b7c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                CR
                            </div>
                            <span className="font-serif text-lg text-[#5a4d41] hidden sm:inline-block">Commonroom</span>
                        </div>
                    </div>

                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0C4D0]" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search rooms & discussions..."
                                className="w-full pl-10 pr-4 py-2 bg-[#E0E9F0]/30 text-[#5a4d41] placeholder-[#B0C4D0]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B0C4D0]/30 border border-[#C0D4E0]/50 text-sm"
                            />
                        </div>
                    </div>

                    {/*<div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-[#E0E9F0] rounded-lg transition-colors">
                            <Bell size={18} className="text-[#7e6957]" />
                        </button>
                        <img
                            src={user?.profilePhoto || Avatar}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#B0C4D0]/30"
                        />
                    </div>*/}
                    <div></div>
                </div>

                {/* Tab Bar */}
                <div className="flex gap-1 mt-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#E0E9F0]/50 text-[#5a4d41]'
                                    : 'text-[#7e6957] hover:bg-[#E0E9F0]/30 hover:text-[#5a4d41]'
                                    }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// MOBILE MENU DRAWER
const MobileMenuDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
        navigate('/home', { replace: true });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md z-50 shadow-xl p-4 border-r border-[#C0D4E0]/30">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#C0D4E0]/30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a394] to-[#b58b7c] flex items-center justify-center text-white font-bold text-sm">
                            CR
                        </div>
                        <span className="font-serif text-lg text-[#5a4d41]">Commonroom</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#E0E9F0] rounded-lg">
                        <X size={20} className="text-[#7e6957]" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#E0E9F0]/30 rounded-xl">
                        <img src={user?.profilePhoto || Avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="text-sm font-medium text-[#5a4d41]">{user?.username || 'Scholar'}</p>
                            <p className="text-xs text-[#7e6957]">{user?.email || 'scholar@oldlibrary.edu'}</p>
                        </div>
                    </div>

                    <button onClick={() => { onClose(); navigate('/profile'); }} className="w-full text-left p-3 rounded-lg text-[#5a4d41] hover:bg-[#E0E9F0]/30 transition-colors">Profile</button>
                    <button onClick={() => { onClose(); }} className="w-full text-left p-3 rounded-lg text-[#5a4d41] hover:bg-[#E0E9F0]/30 transition-colors">Settings</button>
                    <button onClick={logout} className="w-full text-left p-3 rounded-lg text-[#d44000] hover:bg-[#E0E9F0]/30 transition-colors">Sign Out</button>
                </div>
            </div>
        </>
    );
};

// DISCOVER CONTENT
const DiscoverContent: React.FC<{ popularRooms: Room[] }> = ({ popularRooms }) => {
    const { library, user, recommendRooms } = useAuth();
    const navigate = useNavigate();
    const topRooms = [...popularRooms].slice(0, 6);

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
        <div className="space-y-20">
            {/* Library Section - Original Apple Style */}
            <div>
                <Shelves
                    shelf1Caption='Currently Reading'
                    shelf1SubCaption='continue your journey'
                    shelf1={library} />
            </div>

            {/* Trending Rooms */}
            <div className="w-full max-w-6xl mx-auto px-5">
                <div className="flex items-end justify-between mb-7 pb-1 border-b border-[#e9e9ef]">
                    <div>
                        <h2 className="text-[28px] font-['SF_Pro_Display',_system-ui] font-semibold tracking-tight text-[#1d1d1f] leading-tight">
                            Trending Rooms
                        </h2>
                        <p className="text-[13px] text-[#86868b] mt-1">join the conversation</p>
                    </div>
                    <button className="text-[13px] text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors">
                        See all →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
                    {topRooms.map((room) => (
                        <div
                            key={room.id}
                            className="group relative bg-white rounded-2xl border border-[#e9e9ef] p-5 hover:shadow-md transition-all duration-300">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f5f5f7] to-[#e9e9ef] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                    {getInitials(room.name)}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3
                                        onClick={() => {
                                            //console.log('url:', `/book/${room.bookId}/room/${room.id}`)
                                            navigate(`/book/${room.bookId}/room/${room.id}`)}}
                                        className="font-['SF_Pro_Display',_system-ui] font-semibold text-[#1d1d1f] text-base truncate hover:underline cursor-pointer">
                                        {room.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Users size={12} className="text-[#86868b]" />
                                            <span className="text-xs text-[#86868b]">{room.members || 0}</span>
                                        </div>
                                        {(room.members || 0) > 8 && (
                                            <>
                                                <span className="w-0.5 h-0.5 rounded-full bg-[#c9a394]" />
                                                <span className="text-xs text-[#c9a394]">popular</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onJoinRoom(user?.id || '', room.id)}
                                className="w-full mt-3 py-2 text-sm font-medium text-[#0071e3] bg-[#f5f5f7] rounded-xl hover:bg-[#e9e9ef] transition-colors">
                                Join Room
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommened Rooms*/}
            <Board
                title="Recommended for You"
                subtitle="based on your reading"
                items={recommendRooms.map(room => ({
                    heading: room.name,
                    subheading: `${room.members || 0} members`,
                    action: {
                        label: 'Join →',
                        onClick: () => onJoinRoom(user?.id || '', room.id),
                    },
                }))}
            />
        </div>
    );
};

const MyRoomsContent: React.FC = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-serif font-semibold text-[#5a4d41] mb-2">My Rooms</h2>
        <p className="text-[#7e6957]">Your joined rooms will appear here. Join rooms from Discover to get started!</p>
    </div>
);

const MessagesContent: React.FC = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-12 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-xl font-serif font-semibold text-[#5a4d41] mb-2">Messages</h2>
        <p className="text-[#7e6957]">Select a conversation from the left panel to start messaging.</p>
    </div>
);

export default DiscussionHubPage;