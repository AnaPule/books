{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

{/* =============== services ============ */ }
import { request } from '@utils/ApiRequest';

{/* =============== components ============ */ }
import styles from './book.module.css';

{/* =============== images ============ */ }
import Picture3 from "@assets/flower.jpeg";
import Picture1 from "@assets/bouqet.jpeg";
import Picture2 from "@assets/Flower_6.jpeg";

export default function ResubscribePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [resubscribed, setResubscribed] = useState<boolean>(false);
    const token = searchParams.get('token');
    //const email = searchParams.get('email');

    const PageTurner: React.FC = () => {
        const Pictures = [Picture1, Picture2, Picture3];
        return (
            <div className={styles.library}>
                <div className={`${styles.book} ${resubscribed ? styles.bookToSpine : ''}`}>
                    <span className={styles.cover}></span>
                    <span className={`${styles.cover} ${!resubscribed ? styles.turn : styles.close}`}></span>

                    {Array.from({ length: 16 }).map((_, i) => (
                        <span
                            key={i}
                            className={`${styles.page} ${resubscribed ? styles.close : styles.turn}`}
                            style={{ '--target-rotate': i < 3 ? '180deg' : i < 6 ? '150deg' : i < 9 ? '55deg' : '30deg' } as React.CSSProperties}
                        ></span>
                    ))}

                    <span className={styles.cover}></span>
                </div>

                {resubscribed && (
                    <div className="flex items-end">
                        <div className={`${styles.libraryBook} ${styles.libraryBook1}`} />
                        <div className={`${styles.libraryBook} ${styles.libraryBook2}`} />
                        <div className={`${styles.libraryBook} ${styles.libraryBook3} ${styles.slideIn}`} />
                    </div>
                )}

                {resubscribed && (
                    <>
                        <div className={styles.shelf} />
                        <div style={{ backgroundImage: `url(${Pictures[Math.floor(Math.random() * Pictures.length)]})` }} className={styles.frame} />
                    </>
                )}

            </div>
        );
    };

    useEffect(() => {
        const resubscribe = async () => {
            // Wait 60 seconds before making the API call
            await new Promise(resolve => setTimeout(resolve, 30000));
            try {
                const res = await request.put<any>(`/auth/activate/${token}`);

                setResubscribed(res.active);
                if (res.message) {
                    toast.success('Welcome Back!', { description: res.message });
                }

                setTimeout(() => navigate('/auth'), 10000);

            } catch (err: any) {
                toast.error('Resubscription failed', {
                    description: err?.response?.data?.message || err.message || "The invitation could not be honoured."
                });
                setTimeout(() => navigate('/auth'), 10000);
            }
        };

        if (token) {
            resubscribe();
        } else {
            toast.error("No token found in the link.");
            navigate('/auth');
        }

    }, [token, navigate]);

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#faf5ea]/75">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e8cfc5]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Corner flourishes */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#8d6c45]/20" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#8d6c45]/20" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#8d6c45]/20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#8d6c45]/20" />

            {/* Main card */}
            <div className="relative z-10 text-center p-8 md:p-12 bg-[#fcf9f4]/90 backdrop-blur-sm rounded-2xl border border-[#e8cfc5]/50 shadow-[0_20px_40px_-15px_rgba(139,111,76,0.25)] max-w-lg mx-4">
                {/* Decorative line */}
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mb-6" />

                <h1 className="text-2xl md:text-3xl font-sans text-[#5a4d41] mb-4 tracking-[0.15em] uppercase">
                    {!resubscribed ? 'Pages ń Parchments' : 'Dearest Gentle Reader'}
                </h1>

                <p className="text-[#7e6957] mb-8 font-light italic text-sm md:text-base">
                    {!resubscribed
                        ? "Your quiet fellowship is preparing your return..."
                        : "Your reading castle awaits"}
                </p>

                {/* Centered Book */}
                <div className="flex justify-center items-center">
                    <PageTurner />
                </div>

                {/* Success Message */}
                {resubscribed && (
                    <div className="mb-6 animate-fadeIn">
                        <div className="bg-[#fceae8] p-4 rounded-lg border border-[#e8bfb0]">
                            <p className="text-sm text-[#7e6957] leading-relaxed">
                                Your library, bookmarks, and communities have been restored.
                                The quiet fellowship welcomes you home.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading Dots */}
                {!resubscribed ? (
                    <div className="flex justify-center gap-2 my-4">
                        <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : (
                    <p className="text-xs text-[#c9a394] italic mb-4">
                        Redirecting you to the fellowship...
                    </p>
                )}

                {/* Decorative line */}
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mt-6" />
            </div>
        </div>
    );
}