import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { register, error: authError, clearError, user } = useAuth();
  const navigate = useNavigate();

  // Clear errors on initial load
  useEffect(() => {
    clearError();
    setValidationError('');
  }, []);

  // Redirect if user logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
  <div className="auth-page">

    {/* Left Section */}
    <div className="auth-branding">
      <div className="auth-badge">
        🚀 Smart Project Management
      </div>

      <h1>TaskMatrix</h1>

      <p>
        Manage projects, organize tasks, collaborate with your team,
        and boost productivity from one powerful workspace.
      </p>

      <ul className="auth-features">
        <li>🚀 Unlimited Projects</li>
        <li>📋 Task Management</li>
        <li>👥 Team Collaboration</li>
        <li>📊 Productivity Analytics</li>
        <li>🔒 Secure Authentication</li>
      </ul>

      <div className="auth-stats">
        <div>
          <h3>5K+</h3>
          <span>Users</span>
        </div>

        <div>
          <h3>1200+</h3>
          <span>Projects</span>
        </div>

        <div>
          <h3>99.9%</h3>
          <span>Uptime</span>
        </div>
      </div>
    </div>

    {/* Right Section */}
    <div className="auth-form-wrapper">
      <div className="glass-panel">

        <h2>Create Account</h2>
        <p className="subtitle">
          Start managing your projects today.
        </p>

        {validationError && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        {authError && (
          <div className="alert alert-error">
            <ShieldAlert size={18} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-container">
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
              <Lock />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: "1rem"
            }}
          >
            Create Account
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </div>

      </div>
    </div>

  </div>
);
};

export default Register;