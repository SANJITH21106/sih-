import React from 'react';

/**
 * PlanSteps Component
 * Renders an execution plan checklist with step indicators.
 * 
 * Props:
 *  - plan: string[] | null
 *  - currentStep: number | null
 */
export function PlanSteps({ plan, currentStep }) {
  if (!plan || !Array.isArray(plan) || plan.length === 0) {
    return null;
  }

  const activeStepIdx = typeof currentStep === 'number' ? currentStep : -1;

  const getStepIcon = (index) => {
    if (activeStepIdx !== -1 && index < activeStepIdx) {
      return '✅';
    }
    if (activeStepIdx !== -1 && index === activeStepIdx) {
      return '⏳';
    }
    return '⬜';
  };

  return (
    <div className="plan-steps" style={{ marginTop: '8px', marginBottom: '8px' }}>
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
        Execution Plan
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {plan.map((stepText, idx) => {
          const text = stepText ? String(stepText) : '';
          const isCurrent = idx === activeStepIdx;
          const isDone = activeStepIdx !== -1 && idx < activeStepIdx;

          return (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
                padding: '2px 0',
                color: isCurrent
                  ? 'var(--mrpl-primary)'
                  : isDone
                  ? 'var(--mrpl-text-primary)'
                  : 'var(--mrpl-text-secondary)',
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              <span style={{ fontSize: '12px', flexShrink: 0 }}>{getStepIcon(idx)}</span>
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlanSteps;
