// ===================== REACT ====================== //
import { formatDistanceToNow } from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import React, { useState, useEffect, useMemo } from 'react';

// ===================== COMPONENT ====================== //
import {
    MessageSquare,
    Menu, X, Search,
    Sparkle, MailOpen,
    Mail, Trash, Mails
} from "lucide-react";
import { Modal } from '@components/skeleton/modal';
import { highlightMatch } from '@utils/highlightMatch';
import { BooksLogo } from "@pages/auth/VerifyEmailPage";
import { NoResults } from '@components/skeleton/noResults';

// ===================== SERVICE ====================== //
import DOMPurify from 'dompurify';
import { request } from '@utils/ApiRequest';
import { useAuth } from "@context/AuthContext";

// ===================== MODEL ====================== //
import type { Notification } from '@models/Notice';

// ===================== IMAGE ====================== //
import Avatar from '@assets/avatar.jpeg';

export default function NotificationsPage() {
    const [openDeConfirm, setOpenDelConfirm] = useState<boolean>(false);
    const togglModal = () => setOpenDelConfirm(prev => !prev);

    const { pings, setPings, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
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

    const selectedNotification = useMemo(() => {
        return pings.find(n => n.id === selectedNotificationId);
    }, [pings, selectedNotificationId]);

    const filteredPings = useMemo(() => {
        // First, apply read/unread filter
        let filtered = pings;

        if (filterType === 'unread') {
            filtered = filtered.filter(p => !p.read);
        }

        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(n =>
                n.from.username.toLowerCase().includes(query) ||
                n.preview?.toLowerCase().includes(query) ||
                n.title?.toLowerCase().includes(query) ||
                n.from?.username?.toLowerCase().includes(query) ||
                n.message?.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [pings, filterType, searchQuery]);

    const NoticeStatus = async (id: string, status?: boolean) => {
        await request.put(`/auth/notice/status/${id}/${status !== undefined ? status : !pings.find(n => n.id === id)?.read}`);
        await request.get(`/auth/notice/user/${user?.id}`)
            .then(
                (res: any) => {
                    setPings(res.pings)
                }
            )
        if (status !== undefined) {
            // If a status was specified (mass update), clear the right panel
            setSelectedNotificationId(null);
        } else {
            // If no status specified (single toggle), show this notification
            setSelectedNotificationId(id);
        }
    }

    const NoticeItem: React.FC<{
        ping: Notification;
        selectedNotificationId: string | null;
        setSelectedNotificationId: (Id: string) => void;
        isMobile?: boolean;
        setMobileMenuOpen?: (open: boolean) => void;
        onDelete?: (id: string) => void;
    }> = ({
        ping,
        selectedNotificationId, setSelectedNotificationId,
        isMobile, setMobileMenuOpen,
        onDelete, }) => {
            const [swipeOffset, setSwipeOffset] = useState(0);
            const [isSwiping, setIsSwiping] = useState(false);

            const swipeHandlers = useSwipeable({
                onSwiping: (e) => {
                    setIsSwiping(true);
                    // Limit swipe distance: right max ~80px, left max ~100px
                    const offset = Math.max(-100, Math.min(80, e.deltaX));
                    setSwipeOffset(offset);
                },
                onSwiped: (e) => {
                    setIsSwiping(false);

                    const threshold = 150; // how far user must swipe to trigger action

                    if (e.deltaX > threshold) {
                        // Swiped RIGHT → Mark as read/unread
                        if (NoticeStatus) NoticeStatus(ping.id ?? "");
                    } else if (e.deltaX < -threshold) {
                        // Swiped LEFT → Delete / Archive
                        if (onDelete) onDelete(ping.id ?? "");
                    }

                    // Reset position with a nice spring feel
                    setSwipeOffset(0);
                },
                preventScrollOnSwipe: true,
                trackMouse: true, // optional: allows testing swipe with mouse on desktop
                delta: 10,        // minimum movement before swipe starts
            });

            const handleClick = (e: React.MouseEvent) => {
                // Prevent click if we were swiping significantly
                if (Math.abs(swipeOffset) > 10 || isSwiping) {
                    setSwipeOffset(0);
                    return;
                }

                setSelectedNotificationId(ping.id ?? "");
                if (isMobile && mobileMenuOpen && setMobileMenuOpen) {
                    setMobileMenuOpen(false);
                }
                NoticeStatus(ping.id ?? "");
            };

            return (
                <>
                    <Modal
                        showCloseButton={false}
                        isOpen={openDeConfirm}
                        onClose={togglModal}
                    >
                        {/* Title */}
                        <h2 className="text-[15px] font-semibold text-[#1c1c1e] text-center mb-1.5">
                            Delete Notification
                        </h2>

                        {/* Message */}
                        <p className="text-[13px] text-center text-[#3c3c43]/80 leading-snug mb-0">
                            Are you sure you want to delete this notification? This action cannot be undone.
                        </p>

                        {/* Actions — hairline divider above, split horizontally */}
                        <div className="flex mt-4 -mx-4 -mb-4 border-t border-black/10">
                            <button
                                onClick={togglModal}
                                className="flex-1 py-3 text-[17px] font-normal text-[#007aff] border-r border-black/10 hover:bg-black/5 active:bg-black/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={
                                    async () => {
                                        await request.delete(`/auth/notice/${selectedNotification?.id}`);
                                        setPings(pings.filter(n => n.id !== selectedNotification?.id));
                                        togglModal();
                                    }
                                }
                                className="flex-1 py-3 text-[17px] font-semibold text-[#ff3b30] hover:bg-black/5 active:bg-black/10 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </Modal>
                    <div
                        className="relative overflow-hidden border-b border-[#F9E2E0] group"
                        onClick={handleClick}
                    >
                        {/* Background Action Layers (revealed on swipe) */}
                        <div className="text-white absolute inset-0 flex items-center justify-between pointer-events-none">
                            {/* left ACTION (swipe right) - Mark Read/Unread */}
                            <div
                                className={`
                        absolute left-0 top-0 bottom-0 w-20 bg-[var(--dusty-rose)] flex items-center justify-center
                        transition-opacity duration-200
                        ${swipeOffset > 20 ? 'opacity-100' : 'opacity-0'}
                    `}
                            >
                                <div className="text-xs font-bold flex flex-col items-center">
                                    {ping.read ? <Mail size={16} /> : <MailOpen size={16} />}
                                    <span className="mt-0.5">
                                        {ping.read ? 'Unread' : 'Read'}
                                    </span>
                                </div>
                            </div>

                            {/* right ACTION (swipe left) - Delete */}
                            <div
                                className={`
                        absolute right-0 top-0 bottom-0 w-24 bg-[var(--dusty-rose)] flex items-center justify-center
                        transition-opacity duration-200
                        ${swipeOffset < -20 ? 'opacity-100' : 'opacity-0'}
                    `}
                            >
                                <div className="text-white text-xs font-bold flex flex-col items-center">
                                    <Trash size={18} />
                                    <span className="mt-0.5 capetalize">Delete</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Notification Content - slides with swipe */}
                        <div
                            {...swipeHandlers}
                            className={`
                    flex items-start gap-3 px-4 py-3 cursor-pointer transition-transform duration-200 ease-out
                    border-b border-[#F9E2E0] hover:bg-[#FCE9E8]/40 relative z-10 bg-white
                    ${selectedNotificationId === ping.id ? 'bg-[#E8C7C5]/15 border-l-4 border-l-[#B57A74]' : ''}
                    ${!ping.read ? 'bg-[#E8C7C5]/15' : ''}
                `}
                            style={{
                                transform: `translateX(${swipeOffset}px)`,
                            }}
                        >
                            {/* Avatar + Content - same as before */}
                            <div className="relative flex-shrink-0">
                                {ping.type === 1 ? (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dusty-rose)] to-[#b58b7c] flex items-center justify-center text-white text-sm font-semibold">
                                        pP
                                    </div>
                                ) : ping.from.profilePhoto ? (
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

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-sm font-medium truncate ${!ping.read ? 'text-[#5a4d41]' : 'text-[#7e6957]'}`}>
                                        {highlightMatch(ping.title, searchQuery)}
                                    </p>
                                    <span className="text-xs text-[var(--deep-rosewood)] flex-shrink-0">
                                        {formatDistanceToNow(ping.timestamp, { addSuffix: true })}
                                    </span>
                                </div>

                                <p className="text-xs text-[#7e6957] truncate mt-0.5">
                                    {highlightMatch(ping.preview, searchQuery)}
                                </p>
                                {ping.metadata?.roomName && (
                                    <p className="text-xs text-[#C7A875] mt-1 flex items-center gap-1">
                                        <MessageSquare size={10} />
                                        {ping.metadata.roomName}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>

            );
        }

    const markAllAsRead = () => {
        for (const p of pings) {
            NoticeStatus(p.id ?? "", true);
        }
    };

    const deleteNotification = async (id: string) => {
        togglModal();
        //await request.delete(`/auth/notice/${id}`);
        //setPings(pings.filter(n => n.id !== id));
    };

    return (
        <>
            <div className="w-screen pt-16 md:pt-20">
                {/* Mobile Menu Button - Bottom Right, Circular */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--dusty-rose)] to-[#b58b7c] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Overlay - covers whole screen, notifications panel sits on top */}
                {mobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </div>

            {
                isMobile && !mobileMenuOpen && (
                    <section className='pt-12 text-center'>
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#f5f0e8]/50 backdrop-blur-sm">
                            <Sparkle size={12} className="text-[#c9a394]" />
                            <span className="font-serif text-sm text-[#7e6957] tracking-wider">Notifications</span>
                            <Sparkle size={12} className="text-[#c9a394]" />
                        </div>
                    </section>
                )
            }

            <div className="grid grid-cols-12 min-h-screen">
                {/* left panel - notifications list */}
                <div className={`
                sm:col-span-3 lg:col-span-2
                fixed lg:sticky
                top-0 left-0
                h-screen
                bg-white/95 backdrop-blur-md
                shadow-xl lg:shadow-lg
                transition-all duration-300 ease-out
                z-50 overflow-hidden
                border-r border-[#C0D4E0]/30
                w-[80vw] sm:w-[80vw] max-w-[320px]
                flex flex-col
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                    {/* header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-[#C0D4E0]/30 flex-shrink-0 bg-white/95 backdrop-blur-md z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--dusty-rose)] to-[#b58b7c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                N
                            </div>
                            <h1 className="text-md text-[#5a4d41]">Notifications</h1>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[var(--mauve-pink)] hover:text-[#A67B45] transition-colors flex items-center gap-1"
                        >
                            <Mails size={20} />
                            {!isMobile && <div className="font-bold capitalize">Mark all read</div>}
                        </button>
                    </div>

                    <div className="px-4 py-3 border-b border-[#C0D4E0]/30 flex items-center gap-2 flex-shrink-0 bg-white/95 backdrop-blur-md">
                        {/* All filter */}
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${filterType === 'all'
                                ? 'bg-[var(--blush)] text-[#5a4d41]'
                                : 'hover:bg-[var(--blush)] text-[#7e6957]'
                                }`}
                        >
                            All
                        </button>

                        {/* Unread filter */}
                        <button
                            onClick={() => setFilterType('unread')}
                            className={`px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1 ${filterType === 'unread'
                                ? 'bg-[var(--blush)] text-[#5a4d41]'
                                : 'hover:bg-[var(--blush)] text-[#7e6957]'
                                }`}
                        >
                            Unread
                            {pings.filter(n => !n.read).length > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#c9a394] text-white">
                                    {pings.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>

                        {/* Search bar - pushed to the right with ml-auto */}
                        <div className="relative flex-1 ml-auto max-w-[180px]">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7e6957]" />
                            <input
                                type="text"
                                maxLength={20}
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-md border-b border-[var(--blush)] bg-white/50 text-[#5a4d41] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[var(--blush)] transition-colors pr-[2rem]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    <X size={10} className="text-[#7e6957] hover:text-[#c9a394]" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* notification list - scrollable panel */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredPings.length == 0 && (
                            <NoResults
                                WarningLabel='You have no mail dearest'
                            />
                        )}

                        {...filteredPings
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((notification) => (
                                <NoticeItem
                                    key={notification.id}
                                    ping={notification}
                                    selectedNotificationId={selectedNotificationId || null}
                                    setSelectedNotificationId={() => setSelectedNotificationId(notification.id ?? "")}
                                    isMobile={isMobile}
                                    setMobileMenuOpen={() => setMobileMenuOpen(mobileMenuOpen)}
                                    onDelete={deleteNotification}
                                />
                            ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#C0D4E0]/30 bg-white/95 backdrop-blur-md mt-auto">
                        <p className="text-xs text-center text-[#7e6957]">
                            {pings.filter(n => !n.read).length} unread ping(s)
                        </p>
                    </div>
                </div>

                {/* right panel - notification content */}
                <section className="col-span-12 lg:col-span-10 lg:col-start-4 min-h-screen z-10">
                    {!selectedNotification && <BooksLogo />}
                    {selectedNotification && (
                        <div className="pl-6">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(selectedNotification?.message ?? '')
                                }}
                            />
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}