import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

function ChatWindow({ selectedUser, messages, onlineUsers, onMessageSent }) {
  const { authUser } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        text,
        image,
      });
      onMessageSent(res.data);
      setText('');
      setImage(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-user">
          <div className="chat-avatar">
            {selectedUser.profilePic ? (
              <img src={selectedUser.profilePic} alt={selectedUser.username} />
            ) : (
              <span>{selectedUser.username.charAt(0).toUpperCase()}</span>
            )}
            {isOnline && <div className="online-dot" />}
          </div>
          <div>
            <div className="chat-username">{selectedUser.username}</div>
            <div className="chat-status">{isOnline ? 'Online' : 'Offline'}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const msgSenderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
            const isOwn = msgSenderId === authUser._id;
            return (
              <div key={msg._id} className={`message ${isOwn ? 'own' : ''}`}>
                <div className="message-bubble">
                  {msg.image && msg.image !== "" && (
                    <img src={msg.image} alt="Message" className="message-image" />
                  )}
                  {msg.text && msg.text !== "" && <p className="message-text">{msg.text}</p>}
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="chat-input">
        {imagePreview && (
          <div className="image-preview-small">
            <img src={imagePreview} alt="Preview" />
            <button type="button" onClick={() => { setImage(null); setImagePreview(''); }}>×</button>
          </div>
        )}
        <div className="input-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-icon"
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || (!text.trim() && !image)} className="send-btn">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>

      <style>{`
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-light);
        }

        .chat-header-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--text-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          overflow: hidden;
        }

        .chat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: var(--success);
          border: 2px solid white;
          border-radius: 50%;
          box-sizing: border-box;
          z-index: 10;
        }

        .chat-username {
          font-weight: 600;
          font-size: 1rem;
        }

        .chat-status {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--bg-secondary);
        }

        .no-messages {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .message {
          display: flex;
        }

        .message.own {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 12px;
          background: white;
        }

        .message.own .message-bubble {
          background: var(--text-primary);
          color: white;
        }

        .message-image {
          width: 100%;
          max-width: 300px;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .message-text {
          font-size: 0.95rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          display: block;
          margin-top: 4px;
        }

        .chat-input {
          padding: 16px 24px;
          border-top: 1px solid var(--border-light);
          background: white;
        }

        .image-preview-small {
          position: relative;
          width: 80px;
          margin-bottom: 8px;
        }

        .image-preview-small img {
          width: 100%;
          border-radius: 8px;
        }

        .image-preview-small button {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0,0,0,0.7);
          color: white;
          font-size: 18px;
        }

        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background 0.2s;
        }

        .btn-icon:hover:not(:disabled) {
          background: var(--bg-secondary);
        }

        .input-row input[type="text"] {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid var(--border-light);
          border-radius: 20px;
          font-size: 0.95rem;
        }

        .input-row input[type="text"]:focus {
          outline: none;
          border-color: var(--text-primary);
        }

        .send-btn {
          padding: 10px 20px;
          background: var(--text-primary);
          color: white;
          border-radius: 20px;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;
