import { useState } from 'react'

var SAMPLES = [
  {
    label: 'RSA Factoring',
    description: 'Factor a 2048-bit RSA modulus. Requires decomposing a large semiprime into its prime factors for cryptanalysis.',
    problem_type: 'factoring',
    data_size_gb: 0.001,
    cost_budget_usd: 5,
    priority: 'high',
  },
  {
    label: 'Drug Binding Simulation',
    description: 'Quantum chemistry simulation of molecular orbital interactions for a candidate kinase inhibitor binding analysis.',
    problem_type: 'quantum_simulation',
    data_size_gb: 0.4,
    cost_budget_usd: 8,
    priority: 'normal',
  },
  {
    label: 'LLM Fine-Tuning (7B)',
    description: 'Supervised fine-tuning on a 7B parameter transformer. Dataset: 2M instruction pairs, 12GB of tokenized text.',
    problem_type: 'ml_training',
    data_size_gb: 12,
    cost_budget_usd: 25,
    priority: 'normal',
  },
  {
    label: 'Route Optimization',
    description: 'Traveling salesman variant: optimize delivery routes for 850 stops across a metropolitan grid with time windows.',
    problem_type: 'optimization',
    data_size_gb: 0.05,
    cost_budget_usd: 2,
    priority: 'high',
  },
  {
    label: 'Log Parsing Pipeline',
    description: 'Parse and index 500MB of structured application logs. Extract error patterns and latency percentiles.',
    problem_type: 'data_processing',
    data_size_gb: 0.5,
    cost_budget_usd: 0.10,
    priority: 'critical',
  },
  {
    label: 'Portfolio Risk (Monte Carlo)',
    description: 'Monte Carlo simulation: 1,200-asset portfolio under 100,000 market scenarios. Compute VaR and CVaR.',
    problem_type: 'monte_carlo',
    data_size_gb: 2.0,
    cost_budget_usd: 4,
    priority: 'high',
  },
]

var PRIORITIES = ['low', 'normal', 'high', 'critical']

var PRIORITY_COLORS = {
  low:      { bg: 'rgba(55,65,81,0.4)',     border: '#374151', color: '#6b7280' },
  normal:   { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.6)', color: '#a78bfa' },
  high:     { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.6)',  color: '#fbbf24' },
  critical: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.6)', color: '#f87171' },
}

export default function WorkloadForm({ onSubmit, loading }) {
  var [description, setDescription] = useState('')
  var [problemType, setProblemType] = useState('')
  var [dataGb, setDataGb] = useState('')
  var [timeSec, setTimeSec] = useState('')
  var [budgetUsd, setBudgetUsd] = useState('')
  var [priority, setPriority] = useState('normal')
  var [showSamples, setShowSamples] = useState(false)

  function loadSample(s) {
    setDescription(s.description)
    setProblemType(s.problem_type || '')
    setDataGb(s.data_size_gb != null ? String(s.data_size_gb) : '')
    setTimeSec('')
    setBudgetUsd(s.cost_budget_usd != null ? String(s.cost_budget_usd) : '')
    setPriority(s.priority || 'normal')
    setShowSamples(false)
  }

  function handleSubmit() {
    if (!description.trim()) return
    var payload = { description: description.trim(), priority: priority }
    if (problemType.trim()) payload.problem_type = problemType.trim()
    if (dataGb)   payload.data_size_gb          = parseFloat(dataGb)
    if (timeSec)  payload.time_budget_seconds    = parseFloat(timeSec)
    if (budgetUsd) payload.cost_budget_usd       = parseFloat(budgetUsd)
    onSubmit(payload)
  }

  function handleClear() {
    setDescription('')
    setProblemType('')
    setDataGb('')
    setTimeSec('')
    setBudgetUsd('')
    setPriority('normal')
  }

  return (
    <div className="card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <span style={{ color: '#a78bfa' }}>INPUT</span>
        <button
          className="btn-ghost"
          style={{ padding: '2px 8px', fontSize: 10 }}
          onClick={function () { setShowSamples(function (v) { return !v }) }}
        >
          {showSamples ? 'hide samples' : 'load sample'}
        </button>
      </div>

      {showSamples && (
        <div style={{ borderBottom: '1px solid #1f2937', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SAMPLES.map(function (s) {
            return (
              <button
                key={s.label}
                onClick={function () { loadSample(s) }}
                style={{
                  background: 'transparent',
                  border: '1px solid #1f2937',
                  color: '#e2e8f0',
                  padding: '8px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
                onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#1f2937' }}
              >
                <div style={{ color: '#a78bfa', fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</div>
              </button>
            )
          })}
        </div>
      )}

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="field-label">Description *</label>
          <textarea
            className="text-input"
            style={{ minHeight: 88, resize: 'vertical' }}
            placeholder="Describe the computational task..."
            value={description}
            onChange={function (e) { setDescription(e.target.value) }}
          />
        </div>

        <div>
          <label className="field-label">Problem Type <span style={{ color: '#374151' }}>(optional)</span></label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. optimization, ml_training, factoring"
            value={problemType}
            onChange={function (e) { setProblemType(e.target.value) }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <label className="field-label">Data (GB)</label>
            <input type="number" className="text-input" placeholder="0" min="0" step="0.01"
              value={dataGb} onChange={function (e) { setDataGb(e.target.value) }} />
          </div>
          <div>
            <label className="field-label">Time (s)</label>
            <input type="number" className="text-input" placeholder="—" min="0" step="1"
              value={timeSec} onChange={function (e) { setTimeSec(e.target.value) }} />
          </div>
          <div>
            <label className="field-label">Budget ($)</label>
            <input type="number" className="text-input" placeholder="—" min="0" step="0.01"
              value={budgetUsd} onChange={function (e) { setBudgetUsd(e.target.value) }} />
          </div>
        </div>

        <div>
          <label className="field-label">Priority</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {PRIORITIES.map(function (p) {
              var active = priority === p
              var colors = PRIORITY_COLORS[p]
              return (
                <button
                  key={p}
                  onClick={function () { setPriority(p) }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    border: '1px solid ' + (active ? colors.border : '#1f2937'),
                    background: active ? colors.bg : 'transparent',
                    color: active ? colors.color : '#374151',
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button
            className="btn-primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Classifying...
              </>
            ) : (
              'Route Workload'
            )}
          </button>
          <button className="btn-ghost" onClick={handleClear} disabled={loading}>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
