import React, { useState } from 'react';

/**
 * AddModelModal Component
 * Form modal for registering local Ollama models with error validation alert simulation.
 */
export function AddModelModal({ isOpen, onClose, onSave }) {
  const [modelId, setModelId] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('LLM Reasoning & Instruction');
  const [ollamaTag, setOllamaTag] = useState('');
  const [contextLength, setContextLength] = useState('32768');
  const [quantization, setQuantization] = useState('Q4_K_M');
  const [memoryRequirement, setMemoryRequirement] = useState('9.5 GB');
  const [capabilities, setCapabilities] = useState('chat, doc_qa, process_reasoning');
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ollamaTag.trim()) return;
    if (onSave) {
      onSave({
        model_id: modelId || `mod-${ollamaTag.replace(/[:.]/g, '-')}`,
        model_name: modelName || ollamaTag,
        local_availability: true,
        capabilities: capabilities.split(',').map((c) => c.trim()),
        context_length: parseInt(contextLength, 10) || 32768,
        quantization,
        memory_requirement: memoryRequirement,
        supported_tasks: ['REASONING', 'DOCUMENT'],
        is_default: isDefault,
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-card)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--mrpl-border)',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', itemsCenter: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>
              memory
            </span>
            Register Local Sovereign Model
          </h3>
          <button onClick={onClose} style={{ color: 'var(--mrpl-text-muted)' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Validation Alert Box */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: 'var(--mrpl-bg)',
            border: '1px solid var(--mrpl-border)',
            fontSize: '12px',
            color: 'var(--mrpl-text-secondary)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mrpl-primary-dark)', marginTop: '2px' }}>
            info
          </span>
          <span>
            <strong>Validation rule:</strong> Ollama tag must match an image pulled locally. Non-existent tags trigger HTTP 422. Duplicates trigger HTTP 409.
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                model_id
              </label>
              <input
                type="text"
                placeholder="mod-mrpl-qwen-14b"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                model_name
              </label>
              <input
                type="text"
                placeholder="Qwen 2.5 14B Refinery"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                model_type
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="LLM Reasoning & Instruction">LLM Reasoning & Instruction</option>
                <option value="Vector Embedding">Vector Embedding</option>
                <option value="Code & DCS Automation">Code & DCS Automation</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                ollama_tag
              </label>
              <input
                type="text"
                required
                placeholder="qwen2.5:14b-instruct-q4_K_M"
                value={ollamaTag}
                onChange={(e) => setOllamaTag(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--mrpl-text-muted)' }}>
                Must match a model already pulled locally
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                context_length
              </label>
              <input
                type="text"
                value={contextLength}
                onChange={(e) => setContextLength(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                quantization
              </label>
              <input
                type="text"
                value={quantization}
                onChange={(e) => setQuantization(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                memory_req
              </label>
              <input
                type="text"
                value={memoryRequirement}
                onChange={(e) => setMemoryRequirement(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              capabilities / supported_tasks
            </label>
            <input
              type="text"
              value={capabilities}
              onChange={(e) => setCapabilities(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
            <input
              type="checkbox"
              id="is-default-check"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ accentColor: 'var(--mrpl-primary)' }}
            />
            <label htmlFor="is-default-check" style={{ fontSize: '12px', color: 'var(--mrpl-text-primary)' }}>
              is_default_for_tasks (Static administrative preference)
            </label>
          </div>

          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--mrpl-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
