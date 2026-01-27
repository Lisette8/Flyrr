import React from 'react';

const Testimonials = () => {
    return (
        <section className="testimonials-section" id="testimonials">
            <div className="container">
                <div className="section-header">
                    <h2>Cleared for takeoff</h2>
                    <p>Join thousands of pilots who have already made Flyrr their digital hangar.</p>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="quote">
                            "Finally, a social network that understands the difference between VFR and IFR. The community here is incredibly knowledgeable."
                        </div>
                        <div className="author">
                            <div className="author-avatar pl-1">J</div>
                            <div className="author-info">
                                <div className="name">James Wilson</div>
                                <div className="role">B777 Captain</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="quote">
                            "I found my current flight instructor through Flyrr. It's the best continuous networking tool for student pilots."
                        </div>
                        <div className="author">
                            <div className="author-avatar pl-2">E</div>
                            <div className="author-info">
                                <div className="name">Elena Rodriguez</div>
                                <div className="role">Student Pilot</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="quote">
                            "The flight log feature beautifully showcases my trips. It's like a digital resume that actually looks good."
                        </div>
                        <div className="author">
                            <div className="author-avatar pl-3">M</div>
                            <div className="author-info">
                                <div className="name">Marcus Chen</div>
                                <div className="role">Private Pilot</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .testimonials-section {
                    padding: 100px 0;
                    background: white;
                }
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 32px;
                }
                .testimonial-card {
                    background: var(--bg-secondary);
                    padding: 32px;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .quote {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--text-primary);
                    margin-bottom: 24px;
                    font-weight: 500;
                }
                .author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .author-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                }
                .pl-1 { background: #1e293b; }
                .pl-2 { background: #0ea5e9; }
                .pl-3 { background: #6366f1; }

                .author-info .name {
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .author-info .role {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
