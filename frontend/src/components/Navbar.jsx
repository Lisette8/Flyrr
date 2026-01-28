import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Icon from './Icon';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../lib/axios';
import { socket } from '../lib/socket';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Notification state
    const { authUser } = useAuth(); // We need to know if user is logged in
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch notifications and listen for socket events
    useEffect(() => {
        if (!authUser) return;

        const fetchNotifications = async () => {
            try {
                const res = await axiosInstance.get('/notifications');
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        fetchNotifications();

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Optional: Show toast
        };

        socket.on('newNotification', handleNewNotification);

        return () => {
            socket.off('newNotification', handleNewNotification);
        };
    }, [authUser]);

    const handleMarkRead = async (id) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);

            if (id === 'all') {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            } else {
                setNotifications(prev => prev.map(n => n._id === id ? ({ ...n, isRead: true }) : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification read', error);
        }
    };

    const handleLogout = () => {
        // ... handled in parent or we need auth context methods if we want to logout here
        // ideally we just link to a logout route or use the existing logout button
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <div className="logo">
                    <Link to={authUser ? "/home" : "/"}>Flyrr</Link>
                </div>

                <div className="desktop-links">
                    <a href="#features">Features</a>
                    <a href="#testimonials">Community</a>
                    <a href="#pricing">Pricing</a>
                </div>

                <div className="nav-actions">
                    {authUser ? (
                        <>
                            {/* Notification Bell */}
                            <div className="notification-wrapper">
                                <button
                                    className="btn-icon"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Icon name="bell" size={24} />
                                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                </button>

                                {showNotifications && (
                                    <NotificationDropdown
                                        notifications={notifications}
                                        onClose={() => setShowNotifications(false)}
                                        onMarkRead={handleMarkRead}
                                    />
                                )}
                            </div>

                            <Link to={`/profile/${authUser.username}`} className="nav-profile-link">
                                {authUser.username}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-text">Sign In</Link>
                            <Link to="/signup" className="btn-primary small">Get Started</Link>
                        </>
                    )}

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
                        {authUser ? (
                            <Link to="/home" className="btn-primary full">Go to Feed</Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-text full">Sign In</Link>
                                <Link to="/signup" className="btn-primary full">Get Started</Link>
                            </>
                        )}
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
                .logo a { color: inherit; text-decoration: none; }
                
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

                /* Notification Styles */
                .notification-wrapper {
                    position: relative;
                }
                
                .btn-icon {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                }
                
                .notification-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: var(--error);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                }
                
                .nav-profile-link {
                    font-weight: 600;
                    color: var(--text-primary);
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
