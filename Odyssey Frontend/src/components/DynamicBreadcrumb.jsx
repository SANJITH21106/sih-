import React from 'react';

/**
 * DynamicBreadcrumb Component
 * Breadcrumb indicator bar showing current admin section and Security Ring badge.
 */
export function DynamicBreadcrumb({ activeTab = 'users', onTabChange }) {
  const BREADCRUMB_MAP = {
    'users': 'Users',
    'external-api': 'External API Calls',
    'models': 'Models',
    'knowledge-base': 'Knowledge Base',
    'sovereignty': 'Sovereignty',
    'chat': 'Chat',
  };

  const currentLabel = BREADCRUMB_MAP[activeTab] || 'Users';

  return (
    <div
      style={{
        backgroundColor: 'var(--mrpl-bg)',
        borderBottom: '1px solid var(--mrpl-border)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mrpl-text-secondary)' }}>
        <span
          onClick={() => onTabChange && onTabChange('users')}
          style={{ cursor: 'pointer', hover: { color: 'var(--mrpl-primary-dark)' } }}
        >
          Home
        </span>
        <span style={{ color: 'var(--mrpl-border)', fontWeight: 700 }}>›</span>
        <span
          onClick={() => onTabChange && onTabChange('users')}
          style={{ cursor: 'pointer', hover: { color: 'var(--mrpl-primary-dark)' } }}
        >
          Admin
        </span>
        <span style={{ color: 'var(--mrpl-border)', fontWeight: 700 }}>›</span>
        <span style={{ fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>{currentLabel}</span>
      </div>

      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--mrpl-text-secondary)' }}>
        Security Ring:{' '}
        <span style={{ color: 'var(--mrpl-primary-dark)', fontWeight: 700 }}>Level-3 Isolated Loopback</span>
      </div>
    </div>
  );
}
