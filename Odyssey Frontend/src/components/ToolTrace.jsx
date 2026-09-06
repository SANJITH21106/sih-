import React from 'react';

/**
 * ToolTrace Component
 * Renders a list of tool execution logs.
 * 
 * Props:
 *  - toolCalls: ToolCall[] | null | undefined
 */
export function ToolTrace({ toolCalls }) {
  if (!toolCalls || !Array.isArray(toolCalls) || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="tool-trace" style={{ marginTop: '8px', marginBottom: '8px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--mrpl-text-secondary)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Tool Calls
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {toolCalls.map((item, idx) => {
          if (!item) return null;

          const toolName = item.tool ? String(item.tool) : 'unknown_tool';
          const summaryText = item.summary ? String(item.summary) : '';
          const isSuccess = item.success !== false && item.status !== 'failed';
          const errorMsg = item.error ? String(item.error) : null;

          return (
            <div
              key={item.id || idx}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                fontSize: '13px',
                lineHeight: '1.4',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: isSuccess ? 'var(--mrpl-bg-light)' : '#FEE2E2',
                border: `1px solid ${isSuccess ? 'var(--mrpl-border)' : '#FCA5A5'}`,
                color: isSuccess ? 'var(--mrpl-text-primary)' : '#B91C1C',
              }}
            >
              <span style={{ flexShrink: 0 }}>{isSuccess ? '✅' : '❌'}</span>
              <div style={{ flexGrow: 1 }}>
                <span style={{ fontWeight: 600 }}>{toolName}</span>
                {summaryText && <span> — {summaryText}</span>}
                {errorMsg && (
                  <span style={{ fontWeight: 500, marginLeft: '4px' }}>
                    ({errorMsg})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ToolTrace;
