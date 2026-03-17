import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error("No verification token found in the link.");
      navigate('/auth');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`, { method: 'GET' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        toast.success(data.message || "Your email has been graciously verified. Welcome among us.");
        navigate('/auth'); // or '/login' or '/profile'
      } catch (err: any) {
        toast.error(err.message || "The invitation could not be honoured.");
        navigate('/auth');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b120e] to-[#2f1e0f] text-[#e8e0d5]">
      <div className="text-center p-12 bg-[#11100e]/80 backdrop-blur-lg rounded-2xl border border-[#7b5f48]/40 shadow-2xl max-w-lg">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">Verifying Your Invitation</h1>
        <p className="text-[#d4c0a8] mb-8">Please wait a moment while we confirm your place among the quiet fellowship...</p>
        <div className="animate-pulse h-2 w-32 bg-[#a68569]/40 rounded mx-auto"></div>
      </div>
    </div>
  );
}