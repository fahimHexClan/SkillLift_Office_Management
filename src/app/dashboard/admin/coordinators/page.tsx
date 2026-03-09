import { UserCheck } from 'lucide-react';
import { T } from '@/lib/theme';

export default function CoordinatorsPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: '16px',
      background: T.bg,
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: '#f3e8ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <UserCheck size={32} color="#9333ea" />
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: T.text }}>Coordinator Management</h2>
      <p style={{ fontSize: '13px', color: T.textMuted }}>Coming soon — manage coordinators and their permissions</p>
    </div>
  );
}
