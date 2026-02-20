import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { getAuthValidationErrors, normalizeEmail } from '../utils/authValidation';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    const validationErrors = {
      ...(!name || !name.trim() ? { name: 'Name is required.' } : {}),
      ...getAuthValidationErrors({ email, password }),
      ...(!confirmPassword ? { confirmPassword: 'Please confirm your password.' } : {}),
      ...(confirmPassword && password !== confirmPassword
        ? { confirmPassword: 'Passwords do not match.' }
        : {}),
    };

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axiosInstance.post('/auth/register', {
        name: name.trim(),
        email: normalizeEmail(email),
        password,
      });
      localStorage.setItem('token', response.data.token);
      alert('Registration successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error during registration:', error);
      const serverMessage =
        (error.response && error.response.data && error.response.data.message)
        || 'Registration failed. Please try again.';

      if (serverMessage.toLowerCase().includes('name')) {
        setErrors({ name: serverMessage });
      } else if (serverMessage.toLowerCase().includes('email') || serverMessage.toLowerCase().includes('gmail')) {
        setErrors({ email: serverMessage });
      } else if (serverMessage.toLowerCase().includes('password')) {
        setErrors({ password: serverMessage });
      } else {
        setErrors({ general: `Registration failed: ${serverMessage}` });
      }
    }
  };

  const clearErrors = (keys) => {
    const hasError = keys.some((key) => errors[key]) || errors.general;
    if (!hasError) return;

    setErrors((prev) => {
      const next = { ...prev, general: '' };
      keys.forEach((key) => {
        next[key] = '';
      });
      return next;
    });
  };

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-visual">
          <img
            src="/image/register-hero-4k.jpg"
            alt="Agriculture farm"
            className="auth-visual-image"
            loading="eager"
            decoding="async"
          />
          <div className="auth-visual-overlay">
            <h2>Grow With Smart Agro</h2>
            <p>Create your account and start managing agriculture data in one place.</p>
          </div>
        </aside>

        <div className="auth-card">
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Create your farmer account</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              className={errors.name ? 'input-error' : ''}
              onChange={(e) => {
                setName(e.target.value);
                clearErrors(['name']);
              }}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={errors.email ? 'input-error' : ''}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErrors(['email']);
              }}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={errors.password ? 'input-error' : ''}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors(['password', 'confirmPassword']);
              }}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              className={errors.confirmPassword ? 'input-error' : ''}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearErrors(['confirmPassword']);
              }}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>
          {errors.general && <p className="form-error">{errors.general}</p>}
          <button className="auth-submit" onClick={handleRegister}>Register</button>
          <p className="auth-link-text">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
