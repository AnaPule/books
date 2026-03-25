
import React, { useState, useEffect } from 'react';
import { Search, Landmark, Vote, Podcast, MessageSquare, Users, Flame, BookOpen, Bell, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, Plus, Heart, Clock, Star, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Avatar from '@assets/avatar.jpeg';
import { AccountSettings } from '@pages/profile/AccountSettings';

// New Blue Colors Added:
// --powder-blue: #E0E9F0 (lightest blue - backgrounds, hover states)
// --sky-mist: #D0E0E8 (soft sky - cards, overlays)
// --periwinkle-light: #C0D4E0 (gentle periwinkle - borders)
// --misty-lavender: #B0C4D0 (blue-lavender blend - accents)
// --dusty-blue: #9CB0C0 (muted blue - buttons, highlights)
// --slate-pastel: #8098A8 (soft slate - deeper accents)

export function DiscussionHubPage() {
    return (
        <div className="min-h-screen mt-16 md:mt-20">
            <div className="flex">
                <LeftPanel />
                <div className="flex-1">
                    <TopBar />
                    <MainContent />
                </div>
                <RightPanel />
            </div>
        </div>
    );
}

// ============= LEFT PANEL - MATCHES MAIN SIDEBAR =============
const LeftPanel: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navItems = [
        { id: 0, icon: Landmark, label: 'Discover', element: 'discover' },
        { id: 1, icon: Vote, label: 'My Rooms', element: 'my-rooms', badge: 12 },
        { id: 2, icon: MessageSquare, label: 'Direct Messages', element: 'messages', badge: 3 },
    ];

    const myRooms = [
        { id: 'victorian', name: 'Victorian Lit Society', badge: 12, online: true },
        { id: 'slow-readers', name: 'Slow Readers Club', badge: undefined, online: true },
        { id: 'poetry', name: 'Poetry & Prose', badge: 3, online: true },
        { id: 'midnight', name: 'Midnight Philosophy', badge: undefined, online: false },
    ];

    const dms = [
        { id: 'clara', initials: 'CL', name: 'Clara L.', avatarBg: '#D0E0E8', avatarColor: '#8098A8', unread: true, online: true },
        { id: 'rowan', initials: 'RM', name: 'Rowan M.', avatarBg: '#E0E9F0', avatarColor: '#8098A8', unread: false, online: true },
        { id: 'theo', initials: 'TS', name: 'Theo S.', avatarBg: '#C0D4E0', avatarColor: '#8098A8', unread: true, online: false },
    ];

    const toggleExpand = () => {
        if (!isMobile) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleNavClick = (index: number) => {
        setActiveNav(index);
        setIsMobileOpen(false);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
        navigate('/home', { replace: true });
        setIsMobileOpen(false);
    };

    return (
        <>
            <AccountSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-[#B0C4D0] text-white rounded-lg shadow-md hover:bg-[#9CB0C0] transition-colors"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => !isMobile && setIsExpanded(true)}
                onMouseLeave={() => !isMobile && setIsExpanded(false)}
                className={`
                    fixed lg:sticky top-0 h-screen
                    bg-white/80 backdrop-blur-md
                    shadow-lg
                    flex flex-col
                    transition-all duration-300 ease-out
                    z-50
                    border-r border-[#C0D4E0]/30
                    ${isExpanded ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0 w-[85vw] max-w-[320px]' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-[#C0D4E0]/30">
                    <div className={`flex items-center gap-3 ${!isExpanded && !isMobileOpen && 'justify-center w-full'}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            CR
                        </div>
                        {(isExpanded || isMobileOpen) && (
                            <span className="text-[#5a4d41] font-serif text-lg whitespace-nowrap tracking-wide">
                                The Commonroom
                            </span>
                        )}
                    </div>

                    {!isMobile && (
                        <button
                            onClick={toggleExpand}
                            className="absolute -right-3 top-9 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#B0C4D0] border border-[#C0D4E0] shadow-sm hover:bg-[#E0E9F0] transition-colors"
                        >
                            {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeNav === index;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(index)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white shadow-md'
                                        : 'text-[#7e6957] hover:bg-[#E0E9F0] hover:text-[#5a4d41]'
                                    }
                                    ${!isExpanded && !isMobileOpen && 'justify-center'}
                                `}
                                title={!isExpanded && !isMobileOpen ? item.label : ''}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {(isExpanded || isMobileOpen) && (
                                    <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">
                                        {item.label}
                                    </span>
                                )}
                                {item.badge && (isExpanded || isMobileOpen) && (
                                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && !isExpanded && !isMobileOpen && (
                                    <div className="absolute left-0 w-1 h-6 bg-[#B0C4D0] rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* My Rooms Section */}
                <div className="px-3 py-2">
                    <div className={`${!isExpanded && !isMobileOpen ? 'hidden' : 'block'}`}>
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#B0C4D0] px-3 py-2">
                            My Rooms
                        </div>
                        {myRooms.map((room) => (
                            <div key={room.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#E0E9F0] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${room.online ? 'bg-[#9CB0C0]' : 'bg-[#C0D4E0]'}`} />
                                    <span className="text-sm text-[#5a4d41] group-hover:text-[#8098A8] transition-colors">{room.name}</span>
                                </div>
                                {room.badge && (
                                    <span className="px-2 py-0.5 bg-[#E0E9F0] text-[#8098A8] text-xs rounded-full">
                                        {room.badge}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Direct Messages */}
                <div className="px-3 py-2">
                    <div className={`${!isExpanded && !isMobileOpen ? 'hidden' : 'block'}`}>
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#B0C4D0] px-3 py-2">
                            Direct Messages
                        </div>
                        {dms.map((dm) => (
                            <div key={dm.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#E0E9F0] transition-colors cursor-pointer">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                        style={{ background: dm.avatarBg, color: dm.avatarColor }}>
                                        {dm.initials}
                                    </div>
                                    {dm.online && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#9CB0C0] rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <span className="flex-1 text-sm text-[#5a4d41]">{dm.name}</span>
                                {dm.unread && <div className="w-2 h-2 bg-[#B0C4D0] rounded-full" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mx-3 my-2 h-px bg-[#C0D4E0]/30" />

                {/* Settings */}
                <div className="px-3 py-2">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl
                            text-[#7e6957] hover:bg-[#E0E9F0] hover:text-[#5a4d41]
                            transition-all duration-200
                            ${!isExpanded && !isMobileOpen && 'justify-center'}
                        `}
                        title={!isExpanded && !isMobileOpen ? 'Settings' : ''}
                    >
                        <Settings size={20} className="flex-shrink-0" />
                        {(isExpanded || isMobileOpen) && (
                            <span className="text-sm font-medium whitespace-nowrap">Settings</span>
                        )}
                    </button>
                </div>

                <div className="mx-3 my-2 h-px bg-[#C0D4E0]/30" />

                {/* Profile */}
                <div className="px-3 pb-6">
                    <div className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl
                        hover:bg-[#E0E9F0] transition-all duration-200 cursor-pointer group
                        text-[#7e6957] hover:text-[#5a4d41]
                        ${!isExpanded && !isMobileOpen && 'justify-center'}
                    `}>
                        <div className="relative flex-shrink-0">
                            <img
                                src={user?.profilePhoto ? user.profilePhoto : Avatar}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#B0C4D0]/30 group-hover:ring-[#8098A8] transition-all"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#9CB0C0] rounded-full border-2 border-white" />
                        </div>
                        {(isExpanded || isMobileOpen) && (
                            <>
                                <div onClick={() => navigate('/profile')} className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#5a4d41] truncate">
                                        {user?.username ?? 'Username'}
                                    </p>
                                    <p className="text-xs text-[#7e6957] truncate">
                                        {user?.email ?? 'scholar@oldlibrary.edu'}
                                    </p>
                                </div>
                                <LogOut onClick={logout} size={16} className="text-[#7e6957] hover:text-[#B0C4D0] transition-colors cursor-pointer flex-shrink-0" />
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

// ============= TOP BAR =============
const TopBar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#C0D4E0]/30">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
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
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-[#E0E9F0] rounded-lg transition-colors">
                            <Bell size={18} className="text-[#7e6957]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============= MAIN CONTENT =============
const MainContent: React.FC = () => {
    return (
        <div className="p-6 space-y-8">
            <TrendingRooms />
            <ActivityFeed />
        </div>
    );
};

// ============= TRENDING ROOMS =============
const TrendingRooms: React.FC = () => {
    const rooms = [
        {
            id: 1,
            name: 'Victorian Lit Society',
            description: 'Currently dissecting Middlemarch — all Dorothea, all the time',
            icon: '📚',
            tags: ['Classic', '19th Century'],
            members: 234,
            active: 47,
            isLive: true
        },
        {
            id: 2,
            name: 'Midnight Philosophy',
            description: 'Tonight: does Nietzsche still speak to modern despair?',
            icon: '🌙',
            tags: ['Philosophy', 'Debate'],
            members: 312,
            active: 23,
            isLive: true
        },
        {
            id: 3,
            name: 'The Inkwell',
            description: 'Weekly flash fiction — this month\'s theme: fog & memory',
            icon: '✍️',
            tags: ['Writing', 'Fiction'],
            members: 189,
            active: null,
            isLive: false
        },
        {
            id: 4,
            name: 'Ancient Worlds',
            description: 'From Gilgamesh to Homer — the original storytellers',
            icon: '🏺',
            tags: ['History', 'Mythology'],
            members: 221,
            active: null,
            isLive: false
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-serif font-semibold text-[#5a4d41]">Popular Rooms</h2>
                    <p className="text-sm text-[#7e6957] italic">— lit up right now</p>
                </div>
                <button className="text-sm text-[#B0C4D0] hover:text-[#8098A8] transition-colors">Browse all →</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-4 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-[#E0E9F0]/30 flex items-center justify-center text-xl">
                                {room.icon}
                            </div>
                            {room.isLive && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#E0E9F0]/50 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B0C4D0] animate-pulse" />
                                    <span className="text-xs text-[#8098A8] font-medium">{room.active} reading</span>
                                </div>
                            )}
                        </div>
                        <h3 className="font-serif font-semibold text-[#5a4d41] mb-1 group-hover:text-[#8098A8] transition-colors">
                            {room.name}
                        </h3>
                        <p className="text-sm text-[#7e6957] italic mb-3 line-clamp-2">{room.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {room.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 bg-[#E0E9F0]/30 text-[#7e6957] rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#B0C4D0]">
                                <Users size={12} />
                                <span>{room.members}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============= ACTIVITY FEED =============
const ActivityFeed: React.FC = () => {
    const activities = [
        {
            id: 1,
            room: 'Victorian Lit Society',
            icon: '📚',
            content: '"…Dorothea\'s choice at the end of chapter 29 is the most devastating sentence…"',
            author: 'Clara L.',
            time: '3 min ago',
            type: 'replied'
        },
        {
            id: 2,
            room: 'Midnight Philosophy',
            icon: '🌙',
            content: '"The eternal return is less a cosmological claim and more a psychological test…"',
            author: 'Rowan M.',
            time: '18 min ago',
            type: 'posted'
        },
        {
            id: 3,
            room: 'Poetry & Prose',
            icon: '✍️',
            content: 'New submission: "The Cartographer\'s Daughter" — a prose poem',
            author: 'Elise V.',
            time: '1 hr ago',
            type: 'shared'
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-serif font-semibold text-[#5a4d41]">Recent Activity</h2>
                    <p className="text-sm text-[#7e6957] italic">— from rooms you follow</p>
                </div>
                <button className="text-sm text-[#B0C4D0] hover:text-[#8098A8] transition-colors">Mark all read</button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 overflow-hidden">
                {activities.map((activity, idx) => (
                    <div
                        key={activity.id}
                        className={`flex gap-3 p-4 hover:bg-[#E0E9F0]/30 transition-colors cursor-pointer ${idx !== activities.length - 1 ? 'border-b border-[#C0D4E0]/30' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-[#E0E9F0]/30 flex items-center justify-center text-xl flex-shrink-0">
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[#5a4d41]">{activity.room}</span>
                                <span className="text-xs text-[#B0C4D0]/70">{activity.time}</span>
                            </div>
                            <p className="text-sm text-[#7e6957] italic line-clamp-2 mb-1">{activity.content}</p>
                            <p className="text-xs text-[#B0C4D0]">— {activity.author} {activity.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============= RIGHT PANEL - WITH FULL FUNCTIONALITY =============
const RightPanel: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('recommended');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleExpand = () => {
        if (!isMobile) {
            setIsExpanded(!isExpanded);
        }
    };

    const recommendedSections = [
        { id: 'recommended', icon: Star, label: 'For You', badge: 4 },
        { id: 'trending', icon: Flame, label: 'Trending', badge: 12 },
        { id: 'new', icon: Plus, label: 'New Arrivals', badge: 3 },
    ];

    const recommendedRooms = [
        { id: 1, name: 'Gothic & Grotesque', icon: '🕯️', reason: 'Based on your Victorian reads', members: 156, isNew: false },
        { id: 2, name: 'Nature Writing', icon: '🌿', reason: 'Popular in Poetry & Prose', members: 234, isNew: false },
        { id: 3, name: 'Mystery & Suspense', icon: '🗝️', reason: '571 readers this week', members: 571, isNew: true },
        { id: 4, name: 'Speculative Minds', icon: '🪐', reason: 'Trending in your network', members: 89, isNew: false },
    ];

    const trendingRooms = [
        { id: 1, name: 'Fantasy Book Awards', icon: '🏆', trend: '+47 this week', members: 342, isHot: true },
        { id: 2, name: 'Author AMA Series', icon: '🎤', trend: '+32 this week', members: 287, isHot: true },
        { id: 3, name: 'Book to Screen', icon: '🎬', trend: '+28 this week', members: 156, isHot: false },
    ];

    const newRooms = [
        { id: 1, name: 'Cozy Fantasy Corner', icon: '🪶', created: '2 days ago', members: 45 },
        { id: 2, name: 'Modernist Literature', icon: '📖', created: '5 days ago', members: 78 },
        { id: 3, name: 'Graphic Novel Club', icon: '🎨', created: '1 week ago', members: 112 },
    ];

    const readingNow = [
        { id: 1, title: 'Middlemarch', readers: ['Clara', '12 others'], progress: 65, color: '#B0C4D0' },
        { id: 2, title: 'Thus Spoke Zarathustra', readers: ['Rowan', '7 others'], progress: 40, color: '#9CB0C0' },
        { id: 3, title: 'Pilgrim at Tinker Creek', readers: ['Elise', '4 others'], progress: 80, color: '#8098A8' },
    ];

    const getCurrentContent = () => {
        switch (activeSection) {
            case 'recommended':
                return (
                    <div className="space-y-2">
                        {recommendedRooms.map((room) => (
                            <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#E0E9F0]/30 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-[#E0E9F0]/30 flex items-center justify-center text-xl border border-[#C0D4E0]/30">
                                    {room.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#5a4d41] group-hover:text-[#8098A8] transition-colors">{room.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-[#B0C4D0]">
                                            <Users size={10} />
                                            <span>{room.members}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#7e6957] italic">{room.reason}</p>
                                    {room.isNew && (
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-[#B0C4D0]/10 text-[#8098A8] rounded-full">New</span>
                                    )}
                                </div>
                                <button className="px-3 py-1 text-xs bg-[#E0E9F0]/50 border border-[#B0C4D0] text-[#8098A8] rounded-full hover:bg-[#B0C4D0] hover:text-white transition-colors">
                                    Join
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case 'trending':
                return (
                    <div className="space-y-2">
                        {trendingRooms.map((room, idx) => (
                            <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#E0E9F0]/30 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-[#E0E9F0]/30 flex items-center justify-center text-xl border border-[#C0D4E0]/30">
                                    {room.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#5a4d41] group-hover:text-[#8098A8] transition-colors">{room.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-[#B0C4D0]">
                                            <Users size={10} />
                                            <span>{room.members}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-[#8098A8]">{room.trend}</span>
                                        {room.isHot && (
                                            <span className="text-xs px-2 py-0.5 bg-[#E0E9F0] text-[#8098A8] rounded-full">🔥 Hot</span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-[#B0C4D0]/50 group-hover:text-[#8098A8]" />
                            </div>
                        ))}
                    </div>
                );
            case 'new':
                return (
                    <div className="space-y-2">
                        {newRooms.map((room) => (
                            <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#E0E9F0]/30 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-[#E0E9F0]/30 flex items-center justify-center text-xl border border-[#C0D4E0]/30">
                                    {room.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#5a4d41] group-hover:text-[#8098A8] transition-colors">{room.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-[#B0C4D0]">
                                            <Users size={10} />
                                            <span>{room.members}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#7e6957]">Created {room.created}</p>
                                </div>
                                <button className="px-3 py-1 text-xs bg-[#E0E9F0]/50 border border-[#B0C4D0] text-[#8098A8] rounded-full hover:bg-[#B0C4D0] hover:text-white transition-colors">
                                    Join
                                </button>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <aside
            onMouseEnter={() => !isMobile && setIsExpanded(true)}
            onMouseLeave={() => !isMobile && setIsExpanded(false)}
            className={`
                fixed lg:sticky top-0 right-0 h-screen
                bg-white/80 backdrop-blur-md
                shadow-lg
                flex flex-col
                transition-all duration-300 ease-out
                z-40
                border-l border-[#C0D4E0]/30
                ${isExpanded ? 'w-80' : 'w-20'}
                hidden lg:flex
            `}
        >
            {/* Right Panel Header */}
            <div className="h-20 flex items-center px-6 border-b border-[#C0D4E0]/30">
                <div className={`flex items-center gap-3 ${!isExpanded && 'justify-center w-full'}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        <Compass size={16} />
                    </div>
                    {(isExpanded) && (
                        <span className="text-[#5a4d41] font-serif text-lg whitespace-nowrap tracking-wide">
                            Discover
                        </span>
                    )}
                </div>

                <button
                    onClick={toggleExpand}
                    className="absolute -left-3 top-9 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#B0C4D0] border border-[#C0D4E0] shadow-sm hover:bg-[#E0E9F0] transition-colors"
                >
                    {isExpanded ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="px-3 py-4">
                <div className={`${!isExpanded ? 'hidden' : 'block'}`}>
                    <div className="space-y-1">
                        {recommendedSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white shadow-md'
                                            : 'text-[#7e6957] hover:bg-[#E0E9F0] hover:text-[#5a4d41]'
                                        }
                                    `}
                                >
                                    <Icon size={18} className="flex-shrink-0" />
                                    <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">
                                        {section.label}
                                    </span>
                                    {section.badge && (
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#E0E9F0] text-[#8098A8]'}`}>
                                            {section.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mx-3 my-2 h-px bg-[#C0D4E0]/30" />

            {/* Dynamic Content */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className={`${!isExpanded ? 'hidden' : 'block'}`}>
                    {getCurrentContent()}
                </div>
            </div>

            <div className="mx-3 my-2 h-px bg-[#C0D4E0]/30" />

            {/* Reading Now Section */}
            <div className="px-3 py-4">
                <div className={`${!isExpanded ? 'hidden' : 'block'}`}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B0C4D0] mb-4">
                        <BookOpen size={14} />
                        Currently Reading
                    </div>
                    <div className="space-y-3">
                        {readingNow.map((book) => (
                            <div key={book.id} className="p-3 rounded-xl hover:bg-[#E0E9F0]/30 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-10 rounded-full" style={{ background: book.color }} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#5a4d41]">{book.title}</p>
                                        <p className="text-xs text-[#7e6957]">{book.readers.join(' & ')}</p>
                                        <div className="w-full h-1 bg-[#C0D4E0]/50 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${book.progress}%`, background: book.color }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DiscussionHubPage;