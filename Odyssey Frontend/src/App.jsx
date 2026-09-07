import React, { useState, useEffect } from 'react';
import { getToken, clearToken, apiGetHealth, apiGetModels, apiGetKnowledgeDocuments } from './api/client';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { TopHeader } from './components/TopHeader';
import { AdminNavTabs } from './components/AdminNavTabs';
import { DynamicBreadcrumb } from './components/DynamicBreadcrumb';
import { UsersView } from './components/admin/UsersView';
import { ExternalApiView } from './components/admin/ExternalApiView';
import { ModelsView } from './components/admin/ModelsView';
import { KnowledgeBaseView } from './components/admin/KnowledgeBaseView';
import { SovereigntyView } from './components/admin/SovereigntyView';
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
    return token ? { username: 'operator', role: 'ADMIN' } : null;
  });

  // View Mode: 'workbench' | 'admin'
  const [currentView, setCurrentView] = useState('workbench');
  // Admin Tab: 'users' | 'external-api' | 'models' | 'knowledge-base' | 'sovereignty' | 'chat'
  const [activeAdminTab, setActiveAdminTab] = useState('users');

  const [healthData, setHealthData] = useState(null);
  const [modelsData, setModelsData] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);

  // --- SESSION STATE ---
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

  const activeSession = sessions.find((s) => s.session_id === activeSessionId) || null;

  // Session Handlers
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

  // Fetch Health, Models & Knowledge Base Data
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

  // Auth Expired Listener
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
    setCurrentUser(userObj || { username: 'operator', role: 'ADMIN' });
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userObj) => {
    setCurrentUser(userObj || { username: 'operator', role: 'ADMIN' });
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

  // --- AUTHENTICATED WORKSPACE & ADMIN CONSOLE ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--mrpl-bg)' }}>
      {/* 1. Master Enterprise Top Header */}
      <TopHeader
        currentUser={currentUser}
        health={healthData}
        currentView={currentView}
        activeAdminTab={activeAdminTab}
        onSwitchView={setCurrentView}
        onLogout={handleLogout}
      />

      {/* 2. Render Admin Console Shell when currentView === 'admin' */}
      {currentView === 'admin' && (
        <>
          <AdminNavTabs
            activeTab={activeAdminTab}
            onTabChange={setActiveAdminTab}
            modelCount={modelsData?.length || 4}
            docCount={documentsData?.length || 6}
          />
          <DynamicBreadcrumb activeTab={activeAdminTab} onTabChange={setActiveAdminTab} />
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--mrpl-bg)' }}>
            {activeAdminTab === 'users' && <UsersView currentUser={currentUser} />}
            {activeAdminTab === 'external-api' && <ExternalApiView healthStatus={healthData} />}
            {activeAdminTab === 'models' && <ModelsView modelsData={modelsData} />}
            {activeAdminTab === 'knowledge-base' && <KnowledgeBaseView documentsData={documentsData} />}
            {activeAdminTab === 'sovereignty' && <SovereigntyView healthStatus={healthData} />}
            {activeAdminTab === 'chat' && (
              <div style={{ height: 'calc(100vh - 12rem)', display: 'flex', overflow: 'hidden' }} className="card">
                <SessionSidebar
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={handleSelectSession}
                  onCreateSession={handleCreateSession}
                  onRenameSession={handleRenameSession}
                  onDeleteSession={handleDeleteSession}
                />
                <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                  <ChatWindow
                    activeSession={activeSession}
                    onUpdateSessionMessages={handleUpdateSessionMessages}
                    onAutoRenameSession={handleRenameSession}
                    onCreateSession={handleCreateSession}
                  />
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* 3. Render Sovereign AI Workbench Shell when currentView === 'workbench' */}
      {currentView === 'workbench' && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onCreateSession={handleCreateSession}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
          />
          <main style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
            <ChatWindow
              activeSession={activeSession}
              onUpdateSessionMessages={handleUpdateSessionMessages}
              onAutoRenameSession={handleRenameSession}
              onCreateSession={handleCreateSession}
            />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
