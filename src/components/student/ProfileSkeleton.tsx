export default function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header skeleton */}
      <div style={{
        background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0',
        padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
      }}>
        {[0,1].map(i => (
          <div key={i} style={{
            display: 'flex', gap: '12px', alignItems: 'center',
            padding: i === 1 ? '0 0 0 20px' : '0 20px 0 0',
          }}>
            <div className="shimmer" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="shimmer" style={{ height: 14, borderRadius: 6, width: '70%' }} />
              <div className="shimmer" style={{ height: 11, borderRadius: 6, width: '45%' }} />
              <div className="shimmer" style={{ height: 11, borderRadius: 6, width: '55%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div style={{
        background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px' }}>
          {[80, 60, 50].map((w, i) => (
            <div key={i} className="shimmer" style={{ height: 12, width: w, borderRadius: 6 }} />
          ))}
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="shimmer" style={{ height: 10, width: 80, borderRadius: 4 }} />
              <div className="shimmer" style={{ height: 14, width: '75%', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}