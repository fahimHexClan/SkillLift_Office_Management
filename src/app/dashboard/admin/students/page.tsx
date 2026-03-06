'use client';

import { useState } from 'react';
import {
  Users, KeyRound, AlertTriangle, ArrowRightLeft,
  Search, Copy, Check, Trash2, GitMerge, ChevronRight,
  ShieldAlert, RefreshCw,
} from 'lucide-react';
import { useAdminStudents, COURSES, BATCHES } from '@/hooks/useAdminStudents';
import { AdminStudent, TransferRecord } from '@/types';
import { getInitials } from '@/lib/utils';

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  flex: 1, height: '40px', padding: '0 14px',
  border: '1.5px solid #e2e8f0', borderRadius: '10px',
  fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
  outline: 'none', color: '#0f172a', background: '#f8fafc',
  transition: 'border-color 0.2s',
};

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '14px',
  border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  overflow: 'hidden',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 700, color: '#94a3b8',
      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
    }}>{children}</p>
  );
}

function StudentAvatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: 'linear-gradient(135deg, #475569, #1e293b)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: size * 0.33, flexShrink: 0,
    }}>{getInitials(name)}</div>
  );
}

function IssueBadge({ type }: { type: AdminStudent['issueType'] }) {
  const map = {
    DUPLICATE_EMAIL: { label: 'Duplicate Email', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    DUPLICATE_NIC:   { label: 'Duplicate NIC',   color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
    DUPLICATE_SR:    { label: 'Duplicate SR',     color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
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
        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <p style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>{title}</p>
      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{sub}</p>
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
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        value={query} onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder} style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
      />
      <button
        onClick={onSearch}
        disabled={!query.trim() || loading}
        style={{
          height: '40px', padding: '0 20px', borderRadius: '10px', fontSize: '13px',
          fontWeight: 600, fontFamily: "'DM Sans', sans-serif", border: 'none',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          background: !query.trim() ? '#e2e8f0' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: !query.trim() ? '#94a3b8' : 'white',
          boxShadow: !query.trim() ? 'none' : '0 4px 12px rgba(59,130,246,0.3)',
        }}
      >
        {loading
          ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          : <Search size={14} />}
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
          ? <EmptyState icon={<KeyRound size={20} color="#94a3b8" />} title="Search to get started" sub="Enter a name, email, or SR number above" />
          : results.length === 0
            ? <EmptyState icon={<Search size={20} color="#94a3b8" />} title="No students found" sub="Try a different search term" />
            : results.map((s, i) => (
              <div key={s.id} style={{
                padding: '16px 20px',
                borderBottom: i < results.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                {/* Student row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{s.email}</span>
                    </div>
                  </div>

                  {/* Temp password display */}
                  {tempPasswords[s.id] ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '10px',
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                    }}>
                      <p style={{ fontSize: '11px', color: '#15803d', fontWeight: 600, marginBottom: '1px' }}>Temporary Password</p>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.05em' }}>
                        {tempPasswords[s.id]}
                      </span>
                      <button onClick={() => copyPassword(s.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                        display: 'flex', padding: '2px',
                      }}>
                        {copiedId === s.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ) : confirmId === s.id ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '10px',
                      background: '#fffbeb', border: '1px solid #fde68a',
                    }}>
                      <ShieldAlert size={14} color="#b45309" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>Reset password?</span>
                      <button onClick={() => handleReset(s.id)} disabled={resettingId === s.id} style={{
                        padding: '4px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                        background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        opacity: resettingId === s.id ? 0.7 : 1,
                      }}>
                        {resettingId === s.id
                          ? <span style={{ width: 10, height: 10, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          : null}
                        Confirm
                      </button>
                      <button onClick={() => setConfirmId(null)} style={{
                        padding: '4px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 500,
                        background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
                      }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '9px', fontSize: '12px', fontWeight: 600,
                      background: '#fff7ed', color: '#b45309', border: '1px solid #fde68a',
                      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
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

  const refreshResults = () => {
    setResults(search(query));
  };

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

      {!searched
        ? (
          <div style={cardStyle}>
            <EmptyState icon={<AlertTriangle size={20} color="#94a3b8" />} title="Search to view registration status" sub="Enter an email, NIC, or SR number above" />
          </div>
        ) : results.length === 0 ? (
          <div style={cardStyle}>
            <EmptyState icon={<Search size={20} color="#94a3b8" />} title="No students found" sub="Try a different search term" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Students with issues */}
            {studentsWithIssues.map((s) => (
              <div key={s.id} style={{ ...cardStyle, border: '1px solid #fecaca' }}>
                {/* Primary student */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #fef2f2', background: '#fff5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StudentAvatar name={s.name} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{s.name}</p>
                        <IssueBadge type={s.issueType} />
                        <span style={{
                          padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                          background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca',
                          textTransform: 'uppercase',
                        }}>Primary</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{s.srNumber}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{s.email}</span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{s.nic}</span>
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 12px', borderRadius: '8px',
                      background: '#fef2f2', border: '1px solid #fecaca',
                    }}>
                      <p style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 700 }}>
                        {s.duplicates?.length ?? 0} duplicate{(s.duplicates?.length ?? 0) > 1 ? 's' : ''} found
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duplicates */}
                {s.duplicates?.map((dup) => (
                  <div key={dup.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ChevronRight size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <StudentAvatar name={dup.name} size={30} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <p style={{ fontWeight: 500, fontSize: '13px', color: '#374151' }}>{dup.name}</p>
                          <span style={{
                            padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                            background: '#fafafa', color: '#94a3b8', border: '1px solid #e2e8f0',
                            textTransform: 'uppercase',
                          }}>Duplicate</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{dup.srNumber}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{dup.email}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{dup.course} · {dup.batch}</span>
                        </div>
                      </div>

                      {/* Action area */}
                      {doneIds.has(dup.id) ? (
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                          background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
                        }}>
                          <Check size={12} /> Done
                        </span>
                      ) : actionId?.dup === dup.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                            {actionId.type === 'delete' ? 'Delete this duplicate?' : 'Merge into primary?'}
                          </span>
                          <button
                            disabled={loadingId === dup.id}
                            onClick={() => actionId.type === 'delete'
                              ? handleDelete(s.id, dup.id)
                              : handleMerge(s.id, dup.id)}
                            style={{
                              padding: '4px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                              background: actionId.type === 'delete' ? '#dc2626' : '#1d4ed8',
                              color: 'white', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '4px',
                              opacity: loadingId === dup.id ? 0.7 : 1,
                            }}>
                            {loadingId === dup.id
                              ? <span style={{ width: 10, height: 10, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                              : null}
                            Confirm
                          </button>
                          <button onClick={() => setActionId(null)} style={{
                            padding: '4px 10px', borderRadius: '7px', fontSize: '12px',
                            background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
                          }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setActionId({ primary: s.id, dup: dup.id, type: 'merge' })}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                              background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer',
                            }}>
                            <GitMerge size={12} /> Merge
                          </button>
                          <button
                            onClick={() => setActionId({ primary: s.id, dup: dup.id, type: 'delete' })}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                              background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer',
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

            {/* Clean students */}
            {studentsClean.length > 0 && (
              <div style={cardStyle}>
                {studentsClean.map((s, i) => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px',
                    borderBottom: i < studentsClean.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}>
                    <StudentAvatar name={s.name} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{s.name}</p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{s.srNumber}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{s.email}</span>
                      </div>
                    </div>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
                      textTransform: 'uppercase',
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
    width: '100%', height: '40px', padding: '0 12px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', color: '#0f172a', background: '#f8fafc', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Search */}
      <div>
        <SectionLabel>Search Student</SectionLabel>
        <SearchRow
          query={query} setQuery={setQuery} onSearch={handleSearch}
          placeholder="Search by name, email, or SR number..."
        />

        <div style={cardStyle}>
          {!searched
            ? <EmptyState icon={<ArrowRightLeft size={20} color="#94a3b8" />} title="Search a student to transfer" sub="Select a student, then choose new course and batch" />
            : results.length === 0
              ? <EmptyState icon={<Search size={20} color="#94a3b8" />} title="No students found" sub="Try a different search term" />
              : results.map((s, i) => (
                <div key={s.id}
                  onClick={() => handleSelect(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: i < results.length - 1 ? '1px solid #f8fafc' : 'none',
                    background: selected?.id === s.id ? '#eff6ff' : 'white',
                    borderLeft: selected?.id === s.id ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLElement).style.background = '#fafbfc'; }}
                  onMouseLeave={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLElement).style.background = 'white'; }}
                >
                  <StudentAvatar name={s.name} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{s.srNumber}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{s.course}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                        background: '#f1f5f9', color: '#475569', fontFamily: 'monospace',
                      }}>{s.batch}</span>
                    </div>
                  </div>
                  {selected?.id === s.id && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe',
                      textTransform: 'uppercase',
                    }}>Selected</span>
                  )}
                </div>
              ))
          }
        </div>
      </div>

      {/* Transfer form */}
      {selected && (
        <div className="fade-up">
          <SectionLabel>Transfer Details</SectionLabel>
          <div style={{ ...cardStyle, padding: '20px' }}>

            {/* Current info */}
            <div style={{
              display: 'flex', gap: '20px', padding: '14px 16px',
              background: '#f8fafc', borderRadius: '10px', marginBottom: '20px',
              border: '1px solid #f1f5f9', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Course</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selected.course}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Batch</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{selected.batch}</p>
              </div>
            </div>

            {/* Dropdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  New Course
                </label>
                <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)} style={selectStyle}>
                  {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  New Batch
                </label>
                <select value={newBatch} onChange={(e) => setNewBatch(e.target.value)} style={selectStyle}>
                  {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Success message */}
            {successMsg && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: '10px', marginBottom: '12px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
              }}>
                <Check size={14} color="#16a34a" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>{successMsg}</span>
              </div>
            )}

            <button
              onClick={handleTransfer}
              disabled={transferring || !!unchanged}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", border: 'none', cursor: transferring || !!unchanged ? 'not-allowed' : 'pointer',
                background: transferring || !!unchanged ? '#e2e8f0' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: transferring || !!unchanged ? '#94a3b8' : 'white',
                boxShadow: transferring || !!unchanged ? 'none' : '0 4px 12px rgba(59,130,246,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {transferring
                ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                : <ArrowRightLeft size={14} />}
              {transferring ? 'Transferring...' : unchanged ? 'No Changes' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}

      {/* Transfer history */}
      {transferHistory.length > 0 && (
        <div>
          <SectionLabel>Transfer History</SectionLabel>
          <div style={cardStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Student', 'From', 'To', 'Date', 'By'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontSize: '10px',
                      fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < transferHistory.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{r.studentName}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{r.srNumber}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '12px', color: '#374151' }}>{r.fromCourse}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>{r.fromBatch}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '12px', color: '#374151' }}>{r.toCourse}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>{r.toBatch}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{r.transferredAt}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{r.transferredBy}</span>
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

const TABS: { key: TabKey; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'password', label: 'Password Reset',      icon: <KeyRound size={15} />,        desc: 'Reset student & coordinator passwords' },
  { key: 'issues',   label: 'Registration Issues', icon: <AlertTriangle size={15} />,   desc: 'Fix duplicate registrations' },
  { key: 'transfer', label: 'Course Transfer',      icon: <ArrowRightLeft size={15} />,  desc: 'Move students between courses & batches' },
];

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('password');
  const { transferHistory, resetPassword, deleteDuplicate, mergeStudent, transferCourse } = useAdminStudents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Page header */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '14px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}>
            <Users size={17} color="white" />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Student Management</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>Admin Panel · Password Reset, Registration Issues, Course Transfers</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '13px 18px', fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#1d4ed8' : '#64748b',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
              marginBottom: '-1px', transition: 'all 0.15s',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f1f5f9' }}>
        <div className="fade-up" style={{ maxWidth: '860px' }}>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
