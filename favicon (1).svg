import { useState, useCallback } from 'react'
import { postRoute } from './api/client.js'
import Header from './components/Header.jsx'
import WorkloadForm from './components/WorkloadForm.jsx'
import RoutingResult from './components/RoutingResult.jsx'
import MetricsPanel from './components/MetricsPanel.jsx'
import AuditTrail from './components/AuditTrail.jsx'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [decision, setDecision] = useState(null)
  const [error, setError] = useState(null)
  const [decisions, setDecisions] = useState([])
  const [tick, setTick] = useState(0)

  const handleSubmit = useCallback(async function (payload) {
    setLoading(true)
    setError(null)
    try {
      const result = await postRoute(payload)
      setDecision(result)
      setDecisions(function (prev) {
        return [result].concat(prev).slice(0, 100)
      })
      setTick(function (t) { return t + 1 })
    } catch (err) {
      setError(err.message || 'Routing failed')
      setDecision(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712' }}>
      <Header count={decisions.length} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px' }}>
        <div className="grid-layout">
          <WorkloadForm onSubmit={handleSubmit} loading={loading} />
          <RoutingResult decision={decision} error={error} />
          <MetricsPanel tick={tick} />
        </div>
        <div style={{ marginTop: 16 }}>
          <AuditTrail decisions={decisions} />
        </div>
        <footer style={{ textAlign: 'center', fontSize: 10, color: '#374151', letterSpacing: '0.1em', padding: '16px 0', textTransform: 'uppercase' }}>
          DWRM v1.0.0 &mdash; AEGIS Security, Inc. &mdash; Patent Pending
        </footer>
      </main>

      <style>{`
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
