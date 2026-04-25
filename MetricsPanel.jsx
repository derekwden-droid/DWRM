var BACKEND_BADGE = {
  quantum: 'badge-quantum',
  gpu:     'badge-gpu',
  cpu:     'badge-cpu',
}

var BACKEND_ICON = {
  quantum: '⬡',
  gpu:     '▣',
  cpu:     '▢',
}

export default function AuditTrail({ decisions }) {
  return (
    <div className="card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#4ade80' }}>☰</span>
          Audit Trail
        </div>
        <span style={{ color: '#374151', fontSize: 10 }}>{decisions.length} entries</span>
      </div>

      {decisions.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#374151', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          No decisions recorded
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#111827', borderBottom: '1px solid #1f2937' }}>
              <tr>
                {['ID', 'Time', 'Backend', 'QA', 'Cost', 'Type', 'Fallback', 'Conf'].map(function (h) {
                  return (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: '0.1em', color: '#374151', fontWeight: 500, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {decisions.map(function (d, i) {
                var cls = d.classification || {}
                var badgeClass = BACKEND_BADGE[d.routing_decision] || 'badge-cpu'
                var icon = BACKEND_ICON[d.routing_decision] || '▢'
                return (
                  <tr
                    key={d.id + '-' + i}
                    style={{ borderBottom: '1px solid rgba(31,41,55,0.5)', transition: 'background 0.1s' }}
                    onMouseEnter={function (e) { e.currentTarget.style.backgroundColor = 'rgba(13,17,23,0.6)' }}
                    onMouseLeave={function (e) { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td style={{ padding: '7px 12px', color: '#6b7280', fontWeight: 500 }}>{d.id}</td>
                    <td style={{ padding: '7px 12px', color: '#374151', whiteSpace: 'nowrap' }}>
                      {new Date(d.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '7px 12px' }}>
                      <span className={badgeClass}>{icon} {(d.routing_decision || 'cpu').toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '7px 12px', color: d.quantum_advantage_score >= 65 ? '#a78bfa' : d.quantum_advantage_score >= 35 ? '#60a5fa' : '#f59e0b' }}>
                      {d.quantum_advantage_score || 0}
                    </td>
                    <td style={{ padding: '7px 12px', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                      ${(d.estimated_cost_usd || 0).toFixed(5)}
                    </td>
                    <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {(cls.problem_type || d.workload && d.workload.problem_type || '—').replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '7px 12px' }}>
                      {d.fallback_applied
                        ? <span style={{ color: '#fbbf24', fontSize: 10 }}>⚠ yes</span>
                        : <span style={{ color: '#374151', fontSize: 10 }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '7px 12px', color: '#6b7280' }}>
                      {(d.confidence || cls.confidence || 0)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
