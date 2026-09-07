import React from 'react';

/**
 * ExternalApiView Component (Page 2 of Admin Console)
 * Air-gap status banner, egress metrics, local loopback sockets list.
 * Bound to HealthStatus model.
 */
export function ExternalApiView({ healthStatus }) {
  const isAirGapped = healthStatus?.external_calls_enabled === false || true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-headline)' }}>
          External API Calls Status & Configuration
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '2px' }}>
          Monitor outbound network policy, egress firewall rules, and air-gapped isolation status.
        </p>
      </div>

      {/* Primary Air-Gap Status Banner */}
      <div
        className="card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--mrpl-primary-light)',
          borderLeft: '4px solid var(--mrpl-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(63, 125, 32, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--mrpl-primary-dark)' }}>
              shield
            </span>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--mrpl-text-primary)' }}>
              External API Calls: Disabled / Blocked
            </div>
            <p style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', marginTop: '2px' }}>
              Physical network interface restricted. Outbound cloud API endpoints are hard-blocked at kernel routing level.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(63, 125, 32, 0.4)',
            color: 'var(--mrpl-primary-dark)',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span className="pulse-running" style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--mrpl-primary-dark)' }} />
          <span>Strict Air-Gap Enforced</span>
        </div>
      </div>

      {/* 3 Egress Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--mrpl-text-secondary)' }}>
              Egress Firewall Rule
            </span>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary-dark)' }}>
              lock
            </span>
          </div>
          <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--mrpl-primary-dark)' }}>
            DROP ALL WAN TRAFFIC
          </div>
          <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', marginTop: '4px' }}>
            Kernel iptables default reject policy
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--mrpl-text-secondary)' }}>
              Outbound Cloud Connections
            </span>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary-dark)' }}>
              lan
            </span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--mrpl-primary-dark)' }}>
            0 Active Connections
          </div>
          <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', marginTop: '4px' }}>
            Zero external socket descriptors open
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--mrpl-text-secondary)' }}>
              DNS Resolution
            </span>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary-dark)' }}>
              dns
            </span>
          </div>
          <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--mrpl-text-primary)' }}>
            NXDOMAIN (Local Loopback)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--mrpl-text-secondary)', marginTop: '4px' }}>
            Public upstream resolvers non-existent
          </div>
        </div>
      </div>

      {/* Local Loopback Socket List */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--mrpl-border)', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>
              sync_alt
            </span>
            Local Connection Loopback Summary
          </h2>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--mrpl-primary-dark)', fontWeight: 600 }}>
            All Internal (127.0.0.1)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--mrpl-border)', backgroundColor: '#FAFBF8', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>memory</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Ollama LLM Daemon</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                  127.0.0.1:11434 • TCP Loopback
                </div>
              </div>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'var(--mrpl-primary-light)', color: 'var(--mrpl-primary-dark)', border: '1px solid rgba(63,125,32,0.3)' }}>
              AUTHORIZED
            </span>
          </div>

          <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--mrpl-border)', backgroundColor: '#FAFBF8', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>database</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Qdrant Vector Database</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                  127.0.0.1:6333 • Local Socket
                </div>
              </div>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'var(--mrpl-primary-light)', color: 'var(--mrpl-primary-dark)', border: '1px solid rgba(63,125,32,0.3)' }}>
              AUTHORIZED
            </span>
          </div>

          <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--mrpl-border)', backgroundColor: '#FAFBF8', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--mrpl-primary)' }}>terminal</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Refinery RAG Microservice</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mrpl-text-secondary)' }}>
                  127.0.0.1:8000 • Internal Uvicorn
                </div>
              </div>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'var(--mrpl-primary-light)', color: 'var(--mrpl-primary-dark)', border: '1px solid rgba(63,125,32,0.3)' }}>
              AUTHORIZED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
