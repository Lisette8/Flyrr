import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="brand-name">Flyrr</div>
                        <p>© 2024 Flyrr Inc. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </div>
            <style>{`
                .footer {
                    padding: 40px 0;
                    border-top: 1px solid var(--border-light);
                    background: var(--bg-secondary);
                }
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand-name {
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                .footer-brand p {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .footer-links {
                    display: flex;
                    gap: 24px;
                }
                .footer-links a {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                .footer-links a:hover {
                    color: var(--text-primary);
                }
                
                @media (max-width: 600px) {
                    .footer-content {
                        flex-direction: column;
                        gap: 24px;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
