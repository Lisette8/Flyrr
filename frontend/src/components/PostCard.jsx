import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import CommentSection from './CommentSection';

function PostCard({ post, currentUser, onDelete, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  
  // State for the custom confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.post(`/posts/${post._id}/like`);
      setIsLiked(res.data.likes.includes(currentUser._id));
      setLikesCount(res.data.likes.length);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const confirmDeletePost = async () => {
    const deletePromise = axiosInstance.delete(`/posts/${post._id}`);

    toast.promise(deletePromise, {
      loading: 'Deleting your post...',
      success: () => {
        onDelete(post._id);
        setShowDeleteModal(false);
        return 'Post deleted successfully';
      },
      error: 'Failed to delete post',
    });
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="post-card">
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-danger">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                 <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
               </svg>
            </div>
            <h3>Delete Post?</h3>
            <p>This will permanently remove this post and all its comments. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Keep Post</button>
              <button className="confirm-btn" onClick={confirmDeletePost}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      <div className="post-header">
        <div className="post-author">
          <Link to={`/profile/${post.author?.username}`} className="author-avatar">
            {post.author?.profilePic ? (
              <img src={post.author.profilePic} alt={post.author.username} />
            ) : (
              <span>{post.author?.username?.charAt(0).toUpperCase()}</span>
            )}
          </Link>
          <div className="author-info">
            <Link to={`/profile/${post.author?.username}`} className="author-name">
              {post.author?.username}
            </Link>
            <span className="post-time">{formatTime(post.createdAt)}</span>
          </div>
        </div>

        {currentUser?._id === post.author?._id && (
          <button onClick={() => setShowDeleteModal(true)} className="delete-btn" title="Delete post">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>

      <div className="post-content">
        <p className="post-text">{post.text}</p>
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post content" />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`action-btn ${isLiked ? 'liked' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="action-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          currentUser={currentUser}
          onUpdate={onUpdate}
        />
      )}

      <style>{`

      /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .confirm-modal {
          background: white;
          width: 100%;
          max-width: 400px;
          padding: 32px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: modalSlide 0.3s ease-out;
        }

        @keyframes modalSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-icon-danger {
          width: 50px;
          height: 50px;
          background: #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .confirm-modal h3 { font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 8px; }
        .confirm-modal p { color: #666; line-height: 1.5; font-size: 0.95rem; margin-bottom: 24px; }

        .modal-actions { display: flex; gap: 12px; }
        .cancel-btn, .confirm-btn {
          flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
        }

        .cancel-btn { background: #f3f4f6; color: #4b5563; }
        .cancel-btn:hover { background: #e5e7eb; }

        .confirm-btn { background: #ef4444; color: white; }
        .confirm-btn:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }

        /* POST CARD STYLES */
        .post-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          margin-bottom: 20px;
        }

        .delete-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 8px;
          border-radius: 50%;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }
          
        .post-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid var(--border-light);
        }

        .post-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .post-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
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
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          transition: opacity 0.2s;
        }

        .author-name:hover {
          opacity: 0.7;
        }

        .post-time {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .delete-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background 0.2s, color 0.2s;
        }

        .delete-btn:hover {
          background: var(--bg-secondary);
          color: #ef4444;
        }

        .post-content {
          margin-bottom: 16px;
        }

        .post-text {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 12px;
        }

        .post-image {
          border-radius: 12px;
          overflow: hidden;
          margin-top: 12px;
        }

        .post-image img {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }

        .post-actions {
          display: flex;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: background 0.2s, color 0.2s;
        }

        .action-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .action-btn.liked {
          color: #ef4444;
        }

        .action-btn span {
          min-width: 16px;
        }
      `}</style>
    </div>
  );
}

export default PostCard;
