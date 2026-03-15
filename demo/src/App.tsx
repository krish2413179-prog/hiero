import React from 'react'
import { useMirrorQuery } from '../../src/index'

interface NetworkStatsProps {
  refreshKey: number;
}

function NetworkStats({ refreshKey }: NetworkStatsProps) {
  const { data: supply, loading, error } = useMirrorQuery(m => m.getNetworkSupply(), [refreshKey])
  
  React.useEffect(() => {
    if (supply) console.log('Supply Data:', supply);
    if (error) console.error('Supply Error:', error);
  }, [supply, error]);

  if (loading) return (
    <div className="grid">
      <div className="glass-card" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
      <div className="glass-card" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ color: '#ef4444', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
      <strong>Connectivity Issue:</strong> {error.message}
    </div>
  );
  
  const formatHbar = (tinybar?: string | number) => {
    if (!tinybar) return '0';
    try {
      // Handle scientific notation or string BigInt
      const val = typeof tinybar === 'string' ? BigInt(tinybar.split('.')[0]) : BigInt(Math.floor(Number(tinybar)));
      const hbar = Number(val) / 100_000_000;
      return hbar.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } catch (e) {
      console.error('Format error:', e);
      return '0';
    }
  };

  return (
    <div className="grid">
      <div className="glass-card">
        <div className="stat-label">HBAR Total Supply</div>
        <div className="stat-value">{formatHbar(supply?.total_supply || supply?.total)} HBAR</div>
      </div>
      <div className="glass-card">
        <div className="stat-label">HBAR Circulating Supply</div>
        <div className="stat-value">{formatHbar(supply?.released_supply || supply?.circulating)} HBAR</div>
      </div>
    </div>
  )
}

interface LatestBlocksProps {
  refreshKey: number;
}

function LatestBlocks({ refreshKey }: LatestBlocksProps) {
  const { data: blocks, loading, error } = useMirrorQuery(m => m.getBlocks(5), [refreshKey])
  
  if (loading) return <div className="glass-card"><div className="loading-spinner"></div></div>
  if (error) return <div style={{ color: '#ef4444', padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>Error: {error.message}</div>
  
  return (
    <div className="glass-card">
      <div className="stat-label" style={{ marginBottom: '1rem' }}>Latest Network Blocks</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {blocks?.map((block: any) => (
          <div key={block.number} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            <span>Block #{block.number}</span>
            <span style={{ color: '#94a3b8' }}>{block.count} txs</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="title" style={{ marginBottom: 0 }}>Hiero TS Utilities Showcase</h1>
        <button 
          onClick={handleRefresh}
          className="refresh-btn"
          style={{
            padding: '0.6rem 1.2rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            color: '#38bdf8',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            backdropFilter: 'blur(4px)'
          }}
        >
          Refresh Data
        </button>
      </div>
      
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
        This demo uses the <code>&lt;HieroProvider&gt;</code> and <code>useMirrorQuery</code> hook 
        from the library to fetch real-time data from the Hiero Testnet.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
             <h2 style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f1f5f9' }}>Network Supply</h2>
          </div>
          <NetworkStats refreshKey={refreshKey} />
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }}></div>
             <h2 style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f1f5f9' }}>Chain Activity</h2>
          </div>
          <LatestBlocks refreshKey={refreshKey} />
        </section>
      </div>
    </div>
  )
}

export default App
