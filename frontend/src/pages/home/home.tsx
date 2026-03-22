import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

{/* =============== IMAGES ============ */ }
import Book from '@assets/book.jpeg';
import Book1 from '@assets/book1.jpeg';
import Paris from '@assets/paris.jpeg';
import Bouqet from "@assets/bouqet.jpeg";
import Flowers from "@assets/Flowers.jpeg";

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
                color: '#5a4d41',
            }}>
                {/* Blurred background image - lighter brightness */}
                <img
                    src={Flowers}
                    alt="Mountains"
                    style={{
                        position: 'absolute',
                        minWidth: '100%',
                        minHeight: '90%',
                        top: '0%',
                        left: '-100%',
                        transform: 'rotate(90deg) translate(-50%, -50%)',
                        filter: 'blur(3px) brightness(0.85)',
                    }}
                />

                {/* Light academia vignette overlay - warm and soft */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(207, 197, 181, 0.38) 0%, rgba(235, 220, 200, 0.65) 45%, rgba(220, 200, 180, 0.75) 70%, rgba(210, 190, 170, 0.8) 100%)',
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
                        fontSize: 'clamp(70px, 8vw, 72px)',
                        fontWeight: '300',
                        letterSpacing: 'clamp(4px, 2vw, 12px)',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(139, 111, 76, 0.7)',
                        paddingBottom: '15px',
                        lineHeight: '1.2',
                    }}>
                        Pages & Parchment
                    </h1>

                    <button
                        style={{
                            background: hoverButton ? 'rgba(210, 190, 170, 0.9)' : 'transparent',
                            border: hoverButton ? 'rgb(164, 147, 129)' : '1px solid #685035',
                            color: hoverButton ? '#685035' : 'var(--deep-tea)',
                            padding: '12px 35px 12px 35px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease',
                            fontWeight: '500',
                        }}
                        onMouseEnter={() => setHoverButton(true)}
                        onMouseLeave={() => setHoverButton(false)}
                        onClick={() => navigate(`/auth`)}
                    >
                        Login
                    </button>

                    {/* Bottom Bar with Location */}
                    <div style={{
                        borderTop: '1px solid rgba(139, 111, 76, 0.7)',
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
                            color: '#685035',
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
                aspectRatio: "clamp(3.5/5, 2/4, 5/4)",
                minHeight: "clamp(55vh, 70vh, 90vh)",
                maxHeight: "100vh",
                overflow: "hidden",
                isolation: "isolate",
                padding: "clamp(20px, 8vw, 50px) 0",
                background: "#faf5ea",
            }}
        >
            {/* Top-right heading - warm brown */}
            <h1 style={{
                position: 'absolute',
                left: '5%',
                fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                fontWeight: '300',
                letterSpacing: 'clamp(4px, 2vw, 12px)',
                textTransform: 'uppercase',
                lineHeight: '1.2',
                zIndex: 5,
                color: '#5a4d41',
            }}>
                about
            </h1>

            {/* Bottom-right paragraph - warm text */}
            <div
                style={{
                    position: "absolute",
                    bottom: "clamp(6%, 8%, 12%)",
                    right: "clamp(4%, 6%, 8%)",
                    maxWidth: "clamp(38%, 45%, 52%)",
                    color: "#7e6957",
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

            {/* circle 1 – bottom left - warmer tones */}
            <div
                style={{
                    position: "absolute",
                    width: "clamp(42%, 48%, 55%)",
                    aspectRatio: "1",
                    bottom: "clamp(-6%, -2%, 4%)",
                    left: "clamp(-6%, -2%, 4%)",
                    borderRadius: "50%",
                    opacity: 0.76,
                    mixBlendMode: "multiply",
                    filter: "brightness(0.95) contrast(1.1)",
                    border: "1px solid rgba(139, 111, 76, 0.28)",
                    background: "radial-gradient(circle at 30% 30%, #f2e6d8, #d9c9b5)",
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

            {/* circle 2 – center - with image but lighter */}
            <div
                style={{
                    position: "absolute",
                    width: '48%',
                    aspectRatio: "1",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    backgroundImage: `url(${Paris})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 30%",
                    opacity: 0.35,
                    filter: "contrast(1.1) sepia(0.4)",
                    border: "1px solid rgba(139, 111, 76, 0.28)",
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

            {/* circle 3 – top right - warm */}
            <div
                style={{
                    position: "absolute",
                    width: "38%",
                    aspectRatio: "1",
                    top: "11%",
                    right: "clamp(-6%, -2%, 4%)",
                    borderRadius: "50%",
                    opacity: 0.45,
                    mixBlendMode: "multiply",
                    filter: "brightness(0.95) contrast(1.1)",
                    border: "1px solid rgba(139, 111, 76, 0.28)",
                    background: "radial-gradient(circle at 70% 70%, #e8d9c8, #c9b296)",
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

            {/* Text labels – following the diagonal positions - warm colors */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    color: "#5a4d41",
                    zIndex: 5,
                    textTransform: "uppercase",
                    textShadow: "0 2px 14px rgba(245, 235, 220, 0.7)",
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
                        color: "#7e6957",
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
                        color: "#5a4d41",
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
                        color: "#8d6c45",
                    }}
                >
                    classics
                </div>
            </div>

            {/* Light vignette - warm instead of dark */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 50% 28%, rgba(245, 235, 225, 0.6) 0%, transparent 45%, rgba(235, 220, 205, 0.3) 70%, rgba(225, 210, 190, 0.4) 100%)",
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
                width: "100%",
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
                    background: "#faf5ea",
                    color: "#5a4d41",
                    overflow: "hidden",
                    padding: "clamp(60px, 8vw, 120px) 0 0 clamp(20px, 5vw, 80px)"
                }}
            >
                {/* Light vignette – warm glow */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at 35% 45%, transparent 18%, rgba(245, 235, 225, 0.6) 65%, rgba(235, 225, 210, 0.7) 100%)",
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
                        {/* Background vignette glow - warm */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle at 50% 50%, rgba(139, 111, 76, 0.12) 0%, transparent 70%)",
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
                                src={Bouqet}
                                alt="Laptop with presentation"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "12px",
                                    boxShadow: "0 20px 60px rgba(139, 111, 76, 0.25)",
                                    transform: "perspective(1000px) rotateY(-8deg)",
                                    filter: "brightness(0.98) sepia(0.1)",
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
                                        boxShadow: "0 10px 30px rgba(139, 111, 76, 0.2)",
                                        filter: 'brightness(0.95) sepia(0.15)',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: "absolute",
                                    top: "-30%",
                                    left: "15%",
                                    width: "clamp(140px, 22vw, 220px)",
                                    opacity: 0.95,
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src={Book1}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        filter: "brightness(0.95) contrast(1.05) sepia(0.1)",
                                        borderRadius: '12px',
                                        boxShadow: "0 10px 25px rgba(139, 111, 76, 0.15)",
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
                                color: "#5a4d41",
                                lineHeight: 1.15,
                            }}
                        >
                            features
                            <br />
                            PńP
                        </h2>

                        {/* Subtitle / intro */}
                        <p
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                                lineHeight: 1.75,
                                color: "#7e6957",
                                marginBottom: "clamp(30px, 5vw, 60px)",
                                fontStyle: "italic",
                                maxWidth: "520px",
                            }}
                        >
                            Find out what you can access through our platform:
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
                                "Connect and Communicate with communities that have similar tastes. Geek about your experience of a book as you read.",
                                "Write and publish books of your own to your followers and communities.",
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
                                            color: "#8d6c45",
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
                                            color: "#5a4d41",
                                        }}
                                    >
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Curved line overlay – connecting title to list - warm */}
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
                        stroke="rgba(139, 111, 76, 0.18)"
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
                    background: "#f5f0e8",
                    color: "#5a4d41",
                    overflow: "hidden",
                    padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
                }}
            >
                {/* Light vignette - warm */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at 35% 45%, transparent 18%, rgba(245, 235, 225, 0.5) 65%, rgba(235, 225, 210, 0.6) 100%)",
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
                        color: "#5a4d41",
                        lineHeight: 1.15,
                        zIndex: 5,
                        position: "relative",
                    }}
                >
                    Contact Us
                    <br />
                    PńP
                </h2>

                {/* Main responsive grid */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: "1400px",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                                color: "#7e6957",
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Morwetsana Pule
                        </h3>
                        <p
                            style={{
                                lineHeight: "1.8",
                                opacity: 0.8,
                                fontSize: "clamp(1rem, 2.4vw, 1.2rem)",
                                color: "#5a4d41",
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
                                color: "#7e6957",
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Contact Me
                        </h4>
                        <p style={{ marginBottom: "10px", opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
                            morwetsana.pule@gmail.com
                        </p>
                        <p style={{ marginBottom: "10px", opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
                            +27 63 519 9397
                        </p>
                        <p style={{ opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
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
                                color: "#7e6957",
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Social Media
                        </h4>
                        <p style={{ marginBottom: "10px", opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
                            LinkedIn
                        </p>
                        <p style={{ marginBottom: "10px", opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
                            Github
                        </p>
                        <p style={{ opacity: 0.8, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#5a4d41" }}>
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
                        borderTop: "1px solid rgba(139, 111, 76, 0.2)",
                        textAlign: "center",
                        opacity: 0.7,
                        fontSize: "clamp(12px, 2vw, 14px)",
                        zIndex: 2,
                        position: "relative",
                        color: "#7e6957",
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
            <Hero />
            <About />
            <Features />
            <Contact />
        </>

    );
}