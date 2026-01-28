import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

const NotificationDropdown = ({ notifications, onClose, onMarkRead }) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await onMarkRead(notification._id);
            }

            onClose();

            if (notification.type === 'new_message') {
                navigate(`/messages/${notification.sender._id}`);
            } else if (notification.type === 'like_post' || notification.type === 'comment_post') {
                // Navigate to post via ProfilePage or Feed? ideally we have a dedicated post page /post/:id
                // For now, let's navigate to the sender's profile or home
                navigate(`/profile/${notification.recipient.username}`); // Simple workaround: go to your own profile to see notifications?? No.
                // Better: Scroll to post? Hard.
                // Let's assume we view it on home for now.
                navigate('/home');
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const getNotificationText = (notification) => {
        const username = notification.sender.username;
        switch (notification.type) {
            case 'like_post':
                return <span><b>{username}</b> liked your post.</span>;
            case 'comment_post':
                return <span><b>{username}</b> commented on your post.</span>;
            case 'reaction_comment':
                return <span><b>{username}</b> reacted to your comment.</span>;
            case 'new_message':
                return <span><b>{username}</b> sent you a message.</span>;
            default:
                return <span>New notification from <b>{username}</b>.</span>;
        }
    };

    return (
        <div className="notification-dropdown" ref={dropdownRef}>
            <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="mark-all-btn" onClick={() => onMarkRead('all')}>
                    Mark all read
                </button>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="empty-notifications">No notifications yet</div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="notification-avatar">
                                {notification.sender.profilePic ? (
                                    <img src={notification.sender.profilePic} alt={notification.sender.username} />
                                ) : (
                                    <span>{notification.sender.username.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="notification-content">
                                <p>{getNotificationText(notification)}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {!notification.isRead && <div className="unread-dot" />}
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 360px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid var(--border-light);
          margin-top: 12px;
          z-index: 1000;
          overflow: hidden;
          animation: fadeIn 0.1s ease-out;
        }

        .dropdown-header {
            padding: 16px;
            border-bottom: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dropdown-header h3 {
            font-size: 1rem;
            font-weight: 700;
            margin: 0;
        }

        .mark-all-btn {
            font-size: 0.8rem;
            color: var(--text-primary);
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }

        .mark-all-btn:hover {
            text-decoration: underline;
        }

        .notifications-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .empty-notifications {
            padding: 40px;
            text-align: center;
            color: var(--text-secondary);
        }

        .notification-item {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
        }

        .notification-item:hover {
            background: var(--bg-secondary);
        }

        .notification-item.unread {
            background: rgba(var(--text-primary-rgb), 0.03); /* Slight tint for unread? Or keep it white */
            /* Maybe bold text instead? */
        }
        
        .notification-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--text-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
            overflow: hidden;
        }

        .notification-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .notification-content {
            flex: 1;
        }

        .notification-content p {
            font-size: 0.9rem;
            line-height: 1.4;
            margin-bottom: 4px;
            color: var(--text-secondary);
        }
        
        .notification-content p b {
            color: var(--text-primary);
        }

        .notification-time {
            font-size: 0.75rem;
            color: var(--text-tertiary);
        }
        
        .unread-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--error);
            flex-shrink: 0;
        }
      `}</style>
        </div>
    );
};

export default NotificationDropdown;
