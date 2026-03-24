import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    children?: React.ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'top',
    delay = 200
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    let timeout: ReturnType<typeof setTimeout> | null = null;

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            switch (position) {
                case 'top':
                    top = triggerRect.top - tooltipRect.height - 8;
                    left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'bottom':
                    top = triggerRect.bottom + 8;
                    left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                    left = triggerRect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                    left = triggerRect.right + 8;
                    break;
            }

            // Clamp to viewport
            const padding = 8;
            left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
            top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

            setCoords({ top, left });
        }
    }, [isVisible, position]);

    const showTooltip = () => {
        timeout = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeout) clearTimeout(timeout);
        setIsVisible(false);
    };

    if (!content) return <>{children}</>;

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        zIndex: 9999,
                    }}
                    className="
                        bg-gradient-to-br from-[#5a4d41] to-[#3a3329]
                        text-[#fcf9f4] text-xs rounded-lg py-2 px-3 shadow-lg
                        border border-[#c9a394]/60 max-w-[200px]
                        whitespace-normal break-words pointer-events-none
                        animate-fade-in
                    "
                >
                    {content}
                    <div
                        className="absolute w-2 h-2 bg-[#5a4d41] transform rotate-45 border border-[#c9a394]/60"
                        style={{
                            [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left']: '-4px',
                            [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            borderTop: position === 'bottom' ? 'none' : undefined,
                            borderBottom: position === 'top' ? 'none' : undefined,
                            borderLeft: position === 'right' ? 'none' : undefined,
                            borderRight: position === 'left' ? 'none' : undefined,
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default Tooltip;