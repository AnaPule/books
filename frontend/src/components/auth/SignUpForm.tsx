{/* =============== packages ============ */ }
import { toast } from 'sonner';
import { useState } from "react";

{/* =============== models ============ */ }
import type { FormEvent } from "react";
import type { User } from '@models/User';
import type { SignUpForm } from '@models/User';

{/* =============== services ============ */ }
import { request } from '@utils/ApiRequest';

{/* =============== components ============ */ }
import Spinner from '@components/skeleton/spinner';

interface SignUpFormProps {
    OnChangePage: () => void;
}

export default function SignUpForm({ OnChangePage }: SignUpFormProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<SignUpForm>({
        username: "",
        email: "",
        password: "",
        accept: false, // for terms and conditions applied
    });

    const handleChange = (field: keyof SignUpForm, value: string | boolean) => { setFormData((prev) => ({ ...prev, [field]: value })); };
    const handleSubmitSignUp = (e: FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (formData.accept) {
                request.post<User>('/auth/register', formData)
                    .then(
                        ((res: User) => {
                            if (res.username != null) {
                                toast.info(`Thank you for signing up with PńP ${res.username}. Please login.`)
                                setFormData({
                                    email: '',
                                    password: '',
                                    username: '',
                                    accept: false,
                                });
                                OnChangePage();
                            } else{
                                toast.error('Sorry, An error occured',{description: `${res}`})
                            }
                        })
                    )
            } else {
                toast('Terrms And Conditions', {
                    description: `Please read and accept the application T's n C's before joining.`
                })
            }
        } catch (error) {
            console.error(`Error signing up:`, error)
            toast('Error Siging up', {
                description: `There was an error while registering your account. Please try again later.`,
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(18px, 3.5vw, 26px)",
            }}
            onSubmit={handleSubmitSignUp}
        >
            {/* Username */}
            <div className='input-container'>
                <button>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" strokeLinecap="round" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    required
                />
            </div>

            {/* Email */}
            <div
                className="input-container"
            >
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
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0 8px 0 0" }}
                >
                    {showPassword ?
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
                            <path d="M17 11V7a5 5 0 0 0-9.9-1" />
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                        </svg> :
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89f85" strokeWidth="1.6">
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                        </svg>}
                </button>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                />
            </div>

            {/* Checkbox */}
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "clamp(0.96rem, 2.1vw, 1.03rem)",
                    color: "#b89f85",
                    userSelect: "none",
                }}
            >
                <input
                    type="checkbox"
                    checked={formData.accept}
                    onChange={(e) => handleChange("accept", e.target.checked)}
                    style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#a68569",
                        cursor: "pointer",
                    }}
                    required
                />
                I accept the{" "}
                <a href="#" style={{ color: "#a68569", textDecoration: "underline" }}>
                    Terms & Conditions
                </a>
            </label>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                onClick={handleSubmitSignUp}
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
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.28s ease",
                }}
            >
                {loading ? <Spinner loadingLabel='loading' /> : "Create Account"}
            </button>
            <div style={{ textAlign: "center", marginTop: "-8px" }}>
                <a
                    href="#"
                    style={{
                        color: "#a68569",
                        fontSize: "0.96rem",
                        textDecoration: "none",
                        opacity: 0.9,
                        cursor: 'pointer'
                    }}
                    onClick={OnChangePage}
                >
                    Already have an account? Sign in.
                </a>
            </div>

            <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#c9b296]/30"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-6 text-[#b8a58f] uppercase tracking-[0.25em] text-xs">
                        or
                    </span>
                </div>
            </div>

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
        </form>
    );
}