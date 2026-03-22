
{/* =============== services ============ */ }
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

import { Bell } from 'lucide-react';

export const Topnav: React.FC = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    return (
        <div
            className='
            font-sans absolute z-20 
            bg-[var(--off-white)]/95 h-auto min-h-[60px] w-full
            flex items-center justify-center sm:justify-end
            px-4 sm:px-6 md:px-10 py-3 sm:py-0
            flex-wrap gap-2 sm:gap-6 md:gap-10
            uppercase text-[#5a4d41]
            tracking-[1px] sm:tracking-[2px]
            text-sm sm:text-base
            backdrop-blur-sm
            font-medium
            border-b border-[#c9b296]/30
            '
        >
            <button
                className='hover:underline transition-colors duration-300 whitespace-nowrap'
                onClick={() => navigate(isLoggedIn ? '/books' : '/home#home')}
            >
                Home
            </button>
            {
                !isLoggedIn ? (
                    <>
                        <a
                            className='hover:text-[#8d6c45] transition-colors duration-300 whitespace-nowrap'
                            href="/home#about"
                        >
                            About
                        </a>
                        <a
                            className='hover:text-[#8d6c45] transition-colors duration-300 whitespace-nowrap'
                            href="/home#features"
                        >
                            Features
                        </a>
                        <a
                            className='hover:text-[#8d6c45] transition-colors duration-300 whitespace-nowrap'
                            onClick={() => navigate("/auth")}
                        >
                            Account
                        </a>

                    </>) : (
                    <>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                            <div
                                onClick={() => navigate('/profile')}
                                className="flex gap-2 items-center cursor-pointer hover:underline"
                            >
                                <img
                                    src={user?.profilePhoto || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"}
                                    alt={user?.username}
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#c9a394]/30"
                                />
                                <span className="font-medium text-[#5a4d41] hidden sm:block">{user?.username}</span>
                            </div>


                            <button className="border-none bg-transparent p-2 hover:scale-110 transition-all duration-300">
                                <Bell size={20} className="text-[#c9a394] hover:text-[#8d6c45]" />
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    );
};