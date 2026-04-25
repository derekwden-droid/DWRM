import { useEffect, useState } from 'react'
import { getMetrics } from '../api/client.js'

var ROWS = [
  { key: 'quantum', label: 'Quantum', color: '#a78bfa', icon: '⬡' },
  { key: 'gpu',     label: 'GPU',     color: '#60a5fa', icon: '▣' },
  { key: 'cpu',     label: 'CPU',     color: '#f59e0b', icon: '▢' },
]

function Bar({ pct, color }) {
  var [width, setWidth] = useState(0)
  useEffect(function () {
    var t = setTimeout(function () { setWidth(pct) }, 150)
    return function () { clearTimeout(t) }
  }, [pct])
  return (
    <div className="score-bar-track" style={{ flex: 1 }}>
      <div className="score-bar-fill" style={{ width: width + '%', backgroundColor: color }} />
    </div>
  )
}

export default function MetricsPanel({ tick }) {
  var [data, setData] = useState(null)

  useEffect(function () {
    getMetrics().then(setData).catch(function () {})
  }, [tick])

  var empty = !data || data.total === 0

  return (
    <div className="card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <span style={{ color: '#4ade80' }}>▦</span>
        <span>Metrics</span>
        {!empty && <span style={{ marginLeft: 'auto', color: '#374151', fontSize: 10 }}>{data.total} total</span>}
      </div>

      <div style={{ padding: 16 }}>
        {empty ? (
          <div style={{ textAlign: 'center', color: '#374151', fontSize: 11, padding: '32px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            No data yet
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {ROWS.map(function (row) {
                var dist = data.distribution[row.key] || { count: 0, pct: 0 }
                return (
                  <div key={row.key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: row.color, fontSize: 12 }}>{row.icon}</span>
                      <span style={{ color: '#6b7280', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', flex: 1 }}>{row.label}</span>
                      <span style={{ color: '#6b7280', fontSize: 10 }}>{dist.count}</span>
                      <span style={{ color: row.color, fontSize: 11, fontWeight: 600, width: 36, textAlign: 'right' }}>{dist.pct}%</span>
                    </div>
                    <Bar pct={dist.pct} color={row.color} />
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['Fallback Rate', data.fallback_rate + '%', 'cost enforcement'],
                ['Avg QA Score',  data.avg_qa_score,        'quantum advantage'],
                ['Avg Cost',      '$' + (data.avg_cost || 0).toFixed(5), 'per workload'],
                ['Total',         data.total,               'this session'],
              ].map(function (item) {
                return (
                  <div key={item[0]} style={{ border: '1px solid #1f2937', padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{item[0]}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item[1]}</div>
                    <div style={{ fontSize: 10, color: '#374151', marginTop: 2 }}>{item[2]}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
