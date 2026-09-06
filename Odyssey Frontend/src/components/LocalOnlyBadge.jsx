import React from 'react';

/**
 * LocalOnlyBadge Component
 * System security & network isolation indicator.
 * 
 * Props:
 *  - external_calls_enabled: boolean | null | undefined
 *  - health: HealthStatus | null | undefined
 */
export function LocalOnlyBadge({ external_calls_enabled, health }) {
  // Determine value from prop or health object
  const value = typeof external_calls_enabled === 'boolean'
    ? external_calls_enabled
    : health?.external_calls_enabled;

  // State 1: Confirmed Local-Only (external_calls_enabled === false) -> GREEN
  if (value === false) {
    return (
      <div
        className="local-only-badge badge-secure"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '4px',
          backgroundColor: 'var(--status-completed-bg)',
          color: 'var(--status-completed-fg)',
          border: '1px solid var(--status-completed-border)',
          lineHeight: 1.4,
        }}
      >
        <span>🔒</span>
        <span>100% Local — No external API calls</span>
      </div>
    );
  }

  // State 2: External Calls Enabled (external_calls_enabled === true) -> WARNING (AMBER/RED)
  if (value === true) {
    return (
      <div
        className="local-only-badge badge-warning"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '4px',
          backgroundColor: 'var(--status-waiting-bg)',
          color: 'var(--status-waiting-fg)',
          border: '1px solid var(--status-waiting-border)',
          lineHeight: 1.4,
        }}
      >
        <span>⚠</span>
        <span>External Calls Enabled — Network Egress Allowed</span>
      </div>
    );
  }

  // State 3: Unknown / Null / Backend Unreachable -> UNKNOWN/UNAVAILABLE (NEUTRAL GRAY)
  return (
    <div
      className="local-only-badge badge-unknown"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '4px',
        backgroundColor: 'var(--status-created-bg)',
        color: 'var(--status-created-fg)',
        border: '1px solid var(--status-created-border)',
        lineHeight: 1.4,
      }}
    >
      <span>🌐</span>
      <span>Local status unknown / backend unavailable</span>
    </div>
  );
}

export default LocalOnlyBadge;
