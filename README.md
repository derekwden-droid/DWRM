# DWRM

**Dynamic Workload Routing Middleware** — AI-driven middleware that classifies compute workloads and routes them to CPU, GPU, or quantum backends at runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

---

## Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS        |
| Backend  | FastAPI, Mangum (ASGI → serverless) |
| AI       | Anthropic Claude API                |
| Deploy   | Vercel (Vite build + Python serverless) |

## Repo Structure

```
DWRM/
├── frontend/               # React source — Vercel builds this on deploy
│   ├── index.html
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── api/
│   └── index.py            # FastAPI + Mangum serverless handler
├── package.json            # root marker
├── vercel.json             # build config + API rewrite
├── requirements.txt        # Python deps
├── runtime.txt             # Python 3.11
└── .env.example
```

## How the Deploy Works

Vercel runs:
1. `cd frontend && npm ci --include=dev && npm run build` — produces `frontend/dist/`
2. Serves `frontend/dist/` as the static site
3. Auto-detects `api/index.py` as a Python serverless function
4. Rewrites `/api/*` → the function

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Leave all framework / build / output settings on default — `vercel.json` declares them
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy

## Local Development

**Backend (terminal 1):**
```bash
pip install -r requirements.txt fastapi uvicorn
uvicorn api.index:app --reload
```

**Frontend (terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:3000` and proxies `/api/*` to `http://localhost:8000`.

## Environment Variables

| Variable            | Description                  |
|---------------------|------------------------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required) |

## License

MIT — see [LICENSE](LICENSE)
