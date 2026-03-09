import { Account } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { T } from '@/lib/theme';

interface Props { accounts: Account[]; }

export default function AccountsTab({ accounts }: Props) {
  if (!accounts.length) return (
    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textMuted, fontSize: '13px' }}>
      No accounts found
    </div>
  );

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {accounts.map((acc, idx) => (
        <div
          key={acc.id}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            background: T.card,
            border: `1px solid ${acc.isActive ? 'rgba(16,185,129,0.2)' : T.border}`,
            borderRadius: '12px',
            padding: '14px 18px',
            minWidth: '200px',
            boxShadow: T.shadowCard,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = T.shadow;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = T.shadowCard;
          }}
        >
          {/* Index circle */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: acc.isActive
              ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '14px',
            boxShadow: acc.isActive
              ? '0 4px 12px rgba(16,185,129,0.3)'
              : '0 4px 12px rgba(99,102,241,0.3)',
          }}>
            {idx + 1}
          </div>

          {/* Account info */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, color: T.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px',
            }}>Account ID</p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>
              {acc.accountId}
            </p>
          </div>

          {/* Status icon */}
          {acc.isActive
            ? <CheckCircle2 size={20} color="var(--accent-green)" style={{ flexShrink: 0 }} />
            : <XCircle     size={20} color="var(--accent-red)"   style={{ flexShrink: 0 }} />
          }
        </div>
      ))}
    </div>
  );
}
