import React from 'react';
import Icon from './Icon';

const Features = () => {
    const features = [
        {
            icon: 'globe',
            title: 'Global Community',
            desc: 'Connect with pilots from over 150 countries. Share experiences and bridge the gap between continents.'
        },
        {
            icon: 'shield',
            title: 'Verified Profiles',
            desc: 'Safety first. All professional pilot profiles are verified against official databases to ensure authenticity.'
        },
        {
            icon: 'chart',
            title: 'Flight Logs',
            desc: 'Digital logbook integration allows you to showcase your hours, routes, and aircraft types directly on your profile.'
        }
    ];

    return (
        <section className="features-section" id="features">
            <div className="container">
                <div className="section-header">
                    <h2>Built for the cockpit</h2>
                    <p>Everything you need to connect, share, and grow his career in aviation.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div className="feature-card" key={idx}>
                            <div className="feature-icon-wrapper">
                                <Icon name={feature.icon} size={28} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .features-section {
                    padding: 80px 0;
                    background: var(--bg-secondary);
                }
                .section-header {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto 60px;
                }
                .section-header h2 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin-bottom: 16px;
                }
                .section-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 32px;
                }

                .feature-card {
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    border: 1px solid var(--border-light);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .feature-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05);
                }

                .feature-icon-wrapper {
                    width: 56px;
                    height: 56px;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    color: var(--text-primary);
                }
                
                .feature-card h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .feature-card p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
            `}</style>
        </section>
    );
};

export default Features;
