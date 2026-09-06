import React from 'react';

/**
 * SourceList Component
 * Displays retrieved RAG sources or an explicit fallback notice.
 * 
 * Props:
 *  - sources: Source[] | null | undefined
 *  - answer: string | null | undefined
 */
export function SourceList({ sources, answer }) {
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const hasAnswer = Boolean(answer && String(answer).trim().length > 0);

  if (!hasSources && !hasAnswer) {
    return null;
  }

  if (!hasSources && hasAnswer) {
    return (
      <div
        className="sources-empty-fallback"
        style={{
          marginTop: '12px',
          padding: '8px 12px',
          fontSize: '13px',
          color: 'var(--mrpl-text-secondary)',
          backgroundColor: 'var(--mrpl-bg-light)',
          border: '1px solid var(--mrpl-border)',
          borderRadius: '4px',
          fontStyle: 'italic',
        }}
      >
        No local knowledge base source was found for this claim.
      </div>
    );
  }

  return (
    <div className="source-list" style={{ marginTop: '12px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--mrpl-text-secondary)',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Sources / Evidence
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sources.map((src, idx) => {
          if (!src) return null;

          const docName = src.document_name ? String(src.document_name) : 'Document';
          const pageStr = src.page !== undefined && src.page !== null ? `Page ${src.page}` : '';
          const sectionStr = src.section ? `Section ${src.section}` : '';
          const metaLocation = [pageStr, sectionStr].filter(Boolean).join(' • ');
          const textSnippet = src.retrieved_text || src.excerpt || '';
          const score = typeof src.relevance_score === 'number'
            ? `${(src.relevance_score * 100).toFixed(0)}%`
            : null;

          return (
            <div
              key={src.id || idx}
              style={{
                backgroundColor: 'var(--mrpl-bg-main)',
                border: '1px solid var(--mrpl-border)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '13px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: 'var(--mrpl-primary)',
                  marginBottom: '2px',
                }}
              >
                <span>📄 {docName}</span>
                {score && (
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--mrpl-bg-green-light)',
                      color: 'var(--mrpl-primary)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Score: {score}
                  </span>
                )}
              </div>

              {metaLocation && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--mrpl-text-secondary)',
                    marginBottom: '4px',
                  }}
                >
                  {metaLocation}
                </div>
              )}

              {textSnippet && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--mrpl-text-primary)',
                    backgroundColor: 'var(--mrpl-bg-light)',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    borderLeft: '3px solid var(--mrpl-primary)',
                  }}
                >
                  "{String(textSnippet)}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SourceList;
