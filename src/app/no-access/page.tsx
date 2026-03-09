'use client';

import { signOut } from 'next-auth/react';
import { ShieldOff, LogOut } from 'lucide-react';

export default function NoAccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: '420px', width: '100%', textAlign: 'center',
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(239,68,68,0.15)',
        borderRadius: '24px', padding: '48px 36px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <ShieldOff size={32} color="#ef4444" />
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>
          Access Denied
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px' }}>
          You don't have access to this system. Please contact your administrator to get an invite link.
        </p>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '11px 24px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            fontSize: '13px', fontWeight: 600, color: '#f87171',
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
