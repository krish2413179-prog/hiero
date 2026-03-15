import React from 'react'
import { useMirrorQuery } from '../../src/index'

function NetworkStats() {
  const { data: supply, loading } = useMirrorQuery(m => m.getNetworkSupply(), [])
  
  if (loading) return <div className="loading-spinner"></div>
  
  return (
    <div className="grid">
      <div className="glass-card">
        <div className="stat-label">HBAR Total Supply</div>
        <div className="stat-value">{Number(supply?.total || 0) / 100000000} HBAR</div>
      </div>
      <div className="glass-card">
        <div className="stat-label">HBAR Circulating Supply</div>
        <div className="stat-value">{Number(supply?.circulating || 0) / 100000000} HBAR</div>
      </div>
    </div>
  )
}

function LatestBlocks() {
  const { data: blocks, loading } = useMirrorQuery(m => m.getBlocks(5), [])
  
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
  return (
    <div className="dashboard">
      <h1 className="title">Hiero TS Utilities Showcase</h1>
      
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        This demo uses the <code>&lt;HieroProvider&gt;</code> and <code>useMirrorQuery</code> hook 
        from the library to fetch real-time data from the Hiero Testnet.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Network Supply</h2>
          <NetworkStats />
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Chain Activity</h2>
          <LatestBlocks />
        </section>
      </div>
    </div>
  )
}

export default App
