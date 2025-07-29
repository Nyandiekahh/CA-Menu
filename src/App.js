import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      {user.role === 'admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <CustomerDashboard user={user} />
      )}
    </div>
  );
}

export default App;