
import { toast } from 'sonner';
import { useState } from "react";

{/* =============== components ============ */ }
import { Home, BookOpen, Clock, Bookmark, Settings, Menu, Search, TrendingUp, Heart, LogOut, X, Bell } from "lucide-react";

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
        toast.info('Pages ń Parchment',{description:
            'Come back soon!!'
        })
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className=" font-sans lg:hidden fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
                {isMobileOpen ? <X className='hidden' size={15} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`fixed lg:sticky top-0 h-screen bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 ease-out z-40 ${isExpanded ? 'w-64' : 'w-20'
                    } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className=" font-sans h-20 flex items-center px-6 border-b border-white/5">
                    <div className={`flex items-center gap-3 ${!isExpanded && 'justify-center w-full'}`}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            pP
                        </div>
                        {isExpanded && (
                            <span className="text-white font-snas text-lg whitespace-nowrap">
                                Pages & Parchment
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeItem === index;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveItem(index);
                                    setIsMobileOpen(false);
                                    navigate(`${item.element}`)
                                }}
                                className={`font-sans w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[#7b5f48] text-[#1b120e]'
                                    : 'text-[#e0cabe] hover:bg-[#7b5f48]/20 hover:text-[#998982]'
                                    } ${!isExpanded && 'justify-center'}`}
                            >
                                <Icon size={20} className="flex-shrink-0" />

                                {isExpanded && (
                                    <span className=" label text-sm font-medium whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active Indicator */}
                                {isActive && !isExpanded && (
                                    <div className="absolute left-0 w-1 h-5 bg-gray-400 rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="mx-3 h-px bg-white/5" />

                {/* Settings */}
                <div className="px-3 py-4">
                    <button
                        className={`font-sans w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#e0cabe] hover:bg-[#7b5f48]/20 hover:text-[#998982]0 transition-all duration-200 ${!isExpanded && 'justify-center'
                            }`}
                    >
                        <Settings size={20} className="flex-shrink-0" />
                        {isExpanded && (
                            <span
                                onClick={() => navigate('/settings')}
                                className="text-sm font-medium whitespace-nowrap">
                                Settings
                            </span>
                        )}
                    </button>
                </div>

                {/* Profile */}
                <div className="px-3 pb-6">
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group ${!isExpanded && 'justify-center'
                        } text-[#e0cabe] hover:bg-[#7b5f48]/20 hover:text-[#998982]`}>
                        <div className="relative flex-shrink-0">
                            <img
                                src={user?.profilePhoto ? `${user?.profilePhoto}` : Avatar}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-gray-700 transition-all"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black/40" />
                        </div>

                        {isExpanded && (
                            <div onClick={() => navigate('/profile')} className="font-sans flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#e0cabe] truncate">{user?.username ?? 'Username'}</p>
                                <p className="text-xs text-[#e0cabe] truncate">{user?.email ?? 'scholar@oldlibrary.edu'}</p>
                            </div>
                        )}

                        {isExpanded && (
                            <LogOut onClick={() => logout()} size={16} className="text-[#e0cabe] group-hover:text-[#998982] transition-colors" />
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;