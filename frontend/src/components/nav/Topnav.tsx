
{/* =============== services ============ */ }
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export const Topnav: React.FC = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    return (
        <div
            className='
            font-sans absolute z-20 
            bg-[#f2e8da]/95 h-auto min-h-[60px] w-full
            flex items-center justify-center sm:justify-end
            px-4 sm:px-6 md:px-10 py-3 sm:py-0
            flex-wrap gap-4 sm:gap-6 md:gap-10
            uppercase text-[#5a4d41]
            tracking-[1px] sm:tracking-[2px]
            text-sm sm:text-base
            backdrop-blur-sm
            border-b border-[#c9b296]/30
            '
        >
            <a
                className='hover:text-[#8d6c45] transition-colors duration-300 whitespace-nowrap'
                href={isLoggedIn ? '/books' : '/home#home'}
            >
                Home
            </a>
            {
                !isLoggedIn &&
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
                </>
            }
            <a
                className='hover:text-[#8d6c45] transition-colors duration-300 whitespace-nowrap'
                onClick={isLoggedIn ? () => { navigate('/profile') } : () => { navigate("/auth") }}
            >
                Account
            </a>
        </div>
    );
};