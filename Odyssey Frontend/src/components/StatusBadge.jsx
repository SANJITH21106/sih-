import React from 'react';

/**
 * StatusBadge Component
 * Displays a compact, enterprise-style task status badge with semantic color mapping.
 * 
 * Props:
 *  - status: TaskStatus ('CREATED' | 'PLANNING' | 'RUNNING' | 'WAITING' | 'VERIFYING' | 'COMPLETED' | 'FAILED')
 */
export function StatusBadge({ status }) {
  if (!status) {
    return null;
  }

  const safeStatus = String(status).toUpperCase();

  const getStatusStyles = (st) => {
    switch (st) {
      case 'CREATED':
        return {
          color: 'var(--status-created-fg)',
          backgroundColor: 'var(--status-created-bg)',
          borderColor: 'var(--status-created-border)',
          pulseClass: '',
        };
      case 'PLANNING':
        return {
          color: 'var(--status-planning-fg)',
          backgroundColor: 'var(--status-planning-bg)',
          borderColor: 'var(--status-planning-border)',
          pulseClass: '',
        };
      case 'RUNNING':
        return {
          color: 'var(--status-running-fg)',
          backgroundColor: 'var(--status-running-bg)',
          borderColor: 'var(--status-running-border)',
          pulseClass: 'pulse-running',
        };
      case 'WAITING':
        return {
          color: 'var(--status-waiting-fg)',
          backgroundColor: 'var(--status-waiting-bg)',
          borderColor: 'var(--status-waiting-border)',
          pulseClass: '',
        };
      case 'VERIFYING':
        return {
          color: 'var(--status-verifying-fg)',
          backgroundColor: 'var(--status-verifying-bg)',
          borderColor: 'var(--status-verifying-border)',
          pulseClass: '',
        };
      case 'COMPLETED':
        return {
          color: 'var(--status-completed-fg)',
          backgroundColor: 'var(--status-completed-bg)',
          borderColor: 'var(--status-completed-border)',
          pulseClass: '',
        };
      case 'FAILED':
        return {
          color: 'var(--status-failed-fg)',
          backgroundColor: 'var(--status-failed-bg)',
          borderColor: 'var(--status-failed-border)',
          pulseClass: '',
        };
      default:
        return {
          color: 'var(--status-created-fg)',
          backgroundColor: 'var(--status-created-bg)',
          borderColor: 'var(--status-created-border)',
          pulseClass: '',
        };
    }
  };

  const styleConfig = getStatusStyles(safeStatus);

  return (
    <span
      className={`status-badge ${styleConfig.pulseClass}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '4px',
        border: `1px solid ${styleConfig.borderColor}`,
        color: styleConfig.color,
        backgroundColor: styleConfig.backgroundColor,
        letterSpacing: '0.02em',
        lineHeight: 1.4,
      }}
    >
      {safeStatus}
    </span>
  );
}

export default StatusBadge;
