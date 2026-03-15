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
import Spinner from '@components/skeleton/spinner';

interface LoginFormProps {
    OnChangePage: () => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginForm({ OnChangePage }: LoginFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const handleChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await request.post<loginResponse>("/auth/login", formData);

            if (!res?.token?.trim()) {
                toast.error("Login failed", { description: "No valid token received" });
                return;
            }

            const cleanToken = res.token.trim();
            sessionStorage.setItem('token', cleanToken);
            request.setAuthToken(cleanToken);

            const decoded = jwtDecode<tokenResponse>(cleanToken);

            toast.success(`Welcome back ${decoded.username || decoded.sub || "reader"}!`);

            navigate("/profile", { replace: true });

            setFormData({ email: "", password: "" });
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Invalid credentials or server error";
            toast.error("Login failed", { description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(18px, 3.5vw, 26px)",
            }}
            onSubmit={handleSubmitLogin}
        >
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
                    <span className="px-6 text-[#b8a58f] uppercase tracking-[0.25em] text-xs">
                        or
                    </span>
                </div>
            </div>
            {/* Email */}
            <div className='input-container'>
                <button>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </button>

                <input
                    type="email"
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
                            <path d="M17 11V7a5 5 0 0 0-9.9-1" />
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                        </svg> :
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
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
                >
                    Forgot password?
                </a>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    marginTop: "12px",
                    padding: "clamp(14px, 3.5vw, 17px)",
                    background: "linear-gradient(90deg, #7b5f48, #a68569)",
                    color: "#1b120e",
                    fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    border: "none",
                    borderRadius: "14px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.28s ease",
                }}
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
    );
}