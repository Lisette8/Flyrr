import React from 'react';
import Icon from './Icon';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <div className="badge-pill">
                        <span className="badge-dot"></span>
                        Now accepting early access
                    </div>
                    <h1>
                        The social network for <br />
                        <span className="text-gradient">modern aviators</span>
                    </h1>
                    <p className="hero-sub">
                        Connect with pilots, share flight logs, and discover aviation events near you.
                        The first professional community built for the skies.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-primary">Join Waitlist</button>
                        <button className="btn-outline">
                            View Demo
                            <Icon name="arrowRight" size={18} />
                        </button>
                    </div>
                </div>

                {/* Mock App Interface Visual */}
                <div className="hero-visual">
                    <div className="mock-window">
                        <div className="mock-header">
                            <div className="window-controls">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mock-search">Flyrr / Feed</div>
                        </div>
                        <div className="mock-body">
                            {/* Mock Post 1 */}
                            <div className="mock-post">
                                <div className="mock-post-header">
                                    <div className="mock-avatar">S</div>
                                    <div className="mock-meta">
                                        <div className="mock-name">Sarah Jenkins</div>
                                        <div className="mock-handle">@capt_sarah • 2h</div>
                                    </div>
                                </div>
                                <div className="mock-text">
                                    Just cleared for arrival at O'Hare. The sunset over Lake Michigan is absolutely stunning today. 🛬 #Aviation #PilotLife
                                </div>
                                <div className="mock-image-placeholder"></div>
                            </div>
                            {/* Mock Post 2 */}
                            <div className="mock-post">
                                <div className="mock-post-header">
                                    <div className="mock-avatar bg-blue">M</div>
                                    <div className="mock-meta">
                                        <div className="mock-name">Mike Ross</div>
                                        <div className="mock-handle">@mikeross • 4h</div>
                                    </div>
                                </div>
                                <div className="mock-text">
                                    Looking for a safety pilot for my IFR currency check this weekend in the Bay Area. Anyone available?
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Floating Element */}
                    <div className="floating-card glass">
                        <div className="stat-value">2.4k</div>
                        <div className="stat-label">Active Pilots</div>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-section {
                    padding-top: 140px;
                    padding-bottom: 80px;
                    overflow: hidden;
                }
                .hero-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }
                
                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-light);
                    border-radius: 100px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 24px;
                    color: var(--text-secondary);
                }
                .badge-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--success);
                    border-radius: 50%;
                }

                h1 {
                    font-size: 4rem;
                    line-height: 1.1;
                    font-weight: 800;
                    margin-bottom: 24px;
                    letter-spacing: -0.04em;
                }
                .text-gradient {
                    background: linear-gradient(to right, var(--text-primary), var(--text-tertiary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .hero-sub {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 32px;
                    max-width: 480px;
                    text-wrap: balance;
                }

                .hero-cta {
                    display: flex;
                    gap: 16px;
                }
                .btn-outline {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-full);
                    background: white;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    transition: all 0.2s;
                }
                .btn-outline:hover {
                    background: var(--bg-secondary);
                    border-color: var(--border-medium);
                }

                /* Visual */
                .hero-visual {
                    position: relative;
                    perspective: 1000px;
                }
                .mock-window {
                    background: white;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    box-shadow: 
                        0 20px 40px -12px rgba(0,0,0,0.1),
                        0 0 0 1px rgba(0,0,0,0.02);
                    overflow: hidden;
                    transform: rotateY(-5deg) rotateX(2deg);
                    transition: transform 0.5s ease;
                }
                .hero-visual:hover .mock-window {
                    transform: rotateY(0) rotateX(0);
                }

                .mock-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: var(--bg-tertiary);
                }
                .window-controls {
                    display: flex;
                    gap: 6px;
                }
                .window-controls span {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #d1d5db;
                }
                .mock-search {
                    flex: 1;
                    background: white;
                    height: 24px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    padding: 0 8px;
                    font-size: 10px;
                    color: var(--text-tertiary);
                }
                
                .mock-body {
                    padding: 0;
                    background: var(--bg-secondary);
                }
                .mock-post {
                    background: white;
                    padding: 16px;
                    border-bottom: 1px solid var(--border-light);
                }
                .mock-post-header {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .mock-avatar {
                    width: 36px;
                    height: 36px;
                    background: var(--text-primary);
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .bg-blue { background: #3b82f6; }
                .mock-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .mock-handle {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                .mock-text {
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin-bottom: 12px;
                    color: var(--text-secondary);
                }
                .mock-image-placeholder {
                    width: 100%;
                    height: 160px;
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                }

                .floating-card {
                    position: absolute;
                    bottom: -20px;
                    left: -20px;
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(10px);
                    padding: 16px 24px;
                    border-radius: 12px;
                    border: 1px solid var(--border-light);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    animation: float 4s ease-in-out infinite;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary);
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @media (max-width: 960px) {
                    .hero-container {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    h1 { font-size: 3rem; }
                    .hero-sub { margin-left: auto; margin-right: auto; }
                    .hero-cta { justify-content: center; }
                    .hero-visual { margin-top: 40px; padding: 0 20px; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
