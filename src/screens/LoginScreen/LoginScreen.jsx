import React, { useState } from 'react';
import './LoginScreen.css';

const LoginScreen = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      localStorage.setItem('token', data.token);
  
      // Wait 1 second before transition
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({ username: data.user.username, role: data.user.role, walletAddress: data.user.walletAddress, });
      }, 3000);
  
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };
  

  return (
    <div className="login-wrapper">
      <div className="login-form">
        <div className="login-header">
          <h2>Welcome to Salawat</h2>
          <p className="login-description">
            A decentralized platform that empowers community members and builders to collaborate, manage assets, and grow together in a secure blockchain environment.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="role">Select Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select your role</option>
            <option value="member">Community Member</option>
            <option value="builder">Builder</option>
            <option value="core">Core Member</option>
            <option value="admin">Admin</option>

          </select>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '🙈' : '👁️'} {/* swap with icon font or SVG if preferred */}
            </span>
          </div>

          <div style={{ minHeight: '50px' }}>
            {error && <div className="error-msg">{error}</div>}
          </div>

          <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            'Login'
          )}
        </button>

        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
