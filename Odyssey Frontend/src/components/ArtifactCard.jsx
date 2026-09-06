import React from 'react';
import { getArtifactUrl } from '../api/client';

/**
 * ArtifactCard Component
 * Displays a generated file artifact card with verification badge and safe download action.
 * 
 * Props:
 *  - artifact: Artifact | null | undefined
 */
export function ArtifactCard({ artifact }) {
  if (!artifact) {
    return null;
  }

  const fileName = artifact.file_name ? String(artifact.file_name) : 'generated_artifact';
  const fileType = artifact.file_type ? String(artifact.file_type).toUpperCase() : 'FILE';
  const rawDownloadUrl = artifact.download_url || null;
  const fullDownloadUrl = getArtifactUrl(rawDownloadUrl);
  const isDisabled = !fullDownloadUrl;

  const handleDownloadClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="artifact-card"
      style={{
        backgroundColor: 'var(--mrpl-bg-main)',
        border: '1px solid var(--mrpl-border)',
        borderRadius: '4px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '6px',
        marginBottom: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>📝</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
            {fileName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
            Type: {fileType}
            {artifact.verified && (
              <span style={{ color: 'var(--status-completed-fg)', marginLeft: '6px', fontWeight: 600 }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {isDisabled ? (
        <button
          disabled
          style={{
            backgroundColor: 'var(--mrpl-bg-light)',
            color: 'var(--mrpl-text-secondary)',
            border: '1px solid var(--mrpl-border)',
            padding: '4px 10px',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
        >
          Download Unavailable
        </button>
      ) : (
        <a
          href={fullDownloadUrl}
          download={fileName}
          onClick={handleDownloadClick}
          className="btn-secondary"
          style={{
            textDecoration: 'none',
            fontSize: '12px',
            padding: '4px 10px',
          }}
        >
          📥 Download
        </a>
      )}
    </div>
  );
}

export default ArtifactCard;
