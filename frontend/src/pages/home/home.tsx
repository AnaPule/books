import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

{/* =============== IMAGES ============ */ }
import Book from '@assets/book.jpeg';
import Book1 from '@assets/book1.jpeg';
import Cabin from '@assets/cabin.jpeg';
import Lillies from '@assets/Lilies.jpeg';
import TopImage from '@/assets/TopImage.jpeg';

export const Topnav: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                position: 'absolute',
                top: 'clamp(10px, 3vw, 20px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                flexWrap: 'wrap',                      // ← allows wrapping on very small screens
                justifyContent: 'center',
                gap: 'clamp(20px, 5vw, 50px)',
                fontSize: 'clamp(11px, 2.5vw, 14px)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                opacity: 0.7,
                color: 'white',
                transition: 'all 0.4s ease',           // smooth resize
                zIndex: 100,
            }}
        >
            <a href="/home#home" style={{ whiteSpace: 'nowrap' }}>Home</a>
            <a href="/home#about" style={{ whiteSpace: 'nowrap' }}>About</a>
            <a href="/home#features" style={{ whiteSpace: 'nowrap' }}>Features</a>
            <a 
            href="#" 
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => navigate(`/auth`)}
            >Account</a>
        </div>
    );
};

const Hero: React.FC = () => {
    const [hoverButton, setHoverButton] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            {/* Hero Section - Full Screen */}
            <div style={{
                width: '100%',
                maxHeight: '100vh',
                marginTop: '60px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            }}>
                {/* Blurred background image */}
                <img
                    src={TopImage}
                    alt="Mountains"
                    style={{
                        position: 'absolute',
                        minWidth: '100%',
                        minHeight: '90%',
                        top: '0%',
                        left: '-100%',
                        transform: 'rotate(90deg) translate(-50%, -50%)',
                        filter: 'blur(3px) brightness(0.45)',
                    }}
                />

                {/* Brown vignette overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 50% 30%, rgba(10, 8, 12, 0.92) 0%, transparent 45%, rgba(8, 6, 10, 0.75) 70%, rgba(5, 4, 8, 0.98) 100%)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />

                {/* Hero Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '900px',
                    padding: '20px',
                }}>

                    {/* Main Title */}
                    <h1 style={{
                        fontSize: 'clamp(40px, 8vw, 72px)',
                        fontWeight: '300',
                        letterSpacing: 'clamp(4px, 2vw, 12px)',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(255,255,255,0.3)',
                        paddingBottom: '15px',
                        lineHeight: '1.2',
                    }}>
                        Pages & Parchment
                    </h1>

                    <button
                        style={{
                            background: hoverButton ? 'white' : 'transparent',
                            border: '1px solid white',
                            color: hoverButton ? 'black' : 'white',
                            padding: '12px 35px 12px 35px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={() => setHoverButton(true)}
                        onMouseLeave={() => setHoverButton(false)}
                        onClick={() => navigate(`/auth`)}
                    >
                        Login
                    </button>

                    {/* Bottom Bar with Location */}
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.2)',

                        padding: '30px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '600px',
                        margin: '0 auto',
                        gap: '20px',
                    }}>
                        <span style={{
                            fontSize: 'clamp(17px, 1.5vw, 14px)',
                            opacity: 0.7,
                            letterSpacing: '1px',
                        }}>
                            Find Your Community
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

const IntersectingCircles: React.FC = () => {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: "clamp(3.5/5, 2/4, 5/4)",   // taller on mobile → prevents stretch
                minHeight: "clamp(55vh, 70vh, 90vh)",     // smaller base height on phone
                maxHeight: "100vh",
                overflow: "hidden",
                isolation: "isolate",
                padding: "clamp(20px, 8vw, 50px) 0",
            }}
        >
            {/* Top-right heading*/}
            <h1 style={{
                position: 'absolute',
                left: '5%',
                fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',   // smaller on mobile
                fontWeight: '300',
                letterSpacing: 'clamp(4px, 2vw, 12px)',
                textTransform: 'uppercase',
                lineHeight: '1.2',
                zIndex: 5,
            }}>
                about
            </h1>

            {/* Bottom-right paragraph */}
            <div
                style={{
                    position: "absolute",
                    bottom: "clamp(6%, 8%, 12%)",
                    right: "clamp(4%, 6%, 8%)",
                    maxWidth: "clamp(38%, 45%, 52%)",
                    color: "#d0c8b8",
                    fontSize: "clamp(0.95rem, 2.3vw, 1.35rem)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    textAlign: "right",
                    zIndex: 5,
                    fontFamily: "'Cormorant Garamond', serif",
                }}
            >
                Мы предлагаем уникальные места, где вы
                <br />
                сможете отдохнуть от повседневной суеты
                <br />
                и насладиться красотой окружающего мира.
            </div>

            {/* circle 1 – bottom left */}
            <div
                style={{
                    position: "absolute",
                    width: "clamp(42%, 48%, 55%)", // bigger overlap on mobile
                    aspectRatio: "1",
                    bottom: "clamp(-6%, -2%, 4%)",            // pulled up on small screens
                    left: "clamp(-6%, -2%, 4%)",              // pulled right
                    borderRadius: "50%",
                    opacity: 0.76,
                    mixBlendMode: "screen",
                    filter: "brightness(0.78) contrast(1.18)",
                    border: "1px solid rgba(220, 230, 255, 0.28)",
                    zIndex: 0,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                    }}
                />
            </div>

            {/* circle 2 – center */}
            <div
                style={{
                    position: "absolute",
                    width: '48%',          // dominant on mobile
                    aspectRatio: "1",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    backgroundImage: `url(${Cabin})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 30%",
                    opacity: 0.74,
                    mixBlendMode: "screen",
                    filter: "brightness(0.76) contrast(1.20)",
                    border: "1px solid rgba(220, 230, 255, 0.28)",
                    zIndex: 5
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 5,
                        borderRadius: "50%",
                    }}
                />
            </div>

            {/* circle 3 – top right */}
            <div
                style={{
                    position: "absolute",
                    width: "38%",
                    aspectRatio: "1",
                    top: "11%",
                    right: "clamp(-6%, -2%, 4%)",             // pulled left on mobile
                    borderRadius: "50%",
                    opacity: 0.36,
                    mixBlendMode: "screen",
                    filter: "brightness(0.78) contrast(1.18)",
                    border: "1px solid rgba(220, 230, 255, 0.28)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                    }}
                />
            </div>

            {/* Text labels – following the diagonal positions */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    color: "#f8f8f8",
                    pointerEvents: "none",
                    zIndex: 5,
                    textTransform: "uppercase",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "0 2px 14px rgba(0,0,0,0.9)",
                }}
            >
                {/*bottom left */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "clamp(12%, 16%, 20%)",
                        left: "clamp(17%, 22%, 26%)",
                        transform: "translate(-40%, 80%)",
                        fontSize: "clamp(2.0rem, 5vw, 4.2rem)",
                        fontWeight: 550,
                        letterSpacing: "0.26em",
                    }}
                >
                    Comfort
                </div>

                {/* center */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "clamp(2.6rem, 8vw, 6.8rem)",
                        fontWeight: 700,
                        letterSpacing: "0.38em",
                        lineHeight: 0.92,
                    }}
                >
                    harmony
                </div>

                {/* ЭСТЕТИКА – top right */}
                <div
                    style={{
                        position: "absolute",
                        top: "18%",
                        right: "15%",
                        transform: "translateX(20%)",
                        fontSize: "clamp(1.5rem, 4.5vw, 3.6rem)",
                        fontWeight: 550,
                        letterSpacing: "0.20em",
                    }}
                >
                    classics
                </div>
            </div>

            {/* Vignette */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 50% 28%, rgba(8, 10, 14, 0.94) 0%, transparent 45%, rgba(6, 8, 12, 0.78) 70%, rgba(4, 6, 10, 0.98) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            />
        </div>
    );
};

const About: React.FC = () => {
    return (
        <div
            id="about"
            style={{
                width: "100%",       // white outside the dark area
            }}
        >
            <IntersectingCircles />
        </div>
    )
};

const Features: React.FC = () => {
    return (
        <div
            id='features'
            style={{
                width: '100%'
            }}>
            <div
                style={{
                    position: "relative",
                    background: "#1a1612",
                    color: "#e8e0d5",
                    overflow: "hidden",
                    padding: "clamp(60px, 8vw, 120px) 0 0 clamp(20px, 5vw, 80px)"
                }}
            >
                {/* Strong vignette – focus in center/left */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at 35% 45%, transparent 18%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.98) 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                {/* Main content wrapper */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: "1400px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                        gap: "clamp(40px, 6vw, 100px)",
                        alignItems: "center",
                    }}
                >
                    {/* Left side – image composition */}
                    <div
                        style={{
                            position: "relative",
                            height: "clamp(400px, 60vw, 680px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Background vignette glow */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle at 50% 50%, rgba(180,140,100,0.12) 0%, transparent 70%)",
                                filter: "blur(80px)",
                                zIndex: 1,
                            }}
                        />

                        <div
                            style={{
                                position: "relative",
                                width: "clamp(280px, 45vw, 520px)",
                                zIndex: 2,
                            }}
                        >
                            <img
                                src={Lillies}
                                alt="Laptop with presentation"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "12px",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                                    transform: "perspective(1000px) rotateY(-8deg)",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-15%",
                                    left: "-20%",
                                    width: "clamp(120px, 20vw, 180px)",
                                    zIndex: 3,
                                }}
                            >
                                <img
                                    src={Book}
                                    alt="book"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        position: 'relative',
                                        left: '30%',
                                        borderRadius: "8px",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                                        filter: 'brightness(0.45)',

                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: "absolute",
                                    top: "-30%",
                                    left: "15%",
                                    width: "clamp(140px, 22vw, 220px)",
                                    opacity: 0.9,
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={Book1}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        filter: "brightness(0.9) contrast(1.1)",
                                        borderRadius: '12px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side – text content */}
                    <div style={{ zIndex: 2 }}>
                        {/* Main title */}
                        <h2
                            style={{
                                fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
                                fontWeight: 400,
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                marginBottom: "clamp(20px, 4vw, 40px)",
                                color: "#e8e0d5",
                                lineHeight: 1.15,
                            }}
                        >
                            featues
                            <br />
                            PńP
                        </h2>

                        {/* Subtitle / intro */}
                        <p
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                                lineHeight: 1.75,
                                color: "#d0c8b8",
                                marginBottom: "clamp(30px, 5vw, 60px)",
                                fontStyle: "italic",
                                maxWidth: "520px",
                            }}
                        >
                            Find out what you an access through our platform:
                        </p>

                        {/* Numbered list */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "clamp(18px, 3vw, 32px)",
                            }}
                        >
                            {[
                                "Read and explore new books",
                                "Connect and Communicate with communities that have similar tastes. Geek about yoyur experience of a booka as you read.",
                                "Write and publish books of your own to your followeres and communities.",
                                "Participate in reading challenges and live interactions with your fellow readers.",
                            ].map((text, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "clamp(12px, 2vw, 24px)",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                                            fontWeight: 700,
                                            color: "#a68a64",
                                            minWidth: "clamp(36px, 6vw, 60px)",
                                            textAlign: "right",
                                        }}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p
                                        style={{
                                            fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
                                            lineHeight: 1.65,
                                            margin: 0,
                                        }}
                                    >
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Curved line overlay – connecting title to list */}
                <svg
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                    viewBox="0 0 1200 800"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 200 180 Q 600 400, 1000 320"
                        fill="none"
                        stroke="rgba(168,138,100,0.18)"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                    />
                </svg>
            </div>
        </div>

    );
};

const Contact: React.FC = () => {
    return (
        <div
            id='contact'
            style={{
                width: '100%'
            }}
        >
            <div
                style={{
                    position: "relative",
                    background: "#1a1612",
                    color: "#e8e0d5",
                    overflow: "hidden",
                    padding: "clamp(60px, 8vw, 120px) 0 0 clamp(20px, 5vw, 80px)",
                }}
            >
                {/* Strong vignette*/}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at 35% 45%, transparent 18%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.98) 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />

                {/* Main title */}
                <h2
                    style={{
                        fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
                        fontWeight: 400,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        marginBottom: "clamp(20px, 4vw, 40px)",
                        color: "#e8e0d5",
                        lineHeight: 1.15,
                        zIndex: 5,
                        position: "relative",
                    }}
                >
                    Contact Us
                    <br />
                    PńP
                </h2>

                {/* Main responsive grid – same as Features */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: "1400px",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", // ← this makes it stack on mobile
                        gap: "clamp(40px, 6vw, 100px)",
                        alignItems: "start",
                    }}
                >
                    {/* Company info */}
                    <div>
                        <h3
                            style={{
                                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                                fontWeight: "400",
                                letterSpacing: "2px",
                                marginBottom: "20px",
                                color: "#c4b5a0",
                            }}
                        >
                            Morwetsana Pule
                        </h3>
                        <p
                            style={{
                                lineHeight: "1.8",
                                opacity: 0.7,
                                fontSize: "clamp(1rem, 2.4vw, 1.2rem)",
                            }}
                        >
                            University of Pretoria Student
                        </p>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h4
                            style={{
                                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                                fontWeight: "400",
                                letterSpacing: "1px",
                                marginBottom: "20px",
                                color: "#c4b5a0",
                            }}
                        >
                            Contact Me
                        </h4>
                        <p style={{ marginBottom: "10px", opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            morwetsana.pule@gmail.com
                        </p>
                        <p style={{ marginBottom: "10px", opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            +27 63 519 9397
                        </p>
                        <p style={{ opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            Pretoria, Cullinan, 1000
                        </p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4
                            style={{
                                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                                fontWeight: "400",
                                letterSpacing: "1px",
                                marginBottom: "20px",
                                color: "#c4b5a0",
                            }}
                        >
                            Social Media
                        </h4>
                        <p style={{ marginBottom: "10px", opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            LinkedIn
                        </p>
                        <p style={{ marginBottom: "10px", opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            Github
                        </p>
                        <p style={{ opacity: 0.7, fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}>
                            Glassdoor
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "clamp(40px, 8vw, 60px) auto 0",
                        paddingTop: "30px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        textAlign: "center",
                        opacity: 0.5,
                        fontSize: "clamp(12px, 2vw, 14px)",
                        zIndex: 2,
                        position: "relative",
                    }}
                >
                    © 2026 Morwetsana Pule. All rights reserved.
                    <br />
                    Built with React, TypeScript, and Tailwind CSS
                </div>
            </div>
        </div>

    );
};

export default function HomePage() {
    return (
        <>
            <Topnav />
            <Hero />
            <About />
            <Features />
            <Contact />
        </>

    );
}