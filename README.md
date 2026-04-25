# DWRM

**Dynamic Workload Routing Middleware** — AI-driven middleware that classifies compute workloads and routes them to CPU, GPU, or quantum backends at runtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)

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
| Deploy   | Vercel (static + Python serverless) |

## Repo Structure

```
DWRM/
├── index.html              # production frontend (pre-built)
├── favicon.svg
├── assets/                 # bundled JS + CSS
├── api/
│   └── index.py            # FastAPI + Mangum serverless handler
├── _frontend/              # React source (for local dev only)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── vercel.json             # API rewrite only
├── requirements.txt
├── runtime.txt
└── .env.example
```

The repo root **is** the deployed static site. The `_frontend/` folder holds the React source for local modifications.

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

No framework preset, no build command, no output directory — the repo is already a deployable static site.

## Local Development

**Backend:**
```bash
pip install -r requirements.txt fastapi uvicorn
uvicorn api.index:app --reload
```

**Frontend:**
```bash
cd _frontend
npm install
npm run dev
```

## Rebuilding the Frontend

After modifying `_frontend/src/`:
```bash
cd _frontend
npm run build
cp -r dist/* ../
```

## Environment Variables

| Variable            | Description                  |
|---------------------|------------------------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required) |

## License

MIT — see [LICENSE](LICENSE)
