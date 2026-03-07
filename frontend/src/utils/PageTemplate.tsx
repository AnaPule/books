
{/* =============== components ============ */ }
import Sidebar from "@components/nav/bar";
import { Topnav } from "@pages/home/home";

{/* =============== services ============ */ }
import { useAuth } from "@context/AuthContext";
interface TemplateProps {
    children: any;
}

export const PageTemplate: React.FC<TemplateProps> = ({ children }: TemplateProps) => {
    const { isLoggedIn } = useAuth();
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {
                isLoggedIn &&
                <Topnav /> &&
                <Sidebar />
            }
            <div className="col-start-1 col-end-1">

            </div>
            {/* main content */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}