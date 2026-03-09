'use client';

import { Copy, CheckCircle2, Check } from 'lucide-react';
import { useState } from 'react';
import { StudentProfile } from '@/types';
import { T } from '@/lib/theme';
import { getInitials } from '@/lib/utils';

interface Props { profile: StudentProfile; }

function Avatar({ name, gradient }: { name: string; gradient: string }) {
  const initials = getInitials(name);
  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800, fontSize: '16px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
      letterSpacing: '0.02em',
    }}>{initials}</div>
  );
}

const PAYMENT_STYLES: Record<string, { color: string; bg: string; border: string; label: string }> = {
  half:    { color: 'var(--accent-orange)', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  label: 'Half Payment' },
  full:    { color: 'var(--accent-green)',  bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', label: 'Full Payment' },
  pending: { color: 'var(--accent-red)',    bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   label: 'Pending' },
};

export default function ProfileHeader({ profile }: Props) {
  const { student, counselor } = profile;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(student.srNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ps = PAYMENT_STYLES[student.paymentStatus] ?? PAYMENT_STYLES.pending;

  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: '16px',
      boxShadow: T.shadowCard,
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0',
    }}>

      {/* ── Student side ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', paddingRight: '24px' }}>
        <Avatar name={student.name} gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <p style={{ fontWeight: 700, fontSize: '15px', color: T.text, marginBottom: '5px', lineHeight: 1.2 }}>
            {student.name}
          </p>

          {/* SR Number + copy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
            <span style={{ fontSize: '12px', color: T.textMuted, fontFamily: 'monospace', fontWeight: 600 }}>
              {student.srNumber}
            </span>
            <button
              onClick={handleCopy}
              title="Copy SR Number"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: copied ? 'var(--accent-green)' : T.textMuted,
                display: 'flex', alignItems: 'center',
                padding: '2px', borderRadius: '4px',
                transition: 'color 0.15s',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>

          {/* Payment badge + course */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '6px',
              color: ps.color, background: ps.bg, border: `1px solid ${ps.border}`,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{ps.label}</span>

            <span style={{
              fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
              color: T.textSec, background: T.input, border: `1px solid ${T.border}`,
              maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{student.marketplace}</span>
          </div>
        </div>
      </div>

      {/* ── Counselor side ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        paddingLeft: '24px',
        borderLeft: `1px solid ${T.border}`,
      }}>
        <Avatar name={counselor.name} gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <p style={{ fontWeight: 700, fontSize: '15px', color: T.text, marginBottom: '5px', lineHeight: 1.2 }}>
            {counselor.name}
          </p>

          {/* CC Number */}
          <p style={{ fontSize: '12px', color: T.textMuted, fontFamily: 'monospace', fontWeight: 600, marginBottom: '7px' }}>
            {counselor.ccId}
          </p>

          {/* Active badge + agent number */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {counselor.isActive && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '6px',
                color: 'var(--accent-green)', background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                <CheckCircle2 size={10} /> Active
              </span>
            )}
            <span style={{ fontSize: '12px', color: T.textMuted, fontFamily: 'monospace' }}>
              {counselor.agentNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
