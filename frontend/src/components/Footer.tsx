export const Footer: React.FC = () => {
    return (
        <footer className="relative pb-6 border-t border-[#e8cfc5]/40 bg-[#faf5ea]">
            {/* Decorative top line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c9a394] to-transparent" />
            
            {/* Main footer content */}
            <div className=" pt-8 text-center">
                <p className="text-xs text-[#7e6957] tracking-wider font-light">
                    © 2026 Morwetsana Pule. All rights reserved.
                </p>
                <p className="text-[11px] text-[#c9a394] mt-2 italic font-light">
                    Built with React, TypeScript, and Tailwind CSS
                </p>
                <p className="text-[11px] text-[#c9a394] mt-2 italic font-light">
                    Pages ń Parchments
                </p>
                
                {/* Decorative flourishes */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <span className="text-[10px] text-[#e8cfc5]">✧</span>
                    <span className="text-[9px] text-[#c9a394]/40 uppercase tracking-[0.3em]">Pages & Parchment</span>
                    <span className="text-[10px] text-[#e8cfc5]">✧</span>
                </div>
            </div>
        </footer>
    );
};