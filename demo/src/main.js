import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HieroContext, HieroProvider } from '../../src/index';
const context = new HieroContext({
    network: 'testnet'
});
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(HieroProvider, { context: context, children: _jsx(App, {}) }) }));
//# sourceMappingURL=main.js.map