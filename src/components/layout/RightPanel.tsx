'use client';

import { formatDateTime } from '@/lib/utils';
import { ActivationDetails } from '@/types';
import { T } from '@/lib/theme';
import { Clock, History, Trash2 } from 'lucide-react';

const TIMELINE_ITEMS = [
  { key: 'joinedAt'     as keyof ActivationDetails, label: 'Joined',       letter: 'J', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { key: 'activationAt' as keyof ActivationDetails, label: 'Activated',    letter: 'A', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  },
  { key: 'halfPayAt'    as keyof ActivationDetails, label: 'Half Payment', letter: 'H', color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
  { key: 'fullPayAt'    as keyof ActivationDetails, label: 'Full Payment', letter: 'F', color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
];

interface Props {
  activation:    ActivationDetails | null;
  searchHistory: string[];
  onHistoryClick: (val: string) => void;
  onClearHistory?: () => void;
}

export default function RightPanel({ activation, searchHistory, onHistoryClick, onClearHistory }: Props) {
  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      background: T.card,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      overflowY: 'auto',
    }}>

      {/* ── Activation Details ── */}
      <div style={{ padding: '20px 16px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
          <Clock size={13} color="var(--accent-primary)" />
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
            color: T.textMuted, textTransform: 'uppercase',
          }}>Activation Details</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: '13px', top: '28px',
            width: '1px',
            height: `calc(100% - 28px)`,
            background: `linear-gradient(to bottom, var(--border), transparent)`,
          }} />

          {TIMELINE_ITEMS.map((item) => {
            const raw      = activation?.[item.key] ?? null;
            const value    = raw && !String(raw).startsWith('0000') ? raw : null;
            const hasValue = !!value;
            return (
              <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative' }}>
                {/* Circle avatar */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: hasValue ? item.bg : 'var(--bg-input)',
                  border: `1px solid ${hasValue ? item.color + '40' : 'var(--border)'}`,
                  fontSize: '11px', fontWeight: 800,
                  color: hasValue ? item.color : T.textMuted,
                  transition: 'all 0.2s',
                  zIndex: 1,
                }}>
                  {item.letter}
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: hasValue ? T.text : T.textMuted, marginBottom: '2px', lineHeight: 1.2 }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: '10px', fontFamily: 'monospace',
                    color: hasValue ? T.textSec : T.textMuted,
                    lineHeight: 1.4,
                  }}>
                    {hasValue ? formatDateTime(value) : '——'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Search History ── */}
      <div style={{ padding: '16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <History size={13} color="var(--accent-primary)" />
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              color: T.textMuted, textTransform: 'uppercase',
            }}>Search History</p>
          </div>
          {searchHistory.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              title="Clear history"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: T.textMuted, display: 'flex', alignItems: 'center',
                padding: '2px', borderRadius: '4px', transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--accent-red)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = T.textMuted}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {searchHistory.length === 0 ? (
          <p style={{ fontSize: '12px', color: T.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
            No recent searches
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {searchHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onHistoryClick(item)}
                style={{
                  textAlign: 'left', padding: '7px 10px',
                  background: T.input, border: `1px solid ${T.border}`,
                  borderRadius: '8px', fontSize: '11px', fontWeight: 500,
                  color: T.textSec, cursor: 'pointer', fontFamily: 'monospace',
                  transition: 'all 0.15s', width: '100%',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(59,130,246,0.08)';
                  el.style.borderColor = 'rgba(59,130,246,0.2)';
                  el.style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = T.input;
                  el.style.borderColor = T.border;
                  el.style.color = T.textSec;
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
