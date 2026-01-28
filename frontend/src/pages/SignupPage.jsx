import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            Flyrr
          </Link>
          <h1>Create your account</h1>
          <p>Join the aviation community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          padding: 24px;
        }

        .auth-container {
          background: white;
          border-radius: 16px;
          padding: 48px;
          max-width: 440px;
          width: 100%;
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-logo {
          display: inline-block;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 24px;
          transition: opacity 0.2s;
        }

        .auth-logo:hover {
          opacity: 0.7;
        }

        .auth-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input {
          padding: 12px 16px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--text-primary);
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
        }

        .form-group input:disabled {
          background: var(--bg-tertiary);
          cursor: not-allowed;
        }

        .btn-primary.full {
          width: 100%;
          margin-top: 8px;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .auth-footer a {
          color: var(--text-primary);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .auth-footer a:hover {
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .auth-container {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default SignupPage;
