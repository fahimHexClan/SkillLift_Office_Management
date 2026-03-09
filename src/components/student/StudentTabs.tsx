'use client';

import { useState } from 'react';
import { StudentProfile } from '@/types';
import { T } from '@/lib/theme';
import BasicInfoTab from '../tabs/BasicInfoTab';
import AccountsTab  from '../tabs/AccountsTab';
import OrdersTab    from '../tabs/OrdersTab';

interface Props { profile: StudentProfile; }

const TABS = [
  { label: 'Basic Information', count: null },
  { label: 'Accounts',          count: (p: StudentProfile) => p.accounts.length },
  { label: 'Orders',            count: (p: StudentProfile) => p.orders.length },
];

export default function StudentTabs({ profile }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div style={{
      background: T.card,
      borderRadius: '14px',
      border: `1px solid ${T.border}`,
      boxShadow: T.shadowCard,
      overflow: 'hidden',
    }}>

      {/* Tab header bar */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${T.border}`,
        background: T.input,
        padding: '0 8px',
      }}>
        {TABS.map((tab, idx) => {
          const isActive = active === idx;
          const count = tab.count ? tab.count(profile) : null;
          return (
            <button
              key={tab.label}
              onClick={() => setActive(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 16px',
                fontSize: '13px', fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent-primary)' : T.textSec,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.15s ease',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = T.text;
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = T.textSec;
              }}
            >
              {tab.label}
              {count !== null && (
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  padding: '1px 6px', borderRadius: '99px',
                  background: isActive ? 'rgba(59,130,246,0.15)' : T.card,
                  color: isActive ? 'var(--accent-primary)' : T.textMuted,
                  border: `1px solid ${isActive ? 'rgba(59,130,246,0.25)' : T.border}`,
                  transition: 'all 0.15s',
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="fade-up">
        {active === 0 && <BasicInfoTab student={profile.student} payId={profile.student.payId} />}
        {active === 1 && <AccountsTab  accounts={profile.accounts} />}
        {active === 2 && <OrdersTab    orders={profile.orders} />}
      </div>
    </div>
  );
}
