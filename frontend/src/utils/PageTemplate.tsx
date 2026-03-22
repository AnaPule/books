
{/* =============== components ============ */ }
import Sidebar from "@components/nav/bar";
import { Footer } from "@components/Footer";
import { Topnav } from "@components/nav/Topnav";

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";
interface TemplateProps {
    children: any;
}

export const PageTemplate: React.FC<TemplateProps> = ({ children }: TemplateProps) => {
    const { isLoggedIn } = useAuth();
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Topnav />
            {
                isLoggedIn &&
                <Sidebar />
            }
            <div className="col-start-1 col-end-1"> {/* line breaker for side bar */}

            </div>
            {/* main content */}
            <div className="flex-1 overflow-y-auto w-screen">
                {children}
                <Footer />
            </div>
        </div>
    );
}