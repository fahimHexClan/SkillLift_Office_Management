'use client';

import { signIn } from 'next-auth/react';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1729 0%, #162035 60%, #0f1729 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div className="fade-up" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 24px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 36px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(59,130,246,0.45)',
          }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '18px', letterSpacing: '0.04em' }}>SKILIFT</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Support Portal</p>
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ color: 'white', fontWeight: 700, fontSize: '22px', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.5 }}>
            Sign in to access the support dashboard
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          marginBottom: '28px',
        }} />

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '13px 20px',
            borderRadius: '12px',
            background: loading ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.01em',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }
          }}
        >
          {loading ? (
            <span style={{
              width: '18px', height: '18px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '12px',
          marginTop: '24px',
          lineHeight: 1.6,
        }}>
          Access restricted to authorised Skill Lift staff only.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
