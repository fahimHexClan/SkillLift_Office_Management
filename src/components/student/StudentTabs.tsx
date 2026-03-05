'use client';

import { useState } from 'react';
import { StudentProfile } from '@/types';
import BasicInfoTab from '../tabs/BasicInfoTab';
import AccountsTab from '../tabs/AccountsTab';
import OrdersTab from '../tabs/OrdersTab';

interface Props { profile: StudentProfile; }

const tabs = ['Basic Information', 'Accounts', 'Orders'];

export default function StudentTabs({ profile }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div style={{
      background: 'white', borderRadius: '14px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>

      {/* Tab Headers */}
      <div style={{
        display: 'flex', borderBottom: '1px solid #f1f5f9',
        padding: '0 4px', background: '#fafafa',
      }}>
        {tabs.map((tab, idx) => (
          <button key={tab} onClick={() => setActive(idx)} style={{
            padding: '12px 18px', fontSize: '13px', fontWeight: active === idx ? 600 : 400,
            color: active === idx ? '#1d4ed8' : '#64748b',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: active === idx ? '2px solid #3b82f6' : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.15s',
            fontFamily: 'DM Sans, sans-serif',
          }}>{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div className="fade-up">
        {active === 0 && <BasicInfoTab student={profile.student} payId={profile.student.payId} />}
        {active === 1 && <AccountsTab accounts={profile.accounts} />}
        {active === 2 && <OrdersTab orders={profile.orders} />}
      </div>
    </div>
  );
}