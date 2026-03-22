
{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";

export const Footer: React.FC = () => {
    const { user, quote } = useAuth();
    return (
        <footer className="relative py-6">
            {/* Decorative top line */}

            {/* Main footer content */}
            <div className=" pt-2 text-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#7E6957] to-transparent" />
                {
                    user ? (
                        <>
                            <div className="mt-5 py-8 text-[#9FB89F] text-center border-t border-[#E2E9DC]">
                                <p className="text-sm italic max-w-2xl mx-auto">
                                    {quote?.quote}
                                </p>
                                <p className="text-xs mt-2">— {quote?.author}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-[#7e6957] tracking-wider font-light">
                                © 2026 Morwetsana Pule. All rights reserved.
                            </p>
                            <p className="text-[11px] text-[#c9a394] mt-2 italic font-light">
                                Built with React, TypeScript, and Tailwind CSS
                            </p>
                            <p className="text-[11px] text-[#c9a394] mt-2 italic font-light">
                                Pages ń Parchments
                            </p>
                        </>
                    )
                }
                {/* Decorative flourishes */}
                <div className="flex text-[var(--mocha)]/40 items-center justify-center gap-3">
                    <span className="text-[10px]">✧</span>
                    <span className="text-[9px] text-[var(--mocha)]/40 uppercase tracking-[0.3em]">Pages & Parchment</span>
                    <span className="text-[10px]">✧</span>
                </div>
            </div>
        </footer>
    );
};