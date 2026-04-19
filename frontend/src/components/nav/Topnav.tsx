
{/* =============== services ============ */ }
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

import { Bell } from 'lucide-react';
import Avatar from '@assets/avatar.jpeg';

export const Topnav: React.FC = () => {
    const { user, pings, isLoggedIn } = useAuth();
    const messages = pings.filter(n => n.read == false).length;
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
                                className="flex items-center gap-1">
                                <div className="relative">
                                    <img
                                        src={user?.profilePhoto ?? "https://i.pinimg.com/1200x/90/06/53/9006532d34eafa61b2bb2510beebd30f.jpg"}
                                        alt="Profile"
                                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#B0C4D0]/30 hover:ring-[#c9a394] transition-all cursor-pointer"
                                    />
                                    {
                                        messages > 0 &&
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--olive-mist)] rounded-full border border-white" />
                                    }

                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};