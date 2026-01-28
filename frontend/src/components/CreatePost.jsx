import React, { useState, useRef } from 'react';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Post text is required');
      return;
    }

    if (text.length > 2000) {
      toast.error('Post cannot exceed 2000 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/posts', { text, image });
      onPostCreated(res.data);
      setText('');
      setImage(null);
      setImagePreview('');
      toast.success('Post created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening in aviation today?"
          disabled={loading}
          maxLength={2000}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
            >
              ×
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <div className="left-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={loading}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Add image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <span className="char-counter">
              {text.length}/2000
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !text.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      <style>{`
        .create-post {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          border: 1px solid var(--border-light);
        }

        .create-post textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }

        .create-post textarea:focus {
          outline: none;
          border-color: var(--text-primary);
        }

        .create-post textarea:disabled {
          background: var(--bg-tertiary);
          cursor: not-allowed;
        }

        .image-preview {
          position: relative;
          margin-bottom: 12px;
          border-radius: 8px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border-radius: 50%;
          font-size: 24px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .remove-image:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .create-post-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .left-actions {
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
          transition: background 0.2s, color 0.2s;
        }

        .btn-icon:hover:not(:disabled) {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .btn-icon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .char-counter {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default CreatePost;
