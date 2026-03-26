// NotificationsPage.tsx

import React, { useState, useEffect } from 'react';
import { 
    Bell, Star, MessageSquare, Heart, BookOpen, Users, Award, 
    Settings, LogOut, ChevronRight, Trash2, Mail, MailOpen,
    Clock, Filter, MoreHorizontal, CheckCheck, Calendar, UserPlus,
    Bookmark, ThumbsUp, MessageCircle, Menu, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import Avatar from '@assets/avatar.jpeg';
import { AccountSettings } from '@pages/profile/AccountSettings';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: 'message' | 'reaction' | 'mention' | 'follow' | 'room_invite' | 'book_club' | 'achievement';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    from: {
        id: string;
        name: string;
        avatar?: string;
        initials: string;
    };
    metadata?: {
        roomName?: string;
        bookTitle?: string;
        achievementName?: string;
    };
}

export function NotificationsPage() {
    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mock notifications data
    const notifications: Notification[] = [
        {
            id: '1',
            type: 'message',
            title: 'New message from Clara L.',
            message: 'I finally finished Middlemarch and I need to discuss the ending with someone! The way Eliot wraps up Dorothea\'s story is just... I have so many thoughts. What did you think about the Casaubon codicil?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            read: false,
            from: {
                id: 'clara',
                name: 'Clara L.',
                initials: 'CL',
                avatar: Avatar
            },
            metadata: {
                roomName: 'Victorian Lit Society'
            }
        },
        {
            id: '2',
            type: 'reaction',
            title: 'Rowan M. reacted to your post',
            message: 'Rowan M. reacted with 🔥 to your comment in Midnight Philosophy: "The eternal return is less a cosmological claim and more a psychological test..."',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            read: false,
            from: {
                id: 'rowan',
                name: 'Rowan M.',
                initials: 'RM'
            },
            metadata: {
                roomName: 'Midnight Philosophy'
            }
        },
        {
            id: '3',
            type: 'mention',
            title: 'Theo S. mentioned you',
            message: 'Theo S. mentioned you in Poetry & Prose: "Would love to hear @yourusername thoughts on this week\'s submission - it has that same lyrical quality you admired in last week\'s piece."',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            read: true,
            from: {
                id: 'theo',
                name: 'Theo S.',
                initials: 'TS'
            },
            metadata: {
                roomName: 'Poetry & Prose'
            }
        },
        {
            id: '4',
            type: 'room_invite',
            title: 'Invitation to join Gothic & Grotesque',
            message: 'You\'ve been invited to join the Gothic & Grotesque reading circle. This group focuses on classic gothic literature from Walpole to Shelley to modern interpretations. Current read: "The Castle of Otranto".',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            read: true,
            from: {
                id: 'elise',
                name: 'Elise V.',
                initials: 'EV'
            },
            metadata: {
                roomName: 'Gothic & Grotesque'
            }
        },
        {
            id: '5',
            type: 'book_club',
            title: 'Book Club Meeting Tonight',
            message: 'Reminder: Slow Readers Club meeting at 7 PM. We\'ll be discussing chapters 14-20 of Middlemarch. Virtual reading room will open 15 minutes before.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
            read: true,
            from: {
                id: 'moderator',
                name: 'Moderator',
                initials: 'M'
            },
            metadata: {
                roomName: 'Slow Readers Club',
                bookTitle: 'Middlemarch'
            }
        },
        {
            id: '6',
            type: 'achievement',
            title: 'Achievement Unlocked: First Chapter',
            message: 'Congratulations! You\'ve completed your first book discussion. The "First Chapter" achievement has been added to your profile.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: true,
            from: {
                id: 'system',
                name: 'Pages & Parchment',
                initials: 'PP'
            },
            metadata: {
                achievementName: 'First Chapter'
            }
        }
    ];

    const selectedNotification = notifications.find(n => n.id === selectedNotificationId);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <MessageCircle size={18} className="text-[#B0C4D0]" />;
            case 'reaction':
                return <ThumbsUp size={18} className="text-[#D9B48B]" />;
            case 'mention':
                return <AtSign size={18} className="text-[#C7A875]" />;
            case 'follow':
                return <UserPlus size={18} className="text-[#9FB89F]" />;
            case 'room_invite':
                return <Users size={18} className="text-[#C9A394]" />;
            case 'book_club':
                return <Calendar size={18} className="text-[#B8925C]" />;
            case 'achievement':
                return <Award size={18} className="text-[#C9B27C]" />;
            default:
                return <Bell size={18} className="text-[#B0C4D0]" />;
        }
    };

    const markAsRead = (id: string) => {
        console.log('Mark as read:', id);
    };

    const markAllAsRead = () => {
        console.log('Mark all as read');
    };

    const deleteNotification = (id: string) => {
        console.log('Delete notification:', id);
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] pt-16 md:pt-20">
            {/* Mobile Menu Button - Bottom Right, Circular */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Left Panel - Notification List */}
            <div className={`
                fixed lg:sticky top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
                bg-white/80 backdrop-blur-md
                shadow-lg
                flex flex-col
                transition-all duration-300 ease-out
                z-40
                border-r border-[#C0D4E0]/30
                w-full lg:w-96
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[#C0D4E0]/30 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Bell size={20} className="text-[#B0C4D0]" />
                        <h1 className="font-serif text-lg font-semibold text-[#5a4d41]">Notifications</h1>
                    </div>
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs text-[#C7A875] hover:text-[#A67B45] transition-colors flex items-center gap-1"
                    >
                        <CheckCheck size={14} />
                        Mark all read
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="px-4 py-3 border-b border-[#C0D4E0]/30 flex gap-2 flex-shrink-0">
                    <button className="px-3 py-1 text-xs rounded-full bg-[#E0E9F0] text-[#5a4d41]">All</button>
                    <button className="px-3 py-1 text-xs rounded-full hover:bg-[#E0E9F0] text-[#7e6957] transition-colors">Unread</button>
                    <button className="px-3 py-1 text-xs rounded-full hover:bg-[#E0E9F0] text-[#7e6957] transition-colors flex items-center gap-1">
                        <Filter size={12} />
                        Filter
                    </button>
                </div>

                {/* Notification List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => {
                                setSelectedNotificationId(notification.id);
                                if (!notification.read) markAsRead(notification.id);
                                if (isMobile) setMobileMenuOpen(false);
                            }}
                            className={`
                                flex items-start gap-3 px-4 py-3 cursor-pointer transition-all
                                border-b border-[#C0D4E0]/30 hover:bg-[#E0E9F0]/30
                                ${selectedNotificationId === notification.id ? 'bg-[#E0E9F0]/50 border-l-4 border-l-[#B0C4D0]' : ''}
                                ${!notification.read ? 'bg-[#FEF9F2]' : ''}
                            `}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {notification.from.avatar ? (
                                    <img 
                                        src={notification.from.avatar} 
                                        alt={notification.from.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white text-sm font-semibold">
                                        {notification.from.initials}
                                    </div>
                                )}
                                {!notification.read && (
                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#B0C4D0]" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-sm font-medium truncate ${!notification.read ? 'text-[#5a4d41]' : 'text-[#7e6957]'}`}>
                                        {notification.title}
                                    </p>
                                    <span className="text-xs text-[#C7A875] flex-shrink-0">
                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-xs text-[#7e6957] truncate mt-0.5">
                                    {notification.message.substring(0, 80)}...
                                </p>
                                {notification.metadata?.roomName && (
                                    <p className="text-xs text-[#C7A875] mt-1 flex items-center gap-1">
                                        <MessageSquare size={10} />
                                        {notification.metadata.roomName}
                                    </p>
                                )}
                            </div>

                            {/* Delete button */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:bg-[#E0E9F0] p-1 rounded transition-all"
                            >
                                <Trash2 size={14} className="text-[#C7A875]" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#C0D4E0]/30 flex-shrink-0">
                    <p className="text-xs text-center text-[#7e6957]">
                        {notifications.filter(n => !n.read).length} unread notifications
                    </p>
                </div>
            </div>

            {/* Main Content - Notification Detail View */}
            <div className="lg:ml-96 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
                {selectedNotification ? (
                    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
                        {/* Header */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-4 md:p-6 mb-4 md:mb-6">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white text-base md:text-lg font-semibold">
                                        {selectedNotification.from.initials}
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-serif font-semibold text-[#5a4d41]">
                                            {selectedNotification.title}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs md:text-sm text-[#7e6957]">{selectedNotification.from.name}</span>
                                            <span className="text-xs text-[#C7A875]">•</span>
                                            <span className="text-xs text-[#C7A875]">
                                                {formatDistanceToNow(selectedNotification.timestamp, { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-[#E0E9F0] rounded-lg transition-colors">
                                        <MailOpen size={18} className="text-[#C7A875]" />
                                    </button>
                                    <button 
                                        onClick={() => deleteNotification(selectedNotification.id)}
                                        className="p-2 hover:bg-[#E0E9F0] rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} className="text-[#C7A875]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-4 md:p-8">
                            <div className="prose prose-sm max-w-none">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#C0D4E0]/30">
                                    {getNotificationIcon(selectedNotification.type)}
                                    <span className="text-xs md:text-sm text-[#C7A875] uppercase tracking-wide">
                                        {selectedNotification.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm md:text-base text-[#5a4d41] leading-relaxed whitespace-pre-wrap">
                                    {selectedNotification.message}
                                </p>
                                
                                {selectedNotification.metadata?.roomName && (
                                    <div className="mt-6 p-3 md:p-4 bg-[#E0E9F0]/30 rounded-lg">
                                        <p className="text-xs md:text-sm text-[#7e6957] flex items-center gap-2">
                                            <MessageSquare size={14} />
                                            Related to: {selectedNotification.metadata.roomName}
                                            {selectedNotification.metadata.bookTitle && ` • ${selectedNotification.metadata.bookTitle}`}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {(selectedNotification.type === 'message' || selectedNotification.type === 'mention') && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <button className="px-4 py-2 bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                                            Reply
                                        </button>
                                        <button className="px-4 py-2 border border-[#C0D4E0] text-[#7e6957] rounded-lg text-sm hover:bg-[#E0E9F0] transition-colors">
                                            Mark as Read
                                        </button>
                                    </div>
                                )}

                                {selectedNotification.type === 'room_invite' && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <button className="px-4 py-2 bg-gradient-to-r from-[#D9B48B] to-[#C7A875] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                                            Accept Invitation
                                        </button>
                                        <button className="px-4 py-2 border border-[#C0D4E0] text-[#7e6957] rounded-lg text-sm hover:bg-[#E0E9F0] transition-colors">
                                            Decline
                                        </button>
                                    </div>
                                )}

                                {selectedNotification.type === 'book_club' && (
                                    <div className="mt-6">
                                        <button className="px-4 py-2 bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                                            Join Meeting
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex items-center justify-center h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
                        <div className="text-center p-4 md:p-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-[#E0E9F0]/50 flex items-center justify-center">
                                <Bell size={28} className="text-[#C7A875]" />
                            </div>
                            <h3 className="text-lg md:text-xl font-serif text-[#5a4d41] mb-2">No notification selected</h3>
                            <p className="text-xs md:text-sm text-[#7e6957]">Select a notification from the list to read it</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// AtSign component
const AtSign = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4"/>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
    </svg>
);

export default NotificationsPage;