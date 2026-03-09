import { T } from '@/lib/theme';

function Shimmer({ w, h, r = 8 }: { w?: string | number; h: number; r?: number }) {
  return (
    <div
      className="shimmer"
      style={{
        width: w ?? '100%',
        height: h,
        borderRadius: r,
        flexShrink: 0,
      }}
    />
  );
}

export default function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header skeleton */}
      <div style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
      }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            paddingLeft: i === 1 ? '24px' : '0',
            paddingRight: i === 0 ? '24px' : '0',
            borderLeft: i === 1 ? `1px solid ${T.border}` : 'none',
          }}>
            <Shimmer w={52} h={52} r={14} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Shimmer w="70%" h={14} r={6} />
              <Shimmer w="40%" h={11} r={5} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <Shimmer w={72} h={22} r={6} />
                <Shimmer w={100} h={22} r={6} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: '24px',
          padding: '14px 24px',
          borderBottom: `1px solid ${T.border}`,
          background: T.input,
        }}>
          {[100, 70, 56].map((w, i) => (
            <Shimmer key={i} w={w} h={14} r={6} />
          ))}
        </div>

        {/* Content grid */}
        <div style={{
          padding: '20px 24px',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '18px 32px',
        }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Shimmer w={80}  h={10} r={4} />
              <Shimmer w="75%" h={14} r={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
