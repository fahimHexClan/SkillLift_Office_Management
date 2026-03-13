'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, Video, AlertCircle,
  Pencil, Check, X, AlertCircle as AlertErr, Lock,
  KeyRound, BarChart2, TrendingUp, Clock, ArrowUpRight,
  Quote,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/contexts/ToastContext';
import { T, card, inputCss, labelCss, spinner } from '@/lib/theme';
import { getInitials } from '@/lib/utils';

// ─── Stat Cards ───────────────────────────────────────────────────────────────
const STATS = [
  {
    title: 'Total Students',
    value: '2,847',
    sub: '+127 this month',
    trend: '+4.7%',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    glow: 'rgba(59,130,246,0.3)',
    glowLight: 'rgba(37,99,235,0.15)',
  },
  {
    title: 'Active Courses',
    value: '5',
    sub: '3 ongoing sessions',
    trend: 'Stable',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    glow: 'rgba(139,92,246,0.3)',
    glowLight: 'rgba(124,58,237,0.15)',
  },
  {
    title: 'Zoom Classes Today',
    value: '3',
    sub: 'Next at 2:00 PM',
    trend: '+1 today',
    icon: Video,
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glow: 'rgba(16,185,129,0.3)',
    glowLight: 'rgba(5,150,105,0.15)',
  },
  {
    title: 'Pending Issues',
    value: '2',
    sub: '1 critical',
    trend: '-3 resolved',
    icon: AlertCircle,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glow: 'rgba(245,158,11,0.3)',
    glowLight: 'rgba(215,119,6,0.15)',
  },
];

// ─── Activity feed ────────────────────────────────────────────────────────────
const ACTIVITY = [
  { type: 'success', msg: 'Password reset for SR526701',               time: '2 min ago' },
  { type: 'success', msg: 'New zoom class: Crypto Trading Masterclass', time: '1 hr ago' },
  { type: 'warning', msg: 'Duplicate registration detected: SR526702', time: '3 hrs ago' },
  { type: 'info',    msg: 'Course transfer: Kavindi → Forex Fundamentals', time: 'Yesterday' },
  { type: 'error',   msg: 'Failed login attempt detected',             time: 'Yesterday' },
  { type: 'success', msg: 'Batch transfer completed: BATCH-2026-A',    time: '2 days ago' },
];

const ACTIVITY_DOT: Record<string, string> = {
  success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6',
};
const ACTIVITY_BADGE: Record<string, { bg: string; color: string }> = {
  success: { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  warning: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  error:   { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  info:    { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
};

// ─── Daily Motivation ─────────────────────────────────────────────────────────
interface DailyQuote {
  quote: string;
  author: string;
  updatedBy: string;
  updatedAt: string;
}

function DailyMotivation() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [quoteData, setQuoteData]   = useState<DailyQuote | null>(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [editQuote, setEditQuote]   = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/quote')
      .then((r) => r.json())
      .then((d) => { setQuoteData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = () => {
    if (!quoteData) return;
    setEditQuote(quoteData.quote);
    setEditAuthor(quoteData.author);
    setSaveError(null);
    setEditing(true);
  };

  const cancel = () => { setEditing(false); setSaveError(null); };

  const save = async () => {
    if (!editQuote.trim() || !editAuthor.trim()) {
      setSaveError('Quote and author cannot be empty.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: editQuote, author: editAuthor }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error ?? 'Failed to save.');
        setSaving(false);
        return;
      }
      const updated: DailyQuote = await res.json();
      setQuoteData(updated);
      setEditing(false);
    } catch {
      setSaveError('Network error. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Quote size={14} color="var(--accent-primary)" />
          <p style={{ fontWeight: 700, fontSize: '13px', color: T.text }}>Daily Motivation</p>
        </div>
        {isAdmin && !editing && (
          <button
            onClick={startEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
              color: T.textSec, background: T.input, border: `1px solid ${T.borderHover}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.blue; (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.borderHover; (e.currentTarget as HTMLElement).style.color = T.textSec; }}
          >
            <Pencil size={10} /> Edit Quote
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textMuted, fontSize: '13px' }}>
            <span style={spinner} /> Loading quote…
          </div>
        ) : editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ ...labelCss, marginBottom: '5px', display: 'block' }}>Quote</label>
              <textarea
                autoFocus
                value={editQuote}
                onChange={(e) => { setEditQuote(e.target.value); setSaveError(null); }}
                rows={3}
                style={{
                  ...inputCss, width: '100%', resize: 'vertical', padding: '10px 12px',
                  fontStyle: 'italic', fontSize: '14px', lineHeight: 1.6,
                  border: `1.5px solid ${saveError ? 'var(--accent-red)' : 'var(--accent-primary)'}`,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ ...labelCss, marginBottom: '5px', display: 'block' }}>Author</label>
              <input
                value={editAuthor}
                onChange={(e) => { setEditAuthor(e.target.value); setSaveError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
                style={{ ...inputCss, width: '100%', height: '36px', padding: '0 12px', boxSizing: 'border-box' }}
              />
            </div>
            {saveError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AlertErr size={12} color="var(--accent-red)" />
                <p style={{ fontSize: '12px', color: 'var(--accent-red)' }}>{saveError}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={save} disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 16px', borderRadius: '8px', border: 'none',
                  background: T.gradient, color: 'white', fontWeight: 600, fontSize: '12px',
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                }}
              >
                {saving ? <span style={spinner} /> : <Check size={12} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={cancel} disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px',
                  border: `1px solid ${T.border}`, background: T.input,
                  color: T.textSec, fontWeight: 600, fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : quoteData ? (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'var(--accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Quote size={16} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '15px', fontStyle: 'italic', lineHeight: 1.65,
                color: T.text, fontWeight: 500, marginBottom: '10px',
              }}>
                "{quoteData.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  — {quoteData.author}
                </p>
                <p style={{ fontSize: '11px', color: T.textMuted }}>
                  Updated by {quoteData.updatedBy} · {new Date(quoteData.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: T.textMuted }}>No quote available.</p>
        )}
      </div>
    </div>
  );
}

// ─── Profile Quick Edit ───────────────────────────────────────────────────────
type FieldKey = 'name' | 'nic' | 'payId' | 'email' | 'contact' | 'srNumber';

interface FieldDef {
  key: FieldKey;
  label: string;
  adminOnly: boolean;
  readOnly?: boolean;
  type?: string;
  verify?: (v: string) => string | null;
}

const FIELDS: FieldDef[] = [
  { key: 'name',     label: 'Full Name',    adminOnly: false, verify: (v) => v.trim().length < 2 ? 'Name too short' : null },
  { key: 'nic',      label: 'NIC Number',   adminOnly: false, verify: (v) => /^[0-9]{9}[VvXx]$/.test(v) || /^[0-9]{12}$/.test(v) ? null : 'Invalid NIC format' },
  { key: 'payId',    label: 'Pay ID',       adminOnly: false, verify: (v) => /^[0-9]+$/.test(v.trim()) ? null : 'Pay ID must be numeric' },
  { key: 'email',    label: 'Email Address',adminOnly: false, type: 'email', verify: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email format' },
  { key: 'contact',  label: 'Mobile Number',adminOnly: false, type: 'tel',   verify: (v) => /^0[0-9]{9}$/.test(v) ? null : '10 digits starting with 0' },
  { key: 'srNumber', label: 'SR Number',    adminOnly: true,  verify: (v) => /^SR[0-9]+$/.test(v) ? null : 'Format: SR followed by digits' },
];

const MOCK_PROFILE: Record<FieldKey, string> = {
  name: 'Support Agent', nic: '921622503V', payId: '201824',
  email: 'admin@skilllift.lk', contact: '0712345678', srNumber: 'SR000001',
};

function ProfileCard() {
  const { isAdmin, role } = useUserRole();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const [values, setValues]   = useState<Record<FieldKey, string>>(MOCK_PROFILE);
  const [editKey, setEditKey] = useState<FieldKey | null>(null);
  const [editVal, setEditVal] = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [savedKey, setSavedKey] = useState<FieldKey | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setValues((prev) => ({
        ...prev,
        name:  session.user!.name  ?? prev.name,
        email: session.user!.email ?? prev.email,
      }));
    }
  }, [session]);

  const startEdit = (f: FieldDef) => {
    if (f.adminOnly && !isAdmin) return;
    setEditKey(f.key);
    setEditVal(values[f.key]);
    setError(null);
  };
  const cancel = () => { setEditKey(null); setError(null); };
  const save = async (f: FieldDef) => {
    const err = f.verify?.(editVal) ?? null;
    if (err) { setError(err); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setValues((p) => ({ ...p, [f.key]: editVal }));
    setSaving(false); setEditKey(null);
    setSavedKey(f.key);
    setTimeout(() => setSavedKey(null), 2500);
    addToast(`${f.label} updated successfully`);
  };

  const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
    Admin:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    Teacher: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    Staff:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  };
  const rc = ROLE_COLORS[role] ?? ROLE_COLORS.Staff;

  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {session?.user?.image && !imgError ? (
            <img
              src={session.user.image}
              alt={values.name}
              onError={() => setImgError(true)}
              style={{
                width: '42px', height: '42px', borderRadius: '12px',
                objectFit: 'cover', display: 'block', flexShrink: 0,
                boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
              }}
            />
          ) : (
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: T.gradient, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '15px',
              boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
            }}>{getInitials(values.name)}</div>
          )}
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: T.text }}>{values.name}</p>
            <span style={{ fontSize: '11px', fontWeight: 700, color: rc.color, background: rc.bg, padding: '2px 8px', borderRadius: '5px' }}>{role}</span>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: T.textMuted }}>Click <Pencil size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> to edit</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {FIELDS.map((f, idx) => {
          const isEditing = editKey === f.key;
          const locked    = f.adminOnly && !isAdmin;
          const isSaved   = savedKey === f.key;
          const colSpan   = idx === FIELDS.length - 1 && FIELDS.length % 2 !== 0;

          return (
            <div key={f.key} style={{
              padding: '14px 20px',
              borderBottom: idx < FIELDS.length - 2 ? `1px solid ${T.border}` : 'none',
              borderRight: idx % 2 === 0 ? `1px solid ${T.border}` : 'none',
              gridColumn: colSpan ? 'span 2' : undefined,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ ...labelCss, marginBottom: 0 }}>{f.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {f.adminOnly && (
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px',
                      color: 'var(--accent-purple)', background: 'rgba(139,92,246,0.12)',
                      display: 'flex', alignItems: 'center', gap: '3px', textTransform: 'uppercase',
                    }}><Lock size={8} /> Admin</span>
                  )}
                  {f.key === 'email' && !isEditing && (
                    <span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', color: 'var(--accent-green)', background: 'rgba(16,185,129,0.1)' }}>Verified</span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      autoFocus type={f.type ?? 'text'} value={editVal}
                      onChange={(e) => { setEditVal(e.target.value); setError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') save(f); if (e.key === 'Escape') cancel(); }}
                      style={{
                        ...inputCss, height: '34px', padding: '0 10px',
                        border: `1.5px solid ${error ? 'var(--accent-red)' : 'var(--accent-primary)'}`,
                        boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(59,130,246,0.12)',
                      }}
                    />
                    <button onClick={() => save(f)} disabled={saving} style={{
                      width: '34px', height: '34px', borderRadius: T.radiusSm, border: 'none',
                      background: T.gradient, color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(59,130,246,0.3)', opacity: saving ? 0.7 : 1,
                    }}>
                      {saving ? <span style={spinner} /> : <Check size={13} />}
                    </button>
                    <button onClick={cancel} style={{
                      width: '34px', height: '34px', borderRadius: T.radiusSm,
                      border: `1px solid ${T.border}`, background: T.input, color: T.textSec,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}><X size={13} /></button>
                  </div>
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                      <AlertErr size={11} color="var(--accent-red)" />
                      <p style={{ fontSize: '11px', color: 'var(--accent-red)' }}>{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: T.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {values[f.key] || '—'}
                    </p>
                    {isSaved && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, flexShrink: 0 }}>
                        <Check size={11} color="var(--accent-green)" /> Saved
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(f)} disabled={locked || !!editKey}
                    title={locked ? 'Admin only' : `Edit ${f.label}`}
                    style={{
                      width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                      background: locked ? 'transparent' : T.input,
                      border: `1px solid ${locked ? T.border : T.borderHover}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: locked || !!editKey ? 'not-allowed' : 'pointer',
                      color: locked ? T.textMuted : T.textSec,
                      opacity: !!editKey && !isEditing ? 0.3 : 1,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!locked && !editKey) (e.currentTarget as HTMLElement).style.borderColor = T.blue; }}
                    onMouseLeave={(e) => { if (!locked) (e.currentTarget as HTMLElement).style.borderColor = T.borderHover; }}
                  >
                    {locked ? <Lock size={11} /> : <Pencil size={11} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function ActivityFeed() {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} color="var(--accent-primary)" />
          <p style={{ fontWeight: 700, fontSize: '14px', color: T.text }}>Recent Activity</p>
        </div>
      </div>
      <div style={{ padding: '4px 0', flex: 1, overflowY: 'auto' }}>
        {ACTIVITY.map((a, i) => {
          const dot   = ACTIVITY_DOT[a.type] ?? T.textSec;
          const badge = ACTIVITY_BADGE[a.type] ?? { bg: 'rgba(148,163,184,0.1)', color: T.textSec };
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px 20px',
                borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${T.border}` : 'none',
                transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ marginTop: '5px', flexShrink: 0 }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: dot,
                  boxShadow: `0 0 6px ${dot}80`,
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: T.text, fontWeight: 500, lineHeight: 1.4 }}>{a.msg}</p>
                <p style={{ fontSize: '11px', color: T.textMuted, marginTop: '3px' }}>{a.time}</p>
              </div>
              <div style={{
                padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700,
                color: badge.color, background: badge.bg, flexShrink: 0,
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>{a.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isAdmin, canManage } = useUserRole();

  const quickActions = [
    { label: 'Reset Student Password', href: '/dashboard/admin/students', icon: KeyRound,  show: isAdmin,   gradient: 'linear-gradient(135deg, #ef4444, #f59e0b)' },
    { label: 'Manage Zoom Classes',    href: '/dashboard/zoom-classes',   icon: Video,     show: canManage, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { label: 'View Reports',           href: '/dashboard/reports',        icon: BarChart2, show: true,      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  ].filter((a) => a.show);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Row 1 — Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="fade-up"
              style={{
                background: 'var(--bg-card)',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '14px',
                cursor: 'default',
                transition: 'all 0.25s ease',
                animationDelay: `${i * 0.06}s`,
                animationFillMode: 'both',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = `var(--shadow-md), 0 0 24px ${s.glowLight}`;
                el.style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'var(--shadow-sm)';
                el.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.title}</p>
                  <p className="count-up" style={{ fontSize: '30px', fontWeight: 800, color: T.text, marginTop: '5px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</p>
                </div>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
                  background: s.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 6px 16px ${s.glowLight}`,
                }}>
                  <Icon size={20} color="white" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '12px', color: T.textSec }}>{s.sub}</p>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 600, color: 'var(--accent-green)' }}>
                  <TrendingUp size={11} />
                  {s.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Daily Motivation */}
      <div className="fade-up">
        <DailyMotivation />
      </div>

      {/* Row 3 — Profile + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
        <div className="fade-up">
          <p style={{ fontSize: '13px', fontWeight: 600, color: T.textSec, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Pencil size={13} color="var(--accent-primary)" /> My Profile
          </p>
          <ProfileCard />
        </div>
        <div className="fade-up">
          <p style={{ fontSize: '13px', fontWeight: 600, color: T.textSec, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} color="var(--accent-primary)" /> Activity
          </p>
          <ActivityFeed />
        </div>
      </div>

      {/* Row 4 — Quick actions */}
      {quickActions.length > 0 && (
        <div className="fade-up">
          <p style={{ fontSize: '13px', fontWeight: 600, color: T.textSec, marginBottom: '12px' }}>Quick Actions</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 22px', borderRadius: '12px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    textDecoration: 'none', transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-2px)';
                    el.style.borderColor = 'var(--border-hover)';
                    el.style.boxShadow = 'var(--shadow-md)';
                    el.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.borderColor = 'var(--border)';
                    el.style.boxShadow = 'var(--shadow-sm)';
                    el.style.background = 'var(--bg-card)';
                  }}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '11px',
                    background: a.gradient, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <Icon size={16} color="white" />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{a.label}</p>
                  <ArrowUpRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
