'use client';

import { useState, useEffect } from 'react';
import {
  Users, KeyRound, AlertTriangle, ArrowRightLeft,
  Search, Copy, Check, Trash2, GitMerge, ChevronRight,
  ShieldAlert, RefreshCw,
} from 'lucide-react';
import { useAdminStudents, BATCHES, loadCoursesList } from '@/hooks/useAdminStudents';
import { AdminStudent, TransferRecord } from '@/types';
import { getInitials } from '@/lib/utils';
import { T, inputCss, btnPrimary, spinner } from '@/lib/theme';

// ─── Shared primitives ────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: T.radius,
  border: `1px solid ${T.border}`,
  overflow: 'hidden',
  boxShadow: T.shadowCard,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 700, color: T.textMuted,
      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px',
    }}>{children}</p>
  );
}

function StudentAvatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: T.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: size * 0.33, flexShrink: 0,
      boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
    }}>{getInitials(name)}</div>
  );
}

function IssueBadge({ type }: { type: AdminStudent['issueType'] }) {
  const map = {
    DUPLICATE_EMAIL: { label: 'Duplicate Email', color: '#ca8a04', bg: '#fef9c3', border: '#fde68a' },
    DUPLICATE_NIC:   { label: 'Duplicate NIC',   color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
    DUPLICATE_SR:    { label: 'Duplicate SR',     color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
  };
  if (!type) return null;
  const m = map[type];
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>{m.label}</span>
  );
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: T.input, border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <p style={{ fontWeight: 600, color: T.text, fontSize: '14px' }}>{title}</p>
      <p style={{ fontSize: '12px', color: T.textMuted }}>{sub}</p>
    </div>
  );
}

function SearchRow({
  query, setQuery, onSearch, placeholder, loading,
}: {
  query: string; setQuery: (v: string) => void;
  onSearch: () => void; placeholder: string; loading?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, pointerEvents: 'none' }} />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder={placeholder}
          style={{ ...inputCss, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' }}
          onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
        />
      </div>
      <button
        onClick={onSearch}
        disabled={!query.trim() || loading}
        style={{
          ...btnPrimary,
          height: '40px', padding: '0 20px',
          opacity: !query.trim() ? 0.5 : 1,
          cursor: !query.trim() ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
        }}
      >
        {loading ? <span style={spinner} /> : <Search size={14} />}
        Search
      </button>
    </div>
  );
}

// ─── Tab 1: Password Reset ────────────────────────────────────────────────────

function PasswordResetSection({ resetPassword }: { resetPassword: (id: number) => Promise<string> }) {
  const { search } = useAdminStudents();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminStudent[]>([]);
  const [searched, setSearched] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [tempPasswords, setTempPasswords] = useState<Record<number, string>>({});
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleSearch = () => {
    setResults(search(query));
    setSearched(true);
    setConfirmId(null);
  };

  const handleReset = async (id: number) => {
    setResettingId(id);
    const temp = await resetPassword(id);
    setTempPasswords((prev) => ({ ...prev, [id]: temp }));
    setConfirmId(null);
    setResettingId(null);
  };

  const copyPassword = (id: number) => {
    navigator.clipboard.writeText(tempPasswords[id]);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <SectionLabel>Search Student</SectionLabel>
      <SearchRow
        query={query} setQuery={setQuery} onSearch={handleSearch}
        placeholder="Search by name, email, or SR number..."
      />

      <div style={cardStyle}>
        {!searched
          ? <EmptyState icon={<KeyRound size={20} color={T.textMuted} />} title="Search to get started" sub="Enter a name, email, or SR number above" />
          : results.length === 0
            ? <EmptyState icon={<Search size={20} color={T.textMuted} />} title="No students found" sub="Try a different search term" />
            : results.map((s, i) => (
              <div key={s.id} style={{
                padding: '16px 20px',
                borderBottom: i < results.length - 1 ? `1px solid ${T.border}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: T.text }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: T.blue, fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '12px', color: T.textSec }}>{s.email}</span>
                    </div>
                  </div>

                  {tempPasswords[s.id] ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: T.radiusSm,
                      background: '#dcfce7', border: '1px solid #86efac',
                    }}>
                      <p style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, marginBottom: '1px' }}>Temp Password</p>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: T.text, letterSpacing: '0.05em' }}>
                        {tempPasswords[s.id]}
                      </span>
                      <button onClick={() => copyPassword(s.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: T.textSec,
                        display: 'flex', padding: '2px',
                      }}>
                        {copiedId === s.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ) : confirmId === s.id ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: T.radiusSm,
                      background: '#fef9c3', border: '1px solid #fde68a',
                    }}>
                      <ShieldAlert size={14} color="#ca8a04" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#ca8a04' }}>Reset password?</span>
                      <button onClick={() => handleReset(s.id)} disabled={resettingId === s.id} style={{
                        padding: '4px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                        background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        opacity: resettingId === s.id ? 0.7 : 1,
                      }}>
                        {resettingId === s.id ? <span style={spinner} /> : null}
                        Confirm
                      </button>
                      <button onClick={() => setConfirmId(null)} style={{
                        padding: '4px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 500,
                        background: T.input, border: `1px solid ${T.border}`, color: T.textSec, cursor: 'pointer',
                      }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: T.radiusSm, fontSize: '12px', fontWeight: 600,
                      background: '#fef9c3', color: '#ca8a04',
                      border: '1px solid #fde68a', cursor: 'pointer',
                    }}>
                      <RefreshCw size={12} />
                      Reset Password
                    </button>
                  )}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ─── Tab 2: Registration Issues ───────────────────────────────────────────────

function RegistrationIssuesSection({
  deleteDuplicate, mergeStudent,
}: {
  deleteDuplicate: (pid: number, did: number) => Promise<void>;
  mergeStudent: (pid: number, did: number) => Promise<void>;
}) {
  const { search } = useAdminStudents();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminStudent[]>([]);
  const [searched, setSearched] = useState(false);
  const [actionId, setActionId] = useState<{ primary: number; dup: number; type: 'delete' | 'merge' } | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());

  const handleSearch = () => {
    setResults(search(query));
    setSearched(true);
    setActionId(null);
  };

  const refreshResults = () => setResults(search(query));

  const handleDelete = async (primaryId: number, dupId: number) => {
    setLoadingId(dupId);
    await deleteDuplicate(primaryId, dupId);
    setDoneIds((prev) => new Set([...prev, dupId]));
    setActionId(null);
    setLoadingId(null);
    refreshResults();
  };

  const handleMerge = async (primaryId: number, dupId: number) => {
    setLoadingId(dupId);
    await mergeStudent(primaryId, dupId);
    setDoneIds((prev) => new Set([...prev, dupId]));
    setActionId(null);
    setLoadingId(null);
    refreshResults();
  };

  const studentsWithIssues = results.filter((s) => s.hasRegistrationIssue);
  const studentsClean = results.filter((s) => !s.hasRegistrationIssue);

  return (
    <div>
      <SectionLabel>Search Student</SectionLabel>
      <SearchRow
        query={query} setQuery={setQuery} onSearch={handleSearch}
        placeholder="Search by email, NIC, or SR number..."
      />

      {!searched ? (
        <div style={cardStyle}>
          <EmptyState icon={<AlertTriangle size={20} color={T.textMuted} />} title="Search to view registration status" sub="Enter an email, NIC, or SR number above" />
        </div>
      ) : results.length === 0 ? (
        <div style={cardStyle}>
          <EmptyState icon={<Search size={20} color={T.textMuted} />} title="No students found" sub="Try a different search term" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {studentsWithIssues.map((s) => (
            <div key={s.id} style={{ ...cardStyle, border: '1px solid #fecaca' }}>
              {/* Primary student */}
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, background: '#fef2f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: T.text }}>{s.name}</p>
                      <IssueBadge type={s.issueType} />
                      <span style={{
                        padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                        background: '#fee2e2', color: '#dc2626',
                        border: '1px solid #fecaca', textTransform: 'uppercase',
                      }}>Primary</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: T.blue, fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '12px', color: T.textSec }}>{s.email}</span>
                      <span style={{ fontSize: '12px', color: T.textSec, fontFamily: 'monospace' }}>{s.nic}</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px', borderRadius: T.radiusSm,
                    background: '#fee2e2', border: '1px solid #fecaca',
                  }}>
                    <p style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>
                      {s.duplicates?.length ?? 0} duplicate{(s.duplicates?.length ?? 0) > 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
              </div>

              {s.duplicates?.map((dup) => (
                <div key={dup.id} style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <ChevronRight size={14} color={T.textMuted} style={{ flexShrink: 0 }} />
                    <StudentAvatar name={dup.name} size={30} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontWeight: 500, fontSize: '13px', color: T.textSec }}>{dup.name}</p>
                        <span style={{
                          padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                          background: T.input, color: T.textMuted, border: `1px solid ${T.border}`,
                          textTransform: 'uppercase',
                        }}>Duplicate</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: T.textMuted, fontFamily: 'monospace' }}>{dup.srNumber}</span>
                        <span style={{ fontSize: '11px', color: T.textMuted }}>{dup.email}</span>
                        <span style={{ fontSize: '11px', color: T.textMuted }}>{dup.course} · {dup.batch}</span>
                      </div>
                    </div>

                    {doneIds.has(dup.id) ? (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '5px 12px', borderRadius: T.radiusSm, fontSize: '12px', fontWeight: 600,
                        background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac',
                      }}>
                        <Check size={12} /> Done
                      </span>
                    ) : actionId?.dup === dup.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#ca8a04', fontWeight: 600 }}>
                          {actionId.type === 'delete' ? 'Delete this duplicate?' : 'Merge into primary?'}
                        </span>
                        <button
                          disabled={loadingId === dup.id}
                          onClick={() => actionId.type === 'delete'
                            ? handleDelete(s.id, dup.id)
                            : handleMerge(s.id, dup.id)}
                          style={{
                            padding: '4px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                            background: actionId.type === 'delete' ? '#ef4444' : T.blue,
                            color: 'white', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            opacity: loadingId === dup.id ? 0.7 : 1,
                          }}>
                          {loadingId === dup.id ? <span style={spinner} /> : null}
                          Confirm
                        </button>
                        <button onClick={() => setActionId(null)} style={{
                          padding: '4px 10px', borderRadius: '7px', fontSize: '12px',
                          background: T.input, border: `1px solid ${T.border}`, color: T.textSec, cursor: 'pointer',
                        }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setActionId({ primary: s.id, dup: dup.id, type: 'merge' })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '6px 12px', borderRadius: T.radiusSm, fontSize: '12px', fontWeight: 600,
                            background: '#dbeafe', color: '#2563eb',
                            border: '1px solid #bfdbfe', cursor: 'pointer',
                          }}>
                          <GitMerge size={12} /> Merge
                        </button>
                        <button
                          onClick={() => setActionId({ primary: s.id, dup: dup.id, type: 'delete' })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '6px 12px', borderRadius: T.radiusSm, fontSize: '12px', fontWeight: 600,
                            background: '#fee2e2', color: '#dc2626',
                            border: '1px solid #fecaca', cursor: 'pointer',
                          }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {studentsClean.length > 0 && (
            <div style={cardStyle}>
              {studentsClean.map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 20px',
                  borderBottom: i < studentsClean.length - 1 ? `1px solid ${T.border}` : 'none',
                }}>
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: T.text }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', color: T.blue, fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '11px', color: T.textSec }}>{s.email}</span>
                    </div>
                  </div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                    background: '#dcfce7', color: '#16a34a',
                    border: '1px solid #86efac', textTransform: 'uppercase',
                  }}>
                    <Check size={10} /> No Issues
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Course & Batch Transfer ──────────────────────────────────────────

function CourseTransferSection({
  transferHistory, transferCourse,
}: {
  transferHistory: TransferRecord[];
  transferCourse: (id: number, course: string, batch: string) => Promise<void>;
}) {
  const { search } = useAdminStudents();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminStudent[]>([]);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<AdminStudent | null>(null);
  const [newCourse, setNewCourse] = useState('');
  const [newBatch, setNewBatch] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [courses, setCourses] = useState<string[]>([]);

  useEffect(() => {
    loadCoursesList()
      .then((list) => { if (list.length > 0) setCourses(list); })
      .catch(() => { /* keep empty — dropdowns will be empty if API fails */ });
  }, []);

  const handleSearch = () => {
    const r = search(query);
    setResults(r);
    setSearched(true);
    setSelected(null);
    setSuccessMsg('');
  };

  const handleSelect = (s: AdminStudent) => {
    setSelected(s);
    setNewCourse(s.course);
    setNewBatch(s.batch);
    setSuccessMsg('');
  };

  const handleTransfer = async () => {
    if (!selected || !newCourse || !newBatch) return;
    if (newCourse === selected.course && newBatch === selected.batch) return;
    setTransferring(true);
    await transferCourse(selected.id, newCourse, newBatch);
    const msg = `Transferred to ${newCourse} · ${newBatch}`;
    setSuccessMsg(msg);
    setSelected((prev) => prev ? { ...prev, course: newCourse, batch: newBatch } : null);
    setTransferring(false);
  };

  const unchanged = selected && newCourse === selected.course && newBatch === selected.batch;

  const selectStyle: React.CSSProperties = {
    ...inputCss,
    width: '100%',
    cursor: 'pointer',
    appearance: 'none' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div>
        <SectionLabel>Search Student</SectionLabel>
        <SearchRow
          query={query} setQuery={setQuery} onSearch={handleSearch}
          placeholder="Search by name, email, or SR number..."
        />

        <div style={cardStyle}>
          {!searched
            ? <EmptyState icon={<ArrowRightLeft size={20} color={T.textMuted} />} title="Search a student to transfer" sub="Select a student, then choose new course and batch" />
            : results.length === 0
              ? <EmptyState icon={<Search size={20} color={T.textMuted} />} title="No students found" sub="Try a different search term" />
              : results.map((s, i) => (
                <div key={s.id}
                  onClick={() => handleSelect(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: i < results.length - 1 ? `1px solid ${T.border}` : 'none',
                    background: selected?.id === s.id ? 'rgba(59,130,246,0.08)' : 'transparent',
                    borderLeft: selected?.id === s.id ? `3px solid ${T.blue}` : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: T.text }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: T.blue, fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '11px', color: T.textSec }}>{s.course}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                        background: T.input, color: T.textSec, border: `1px solid ${T.border}`, fontFamily: 'monospace',
                      }}>{s.batch}</span>
                    </div>
                  </div>
                  {selected?.id === s.id && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      background: 'rgba(59,130,246,0.12)', color: 'var(--accent-primary)', border: '1px solid rgba(59,130,246,0.25)',
                      textTransform: 'uppercase',
                    }}>Selected</span>
                  )}
                </div>
              ))
          }
        </div>
      </div>

      {selected && (
        <div>
          <SectionLabel>Transfer Details</SectionLabel>
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{
              display: 'flex', gap: '24px', padding: '14px 16px',
              background: T.input, borderRadius: T.radiusSm, marginBottom: '20px',
              border: `1px solid ${T.border}`, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Course</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{selected.course}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Batch</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>{selected.batch}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  New Course
                </label>
                <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)} style={selectStyle}>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  New Batch
                </label>
                <select value={newBatch} onChange={(e) => setNewBatch(e.target.value)} style={selectStyle}>
                  {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {successMsg && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: T.radiusSm, marginBottom: '12px',
                background: '#dcfce7', border: '1px solid #86efac',
              }}>
                <Check size={14} color="#16a34a" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>{successMsg}</span>
              </div>
            )}

            <button
              onClick={handleTransfer}
              disabled={transferring || !!unchanged}
              style={{
                ...btnPrimary,
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                opacity: transferring || !!unchanged ? 0.5 : 1,
                cursor: transferring || !!unchanged ? 'not-allowed' : 'pointer',
              }}
            >
              {transferring ? <span style={spinner} /> : <ArrowRightLeft size={14} />}
              {transferring ? 'Transferring...' : unchanged ? 'No Changes' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}

      {transferHistory.length > 0 && (
        <div>
          <SectionLabel>Transfer History</SectionLabel>
          <div style={cardStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: T.input, borderBottom: `1px solid ${T.border}` }}>
                  {['Student', 'From', 'To', 'Date', 'By'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontSize: '10px',
                      fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((r, i) => (
                  <tr key={r.id} style={{
                    borderBottom: i < transferHistory.length - 1 ? `1px solid ${T.border}` : 'none',
                  }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>{r.studentName}</p>
                      <p style={{ fontSize: '11px', color: T.blue, fontFamily: 'monospace' }}>{r.srNumber}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '12px', color: T.textSec }}>{r.fromCourse}</p>
                      <p style={{ fontSize: '10px', color: T.textMuted, fontFamily: 'monospace' }}>{r.fromBatch}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '12px', color: T.textSec }}>{r.toCourse}</p>
                      <p style={{ fontSize: '10px', color: T.textMuted, fontFamily: 'monospace' }}>{r.toBatch}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', color: T.textSec, fontFamily: 'monospace' }}>{r.transferredAt}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: T.text }}>{r.transferredBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabKey = 'password' | 'issues' | 'transfer';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'password', label: 'Password Reset',      icon: <KeyRound size={14} /> },
  { key: 'issues',   label: 'Registration Issues', icon: <AlertTriangle size={14} /> },
  { key: 'transfer', label: 'Course Transfer',      icon: <ArrowRightLeft size={14} /> },
];

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('password');
  const { transferHistory, resetPassword, deleteDuplicate, mergeStudent, transferCourse } = useAdminStudents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Page header */}
      <div style={{
        background: T.card, borderBottom: `1px solid ${T.border}`,
        padding: '14px 24px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.2)', flexShrink: 0,
          }}>
            <Users size={17} color="white" />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '15px', color: T.text }}>Student Management</h1>
            <p style={{ fontSize: '12px', color: T.textMuted, marginTop: '1px' }}>Admin Panel · Password Reset, Registration Issues, Course Transfers</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#ffffff', borderBottom: `1px solid ${T.border}`, padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex' }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '13px 18px', fontSize: '13px', fontWeight: active ? 600 : 400,
                color: active ? T.blue : T.textSec,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: active ? `2px solid ${T.blue}` : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
              }}>
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: T.bg }}>
        <div style={{ maxWidth: '860px' }}>
          {activeTab === 'password' && (
            <PasswordResetSection resetPassword={resetPassword} />
          )}
          {activeTab === 'issues' && (
            <RegistrationIssuesSection deleteDuplicate={deleteDuplicate} mergeStudent={mergeStudent} />
          )}
          {activeTab === 'transfer' && (
            <CourseTransferSection transferHistory={transferHistory} transferCourse={transferCourse} />
          )}
        </div>
      </div>
    </div>
  );
}
