import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
// @ts-ignore
window.process = window.process || { env: {} }

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HieroContext, HieroProvider } from '../../src/index'

const context = new HieroContext({ 
  network: 'testnet' 
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HieroProvider context={context}>
      <App />
    </HieroProvider>
  </React.StrictMode>,
)
