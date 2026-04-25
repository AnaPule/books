export interface CorkBoardItem {
    heading: string;
    subheading: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface CorkBoardProps {
    title?: string;
    subtitle?: string;
    items: CorkBoardItem[];
    maxPerRow?: number;
}

const pinColors = ['#c02bbe', '#6080c1', '#2c3e50', '#8e44ad', '#2980b9', '#e6226a', '#e67e22', '#27ae60'];
const bgColors = ['#fef9f0', '#f0faf3', '#f7f4ef', '#fdf5ff', '#f0f6ff', '#fff8f0', '#f5e6d3', '#e8f0fe'];
const rotations = [-3, 2.5, -2, 3, -1.5, 2, -2.5, 1.5, -1, 3.5];

// Size variations (width x height multipliers)
const sizeVariations = [
    { w: 130, h: 160 },  // normal
    { w: 145, h: 175 },  // large
    { w: 115, h: 145 },  // small
    { w: 140, h: 155 },  // wide
    { w: 125, h: 170 },  // tall
    { w: 135, h: 150 },  // medium
    { w: 120, h: 165 },  // narrow tall
    { w: 150, h: 160 },  // extra wide
];

// Random position offsets for chaotic scattering
const randomOffsets = [
    { x: -8, y: -4 }, { x: 12, y: 6 }, { x: -15, y: 10 }, { x: 8, y: -12 },
    { x: -5, y: 15 }, { x: 18, y: -8 }, { x: -20, y: -5 }, { x: 5, y: -18 },
    { x: -12, y: -10 }, { x: 10, y: 12 }, { x: -25, y: 5 }, { x: 22, y: -3 },
    { x: -3, y: 20 }, { x: 15, y: -15 }, { x: -18, y: 8 }, { x: 7, y: -22 }
];

const Board: React.FC<CorkBoardProps> = ({ title, subtitle, items, maxPerRow = 5 }) => {
    // Split items into rows
    const rows = [];
    for (let i = 0; i < items.length; i += maxPerRow) {
        rows.push(items.slice(i, i + maxPerRow));
    }

    // Calculate dynamic width based on items
    const boardWidth = Math.min(900, maxPerRow * 180 + 80);

    return (
        <div className="flex flex-col items-center">
            {(title || subtitle) && (
                <div className="flex items-end justify-between mb-5 pb-2 border-b border-[#e9e9ef] w-full max-w-[900px]">
                    <div>
                        {title && (
                            <h2 className="text-xl font-['SF_Pro_Display',_system-ui] font-semibold tracking-tight text-[#1d1d1f] hover:underline">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-xs text-[#86868b] mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Centered fixed size corkboard */}
            <div
                className="rounded-xl p-8 relative overflow-auto mx-auto"
                style={{
                    background: "url(https://i.pinimg.com/736x/b1/40/97/b1409796965522d890255cb295834291.jpg)",
                    backgroundSize: '100%',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: `${boardWidth}px`,
                    maxWidth: '90vw',
                    height: '600px',
                    position: 'relative',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                {/* Scattered items - absolutely positioned for chaos */}
                <div className="relative w-full h-full">
                    {items.map((item, i) => {
                        const rot = rotations[i % rotations.length];
                        const pin = pinColors[i % pinColors.length];
                        const bg = bgColors[i % bgColors.length];
                        const offset = randomOffsets[i % randomOffsets.length];
                        const size = sizeVariations[i % sizeVariations.length];
                        
                        // Calculate position - scattered across the board
                        const col = i % maxPerRow;
                        const row = Math.floor(i / maxPerRow);
                        const baseX = (col * (size.w + 15)) + 20;
                        const baseY = (row * (size.h + 15)) + 40;
                        
                        // Add chaos offset
                        const top = baseY + offset.y;
                        const left = baseX + offset.x;

                        return (
                            <div
                                key={i}
                                className="absolute rounded-sm cursor-pointer"
                                style={{
                                    top: `${top}px`,
                                    left: `${left}px`,
                                    width: `${size.w}px`,
                                    paddingTop: '28px',
                                    paddingBottom: '14px',
                                    background: bg,
                                    transform: `rotate(${rot}deg)`,
                                    boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, z-index 0.2s',
                                    zIndex: Math.floor(Math.random() * 10)
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.04)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 5px 12px rgba(0,0,0,0.22)';
                                    (e.currentTarget as HTMLDivElement).style.zIndex = '999';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = `rotate(${rot}deg)`;
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '2px 2px 6px rgba(0,0,0,0.18)';
                                    (e.currentTarget as HTMLDivElement).style.zIndex = `${Math.floor(Math.random() * 10)}`;
                                }}
                            >
                                {/* Crooked thumbtack */}
                                <div
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-black/15 z-10"
                                    style={{ 
                                        background: pin, 
                                        filter: 'brightness(0.7)',
                                        transform: `rotate(${(Math.random() * 60) - 30}deg)`
                                    }}
                                >
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 rounded-sm bg-black/25" />
                                </div>

                                <div className="px-3">
                                    <p className="text-xs font-semibold text-[#1d1d1f] leading-snug mb-1 line-clamp-2">{item.heading}</p>
                                    <p className="text-[10px] text-[#86868b] leading-snug mb-3 line-clamp-3">{item.subheading}</p>

                                    {item.action && (
                                        <button
                                            onClick={item.action.onClick}
                                            className="w-full text-center text-[11px] font-medium text-[#0071e3] rounded-full py-1 border border-[#0071e3]/30 transition-colors"
                                            style={{ background: 'rgba(255,255,255,0.7)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.95)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
                                        >
                                            {item.action.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Board;