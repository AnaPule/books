export interface CorkBoardItem {
    heading: string;
    subheading: string;
    action: {
        label: string;
        onClick: () => void;
    };
}

interface CorkBoardProps {
    title?: string;
    subtitle?: string;
    items: CorkBoardItem[];
}

const pinColors  = ['#c02bbe', '#6080c1', '#2c3e50', '#8e44ad', '#2980b9', '#e6226a'];
const bgColors   = ['#fef9f0', '#f0faf3', '#f7f4ef', '#fdf5ff', '#f0f6ff', '#fff8f0'];
const rotations  = [-2, 1.5, -1, 2, -1.5, 1];

const Board: React.FC<CorkBoardProps> = ({ title, subtitle, items }) => {
    return (
        <div>
            {(title || subtitle) && (
                <div className="flex items-end justify-between mb-5 pb-2 border-b border-[#e9e9ef]">
                    <div>
                        {title && (
                            <h2 className="text-xl font-['SF_Pro_Display',_system-ui] font-semibold tracking-tight text-[#1d1d1f]">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-xs text-[#86868b] mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}

            <div
                className="rounded-xl p-5 flex flex-wrap gap-5"
                style={{ 
                    background: "url(https://i.pinimg.com/736x/da/f3/f8/daf3f841052acf0028a821ad97880b38.jpg)",
                     backgroundSize: 'cover', backgroundPosition: 'center',
                }}
            >
                {items.map((item, i) => {
                    const rot = rotations[i % rotations.length];
                    const pin = pinColors[i % pinColors.length];
                    const bg  = bgColors[i % bgColors.length];

                    return (
                        <div
                            key={i}
                            className="relative w-[130px] pt-7 px-3 pb-3.5 rounded-sm cursor-pointer"
                            style={{
                                background: bg,
                                transform: `rotate(${rot}deg)`,
                                boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.04)';
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 5px 12px rgba(0,0,0,0.22)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.transform = `rotate(${rot}deg)`;
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '2px 2px 6px rgba(0,0,0,0.18)';
                            }}
                        >
                            {/* Thumbtack */}
                            <div
                                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-black/15 z-10"
                                style={{ background: pin, filter: 'brightness(0.7)' }}
                            >
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 rounded-sm bg-black/25" />
                            </div>

                            <p className="text-xs font-semibold text-[#1d1d1f] leading-snug mb-1">{item.heading}</p>
                            <p className="text-[10px] text-[#86868b] leading-snug mb-3">{item.subheading}</p>

                            <button
                                onClick={item.action.onClick}
                                className="w-full text-center text-[11px] font-medium text-[#0071e3] rounded-full py-1 border border-[#0071e3]/30 transition-colors"
                                style={{ background: 'rgba(255,255,255,0.7)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.95)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
                            >
                                {item.action.label}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Board;