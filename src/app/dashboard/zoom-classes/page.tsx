'use client';

import { useState } from 'react';
import { Video, Plus, Pencil, Trash2, ExternalLink, Copy, X, Check, Search, Filter } from 'lucide-react';
import { useZoomClasses } from '@/hooks/useZoomClasses';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/contexts/ToastContext';
import { ZoomClass, ZoomClassForm } from '@/types';
import { getInitials } from '@/lib/utils';
import { T, card, inputCss, labelCss, btnPrimary, btnGhost, spinner } from '@/lib/theme';

const EMPTY_FORM: ZoomClassForm = {
  className: '', zoomId: '', zoomLink: '', teacherName: '', startTime: '', date: '', isActive: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`;
}
function fmtTime(t: string) {
  if (!t) return '—';
  const [h, min] = t.split(':');
  const hr = +h;
  return `${hr > 12 ? hr - 12 : hr || 12}:${min} ${hr >= 12 ? 'PM' : 'AM'}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: active ? '#dcfce7' : '#fee2e2',
      color: active ? '#16a34a' : '#dc2626',
      border: `1px solid ${active ? '#86efac' : '#fecaca'}`,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: active ? '#16a34a' : '#dc2626' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ─── Teacher cell ─────────────────────────────────────────────────────────────
function TeacherCell({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
        background: T.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: '11px',
      }}>{getInitials(name)}</div>
      <span style={{ fontSize: '13px', color: T.text, fontWeight: 500 }}>{name}</span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ZoomModal({ open, editing, form, saving, onChange, onSubmit, onClose }: {
  open: boolean; editing: ZoomClass | null; form: ZoomClassForm; saving: boolean;
  onChange: (f: keyof ZoomClassForm, v: string | boolean) => void;
  onSubmit: () => void; onClose: () => void;
}) {
  if (!open) return null;

  const fi = (focus: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = focus ? T.blue : T.border;
    e.target.style.boxShadow   = focus ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }} onClick={onClose}>
      <div style={{
        ...card, width: '100%', maxWidth: '520px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeUp 0.2s ease forwards', overflow: 'visible',
        borderRadius: T.radiusXl,
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: `1px solid ${T.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', background: T.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            }}>
              <Video size={16} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: T.text }}>{editing ? 'Edit Zoom Class' : 'Create Zoom Class'}</p>
              <p style={{ fontSize: '11px', color: T.textSec }}>{editing ? 'Update class details' : 'Add a new zoom session'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '30px', height: '30px', borderRadius: T.radiusSm,
            background: T.input, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: T.textSec,
          }}><X size={14} /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelCss}>Class Name</label>
              <input style={inputCss} placeholder="e.g. Crypto Masterclass" value={form.className}
                onChange={(e) => onChange('className', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
            </div>
            <div>
              <label style={labelCss}>Zoom ID</label>
              <input style={{ ...inputCss, fontFamily: 'monospace' }} placeholder="123 456 7890" value={form.zoomId}
                onChange={(e) => onChange('zoomId', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
            </div>
          </div>

          <div>
            <label style={labelCss}>Zoom Link</label>
            <input style={inputCss} type="url" placeholder="https://zoom.us/j/..." value={form.zoomLink}
              onChange={(e) => onChange('zoomLink', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
          </div>

          <div>
            <label style={labelCss}>Teacher Name</label>
            <input style={inputCss} placeholder="e.g. R.M.H. Chanaka Bandara" value={form.teacherName}
              onChange={(e) => onChange('teacherName', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelCss}>Start Time</label>
              <input style={inputCss} type="time" value={form.startTime}
                onChange={(e) => onChange('startTime', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
            </div>
            <div>
              <label style={labelCss}>Date</label>
              <input style={inputCss} type="date" value={form.date}
                onChange={(e) => onChange('date', e.target.value)} onFocus={fi(true)} onBlur={fi(false)} />
            </div>
          </div>

          {/* Status toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: T.input, borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: T.textSec }}>Status</span>
            <button onClick={() => onChange('isActive', !form.isActive)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', border: 'none',
              background: form.isActive ? '#dcfce7' : '#fee2e2',
              color: form.isActive ? '#16a34a' : '#dc2626',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: form.isActive ? '#16a34a' : '#dc2626' }} />
              {form.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '14px 24px', borderTop: `1px solid ${T.border}`,
        }}>
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button onClick={onSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
            {saving ? <span style={spinner} /> : null}
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ZoomClassesPage() {
  const { classes, create, update, remove } = useZoomClasses();
  const { canManage } = useUserRole();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen]     = useState(false);
  const [editingClass, setEditingClass] = useState<ZoomClass | null>(null);
  const [form, setForm]               = useState<ZoomClassForm>(EMPTY_FORM);
  const [deletingId, setDeletingId]   = useState<number | null>(null);
  const [saving, setSaving]           = useState(false);
  const [searchQ, setSearchQ]         = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedId, setCopiedId]       = useState<number | null>(null);

  const openCreate = () => { setEditingClass(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (zc: ZoomClass) => {
    setEditingClass(zc);
    setForm({ className: zc.className, zoomId: zc.zoomId, zoomLink: zc.zoomLink, teacherName: zc.teacherName, startTime: zc.startTime, date: zc.date, isActive: zc.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.className || !form.zoomId || !form.teacherName) return;
    setSaving(true);
    if (editingClass) { await update(editingClass.id, form); addToast('Zoom class updated'); }
    else              { await create(form); addToast('Zoom class created'); }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
    addToast('Class deleted', 'warning');
  };

  const copyId = (id: number, zoomId: string) => {
    navigator.clipboard.writeText(zoomId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = classes
    .filter((c) => filterStatus === 'all' || (filterStatus === 'active' ? c.isActive : !c.isActive))
    .filter((c) => !searchQ || c.className.toLowerCase().includes(searchQ.toLowerCase()) || c.teacherName.toLowerCase().includes(searchQ.toLowerCase()));

  const thS: React.CSSProperties = {
    padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700,
    color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search by class name or teacher…"
            style={{ ...inputCss, paddingLeft: '36px', height: '40px' }}
            onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px', background: T.input, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, overflow: 'hidden' }}>
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{
              padding: '8px 14px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: filterStatus === f ? T.gradient : 'transparent',
              color: filterStatus === f ? 'white' : T.textSec,
              textTransform: 'capitalize', fontFamily: "'Inter', sans-serif",
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>

        {/* Stats */}
        <span style={{ fontSize: '12px', color: T.textSec }}>
          {classes.filter((c) => c.isActive).length} active · {classes.length} total
        </span>

        {canManage && (
          <button onClick={openCreate} style={btnPrimary}>
            <Plus size={14} /> Create Class
          </button>
        )}
      </div>

      {/* Table */}
      <div className="fade-up" style={{ ...card }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: T.input, borderBottom: `1px solid ${T.border}` }}>
              <th style={{ ...thS, width: '40px' }}>#</th>
              <th style={thS}>Class Name</th>
              <th style={thS}>Zoom ID</th>
              <th style={thS}>Teacher</th>
              <th style={thS}>Date</th>
              <th style={thS}>Start Time</th>
              <th style={thS}>Status</th>
              {canManage && <th style={{ ...thS, textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={canManage ? 8 : 7} style={{ padding: '64px 0', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '14px',
                      background: '#f1f5f9', border: `1px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Video size={22} color={T.textMuted} />
                    </div>
                    <p style={{ fontWeight: 600, color: T.textSec, fontSize: '14px' }}>
                      {searchQ ? 'No classes match your search' : 'No zoom classes yet'}
                    </p>
                    <p style={{ fontSize: '12px', color: T.textMuted }}>
                      {searchQ ? 'Try different keywords' : canManage ? 'Click "Create Class" to add one' : 'Classes will appear here once added'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((zc, i) => (
              <tr key={zc.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '12px', color: T.textMuted, fontFamily: 'monospace' }}>{i + 1}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                    }}>
                      <Video size={13} color="white" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{zc.className}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      fontSize: '12px', color: T.textSec, fontFamily: 'monospace',
                      background: T.input, padding: '2px 8px', borderRadius: '5px',
                      border: `1px solid ${T.border}`,
                    }}>{zc.zoomId}</span>
                    <button onClick={() => copyId(zc.id, zc.zoomId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, display: 'flex', padding: '2px' }}>
                      {copiedId === zc.id ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                    </button>
                    {zc.zoomLink && (
                      <a href={zc.zoomLink} target="_blank" rel="noreferrer" style={{ color: T.textMuted, display: 'flex', padding: '2px' }} title="Open Zoom link">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><TeacherCell name={zc.teacherName} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '13px', color: T.textSec, fontWeight: 500 }}>{fmtDate(zc.date)}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '13px', color: T.textSec, fontFamily: 'monospace', fontWeight: 500 }}>{fmtTime(zc.startTime)}</span>
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge active={zc.isActive} /></td>
                {canManage && (
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => openEdit(zc)} title="Edit" style={{
                        width: '30px', height: '30px', borderRadius: T.radiusSm,
                        background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--accent-primary)', transition: 'all 0.15s',
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.22)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      ><Pencil size={12} /></button>
                      <button onClick={() => handleDelete(zc.id)} disabled={deletingId === zc.id} title="Delete" style={{
                        width: '30px', height: '30px', borderRadius: T.radiusSm,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: deletingId === zc.id ? 'not-allowed' : 'pointer',
                        color: 'var(--accent-red)', transition: 'all 0.15s', opacity: deletingId === zc.id ? 0.5 : 1,
                      }}
                        onMouseEnter={(e) => { if (deletingId !== zc.id) { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; } }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      >
                        {deletingId === zc.id
                          ? <span style={{ ...spinner, width: '10px', height: '10px' }} />
                          : <Trash2 size={12} />}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ZoomModal open={modalOpen} editing={editingClass} form={form} saving={saving}
        onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))}
        onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
    </div>
  );
}
