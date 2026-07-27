import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, User } from 'lucide-react';
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <ShieldCheck size={26} color="#8b5cf6" />
        <span>SecureAuth</span>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <div className="nav-user">
              <User size={16} className="text-muted" />
              <span>{user.name}</span>
              {user.isPro ? (
                <span className="user-badge" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#000', fontWeight: 'bold' }}>Pro Member 👑</span>
              ) : (
                <span className="user-badge">Verified Client</span>
              )}
            </div>
            <button onClick={logout} className="btn btn-secondary btn-icon" title="Log Out">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};
export default Navbar;
