import React from 'react';

/**
 * TopHeader Component
 * Enterprise Masthead Header for MRPL Sovereign AI Workbench & Admin Console.
 * Props bound strictly to types.ts (currentUser: User | null, health: HealthStatus | null).
 */
export function TopHeader({
  currentUser,
  health,
  currentView = 'workbench',
  activeAdminTab = 'users',
  onSwitchView,
  onLogout,
}) {
  const isAirGapped = health?.external_calls_enabled === false || true;

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'var(--mrpl-surface)',
        borderBottom: '1px solid var(--mrpl-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* LEFT: MRPL Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--mrpl-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-2xs)',
            flexShrink: 0,
          }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0CVUR8miiw0L-QNYYrR4twY-wo-lfuG1_K9pD8uiJ00LqY8o--BJBj4AfmkH_EidrhH_NfXoBxrRk0h7Y4-G0wHZcvrocnsW3yPTQO7x0UU_krXtdLh12HxpL-ogaRaLsy4uAKXycCThMWuW2uE5rI3xBFU_baPH8suTIThSApt-RZyK33uUVql5QoppDm-06UBfY3vvpq0A0BQLQ84vmMd1rmed-BPVZ5OWAPPJNGdD9mpLSCnXjN_sj02Vdqv9SD-0"
            alt="MRPL Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.2 }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--mrpl-primary-dark)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Mangalore Refinery and Petrochemicals Limited
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
            Sovereign AI Workbench
          </span>
        </div>
      </div>

      {/* RIGHT: Security Status, Mode Switcher, User & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Security Air-Gap Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--mrpl-primary-light)',
            border: '1px solid rgba(63, 125, 32, 0.3)',
            color: 'var(--mrpl-primary-dark)',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <span
            className="pulse-running"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--mrpl-primary)',
            }}
          />
          <span>{isAirGapped ? 'Local status: Operational / Air-Gapped' : 'Local status: Operational'}</span>
        </div>

        {/* Workspace vs Admin View Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--mrpl-bg)',
            padding: '2px',
            borderRadius: '6px',
            border: '1px solid var(--mrpl-border)',
          }}
        >
          <button
            onClick={() => onSwitchView('workbench')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: currentView === 'workbench' ? 600 : 500,
              backgroundColor: currentView === 'workbench' ? 'var(--mrpl-primary)' : 'transparent',
              color: currentView === 'workbench' ? '#FFFFFF' : 'var(--mrpl-text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Workbench
          </button>
          <button
            onClick={() => onSwitchView('admin')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: currentView === 'admin' ? 600 : 500,
              backgroundColor: currentView === 'admin' ? 'var(--mrpl-primary)' : 'transparent',
              color: currentView === 'admin' ? '#FFFFFF' : 'var(--mrpl-text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Admin Console
          </button>
        </div>

        {/* User Identity Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--mrpl-primary-light)',
            border: '1px solid rgba(63, 125, 32, 0.3)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--mrpl-text-primary)',
          }}
        >
          {currentUser?.role === 'ADMIN' && (
            <span
              style={{
                backgroundColor: 'var(--mrpl-primary)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 4px',
                borderRadius: '3px',
                fontWeight: 700,
              }}
            >
              [AD]
            </span>
          )}
          <span>👤 {currentUser?.username || 'operator'}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="btn-secondary"
          style={{
            fontSize: '12px',
            padding: '4px 10px',
          }}
          title="Sign out"
        >
          <span>Logout</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            logout
          </span>
        </button>
      </div>
    </header>
  );
}
