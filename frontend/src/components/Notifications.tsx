// ===================== REACT ====================== //
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
// ===================== COMPONENT ====================== //
import {
    Bell, Star, MessageSquare, Heart, BookOpen, Users, Award,
    Settings, LogOut, ChevronRight, Trash2, Mail, MailOpen,
    Clock, Filter, MoreHorizontal, CheckCheck, Calendar, UserPlus,
    Bookmark, ThumbsUp, MessageCircle, Menu, X
} from "lucide-react";
import {BooksLogo} from "@pages/auth/VerifyEmailPage";
import { AccountSettings } from '@pages/profile/AccountSettings';

// ===================== SERVICE ====================== //
import DOMPurify from 'dompurify';
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

// ===================== MODEL ====================== //
import type { Notification } from '@models/Notice';

// ===================== IMAGE ====================== //
import Avatar from '@assets/avatar.jpeg';

// notice item component
const NoticeItem: React.FC<{
    ping: Notification;
    selectedNotificationId: string | null;
    setSelectedNotificationId: (Id: string) => void;
    markAsRead?: (id: string) => void;
    isMobile?: boolean;
    setMobileMenuOpen?: (open: boolean) => void;
}> = ({ ping, selectedNotificationId, setSelectedNotificationId, markAsRead, isMobile, setMobileMenuOpen }) => {
    return (
        <div
            key={ping.id}
            onClick={() => {
                setSelectedNotificationId(ping.id);
                if (!ping.read && markAsRead) markAsRead(ping.id);
                if (isMobile && setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            className={`
                                flex items-start gap-3 px-4 py-3 cursor-pointer transition-all
                                border-b border-[#F9E2E0] hover:bg-[#FCE9E8]/40
                                ${selectedNotificationId === ping.id ? 'bg-[#E8C7C5]/15 border-l-4 border-l-[#B57A74]' : ''}
                                ${!ping.read ? 'bg-[#E8C7C5]/15 ' : ''}
                            `}
        >

            {/* Avatar */}
            <div className="relative flex-shrink-0">
                {ping.type == 1 ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dusty-rose)] to-[#b58b7c] flex items-center justify-center text-white text-sm font-semibold">
                        pP
                    </div>
                ) :
                    ping.from.profilePhoto ? (
                        <img
                            src={ping.from.profilePhoto}
                            alt={ping.from.username[0]}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white text-sm font-semibold">
                            {ping.from.username[0]}
                        </div>
                    )}
                {!ping.read && (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--mauve-pink)]" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* title and timestamp */}
                <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${!ping.read ? 'text-[#5a4d41]' : 'text-[#7e6957]'}`}>
                        {ping.title}
                    </p>
                    <span className="text-xs text-[var(--deep-rosewood)] flex-shrink-0">
                        {formatDistanceToNow(ping.timestamp, { addSuffix: true })}
                    </span>
                </div>

                {/* preview */}
                <p
                    className="text-xs text-[#7e6957] truncate mt-0.5"
                >
                    {ping.preview}
                </p>
                {ping.metadata?.roomName && (
                    <p className="text-xs text-[#C7A875] mt-1 flex items-center gap-1">
                        <MessageSquare size={10} />
                        {ping.metadata.roomName}
                    </p>
                )}
            </div>
        </div>
    );
}

const EmailPanel: React.FC<Notification> = () => {
    return (
        <></>
    );
}
export function NotificationsPage() {
    const { pings } = useAuth();
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

    const selectedNotification = pings.find(n => n.id === selectedNotificationId);

    ///TODO: make the backend endpoint call as well
    const markAsRead = (id: string) => {
        console.log('Mark as read:', id);
    };

    ///TODO: make the backend endpoint call as well
    const markAllAsRead = () => {
        console.log('Mark all as read');
    };

    // debatable
    const deleteNotification = (id: string) => {
        console.log('Delete notification:', id);
    };

    {/*
    return (
        <div className="min-h-screen pt-16 md:pt-20">
            {/* Mobile Menu Button - Bottom Right, Circular *
    <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
    >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

    {/* Mobile Overlay *
    {
        mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileMenuOpen(false)} />
        )
    }

    {/* Left Panel - Notification List *
    <div className={`
                fixed lg:sticky top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
                bg-white/80 backdrop-blur-md
                shadow-lg
                flex flex-col
                transition-all duration-300 ease-out
                z-10
                border-r border-[#C0D4E0]/30
                w-[25rem] lg:w-66
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
        {/* Header *
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

        {/* Filter Bar *
        <div className="px-4 py-3 border-b border-[#C0D4E0]/30 flex gap-2 flex-shrink-0">
            <button className="px-3 py-1 text-xs rounded-full bg-[#E0E9F0] text-[#5a4d41]">All</button>
            <button className="px-3 py-1 text-xs rounded-full hover:bg-[#E0E9F0] text-[#7e6957] transition-colors">Unread</button>
            <button className="px-3 py-1 text-xs rounded-full hover:bg-[#E0E9F0] text-[#7e6957] transition-colors flex items-center gap-1">
                <Filter size={12} />
                Filter
            </button>
        </div>

        {/* Notification List - Scrollable *
        <div className="flex-1 overflow-y-auto">
            {pings.map((notification) => (
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
                    {/* Avatar *
                    <div className="relative flex-shrink-0">
                        {notification.from.profilePhoto ? (
                            <img
                                src={notification.from.profilePhoto}
                                alt={notification.from.username[0]}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white text-sm font-semibold">
                                {notification.from.username[0]}
                            </div>
                        )}
                        {!notification.read && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#B0C4D0]" />
                        )}
                    </div>

                    {/* Content *
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${!notification.read ? 'text-[#5a4d41]' : 'text-[#7e6957]'}`}>
                                {notification.title}
                            </p>
                            <span className="text-xs text-[#C7A875] flex-shrink-0">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </span>
                        </div>
                        <p
                            className="text-xs text-[#7e6957] truncate mt-0.5"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notification.message.substring(0, 80)) }}
                        />
                        {notification.metadata?.roomName && (
                            <p className="text-xs text-[#C7A875] mt-1 flex items-center gap-1">
                                <MessageSquare size={10} />
                                {notification.metadata.roomName}
                            </p>
                        )}
                    </div>

                    {/* Delete button *
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

        {/* Footer *
        <div className="p-4 border-t border-[#C0D4E0]/30 flex-shrink-0">
            <p className="text-xs text-center text-[#7e6957]">
                {pings.filter(n => !n.read).length} unread pings
            </p>
        </div>
    </div>

    {/* Main Content - Notification Detail View *
    <div className="lg:ml-96">
        {selectedNotification ? (
            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
                {/* Header *
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#B0C4D0] to-[#9CB0C0] flex items-center justify-center text-white text-base md:text-lg font-semibold">
                                {selectedNotification.from.username[0]}
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-serif font-semibold text-[#5a4d41]">
                                    {selectedNotification.title}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs md:text-sm text-[#7e6957]">{selectedNotification.from.username}</span>
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

                {/* Message Content *
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C0D4E0]/30 p-4 md:p-8">
                    <div className="prose prose-sm max-w-none">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#C0D4E0]/30">
                            {getNotificationIcon(selectedNotification.type)}
                            {/*
                                <span className="text-xs md:text-sm text-[#C7A875] uppercase tracking-wide">
                                    {selectedNotification.type.replace('_', ' ')}
                                </span>
                                *
                        </div>
                        <p
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNotification.message) }}
                            className="text-sm md:text-base text-[#5a4d41] leading-relaxed whitespace-pre-wrap">
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

                        {/* Action Buttons *
                        {(selectedNotification.type === 2 || selectedNotification.type === 5) && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button className="px-4 py-2 bg-gradient-to-r from-[#B0C4D0] to-[#9CB0C0] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                                    Reply
                                </button>
                                <button className="px-4 py-2 border border-[#C0D4E0] text-[#7e6957] rounded-lg text-sm hover:bg-[#E0E9F0] transition-colors">
                                    Mark as Read
                                </button>
                            </div>
                        )}

                        {selectedNotification.type === 6 && (
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button className="px-4 py-2 bg-gradient-to-r from-[#D9B48B] to-[#C7A875] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                                    Accept Invitation
                                </button>
                                <button className="px-4 py-2 border border-[#C0D4E0] text-[#7e6957] rounded-lg text-sm hover:bg-[#E0E9F0] transition-colors">
                                    Decline
                                </button>
                            </div>
                        )}

                        {selectedNotification.type === 6 && (
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
        </div >
    );
    */
    }
    return (
        <>
            <div className="grid grid-cols-12 h-full mt-[0rem]">
                {/* left panel - notifications list */}
                <div className={`
                col-span-3
                fixed lg:sticky
                bg-white/80 backdrop-blur-md
                shadow-lg
                transition-all duration-300 ease-out
                z-20
                border-r border-[#C0D4E0]/30
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                    {/* header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-[#C0D4E0]/30 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            {/* logo */}<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--dusty-rose)] to-[#b58b7c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                N
                            </div>
                            <h1 className="text-md text-[#5a4d41]">Notifications</h1>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[var(--mauve-pink)] hover:text-[#A67B45] transition-colors flex items-center gap-1"
                        >
                            <CheckCheck size={20} />
                            {
                                !isMobile ?
                                    <div className="font-bold capitalize">Mark all read</div>
                                    : null
                            }

                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="px-4 py-3 border-b border-[#C0D4E0]/30 flex gap-2 flex-shrink-0">
                        <button className="px-3 py-1 text-xs rounded-full bg-[var(--blush)] text-[#5a4d41]">All</button>
                        <button className="px-3 py-1 text-xs rounded-full hover:bg-[var(--blush)] text-[#7e6957] transition-colors">Unread</button>
                        <button className="px-3 py-1 text-xs rounded-full hover:bg-[var(--blush)] text-[#7e6957] transition-colors flex items-center gap-1">
                            <Filter size={12} />
                            Filter
                        </button>
                    </div>

                    {/* notification list - scrollable panel */}
                    {pings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((notification) => (
                        <NoticeItem
                            ping={notification}
                            selectedNotificationId={selectedNotificationId || null}
                            setSelectedNotificationId={() => setSelectedNotificationId(notification.id)}
                            markAsRead={markAsRead}
                            isMobile={isMobile}
                            setMobileMenuOpen={() => setMobileMenuOpen(mobileMenuOpen)}
                        />
                    ))}

                    {/* Footer */}
                    <div className="p-4 border-t border-[#C0D4E0]/30 flex-shrink-1">
                        <p className="text-xs text-center text-[#7e6957]">
                            {pings.filter(n => !n.read).length} unread pings
                        </p>
                    </div>
                </div>

                {/* notifications panel */}
                <section className="col-span-9 z-10">
                    {
                        !selectedNotification && <BooksLogo />
                    }
                    {/* message */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(selectedNotification?.message ?? '')
                        }}
                    />
                </section>
            </div>
        </>
    );
}

// AtSign component
const AtSign = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
);

export default NotificationsPage;