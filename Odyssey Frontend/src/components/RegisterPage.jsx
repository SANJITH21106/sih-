import React, { useState } from 'react';
import { apiRegister, setToken } from '../api/client';

/**
 * RegisterPage Component
 * Enterprise account registration interface.
 * 
 * Props:
 *  - onRegisterSuccess: (userObj: Object) => void
 *  - onToggleLogin: () => void
 */
export function RegisterPage({ onRegisterSuccess, onToggleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Execute registration request via API client
      const res = await apiRegister(trimmedUser, password);
      
      const token = res.token || res.access_token;
      if (token) {
        setToken(token);
        if (onRegisterSuccess) {
          onRegisterSuccess(res.user || { username: trimmedUser, role: res.role || 'USER' });
        }
      } else {
        // Fallback for mock/dev environment if direct token isn't returned
        const mockToken = `mock-jwt-token-${Date.now()}`;
        setToken(mockToken);
        if (onRegisterSuccess) {
          onRegisterSuccess({ username: trimmedUser, role: 'USER' });
        }
      }
    } catch (err) {
      const isNetworkError = err.message && (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'));
      if (isNetworkError) {
        console.warn('Backend offline: using offline token for Mock Mode demonstration.');
        const offlineToken = `mock-offline-token-${Date.now()}`;
        setToken(offlineToken);
        if (onRegisterSuccess) {
          onRegisterSuccess({ username: trimmedUser, role: 'USER' });
        }
      } else {
        setErrorMsg(err.message || 'Registration failed. Username may already be in use.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--mrpl-bg-light)',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          backgroundColor: 'var(--mrpl-bg-main)',
          border: '1px solid var(--mrpl-border)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Header / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--mrpl-primary)',
              margin: '0 0 6px 0',
            }}
          >
            MRPL Sovereign AI
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--mrpl-text-secondary)' }}>
            Register New Enterprise Account
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 12px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'var(--status-failed-fg)',
              backgroundColor: 'var(--status-failed-bg)',
              border: '1px solid var(--status-failed-border)',
              borderRadius: '4px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="register-username"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--mrpl-text-primary)',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="register-password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--mrpl-text-primary)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="register-confirm-password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--mrpl-text-primary)',
                marginBottom: '6px',
              }}
            >
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '10px',
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Toggle to Login */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--mrpl-text-secondary)' }}>
          Already registered?{' '}
          <button
            type="button"
            onClick={onToggleLogin}
            disabled={isLoading}
            style={{
              color: 'var(--mrpl-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
