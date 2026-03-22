{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

{/* =============== models ============ */ }
import { type tokenResponse, type loginResponse, type User } from '@models/User';

{/* =============== services ============ */ }
import { request } from '@utils/ApiRequest';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner/spinner';
import { Modal } from '@components/skeleton/modal';
import { Resubscribe } from '@pages/profile/Subscription';
import ForgotPasswordPage from '@pages/auth/ResetPasswordPage';

interface LoginFormProps {
    OnChangePage: () => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface ForgotFormData {
    email: string;
    password: string;
    token: string;
}

export default function LoginForm({ OnChangePage }: LoginFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isResubscribeOpen, setResubscribeOpen] = useState<boolean>(false);
    const handleResubscribe = () => { setResubscribeOpen((prev) => !prev) }

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [ForgotFormData, setForgotFormData] = useState<ForgotFormData>({
        token: '',
        password: '',
        email: '',
    });

    const handleChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleForgotChange = ((field: keyof ForgotFormData, value: string) => {
        setForgotFormData((prev) => ({ ...prev, [field]: value }));
    })

    const handleResendVerification = async () => {
        setLoading(true);
        if (!formData.email || formData.email == '') {
            toast.error('Email Required', { description: 'Please enter your email' });
        }
        const dto = {
            email: formData.email,
            password: '',
            token: ''
        }
        await request.post<String>(`/auth/sendVerificationEmail`, dto)
            .then(
                ((res: String) => {
                    toast.info('Email Sent', { description: res });
                })
            ).catch(
                (error: any) => {
                    toast.warning('Error Sending your token', { description: 'We do apologise for the inconvenience. There was a problem sending your verification email.' })
                    console.error(error.message)
                }
            ).finally(
                () => {
                    setLoading(false);
                }
            )
    }

    const handleSubmitLogin = async (e: FormEvent) => {
        const now = new Date();
        e.preventDefault();
        setLoading(true);

        try {
            await request.post("/auth/login", formData)
                .then(((res: any) => {
                    if (!res.token) {
                        const errorMsg = typeof res === 'string' ? res : res?.message;
                        toast.error('Pages ń Parchments', {
                            description: errorMsg || "Invalid Credentials: Please enter the correct credentials"
                        })

                        if (errorMsg?.includes('unsubscribed')) {
                            handleResubscribe();
                        }
                    } else {
                        const cleanToken = res.token.trim();
                        sessionStorage.setItem('token', cleanToken);
                        sessionStorage.setItem('lastLoginTime', now.toDateString())
                        request.setAuthToken(cleanToken);

                        const decoded = jwtDecode<tokenResponse>(cleanToken);

                        toast.success('Pages ń Parchments',
                            { description: `Welcome back ${decoded.username || decoded.sub || "reader"}!` }
                        );
                        navigate("/profile", { replace: true });

                        setFormData({ email: "", password: "" });
                    }
                }))
        } catch (err: any) {
            toast.error("Login failed", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForgot = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await request.post<String>("/auth/forgot-password", ForgotFormData)
            .then(
                ((res: any) => {
                    setSubmitted(true);
                    toast.info(`Password Reset`, { description: res.message })
                })
            ).catch(
                (error: any) => {
                    toast.error(`Failed Password Reset`, { description: error.message })
                }
            ).finally(
                () => {
                    setLoading(false);
                }
            )
    };

    const ForgotPasswordForm = () => {
        return (
            <div className="relative flex items-center justify-center overflow-hidden">

                {/* Main card */}
                <div className="relative z-10 w-full max-w-md mx-4">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <p className="text-[#7e6957] text-sm font-light">
                            {!submitted
                                ? "Enter your email and we'll send you a reset link."
                                : "Check your inbox for the reset link."}
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={(e) => handleSubmitForgot(e)} className="space-y-6">
                            {/* Email input */}
                            <div className="input-container">
                                <button type="button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="input-img" strokeWidth="1.6">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </button>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={ForgotFormData.email}
                                    onChange={(e) => handleForgotChange('email', e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
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
                    ) : (
                        /* Success state */
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#e8cfc5]/30 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8d6c45" strokeWidth="1.5">
                                    <path d="M22 2L11 13M22 2l-7 16-4-6M22 2L6 9" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <p className="text-[#5a4d41] text-sm">
                                We've sent a reset link to <span className="font-medium">{ForgotFormData.email}</span>
                            </p>

                            <button
                                onClick={() => navigate('/auth')}
                                className="text-[#8d6c45] text-sm hover:underline transition-all block w-full"
                            >
                                Return to login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <Resubscribe
                isOpen={isResubscribeOpen}
                onClose={() => handleResubscribe()}
                email={formData.email} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Forgot password"
            >
                <ForgotPasswordForm />
            </Modal>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(18px, 3.5vw, 26px)",
                    padding: '0',
                    overflow: 'scroll'
                }}
                onSubmit={handleSubmitLogin}
            >
                <h3
                    style={{
                        fontSize: 'clamp(10px, 2vw, 72px)',
                        fontWeight: '300',
                        textAlign: 'center',
                        margin: '0',
                    }}
                >
                    Pages ń Parchments <br />
                    <section
                        style={{
                            fontSize: 'clamp(10px, 3vw, 72px)',
                            fontWeight: '400',
                        }}
                    >
                        Sign In
                    </section>

                </h3>
                <div className="space-y-4">
                    <button
                        type="button"
                        className="
      w-full flex items-center justify-center gap-3
      border border-[#c9b296]/40
      py-3.5 px-6
      text-[#e8e0d5] uppercase tracking-[0.18em] text-sm font-light
      hover:bg-[#c9b296]/10 hover:border-[#d4c0a8]/70
      transition-all duration-300
    "
                    >
                        <img
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                            alt="Google"
                            className="h-5 opacity-80"
                        />
                    </button>

                    <button
                        type="button"
                        className="
      w-full flex items-center justify-center gap-3
      border border-[#c9b296]/40
      py-3.5 px-6
      text-[#e8e0d5] uppercase tracking-[0.18em] text-sm font-light
      hover:bg-[#c9b296]/10 hover:border-[#d4c0a8]/70
      transition-all duration-300
    "
                    >
                        <img
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/instagram.svg"
                            alt="Instagram"
                            className="h-5 opacity-80 invert"  // ← invert to make it light on dark
                        />
                    </button>
                </div>

                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#c9b296]/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-6 text-[#b8a58f] uppercase tracking-[0.25em] text-xs bg-[#faf5ea]">
                            or
                        </span>
                    </div>
                </div>
                {/* Email */}
                <div className='input-container'>
                    <button>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className='input-img' strokeWidth="1.6">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </button>

                    <input
                        type="email"
                        autoComplete='on'
                        autoFocus
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                    />
                </div>

                {/* Password */}
                <div
                    className='input-container'
                >
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0" }}
                    >
                        {showPassword ?
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className='input-img' strokeWidth="1.6">
                                <path d="M17 11V7a5 5 0 0 0-9.9-1" />
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                            </svg> :
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className='input-img' strokeWidth="1.6">
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                            </svg>
                        }
                    </button>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                    />
                </div>

                <div style={{ textAlign: "right", marginTop: "-8px" }}>
                    <a
                        href="#"
                        style={{
                            color: "#a68569",
                            fontSize: "0.96rem",
                            textDecoration: "none",
                            opacity: 0.9,
                        }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Forgot password?
                    </a>
                </div>
                <div
                    onClick={() => handleResendVerification()}
                    style={{ textAlign: "right", marginTop: "-8px" }}>
                    <a
                        style={{
                            color: "#a68569",
                            fontSize: "0.96rem",
                            textDecoration: "none",
                            opacity: 0.9,
                        }}
                    >
                        Resend Account Verification!
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className='btn-primary'
                >
                    {loading ? <Spinner loadingLabel='loading' /> : "Sign In"}
                </button>

                <div style={{ textAlign: "center", marginTop: "-8px" }}>
                    <a
                        href="#"
                        style={{
                            color: "#a68569",
                            fontSize: "0.96rem",
                            textDecoration: "none",
                            opacity: 0.9,
                            cursor: 'pointer',
                        }}
                        onClick={() => OnChangePage()}
                    >
                        Dont have an account? Sign up.
                    </a>
                </div>
            </form>
        </>

    );
}