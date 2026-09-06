import React from 'react';

/**
 * ModelRegistryPanel Component
 * Presentational panel displaying available local/on-premise AI models.
 * 
 * Props:
 *  - models: ModelInfo[] | null | undefined
 */
export function ModelRegistryPanel({ models }) {
  const hasModels = Array.isArray(models) && models.length > 0;

  return (
    <div
      className="model-registry-panel card"
      style={{
        backgroundColor: 'var(--mrpl-bg-main)',
        border: '1px solid var(--mrpl-border)',
        borderRadius: '6px',
        padding: '14px 16px',
        marginTop: '8px',
        marginBottom: '8px',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          borderBottom: '1px solid var(--mrpl-border)',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--mrpl-primary)', margin: 0 }}>
            Model Registry
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', fontWeight: 500 }}>
          {hasModels ? `${models.length} Model(s)` : '0 Models'}
        </span>
      </div>

      {!hasModels ? (
        <div
          style={{
            padding: '16px 12px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--mrpl-text-secondary)',
            backgroundColor: 'var(--mrpl-bg-light)',
            border: '1px solid var(--mrpl-border)',
            borderRadius: '4px',
            fontStyle: 'italic',
          }}
        >
          Model registry information unavailable or backend unreachable.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {models.map((modelItem, idx) => {
            if (!modelItem) return null;

            const modelId = modelItem.model_id ? String(modelItem.model_id) : 'unknown_model';
            const modelName = modelItem.model_name ? String(modelItem.model_name) : modelId;
            const isLocal = modelItem.local_availability !== false;
            const memoryReq = modelItem.memory_requirement ? String(modelItem.memory_requirement) : '';
            const capabilities = Array.isArray(modelItem.capabilities) ? modelItem.capabilities : [];

            return (
              <div
                key={modelItem.model_id || idx}
                style={{
                  backgroundColor: 'var(--mrpl-bg-light)',
                  border: '1px solid var(--mrpl-border)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
                    {modelName}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isLocal ? 'var(--status-completed-bg)' : 'var(--status-created-bg)',
                      color: isLocal ? 'var(--status-completed-fg)' : 'var(--status-created-fg)',
                      border: `1px solid ${isLocal ? 'var(--status-completed-border)' : 'var(--status-created-border)'}`,
                    }}
                  >
                    {isLocal ? 'Local' : 'Offline'}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginBottom: '4px' }}>
                  ID: <code style={{ color: 'var(--mrpl-primary)', fontWeight: 600 }}>{modelId}</code>
                  {memoryReq && ` • ${memoryReq}`}
                </div>

                {capabilities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {capabilities.map((cap, capIdx) => (
                      <span
                        key={capIdx}
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'var(--mrpl-bg-main)',
                          border: '1px solid var(--mrpl-border)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          color: 'var(--mrpl-text-secondary)',
                        }}
                      >
                        {String(cap)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ModelRegistryPanel;
