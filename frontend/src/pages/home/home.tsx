import TopImage from '../../assets/TopImage.jpeg';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReactTyped } from "react-typed";
import { Download, ChevronDown } from 'lucide-react';

export default function HomePage() {
    const [hoverButton, setHoverButton] = useState(false);
    const projects = [
        {
            title: 'Capstone Project',
            description: 'A client solution that for Cirrus Bridge that centralises all their operations - from Paymo, Toggl and JIRA - into a single application to assist in organisation analytics, employee administration and analytics, client administration and analytics as well as perspective business oppotunities',
            status: 'Completed',
            technologies: ['React', 'Node.js', 'EJS', 'Docker', 'SQL', 'TypeScript'],
            links: {
                live: 'https://zealous-meadow-07ff63b03.2.azurestaticapps.net/',
                github: 'https://github.com/INF-370-2025/inf-370-team01'
            }
        },
        {
            title: 'Daily Digest',
            description: 'A news aggregation platform that curates live crypto data and analytics as well as recent Sounth African news articles and headlines',
            status: 'Completed',
            technologies: ['React', 'TypeScript', 'Tailwind', 'Python', 'MongoDB'],
            links: {
                live: 'https://daily-digest-8oa1-pl0wjja2f-anapules-projects.vercel.app/',
                github: 'https://github.com/AnaPule/daily-digest'
            }
        }
        ,
        {
            title: 'Bookmark API',
            description: 'On going...',
            status: 'In Progress',
            technologies: ['Java', 'SpringBoot', 'Postgres'],
            links: {
                live: '',
                github: ''
            }
        }
    ];
    return (
        <>
            {/* Hero Section - Full Screen */}
            <div style={{
                width: '100vw',
                height: '100vh',
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
                        width: 'auto',
                        height: 'auto',
                        minWidth: '150%',
                        minHeight: '150%',
                        top: '50%',
                        left: '50%',
                        transform: 'rotate(90deg) translate(-50%, -50%)',
                        objectFit: 'cover',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        filter: 'blur(2px) brightness(0.85)',
                    }}
                />

                {/* Brown vignette overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, transparent 20%, rgba(70, 40, 15, 0.6) 90%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }} />

                {/* Hero Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '900px',
                    padding: '20px',
                }}>
                    {/* Top Navigation */}
                    <div style={{
                        position: 'absolute',
                        top: '-250px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '40px',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        opacity: 0.7,
                    }}>
                        <a href='#about'>About</a>
                        <a href='#skills'>Skills</a>
                        <a href='#projects'>Project</a>
                        <a href='#contact'>Contact</a>
                    </div>

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
                        Morwetsana Pule
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl sm:text-2xl font-medium tracking-[0.4em] uppercase"
                        style={{
                            fontSize: 'clamp(14px, 2vw, 18px)',
                            letterSpacing: '4px',
                            marginBottom: '40px',
                            textTransform: 'uppercase',
                            opacity: 0.8,
                            fontWeight: '300',
                        }}>
                        I Am An Aspiring{" "}
                        <ReactTyped
                            strings={["UI/UX Designer", 'Software Engineer', 'Software Developer', 'Business analyst', 'Network Engineer', 'Cloud Practitioner', 'Cyber analyst']}
                            typeSpeed={100}
                            loop
                            backSpeed={20}
                            cursorChar="|"
                            showCursor={true}
                        />
                    </motion.p>

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
                    >
                        Download CV
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
                            Willing to Relocate
                        </span>


                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden md:block"
                    >
                        <ChevronDown size={32} className="text-white animate-bounce" />
                    </motion.div>
                </div>
            </div>

            {/* About Section */}
            <div id='about'
                style={{
                    width: '100vw',
                    padding: '80px 40px',
                    backgroundColor: 'white',
                    fontFamily: "'Cormorant Garamond', serif",
                }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    textAlign: 'center',
                }}>
                    <h2 style={{
                        fontSize: '42px',
                        fontWeight: '300',
                        letterSpacing: '4px',
                        marginBottom: '30px',
                        color: '#2c221b',
                    }}>
                        ABOUT
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: '#4a3f35',
                        maxWidth: '700px',
                        margin: '0 auto 40px',
                        fontStyle: 'italic',
                    }}>
                        I’m an Informatics graduate and Full Stack Developer, passionate about building systems that are both functional and thoughtfully designed.
                        My experience spans from frontend development with React, Angular, and Ionic,
                        to backend systems using .NET (C#), Python, Java and Node.js,
                        and a solid database work in MySQL, MongoDB and PostgreSQL.
                        <br /><br />
                        I enjoy puzzles, writing, readin, and overall indulging greatly in the creative arts.
                        <br /> <br />
                        My goal is to keep growing as a network engineer
                        and cyber analyst, who can bridge technical skill
                        with clear communication, and eventually design solutions that make real-world work easier and smarter and safer.
                    </p>
                    <button style={{
                        background: 'transparent',
                        border: '1px solid #8b7a67',
                        color: '#8b7a67',
                        padding: '12px 40px',
                        fontSize: '14px',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#8b7a67';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#8b7a67';
                        }}>
                        УЗНАТЬ БОЛЬШЕ
                    </button>
                </div>
            </div>

            {/* Projects Section */}
            <div id='projects' style={{
                width: '100vw',
                padding: '100px 40px',
                backgroundColor: '#faf7f2',
                fontFamily: "'Cormorant Garamond', serif",
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {/* Section Header - Pinterest style */}
                    <div style={{
                        marginBottom: '60px',
                        borderBottom: '1px solid rgba(139, 122, 103, 0.2)',
                        paddingBottom: '30px',
                    }}>
                        <h2 style={{
                            fontSize: '42px',
                            fontWeight: '300',
                            letterSpacing: '8px',
                            color: '#2c221b',
                            marginBottom: '10px',
                            textTransform: 'uppercase',
                            textAlign: 'center'
                        }}>
                            PROJECTS
                        </h2>
                        <p style={{
                            color: '#8b7a67',
                            fontSize: '16px',
                            letterSpacing: '2px',
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                            A showcase of my work
                        </p>
                    </div>

                    {/* Project Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                    }}>
                        {projects.map((item) => (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '35px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                border: '1px solid rgba(196, 181, 160, 0.3)',
                                transition: 'all 0.3s ease',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(101, 67, 33, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 122, 103, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(196, 181, 160, 0.3)';
                                }}>

                                {/* Title */}
                                <h3 style={{
                                    fontSize: '28px',
                                    fontWeight: '400',
                                    color: '#2c221b',
                                    marginBottom: '10px',
                                    letterSpacing: '1px',
                                }}>
                                    {item.title}
                                </h3>

                                {/* Status Tag - Pinterest style */}
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    backgroundColor: item.status === 'Completed' ? '#e8e0d5' : '#f0e9e0',
                                    color: '#6b5843',
                                    fontSize: '11px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    border: '1px solid rgba(139, 122, 103, 0.3)',
                                    marginBottom: '20px',
                                }}>
                                    {item.status}
                                </span>

                                {/* Description */}
                                <p style={{
                                    color: '#5a4a38',
                                    lineHeight: '1.8',
                                    marginBottom: '25px',
                                    fontSize: '15px',
                                    fontFamily: 'system-ui, sans-serif',
                                    opacity: 0.9,
                                }}>
                                    {item.description}
                                </p>

                                {/* Technologies - as a simple list */}
                                <div style={{
                                    marginBottom: '30px',
                                    borderTop: '1px solid rgba(196, 181, 160, 0.2)',
                                    paddingTop: '20px',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px 15px',
                                    }}>
                                        {item.technologies.map((tech) => (
                                            <span key={tech} style={{
                                                color: '#8b7a67',
                                                fontSize: '13px',
                                                letterSpacing: '0.5px',
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons - side by side */}
                                <div style={{
                                    display: 'flex',
                                    gap: '15px',
                                    borderTop: '1px solid rgba(196, 181, 160, 0.2)',
                                    paddingTop: '20px',
                                }}>
                                    {item.links.live ?
                                        (<button style={{
                                            background: 'transparent',
                                            border: '1px solid #8b7a67',
                                            color: '#8b7a67',
                                            padding: '10px 25px',
                                            fontSize: '12px',
                                            letterSpacing: '1.5px',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.3s ease',
                                            flex: 1,
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#8b7a67';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#8b7a67';
                                            }}>
                                            LIVE DEMO
                                        </button>) : null}
                                    {item.links.github ?
                                        (<button
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #c4b5a0',
                                                color: '#6b5843',
                                                padding: '10px 25px',
                                                fontSize: '12px',
                                                letterSpacing: '1.5px',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.3s ease',
                                                flex: 1,
                                            }}

                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#c4b5a0';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#6b5843';
                                            }}
                                            onClick={() => window.open(item.links.github)}
                                        >
                                            CODE
                                        </button>) : null
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact/Footer Section */}
            <div style={{
                width: '100vw',
                padding: '60px 40px 40px',
                backgroundColor: '#2c221b',
                color: 'white',
                fontFamily: "'Cormorant Garamond', serif",
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            letterSpacing: '2px',
                            marginBottom: '20px',
                            color: '#c4b5a0',
                        }}>
                            Morwetsana Pule
                        </h3>
                        <p style={{
                            lineHeight: '1.8',
                            opacity: 0.7,
                        }}>
                            University of Pretoria Student
                        </p>
                    </div>
                    <div>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: '400',
                            letterSpacing: '1px',
                            marginBottom: '20px',
                            color: '#c4b5a0',
                        }}>
                            Contact Me
                        </h4>
                        <p style={{ marginBottom: '10px', opacity: 0.7 }}>morwetsana.pule@gmail.com</p>
                        <p style={{ marginBottom: '10px', opacity: 0.7 }}>+27 63 519 9397</p>
                        <p style={{ opacity: 0.7 }}>Pretoria, Cullinan, 1000</p>
                    </div>
                    <div>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: '400',
                            letterSpacing: '1px',
                            marginBottom: '20px',
                            color: '#c4b5a0',
                        }}>
                            Social Media
                        </h4>
                        <p style={{ marginBottom: '10px', opacity: 0.7 }}>LinkedIn</p>
                        <p style={{ marginBottom: '10px', opacity: 0.7 }}>Github</p>
                        <p style={{ opacity: 0.7 }}>Glassdoor</p>
                    </div>
                </div>
                <div style={{
                    maxWidth: '1200px',
                    margin: '60px auto 0',
                    paddingTop: '30px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    opacity: 0.5,
                    fontSize: '14px',
                }}>
                    © 2026 Morwetsana Pule. All rights reserved.
                    Built with React, TypeScript, and Tailwind CSS
                </div>
            </div>
        </>
    );
}