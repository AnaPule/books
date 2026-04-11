
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode,
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true
}: ModalProps) => {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-[#fcf9f4]/85 rounded-2xl border border-[#e8cfc5]/50 shadow-[0_20px_40px_-15px_rgba(139,111,76,0.3)] max-w-lg w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative top line 
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mt-4" />
                */}
                
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center capitalize justify-between p-6 pb-2">
                        {title && (
                            <h2 className="text-xl font-sans text-[#5a4d41] tracking-[0.1em] uppercase">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-[#8d6c45] hover:text-[#5a4d41] transition-colors"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 pt-6">
                    {children}
                </div>

                {/* Decorative bottom line 
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mb-4" />
                */}
            </div>
        </div>,
        document.body
    );
}