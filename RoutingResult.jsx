const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Request failed')
    throw new Error(msg || 'HTTP ' + res.status)
  }
  return res.json()
}

export function getHealth() {
  return request('/api/health')
}

export function postRoute(payload) {
  return request('/api/route', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMetrics() {
  return request('/api/metrics')
}

export function getHistory(limit) {
  return request('/api/history?limit=' + (limit || 50))
}
