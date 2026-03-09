'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Shield, CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

type InviteStatus = 'loading' | 'valid' | 'used' | 'expired' | 'invalid';

const ROLE_META: Record<string, { label: string; color: string; bg: string; border: string; grad: string }> = {
  admin:   { label: 'Admin',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  teacher: { label: 'Teacher', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.25)',  grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  staff:   { label: 'Staff',   color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)',  grad: 'linear-gradient(135deg,#64748b,#94a3b8)' },
};

function InvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const token = searchParams.get('token') ?? '';

  const [inviteStatus, setInviteStatus] = useState<InviteStatus>('loading');
  const [inviteRole, setInviteRole]     = useState<string>('');
  const [accepting, setAccepting]       = useState(false);
  const [accepted, setAccepted]         = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');

  useEffect(() => {
    if (!token) { setInviteStatus('invalid'); return; }
    fetch(`/api/invite/validate?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        setInviteStatus(d.status as InviteStatus);
        if (d.role) setInviteRole(d.role);
      })
      .catch(() => setInviteStatus('invalid'));
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? 'Something went wrong'); return; }
      setAccepted(true);
      // Refresh session so JWT picks up the new role
      await update();
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const rm = ROLE_META[inviteRole] ?? ROLE_META.staff;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '28px' }}>
          <img
            src="/skilllift-logo0.png"
            alt="SkillLift"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* Loading state */}
        {inviteStatus === 'loading' && (
          <div style={{ padding: '20px 0' }}>
            <Loader2 size={36} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Validating invite link…</p>
          </div>
        )}

        {/* Invalid token */}
        {inviteStatus === 'invalid' && (
          <StatusBlock
            icon={<XCircle size={48} color="#ef4444" />}
            color="#ef4444"
            title="Invalid Link"
            message="This invite link is invalid or doesn't exist. Please contact your administrator for a new link."
          />
        )}

        {/* Expired token */}
        {inviteStatus === 'expired' && (
          <StatusBlock
            icon={<Clock size={48} color="#f59e0b" />}
            color="#f59e0b"
            title="Link Expired"
            message="This invite link has expired (links are valid for 7 days). Please ask your administrator to generate a new one."
          />
        )}

        {/* Already used */}
        {inviteStatus === 'used' && (
          <StatusBlock
            icon={<AlertTriangle size={48} color="#f59e0b" />}
            color="#f59e0b"
            title="Already Used"
            message="This invite link has already been used. If you think this is a mistake, contact your administrator."
          />
        )}

        {/* Valid invite */}
        {inviteStatus === 'valid' && !accepted && (
          <>
            {/* Role badge */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: rm.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 12px 32px ${rm.color}40`,
            }}>
              <Shield size={32} color="white" />
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.2 }}>
              You've been invited!
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.6 }}>
              Join SkillLift Office Management System as
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '12px',
              background: rm.bg, border: `1px solid ${rm.border}`,
              marginBottom: '28px',
            }}>
              <Shield size={14} color={rm.color} />
              <span style={{ fontSize: '15px', fontWeight: 800, color: rm.color, letterSpacing: '0.04em' }}>
                {rm.label}
              </span>
            </div>

            {errorMsg && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '13px', color: '#f87171', textAlign: 'left',
              }}>
                {errorMsg}
              </div>
            )}

            {/* Not logged in → Google sign in */}
            {status === 'unauthenticated' && (
              <>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Sign in with your Google account to accept this invitation.
                </p>
                <button
                  onClick={() => signIn('google', { callbackUrl: `/invite?token=${token}` })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', padding: '13px 20px', borderRadius: '12px',
                    background: 'white', border: '1px solid rgba(0,0,0,0.08)',
                    fontSize: '14px', fontWeight: 600, color: '#1f2937',
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Loading session check */}
            {status === 'loading' && (
              <div style={{ padding: '16px 0', color: '#64748b', fontSize: '13px' }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} /> Checking session…
              </div>
            )}

            {/* Logged in → Accept button */}
            {status === 'authenticated' && (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', marginBottom: '16px',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: 'white',
                  }}>
                    {(session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? '?').toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session?.user?.name ?? 'Unknown'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session?.user?.email}
                    </p>
                  </div>
                  <CheckCircle2 size={14} color="#10b981" />
                </div>

                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%', padding: '13px 20px', borderRadius: '12px',
                    background: accepting ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                    border: 'none', fontSize: '14px', fontWeight: 700, color: 'white',
                    cursor: accepting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    boxShadow: accepting ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {accepting
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Accepting…</>
                    : <><Shield size={16} /> Accept Invitation</>
                  }
                </button>
              </>
            )}
          </>
        )}

        {/* Success state */}
        {accepted && (
          <div style={{ padding: '8px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg,#10b981,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 12px 32px rgba(16,185,129,0.35)',
            }}>
              <CheckCircle2 size={36} color="white" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px' }}>
              Welcome aboard!
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
              Your <span style={{ color: rm.color, fontWeight: 700 }}>{rm.label}</span> access has been granted.
            </p>
            <p style={{ fontSize: '12px', color: '#475569' }}>Redirecting to dashboard…</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatusBlock({ icon, color, title, message }: { icon: React.ReactNode; color: string; title: string; message: string }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color, marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{message}</p>
    </div>
  );
}

export default function InvitePageWrapper() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <InvitePage />
    </Suspense>
  );
}
