# DWRM

**Dynamic Workload Routing Middleware**

AI-driven middleware that classifies compute workloads and routes them to the optimal backend — classical CPU, GPU cluster, or quantum processor — at runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com)

---

## Features

- **Workload Classification** — Claude AI scores quantum advantage, parallelism, and data intensity
- **Dynamic Routing** — dispatches to CPU, GPU, or quantum based on classification
- **Cost Enforcement** — automatic fallback when cost budget is exceeded
- **Audit Trail** — every routing decision logged with full reasoning
- **Session Metrics** — live distribution stats across all three backends

## Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Tailwind CSS      |
| Backend  | FastAPI, Mangum (ASGI → serverless) |
| AI       | Anthropic Claude API              |
| Deploy   | Vercel (static + Python serverless) |

## Local Development

**Backend**
```bash
pip install -r requirements.txt
uvicorn api.index:app --reload
# runs on http://localhost:8000
```

**Frontend** (separate terminal)
```bash
npm install
npm run dev
# runs on http://localhost:3000
# /api/* proxied to localhost:8000
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy — no framework preset needed

## Environment Variables

| Variable          | Description                        |
|-------------------|------------------------------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required)     |

Copy `.env.example` for local dev:
```bash
cp .env.example .env
```

## Project Structure

```
DWRM/
├── api/
│   └── index.py          # FastAPI + Mangum serverless handler
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── api/client.js
│   └── components/
│       ├── Header.jsx
│       ├── WorkloadForm.jsx
│       ├── RoutingResult.jsx
│       ├── MetricsPanel.jsx
│       └── AuditTrail.jsx
├── public/favicon.svg
├── index.html
├── vercel.json
├── requirements.txt
└── runtime.txt
```

## License

MIT — see [LICENSE](LICENSE)
