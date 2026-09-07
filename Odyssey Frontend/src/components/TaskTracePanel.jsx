import React from 'react';
import { StatusBadge } from './StatusBadge';
import { PlanSteps } from './PlanSteps';
import { ToolTrace } from './ToolTrace';

/**
 * TaskTracePanel Component
 * Presentational panel that displays live agent execution trace, step plan, tool calls, and agent handoffs.
 * Props bound strictly to types.ts (TaskState model).
 */
export function TaskTracePanel({
  status,
  plan,
  currentStep,
  currentAgent,
  toolCalls,
}) {
  if (!status && !plan && (!toolCalls || toolCalls.length === 0)) {
    return null;
  }

  const isRunning = status === 'RUNNING' || status === 'PLANNING';
  const agentLabel = currentAgent ? String(currentAgent) : 'reasoning_agent';

  return (
    <div
      className="task-trace-panel"
      style={{
        backgroundColor: '#FAFBF8',
        border: '1px solid var(--mrpl-border)',
        borderRadius: '8px',
        padding: '14px',
        marginTop: '10px',
        marginBottom: '10px',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: 'var(--shadow-2xs)',
      }}
    >
      {/* Execution Status Line */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mrpl-primary-dark)', fontWeight: 700 }}>
          {isRunning && (
            <span
              className="pulse-running"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--mrpl-primary-dark)',
              }}
            />
          )}
          <span style={{ letterSpacing: '0.04em' }}>
            {status ? `${status} — ${agentLabel}` : `RUNNING — ${agentLabel}`}
          </span>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Plan Steps */}
      <PlanSteps plan={plan} currentStep={currentStep} />

      {/* Tool Execution Logs */}
      <ToolTrace toolCalls={toolCalls} />

      {/* Agent Handoff Indicator Line */}
      <div
        style={{
          paddingTop: '8px',
          borderTop: '1px solid var(--mrpl-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--mrpl-text-primary)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mrpl-primary)' }}>
          sync_alt
        </span>
        <span style={{ fontWeight: 700, color: 'var(--mrpl-primary-dark)' }}>Agent handoff:</span>
        <span
          style={{
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--mrpl-border)',
            fontWeight: 600,
          }}
        >
          {agentLabel}
        </span>
        <span style={{ color: 'var(--mrpl-text-muted)', fontWeight: 700 }}>→</span>
        <span
          style={{
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--mrpl-border)',
            fontWeight: 600,
            color: 'var(--mrpl-primary-dark)',
          }}
        >
          mathematical_agent
        </span>
      </div>
    </div>
  );
}

export default TaskTracePanel;
