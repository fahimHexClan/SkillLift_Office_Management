'use client';

import { useState } from 'react';
import { Video, Plus, Pencil, Trash2, ExternalLink, Copy, X, Shield } from 'lucide-react';
import { useZoomClasses } from '@/hooks/useZoomClasses';
import { useUserRole } from '@/hooks/useUserRole';
import { ZoomClass, ZoomClassForm, UserRole } from '@/types';
import { getInitials } from '@/lib/utils';

const EMPTY_FORM: ZoomClassForm = {
  className: '',
  zoomId: '',
  zoomLink: '',
  teacherName: '',
  startTime: '',
  date: '',
  isActive: true,
};

// ─── Role Badge ───────────────────────────────────────────────────────────────
const roleMeta: Record<UserRole, { color: string; bg: string; border: string }> = {
  Admin:   { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  Teacher: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  Staff:   { color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: active ? '#f0fdf4' : '#fef2f2',
      color: active ? '#15803d' : '#b91c1c',
      border: `1px solid ${active ? '#bbf7d0' : '#fecaca'}`,
      textTransform: 'uppercase' as const, letterSpacing: '0.04em',
    }}>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: active ? '#16a34a' : '#dc2626',
        display: 'inline-block',
      }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ─── Teacher Avatar ───────────────────────────────────────────────────────────
function TeacherAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
        background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: '11px',
      }}>{initials}</div>
      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>{name}</span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  editing: ZoomClass | null;
  form: ZoomClassForm;
  saving: boolean;
  onChange: (field: keyof ZoomClassForm, value: string | boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function ZoomClassModal({ open, editing, form, saving, onChange, onSubmit, onClose }: ModalProps) {
  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '13px', color: '#0f172a',
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'block',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,23,41,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '100%', maxWidth: '520px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        animation: 'fadeUp 0.2s ease forwards',
      }} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}>
              <Video size={16} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                {editing ? 'Edit Zoom Class' : 'Create Zoom Class'}
              </p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                {editing ? 'Update class details' : 'Add a new zoom session'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Class Name</label>
              <input
                style={inputStyle} placeholder="e.g. Crypto Masterclass"
                value={form.className}
                onChange={e => onChange('className', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div>
              <label style={labelStyle}>Zoom ID</label>
              <input
                style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="123 456 7890"
                value={form.zoomId}
                onChange={e => onChange('zoomId', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Zoom Link</label>
            <input
              style={inputStyle} placeholder="https://zoom.us/j/..."
              value={form.zoomLink} type="url"
              onChange={e => onChange('zoomLink', e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          <div>
            <label style={labelStyle}>Teacher Name</label>
            <input
              style={inputStyle} placeholder="e.g. R.M.H. Chanaka Bandara"
              value={form.teacherName}
              onChange={e => onChange('teacherName', e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#3b82f6')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input
                style={inputStyle} type="time"
                value={form.startTime}
                onChange={e => onChange('startTime', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                style={inputStyle} type="date"
                value={form.date}
                onChange={e => onChange('date', e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>

          {/* Status toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: '#f8fafc',
            borderRadius: '10px', border: '1px solid #f1f5f9',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Status</span>
            <button
              onClick={() => onChange('isActive', !form.isActive)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: form.isActive ? '#dcfce7' : '#fee2e2',
                color: form.isActive ? '#15803d' : '#b91c1c',
              }}
            >
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: form.isActive ? '#16a34a' : '#dc2626',
              }} />
              {form.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '14px 24px', borderTop: '1px solid #f1f5f9',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 600,
            background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            style={{
              padding: '8px 20px', borderRadius: '9px', fontSize: '13px', fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none', color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {saving ? (
              <>
                <span style={{
                  width: '12px', height: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.7s linear infinite',
                }} />
                Saving...
              </>
            ) : editing ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ZoomClassesPage() {
  const { classes, isLoading, create, update, remove } = useZoomClasses();
  const { role, setRole, canManage } = useUserRole();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ZoomClass | null>(null);
  const [form, setForm] = useState<ZoomClassForm>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingClass(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (zc: ZoomClass) => {
    setEditingClass(zc);
    setForm({
      className: zc.className,
      zoomId: zc.zoomId,
      zoomLink: zc.zoomLink,
      teacherName: zc.teacherName,
      startTime: zc.startTime,
      date: zc.date,
      isActive: zc.isActive,
    });
    setModalOpen(true);
  };

  const handleFormChange = (field: keyof ZoomClassForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.className || !form.zoomId || !form.teacherName) return;
    setSaving(true);
    if (editingClass) {
      await update(editingClass.id, form);
    } else {
      await create(form);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  const formatTime = (t: string) => {
    if (!t) return '—';
    const [h, min] = t.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${min} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const activeCount = classes.filter(c => c.isActive).length;

  const thStyle: React.CSSProperties = {
    padding: '10px 16px', textAlign: 'left',
    fontSize: '10px', fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Page Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '14px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}>
            <Video size={17} color="white" />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Zoom Classes</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>
              {classes.length} total · {activeCount} active
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dev role switcher */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '8px',
            background: roleMeta[role].bg, border: `1px solid ${roleMeta[role].border}`,
          }}>
            <Shield size={11} color={roleMeta[role].color} />
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontSize: '11px', fontWeight: 700, color: roleMeta[role].color,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {canManage && (
            <button
              onClick={openCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none', color: 'white', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Plus size={14} />
              Create Zoom Class
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div className="fade-up" style={{
          background: 'white', borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <th style={thStyle}>Class Name</th>
                <th style={thStyle}>Zoom ID</th>
                <th style={thStyle}>Teacher</th>
                <th style={thStyle}>Start Time</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                {canManage && <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 7 : 6} style={{ padding: '60px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Video size={20} color="#94a3b8" />
                      </div>
                      <p style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>No zoom classes yet</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>Create your first class to get started</p>
                    </div>
                  </td>
                </tr>
              )}
              {classes.map((zc, i) => (
                <tr
                  key={zc.id}
                  style={{
                    borderBottom: i < classes.length - 1 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Class Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Video size={13} color="#3b82f6" />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {zc.className}
                      </span>
                    </div>
                  </td>

                  {/* Zoom ID */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '12px', color: '#475569', fontFamily: 'monospace',
                        background: '#f8fafc', padding: '2px 8px', borderRadius: '6px',
                        border: '1px solid #f1f5f9',
                      }}>
                        {zc.zoomId}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(zc.zoomId)}
                        title="Copy Zoom ID"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#94a3b8', display: 'flex', padding: '2px',
                        }}
                      >
                        <Copy size={11} />
                      </button>
                      {zc.zoomLink && (
                        <a href={zc.zoomLink} target="_blank" rel="noreferrer"
                          title="Open Zoom link"
                          style={{ color: '#94a3b8', display: 'flex', padding: '2px' }}
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Teacher */}
                  <td style={{ padding: '14px 16px' }}>
                    <TeacherAvatar name={zc.teacherName} />
                  </td>

                  {/* Start Time */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '13px', color: '#374151', fontWeight: 500,
                      fontFamily: 'monospace',
                    }}>
                      {formatTime(zc.startTime)}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                      {formatDate(zc.date)}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge active={zc.isActive} />
                  </td>

                  {/* Actions */}
                  {canManage && (
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => openEdit(zc)}
                          title="Edit"
                          style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: '#eff6ff', border: '1px solid #bfdbfe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#1d4ed8', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                          }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(zc.id)}
                          disabled={deletingId === zc.id}
                          title="Delete"
                          style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: '#fef2f2', border: '1px solid #fecaca',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: deletingId === zc.id ? 'not-allowed' : 'pointer',
                            color: '#dc2626', transition: 'all 0.15s',
                            opacity: deletingId === zc.id ? 0.5 : 1,
                          }}
                          onMouseEnter={e => {
                            if (deletingId !== zc.id)
                              (e.currentTarget as HTMLElement).style.background = '#fee2e2';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fef2f2';
                          }}
                        >
                          {deletingId === zc.id
                            ? <span style={{
                                width: '10px', height: '10px',
                                border: '1.5px solid rgba(220,38,38,0.3)',
                                borderTopColor: '#dc2626', borderRadius: '50%',
                                display: 'inline-block', animation: 'spin 0.7s linear infinite',
                              }} />
                            : <Trash2 size={12} />
                          }
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staff notice */}
        {!canManage && (
          <div style={{
            marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: '#f8fafc', borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}>
            <Shield size={13} color="#94a3b8" />
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              You have read-only access. Contact an Admin or Teacher to make changes.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ZoomClassModal
        open={modalOpen}
        editing={editingClass}
        form={form}
        saving={saving}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
