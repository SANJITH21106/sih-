import React, { useRef } from 'react';

/**
 * FileUpload Component
 * Local browser file picker displaying attached file chips with remove controls.
 * 
 * Props:
 *  - files: Array<{ id: string, name: string, size: number, type: string, file: File }>
 *  - onFilesChange: (updatedFiles: Array<...>) => void
 *  - disabled?: boolean
 */
export function FileUpload({ files = [], onFilesChange, disabled = false }) {
  const fileInputRef = useRef(null);

  const acceptedFormats = ".pdf,.docx,.xlsx,.csv,.txt,image/*";

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedList = Array.from(e.target.files);
    const newFileEntries = selectedList.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));

    const updated = [...files, ...newFileEntries];
    if (onFilesChange) {
      onFilesChange(updated);
    }

    // Reset input value so re-selecting the same file triggers onChange
    e.target.value = '';
  };

  const handleRemoveFile = (idToRemove) => {
    if (disabled) return;
    const updated = files.filter((f) => f.id !== idToRemove);
    if (onFilesChange) {
      onFilesChange(updated);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFormats}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Attachment Trigger Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className="btn-secondary"
        style={{
          fontSize: '13px',
          padding: '6px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span>📎</span>
        <span>Attach Document / Image</span>
      </button>

      {/* Attached File Chips */}
      {files.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          {files.map((fileItem) => {
            const name = fileItem.name ? String(fileItem.name) : 'Attached File';
            const sizeStr = fileItem.size ? formatFileSize(fileItem.file?.size || fileItem.size) : '';

            return (
              <div
                key={fileItem.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--mrpl-bg-green-light)',
                  border: '1px solid var(--mrpl-border)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: 'var(--mrpl-text-primary)',
                }}
              >
                <span>📄</span>
                <span style={{ fontWeight: 500, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
                {sizeStr && (
                  <span style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                    ({sizeStr})
                  </span>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(fileItem.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--mrpl-text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '0 2px',
                      lineHeight: 1,
                    }}
                    title="Remove file"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
