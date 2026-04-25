import { useEffect, useRef, useState } from 'react'

var BACKENDS = {
  quantum: {
    label: 'QUANTUM',
    icon: '⬡',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.5)',
    bg: 'rgba(167,139,250,0.08)',
    barColor: '#a78bfa',
  },
  gpu: {
    label: 'GPU CLUSTER',
    icon: '▣',
    color: '#60a5fa',
    border: 'rgba(96,165,250,0.5)',
    bg: 'rgba(96,165,250,0.08)',
    barColor: '#60a5fa',
  },
  cpu: {
    label: 'CLASSICAL CPU',
    icon: '▢',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.08)',
    barColor: '#f59e0b',
  },
}

function ScoreBar({ label, value, color }) {
  var [width, setWidth] = useState(0)
  var mounted = useRef(false)

  useEffect(function () {
    if (!mounted.current) {
      mounted.current = true
      var t = setTimeout(function () { setWidth(value) }, 120)
      return function () { clearTimeout(t) }
    }
  }, [value])

  useEffect(function () {
    var t = setTimeout(function () { setWidth(value) }, 120)
    return function () { clearTimeout(t) }
  }, [value])

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 10, color: color, fontWeight: 600 }}>{value}</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: width + '%', backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function RoutingResult({ decision, error }) {
  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <span style={{ color: '#f87171' }}>✕</span> Error
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)', color: '#f87171', padding: '10px 14px', fontSize: 12 }}>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!decision) {
    return (
      <div className="card">
        <div className="card-header">
          <span style={{ color: '#374151' }}>◇</span> Routing Decision
        </div>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 200, justifyContent: 'center' }}>
          <div style={{ fontSize: 28, color: '#374151' }}>◈</div>
          <div style={{ color: '#6b7280', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Awaiting Input</div>
          <div style={{ color: '#374151', fontSize: 10 }}>Submit a workload to see routing decision</div>
        </div>
      </div>
    )
  }

  var cls = decision.classification || {}
  var backend = BACKENDS[decision.routing_decision] || BACKENDS.cpu

  return (
    <div
      className="card fade-in"
      style={{ borderColor: backend.border, transition: 'border-color 0.4s' }}
    >
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: backend.color }}>{backend.icon}</span>
          Decision
        </div>
        <span style={{ color: '#374151', fontSize: 10 }}>ID: {decision.id}</span>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ border: '1px solid ' + backend.border, background: backend.bg, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ color: backend.color, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em' }}>
              {backend.icon} {backend.label}
            </div>
            <div style={{ border: '1px solid ' + backend.border, color: backend.color, padding: '2px 8px', fontSize: 10 }}>
              {decision.confidence || cls.confidence || 0}% conf
            </div>
          </div>
          <div style={{ color: '#6b7280', fontSize: 10 }}>
            Est. cost: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${(decision.estimated_cost_usd || 0).toFixed(5)}</span>
          </div>
        </div>

        {decision.fallback_applied && (
          <div style={{ border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.05)', padding: '8px 12px', marginBottom: 16, display: 'flex', gap: 8 }}>
            <span style={{ color: '#fbbf24' }}>⚠</span>
            <div>
              <div style={{ color: '#fbbf24', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cost Fallback Applied</div>
              <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{decision.fallback_reason}</div>
            </div>
          </div>
        )}

        <ScoreBar label="Quantum Advantage" value={decision.quantum_advantage_score || 0} color="#a78bfa" />
        <ScoreBar label="Parallelism" value={cls.parallelism_score || 0} color="#60a5fa" />
        <ScoreBar label="Data Intensity" value={cls.data_intensity_score || 0} color="#f59e0b" />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>
          {cls.problem_type && (
            <span className={'badge-' + decision.routing_decision}>
              {cls.problem_type.replace(/_/g, ' ').toUpperCase()}
            </span>
          )}
          {cls.classical_complexity && (
            <span style={{ border: '1px solid #1f2937', color: '#6b7280', padding: '2px 8px', fontSize: 10 }}>
              {cls.classical_complexity}
            </span>
          )}
          {cls.estimated_speedup_x > 1 && (
            <span style={{ border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.05)', color: '#4ade80', padding: '2px 8px', fontSize: 10 }}>
              {cls.estimated_speedup_x}x speedup
            </span>
          )}
        </div>

        {decision.reasoning && (
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: 12 }}>
            <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Reasoning</div>
            <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.8)', lineHeight: 1.6, margin: 0 }}>{decision.reasoning}</p>
          </div>
        )}

        <div style={{ fontSize: 10, color: '#374151', textAlign: 'right', marginTop: 8 }}>
          {new Date(decision.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
