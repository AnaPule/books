{/* =============== models ============ */ }
import type { Book as Bk } from "@models/Book";

interface ShelvesProps {
    shelf1: Bk[];
    shelf1Caption: string;
    shelf2?: Bk[] | null;
    shelf2Caption?: string;
    shelf3?: Bk[] | null;
    shelf3Caption?: string;
}

interface BookCoverProps {
    title: string;
    w?: number;
    h?: number;
    progress?: number;
    variant?: 'default' | 'small' | 'large';
}

export const Shelves: React.FC<ShelvesProps> = ({
    shelf1,
    shelf1Caption,
    shelf2 = null,
    shelf2Caption = "",
    shelf3 = null,
    shelf3Caption = ""
}) => {
    const colorPalette = [
        { bg: '#f5e6d7', text: '#5a4d41' },
        { bg: '#f0ddd5', text: '#5a4d41' },
        { bg: '#f2e0d8', text: '#7e6957' },
        { bg: '#edd9d0', text: '#5a4d41' },
        { bg: '#e8d5cc', text: '#7e6957' },
        { bg: '#f5e0d9', text: '#5a4d41' },
        { bg: '#fcf9f4', text: '#8d6c45' },
        { bg: '#fceae8', text: '#5a4d41' },
        { bg: '#f5d6d4', text: '#685035' },
    ];

    const getRandomColorSet = () => {
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    };

    const DEFAULT_WIDTH = 72;
    const DEFAULT_HEIGHT = 104;

    const BookCover: React.FC<BookCoverProps> = ({
        title,
        w = DEFAULT_WIDTH,
        h = DEFAULT_HEIGHT,
        variant = 'default'
    }) => {
        const colorSet = getRandomColorSet();
        
        let width = w;
        let height = h;
        
        if (variant === 'small') {
            width = Math.floor(w * 0.85);
            height = Math.floor(h * 0.85);
        } else if (variant === 'large') {
            width = Math.floor(w * 1.15);
            height = Math.floor(h * 1.15);
        }

        const lines = title.split("\n");
        const mid = height / 2;
        const fontSize = Math.max(6, Math.min(10, Math.floor(width / 8)));

        return (
            <div className="flex flex-col items-center" style={{ width }}>
                <div
                    className="rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ width, height, boxShadow: "2px 3px 12px rgba(181,139,124,0.25)", flexShrink: 0 }}
                >
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                        <rect width={width} height={height} fill={colorSet.bg} rx={2} />
                        <text 
                            x={width / 2} 
                            y={mid} 
                            textAnchor="middle" 
                            fontSize={fontSize} 
                            fill={colorSet.text}
                            fontFamily="Georgia, serif"
                        >
                            {lines.map((line, i) => (
                                <tspan key={i} x={width / 2} dy={i === 0 ? 0 : 10}>{line}</tspan>
                            ))}
                        </text>
                        <rect x={0} y={0} width={3} height={height} fill="rgba(90, 77, 65, 0.2)" />
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#FAF0E8] rounded-2xl border border-[#E8BFB0] p-4 md:p-6 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)] overflow-x-auto">
            <div className="min-w-[600px] md:min-w-0">
                {/* Shelf 1 */}
                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">{shelf1Caption}</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {shelf1.slice(0, 3).map((book, i) => (
                            <BookCover key={i} title={book.name} />
                        ))}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>

                {/* Shelf 2 - Only render if shelf2 exists and has books */}
                {shelf2 && shelf2.length > 0 && (
                    <div className="mb-6">
                        <div className="flex justify-between items-baseline mb-3">
                            <span className="text-xs md:text-sm text-[#5C4F40] font-serif">{shelf2Caption || "Next Up"}</span>
                            <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                        </div>
                        <div className="flex gap-4 items-end pb-3">
                            {shelf2.slice(0, 3).map((book, i) => (
                                <BookCover key={i} title={book.name} />
                            ))}
                        </div>
                        <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                    </div>
                )}

                {/* Shelf 3 - Only render if shelf3 exists and has books */}
                {shelf3 && shelf3.length > 0 && (
                    <div>
                        <div className="flex justify-between items-baseline mb-3">
                            <span className="text-xs md:text-sm text-[#5C4F40] font-serif">{shelf3Caption || "Finished"}</span>
                            <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                        </div>
                        <div className="flex gap-4 items-end pb-3">
                            {shelf3.slice(0, 3).map((book, i) => (
                                <BookCover key={i} title={book.name} />
                            ))}
                        </div>
                        <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                    </div>
                )}
            </div>
        </div>
    );
};