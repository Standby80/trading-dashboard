import { ImageResponse } from 'next/og';
import { getDashboardData } from '@/lib/data-service';
export const alt = 'MetaMetrics Public Dashboard';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { username: string } }) {
  const data = await getDashboardData(undefined, undefined, 'All Accounts', params.username);

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 60,
            fontWeight: 800,
            fontFamily: 'sans-serif',
          }}
        >
          Profile Not Found
        </div>
      ),
      { ...size }
    );
  }

  const kpis = data.kpis;
  const growth = ((kpis.netProfit / kpis.initialBalance) * 100).toFixed(1);
  const winRate = kpis.winRate.toFixed(1);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '16px', marginRight: '24px', border: '2px solid rgba(99, 102, 241, 0.3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{data.profile?.full_name || params.username}</span>
              <span style={{ fontSize: 32, color: '#94a3b8', marginTop: '8px' }}>Verified Track Record</span>
            </div>
          </div>
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            border: '2px solid rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            padding: '12px 24px',
            borderRadius: '99px',
            fontSize: 24,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Active
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ color: '#94a3b8', fontSize: 28, fontWeight: 500 }}>Total Growth</span>
            <span style={{ color: Number(growth) >= 0 ? '#4ade80' : '#f87171', fontSize: 84, fontWeight: 800, marginTop: '16px' }}>
              {Number(growth) > 0 ? '+' : ''}{growth}%
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ color: '#94a3b8', fontSize: 28, fontWeight: 500 }}>Win Rate</span>
            <span style={{ color: 'white', fontSize: 84, fontWeight: 800, marginTop: '16px' }}>
              {winRate}%
            </span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ color: '#94a3b8', fontSize: 28, fontWeight: 500 }}>Profit Factor</span>
            <span style={{ color: 'white', fontSize: 84, fontWeight: 800, marginTop: '16px' }}>
              {kpis.profitFactor.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ color: '#64748b', fontSize: 24, fontWeight: 500 }}>Powered by MetaMetrics.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
