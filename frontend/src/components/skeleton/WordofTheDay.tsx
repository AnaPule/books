
{/* =============== images ============ */ }
import Flower_0 from '@assets/bouqet.jpeg';
import Flower_1 from '@assets/Flower_1.jpeg';
import Flower_2 from '@assets/Flower_2.jpeg';
import Flower_3 from '@assets/Flower_3.jpeg';
import Flower_4 from '@assets/Flower_4.jpeg';
import Flower_5 from '@assets/Flower_5.jpeg';
import Flower_6 from '@assets/Flower_6.jpeg';
import Flower_7 from '@assets/Flower_7.jpeg';
import Flower_8 from '@assets/Flower_8.jpeg';

{/* =============== packages ============ */ }
import { useState, useEffect } from "react";
import {Sparkles} from 'lucide-react';


{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";

export const WordOfTheDay: React.FC = () => {
    const { word } = useAuth();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousImageIndex, setPreviousImageIndex] = useState(0);
    const flowerImages = [Flower_0, Flower_1, Flower_2, Flower_3, Flower_4, Flower_5, Flower_6, Flower_7, Flower_8];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setPreviousImageIndex(activeImageIndex);
            setActiveImageIndex((prev) => (prev + 1) % flowerImages.length);
            setTimeout(() => setIsTransitioning(false), 1000);
        }, 600000);
        return () => clearInterval(interval);
    }, [activeImageIndex]);

    return (
        <div className=" rounded-2xl border border-[#e8bfb0] p-4 md:p-5 relative overflow-hidden min-h-[180px] md:min-h-[220px]">
            {/* Background Images - Reduced opacity significantly */}
            <img
                src={flowerImages[previousImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{
                    filter: 'blur(3px) brightness(0.8)'
                }}
            />
            <img
                src={flowerImages[activeImageIndex]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{
                    filter: 'blur(3px) brightness(0.6)'
                }}
            />

            <div className="relative z-10 text-center text-[var(--latte)]">
                <p className="text-[10px] md:text-md tracking-wider mb-1 md:mb-2 flex items-center gap-1 font-semibold">
                    <Sparkles size={10} /> WORD OF THE DAY
                </p>
                <h3 className="text-2xl md:text-3xl font-serif mb-0.5 md:mb-1 font-bold">
                    {word?.word || "Sonder"}
                </h3>
                <p className="text-[10px] md:text-xs italic mb-2 md:mb-3 font-medium">
                    {word?.phonetic && word?.meanings?.[0]?.partsOfSpeech
                        ? `${word.phonetic} — ${word.meanings[0].partsOfSpeech}`
                        : "/sɒn.dər/ — noun"}
                </p>
                <p className="text-sm md:text-sm leading-relaxed font-medium">
                    {word?.meanings?.[0]?.definitions?.[0]?.definition ||
                        "the realization that every passerby has a life as vivid and complex as your own."}
                </p>
            </div>
        </div>
    );
};