import React, { useState } from 'react';
import { AddUserModal } from '../modals/AddUserModal';

/**
 * UsersView Component (Page 1 of Admin Console)
 * Bound to User[] models.
 */
export function UsersView({ currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [usersList, setUsersList] = useState([
    {
      username: 'admin_kamat',
      uid: 'MRPL-SEC-001',
      fullName: 'Suresh Kamat',
      unit: 'Refinery Automation & IT',
      subUnit: 'Central Control Building',
      role: 'Sovereign Admin',
      createdDate: '2024-01-12',
      status: 'Active',
    },
    {
      username: 'eng_nayak',
      uid: 'MRPL-ENG-044',
      fullName: 'Pooja Nayak',
      unit: 'Process Engineering (CDU-3)',
      subUnit: 'Primary Distillation Unit',
      role: 'Lead Process Engineer',
      createdDate: '2024-02-04',
      status: 'Active',
    },
    {
      username: 'proc_bhat',
      uid: 'MRPL-ENG-089',
      fullName: 'Ganesh Bhat',
      unit: 'FCC Complex Operations',
      subUnit: 'Fluid Catalytic Cracker Block',
      role: 'Shift DCS Operator',
      createdDate: '2024-02-19',
      status: 'Active',
    },
    {
      username: 'field_dias',
      uid: 'MRPL-OPS-112',
      fullName: 'Rohan Dias',
      unit: 'Safety & Compliance Audit',
      subUnit: 'Environmental & Process Safety',
      role: 'Safety & Compliance Auditor',
      createdDate: '2024-03-02',
      status: 'Inactive',
    },
  ]);

  const handleAddUser = (newUser) => {
    setUsersList((prev) => [
      ...prev,
      {
        username: newUser.username,
        uid: `MRPL-USER-${Math.floor(100 + Math.random() * 900)}`,
        fullName: newUser.fullName,
        unit: newUser.unit || 'Refinery Operations',
        subUnit: 'Process Control',
        role: newUser.role,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      },
    ]);
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(`Remove access for operator "${username}" from the sovereign directory?`)) {
      setUsersList((prev) => prev.filter((u) => u.username !== username));
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Add Button */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-headline)' }}>User Management</h1>
            <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '2px' }}>
              Manage authorized access, security clearance, and operational roles for refinery personnel.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              person_add
            </span>
            <span>+ Add User</span>
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
            justifyContent: 'space-between',
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
                placeholder="Search by name, username, or unit..."
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--mrpl-border)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="">All Roles</option>
              <option value="Sovereign Admin">Sovereign Admin</option>
              <option value="Lead Process Engineer">Lead Process Engineer</option>
              <option value="Shift DCS Operator">Shift DCS Operator</option>
              <option value="Safety & Compliance Auditor">Safety & Compliance Auditor</option>
            </select>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)' }}>
            Total Authorized Operators: <strong>{usersList.length}</strong>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
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
                <th style={{ padding: '12px 16px' }}>Operator / Username</th>
                <th style={{ padding: '12px 16px' }}>Full Name</th>
                <th style={{ padding: '12px 16px' }}>Department / Refinery Unit</th>
                <th style={{ padding: '12px 16px' }}>Assigned Role</th>
                <th style={{ padding: '12px 16px' }}>Created Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.username}
                  style={{
                    borderBottom: '1px solid var(--mrpl-border)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mrpl-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--mrpl-primary-dark)' }}>
                      {user.username}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>UID: {user.uid}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{user.fullName}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{user.unit}</div>
                    <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>{user.subUnit}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        backgroundColor: user.role === 'Sovereign Admin' ? 'var(--mrpl-primary-light)' : '#F2F5EA',
                        color: user.role === 'Sovereign Admin' ? 'var(--mrpl-primary-dark)' : 'var(--mrpl-text-primary)',
                        border: '1px solid var(--mrpl-border)',
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--mrpl-text-secondary)' }}>
                    {user.createdDate}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: user.status === 'Active' ? 'var(--mrpl-primary-light)' : '#E6E9DF',
                        color: user.status === 'Active' ? 'var(--mrpl-primary-dark)' : 'var(--mrpl-text-secondary)',
                        border: '1px solid var(--mrpl-border)',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '9999px',
                          backgroundColor: user.status === 'Active' ? 'var(--mrpl-primary-dark)' : 'var(--mrpl-text-muted)',
                        }}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      style={{
                        padding: '4px 8px',
                        color: 'var(--mrpl-error)',
                        borderRadius: '4px',
                      }}
                      title="Delete User"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        delete
                      </span>
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
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--mrpl-text-secondary)',
          }}
        >
          <span>Showing {filteredUsers.length} registered operator profiles</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>Access Level: Sovereign Internal Directory</span>
        </div>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddUser} />
    </div>
  );
}
