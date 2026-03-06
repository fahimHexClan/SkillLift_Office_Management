'use client';

import { useState } from 'react';
import { Pencil, Check, X, AlertCircle, Lock } from 'lucide-react';
import { Student } from '@/types';
import { useUserRole } from '@/hooks/useUserRole';

interface Props {
  student: Student;
  payId: string;
  onSave?: (field: string, value: string) => void;
}

type FieldKey = 'nic' | 'payId' | 'email' | 'contact' | 'srNumber';

interface FieldDef {
  key: FieldKey;
  label: string;
  adminOnly: boolean;
  needsVerification?: boolean;
  type?: string;
  validate: (v: string) => string | null;
}

const FIELDS: FieldDef[] = [
  {
    key: 'nic', label: 'NIC Number', adminOnly: false,
    validate: (v) => {
      if (!v.trim()) return 'NIC is required';
      if (!/^[0-9]{9}[VvXx]$/.test(v) && !/^[0-9]{12}$/.test(v))
        return 'Invalid NIC format (e.g. 921622503V or 199216225034)';
      return null;
    },
  },
  {
    key: 'payId', label: 'Pay ID', adminOnly: false,
    validate: (v) => {
      if (!v.trim()) return 'Pay ID is required';
      if (!/^[0-9]+$/.test(v)) return 'Pay ID must be numeric';
      return null;
    },
  },
  {
    key: 'email', label: 'Email Address', adminOnly: false, needsVerification: true, type: 'email',
    validate: (v) => {
      if (!v.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format';
      return null;
    },
  },
  {
    key: 'contact', label: 'Mobile Number', adminOnly: false, type: 'tel',
    validate: (v) => {
      if (!v.trim()) return 'Mobile number is required';
      if (!/^0[0-9]{9}$/.test(v)) return 'Must be 10 digits starting with 0';
      return null;
    },
  },
  {
    key: 'srNumber', label: 'SR Number', adminOnly: true,
    validate: (v) => {
      if (!v.trim()) return 'SR Number is required';
      if (!/^SR[0-9]+$/.test(v)) return 'Must start with SR followed by digits';
      return null;
    },
  },
];

export default function ProfileQuickEdit({ student, payId, onSave }: Props) {
  const { isAdmin } = useUserRole();

  const initialValues: Record<FieldKey, string> = {
    nic: student.nic,
    payId: payId,
    email: student.email,
    contact: student.contact,
    srNumber: student.srNumber,
  };

  const [values, setValues] = useState<Record<FieldKey, string>>(initialValues);
  const [editingKey, setEditingKey] = useState<FieldKey | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<FieldKey | null>(null);

  const startEdit = (field: FieldDef) => {
    if (field.adminOnly && !isAdmin) return;
    setEditingKey(field.key);
    setEditValue(values[field.key]);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
    setError(null);
  };

  const saveEdit = async (field: FieldDef) => {
    const err = field.validate(editValue);
    if (err) { setError(err); return; }

    setSaving(true);
    // TODO: await apiClient.patch(`/api/students/${student.id}`, { [field.key]: editValue });
    await new Promise((r) => setTimeout(r, 500));
    setValues((prev) => ({ ...prev, [field.key]: editValue }));
    onSave?.(field.key, editValue);
    setSaving(false);
    setEditingKey(null);
    setSavedKey(field.key);
    setTimeout(() => setSavedKey(null), 2000);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
  };

  return (
    <div style={{
      background: 'white', borderRadius: '14px',
      border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pencil size={13} color="#3b82f6" />
          <p style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>Quick Edit</p>
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Click the pencil icon to edit a field</p>
      </div>

      {/* Fields grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0', padding: '4px 0',
      }}>
        {FIELDS.map((field, idx) => {
          const isEditing = editingKey === field.key;
          const isSaved = savedKey === field.key;
          const locked = field.adminOnly && !isAdmin;

          return (
            <div key={field.key} style={{
              padding: '14px 20px',
              borderBottom: idx < FIELDS.length - 1 ? '1px solid #f8fafc' : 'none',
              borderRight: idx % 2 === 0 ? '1px solid #f8fafc' : 'none',
              gridColumn: idx === FIELDS.length - 1 && FIELDS.length % 2 !== 0 ? 'span 2' : undefined,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={labelStyle}>{field.label}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {field.adminOnly && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '3px',
                      padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                      background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe',
                      textTransform: 'uppercase',
                    }}>
                      <Lock size={8} /> Admin
                    </span>
                  )}
                  {field.needsVerification && !isEditing && (
                    <span style={{
                      padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                      background: '#fff7ed', color: '#b45309', border: '1px solid #fde68a',
                    }}>Requires verification</span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      autoFocus
                      type={field.type ?? 'text'}
                      value={editValue}
                      onChange={(e) => { setEditValue(e.target.value); setError(null); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(field);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      style={{
                        flex: 1, height: '34px', padding: '0 10px',
                        border: `1.5px solid ${error ? '#fca5a5' : '#3b82f6'}`,
                        borderRadius: '8px', fontSize: '13px', color: '#0f172a',
                        fontFamily: "'DM Sans', sans-serif", outline: 'none',
                        background: '#fff',
                      }}
                    />
                    <button
                      onClick={() => saveEdit(field)} disabled={saving}
                      title="Save"
                      style={{
                        width: '34px', height: '34px', borderRadius: '8px', border: 'none',
                        background: saving ? '#e2e8f0' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                        color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: saving ? 'none' : '0 2px 8px rgba(59,130,246,0.3)',
                      }}
                    >
                      {saving
                        ? <span style={{ width: 10, height: 10, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        : <Check size={13} />}
                    </button>
                    <button onClick={cancelEdit} title="Cancel" style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      border: '1px solid #e2e8f0', background: '#f8fafc',
                      color: '#64748b', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <X size={13} />
                    </button>
                  </div>
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                      <AlertCircle size={11} color="#dc2626" />
                      <p style={{ fontSize: '11px', color: '#dc2626' }}>{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                      {values[field.key] || '—'}
                    </p>
                    {isSaved && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                        <Check size={11} color="#16a34a" /> Saved
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(field)}
                    disabled={locked || !!editingKey}
                    title={locked ? 'Admin only' : `Edit ${field.label}`}
                    style={{
                      width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                      background: locked ? '#f8fafc' : '#f1f5f9',
                      border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: locked || !!editingKey ? 'not-allowed' : 'pointer',
                      color: locked ? '#cbd5e1' : '#64748b',
                      transition: 'all 0.15s',
                      opacity: !!editingKey && !isEditing ? 0.4 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!locked && !editingKey)
                        (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                    }}
                    onMouseLeave={e => {
                      if (!locked)
                        (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
                    }}
                  >
                    {locked ? <Lock size={11} /> : <Pencil size={11} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
