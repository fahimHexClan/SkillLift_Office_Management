import { StudentProfile } from '@/types';
import { Copy, CheckCircle2 } from 'lucide-react';

interface Props { profile: StudentProfile; }

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'white', fontWeight: 700,
      fontSize: '15px', flexShrink: 0,
    }}>{initials}</div>
  );
}

export default function ProfileHeader({ profile }: Props) {
  const { student, counselor } = profile;

  return (
    <div style={{
      background: 'white', borderRadius: '14px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '16px 20px',
      display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0',
    }}>

      {/* Student */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '20px' }}>
        <Avatar name={student.name} color="linear-gradient(135deg, #475569, #1e293b)" />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {student.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{student.srNumber}</span>
            <span style={{
              padding: '1px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700,
              background: student.paymentStatus === 'half' ? '#fff7ed' : '#f0fdf4',
              color: student.paymentStatus === 'half' ? '#c2410c' : '#15803d',
              border: `1px solid ${student.paymentStatus === 'half' ? '#fed7aa' : '#bbf7d0'}`,
              textTransform: 'uppercase' as const,
            }}>{student.paymentStatus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{student.marketplace}</span>
            <button
              onClick={() => navigator.clipboard.writeText(student.srNumber)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#94a3b8', display: 'flex' }}
              title="Copy SR Number"
            >
              <Copy size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ background: '#f1f5f9', margin: '0 0' }} />

      {/* Counselor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px' }}>
        <Avatar name={counselor.name} color="linear-gradient(135deg, #1d4ed8, #3b82f6)" />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {counselor.name}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{counselor.ccId}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            {counselor.isActive && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '1px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700,
                background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
              }}>
                <CheckCircle2 size={9} /> Active
              </span>
            )}
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{counselor.agentNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}