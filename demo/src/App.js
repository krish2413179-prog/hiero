import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useMirrorQuery } from '../../src/index';
function NetworkStats() {
    const { data: supply, loading } = useMirrorQuery(m => m.getNetworkSupply());
    if (loading)
        return _jsx("div", { className: "loading-spinner" });
    return (_jsxs("div", { className: "grid", children: [_jsxs("div", { className: "glass-card", children: [_jsx("div", { className: "stat-label", children: "HBAR Total Supply" }), _jsxs("div", { className: "stat-value", children: [Number(supply?.total || 0) / 100000000, " HBAR"] })] }), _jsxs("div", { className: "glass-card", children: [_jsx("div", { className: "stat-label", children: "HBAR Circulating Supply" }), _jsxs("div", { className: "stat-value", children: [Number(supply?.circulating || 0) / 100000000, " HBAR"] })] })] }));
}
function LatestBlocks() {
    const { data: blocks, loading } = useMirrorQuery(m => m.getBlocks(5));
    if (loading)
        return _jsx("div", { className: "loading-spinner" });
    return (_jsxs("div", { className: "glass-card", children: [_jsx("div", { className: "stat-label", style: { marginBottom: '1rem' }, children: "Latest Network Blocks" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: blocks?.map((block) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }, children: [_jsxs("span", { children: ["Block #", block.number] }), _jsxs("span", { style: { color: '#94a3b8' }, children: [block.count, " txs"] })] }, block.number))) })] }));
}
function App() {
    return (_jsxs("div", { className: "dashboard", children: [_jsx("h1", { className: "title", children: "Hiero TS Utilities Showcase" }), _jsxs("p", { style: { color: '#94a3b8', marginBottom: '2rem' }, children: ["This demo uses the ", _jsx("code", { children: "<HieroProvider>" }), " and ", _jsx("code", { children: "useMirrorQuery" }), " hook from the library to fetch real-time data from the Hiero Testnet."] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '2rem' }, children: [_jsxs("section", { children: [_jsx("h2", { style: { fontSize: '1.25rem', marginBottom: '1rem' }, children: "Network Supply" }), _jsx(NetworkStats, {})] }), _jsxs("section", { children: [_jsx("h2", { style: { fontSize: '1.25rem', marginBottom: '1rem' }, children: "Chain Activity" }), _jsx(LatestBlocks, {})] })] })] }));
}
export default App;
//# sourceMappingURL=App.js.map