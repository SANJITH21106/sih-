import React from 'react';
import { SourceList } from './SourceList';
import { ArtifactCard } from './ArtifactCard';

/**
 * MessageBubble Component
 * Renders individual chat messages for user prompts, completed AI answers, and failed AI responses.
 * 
 * Props:
 *  - message: {
 *      id: string,
 *      sender: 'user' | 'assistant',
 *      content: string,
 *      timestamp?: string,
 *      files?: Array<{ id?: string, name: string, size?: number }>,
 *      taskState?: TaskState | Object
 *    }
 */
export function MessageBubble({ message }) {
  if (!message) return null;

  const isUser = message.sender === 'user';
  const timestampStr = message.timestamp ? String(message.timestamp) : '';
  const taskData = message.taskState || {};
  const isFailed = taskData.status === 'FAILED' || Boolean(taskData.error);
  const textContent = message.content || taskData.answer || '';
  const errorMsg = taskData.error || (Array.isArray(taskData.errors) && taskData.errors[0]) || null;

  // --- USER MESSAGE RENDERING ---
  if (isUser) {
    return (
      <div
        className="message-bubble message-user"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          marginTop: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            maxWidth: '85%',
            backgroundColor: 'var(--mrpl-bg-green-light)',
            border: '1px solid var(--mrpl-border)',
            borderLeft: '4px solid var(--mrpl-primary)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: 'var(--mrpl-text-primary)',
            fontSize: '14px',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--mrpl-primary)', marginBottom: '4px' }}>
            User
          </div>
          <div>{String(textContent)}</div>

          {/* Attached Files in User Message */}
          {Array.isArray(message.files) && message.files.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {message.files.map((file, idx) => (
                <span
                  key={file.id || idx}
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'var(--mrpl-bg-main)',
                    border: '1px solid var(--mrpl-border)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'var(--mrpl-text-secondary)',
                  }}
                >
                  📎 {file.name ? String(file.name) : 'Attachment'}
                </span>
              ))}
            </div>
          )}
        </div>
        {timestampStr && (
          <span style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', marginTop: '2px', paddingRight: '4px' }}>
            {timestampStr}
          </span>
        )}
      </div>
    );
  }

  // --- ASSISTANT FAILED MESSAGE RENDERING ---
  if (isFailed) {
    return (
      <div
        className="message-bubble message-assistant message-failed"
        style={{
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '90%',
        }}
      >
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderLeft: '4px solid #DC2626',
            borderRadius: '6px',
            padding: '12px 16px',
            color: '#991B1B',
            fontSize: '14px',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#B91C1C', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🤖 Assistant — Task Failed</span>
            {timestampStr && <span>{timestampStr}</span>}
          </div>

          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
            ❌ Execution Aborted
          </div>

          {errorMsg && (
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #FCA5A5',
                padding: '8px',
                borderRadius: '4px',
                marginBottom: '8px',
                color: '#B91C1C',
                wordBreak: 'break-word',
              }}
            >
              {String(errorMsg)}
            </div>
          )}

          {/* Partial Plan & Tool Trace Preservation */}
          {Array.isArray(taskData.plan) && taskData.plan.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <div style={{ fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>Partial Plan:</div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {taskData.plan.map((step, idx) => (
                  <li key={idx}>{String(step)}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(taskData.tool_calls) && taskData.tool_calls.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <div style={{ fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>Tool Trace:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {taskData.tool_calls.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: tc.success === false ? '#FEE2E2' : '#F3F4F6',
                      border: `1px solid ${tc.success === false ? '#FCA5A5' : '#E5E7EB'}`,
                      color: tc.success === false ? '#B91C1C' : '#374151',
                    }}
                  >
                    {tc.success === false ? '❌' : '✅'} <strong>{tc.tool || 'tool'}</strong> — {tc.summary || ''}
                    {tc.error && <div style={{ fontSize: '11px', color: '#B91C1C' }}>({tc.error})</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- ASSISTANT COMPLETED MESSAGE RENDERING ---
  const sources = taskData.sources || [];
  const artifacts = taskData.artifacts || [];
  const verification = taskData.verification || null;

  return (
    <div
      className="message-bubble message-assistant"
      style={{
        marginTop: '12px',
        marginBottom: '12px',
        maxWidth: '90%',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--mrpl-bg-main)',
          border: '1px solid var(--mrpl-border)',
          borderLeft: '4px solid var(--mrpl-primary)',
          borderRadius: '6px',
          padding: '12px 16px',
          fontSize: '14px',
          color: 'var(--mrpl-text-primary)',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--mrpl-primary)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🤖 Assistant</span>
          {timestampStr && <span style={{ color: 'var(--mrpl-text-secondary)', fontWeight: 400 }}>{timestampStr}</span>}
        </div>

        {/* 1. Answer */}
        {textContent && (
          <div style={{ lineHeight: 1.6, marginBottom: '8px' }}>
            {String(textContent)}
          </div>
        )}

        {/* 2. Sources */}
        <SourceList sources={sources} answer={textContent} />

        {/* 3. Artifacts */}
        {Array.isArray(artifacts) && artifacts.length > 0 && (
          <div style={{ marginTop: '12px' }}>
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
              Generated Artifacts
            </div>
            {artifacts.map((art, idx) => (
              <ArtifactCard key={art.artifact_id || art.id || idx} artifact={art} />
            ))}
          </div>
        )}

        {/* 4. Verification */}
        {verification && (
          <div
            style={{
              marginTop: '12px',
              padding: '6px 10px',
              backgroundColor: 'var(--status-completed-bg)',
              border: '1px solid var(--status-completed-border)',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'var(--status-completed-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 600 }}>
              ✓ Verification Passed {verification.notes ? `(${verification.notes})` : ''}
            </span>
            {verification.verified && (
              <span style={{ fontSize: '11px', fontWeight: 700 }}>VERIFIED</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
