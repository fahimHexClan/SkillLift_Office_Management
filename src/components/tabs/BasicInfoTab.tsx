import { Student } from '@/types';

interface Props { student: Student; payId: string; }

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{value || '—'}</p>
    </div>
  );
}

export default function BasicInfoTab({ student, payId }: Props) {
  return (
    <div style={{ padding: '20px' }}>

      {/* SR + Pay ID */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', background: '#f8fafc',
        borderRadius: '10px', marginBottom: '20px',
        border: '1px solid #f1f5f9',
      }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          Student Registration Number
        </p>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
          {student.srNumber}
        </span>
        {payId && (
          <span style={{
            padding: '2px 8px', borderRadius: '6px', fontSize: '11px',
            fontWeight: 700, background: '#dbeafe', color: '#1d4ed8',
            border: '1px solid #bfdbfe', fontFamily: 'monospace',
          }}>{payId}</span>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
        <Field label="Student Name"   value={student.name} />
        <Field label="Marketplace"    value={student.marketplace} />
        <Field label="Medium"         value={student.medium} />
        <Field label="Contact Number" value={student.contact} />
        <Field label="NIC"            value={student.nic} />
        <Field label="Email Address"  value={student.email} />
        <Field label="Group"          value={student.group} />
        <Field label="Date of Birth"  value={student.dob} />
        <Field label="Gender"         value={student.gender} />
      </div>
    </div>
  );
}