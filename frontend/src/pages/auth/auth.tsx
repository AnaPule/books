import { useState, useEffect } from "react";

// =============== images ============
import Orange1 from "@assets/Orange_1.jpeg";
// =============== components ============
import { Topnav } from "@pages/home/home";

// =============== pages/components ============
import LoginForm from "@components/auth/LoginForm";
import SignUpForm from "@components/auth/SignUpForm";

// =============== services ============
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const {isLoggedIn, loading} = useAuth();
  const [page, setPage] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && isLoggedIn){navigate('/profile', {replace: true})}
  },[navigate, isLoggedIn, loading]);

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: `url(${Orange1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Topnav />

      {/* light academia parchment overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(245, 235, 220, 0.78) 0%, rgba(235, 220, 200, 0.7) 45%, rgba(220, 200, 180, 0.65) 70%, rgba(210, 190, 170, 0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* warm tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "rgba(200, 175, 150, 0.12)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* auth card */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-5 sm:px-8 py-10 md:py-12">
        <div
          className="
            w-full max-w-5xl
            grid md:grid-cols-2 items-stretch
            rounded-2xl overflow-hidden
            bg-[#faf5ea]/88 backdrop-blur-sm
            border border-[#c9b296]/50
            shadow-[0_20px_50px_-15px_rgba(90,70,50,0.35),
                    inset_0_1px_0_rgba(255,245,230,0.7)]
          "
        >
          {/* Side panel */}
          <div
            className="
            hidden 
            md:flex 
            md:flex-col 
            md:justify-center 
            px-8 
            lg:px-14 
            py-12 
            bg-[#f2e6d8]/85
            border-r border-[#c9b296]/40
            relative
            overflow-hidden
            before:content-['']
            before:absolute
            before:top-0
            before:left-0
            before:w-full
            before:h-[1px]
            before:bg-gradient-to-r
            before:from-transparent
            before:via-[#b89f85]
            before:to-transparent
            after:content-['']
            after:absolute
            after:bottom-0
            after:left-0
            after:w-full
            after:h-[1px]
            after:bg-gradient-to-r
            after:from-transparent
            after:via-[#b89f85]
            after:to-transparent
          "
          >
            <div className="space-y-16 opacity-95">
              <div>
                <h3 className=" tracking-[0.2em] text-[#5a4d41] text-xl lg:text-2xl font-light mb-4 relative inline-block">
                  {page ? "Return to Your Library" : "Begin Your Collection"}
                  <span className="absolute -bottom-2 left-0 w-12 h-[1px] bg-[#b89f85]/60" />
                </h3>
                <p className=" text-[#7e6957] text-sm lg:text-base leading-relaxed italic">
                  {page
                    ? "The quiet fellowship awaits your return. Turn the page where you left off."
                    : "Every great library begins with a single volume. Start your story with us."}
                </p>
              </div>

              <div>
                <h3 className=" tracking-[0.2em] text-[#5a4d41] text-xl lg:text-2xl font-light mb-4 relative inline-block">
                  A Reading Room for the Soul
                  <span className="absolute -bottom-2 left-0 w-12 h-[1px] bg-[#b89f85]/60" />
                </h3>
                <p className=" text-[#7e6957] text-sm lg:text-base leading-relaxed italic">
                  "A room without books is like a body without a soul."
                </p>
                <p className="font-serif text-[#8d6c45] text-xs mt-4 tracking-widest uppercase">
                  — Cicero
                </p>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-[#fcf9f4]/90 backdrop-blur-sm overflow-hidden">
            {/* subtle texture overlay - like aged paper */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#8d6c45 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* height */}
            <div className="relative min-h-[700px] sm:min-h-[700px] md:min-h-[750px] lg:min-h-[700px]">
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