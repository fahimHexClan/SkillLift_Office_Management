import { BarChart2 } from 'lucide-react';
import { T } from '@/lib/theme';

export default function ReportsPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: '16px',
      background: T.bg,
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: '#dcfce7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BarChart2 size={32} color="#16a34a" />
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: T.text }}>Reports</h2>
      <p style={{ fontSize: '13px', color: T.textMuted }}>Coming soon — analytics and reporting dashboard</p>
    </div>
  );
}
