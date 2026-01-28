import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';

function ProfilePage() {
  const { username } = useParams();
  const { authUser, updateProfile } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isOwnProfile = authUser?.username === username;

  useEffect(() => {
    fetchUserPosts();
  }, [username]);

  const fetchUserPosts = async () => {
    try {
      const res = await axiosInstance.get(`/posts/user/${username}`);
      setUserPosts(res.data);
    } catch (error) {
      toast.error('Failed to load user posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      setUploadingImage(true);
      try {
        await updateProfile({ profilePicture: e.target.result });
        toast.success('Profile picture updated');
        setShowEditModal(false);
      } catch (error) {
        toast.error('Failed to update profile picture');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostDeleted = (postId) => {
    setUserPosts(userPosts.filter((post) => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setUserPosts(
      userPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <div className="profile-nav-content">
          <button onClick={() => navigate('/home')} className="back-btn">
            ← Back
          </button>
          <Link to="/home" className="nav-logo">
            Flyrr
          </Link>
          <div style={{ width: '60px' }} />
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {authUser?.profilePic ? (
              <img src={authUser.profilePic} alt={username} />
            ) : (
              <span>{username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h1 className="profile-username">{username}</h1>
          {isOwnProfile && (
            <button
              className="edit-profile-btn"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-posts">
          <h2 className="section-title">Posts</h2>
          {loading ? (
            <div className="loading-state">Loading posts...</div>
          ) : userPosts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet</p>
            </div>
          ) : (
            <div className="posts-grid">
              {userPosts.map((post) => (
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
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => !uploadingImage && setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <p>Upload a new profile picture</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              style={{ display: 'none' }}
            />
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Choose Image'}
              </button>
              <button
                className="btn-text"
                onClick={() => setShowEditModal(false)}
                disabled={uploadingImage}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .profile-nav {
          background: white;
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .profile-nav-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn {
          font-weight: 600;
          color: var(--text-primary);
          transition: opacity 0.2s;
        }

        .back-btn:hover {
          opacity: 0.7;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .profile-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 24px;
        }

        .profile-header {
          background: white;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          border: 1px solid var(--border-light);
          margin-bottom: 24px;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--text-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 auto 16px;
          overflow: hidden;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-username {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .edit-profile-btn {
          padding: 10px 24px;
          background: var(--text-primary);
          color: white;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }

        .edit-profile-btn:hover {
          opacity: 0.9;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .posts-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
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

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
        }

        .modal-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .modal-content p {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-actions button {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
