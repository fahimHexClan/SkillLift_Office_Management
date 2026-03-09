import { Student } from '@/types';
import { T, labelCss } from '@/lib/theme';

interface Props { student: Student; payId: string; }

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p style={{ ...labelCss, marginBottom: '4px' }}>{label}</p>
      <p style={{
        fontSize: '13px', fontWeight: 500, color: T.text, lineHeight: 1.4,
        fontFamily: mono ? 'monospace' : undefined,
      }}>
        {value || '—'}
      </p>
    </div>
  );
}

export default function BasicInfoTab({ student, payId }: Props) {
  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* SR Number + Pay ID highlight row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: '12px',
      }}>
        <div>
          <p style={{ ...labelCss, marginBottom: '3px' }}>SR Number</p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>
            {student.srNumber}
          </p>
        </div>

        <div style={{ width: '1px', height: '36px', background: T.border, margin: '0 4px' }} />

        <div>
          <p style={{ ...labelCss, marginBottom: '3px' }}>Pay ID</p>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 700,
            color: 'var(--accent-primary)',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.2)',
            fontFamily: 'monospace',
          }}>
            {payId || '—'}
          </span>
        </div>
      </div>

      {/* Fields grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 32px' }}>
        <Field label="Full Name"            value={student.name} />
        <Field label="Course / Marketplace" value={student.marketplace} />
        <Field label="Language / Medium"    value={student.medium} />
        <Field label="Contact Number"       value={student.contact} mono />
        <Field label="NIC"                  value={student.nic} mono />
        <Field label="Email Address"        value={student.email} />
        <Field label="Group"                value={student.group} />
        <Field label="Date of Birth"        value={student.dob} />
        <Field label="Gender"               value={student.gender} />
        <Field label="Class Format"         value={student.classFormat === '0' ? 'N/A' : student.classFormat} />
        <Field label="Class Type"           value={student.classType   === '0' ? 'N/A' : student.classType} />
        <Field label="Joining Date"          value={student.createdAt} />
      </div>
    </div>
  );
}
