import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApiService from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      if (ApiService.isAuthenticated()) {
        const userData = ApiService.getUser();
        setUser(userData);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading CA Kenya Staff Portal...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Show login if no user
  if (!user) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Show appropriate dashboard based on user role
  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      {user.is_kitchen_admin ? (
        <AdminDashboard user={user} />
      ) : (
        <CustomerDashboard user={user} />
      )}
    </div>
  );
}

export default App;