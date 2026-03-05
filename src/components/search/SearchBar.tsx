'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchType } from '@/types';

interface Props {
  onSearch: (value: string, type: SearchType) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('SR Number');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handle = () => { if (query.trim()) onSearch(query.trim(), searchType); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '760px' }}>

      {/* Input */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handle()}
        placeholder="Enter SR Number or Pay ID..."
        style={{
          flex: 1, height: '40px', padding: '0 14px',
          border: '1.5px solid #e2e8f0', borderRadius: '10px',
          fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
          outline: 'none', color: '#0f172a', background: '#f8fafc',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = '#3b82f6')}
        onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
      />

      {/* Dropdown */}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            height: '40px', padding: '0 14px',
            border: '1.5px solid #e2e8f0', borderRadius: '10px',
            background: 'white', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
            color: '#374151', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '6px', fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {searchType}
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>▼</span>
        </button>
        {open && (
          <div style={{
            position: 'absolute', top: '44px', right: 0,
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            overflow: 'hidden', zIndex: 99, minWidth: '120px',
          }}>
            {(['SR Number', 'Pay ID'] as SearchType[]).map(t => (
              <button key={t} onClick={() => { setSearchType(t); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', padding: '10px 14px',
                  textAlign: 'left', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                  background: searchType === t ? '#eff6ff' : 'white',
                  color: searchType === t ? '#1d4ed8' : '#374151',
                  fontWeight: searchType === t ? 600 : 400,
                  border: 'none', cursor: 'pointer',
                }}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handle}
        disabled={isLoading || !query.trim()}
        style={{
          height: '40px', padding: '0 20px', borderRadius: '10px',
          background: isLoading || !query.trim() ? '#e2e8f0' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: isLoading || !query.trim() ? '#94a3b8' : 'white',
          border: 'none', cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
          fontSize: '13px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: isLoading || !query.trim() ? 'none' : '0 4px 12px rgba(59,130,246,0.35)',
          transition: 'all 0.2s', whiteSpace: 'nowrap',
        }}
      >
        {isLoading ? (
          <span style={{
            width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white', borderRadius: '50%',
            display: 'inline-block', animation: 'spin 0.8s linear infinite',
          }} />
        ) : '🔍'}
        Search
      </button>
    </div>
  );
}