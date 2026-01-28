import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../lib/axios';
import { socket } from '../lib/socket';
import toast from 'react-hot-toast';
import UserSearch from '../components/UserSearch';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

function MessagesPage() {
  const { userId } = useParams();
  const { authUser, logout } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
    fetchSuggestions();
  }, [selectedUser]); // Fetch data when selectedUser changes (e.g. to update read status or order)

  // Stable socket listener for online users
  useEffect(() => {
    // Request online users list by announcing presence again
    if (authUser) {
      socket.emit('userOnline', authUser._id);
    }

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [authUser]);

  // Socket listener for new messages (depends on selectedUser)
  useEffect(() => {
    const handleNewMessage = (message) => {
      try {
        const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
        const receiverId = typeof message.receiverId === 'object' ? message.receiverId._id : message.receiverId;

        // If the message belongs to the currently selected conversation, add it
        if (selectedUser &&
          (senderId === selectedUser._id || receiverId === selectedUser._id)) {
          setMessages((prev) => [...prev, message]);
        }

        // Always refresh conversations list to update previews/order
        fetchConversations();
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedUser]);

  useEffect(() => {
    if (userId) {
      fetchUserAndMessages(userId);
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get('/messages/chats');
      setConversations(res.data);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axiosInstance.get('/messages/contacts');
      setSuggestions(res.data.filter(user => user._id !== authUser._id));
    } catch (error) {
      console.error('Failed to load suggestions');
    }
  };

  const fetchUserAndMessages = async (uid) => {
    try {
      // Get user info from conversations or search
      const userRes = await axiosInstance.get(`/users/search?q=${uid}`);
      if (userRes.data.length > 0) {
        setSelectedUser(userRes.data[0]);
      }

      // Get messages
      const messagesRes = await axiosInstance.get(`/messages/${uid}`);
      setMessages(messagesRes.data);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const handleSelectConversation = (user) => {
    setSelectedUser(user);
    navigate(`/messages/${user._id}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="messages-page">
      {/* Top Navigation */}
      <nav className="messages-nav">
        <div className="messages-nav-content">
          <Link to="/home" className="nav-logo">
            Flyrr
          </Link>
          <div className="nav-actions">
            <Link to="/home" className="nav-link">Home</Link>
            <button onClick={handleLogout} className="btn-text">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="messages-container">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <UserSearch onSelectUser={handleSelectConversation} />
          </div>
          <ConversationList
            conversations={conversations}
            suggestions={suggestions}
            onlineUsers={onlineUsers}
            selectedUser={selectedUser}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Area */}
        <div className="messages-main">
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              messages={messages}
              onlineUsers={onlineUsers}
              onMessageSent={(msg) => setMessages([...messages, msg])}
            />
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation or search for a user to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .messages-page {
          min-height: 100vh;
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
        }

        .messages-nav {
          background: white;
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .messages-nav-content {
          max-width: 100%;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .messages-container {
          display: flex;
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          height: calc(100vh - 64px);
        }

        .messages-sidebar {
          width: 360px;
          background: white;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .messages-main {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .no-chat-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          padding: 40px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .messages-sidebar {
            width: 100%;
            ${selectedUser ? 'display: none;' : ''}
          }
          
          .messages-main {
            ${!selectedUser ? 'display: none;' : ''}
          }
        }
      `}</style>
    </div>
  );
}

export default MessagesPage;
