/**
 * Local Mock Session Data Layer - MRPL Sovereign AI Workbench
 * 
 * Manages frontend-only session persistence using localStorage ('workbench_sessions').
 * Provides robust, defensive error recovery for malformed or corrupted storage items.
 * Strictly isolated from authentication token ('workbench_token') and backend client.
 */

const STORAGE_KEY = 'workbench_sessions';
const ACTIVE_SESSION_KEY = 'workbench_active_session_id';

/**
 * Safely parse and validate sessions from localStorage.
 * Automatically recovers from corrupt or malformed data without crashing.
 */
export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[sessionStore] Corrupted session storage (not an array). Resetting session repository.');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    // Defensive validation of individual session objects
    const validSessions = parsed.filter((item) => {
      return (
        item &&
        typeof item === 'object' &&
        typeof item.session_id === 'string' &&
        item.session_id.length > 0 &&
        typeof item.title === 'string' &&
        Array.isArray(item.messages)
      );
    });

    if (validSessions.length !== parsed.length) {
      console.warn('[sessionStore] Filtered out malformed session items from storage.');
      // Save cleaned array back
      saveSessions(validSessions);
    }

    return validSessions;
  } catch (err) {
    console.error('[sessionStore] Error parsing sessions from localStorage:', err);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return [];
  }
}

/**
 * Persist sessions array to localStorage safely.
 */
export function saveSessions(sessions) {
  try {
    if (!Array.isArray(sessions)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('[sessionStore] Error saving sessions to localStorage:', err);
  }
}

/**
 * Create a new session with clean welcome history or custom initial messages.
 */
export function createSession(title = 'New Conversation', initialMessages = null) {
  const defaultWelcome = [
    {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      content: 'Welcome to MRPL Sovereign AI Workbench. Submit an industrial inquiry or attach telemetry documents to initiate an agentic workflow.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const newSession = {
    session_id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || 'New Conversation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: initialMessages || defaultWelcome,
    message_count: (initialMessages || defaultWelcome).length,
  };

  const currentSessions = getSessions();
  const updated = [newSession, ...currentSessions];
  saveSessions(updated);
  saveActiveSessionId(newSession.session_id);

  return newSession;
}

/**
 * Update the title of a session. Rejects empty or whitespace-only names.
 */
export function updateSessionTitle(sessionId, newTitle) {
  if (!newTitle || typeof newTitle !== 'string') return null;
  const trimmed = newTitle.trim();
  if (!trimmed) return null; // Reject empty/whitespace-only

  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.session_id === sessionId);
  if (index === -1) return null;

  sessions[index].title = trimmed;
  sessions[index].updated_at = new Date().toISOString();
  saveSessions(sessions);

  return sessions[index];
}

/**
 * Delete a session by ID. Returns updated remaining sessions array.
 */
export function deleteSession(sessionId) {
  const sessions = getSessions();
  const filtered = sessions.filter((s) => s.session_id !== sessionId);
  saveSessions(filtered);

  // If deleted session was active, reset active key
  if (getActiveSessionId() === sessionId) {
    const nextActiveId = filtered.length > 0 ? filtered[0].session_id : null;
    saveActiveSessionId(nextActiveId);
  }

  return filtered;
}

/**
 * Update message history for a specific session.
 */
export function updateSessionMessages(sessionId, messages) {
  if (!Array.isArray(messages)) return null;

  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.session_id === sessionId);
  if (index === -1) return null;

  sessions[index].messages = messages;
  sessions[index].message_count = messages.length;
  sessions[index].updated_at = new Date().toISOString();

  saveSessions(sessions);
  return sessions[index];
}

/**
 * Get active session ID from localStorage safely.
 */
export function getActiveSessionId() {
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY) || null;
  } catch (err) {
    return null;
  }
}

/**
 * Save active session ID to localStorage safely.
 */
export function saveActiveSessionId(sessionId) {
  try {
    if (sessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (err) {
    console.error('[sessionStore] Error saving active session ID:', err);
  }
}
