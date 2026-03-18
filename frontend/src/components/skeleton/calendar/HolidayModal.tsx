
import { Modal } from '@components/skeleton/modal';
import { Calendar, Globe, BookOpen, Sparkles } from 'lucide-react';

interface Holiday {
    name: string;
    date: string;
    type: 'reading' | 'christian';
    description: string;
    origins: string;
    traditions: string;
    funFact?: string;
}

interface HolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    holiday: Holiday | null;
}

const HolidayModal: React.FC<HolidayModalProps> = ({ isOpen, onClose, holiday }) => {
    if (!holiday) return null;

    const typeConfig = {
        reading: {
            emoji: '📚',
            label: 'Reading & Literature',
            badgeClass: 'bg-[#c9a394]/20 text-[#8d6c45]',
            accentClass: 'text-[#c9a394]',
        },
        christian: {
            emoji: '✝️',
            label: 'Christian',
            badgeClass: 'bg-[#e8bfb0]/30 text-[#b58b7c]',
            accentClass: 'text-[#d9b6a8]',
        },
    };

    const config = typeConfig[holiday.type];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={holiday.name}>
            <div className="space-y-4">

                {/* Date + type badge */}
                <div className="flex items-center justify-between pb-3 border-b border-[#e8bfb0]/30">
                    <div className="flex items-center gap-2 text-sm text-[#7e6957]">
                        <Calendar size={14} className="text-[#c9a394]" />
                        <span>{holiday.date}</span>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${config.badgeClass}`}>
                        {config.emoji} {config.label}
                    </span>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-xs font-semibold text-[#5a4d41] mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                        <BookOpen size={13} className="text-[#c9a394]" />
                        About this Day
                    </h3>
                    <p className="text-xs text-[#7e6957] leading-relaxed">{holiday.description}</p>
                </div>

                {/* Origins */}
                <div>
                    <h3 className="text-xs font-semibold text-[#5a4d41] mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                        <Globe size={13} className="text-[#c9a394]" />
                        Origins
                    </h3>
                    <p className="text-xs text-[#7e6957] leading-relaxed">{holiday.origins}</p>
                </div>

                {/* Traditions */}
                <div>
                    <h3 className="text-xs font-semibold text-[#5a4d41] mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles size={13} className="text-[#c9a394]" />
                        Traditions
                    </h3>
                    <p className="text-xs text-[#7e6957] leading-relaxed">{holiday.traditions}</p>
                </div>

                {/* Fun fact */}
                <div className="p-3 bg-[#f5d6d4]/20 rounded-xl border border-[#e8bfb0]/40">
                    <p className="text-[11px] text-[#c9a394] italic leading-relaxed">
                        {holiday.funFact
                            ? `✨ ${holiday.funFact}`
                            : `"Every holiday carries a story waiting to be read."`}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default HolidayModal;