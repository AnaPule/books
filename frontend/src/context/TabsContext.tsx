{/* =============== packages ============ */ }
import { useState, createContext, useContext, type ReactNode } from 'react';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner/spinner';

interface TabsContextType {
    DiscoverTab: number;
    setDiscoverTab: (idx: number) => void;
    loading: boolean;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProviderProps {
    children: ReactNode;
}

export const TabProvider = ({ children }: TabsProviderProps) => {
    const [DiscoverTab, setDiscoverTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <TabsContext.Provider value={{
            DiscoverTab,
            setDiscoverTab,
            loading
        }}>
            {loading ? (
                <div className='flex items-center justify-center h-screen'>
                    <Spinner loadingLabel="Please Wait" />
                </div>
            ) : (
                <>{children}</>
            )}
        </TabsContext.Provider>
    );
}

export const useTabs = (): TabsContextType => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabs must be within a TabsProvider");
    }
    return context;
}