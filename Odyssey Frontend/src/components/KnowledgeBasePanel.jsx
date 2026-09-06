import React from 'react';

/**
 * KnowledgeBasePanel Component
 * Presentational panel displaying configured local RAG knowledge base documents.
 * 
 * Props:
 *  - documents: KnowledgeDocument[] | null | undefined
 */
export function KnowledgeBasePanel({ documents }) {
  const hasDocs = Array.isArray(documents) && documents.length > 0;

  return (
    <div
      className="knowledge-base-panel card"
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
          <span style={{ fontSize: '16px' }}>📚</span>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--mrpl-primary)', margin: 0 }}>
            Knowledge Base
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', fontWeight: 500 }}>
          {hasDocs ? `${documents.length} Document(s)` : '0 Documents'}
        </span>
      </div>

      {!hasDocs ? (
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
          No local knowledge base documents indexed or backend unreachable.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {documents.map((doc, idx) => {
            if (!doc) return null;

            const fileName = doc.file_name ? String(doc.file_name) : 'Indexed Document';
            const docType = doc.document_type ? String(doc.document_type).toUpperCase() : 'PDF';
            const chunkCount = typeof doc.chunk_count === 'number' ? doc.chunk_count : 0;
            const status = doc.indexed_status ? String(doc.indexed_status).toUpperCase() : 'INDEXED';

            const isIndexed = status === 'INDEXED';

            return (
              <div
                key={doc.id || idx}
                style={{
                  backgroundColor: 'var(--mrpl-bg-light)',
                  border: '1px solid var(--mrpl-border)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
                    📄 {fileName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                    Type: {docType} • {chunkCount} Chunk(s)
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isIndexed ? 'var(--status-completed-bg)' : 'var(--status-waiting-bg)',
                    color: isIndexed ? 'var(--status-completed-fg)' : 'var(--status-waiting-fg)',
                    border: `1px solid ${isIndexed ? 'var(--status-completed-border)' : 'var(--status-waiting-border)'}`,
                  }}
                >
                  {isIndexed ? '✓ INDEXED' : '⏳ INDEXING'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default KnowledgeBasePanel;
