{/* =============== components ============ */ }
import { Search, ChevronRight, Sparkles, BookOpen, Users, Clock, Star, Filter } from "lucide-react";

{/* =============== services ============ */ }
import { useState } from "react";
import { useTabs } from "@context/TabsContext";

// Tabs.tsx
interface TabsProps {
    tabs: {
        label: string,
        icon?: React.ReactNode;
        content: React.ReactNode,
    }[];
    activeTab?: number;
    onTabChange?: (index: number) => void;
}

export default function Tabs({ tabs, activeTab: externalActiveTab, onTabChange }: TabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(0);
    
    // Use external state if provided, otherwise use internal
    const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
    
    const handleTabChange = (index: number) => {
        if (onTabChange) {
            onTabChange(index);
        } else {
            setInternalActiveTab(index);
        }
    };

    return (
        <>
            <div className="flex flex-wrap justify-center gap-2 mb-9">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleTabChange(idx)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
                            activeTab === idx
                                ? "bg-[#9FB89F] text-[#FFFCF7] shadow-md"
                                : "bg-[#FFFCF7] text-[#7E6957] hover:bg-[#E2E9DC] border border-[#E2E9DC]"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{tabs[activeTab]?.content}</div>
        </>
    );
}