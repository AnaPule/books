export const Shelves: React.FC = () => {
    const readingBooks = [
        { title: "The Midnight\nLibrary", w: 65, h: 90, bg: "#F0D9D4", textColor: "#5A3A3A", progress: 35 },
        { title: "The Art of\nThinking", w: 68, h: 90, bg: "#D4C0B8", textColor: "#3A2A2A", progress: 60 },
        { title: "Strategic\nWriting", w: 64, h: 90, bg: "#F5E0D8", textColor: "#2A2A2A", progress: 20 },
    ];

    const nextUpBooks = [
        { title: "Lietuvos\nPaukščiai", w: 62, h: 88, bg: "#E8D0C8", textColor: "#2A4A5A" },
        { title: "The Lord of\nthe Rings", w: 64, h: 88, bg: "#C0A8A0", textColor: "#F0E0C0" },
        { title: "Around the\nWorld", w: 62, h: 88, bg: "#F0D0A8", textColor: "#5A3A10" },
    ];

    const finishedBooks = [
        { title: "Steve Jobs", w: 62, h: 86, bg: "#E8E0D8", textColor: "#1A1A1A" },
        { title: "Profesionalas", w: 64, h: 86, bg: "#F0E0D0", textColor: "#3A2A1A" },
        { title: "One Year\nin a Ring", w: 62, h: 86, bg: "#C0D0D8", textColor: "#1A2A3A" },
    ];

    type Book = {
        title: string;
        w: number;
        h: number;
        bg: string;
        textColor: string;
        progress?: number;
    };

    function BookCover({ book }: { book: Book }) {
        const { w, h, bg, textColor, title, progress } = book;
        const lines = title.split("\n");
        const mid = h / 2;

        return (
            <div className="flex flex-col items-center" style={{ width: w }}>
                <div
                    className="rounded-sm overflow-hidden"
                    style={{ width: w, height: h, boxShadow: "2px 3px 12px rgba(181,139,124,0.25)", flexShrink: 0 }}
                >
                    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                        <rect width={w} height={h} fill={bg} rx={2} />
                        <text x={w / 2} y={mid} textAnchor="middle" fontSize={8} fill={textColor} fontFamily="Georgia,serif">
                            {lines.map((line, i) => (
                                <tspan key={i} x={w / 2} dy={i === 0 ? 0 : 10}>{line}</tspan>
                            ))}
                        </text>
                        <rect x={0} y={0} width={3} height={h} fill="rgba(0,0,0,0.08)" />
                    </svg>
                </div>
                {progress !== undefined && (
                    <div className="mt-1 rounded-sm overflow-hidden" style={{ width: w - 10, height: 3, background: "#F0D9D4" }}>
                        <div style={{ width: `${progress}%`, height: "100%", background: "#D9B6A8" }} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#FAF0E8] rounded-2xl border border-[#E8BFB0] p-4 md:p-6 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)] overflow-x-auto">
            <div className="min-w-[600px] md:min-w-0">
                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Currently reading</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {readingBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Next up</span>
                        <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {nextUpBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>

                <div>
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-xs md:text-sm text-[#5C4F40] font-serif">Finished</span>
                        <span className="text-[10px] md:text-xs text-[#D9B6A8]">Full shelf →</span>
                    </div>
                    <div className="flex gap-4 items-end pb-3">
                        {finishedBooks.map((book, i) => <BookCover key={i} book={book} />)}
                    </div>
                    <div className="h-1 bg-gradient-to-b from-[#F0D9D4] to-[#E8C0B8] rounded" />
                </div>
            </div>
        </div>
    );
};