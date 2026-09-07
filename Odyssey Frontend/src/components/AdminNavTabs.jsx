import React from 'react';

/**
 * AdminNavTabs Component
 * Persistent 6-item horizontal navigation tab bar for the Admin Console.
 */
export function AdminNavTabs({
  activeTab = 'users',
  onTabChange,
  modelCount = 4,
  docCount = 6,
}) {
  const TABS = [
    { key: 'users', label: 'Users', icon: 'group' },
    { key: 'external-api', label: 'External API Calls', icon: 'cloud_off' },
    { key: 'models', label: 'Models', icon: 'memory', badge: modelCount },
    { key: 'knowledge-base', label: 'Knowledge Base', icon: 'library_books', badge: docCount },
    { key: 'sovereignty', label: 'Sovereignty', icon: 'verified_user', dot: true },
    { key: 'chat', label: 'Chat', icon: 'chat' },
  ];

  return (
    <nav
      style={{
        backgroundColor: '#F2F5EA',
        borderBottom: '1px solid var(--mrpl-border)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                backgroundColor: isActive ? 'var(--mrpl-primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--mrpl-text-secondary)',
                border: '1px solid transparent',
                boxShadow: isActive ? 'var(--shadow-2xs)' : 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--mrpl-surface)',
                    color: isActive ? '#FFFFFF' : 'var(--mrpl-text-primary)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {tab.badge}
                </span>
              )}
              {tab.dot && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#FFFFFF' : 'var(--mrpl-primary)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Far Right Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            backgroundColor: 'var(--mrpl-primary-dark)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--mrpl-primary-dark)',
            letterSpacing: '0.04em',
          }}
        >
          AIR-GAP ISOLATION ACTIVE
        </span>
      </div>
    </nav>
  );
}
