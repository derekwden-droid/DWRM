import { useEffect, useState } from 'react'
import { getHealth } from '../api/client.js'

export default function Header({ count }) {
  const [status, setStatus] = useState('checking')

  useEffect(function () {
    getHealth()
      .then(function () { setStatus('online') })
      .catch(function () { setStatus('offline') })
  }, [])

  var statusColor = status === 'online' ? '#4ade80' : status === 'offline' ? '#f87171' : '#fbbf24'

  return (
    <header style={{
      borderBottom: '1px solid #1f2937',
      backgroundColor: '#0d1117',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="3" fill="#0d1117" />
            <circle cx="16" cy="16" r="7" stroke="#a78bfa" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#a78bfa" />
            <line x1="16" y1="5" x2="16" y2="9" stroke="#60a5fa" strokeWidth="1.5" />
            <line x1="16" y1="23" x2="16" y2="27" stroke="#60a5fa" strokeWidth="1.5" />
            <line x1="5" y1="16" x2="9" y2="16" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="23" y1="16" x2="27" y2="16" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
          <div>
            <div style={{ color: '#e2e8f0', fontWeight: 600, letterSpacing: '0.15em', fontSize: 14 }}>DWRM</div>
            <div style={{ color: '#6b7280', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Dynamic Workload Routing Middleware
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 11 }}>
          <span style={{ color: '#6b7280' }}>
            Decisions: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{count}</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
            <span style={{ color: statusColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{status}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
