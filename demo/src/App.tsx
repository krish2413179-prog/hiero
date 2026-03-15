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
      <div className="glass-card supply-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            💎
          </div>
          <div>
            <div className="stat-label">Total Supply</div>
            <div className="stat-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
              {formatHbar(supply?.total_supply || supply?.total)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>HBAR</div>
          </div>
        </div>
      </div>
      
      <div className="glass-card supply-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🔄
          </div>
          <div>
            <div className="stat-label">Circulating Supply</div>
            <div className="stat-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
              {formatHbar(supply?.released_supply || supply?.released || supply?.circulating)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>HBAR</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LatestBlocksProps {
  refreshKey: number;
}

function LatestBlocks({ refreshKey }: LatestBlocksProps) {
  const [autoRefreshKey, setAutoRefreshKey] = React.useState(0);
  const { data: blocks, loading, error } = useMirrorQuery(m => m.getBlocks(5), [refreshKey, autoRefreshKey])
  const [displayBlocks, setDisplayBlocks] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    if (blocks) {
      setDisplayBlocks(blocks);
    }
  }, [blocks]);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAutoRefreshKey(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (error) return <div style={{ color: '#ef4444', padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>Error: {error.message}</div>
  
  if (!displayBlocks.length && loading) return <div className="glass-card"><div className="loading-spinner"></div></div>
  
  return (
    <div className="glass-card blocks-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            ⛓️
          </div>
          <div className="stat-label" style={{ fontSize: '1rem', margin: 0 }}>Latest Blocks</div>
        </div>
        <div style={{ 
          fontSize: '0.75rem', 
          color: loading ? '#f59e0b' : '#10b981', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          background: loading ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          borderRadius: '20px',
          border: `1px solid ${loading ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          <div className="pulse-dot" style={{ background: loading ? '#f59e0b' : '#10b981' }}></div>
          {loading ? 'Updating...' : 'Live'}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {displayBlocks?.map((block: any, index: number) => (
          <div 
            key={block.number} 
            className="block-item"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              borderRadius: '8px',
              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {index + 1}
              </div>
              <div>
                <div style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.95rem' }}>
                  Block #{block.number}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '0.375rem 0.875rem',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              color: '#38bdf8',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {block.count} txs
            </div>
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
      <div className="header">
        <div>
          <h1 className="title">Hiero TS Utilities</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
            Real-time blockchain data from Hiero Testnet
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="refresh-btn"
        >
          <span style={{ fontSize: '1.125rem', marginRight: '0.5rem' }}>↻</span>
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        <section>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>💰</div>
            <h2 className="section-title">Network Supply</h2>
          </div>
          <NetworkStats refreshKey={refreshKey} />
        </section>

        <section>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>📊</div>
            <h2 className="section-title">Chain Activity</h2>
          </div>
          <LatestBlocks refreshKey={refreshKey} />
        </section>
      </div>
    </div>
  )
}

export default App
