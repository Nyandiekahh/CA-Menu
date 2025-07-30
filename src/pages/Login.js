import React, { useState } from 'react';
import ApiService from '../services/api';

const Login = ({ onLogin }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'verify', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    employeeId: '',
    department: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (currentView === 'login') {
        const response = await ApiService.login(formData.email, formData.password);
        setMessage('Login successful!');
        onLogin(response.user);
      } 
      else if (currentView === 'register') {
        await ApiService.register({
          email: formData.email,
          username: formData.email.split('@')[0],
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          employee_id: formData.employeeId,
          department: formData.department,
          password: formData.password,
          password_confirm: formData.confirmPassword
        });
        setMessage('Registration successful! Please check your email for verification code.');
        setCurrentView('verify');
      }
      else if (currentView === 'verify') {
        await ApiService.verifyEmail(formData.email, formData.otp);
        setMessage('Email verified successfully! You can now login.');
        setCurrentView('login');
      }
      else if (currentView === 'forgot') {
        await ApiService.forgotPassword(formData.email);
        setMessage('Password reset code sent to your email.');
        setCurrentView('reset');
      }
      else if (currentView === 'reset') {
        await ApiService.resetPassword(
          formData.email, 
          formData.otp, 
          formData.password, 
          formData.confirmPassword
        );
        setMessage('Password reset successful! You can now login.');
        setCurrentView('login');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      employeeId: '',
      department: '',
      otp: ''
    });
    setError('');
    setMessage('');
  };

  const switchView = (view) => {
    setCurrentView(view);
    resetForm();
  };

  // Styles (keeping your beautiful design)
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  };

  const circle1Style = {
    position: 'absolute',
    top: '-10rem',
    right: '-10rem',
    width: '20rem',
    height: '20rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '50%',
    opacity: 0.6
  };

  const circle2Style = {
    position: 'absolute',
    bottom: '-10rem',
    left: '-10rem',
    width: '20rem',
    height: '20rem',
    backgroundColor: '#f0fdf4',
    borderRadius: '50%',
    opacity: 0.6
  };

  const cardContainerStyle = {
    maxWidth: '28rem',
    width: '100%',
    position: 'relative',
    zIndex: 1
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const logoStyle = {
    width: '4rem',
    height: '4rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    fontSize: '1.5rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle = {
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    margin: 0
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '1rem'
  };

  const formGroupStyle = {
    marginBottom: '1.25rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '3rem'
  };

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.875rem',
    padding: '0.5rem 0'
  };

  const messageStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  };

  const spinnerStyle = {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  };

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.name@ca.go.ke"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => switchView('forgot')}
                style={linkButtonStyle}
              >
                Forgot password?
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => switchView('register')}
                style={linkButtonStyle}
              >
                Sign up
              </button>
            </div>
          </>
        );

      case 'register':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.name@ca.go.ke"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+254712345678"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP001"
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="IT Department"
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => switchView('login')}
                style={linkButtonStyle}
              >
                Sign in
              </button>
            </div>
          </>
        );

      case 'verify':
        return (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.name@ca.go.ke"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Verification Code</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit code"
                maxLength="6"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => switchView('login')}
                style={linkButtonStyle}
              >
                Back to login
              </button>
            </div>
          </>
        );

      case 'forgot':
        return (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.name@ca.go.ke"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => switchView('login')}
                style={linkButtonStyle}
              >
                Back to login
              </button>
            </div>
          </>
        );

      case 'reset':
        return (
          <>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.name@ca.go.ke"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Reset Code</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit code"
                maxLength="6"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => switchView('login')}
                style={linkButtonStyle}
              >
                Back to login
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'login': return 'Welcome back';
      case 'register': return 'Create account';
      case 'verify': return 'Verify email';
      case 'forgot': return 'Reset password';
      case 'reset': return 'Set new password';
      default: return 'Welcome back';
    }
  };

  const getButtonText = () => {
    switch (currentView) {
      case 'login': return 'Sign in';
      case 'register': return 'Create account';
      case 'verify': return 'Verify email';
      case 'forgot': return 'Send reset code';
      case 'reset': return 'Reset password';
      default: return 'Sign in';
    }
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          input:focus {
            border-color: #3b82f6 !important;
            background-color: white !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          select:focus {
            border-color: #3b82f6 !important;
            background-color: white !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          button:hover:not(:disabled) {
            background-color: #374151 !important;
          }
          
          button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      </style>
      
      {/* Background Pattern */}
      <div style={backgroundStyle}>
        <div style={circle1Style}></div>
        <div style={circle2Style}></div>
      </div>
      
      <div style={cardContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle}>
            <span>🏛️</span>
          </div>
          <h1 style={titleStyle}>{getTitle()}</h1>
          <p style={subtitleStyle}>
            {currentView === 'login' && 'Sign in to your Communications Authority of Kenya staff meal ordering account'}
            {currentView === 'register' && 'Create your CA Kenya staff account to start ordering meals'}
            {currentView === 'verify' && 'Enter the verification code sent to your email'}
            {currentView === 'forgot' && 'Enter your email to receive a password reset code'}
            {currentView === 'reset' && 'Enter the reset code and your new password'}
          </p>
        </div>

        {/* Form Card */}
        <div style={cardStyle}>
          {/* Messages */}
          {message && <div style={successMessageStyle}>{message}</div>}
          {error && <div style={errorMessageStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {renderForm()}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyle}
            >
              {isLoading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Processing...
                </>
              ) : (
                getButtonText()
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            paddingTop: '1rem',
            borderTop: '1px solid #f3f4f6',
            marginTop: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: 0
            }}>
              Having trouble? Contact IT support at<br/>
              <span style={{color: '#3b82f6'}}>support@ca.go.ke</span>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#d1d5db',
          marginTop: '1rem'
        }}>
          Communications Authority of Kenya • Staff Portal v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;