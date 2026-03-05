import { Account } from '@/types';

interface Props { accounts: Account[]; }

export default function AccountsTab({ accounts }: Props) {
  if (!accounts.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No accounts found</div>
  );

  return (
    <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap' as const, gap: '12px' }}>
      {accounts.map((acc, idx) => (
        <div key={acc.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: '12px',
          background: acc.isActive ? '#f0f9ff' : '#f8fafc',
          border: `1px solid ${acc.isActive ? '#bae6fd' : '#e2e8f0'}`,
          minWidth: '160px',
        }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '8px',
            background: acc.isActive ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#cbd5e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '11px', flexShrink: 0,
          }}>{idx + 1}</div>
          <div>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Account ID</p>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{acc.accountId}</p>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: '16px',
          }}>{acc.isActive ? '✅' : '❌'}</span>
        </div>
      ))}
    </div>
  );
}