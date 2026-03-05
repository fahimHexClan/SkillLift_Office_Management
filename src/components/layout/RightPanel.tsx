'use client';

import { formatDateTime } from '@/lib/utils';
import { ActivationDetails } from '@/types';

const items = [
  { key: 'joinedAt' as keyof ActivationDetails,     label: 'Joined Date',       letter: 'J', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'activationAt' as keyof ActivationDetails, label: 'Activation Date',   letter: 'A', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { key: 'halfPayAt' as keyof ActivationDetails,    label: 'Half Payment Date', letter: 'H', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { key: 'fullPayAt' as keyof ActivationDetails,    label: 'Full Payment Date', letter: 'F', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
];

interface Props {
  activation: ActivationDetails | null;
  searchHistory: string[];
  onHistoryClick: (val: string) => void;
}

export default function RightPanel({ activation, searchHistory, onHistoryClick }: Props) {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: 'white',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      padding: '20px 14px',
      gap: '24px',
    }}>

      {/* Activation Details */}
      <div>
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
          color: '#94a3b8', textTransform: 'uppercase', marginBottom: '14px',
        }}>Activation Details</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.map((item) => {
            const value = activation?.[item.key] ?? null;
            const hasValue = !!value;
            return (
              <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: hasValue ? item.bg : '#f1f5f9',
                  color: hasValue ? item.color : '#cbd5e1',
                  fontSize: '11px', fontWeight: 700,
                }}>
                  {item.letter}
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', lineHeight: 1.3 }}>{item.label}</p>
                  <p style={{
                    fontSize: '10px', marginTop: '2px', fontFamily: 'monospace',
                    color: hasValue ? '#0f172a' : '#cbd5e1',
                  }}>
                    {formatDateTime(value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
            color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px',
          }}>Search History</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {searchHistory.map((item, idx) => (
              <button key={idx} onClick={() => onHistoryClick(item)} style={{
                textAlign: 'left', padding: '7px 10px',
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                color: '#334155', cursor: 'pointer', fontFamily: 'monospace',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                  (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
                  (e.currentTarget as HTMLElement).style.color = '#1d4ed8';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.color = '#334155';
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}