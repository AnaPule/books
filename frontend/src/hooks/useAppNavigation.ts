// @hooks/useAppNavigation.ts
import { useNavigate } from 'react-router-dom';

export const useAppNavigation = () => {
    const navigate = useNavigate();

    const goToBook = (bookId: string) => {
        navigate(`/book/${bookId}`);
    };

    const goToBooks = () => {
        navigate('/books');
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    const goToAuth = () => {
        navigate('/auth');
    };

    const goToHome = () => {
        navigate('/home');
    };

    const goToDiscover = () => {
        navigate('/discover');
    };

    const goBack = () => {
        navigate(-1);
    };

    return {
        goToBook,
        goToBooks,
        goToProfile,
        goToAuth,
        goToHome,
        goToDiscover,
        goBack,
        navigate, // fallback to raw navigate if needed
    };
};