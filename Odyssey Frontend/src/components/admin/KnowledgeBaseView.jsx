import React, { useState } from 'react';

/**
 * KnowledgeBaseView Component (Page 4 of Admin Console)
 * Bound to KnowledgeDocument[] domain models.
 */
export function KnowledgeBaseView({ documentsData }) {
  const [documentsList, setDocumentsList] = useState([
    {
      id: 'doc-1',
      file_name: 'MRPL-SOP-CDU3-042.pdf',
      document_type: 'PDF',
      file_size: '14.8 MB',
      chunk_count: 428,
      indexed_status: 'INDEXED',
      created_at: '2024-03-01 09:14',
    },
    {
      id: 'doc-2',
      file_name: 'OISD_Standard_156_Fire_Safety.pdf',
      document_type: 'PDF',
      file_size: '8.2 MB',
      chunk_count: 312,
      indexed_status: 'INDEXED',
      created_at: '2024-02-28 14:22',
    },
    {
      id: 'doc-3',
      file_name: 'FCC_Turnaround_Maintenance_Checklist.docx',
      document_type: 'DOCX',
      file_size: '3.4 MB',
      chunk_count: 118,
      indexed_status: 'INDEXED',
      created_at: '2024-02-25 11:05',
    },
    {
      id: 'doc-4',
      file_name: 'Crude_Assay_Stream_Specs_2024.csv',
      document_type: 'CSV',
      file_size: '5.1 MB',
      chunk_count: 64,
      indexed_status: 'INDEXED',
      created_at: '2024-02-18 16:40',
    },
    {
      id: 'doc-5',
      file_name: 'HGU2_Hydrogen_Unit_Emergency_Isolation.pdf',
      document_type: 'PDF',
      file_size: '9.6 MB',
      chunk_count: 275,
      indexed_status: 'INDEXED',
      created_at: '2024-02-12 18:30',
    },
    {
      id: 'doc-6',
      file_name: 'MRPL_DCS_Interlock_Threshold_Notes.txt',
      document_type: 'TXT',
      file_size: '0.8 MB',
      chunk_count: 42,
      indexed_status: 'INDEXED',
      created_at: '2024-01-20 10:15',
    },
  ]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      setDocumentsList((prev) => [
        {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          file_name: file.name,
          document_type: file.name.split('.').pop().toUpperCase(),
          file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          chunk_count: Math.floor(Math.random() * 150) + 20,
          indexed_status: 'INDEXED',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...prev,
      ]);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Upload Trigger */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-headline)' }}>Knowledge Base</h1>
            <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '2px' }}>
              Documents ingested and indexed for sovereign RAG and refinery process assistance.
            </p>
          </div>
          <div>
            <label className="btn-primary" style={{ cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                upload_file
              </span>
              <span>+ Upload Document</span>
              <input type="file" multiple accept=".pdf,.docx,.txt,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          style={{
            marginTop: '20px',
            border: '2px dashed var(--mrpl-border)',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: '#FAFBF8',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onClick={() => document.getElementById('drag-drop-input')?.click()}
        >
          <input id="drag-drop-input" type="file" multiple accept=".pdf,.docx,.txt,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 8px auto',
              borderRadius: '9999px',
              backgroundColor: 'var(--mrpl-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyCenter: 'center',
              color: 'var(--mrpl-primary-dark)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              cloud_upload
            </span>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--mrpl-text-primary)' }}>
            Click to browse or drag and drop refinery manuals & SOP files
          </p>
          <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '4px' }}>
            Supported formats:{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--mrpl-text-primary)' }}>
              .pdf, .docx, .txt, .csv
            </span>{' '}
            (Max 120MB per document)
          </p>
        </div>

        {/* Ingestion Telemetry Bar */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid var(--mrpl-border)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyBetween: 'space-between',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>
              check_circle
            </span>
            <span style={{ fontWeight: 500, color: 'var(--mrpl-text-primary)' }}>
              Index pipeline idle • <strong>{documentsList.length}</strong> documents active in vector store
            </span>
          </div>
          <span style={{ color: 'var(--mrpl-text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Qdrant Collection: refinery_docs_v1 (Cosine)
          </span>
        </div>
      </div>

      {/* Document Registry Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--mrpl-border)', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--mrpl-text-secondary)' }}>
            Ingested Sovereign Documents
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)' }}>Indexed for sovereign retrieval</span>
        </div>

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
                <th style={{ padding: '12px 16px' }}>Document Name</th>
                <th style={{ padding: '12px 16px' }}>File Type</th>
                <th style={{ padding: '12px 16px' }}>File Size</th>
                <th style={{ padding: '12px 16px' }}>Chunk Count</th>
                <th style={{ padding: '12px 16px' }}>Ingestion Status</th>
                <th style={{ padding: '12px 16px' }}>Date Ingested</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentsList.map((doc) => (
                <tr
                  key={doc.id}
                  style={{ borderBottom: '1px solid var(--mrpl-border)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mrpl-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: doc.document_type === 'PDF' ? '#BA1A1A' : 'var(--mrpl-primary)' }}>
                        {doc.document_type === 'PDF' ? 'picture_as_pdf' : doc.document_type === 'CSV' ? 'table_chart' : 'description'}
                      </span>
                      <span>{doc.file_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{doc.document_type}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{doc.file_size}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{doc.chunk_count} chunks</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: 'var(--mrpl-primary-light)',
                        color: 'var(--mrpl-primary-dark)',
                        border: '1px solid rgba(63, 125, 32, 0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: 'var(--mrpl-primary-dark)' }} />
                      Indexed / Ready
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                    {doc.created_at}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ fontSize: '11px', padding: '3px 6px', marginRight: '4px' }}>
                      View
                    </button>
                    <button className="btn-secondary" style={{ fontSize: '11px', padding: '3px 6px', color: 'var(--mrpl-primary)' }}>
                      Re-index
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <span>Total Vector Embeddings: 1,239 active vectors</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>Storage: 41.9 MB index</span>
        </div>
      </div>
    </div>
  );
}
