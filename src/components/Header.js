import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const getInitials = (user) => {
    // Handle Django API user structure
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    // Fallback to username or email
    const name = user.username || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  const getFullName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email || 'User';
  };

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #f1f5f9',
      padding: '1rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🏛️
          </div>
          <div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
              lineHeight: 1.2
            }}>
              CA Kenya Staff Portal
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.2
            }}>
              Communications Authority of Kenya
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {getInitials(user)}
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#1e293b',
              margin: 0,
              lineHeight: 1.2
            }}>
              {getFullName(user)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.2
            }}>
              {user.is_kitchen_admin ? 'Kitchen Administrator' : 'Staff Member'}
            </div>
          </div>

          <button 
            onClick={onLogout}
            style={{
              backgroundColor: 'white',
              color: '#ef4444',
              border: '1px solid #ef4444',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#ef4444';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>
        {`
          @media (max-width: 640px) {
            header > div {
              flex-direction: column;
              text-align: center;
            }
            
            header > div > div:last-child {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;