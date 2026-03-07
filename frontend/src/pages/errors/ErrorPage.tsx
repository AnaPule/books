import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface ErrorPageProps {
    statusCode: number;
    CodeTitle: string;
    Description: string;
    Image?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    statusCode,
    CodeTitle,
    Description
}: ErrorPageProps) => {

    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoHome = () => {
        navigate("/");
    };

    const handleGoSupport = () => {
        navigate("/support");
    };

    // Literary quotes for different error codes
    const getQuote = () => {
        const quotes = [
            "“The page you seek does not exist in this story.”",
            "“Even the oldest libraries lose a page now and then.”",
            "“Some paths lead to unwritten chapters.”",
            "“Not all who wander are lost... but you might be.”",
            "“This passage has been sealed by time.”",
            "“The manuscript is missing this folio.”"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    return (
        <div className="min-h-screen bg-[#0b0702] text-[#d2b48c] font-sans relative overflow-hidden">
            {/* Vintage paper texture overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjczNTUiLz48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0iI2Q0Yjg4YSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay" />
            
            {/* Vignette effect */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />
            
            {/* Additional vignette layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
                    mixBlendMode: 'multiply',
                    zIndex: 2,
                }}
            />

            <main className="relative z-10 grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Decorative element */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4b88a] to-transparent" />
                    </div>
                    
                    {/* Status code with vintage styling */}
                    <p className="text-sm font-light tracking-[0.3em] text-[#c4a07c] mb-4 uppercase">
                        {statusCode} • ERROR
                    </p>
                    
                    {/* Main title with book-like styling */}
                    <h1 className={`
                        text-7xl md:text-8xl font-serif text-[#f0e0c0] mb-6 tracking-wide
                        transition-all duration-1000 transform
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}>
                        {CodeTitle}
                    </h1>
                    
                    {/* Decorative divider */}
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="w-12 h-px bg-[#8b7355]/30" />
                        <span className="text-[#8b7355] text-xs">✧</span>
                        <div className="w-12 h-px bg-[#8b7355]/30" />
                    </div>
                    
                    {/* Description */}
                    <p className="text-lg md:text-xl text-[#d2b48c] font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        {Description}
                    </p>
                    
                    {/* Literary quote */}
                    <div className="mb-12 p-6 border border-white/10 rounded-lg bg-[#1a0f05]/30 backdrop-blur-sm">
                        <p className="text-[#c4a07c] italic text-sm">
                            {getQuote()}
                        </p>
                        <p className="text-[#8b7355] text-xs mt-2">
                            — From the Library of Lost Pages
                        </p>
                    </div>
                    
                    {/* Action buttons - restyled to match theme */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <button
                            onClick={handleGoHome}
                            className="group relative px-8 py-3 bg-[#8b7355] text-[#f0e0c0] border border-[#d4b88a] text-sm hover:bg-[#6b5436] transition-all duration-300 uppercase tracking-wider min-w-[180px] overflow-hidden"
                        >
                            <span className="relative z-10">Return Home</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                        
                        <button
                            onClick={handleGoSupport}
                            className="group relative px-8 py-3 bg-transparent text-[#d4b88a] border border-[#d4b88a] text-sm hover:bg-[#d4b88a]/10 transition-all duration-300 uppercase tracking-wider min-w-[180px] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Seek Guidance
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                    </div>
                    
                    {/* Subtle navigation hint */}
                    <div onClick={() => navigate(-1)} className="mt-12 text-[#8b7355] text-xs flex items-center justify-center gap-2">
                        <span><ArrowLeft /></span>
                        <span className="tracking-wider">RETURN TO KNOWN PATHS</span>
                    </div>
                    
                    {/* Decorative page corners - moved down by increasing top/bottom values */}
                    <div className="absolute top-40 left-10 w-20 h-20 border-l-2 border-t-2 border-[#d4b88a]/20 pointer-events-none hidden lg:block" />
                    <div className="absolute bottom-40 right-10 w-20 h-20 border-r-2 border-b-2 border-[#d4b88a]/20 pointer-events-none hidden lg:block" />
                </div>
            </main>
            
            {/* Floating book pages effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0702] to-transparent pointer-events-none z-20" />
        </div>
    );
};

export default ErrorPage;