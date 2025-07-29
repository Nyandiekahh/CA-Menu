import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for smooth UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - in real app, this would validate against backend
    const user = {
      id: 1,
      name: formData.email.includes('@') 
        ? formData.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Staff Member',
      email: formData.email,
      role: formData.role
    };
    setIsLoading(false);
    onLogin(user);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🏛️</div>
          <h1 className="login-title">CA Kenya Staff Portal</h1>
          <p className="login-subtitle">
            Communications Authority of Kenya<br/>
            Staff Meal Ordering System
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your official email"
              disabled={isLoading}
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
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Access Level</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="customer">Staff Member</option>
              <option value="admin">Kitchen Administrator</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;