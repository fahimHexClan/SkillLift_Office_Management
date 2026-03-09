'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { ShieldCheck, Zap, Users } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Decorative gradient blobs ── */}
      <div style={{
        position: 'absolute', top: '-150px', left: '-150px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-120px', right: '-120px',
        width: '560px', height: '560px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '35%', right: '6%',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Dot grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, var(--border-hover) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        opacity: 0.6,
      }} />

      {/* ── Login Card ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
        margin: '0 24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '44px 40px 40px',
        boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(59,130,246,0.05)',
        animation: 'fadeUp 0.45s ease forwards',
      }}>

        {/* ── Logo area ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '34px', gap: '14px' }}>
          <div style={{
            padding: '14px 24px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(6,182,212,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: '16px',
          }}>
            <img
              src="/skilllift-logo0.png"
              alt="SkillLift"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = 'none';
                const fb = img.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            {/* Fallback logo */}
            <div style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
              }}>
                <Zap size={18} color="white" fill="white" />
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '16px', letterSpacing: '0.06em' }}>SKILIFT</p>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '99px',
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
              Support Portal — Online
            </span>
          </div>
        </div>

        {/* ── Headline ── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            color: 'var(--text-primary)', fontWeight: 800, fontSize: '26px',
            lineHeight: 1.2, marginBottom: '10px', letterSpacing: '-0.02em',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Sign in to manage students, classes,<br />and support operations.
          </p>
        </div>

        {/* ── Feature pills ── */}
        <div style={{
          display: 'flex', gap: '8px', justifyContent: 'center',
          marginBottom: '28px', flexWrap: 'wrap',
        }}>
          {[
            { icon: <Users size={11} />,       label: 'Student Mgmt' },
            { icon: <Zap size={11} />,          label: 'Zoom Classes' },
            { icon: <ShieldCheck size={11} />,  label: 'Admin Panel' },
          ].map((f) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 11px', borderRadius: '99px',
              background: 'var(--bg-input)', border: '1px solid var(--border)',
              fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              {f.icon}
              {f.label}
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em' }}>SIGN IN WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* ── Google Button ── */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '14px 20px',
            borderRadius: '13px',
            background: loading ? 'var(--bg-input)' : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            border: loading ? '1px solid var(--border)' : 'none',
            color: loading ? 'var(--text-secondary)' : 'white',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            letterSpacing: '0.01em',
            opacity: loading ? 0.75 : 1,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 8px 30px rgba(59,130,246,0.5)';
              el.style.background = 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 4px 20px rgba(59,130,246,0.4)';
              el.style.background = 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
            }
          }}
          onMouseDown={(e) => {
            if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(0.98)';
          }}
          onMouseUp={(e) => {
            if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1)';
          }}
        >
          {loading ? (
            <span style={{
              width: '18px', height: '18px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : (
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}>
              <GoogleIcon />
            </div>
          )}
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {/* ── Footer ── */}
        <div style={{
          marginTop: '24px', paddingTop: '18px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <ShieldCheck size={13} color="var(--text-muted)" />
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1 }}>
            Access restricted to authorised Skill Lift staff only.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
