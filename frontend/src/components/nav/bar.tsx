import { toast } from 'sonner';
import { useState, useEffect } from "react";

{/* =============== components ============ */ }
import { Home, BookOpen, Clock, Bookmark, Settings, Menu, Search, TrendingUp, Heart, LogOut, X, Bell, ChevronLeft, ChevronRight } from "lucide-react";

{/* =============== services ============ */ }
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

{/* =============== images ============ */ }
import Avatar from '@assets/avatar.jpeg';

{/* =============== utils ============ */ }
import { request } from "@utils/ApiRequest";

interface NavItem {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    element?: string;
}

const Sidebar = () => {

    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navItems: NavItem[] = [
        { icon: Home, label: 'Home', element: '/home' },
        { icon: Search, label: 'Browse', element: '/browse-books' },
        { icon: TrendingUp, label: 'Trending', element: '/trending' },
        { icon: Clock, label: 'History', element: '/history' },
        { icon: Bookmark, label: 'Library', element: '/library' },
        { icon: Heart, label: 'Favorites', element: '/wishlist' },
        { icon: Bell, label: 'Notifications', element: '/notifications' },
    ];

    const logout = (message?: string) => {
        sessionStorage.removeItem('token');
        setUser(null);
        request.setAuthToken(null);
        navigate(`/home`, { replace: true });
        toast.info('Pages & Parchment', {
            description: 'Come back soon!!'
        });
        setIsMobileOpen(false);
    };

    const toggleExpand = () => {
        if (!isMobile) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleNavClick = (index: number, element?: string) => {
        setActiveItem(index);
        if (element) {
            navigate(element);
        }
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-[#5a4d41] text-[#fcf9f4] rounded-lg shadow-lg hover:bg-[#7e6957] transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => !isMobile && setIsExpanded(true)}
                onMouseLeave={() => !isMobile && setIsExpanded(false)}
                className={`
        fixed lg:sticky top-0 h-screen
        bg-gradient-to-b from-[#5a4d41] to-[#3a3329]
        shadow-[4px_0_20px_rgba(0,0,0,0.3)]
        flex flex-col
        transition-all duration-300 ease-out
        z-50
        ${isExpanded ? 'w-64' : 'w-20'}
        ${isMobileOpen
                        ? 'translate-x-0 w-[85vw] max-w-[320px]'
                        : '-translate-x-full lg:translate-x-0'
                    }
    `}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-[#e8cfc5]/20">
                    <div className={`flex items-center gap-3 ${!isExpanded && !isMobileOpen && 'justify-center w-full'}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a394] to-[#d9b6a8] flex items-center justify-center text-white font-bold text-sm shadow-md">
                            pP
                        </div>
                        {(isExpanded || isMobileOpen) && (
                            <span className="text-[#fcf9f4] font-serif text-lg whitespace-nowrap tracking-wide">
                                Pages & Parchment
                            </span>
                        )}
                    </div>

                    {/* Toggle button for desktop */}
                    {!isMobile && (
                        <button
                            onClick={toggleExpand}
                            className="absolute -right-3 top-9 w-6 h-6 bg-[#7e6957] rounded-full flex items-center justify-center text-[#fcf9f4] border border-[#c9a394] shadow-md hover:bg-[#5a4d41] transition-colors"
                        >
                            {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a394]/30 scrollbar-track-transparent">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeItem === index;

                        return (
                            <button
                                key={index}
                                onClick={() => handleNavClick(index, item.element)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[#c9a394] to-[#b58b7c] text-[#fcf9f4] shadow-md'
                                        : 'text-[#e8cfc5] hover:bg-[#7e6957]/30 hover:text-[#f5e6d7]'
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

                                {/* Active Indicator */}
                                {isActive && !isExpanded && !isMobileOpen && (
                                    <div className="absolute left-0 w-1 h-6 bg-[#d9b6a8] rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="mx-3 my-2 h-px bg-[#e8cfc5]/20" />

                {/* Settings */}
                <div className="px-3 py-2">
                    <button
                        onClick={() => {
                            navigate('/settings');
                            setIsMobileOpen(false);
                        }}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl
                            text-[#e8cfc5] hover:bg-[#7e6957]/30 hover:text-[#f5e6d7]
                            transition-all duration-200
                            ${!isExpanded && !isMobileOpen && 'justify-center'}
                        `}
                        title={!isExpanded && !isMobileOpen ? 'Settings' : ''}
                    >
                        <Settings size={20} className="flex-shrink-0" />
                        {(isExpanded || isMobileOpen) && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Settings
                            </span>
                        )}
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-3 my-2 h-px bg-[#e8cfc5]/20" />

                {/* Profile */}
                <div className="px-3 pb-6">
                    <div className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl
                        hover:bg-[#7e6957]/30 transition-all duration-200 cursor-pointer group
                        text-[#e8cfc5] hover:text-[#f5e6d7]
                        ${!isExpanded && !isMobileOpen && 'justify-center'}
                    `}>
                        <div className="relative flex-shrink-0">
                            <img
                                src={user?.profilePhoto ? `${user?.profilePhoto}` : Avatar}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#c9a394]/50 group-hover:ring-[#d9b6a8] transition-all"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#5a4d41]" />
                        </div>

                        {(isExpanded || isMobileOpen) && (
                            <>
                                <div
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMobileOpen(false);
                                    }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-medium text-[#f5e6d7] truncate">
                                        {user?.username ?? 'Username'}
                                    </p>
                                    <p className="text-xs text-[#e8cfc5] truncate">
                                        {user?.email ?? 'scholar@oldlibrary.edu'}
                                    </p>
                                </div>

                                <LogOut
                                    onClick={() => logout()}
                                    size={16}
                                    className="text-[#e8cfc5] hover:text-[#f5e6d7] transition-colors cursor-pointer flex-shrink-0"
                                />
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;