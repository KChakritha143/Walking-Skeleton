import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { login, error: authError, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Clear any leftover auth errors from prior attempts
  useEffect(() => {
    clearError();
    setValidationError('');
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  return (
  <div className="auth-page">

    <div className="auth-branding">
      <div className="auth-badge">
        🚀 Welcome Back
      </div>

      <h1>TaskMatrix</h1>

      <p>
        Organize projects, collaborate with teams,
        and manage tasks efficiently from one place.
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

    <div className="auth-form-wrapper">
      <div className="glass-panel">

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Securely log in to access your dashboard.
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
            <label>Email Address</label>
            <div className="input-container">
              <input
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
            <label>Password</label>
            <div className="input-container">
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </div>

      </div>
    </div>

  </div>
);
};
export default Login;