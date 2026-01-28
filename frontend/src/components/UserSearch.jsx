import React, { useState } from 'react';
import axiosInstance from '../lib/axios';

function UserSearch({ onSelectUser }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/search?q=${value}`);
      setResults(res.data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    onSelectUser(user);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="user-search">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
        className="search-input"
      />
      
      {showResults && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length === 0 ? (
            <div className="search-empty">No users found</div>
          ) : (
            results.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => handleSelectUser(user)}
              >
                <div className="result-avatar">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.username} />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="result-username">{user.username}</span>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .user-search {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--text-primary);
        }

        .search-results {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .search-loading,
        .search-empty {
          padding: 16px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-result-item:hover {
          background: var(--bg-secondary);
        }

        .result-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--text-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          overflow: hidden;
          flex-shrink: 0;
        }

        .result-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .result-username {
          font-weight: 500;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

export default UserSearch;
