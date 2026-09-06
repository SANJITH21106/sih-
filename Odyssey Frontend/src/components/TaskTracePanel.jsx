import React from 'react';
import { StatusBadge } from './StatusBadge';
import { PlanSteps } from './PlanSteps';
import { ToolTrace } from './ToolTrace';

/**
 * TaskTracePanel Component
 * 
 * Presentational panel that composes StatusBadge, PlanSteps, and ToolTrace
 * to display live task execution state.
 * 
 * Props:
 *  - status: TaskStatus | null | undefined
 *  - plan: string[] | null | undefined
 *  - currentStep: number | null | undefined
 *  - currentAgent: string | null | undefined
 *  - toolCalls: ToolCall[] | null | undefined
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

  const agentLabel = currentAgent ? String(currentAgent) : null;

  return (
    <div
      className="task-trace-panel card"
      style={{
        backgroundColor: 'var(--mrpl-bg-main)',
        border: '1px solid var(--mrpl-border)',
        borderRadius: '6px',
        padding: '12px 16px',
        marginTop: '8px',
        marginBottom: '8px',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      {/* Task Execution Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--mrpl-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Live Execution Trace
          </span>
          {agentLabel && (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--mrpl-text-primary)',
                backgroundColor: 'var(--mrpl-bg-green-light)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              Agent: {agentLabel}
            </span>
          )}
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Composed Child Presentational Components */}
      <PlanSteps plan={plan} currentStep={currentStep} />
      <ToolTrace toolCalls={toolCalls} />
    </div>
  );
}

export default TaskTracePanel;
