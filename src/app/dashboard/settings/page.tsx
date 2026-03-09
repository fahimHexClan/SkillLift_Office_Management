import { Settings } from 'lucide-react';
import { T } from '@/lib/theme';

export default function SettingsPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: '16px',
      background: T.bg,
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: '#f8fafc', border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Settings size={32} color={T.textSec} />
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: T.text }}>Settings</h2>
      <p style={{ fontSize: '13px', color: T.textMuted }}>Coming soon — system configuration and preferences</p>
    </div>
  );
}
