import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

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

    // Literary quotes for different error codes with whimsical touch
    const getQuote = () => {
        const quotes = [
            "“The page you seek does not exist in this story.”",
            "“Even the oldest libraries lose a page now and then.”",
            "“Some paths lead to unwritten chapters.”",
            "“Not all who wander are lost... but you might be.”",
            "“This passage has been sealed by time.”",
            "“The manuscript is missing this folio.”",
            "“A book without this page is still a book worth reading.”",
            "“Perhaps this chapter was never meant to be found.”"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf5ea] to-[#fceae8] text-[#5a4d41] font-sans relative overflow-hidden">
            {/* Dusty pink decorative blurs */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#f5d6d4]/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#e8bfb0]/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="fixed top-1/3 left-1/4 w-48 h-48 bg-[#fceae8]/40 rounded-full blur-3xl" />
            
            {/* Vintage paper texture overlay - lighter */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjczNTUiLz48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0iI2Q0Yjg4YSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay" />
            
            {/* Soft vignette - warm pink instead of dark */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(250, 240, 235, 0.6) 0%, rgba(245, 225, 220, 0.3) 45%, rgba(240, 215, 210, 0.2) 70%, rgba(235, 205, 200, 0.25) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            <main className="relative z-10 grid min-h-full place-items-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Decorative element with pink gradient */}
                    <div className="mb-6 sm:mb-8 flex justify-center">
                        <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c9a394] to-transparent" />
                    </div>
                    
                    {/* Status code with pink */}
                    <p className="text-xs sm:text-sm font-light tracking-[0.3em] text-[#c9a394] mb-3 sm:mb-4 uppercase flex items-center justify-center gap-2">
                        <Sparkles size={14} className="text-[#d9b6a8]" />
                        {statusCode} • ERROR
                        <Sparkles size={14} className="text-[#d9b6a8]" />
                    </p>
                    
                    {/* Main title */}
                    <h1 className={`
                        text-6xl sm:text-7xl md:text-8xl font-serif text-[#5a4d41] mb-4 sm:mb-6 tracking-wide
                        transition-all duration-1000 transform
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}>
                        {CodeTitle}
                    </h1>
                    
                    {/* Decorative divider with pink */}
                    <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="w-8 sm:w-12 h-px bg-[#e8bfb0]/50" />
                        <BookOpen size={16} className="text-[#c9a394]" />
                        <div className="w-8 sm:w-12 h-px bg-[#e8bfb0]/50" />
                    </div>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-[#7e6957] font-light leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                        {Description}
                    </p>
                    
                    {/* Literary quote with pink accents */}
                    <div className="mb-8 sm:mb-12 p-4 sm:p-6 border border-[#e8bfb0]/30 rounded-lg bg-white/30 backdrop-blur-sm mx-2">
                        <p className="text-[#7e6957] italic text-xs sm:text-sm">
                            {getQuote()}
                        </p>
                        <p className="text-[#c9a394] text-[10px] sm:text-xs mt-2">
                            — From the Library of Lost Pages
                        </p>
                    </div>
                    
                    {/* Action buttons - pink themed */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                        <button
                            onClick={handleGoHome}
                            className="group relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] text-white text-xs sm:text-sm rounded-lg hover:from-[#b58b7c] hover:to-[#c9a394] transition-all duration-300 uppercase tracking-wider min-w-[160px] shadow-md"
                        >
                            <span className="relative z-10">Return Home</span>
                        </button>
                        
                        <button
                            onClick={handleGoSupport}
                            className="group relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent text-[#c9a394] border border-[#c9a394] text-xs sm:text-sm rounded-lg hover:bg-[#f5d6d4]/20 transition-all duration-300 uppercase tracking-wider min-w-[160px]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Seek Guidance
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                    </div>
                    
                    {/* Subtle navigation hint */}
                    <div 
                        onClick={() => navigate(-1)} 
                        className="mt-8 sm:mt-12 text-[#c9a394] text-[10px] sm:text-xs flex items-center justify-center gap-2 cursor-pointer hover:text-[#b58b7c] transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span className="tracking-wider">RETURN TO KNOWN PATHS</span>
                    </div>
                    
                    {/* Decorative page corners - pink */}
                    <div className="absolute top-20 left-4 lg:top-40 lg:left-10 w-12 h-12 lg:w-20 lg:h-20 border-l-2 border-t-2 border-[#c9a394]/20 pointer-events-none hidden sm:block" />
                    <div className="absolute bottom-20 right-4 lg:bottom-40 lg:right-10 w-12 h-12 lg:w-20 lg:h-20 border-r-2 border-b-2 border-[#c9a394]/20 pointer-events-none hidden sm:block" />
                </div>
            </main>
            
            {/* Floating book pages effect - pink gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#fceae8] to-transparent pointer-events-none z-20" />
        </div>
    );
};

export default ErrorPage;