'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserPlus, Copy, Check, Link2, Trash2, Shield, Users,
  RefreshCw, MessageCircle, ChevronDown, Loader2, ShieldOff,
} from 'lucide-react';
import { T } from '@/lib/theme';
import { useToast } from '@/contexts/ToastContext';

type Role = 'admin' | 'teacher' | 'staff';

interface Invite {
  token: string;
  role: Role;
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
}

interface UserRecord {
  email: string;
  role: Role;
  assignedAt: string;
  assignedBy: string;
}

const ROLE_META: Record<Role, { color: string; bg: string; border: string; label: string }> = {
  admin:   { label: 'Admin',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)' },
  teacher: { label: 'Teacher', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.25)' },
  staff:   { label: 'Staff',   color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
};

function getInviteStatus(inv: Invite): 'pending' | 'used' | 'expired' {
  if (inv.usedBy) return 'used';
  if (new Date() > new Date(inv.expiresAt)) return 'expired';
  return 'pending';
}

function fmtDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return d; }
}

function RoleBadge({ role }: { role: Role }) {
  const m = ROLE_META[role];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 9px', borderRadius: '7px', fontSize: '11px', fontWeight: 700,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
    }}>
      <Shield size={9} />
      {m.label}
    </span>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'used' | 'expired' }) {
  const cfg = {
    pending: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  label: 'Pending' },
    used:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: 'Used' },
    expired: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', label: 'Expired' },
  }[status];
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px', borderRadius: '7px',
      fontSize: '11px', fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

export default function UsersPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const { addToast } = useToast();

  // Generate invite state
  const [genRole, setGenRole]       = useState<Role>('teacher');
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied]         = useState(false);

  // Data
  const [invites, setInvites]       = useState<Invite[]>([]);
  const [users, setUsers]           = useState<UserRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Per-row state for user role updates
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [deletingInvite, setDeletingInvite] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [invRes, usrRes] = await Promise.all([
        fetch('/api/invite/list'),
        fetch('/api/users/list'),
      ]);
      if (invRes.ok) setInvites(await invRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedUrl('');
    try {
      const res = await fetch('/api/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: genRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedUrl(data.inviteUrl);
        loadData();
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`You've been invited to join SkillLift OMS as ${ROLE_META[genRole].label}.\n\nClick the link to accept:\n${generatedUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDeleteInvite = async (token: string) => {
    setDeletingInvite(token);
    try {
      await fetch('/api/invite/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
      setInvites((prev) => prev.filter((i) => i.token !== token));
      if (generatedUrl.includes(token)) setGeneratedUrl('');
    } finally {
      setDeletingInvite(null);
    }
  };

  const handleUpdateRole = async (email: string, role: Role) => {
    setUpdatingRole(email);
    try {
      const res = await fetch('/api/invite/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.email === email ? { ...u, role } : u));
        addToast('Role updated successfully', 'success');
      } else {
        addToast('Failed to update role', 'error');
      }
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) return;
    setRemovingUser(email);
    try {
      const res = await fetch('/api/users/remove', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        // Use server-confirmed list so stale in-memory state can't sneak back
        setUsers(data.users);
      } else {
        setUsers((prev) => prev.filter((u) => u.email !== email));
      }
      if (res.ok) addToast('User removed successfully', 'success');
      else addToast(data.error ?? 'Failed to remove user', 'error');
    } finally {
      setRemovingUser(null);
    }
  };

  // Guard: not admin
  if (!session) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <Loader2 size={24} color={T.textMuted} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldOff size={28} color="var(--accent-red)" />
        </div>
        <p style={{ fontSize: '16px', fontWeight: 700, color: T.text }}>Admin Access Required</p>
        <p style={{ fontSize: '13px', color: T.textSec }}>Only admins can manage users and invite links.</p>
      </div>
    );
  }

  const sectionHead = (label: string, icon: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      {icon}
      <h2 style={{ fontSize: '13px', fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>{label}</h2>
    </div>
  );

  const card = (children: React.ReactNode) => (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: '16px', padding: '20px 24px',
      boxShadow: T.shadowCard,
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
          }}>
            <Users size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: T.text, lineHeight: 1.2 }}>User Management</h1>
            <p style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>Invite team members and manage access</p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loadingData}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: 600,
            background: T.input, border: `1px solid ${T.border}`, color: T.textSec,
            cursor: loadingData ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
          }}
        >
          <RefreshCw size={13} style={{ animation: loadingData ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* ── Generate Invite ── */}
      {card(
        <>
          {sectionHead('Generate Invite Link', <UserPlus size={14} color="var(--accent-primary)" />)}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

            {/* Role select */}
            <div style={{ flex: '0 0 auto' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Role</p>
              <div style={{ position: 'relative' }}>
                <select
                  value={genRole}
                  onChange={(e) => setGenRole(e.target.value as Role)}
                  style={{
                    appearance: 'none', WebkitAppearance: 'none',
                    background: T.input, border: `1px solid ${T.border}`,
                    borderRadius: '9px', padding: '9px 32px 9px 12px',
                    fontSize: '13px', fontWeight: 600,
                    color: ROLE_META[genRole].color,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    minWidth: '130px',
                  }}
                >
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={12} color={T.textMuted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 20px', borderRadius: '9px',
                background: generating ? T.input : 'var(--gradient-main)',
                border: `1px solid ${generating ? T.border : 'transparent'}`,
                fontSize: '13px', fontWeight: 700, color: generating ? T.textMuted : 'white',
                cursor: generating ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
                boxShadow: generating ? 'none' : '0 4px 14px rgba(59,130,246,0.35)',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {generating
                ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><Link2 size={13} /> Generate Link</>
              }
            </button>
          </div>

          {/* Generated link display */}
          {generatedUrl && (
            <div style={{
              marginTop: '16px', padding: '14px 16px',
              background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: '12px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Invite Link Ready
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  flex: 1, minWidth: 0,
                  background: T.input, border: `1px solid ${T.border}`,
                  borderRadius: '8px', padding: '8px 12px',
                  fontSize: '12px', fontFamily: 'monospace', color: T.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {generatedUrl}
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', borderRadius: '8px', flexShrink: 0,
                    background: copied ? 'rgba(16,185,129,0.12)' : T.input,
                    border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : T.border}`,
                    fontSize: '12px', fontWeight: 600,
                    color: copied ? '#10b981' : T.textSec,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleWhatsApp}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
                    fontSize: '12px', fontWeight: 600, color: '#25D366',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
                  }}
                >
                  <MessageCircle size={12} />
                  WhatsApp
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Active Invites ── */}
      {card(
        <>
          {sectionHead(`Active Invites (${invites.length})`, <Link2 size={14} color="var(--accent-primary)" />)}
          {loadingData ? (
            <div style={{ padding: '24px', textAlign: 'center', color: T.textMuted, fontSize: '13px' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', display: 'inline', marginRight: '8px' }} />
              Loading…
            </div>
          ) : invites.length === 0 ? (
            <p style={{ fontSize: '13px', color: T.textMuted, padding: '16px 0', textAlign: 'center' }}>
              No invite links yet. Generate one above.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Token', 'Role', 'Created', 'Expires', 'Status', 'Used By', ''].map((h) => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invites.map((inv) => {
                    const st = getInviteStatus(inv);
                    return (
                      <tr key={inv.token} style={{ borderBottom: `1px solid ${T.border}` }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.cardHover; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: T.text, whiteSpace: 'nowrap' }}>
                          {inv.token.slice(0, 8)}…
                        </td>
                        <td style={{ padding: '10px 10px' }}><RoleBadge role={inv.role} /></td>
                        <td style={{ padding: '10px 10px', color: T.textSec, whiteSpace: 'nowrap' }}>{fmtDate(inv.createdAt)}</td>
                        <td style={{ padding: '10px 10px', color: T.textSec, whiteSpace: 'nowrap' }}>{fmtDate(inv.expiresAt)}</td>
                        <td style={{ padding: '10px 10px' }}><StatusBadge status={st} /></td>
                        <td style={{ padding: '10px 10px', color: T.textMuted, fontSize: '11px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {inv.usedBy ?? '—'}
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <button
                            onClick={() => handleDeleteInvite(inv.token)}
                            disabled={deletingInvite === inv.token}
                            title="Delete invite"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '28px', height: '28px', borderRadius: '7px',
                              background: 'transparent', border: '1px solid transparent',
                              cursor: 'pointer', transition: 'all 0.15s', color: T.textMuted,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(239,68,68,0.1)';
                              el.style.borderColor = 'rgba(239,68,68,0.2)';
                              el.style.color = 'var(--accent-red)';
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'transparent';
                              el.style.borderColor = 'transparent';
                              el.style.color = T.textMuted;
                            }}
                          >
                            {deletingInvite === inv.token
                              ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                              : <Trash2 size={13} />
                            }
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Current Users ── */}
      {card(
        <>
          {sectionHead(`System Users (${users.length})`, <Shield size={14} color="var(--accent-primary)" />)}
          {loadingData ? (
            <div style={{ padding: '24px', textAlign: 'center', color: T.textMuted, fontSize: '13px' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', display: 'inline', marginRight: '8px' }} />
              Loading…
            </div>
          ) : users.length === 0 ? (
            <p style={{ fontSize: '13px', color: T.textMuted, padding: '16px 0', textAlign: 'center' }}>
              No users yet. Share an invite link to get started.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Email', 'Role', 'Assigned', 'Assigned By', ''].map((h) => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr) => {
                    const isSelf = usr.email.toLowerCase() === session?.user?.email?.toLowerCase();
                    return (
                      <tr key={usr.email} style={{ borderBottom: `1px solid ${T.border}` }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.cardHover; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '10px 10px', color: T.text, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {usr.email}
                          {isSelf && (
                            <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(59,130,246,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                              You
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <select
                              value={usr.role}
                              onChange={(e) => handleUpdateRole(usr.email, e.target.value as Role)}
                              disabled={updatingRole === usr.email || isSelf}
                              style={{
                                appearance: 'none', WebkitAppearance: 'none',
                                background: ROLE_META[usr.role].bg,
                                border: `1px solid ${ROLE_META[usr.role].border}`,
                                borderRadius: '7px', padding: '3px 24px 3px 8px',
                                fontSize: '11px', fontWeight: 700,
                                color: ROLE_META[usr.role].color,
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                fontFamily: "'Inter', sans-serif",
                                opacity: updatingRole === usr.email ? 0.5 : 1,
                              }}
                            >
                              <option value="admin">Admin</option>
                              <option value="teacher">Teacher</option>
                              <option value="staff">Staff</option>
                            </select>
                            <ChevronDown size={10} color={ROLE_META[usr.role].color} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          </div>
                        </td>
                        <td style={{ padding: '10px 10px', color: T.textSec, whiteSpace: 'nowrap' }}>{fmtDate(usr.assignedAt)}</td>
                        <td style={{ padding: '10px 10px', color: T.textMuted, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {usr.assignedBy === 'system' ? 'System' : usr.assignedBy}
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          {!isSelf && (
                            <button
                              onClick={() => handleRemoveUser(usr.email)}
                              disabled={removingUser === usr.email}
                              title="Remove access"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '28px', height: '28px', borderRadius: '7px',
                                background: 'transparent', border: '1px solid transparent',
                                cursor: 'pointer', transition: 'all 0.15s', color: T.textMuted,
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = 'rgba(239,68,68,0.1)';
                                el.style.borderColor = 'rgba(239,68,68,0.2)';
                                el.style.color = 'var(--accent-red)';
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = 'transparent';
                                el.style.borderColor = 'transparent';
                                el.style.color = T.textMuted;
                              }}
                            >
                              {removingUser === usr.email
                                ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                : <Trash2 size={13} />
                              }
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
