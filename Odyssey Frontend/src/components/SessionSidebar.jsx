import React, { useState } from 'react';

/**
 * SessionSidebar Component
 * Persistent left session sidebar for MRPL Sovereign AI Workbench.
 * Supports session list, active indicator, inline rename, delete confirmation, and empty states.
 */
export function SessionSidebar({
  sessions = [],
  activeSessionId = null,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
}) {
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  // Handle initiating rename
  const handleStartRename = (e, session) => {
    e.stopPropagation();
    setEditingSessionId(session.session_id);
    setEditingTitle(session.title);
    setDeletingSessionId(null);
  };

  // Handle saving rename
  const handleSaveRename = (e, sessionId) => {
    if (e) e.preventDefault();
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      // Reject empty or whitespace-only name
      setEditingSessionId(null);
      return;
    }
    onRenameSession(sessionId, trimmed);
    setEditingSessionId(null);
  };

  // Handle cancel rename
  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  // Handle delete confirmation trigger
  const handleStartDelete = (e, sessionId) => {
    e.stopPropagation();
    setDeletingSessionId(sessionId);
    setEditingSessionId(null);
  };

  // Confirm delete
  const handleConfirmDelete = (e, sessionId) => {
    e.stopPropagation();
    onDeleteSession(sessionId);
    setDeletingSessionId(null);
  };

  // Cancel delete
  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeletingSessionId(null);
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <aside
      className="session-sidebar-container"
      style={{
        width: '288px',
        height: '100%',
        backgroundColor: 'var(--mrpl-surface)',
        borderRight: '1px solid var(--mrpl-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* 1. Header & New Session Action */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--mrpl-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'var(--mrpl-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--mrpl-text-secondary)', fontFamily: 'var(--font-mono)' }}>
            CHAT SESSIONS
          </span>
        </div>

        <button
          onClick={onCreateSession}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '8px 12px',
            fontSize: '12px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            add
          </span>
          <span>+ New Session</span>
        </button>
      </div>

      {/* 2. Session List or Empty State */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {sessions.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '24px' }}>💬</div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
              No conversations yet
            </span>
            <span style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)' }}>
              Start a new chat to initiate an industrial AI session.
            </span>
            <button
              onClick={onCreateSession}
              className="btn-secondary"
              style={{
                marginTop: '8px',
                fontSize: '12px',
                padding: '6px 12px',
                color: 'var(--mrpl-primary)',
                borderColor: 'var(--mrpl-primary)',
              }}
            >
              Start a new chat
            </button>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.session_id === activeSessionId;
            const isEditing = editingSessionId === session.session_id;
            const isDeleting = deletingSessionId === session.session_id;

            return (
              <div
                key={session.session_id}
                onClick={() => !isEditing && !isDeleting && onSelectSession(session.session_id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: isActive
                    ? 'var(--mrpl-bg-green-light)'
                    : 'transparent',
                  borderLeft: isActive
                    ? '3px solid var(--mrpl-primary)'
                    : '3px solid transparent',
                  border: isActive
                    ? '1px solid var(--mrpl-border)'
                    : '1px solid transparent',
                  borderLeftColor: isActive ? 'var(--mrpl-primary)' : 'transparent',
                  cursor: isEditing ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'background-color 0.15s ease',
                }}
                className={!isActive ? 'session-item-hover' : ''}
              >
                {/* Session Item Header (Title / Input) */}
                {isEditing ? (
                  <form
                    onSubmit={(e) => handleSaveRename(e, session.session_id)}
                    style={{ display: 'flex', gap: '4px', width: '100%' }}
                  >
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCancelRename();
                      }}
                      autoFocus
                      style={{
                        flex: 1,
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        border: '1px solid var(--mrpl-primary)',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        backgroundColor: 'var(--mrpl-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelRename}
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        backgroundColor: 'transparent',
                        color: 'var(--mrpl-text-secondary)',
                        border: '1px solid var(--mrpl-border)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </form>
                ) : isDeleting ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: '#FDF2F2',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--status-failed-fg)',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--status-failed-fg)', fontWeight: 600 }}>
                      Delete session?
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => handleConfirmDelete(e, session.session_id)}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: 'var(--status-failed-fg)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: '#fff',
                          color: 'var(--mrpl-text-primary)',
                          border: '1px solid var(--mrpl-border)',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      title={session.title}
                      style={{
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--mrpl-primary)' : 'var(--mrpl-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        marginRight: '6px',
                      }}
                    >
                      {session.title}
                    </span>

                    {/* Action icons (Rename / Delete) */}
                    <div style={{ display: 'flex', gap: '4px', opacity: isActive ? 1 : 0.7 }}>
                      <button
                        title="Rename Session"
                        onClick={(e) => handleStartRename(e, session)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          color: 'var(--mrpl-text-secondary)',
                          borderRadius: '2px',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        title="Delete Session"
                        onClick={(e) => handleStartDelete(e, session.session_id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          color: 'var(--status-failed-fg)',
                          borderRadius: '2px',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}

                {/* Session Sub-metadata */}
                {!isEditing && !isDeleting && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px',
                      color: 'var(--mrpl-text-secondary)',
                    }}
                  >
                    <span>{session.messages ? `${session.messages.length} msg` : '0 msg'}</span>
                    <span>{formatDate(session.updated_at || session.created_at)}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default SessionSidebar;
