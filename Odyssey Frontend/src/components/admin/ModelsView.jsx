import React, { useState } from 'react';
import { AddModelModal } from '../modals/AddModelModal';

/**
 * ModelsView Component (Page 3 of Admin Console)
 * Bound to ModelInfo[] domain models.
 */
export function ModelsView({ modelsData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [modelsList, setModelsList] = useState([
    {
      model_id: 'mod-mrpl-qwen-72b',
      model_name: 'Qwen 2.5 72B Refinery',
      ollama_tag: 'qwen2.5:72b-instruct-q4_K_M',
      model_type: 'LLM Reasoning & Instruction',
      context_length: 32768,
      quantization: 'Q4_K_M',
      memory_requirement: '41.2 GB VRAM',
      capabilities: ['chat', 'summarization', 'doc_qa'],
      is_default: true,
      default_tasks: 'chat, summarization',
    },
    {
      model_id: 'mod-mrpl-llama33-70b',
      model_name: 'Llama 3.3 70B Instruct',
      ollama_tag: 'llama3.3:70b-instruct-q4_0',
      model_type: 'LLM Reasoning & Instruction',
      context_length: 16384,
      quantization: 'Q4_0',
      memory_requirement: '39.8 GB VRAM',
      capabilities: ['doc_qa', 'audit_analysis'],
      is_default: true,
      default_tasks: 'doc_qa',
    },
    {
      model_id: 'mod-mrpl-r1-qwen32b',
      model_name: 'DeepSeek-R1-Distill-32B',
      ollama_tag: 'deepseek-r1:32b-distill-q4_K_M',
      model_type: 'Reasoning & Optimization',
      context_length: 32768,
      quantization: 'Q4_K_M',
      memory_requirement: '20.4 GB VRAM',
      capabilities: ['process_reasoning', 'mass_balance'],
      is_default: true,
      default_tasks: 'process_reasoning',
    },
    {
      model_id: 'mod-mrpl-bge-m3',
      model_name: 'BGE-M3 Dense Embedding',
      ollama_tag: 'bge-m3:latest',
      model_type: 'Vector Embedding',
      context_length: 8192,
      quantization: 'FP16',
      memory_requirement: '2.4 GB VRAM',
      capabilities: ['vector_search', 'hybrid_rag'],
      is_default: true,
      default_tasks: 'vector_search',
    },
  ]);

  const handleAddModel = (newModel) => {
    setModelsList((prev) => [
      ...prev,
      {
        ...newModel,
        default_tasks: newModel.is_default ? newModel.capabilities.join(', ') : 'None',
      },
    ]);
  };

  const filteredModels = modelsList.filter((m) => {
    const matchesSearch =
      m.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ollama_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? m.model_type.includes(typeFilter) : true;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Add Model Trigger */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-headline)' }}>Model Management</h1>
            <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '2px' }}>
              Registered sovereign AI foundation models and static task-type defaults for automated refinery workflows.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              add_circle
            </span>
            <span>+ Add Model</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--mrpl-border)',
            display: 'flex',
            alignItems: 'center',
            justifyBetween: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '8px',
                  fontSize: '18px',
                  color: 'var(--mrpl-text-muted)',
                }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search model name or Ollama tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '34px',
                  paddingRight: '12px',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  borderRadius: '4px',
                  border: '1px solid var(--mrpl-border)',
                }}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="">All Model Types</option>
              <option value="LLM">LLM Reasoning & Instruction</option>
              <option value="Embedding">Vector Embedding</option>
              <option value="Reasoning">Reasoning & Optimization</option>
            </select>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)' }}>
            Showing <strong>{filteredModels.length}</strong> registered sovereign models
          </div>
        </div>
      </div>

      {/* Models Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#F2F5EA',
                  borderBottom: '1px solid var(--mrpl-border)',
                  color: 'var(--mrpl-text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '12px 16px' }}>Model Identification</th>
                <th style={{ padding: '12px 16px' }}>Ollama Tag & Type</th>
                <th style={{ padding: '12px 16px' }}>Specs & Memory</th>
                <th style={{ padding: '12px 16px' }}>Capabilities / Supported Tasks</th>
                <th style={{ padding: '12px 16px' }}>Static Default For</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => (
                <tr
                  key={model.model_id}
                  style={{
                    borderBottom: '1px solid var(--mrpl-border)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mrpl-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{model.model_name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                      {model.model_id}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--mrpl-primary-dark)' }}>
                      {model.ollama_tag}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>{model.model_type}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    <div>{model.context_length.toLocaleString()} ctx • {model.quantization}</div>
                    <div style={{ color: 'var(--mrpl-primary-dark)', fontWeight: 600 }}>{model.memory_requirement}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {model.capabilities.map((cap) => (
                        <span
                          key={cap}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#F2F5EA',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        backgroundColor: 'var(--mrpl-primary-light)',
                        color: 'var(--mrpl-primary-dark)',
                        border: '1px solid rgba(63, 125, 32, 0.4)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      {model.default_tasks}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dual A100 VRAM Meter */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#F2F5EA',
            borderTop: '1px solid var(--mrpl-border)',
            display: 'flex',
            alignItems: 'center',
            justifyBetween: 'space-between',
            fontSize: '12px',
            color: 'var(--mrpl-text-secondary)',
          }}
        >
          <span>Task defaulting is static administrative selection.</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            Total VRAM: <strong style={{ color: 'var(--mrpl-primary-dark)' }}>103.8 GB / 160 GB (Dual A100)</strong>
          </span>
        </div>
      </div>

      <AddModelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddModel} />
    </div>
  );
}
