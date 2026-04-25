# DWRM

**Dynamic Workload Routing Middleware** — AI-driven middleware that classifies compute workloads and routes them to CPU, GPU, or quantum backends at runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

---

## Features

- **Workload Classification** — Claude AI scores quantum advantage, parallelism, and data intensity
- **Dynamic Routing** — dispatches to CPU, GPU, or quantum based on the classification
- **Cost Enforcement** — automatic fallback when cost budget is exceeded
- **Audit Trail** — every routing decision logged with full reasoning
- **Session Metrics** — live distribution stats across all three backends

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
├── _frontend/              # React source — Vercel builds this on every deploy
│   ├── index.html          # Vite entry
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── api/
│   └── index.py            # FastAPI + Mangum serverless handler
├── package.json            # root marker (no scripts)
├── vercel.json             # tells Vercel to build _frontend/ and serve _frontend/dist/
├── .vercelignore
├── requirements.txt        # Python deps for the serverless function
├── runtime.txt             # Python 3.11
└── .env.example
```

## How the Deploy Works

Vercel runs:
1. `cd _frontend && npm install && npm run build` — produces `_frontend/dist/index.html` + `_frontend/dist/assets/*`
2. Serves `_frontend/dist/` as the static site
3. Auto-detects `api/index.py` and turns it into a Python serverless function
4. Rewrites `/api/*` → the function

This is configured in `vercel.json`. **No prebuilt files in the repo, no manual asset copying** — Vercel handles everything from source.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. **Leave all framework / build / output settings on default** — `vercel.json` declares them
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy

That's it. Every push triggers a fresh build.

## Local Development

**Backend (terminal 1):**
```bash
pip install -r requirements.txt fastapi uvicorn
uvicorn api.index:app --reload
```

**Frontend (terminal 2):**
```bash
cd _frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:3000` and proxies `/api/*` to `http://localhost:8000` (the uvicorn server). See `_frontend/vite.config.js`.

## Environment Variables

| Variable            | Where                       | Description                  |
|---------------------|-----------------------------|------------------------------|
| `ANTHROPIC_API_KEY` | Vercel + `.env` for local   | Anthropic API key (required) |

## License

MIT — see [LICENSE](LICENSE)
