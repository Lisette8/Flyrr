import React from 'react';

function ConversationList({ conversations, suggestions, onlineUsers, selectedUser, onSelectConversation }) {
  const isOnline = (userId) => onlineUsers.includes(userId);

  // Check if selected user is already in conversations, handling null/undefined safety
  const isSelectedUserInConversations = selectedUser?._id && conversations.some(c => c.user?._id === selectedUser._id);

  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return msgDate.toLocaleDateString();
  };

  return (
    <div className="conversation-list">
      {(conversations.length > 0 || (selectedUser && !isSelectedUserInConversations)) && (
        <div className="list-section">
          <h3 className="list-title">Conversations</h3>

          {/* Optimistically render selected user if not in list */}
          {selectedUser && !isSelectedUserInConversations && (
            <div
              key={selectedUser._id}
              className="conversation-item active"
              onClick={() => onSelectConversation(selectedUser)}
            >
              <div className="conv-avatar">
                {selectedUser.profilePic ? (
                  <img src={selectedUser.profilePic} alt={selectedUser.username} />
                ) : (
                  <span>{selectedUser.username.charAt(0).toUpperCase()}</span>
                )}
                {isOnline(selectedUser._id) && <div className="online-indicator" />}
              </div>
              <div className="conv-info">
                <div className="conv-header">
                  <span className="conv-username">{selectedUser.username}</span>
                </div>
                <p className="conv-last-message">New Conversation</p>
              </div>
            </div>
          )}

          {conversations.map((conv) => {
            if (!conv.user || !conv.user._id) return null;
            return (
              <div
                key={conv.user._id}
                className={`conversation-item ${selectedUser?._id === conv.user._id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conv.user)}
              >
                <div className="conv-avatar">
                  {conv.user.profilePic ? (
                    <img src={conv.user.profilePic} alt={conv.user.username} />
                  ) : (
                    <span>{conv.user.username.charAt(0).toUpperCase()}</span>
                  )}
                  {isOnline(conv.user._id) && <div className="online-indicator" />}
                </div>
                <div className="conv-info">
                  <div className="conv-header">
                    <span className="conv-username">{conv.user.username}</span>
                    <span className="conv-time">
                      {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  <p className="conv-last-message">
                    {conv.lastMessage?.text || (conv.lastMessage?.image ? 'Image' : 'Message')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="list-section">
          <h3 className="list-title">Suggested</h3>
          {suggestions.map((user) => (
            // Don't show if already in conversations and don't show if currently selected (it's shown above)
            (!conversations.find(c => c.user?._id === user._id) && selectedUser?._id !== user._id) && (
              <div
                key={user._id}
                className="conversation-item"
                onClick={() => onSelectConversation(user)}
              >
                <div className="conv-avatar">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.username} />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                  {isOnline(user._id) && <div className="online-indicator" />}
                </div>
                <div className="conv-info">
                  <div className="conv-header">
                    <span className="conv-username">{user.username}</span>
                  </div>
                  <p className="conv-last-message">Start a conversation</p>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {conversations.length === 0 && (!suggestions || suggestions.length === 0) && !selectedUser && (
        <div className="empty-conversations">No conversations yet</div>
      )}

      <style>{`
        .conversation-list {
          flex: 1;
          overflow-y: auto;
        }

        .list-section {
          padding-bottom: 16px;
        }

        .list-title {
           padding: 12px 20px 8px;
           font-size: 0.75rem;
           text-transform: uppercase;
           color: var(--text-tertiary);
           font-weight: 700;
           letter-spacing: 0.05em;
        }

        .empty-conversations {
          padding: 40px 20px;
          text-align: center;
          color: var(--text-secondary);
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .conversation-item:hover {
          background: var(--bg-secondary);
        }

        .conversation-item.active {
          background: var(--bg-tertiary);
        }

        .conv-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--text-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          overflow: visible; /* Changed from hidden to visible for indicator */
          flex-shrink: 0;
        }

        /* Ensure image doesn't overflow if we use overflow:visible on parent */
        .conv-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          background: var(--success);
          border: 2px solid white;
          border-radius: 50%;
          box-sizing: border-box; /* Ensures border is included in size */
          z-index: 10;
        }

        .conv-info {
          flex: 1;
          min-width: 0;
        }

        .conv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .conv-username {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .conv-time {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .conv-last-message {
          font-size: 0.85rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}

export default ConversationList;
