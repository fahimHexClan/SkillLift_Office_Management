'use client';

import { useState, useRef } from 'react';
import { Search, AlertCircle, UserSearch, ChevronDown } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { SearchType } from '@/types';
import { T, inputCss } from '@/lib/theme';
import ProfileHeader  from '@/components/student/ProfileHeader';
import StudentTabs    from '@/components/student/StudentTabs';
import ProfileSkeleton from '@/components/student/ProfileSkeleton';
import RightPanel     from '@/components/layout/RightPanel';

const SEARCH_TYPES: SearchType[] = ['SR Number', 'Pay ID', 'Mobile Number', 'Email', 'NIC'];

const PLACEHOLDER: Record<SearchType, string> = {
  'SR Number':     'e.g. SR526701',
  'Pay ID':        'e.g. 201824',
  'Mobile Number': 'e.g. 0712345678',
  'Email':         'e.g. student@example.com',
  'NIC':           'e.g. 921622503V',
};

export default function StudentSearchPage() {
  const [query,      setQuery]      = useState('');
  const [searchType, setSearchType] = useState<SearchType>('SR Number');
  const inputRef = useRef<HTMLInputElement>(null);

  const { profile, isLoading, error, searchHistory, search, clearHistory } = useStudentSearch();

  const handleInputChange = (raw: string) => {
    if (searchType === 'SR Number') {
      // Auto-prefix with SR; allow user to type digits (or full SR...)
      const digits = raw.replace(/^SR/i, '').replace(/\D/g, '');
      setQuery(digits ? `SR${digits}` : '');
    } else if (searchType === 'Mobile Number') {
      // Auto-prefix with 0; allow user to type digits
      const digits = raw.replace(/^0/, '').replace(/\D/g, '');
      setQuery(digits ? `0${digits}` : '');
    } else {
      setQuery(raw);
    }
  };

  const handleSearch = () => {
    const q = query.trim();
    if (!q || isLoading) return;
    search(q, searchType);
  };

  // History click: parse the label format "[TypeNoSpaces] value" and extract value
  const handleHistoryClick = (label: string) => {
    const match = label.match(/^\[(\w+)\]\s(.+)$/);
    if (match) {
      const typeKey = match[1];
      const value   = match[2];
      // Find the matching SearchType
      const found = SEARCH_TYPES.find((t) => t.replace(/\s/g, '') === typeKey);
      if (found) setSearchType(found);
      setQuery(value);
      search(value, found ?? searchType);
    } else {
      setQuery(label);
      search(label, searchType);
    }
    inputRef.current?.focus();
  };

  const hasResult = !isLoading && !!profile;
  const isEmpty   = !isLoading && !profile && !error;

  return (
    <div className="search-page-layout">

      {/* ══ Main content ══════════════════════════════════════════════════════ */}
      <div className="page-padding search-main-content" style={{
        flex: 1, overflowY: 'auto', minWidth: 0,
        display: 'flex', flexDirection: 'column', gap: '20px',
        padding: '24px',
      }}>

        {/* ── Search bar card ── */}
        <div style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: '16px',
          boxShadow: T.shadowCard,
          padding: '16px 20px',
        }}>
          <div className="search-bar-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

            {/* Search type dropdown */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select
                value={searchType}
                onChange={(e) => { setSearchType(e.target.value as SearchType); setQuery(''); }}
                style={{
                  ...inputCss,
                  width: 'auto', minWidth: '140px',
                  padding: '10px 32px 10px 12px',
                  fontWeight: 500, fontSize: '13px',
                  appearance: 'none', WebkitAppearance: 'none',
                  cursor: 'pointer',
                  height: '42px',
                }}
              >
                {SEARCH_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown
                size={13}
                color={T.textMuted}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>

            {/* Text input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={15}
                color={T.textMuted}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={PLACEHOLDER[searchType]}
                style={{
                  ...inputCss,
                  paddingLeft: '38px',
                  height: '42px', fontSize: '14px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = 'var(--accent-focus-ring)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = T.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 22px', height: '42px', flexShrink: 0,
                background: isLoading || !query.trim()
                  ? T.input
                  : 'var(--gradient-main)',
                border: `1px solid ${isLoading || !query.trim() ? T.border : 'transparent'}`,
                borderRadius: '9px',
                fontSize: '13px', fontWeight: 700,
                color: isLoading || !query.trim() ? T.textMuted : 'white',
                cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Inter', sans-serif",
                boxShadow: isLoading || !query.trim() ? 'none' : 'var(--accent-glow)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && query.trim()) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-1px)';
                  el.style.boxShadow = 'var(--accent-glow-hover)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                if (!isLoading && query.trim()) el.style.boxShadow = 'var(--accent-glow)';
              }}
            >
              {isLoading ? (
                <span style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <Search size={14} />
              )}
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Quick filter pills */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {SEARCH_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => { setSearchType(t); setQuery(''); }}
                style={{
                  padding: '4px 10px', borderRadius: '99px',
                  fontSize: '11px', fontWeight: 500,
                  border: `1px solid ${searchType === t ? 'var(--accent-soft-active)' : T.border}`,
                  background: searchType === t ? 'var(--accent-soft)' : T.input,
                  color: searchType === t ? 'var(--accent-primary)' : T.textSec,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error state ── */}
        {error && !isLoading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 18px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
          }}>
            <AlertCircle size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--accent-red)', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && <ProfileSkeleton />}

        {/* ── Profile + Tabs ── */}
        {hasResult && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ProfileHeader profile={profile!} />
            <StudentTabs   profile={profile!} />
          </div>
        )}

        {/* ── Empty / welcome state ── */}
        {isEmpty && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', padding: '80px 0', textAlign: 'center',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '22px',
              background: 'linear-gradient(135deg, var(--accent-soft) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid var(--accent-soft-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px var(--accent-soft)',
            }}>
              <UserSearch size={36} color="var(--accent-primary)" style={{ opacity: 0.7 }} />
            </div>
            <div>
              <p style={{ fontSize: '17px', fontWeight: 700, color: T.text, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                Search for a student
              </p>
              <p style={{ fontSize: '13px', color: T.textSec, lineHeight: 1.6, maxWidth: '380px' }}>
                Find any student by their SR number, Pay ID, mobile number,
                email address, or NIC. Results include full profile, accounts, and orders.
              </p>
            </div>

            {/* Quick hint chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              {[
                { label: 'Try SR526701', type: 'SR Number' as SearchType, value: 'SR526701' },
                { label: 'Try Pay ID 201824', type: 'Pay ID' as SearchType, value: '201824' },
              ].map((hint) => (
                <button
                  key={hint.label}
                  onClick={() => {
                    setQuery(hint.value);
                    setSearchType(hint.type);
                    search(hint.value, hint.type);
                  }}
                  style={{
                    padding: '7px 14px', borderRadius: '99px',
                    fontSize: '12px', fontWeight: 600,
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-soft-border)',
                    color: 'var(--accent-primary)', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft)';
                  }}
                >
                  {hint.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ Right Panel — sidebar on desktop, stacked below on mobile ══════ */}
      <RightPanel
        activation={profile?.activation ?? null}
        searchHistory={searchHistory}
        onHistoryClick={handleHistoryClick}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
