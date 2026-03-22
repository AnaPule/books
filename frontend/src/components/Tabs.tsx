{/* =============== components ============ */ }
import { Search, ChevronRight, Sparkles, BookOpen, Users, Clock, Star, Filter } from "lucide-react";

{/* =============== services ============ */ }
import { useTabs } from "@context/TabsContext";

interface TabsProps {
    tabs: {
        label: string,
        icon: React.ReactNode;
        content: React.ReactNode,
    }[] | [],
}

// Tabs.tsx
interface TabsProps {
    tabs: {
        label: string,
        icon: React.ReactNode; // Change from ComponentType to ReactNode
        content: React.ReactNode,
    }[] | [],
}

export default function Tabs({ tabs }: TabsProps) {
    const { setDiscoverTab, DiscoverTab } = useTabs();

    return (
        <>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {tabs.map((tab, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setDiscoverTab(idx)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${DiscoverTab === idx
                            ? "bg-[#9FB89F] text-[#FFFCF7] shadow-md"
                            : "bg-[#FFFCF7] text-[#7E6957] hover:bg-[#E2E9DC] border border-[#E2E9DC]"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{tabs[DiscoverTab]?.content}</div>
        </>
    );
}