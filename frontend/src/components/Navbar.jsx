import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <div className="logo">
                    Flyrr
                </div>

                <div className="desktop-links">
                    <a href="#features">Features</a>
                    <a href="#testimonials">Community</a>
                    <a href="#pricing">Pricing</a>
                </div>

                <div className="nav-actions">
                    <button className="btn-text">Sign In</button>
                    <button className="btn-primary small">Get Started</button>
                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                    <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Community</a>
                    <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                    <div className="mobile-actions">
                        <button className="btn-text full">Sign In</button>
                        <button className="btn-primary full">Get Started</button>
                    </div>
                </div>
            )}

            <style>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 20px 0;
                    transition: all 0.3s ease;
                    background: transparent;
                }
                .navbar.scrolled {
                    padding: 16px 0;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border-light);
                }
                .nav-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: var(--text-primary);
                }
                .desktop-links {
                    display: flex;
                    gap: 32px;
                }
                .desktop-links a {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                .desktop-links a:hover {
                    color: var(--text-primary);
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .btn-text {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                }
                .btn-primary.small {
                    padding: 8px 16px;
                    font-size: 0.9rem;
                }
                .mobile-toggle {
                    display: none;
                }

                .mobile-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 24px;
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .mobile-menu a {
                    font-size: 1.1rem;
                    font-weight: 600;
                    padding: 8px 0;
                }
                
                @media (max-width: 768px) {
                    .desktop-links { display: none; }
                    .mobile-toggle { display: block; }
                    .nav-actions .btn-text, .nav-actions .btn-primary { display: none; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
