/**
 * MRPL Sovereign AI Workbench - Core API Client
 * 
 * Manages HTTP communication with the backend API server.
 * Handles token storage, Authorization header injection, and 401 session expiration.
 */

const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'workbench_token';

// Token Management
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Artifact URL Helper
 */
export const getArtifactUrl = (downloadUrl) => {
  if (!downloadUrl) return null;
  if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
    return downloadUrl;
  }
  return `http://localhost:8000${downloadUrl.startsWith('/') ? '' : '/'}${downloadUrl}`;
};

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized (Session Expiry)
    if (response.status === 401) {
      clearToken();
      window.dispatchEvent(new CustomEvent('workbench:auth-expired'));
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error (${response.status}): ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Failed: ${endpoint}`, error);
    throw error;
  }
}

// Auth API Endpoints
export const apiLogin = (username, password) => 
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const apiRegister = (username, password) => 
  request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const apiGetMe = () => request('/api/auth/me');

// Task & Chat API Endpoints
export const apiCreateTask = (message, files = [], sessionId = null) => {
  let bodyPayload = {};
  if (typeof message === 'object' && message !== null) {
    bodyPayload = {
      message: message.message || message.prompt || '',
      files: message.files || [],
      session_id: message.session_id || message.sessionId || null,
    };
  } else {
    bodyPayload = {
      message: message || '',
      files: files || [],
      session_id: sessionId || null,
    };
  }

  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify(bodyPayload),
  });
};

export const apiGetTask = (taskId) => request(`/api/tasks/${taskId}`);

// Health & System API Endpoints
export const apiGetHealth = () => request('/api/health');

// Model Registry API Endpoints
export const apiGetModels = () => request('/api/models');

// Knowledge Base API Endpoints
export const apiGetKnowledgeDocuments = () => request('/api/knowledge/documents');

export const apiUploadKnowledgeDocument = async (formData) => {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/knowledge/ingest`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent('workbench:auth-expired'));
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload document');
  }

  return await response.json();
};

// Sessions API Endpoints
export const apiGetSessions = () => request('/api/sessions');

export const apiGetSessionMessages = (sessionId) => request(`/api/sessions/${sessionId}/messages`);

export const apiUpdateSession = (sessionId, data) => 
  request(`/api/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const apiDeleteSession = (sessionId) => 
  request(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  });
