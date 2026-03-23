
import type { JSX } from "react/jsx-runtime";

export function highlightMatch(
    text: string | undefined,
    searchTerm: string
): JSX.Element | string {
    if (!searchTerm || !text) return text || "";
    
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, "gi");
    const parts = text.split(regex);
    
    return (
        <>
            {parts.map((part, idx) => 
                part.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <span key={idx} className="text-[#9FB89F] font-semibold">{part}</span>
                ) : (
                    <span key={idx}>{part}</span>
                )
            )}
        </>
    );
}