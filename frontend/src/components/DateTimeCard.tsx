import { Heart } from "lucide-react";

export const DateTimeCard: React.FC = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return (
        <div className=" h-[10rem] bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">
            <p className="text-[10px] md:text-xs text-[#d9b6a8] mb-2 md:mb-3 flex items-center gap-1">
                <Heart size={10} className="text-[#c9a394]" /> 02 41 PM · SAT
            </p>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl md:text-4xl font-serif text-[#5a4d41]">{hours}</span>
                <span className="text-xl md:text-2xl text-[#d9b6a8] font-light">:</span>
                <span className="text-3xl md:text-4xl font-serif text-[#5a4d41]">{minutes}</span>
            </div>
            <p className="text-[10px] md:text-xs text-[#7e6957] text-center mt-1 md:mt-2">TUESDAY</p>
        </div>
    );
};