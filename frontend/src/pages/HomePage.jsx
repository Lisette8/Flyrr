import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../lib/axios';
import { socket } from '../lib/socket';
import toast from 'react-hot-toast';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

function HomePage() {
  const { authUser, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    
    // Socket event listeners
    const handleNewPost = (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    };

    const handlePostDeleted = ({ postId }) => {
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    };

    const handlePostLiked = ({ postId, likesCount, likes }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes, likesCount } : post
        )
      );
    };

    const handleNewComment = ({ postId, comment, commentsCount }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, comment], commentsCount }
            : post
        )
      );
    };

    socket.on('newPost', handleNewPost);
    socket.on('postDeleted', handlePostDeleted);
    socket.on('postLiked', handlePostLiked);
    socket.on('newComment', handleNewComment);

    return () => {
      socket.off('newPost', handleNewPost);
      socket.off('postDeleted', handlePostDeleted);
      socket.off('postLiked', handlePostLiked);
      socket.off('newComment', handleNewComment);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/posts');
      setPosts(res.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <nav className="app-nav">
        <div className="app-nav-content">
          <Link to="/home" className="app-logo">
            Flyrr
          </Link>

          <div className="app-nav-actions">
            <Link to="/messages" className="nav-link-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
            <div className="profile-menu-wrapper">
              <button
                className="profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {authUser?.profilePic ? (
                    <img src={authUser.profilePic} alt={authUser.username} />
                  ) : (
                    <span>{authUser?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="profile-username">{authUser?.username}</span>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <Link
                    to={`/profile/${authUser?.username}`}
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        <div className="feed-container">
          <CreatePost onPostCreated={handlePostCreated} />

          {loading ? (
            <div className="loading-state">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Be the first to share something</p>
            </div>
          ) : (
            <div className="posts-feed">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={authUser}
                  onDelete={handlePostDeleted}
                  onUpdate={handlePostUpdated}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .app-layout {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .app-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          border-bottom: 1px solid var(--border-light);
        }

        .app-nav-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .app-logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          transition: opacity 0.2s;
        }

        .app-logo:hover {
          opacity: 0.7;
        }

        .profile-menu-wrapper {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          transition: background 0.2s;
        }

        .profile-button:hover {
          background: var(--bg-secondary);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--text-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-username {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          min-width: 180px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: background 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: var(--bg-secondary);
        }

        .app-main {
          padding: 24px;
        }

        .feed-container {
          max-width: 680px;
          margin: 0 auto;
        }

        .loading-state,
        .empty-state {
          background: white;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
        }

        .posts-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .nav-link-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background 0.2s, color 0.2s;
        }

        .nav-link-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .profile-username {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
