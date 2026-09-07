import React, { useState } from 'react';

/**
 * AddUserModal Component
 * Form modal for registering authorized operator profiles.
 */
export function AddUserModal({ isOpen, onClose, onSave }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [unit, setUnit] = useState('');
  const [role, setRole] = useState('Shift DCS Operator');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (onSave) {
      onSave({ username, fullName, unit, role });
    }
    setUsername('');
    setFullName('');
    setUnit('');
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
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-card)',
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
          <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>
              person_add
            </span>
            Add Authorized User
          </h3>
          <button onClick={onClose} style={{ color: 'var(--mrpl-text-muted)' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Username / Operator ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. shift_patil"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anand Patil"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Refinery Department / Unit
            </label>
            <input
              type="text"
              placeholder="e.g. HGU-2 Hydrogen Generation Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Operational Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="Lead Process Engineer">Lead Process Engineer</option>
              <option value="Shift DCS Operator">Shift DCS Operator</option>
              <option value="Safety & Compliance Auditor">Safety & Compliance Auditor</option>
              <option value="Sovereign Admin">Sovereign Admin</option>
            </select>
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
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
