import React from 'react'
import { useMirrorQuery } from '../../src/index'

interface NetworkStatsProps {
  refreshKey: number;
}

function NetworkStats({ refreshKey }: NetworkStatsProps) {
  const { data: supply, loading } = useMirrorQuery(m => m.getNetworkSupply(), [refreshKey])
  
  React.useEffect(() => {
    if (supply) {
      console.log('Hiero Supply Data:', supply);
    }
  }, [supply]);

  const formatHbar = (tinybar?: string | number) => {
    if (!tinybar) return '0';
    try {
      const val = typeof tinybar === 'string' ? BigInt(tinybar) : BigInt(Math.floor(Number(tinybar)));
      // Divide by 10^8 for HBAR
      const hbar = Number(val) / 100_000_000;
      return hbar.toLocaleString();
    } catch (e) {
      return '0';
    }
  };

  if (loading) return <div className="loading-spinner"></div>
  
  return (
    <div>
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
      {!supply?.total_supply && !supply?.total && (
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#ef4444' }}>
          Debug: {JSON.stringify(supply)}
        </div>
      )}
    </div>
  )
}

interface LatestBlocksProps {
  refreshKey: number;
}

function LatestBlocks({ refreshKey }: LatestBlocksProps) {
  const { data: blocks, loading } = useMirrorQuery(m => m.getBlocks(5), [refreshKey])
  
  if (loading) return <div className="loading-spinner"></div>
  
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
            padding: '0.5rem 1rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '8px',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          Refresh Data
        </button>
      </div>
      
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        This demo uses the <code>&lt;HieroProvider&gt;</code> and <code>useMirrorQuery</code> hook 
        from the library to fetch real-time data from the Hiero Testnet.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Network Supply</h2>
          <NetworkStats refreshKey={refreshKey} />
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Chain Activity</h2>
          <LatestBlocks refreshKey={refreshKey} />
        </section>
      </div>
    </div>
  )
}

export default App
