import { Order } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface Props { orders: Order[]; }

export default function OrdersTab({ orders }: Props) {
  if (!orders.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No orders found</div>
  );

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {orders.map(order => (
        <div key={order.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderRadius: '10px',
          background: '#f8fafc', border: '1px solid #f1f5f9',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f8fafc')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'white', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>🧾</div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
              {order.description}
            </span>
          </div>
          <span style={{
            fontSize: '11px', color: '#64748b', fontFamily: 'monospace',
            fontWeight: 500, flexShrink: 0, marginLeft: '16px',
          }}>
            {formatDateTime(order.paidAt)}
          </span>
        </div>
      ))}
    </div>
  );
}