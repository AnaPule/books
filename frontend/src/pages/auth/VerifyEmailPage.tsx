
{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

{/* =============== services ============ */ }
import { request } from '@utils/ApiRequest';

{/* =============== components ============ */ }
import styles from './book.module.css';

{/* =============== images ============ */ }
import Picture3 from"@assets/flower.jpeg";
import Picture1 from "@assets/bouqet.jpeg";
import Picture2 from"@assets/Flower_6.jpeg";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState<boolean>(true);
  const token = searchParams.get('token');

  const PageTurner: React.FC = () => {
        const Pictures = [Picture1, Picture2, Picture3];
        return (
            <div className={styles.library}>
                <div className={`${styles.book} ${verified ? styles.bookToSpine : ''}`}>
                    <span className={styles.cover}></span>
                    <span className={`${styles.cover} ${!verified ? styles.turn : styles.close}`}></span>

                    {Array.from({ length: 16 }).map((_, i) => (
                        <span
                            key={i}
                            className={`${styles.page} ${verified ? styles.close : styles.turn}`}
                            style={{ '--target-rotate': i < 3 ? '180deg' : i < 6 ? '150deg' : i < 9 ? '55deg' : '30deg' } as React.CSSProperties}
                        ></span>
                    ))}

                    <span className={styles.cover}></span>
                </div>

                {verified && (
                    <div className="flex items-end">
                        <div className={`${styles.libraryBook} ${styles.libraryBook1}`} />
                        <div className={`${styles.libraryBook} ${styles.libraryBook2}`} />
                        <div className={`${styles.libraryBook} ${styles.libraryBook3} ${styles.slideIn}`} />
                    </div>
                )}

                {verified && (
                    <>
                        <div className={styles.shelf} />
                        <div style={{backgroundImage: `url(${Pictures[Math.floor(Math.random() * Pictures.length)]})`}} className={styles.frame} />
                    </>
                )}

            </div>
        );
    };

  useEffect(() => {
    const verify = async () => {

      try {
        await request.get<String>(`/auth/verify?token=${token}`)
          .then(((res: any) => {
            setVerified(res.verified);
            if (res.message && !res.message.includes('Invalid or expired')) {
              toast.info('Verification Status', { description: res.message })
            } else {
              navigate('/auth');
              toast.error('Verification failed',{description: 'You are too late. Please try again!'})
            }
          }))
        setTimeout(() => navigate('/auth'), 60000);
        
      } catch (err: any) {
        alert(err.message)
        toast.error(err.message || "The invitation could not be honoured.");
        navigate('/auth');
      }
    };

    if (token) {
      verify();
    } else {
      toast.error("No verification token found in the link.");
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
      <div className="relative z-10 text-center p-12 bg-[#fcf9f4]/90 backdrop-blur-sm rounded-2xl border border-[#e8cfc5]/50 shadow-[0_20px_40px_-15px_rgba(139,111,76,0.25)] max-w-lg mx-4">
        {/* Decorative line */}
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mb-8" />

        <h1 className="text-3xl md:text-4xl font-sans text-[#5a4d41] mb-6 tracking-[0.15em] uppercase">
          {!verified ? 'Verifying Your Invitation' : 'Email Verified'}
        </h1>

        <p className="text-[#7e6957] mb-10 font-light italic">
          {!verified ?
            "Please wait a moment while we confirm your place among the quiet fellowship..." :
            "Pages ń Parchment"}
        </p>

        {/* Animated book/parchment element */}

        <div className='flex flex-row lg:flex-col items-center'>
          <PageTurner />
          {verified ? <div className={styles.welcomeContainer}>
            <h2 className="text-2xl font-sans text-[#5a4d41] mb-2">Welcome</h2>
            <p className="text-[#7e6957] text-sm">to Pages & Parchment</p>
          </div> : null}
          {/*
          <div className="absolute inset-0 border-2 border-[#8d6c45]/30 rounded-sm animate-pulse" />
          <div className="absolute inset-2 border border-[#e8cfc5] rounded-sm animate-pulse delay-75" />
          <div className="absolute inset-4 border border-[#8d6c45]/20 rounded-sm animate-pulse delay-150" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-[#8d6c45]/40" />
          */}
        </div>

        {!verified ?
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#8d6c45]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div> : <></>
        }

        {/* Decorative line */}
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mt-8" />
      </div>
    </div>
  );
}