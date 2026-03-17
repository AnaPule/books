import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// =============== images ============
import Background from '@assets/background.jpeg';
import Background1 from '@assets/background_1.jpeg';
import Background2 from '@assets/background_2.jpeg';
import Background3 from '@assets/background_3.jpeg';
import Background4 from '@assets/background_4.jpeg';

// =============== components ============
import { Topnav } from "@pages/home/home";

// =============== pages/components ============
import LoginForm from "@components/auth/LoginForm";
import SignUpForm from "@components/auth/SignUpForm";

export default function AuthPage() {
  const [page, setPage] = useState<boolean>(true);

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: `url(${Background4})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Topnav />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/*  warm tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "rgba(27,18,14,0.18)",
          mixBlendMode: "multiply",
        }}
      />

      {/* auth card */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-5 sm:px-8 py-10 md:py-12">
        <div
          className="
            w-full max-w-5xl
            grid md:grid-cols-2 items-stretch
            rounded-2xl overflow-hidden
            bg-[#11100e]/68 backdrop-blur-xl
            border border-[#7b5f48]/35
            shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7),
                    inset_0_1px_0_rgba(255,255,255,0.04)]
          "
        >
          {/* Side panel*/}
          <div
            className="
            hidden 
            md:flex 
            md:flex-col 
            md:justify-center 
            px-8 
            lg:px-14 
            py-12 
            w-[70%]
           bg-[#1a1612]/45
            border-r border-[white]/20">
            <div className="space-y-16 opacity-90">
              <div>
                <h3 className="uppercase tracking-[0.28em] text-[#e8e0d5] text-xl lg:text-2xl font-light mb-4">
                  {page ? "Access Your Account" : "Create Your Sanctuary"}
                </h3>
                <p className="text-[#d4c0a8] text-sm lg:text-base leading-relaxed opacity-90">
                  {page
                    ? "Return to your haven of stories and quiet communities."
                    : "Begin your journey into curated places of rest and reflection."}
                </p>
              </div>

              <div>
                <h3 className="uppercase tracking-[0.28em] text-[#e8e0d5] text-xl lg:text-2xl font-light mb-4">
                  Harmony Awaits
                </h3>
                <p className="text-[#d4c0a8] text-sm lg:text-base leading-relaxed opacity-90">
                  Private. Secure. Timeless.
                </p>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-[#11100e]/58 backdrop-blur-lg overflow-hidden">
            {/* height */}
            <div className="relative min-h-[600px] sm:min-h-[400px] md:min-h-[580px] lg:min-h-[600px]">
              {/* Login */}
              <div
                className={`
        absolute inset-0 w-full transition-all duration-500 ease-in-out
        ${page
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-full opacity-0 pointer-events-none'
                  }
      `}
              >
                <LoginForm OnChangePage={() => { setPage((prev) => !prev) }} />
              </div>

              {/* Signup */}
              <div
                className={`
        absolute inset-0 w-full transition-all duration-500 ease-in-out
        ${!page
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0 pointer-events-none'
                  }
      `}
              >
                <SignUpForm OnChangePage={() => { setPage((prev) => !prev) }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}