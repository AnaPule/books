interface NoResultsProps {
    WarningLabel: string;
    action?: () => void;
    actionLabel?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({
    WarningLabel,
    actionLabel,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            {/* Bunny with flip animation */}
            <div className="group mb-4">
                <svg
                    width="150" height="158"
                    viewBox="0 0 220 230"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer transition-all duration-700 hover:[transform:rotateY(180deg)]"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Left ear */}
                    <path fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2.2" strokeLinejoin="round"
                        d="M78 98 C73 80, 66 54, 70 34 C72 24, 80 20, 86 25 C94 31, 93 58, 90 80 Z" />
                    <path fill="#F5D6D4"
                        d="M80 90 C76 76, 71 54, 74 37 C76 30, 81 28, 85 32 C90 38, 89 60, 86 77 Z" />
                    {/* Right ear */}
                    <path fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2.2" strokeLinejoin="round"
                        d="M118 94 C118 76, 120 50, 126 32 C130 22, 138 21, 143 27 C149 35, 144 60, 138 80 Z" />
                    <path fill="#F5D6D4"
                        d="M120 86 C120 71, 122 50, 127 35 C130 28, 136 27, 140 32 C145 39, 141 61, 136 76 Z" />
                    {/* Body */}
                    <ellipse fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2.2" cx="108" cy="168" rx="48" ry="42" />
                    {/* Belly */}
                    <ellipse fill="#FFF0EE" stroke="#F5D6D4" strokeWidth="1" cx="108" cy="172" rx="26" ry="20" />
                    {/* Head */}
                    <circle fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2.2" cx="106" cy="120" r="34" />
                    {/* Tail */}
                    <circle fill="#FCE9E8" stroke="#C98F8A" strokeWidth="1.8" cx="153" cy="170" r="10" />
                    {/* Left foot */}
                    <ellipse fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2" cx="82" cy="207" rx="20" ry="9" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="68" cy="205" rx="5" ry="4" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="78" cy="203" rx="5" ry="4" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="88" cy="203" rx="5" ry="4" />
                    {/* Right foot */}
                    <ellipse fill="#FCE9E8" stroke="#C98F8A" strokeWidth="2" cx="124" cy="207" rx="20" ry="9" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="110" cy="205" rx="5" ry="4" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="120" cy="203" rx="5" ry="4" />
                    <ellipse fill="#F5D6D4" stroke="#E8C7C5" strokeWidth="1" cx="130" cy="203" rx="5" ry="4" />
                    {/* Eyes */}
                    <circle fill="#5A4D41" cx="94" cy="116" r="4.5" />
                    <circle fill="white" cx="95.5" cy="114.2" r="1.5" />
                    <circle fill="#5A4D41" cx="118" cy="116" r="4.5" />
                    <circle fill="white" cx="119.5" cy="114.2" r="1.5" />
                    {/* Nose + mouth */}
                    <ellipse fill="#DEA8A3" cx="106" cy="127" rx="3.8" ry="2.8" />
                    <path fill="none" stroke="#C98F8A" strokeWidth="1.4" strokeLinecap="round"
                        d="M103 130 Q106 134 109 130" />
                    {/* Cheeks */}
                    <ellipse fill="#F5D6D4" opacity={0.65} cx="86" cy="124" rx="8" ry="5" />
                    <ellipse fill="#F5D6D4" opacity={0.65} cx="126" cy="124" rx="8" ry="5" />
                    {/* Whiskers */}
                    <line stroke="#C98F8A" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} x1="102" y1="126" x2="76" y2="121" />
                    <line stroke="#C98F8A" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} x1="102" y1="129" x2="76" y2="130" />
                    <line stroke="#C98F8A" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} x1="110" y1="126" x2="136" y2="121" />
                    <line stroke="#C98F8A" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} x1="110" y1="129" x2="136" y2="130" />
                    {/* Heart */}
                    <path fill="none" stroke="#C98F8A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                        d="M166 60 C166 54, 159 49, 154 55 C149 49, 142 54, 142 60 C142 67, 154 77, 154 77 C154 77, 166 67, 166 60 Z" />
                    <circle fill="#E8C7C5" cx="171" cy="68" r="2" />
                    <circle fill="#F5D6D4" cx="175" cy="74" r="1.4" />
                </svg>
            </div>

            {/* Warning message */}
            <h3 className="font-sans text-md italic md:text-xl text-[#5a4d41] mb-4 text-center max-w-md">
                {WarningLabel}
            </h3>

            {/* Optional action button */}
            {actionLabel && action && (
                <button
                    onClick={action}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#c9a394] to-[#b58b7c] text-white text-sm rounded-lg hover:from-[#b58b7c] hover:to-[#a68569] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};