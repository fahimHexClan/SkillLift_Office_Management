import { CalendarDays } from 'lucide-react';
import { T } from '@/lib/theme';

export default function HallBookingsPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: '16px',
      background: T.bg,
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: 'rgba(59,130,246,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CalendarDays size={32} color="var(--accent-primary)" />
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: T.text }}>Hall Bookings</h2>
      <p style={{ fontSize: '13px', color: T.textMuted }}>Coming soon — room scheduling and booking management</p>
    </div>
  );
}
