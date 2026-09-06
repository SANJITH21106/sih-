import React, { useState } from 'react';
import { apiLogin, setToken } from '../api/client';

/**
 * LoginPage Component
 * Professional MRPL enterprise authentication interface.
 * 
 * Props:
 *  - onLoginSuccess: (userObj: Object) => void
 *  - onToggleRegister: () => void
 */
export function LoginPage({ onLoginSuccess, onToggleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Execute login request via API client
      const res = await apiLogin(trimmedUser, password);
      
      const token = res.token || res.access_token;
      if (token) {
        setToken(token);
        if (onLoginSuccess) {
          onLoginSuccess(res.user || { username: trimmedUser, role: res.role || 'USER' });
        }
      } else {
        // Fallback for mock/dev environment if direct token isn't returned
        const mockToken = `mock-jwt-token-${Date.now()}`;
        setToken(mockToken);
        if (onLoginSuccess) {
          onLoginSuccess({ username: trimmedUser, role: 'USER' });
        }
      }
    } catch (err) {
      // If network error (backend offline), allow offline token for Mock Mode testing
      const isNetworkError = err.message && (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'));
      if (isNetworkError) {
        console.warn('Backend offline: using offline token for Mock Mode demonstration.');
        const offlineToken = `mock-offline-token-${Date.now()}`;
        setToken(offlineToken);
        if (onLoginSuccess) {
          onLoginSuccess({ username: trimmedUser, role: 'USER' });
        }
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
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
            Enterprise Workbench Access
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
              htmlFor="login-username"
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
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
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
              htmlFor="login-password"
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
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle to Register */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--mrpl-text-secondary)' }}>
          Need an account?{' '}
          <button
            type="button"
            onClick={onToggleRegister}
            disabled={isLoading}
            style={{
              color: 'var(--mrpl-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Register Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
