import { Order } from '@/types';
import { Calendar, Package, CreditCard } from 'lucide-react';
import { T } from '@/lib/theme';

interface Props { orders: Order[]; }

function fmtDate(d: string) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return d; }
}

function fmtAmount(raw: string) {
  if (!raw) return '';
  const n = parseFloat(raw);
  if (isNaN(n)) return raw;
  return 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function PaymentModeBadge({ mode }: { mode: string }) {
  if (!mode) return null;
  const m = mode.toLowerCase();
  const cfg =
    m.includes('bank')  ? { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)', label: mode } :
    m.includes('card')  ? { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: 'rgba(139,92,246,0.25)', label: mode } :
    m.includes('cash')  ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)', label: mode } :
                          { bg: 'rgba(100,116,139,0.12)', color: '#64748b', border: 'rgba(100,116,139,0.25)', label: mode };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      textTransform: 'capitalize',
    }}>
      <CreditCard size={9} />
      {cfg.label}
    </span>
  );
}

function SubscriptionBadge({ sub }: { sub: string }) {
  if (!sub) return null;
  const s = sub.toLowerCase();
  const isHalf = s.includes('half');
  const isFull = s.includes('full');
  if (!isHalf && !isFull) return null;

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
      background: isFull ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
      color: isFull ? '#10b981' : '#f59e0b',
      border: `1px solid ${isFull ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
    }}>
      {isFull ? 'Full Payment' : 'Half Payment'}
    </span>
  );
}

export default function OrdersTab({ orders }: Props) {
  if (!orders.length) return (
    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textMuted, fontSize: '13px' }}>
      No orders found
    </div>
  );

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: T.input,
            border: `1px solid ${T.border}`,
            borderRadius: '12px',
            padding: '14px 18px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-1px)';
            el.style.borderColor = 'var(--border-hover)';
            el.style.boxShadow = T.shadowCard;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.borderColor = T.border;
            el.style.boxShadow = 'none';
          }}
        >
          {/* Top row: icon + product name + amount */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
            }}>
              <Package size={18} color="white" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '6px', lineHeight: 1.4 }}>
                {order.description}
              </p>

              {/* Date + badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={10} color={T.textMuted} />
                  <span style={{ fontSize: '11px', color: T.textMuted }}>{fmtDate(order.paidAt)}</span>
                </div>
                <PaymentModeBadge mode={order.paymentMode} />
                <SubscriptionBadge sub={order.subscription} />
              </div>
            </div>

            {/* Amount on right */}
            {order.amount && (
              <span style={{
                fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}>
                {fmtAmount(order.amount)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
