import React from 'react';
import Icon from './Icon';

const Cta = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-box">
                    <div className="cta-content">
                        <h2>Ready to earn your wings?</h2>
                        <p>Join the waitlist today and get early access to the future of aviation networking.</p>

                        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <Icon name="plane" size={20} className="input-icon" />
                                <input type="email" placeholder="Enter your email address" required />
                            </div>
                            <button type="submit" className="btn-primary">Request Access</button>
                        </form>
                        <div className="form-note">
                            <Icon name="check" size={14} /> No spam, unsubscribe anytime.
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cta-section {
                    padding: 80px 0;
                }
                .cta-box {
                    background: var(--text-primary);
                    color: white;
                    border-radius: 24px;
                    padding: 80px 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Abstract background pattern */
                .cta-box::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%);
                    pointer-events: none;
                }

                .cta-content {
                    position: relative;
                    z-index: 1;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .cta-box h2 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 16px;
                }
                .cta-box p {
                    color: rgba(255,255,255,0.8);
                    font-size: 1.1rem;
                    margin-bottom: 40px;
                }

                .cta-form {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .input-group {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-tertiary);
                }
                .cta-form input {
                    width: 100%;
                    background: white;
                    border: none;
                    padding: 16px 16px 16px 48px;
                    border-radius: var(--radius-full);
                    font-size: 1rem;
                    outline: none;
                }
                .cta-form .btn-primary {
                    background: var(--bg-tertiary); /* Lighter gray/white for contrast against dark bg */
                    color: var(--text-primary);
                    white-space: nowrap;
                }
                 .cta-form .btn-primary:hover {
                    background: white;
                }

                .form-note {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                @media (max-width: 600px) {
                    .cta-form {
                        flex-direction: column;
                    }
                    .cta-box {
                        padding: 40px 24px;
                    }
                }
            `}</style>
        </section>
    );
};

export default Cta;
