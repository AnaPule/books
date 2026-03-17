import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { request } from '@utils/ApiRequest';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Password requirements
    const requirements = [
        { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
        { id: 'uppercase', label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
        { id: 'lowercase', label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
        { id: 'number', label: 'One number', test: (p: string) => /[0-9]/.test(p) },
        { id: 'special', label: 'One special character', test: (p: string) => /[!@#$%^&*]/.test(p) },
    ];

    const [fulfilled, setFulfilled] = useState<boolean[]>(new Array(requirements.length).fill(false));

    useEffect(() => {
        const newFulfilled = requirements.map(req => req.test(password));
        setFulfilled(newFulfilled);
    }, [password]);

    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const allRequirementsMet = fulfilled.every(Boolean);
    const isValid = allRequirementsMet && passwordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        try {
            await request.post('/auth/password-reset', { password, token });
            setSubmitted(true);
            toast.success('Password reset successfully', {
                description: 'You can now log in with your new password.'
            });
            setTimeout(() => navigate('/auth'), 3000);
        } catch (error: any) {
            toast.error('Reset failed', {
                description: error?.response?.data?.message || 'Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf5ea]">
                <div className="text-center p-8 bg-[#fcf9f4] rounded-2xl border border-[#e8cfc5]/50 max-w-md">
                    <h1 className="text-2xl font-sans text-[#5a4d41] mb-4">Invalid Reset Link</h1>
                    <p className="text-[#7e6957] mb-6">This password reset link is invalid or has expired.</p>
                    <button onClick={() => navigate('/auth')} className="btn-primary">
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#faf5ea]/80">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#f5d6d4]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e8cfc5]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Corner flourishes */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#8d6c45]/20" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#8d6c45]/20" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#8d6c45]/20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#8d6c45]/20" />

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-[#fcf9f4]/90 backdrop-blur-sm rounded-2xl border border-[#e8cfc5]/50 shadow-[0_20px_40px_-15px_rgba(139,111,76,0.25)] p-8 md:p-10">

                    {/* Decorative line */}
                    <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mb-6" />

                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl md:text-3xl font-sans text-[#5a4d41] tracking-[0.15em] uppercase mb-3">
                                    Reset Password
                                </h1>
                                <p className="text-[#7e6957] text-sm font-light">
                                    Choose a new password for your sanctuary
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Password field */}
                                <div>
                                    <div className="input-container">
                                        <button type="button">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="input-img" strokeWidth="1.6">
                                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="password"
                                            placeholder="New password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Password requirements list */}
                                    <div className="mt-3 space-y-2 pl-2">
                                        {requirements.map((req, index) => (
                                            <div key={req.id} className="flex items-center gap-2 text-sm">
                                                <span className={`text-lg ${fulfilled[index] ? 'text-[#8d6c45]' : 'text-[#c9b296]'}`}>
                                                    {fulfilled[index] ? '✓' : '○'}
                                                </span>
                                                <span className={fulfilled[index] ? 'text-[#5a4d41]' : 'text-[#b8a58f]'}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Confirm password field */}
                                <div>
                                    <div className="input-container">
                                        <button type="button">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="input-img" strokeWidth="1.6">
                                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="password"
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Match indicator */}
                                    {confirmPassword && (
                                        <div className="mt-2 flex items-center gap-2 text-sm pl-2">
                                            <span className={`text-lg ${passwordsMatch ? 'text-[#8d6c45]' : 'text-[#e8b0a0]'}`}>
                                                {passwordsMatch ? '✓' : '○'}
                                            </span>
                                            <span className={passwordsMatch ? 'text-[#5a4d41]' : 'text-[#b8a58f]'}>
                                                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading || !isValid}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-[#8d6c45] to-[#a68569] text-[#fcf9f4] font-sans uppercase tracking-[0.15em] text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>

                                {/* Back to login */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/auth')}
                                        className="text-[#8d6c45] text-sm hover:underline transition-all"
                                    >
                                        ← Back to login
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Success state */
                        <div className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#e8cfc5]/30 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8d6c45" strokeWidth="1.5">
                                    <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-sans text-[#5a4d41]">Password Reset</h2>
                            <p className="text-[#7e6957]">
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                        </div>
                    )}

                    {/* Decorative line */}
                    <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8d6c45] to-transparent mx-auto mt-6" />
                </div>
            </div>
        </div>
    );
}