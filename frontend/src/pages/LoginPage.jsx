import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { getAuthValidationErrors, normalizeEmail } from '../utils/authValidation';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    const validationErrors = getAuthValidationErrors({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: normalizeEmail(email),
        password,
      });
      localStorage.setItem('token', response.data.token);
      //alert('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error during login:', error);
      const serverMessage =
        (error.response && error.response.data && error.response.data.message)
        || 'Login failed. Please check your credentials.';

      if (serverMessage.toLowerCase().includes('email') || serverMessage.toLowerCase().includes('gmail')) {
        setErrors({ email: serverMessage });
      } else if (serverMessage.toLowerCase().includes('password')) {
        setErrors({ password: serverMessage });
      } else {
        setErrors({ general: `Login failed: ${serverMessage}` });
      }
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (errors.email || errors.general) {
      setErrors((prev) => ({ ...prev, email: '', general: '' }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (errors.password || errors.general) {
      setErrors((prev) => ({ ...prev, password: '', general: '' }));
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-visual">
          <img
            src="/image/login-hero-4k.jpg"
            alt="Agriculture field"
            className="auth-visual-image"
            loading="eager"
            decoding="async"
          />
          <div className="auth-visual-overlay">
            <h2>Smart Farming Starts Here</h2>
            <p>Monitor crops, automate actions, and make better decisions daily.</p>
          </div>
        </aside>

        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Access your Smart Agro dashboard</p>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={errors.email ? 'input-error' : ''}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={errors.password ? 'input-error' : ''}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          {errors.general && <p className="form-error">{errors.general}</p>}
          <button className="auth-submit" onClick={handleLogin}>Login</button>
          <p className="auth-link-text">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
