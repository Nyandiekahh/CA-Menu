import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🏛️</div>
          <div>
            <div>CA Kenya Staff Portal</div>
            <div style={{ fontSize: '0.7rem', fontWeight: '400', color: '#718096' }}>
              Communications Authority of Kenya
            </div>
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            {getInitials(user.name)}
          </div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role === 'admin' ? 'Administrator' : 'Staff Member'}</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;