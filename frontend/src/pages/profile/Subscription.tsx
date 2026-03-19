{/* =============== packages ============ */ }
import { toast } from "sonner";
import { useState } from "react";
import { BookOpen, AlertTriangle, HeartCrack, Mail, RefreshCw, X, Heart } from "lucide-react";

{/* =============== components ============ */ }
import { Modal } from "@components/skeleton/modal";
import { Button } from "@components/skeleton/button";

{/* =============== services ============ */ }
import { request } from "@utils/ApiRequest";
import { useAuth } from "@context/AuthContext";

interface UnsubscribeProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ResubscribeProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

export const Unsubscribe: React.FC<UnsubscribeProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const handleUnsubscribe = async () => {
        await request.put<any>(`/auth/deactivate/${user?.id}`)
            .then(
                (res: any) => {
                    logout();
                    toast.warning('Pages ń Parchments', { description: res.message })
                }
            )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Pages & Parchment"
        >
            <div className="text-center space-y-6">
                {/* Decorative element */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5d6d4] to-[#e8bfb0] flex items-center justify-center">
                        <HeartCrack size={28} className="text-[#8d6c45]" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="text-2xl font-serif text-[#5a4d41]">
                        Dearest {user?.username || 'Gentle Reader'},
                    </h3>

                    <div className="bg-[#fceae8] p-4 rounded-lg border border-[#e8bfb0]">
                        <p className="text-sm text-[#7e6957] leading-relaxed">
                            Are you utterly sure you wish to unsubscribe from your dearest reading castle?
                            The quiet fellowship would miss you dearly.
                        </p>
                    </div>

                    <p className="text-xs text-[#c9a394] italic flex items-center justify-center gap-1">
                        <AlertTriangle size={12} />
                        This action cannot be undone
                    </p>
                </div>

                {/* Button Group */}
                <div className="btn-group pt-2">
                    <Button type='button' variant='primary' label='Confirm' Icon={HeartCrack} action={() => handleUnsubscribe()} />
                    <Button type='button' variant='secondary' label='Return' Icon={BookOpen} action={onClose} />
                </div>

                {/* Decorative footer */}
                <p className="text-[10px] text-[#d9b6a8] italic">
                    "Parting is such sweet sorrow..."
                </p>
            </div>
        </Modal>
    );
};

export const Resubscribe: React.FC<ResubscribeProps> = ({ isOpen, onClose, email }) => {
    const [loading, setLoading] = useState(false);

    const handleResubscribe = async () => {
        setLoading(true);
        try {
            const res = await request.post<any>(`/auth/resubscribe/${email}`);
            toast.success('Pages & Parchment', {
                description: res.message
            });
            onClose();
        } catch (error: any) {
            toast.error('Something went wrong', {
                description: error?.message || 'Please try again later'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pages & Parchment">
            <div className="text-center space-y-4 sm:space-y-6 px-2 sm:px-0">
                {/* Decorative element - smaller on mobile */}
                <div className="flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#f5d6d4] to-[#e8bfb0] flex items-center justify-center">
                        <Heart size={20} className="sm:size-[28px] text-[#8d6c45]" />
                    </div>
                </div>

                {/* Content - responsive text */}
                <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl font-serif text-[#5a4d41]">
                        Welcome Back, Dear Reader
                    </h3>

                    <div className="bg-[#fceae8] p-3 sm:p-4 rounded-lg border border-[#e8bfb0]">
                        <p className="text-xs sm:text-sm text-[#7e6957] leading-relaxed flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 break-all px-2">
                            <Mail size={12} className="sm:size-[16px] text-[#c9a394] flex-shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{email}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-[#7e6957] leading-relaxed px-2">
                            The quiet fellowship has missed you. Would you like to rejoin our literary sanctuary?
                        </p>
                    </div>

                    <p className="text-[10px] sm:text-xs text-[#c9a394] italic flex items-center justify-center gap-1 px-2">
                        <RefreshCw size={10} className="sm:size-[12px]" />
                        Your library and community await
                    </p>
                </div>

                {/* Button Group - stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-2 px-2">
                    <button
                        onClick={handleResubscribe}
                        disabled={loading}
                        className="w-full sm:flex-1 py-2.5 sm:py-2.5 bg-gradient-to-r from-[#8d6c45] to-[#a68569] text-white text-xs sm:text-sm rounded-lg hover:from-[#5a4d41] hover:to-[#7e6957] transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Heart size={14} className="sm:size-[16px]" />
                        {loading ? 'Welcoming...' : 'Resubscribe'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:flex-1 py-2.5 sm:py-2.5 border border-[#e8bfb0] text-[#5a4d41] text-xs sm:text-sm rounded-lg hover:bg-[#f5e6d7] transition flex items-center justify-center gap-2"
                    >
                        <BookOpen size={14} className="sm:size-[16px]" />
                        Maybe Later
                    </button>
                </div>

                {/* Decorative footer */}
                <p className="text-[8px] sm:text-[10px] text-[#d9b6a8] italic px-2">
                    "The page was never turned, only bookmarked."
                </p>
            </div>
        </Modal>
    );
};