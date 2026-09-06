import React, { useState, useEffect } from 'react';
import { getToken, clearToken, apiGetHealth, apiGetModels, apiGetKnowledgeDocuments } from './api/client';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LocalOnlyBadge } from './components/LocalOnlyBadge';
import { ModelRegistryPanel } from './components/ModelRegistryPanel';
import { KnowledgeBasePanel } from './components/KnowledgeBasePanel';
import { ChatWindow } from './components/ChatWindow';
import { SessionSidebar } from './components/SessionSidebar';
import {
  getSessions,
  createSession,
  updateSessionTitle,
  deleteSession,
  updateSessionMessages,
  getActiveSessionId,
  saveActiveSessionId,
} from './utils/sessionStore';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()));
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(() => {
    const token = getToken();
    return token ? { username: 'operator', role: 'USER' } : null;
  });

  const [showSystemPanels, setShowSystemPanels] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [modelsData, setModelsData] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);

  // --- SESSION STATE (Phase 11) ---
  const [sessions, setSessions] = useState(() => {
    const loaded = getSessions();
    if (loaded.length === 0) {
      const defaultSess = createSession('New Conversation');
      return [defaultSess];
    }
    return loaded;
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const savedId = getActiveSessionId();
    const currentSessions = getSessions();
    if (savedId && currentSessions.some((s) => s.session_id === savedId)) {
      return savedId;
    }
    return currentSessions[0]?.session_id || null;
  });

  // Derived Active Session Object
  const activeSession = sessions.find((s) => s.session_id === activeSessionId) || null;

  // Session Action Handlers
  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    saveActiveSessionId(sessionId);
  };

  const handleCreateSession = () => {
    const newSession = createSession('New Conversation');
    const updated = getSessions();
    setSessions(updated);
    setActiveSessionId(newSession.session_id);
  };

  const handleRenameSession = (sessionId, newTitle) => {
    updateSessionTitle(sessionId, newTitle);
    setSessions(getSessions());
  };

  const handleDeleteSession = (sessionId) => {
    const remaining = deleteSession(sessionId);
    setSessions(remaining);
    const nextActiveId = getActiveSessionId();
    setActiveSessionId(nextActiveId);
  };

  const handleUpdateSessionMessages = (sessionId, updatedMessages) => {
    updateSessionMessages(sessionId, updatedMessages);
    setSessions(getSessions());
  };

  // Fetch System Information (Health, Models, Knowledge Documents)
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    async function fetchSystemData() {
      try {
        const health = await apiGetHealth().catch(() => null);
        if (isMounted) setHealthData(health);
      } catch (err) {
        if (isMounted) setHealthData(null);
      }

      try {
        const models = await apiGetModels().catch(() => null);
        if (isMounted) setModelsData(models);
      } catch (err) {
        if (isMounted) setModelsData(null);
      }

      try {
        const docs = await apiGetKnowledgeDocuments().catch(() => null);
        if (isMounted) setDocumentsData(docs);
      } catch (err) {
        if (isMounted) setDocumentsData(null);
      }
    }

    fetchSystemData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Listen for 401 Session Expiration Events
  useEffect(() => {
    const handleAuthExpired = () => {
      clearToken();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthView('login');
    };

    window.addEventListener('workbench:auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('workbench:auth-expired', handleAuthExpired);
    };
  }, []);

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj || { username: 'operator', role: 'USER' });
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userObj) => {
    setCurrentUser(userObj || { username: 'operator', role: 'USER' });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthView('login');
  };

  // --- UNAUTHENTICATED STATE ---
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onToggleLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onToggleRegister={() => setAuthView('register')}
      />
    );
  }

  // --- AUTHENTICATED WORKBENCH STATE ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--mrpl-bg-light)' }}>
      {/* MRPL Header (64px height, white bg, bottom border #4A7C2A) */}
      <header
        style={{
          height: '64px',
          backgroundColor: 'var(--mrpl-bg-main)',
          borderBottom: '1px solid var(--mrpl-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: 'var(--shadow-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--mrpl-primary)', lineHeight: 1.2 }}>
              MRPL
            </span>
            <span style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', fontWeight: 500 }}>
              Sovereign AI Workbench
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Security Indicator */}
          <LocalOnlyBadge
            external_calls_enabled={healthData?.external_calls_enabled}
            health={healthData}
          />

          {/* Toggle System Panels (Models & Knowledge Base) */}
          <button
            onClick={() => setShowSystemPanels(!showSystemPanels)}
            className="btn-secondary"
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              backgroundColor: showSystemPanels ? 'var(--mrpl-bg-green-light)' : 'var(--mrpl-bg-main)',
              color: showSystemPanels ? 'var(--mrpl-primary)' : 'var(--mrpl-text-primary)',
            }}
          >
            {showSystemPanels ? 'Hide Context Panels' : 'Show Context Panels'}
          </button>

          {/* User Account Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--mrpl-text-primary)' }}>
            <span>👤 <strong>{currentUser?.username || 'Operator'}</strong></span>
          </div>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              color: 'var(--status-failed-fg)',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main style={{ flex: 1, padding: '16px', display: 'flex', gap: '16px', overflow: 'hidden' }}>
        {/* Persistent Left Session Sidebar */}
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* Primary Chat Workspace */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <ChatWindow
            activeSession={activeSession}
            onUpdateSessionMessages={handleUpdateSessionMessages}
            onAutoRenameSession={handleRenameSession}
            onCreateSession={handleCreateSession}
          />
        </div>

        {/* Optional Right System Context Panels (Models & Knowledge Base) */}
        {showSystemPanels && (
          <aside
            style={{
              width: '380px',
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <ModelRegistryPanel models={modelsData} />
            <KnowledgeBasePanel documents={documentsData} />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
