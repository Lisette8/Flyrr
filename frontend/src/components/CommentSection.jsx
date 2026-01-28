import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const REACTIONS = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'angry', emoji: '😠' },
  { type: 'sad', emoji: '😢' },
];

function CommentSection({ postId, comments, currentUser, onUpdate }) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.error('Comment cannot be empty');

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comment`, { text: commentText });
      onUpdate(res.data);
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    const deletePromise = axiosInstance.delete(`/posts/${postId}/comment/${commentToDelete}`);
    
    toast.promise(deletePromise, {
      loading: 'Deleting...',
      success: (res) => {
        onUpdate(res.data);
        setCommentToDelete(null);
        return 'Comment removed';
      },
      error: 'Failed to delete',
    });
  };

  const handleReaction = async (commentId, reactionType) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comment/${commentId}/react`, { type: reactionType });
      onUpdate(res.data);
      setShowReactions(null);
    } catch (error) {
      toast.error('Failed to react');
    }
  };

  const getReactionCounts = (reactions = []) => {
    const counts = {};
    reactions.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
    return counts;
  };

  const formatTime = (date) => {
    const diffMins = Math.floor((new Date() - new Date(date)) / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="comment-section">
      {/* --- CUSTOM MODAL --- */}
      {commentToDelete && (
        <div className="modal-overlay" onClick={() => setCommentToDelete(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Comment?</h3>
            <p>This will permanently remove your message.</p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setCommentToDelete(null)}>Cancel</button>
              <button className="modal-btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-wrapper">
            <Link to={`/profile/${comment.user?.username}`} className="comment-avatar">
              {comment.user?.profilePic ? (
                <img src={comment.user.profilePic} alt="" />
              ) : (
                <span>{comment.user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </Link>

            <div className="comment-main">
              <div className="comment-bubble">
                <div className="comment-header">
                  <Link to={`/profile/${comment.user?.username}`} className="comment-author">
                    {comment.user?.username}
                  </Link>
                  <span className="comment-time">{formatTime(comment.createdAt)}</span>
                  {currentUser?._id === comment.user?._id && (
                    <button onClick={() => setCommentToDelete(comment._id)} className="delete-icon-btn">×</button>
                  )}
                </div>
                <p className="comment-text">{comment.text}</p>
                
                {/* Floating Reaction Badges */}
                {comment.reactions?.length > 0 && (
                  <div className="reaction-summary">
                    {Object.entries(getReactionCounts(comment.reactions)).map(([type, count]) => (
                      <span key={type} className="badge">
                        {REACTIONS.find(r => r.type === type)?.emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="comment-footer">
                <div className="reaction-container">
                  <button 
                    className="action-link" 
                    onClick={() => setShowReactions(showReactions === comment._id ? null : comment._id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path><path d="M9 15a5 5 0 0 0 6 0"></path></svg>
                    React
                  </button>

                  {showReactions === comment._id && (
                    <div className="reaction-picker-popover">
                      {REACTIONS.map((r) => (
                        <button key={r.type} onClick={() => handleReaction(comment._id, r.type)} className="picker-emoji">
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="add-comment-form">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !commentText.trim()}>
          {loading ? '...' : 'Post'}
        </button>
      </form>

      <style>{`
        .comment-section { margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
        .comment-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
        .comment-wrapper { display: flex; gap: 12px; transition: transform 0.2s; }
        
        .comment-avatar { width: 36px; height: 36px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; overflow: hidden; }
        .comment-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .comment-main { flex: 1; position: relative; }
        .comment-bubble { background: #f0f2f5; padding: 10px 14px; border-radius: 18px; position: relative; }
        
        .comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .comment-author { font-weight: 700; font-size: 0.85rem; color: #1c1e21; text-decoration: none; }
        .comment-time { font-size: 0.75rem; color: #65676b; }
        
        .delete-icon-btn { margin-left: auto; background: none; border: none; font-size: 1.2rem; color: #65676b; cursor: pointer; line-height: 1; }
        .delete-icon-btn:hover { color: #ff4d4d; }

        .comment-text { font-size: 0.95rem; color: #1c1e21; line-height: 1.3; margin: 0; }

        /* Reaction Badges */
        .reaction-summary { position: absolute; bottom: -10px; right: 8px; display: flex; gap: 2px; }
        .badge { background: white; border: 1px solid #e4e6eb; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

        /* Footer & Reaction Picker */
        .comment-footer { display: flex; gap: 15px; margin-top: 4px; padding-left: 10px; }
        .action-link { background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #65676b; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .action-link:hover { text-decoration: underline; }

        .reaction-container { position: relative; }
        .reaction-picker-popover { position: absolute; bottom: 120%; left: 0; background: white; padding: 5px 10px; border-radius: 30px; display: flex; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #eee; z-index: 10; animation: pop 0.2s ease-out; }
        .picker-emoji { background: none; border: none; font-size: 1.4rem; cursor: pointer; transition: transform 0.2s; }
        .picker-emoji:hover { transform: scale(1.3); }

        @keyframes pop { from { opacity: 0; transform: translateY(10px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* Add Comment Form */
        .add-comment-form { display: flex; gap: 10px; align-items: center; }
        .add-comment-form input { flex: 1; background: #f0f2f5; border: none; padding: 10px 16px; border-radius: 20px; outline: none; }
        .add-comment-form button { background: none; border: none; color: #0084ff; font-weight: 700; cursor: pointer; }

        /* Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; }
        .confirm-modal { background: white; padding: 24px; border-radius: 12px; max-width: 320px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .modal-btn-cancel { flex: 1; padding: 10px; border: none; border-radius: 6px; background: #f0f2f5; font-weight: 600; cursor: pointer; }
        .modal-btn-delete { flex: 1; padding: 10px; border: none; border-radius: 6px; background: #ff4d4d; color: white; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}

export default CommentSection;