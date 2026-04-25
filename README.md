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
| Deploy   | Vercel (static + Python serverless) |

## Repo Structure

```
DWRM/
├── index.html              # production frontend (pre-built)
├── favicon.svg
├── assets/                 # bundled JS + CSS (Vite output)
├── api/
│   └── index.py            # FastAPI + Mangum serverless handler
├── _frontend/              # React source — local dev only, not deployed
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── package.json            # root marker — empty, no build at this level
├── vercel.json             # explicit no-build config + API rewrite
├── .vercelignore           # excludes _frontend/ from deploy bundle
├── requirements.txt        # Python deps for the serverless function
├── runtime.txt             # Python 3.11
└── .env.example
```

The repo root **is** the deployed static site. The `_frontend/` folder holds the React source for local modifications and is excluded from the Vercel deploy bundle via `.vercelignore`.

## Deploy to Vercel

### Option 1 — GitHub integration (recommended)

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. **Leave all framework / build / output settings on default** — `vercel.json` already declares them explicitly
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy

### Option 2 — Vercel CLI direct

```bash
./deploy.sh
```

The script installs the Vercel CLI if needed, prompts for your `ANTHROPIC_API_KEY`, and deploys to production.

## Why the Config Files Look the Way They Do

This repo is a **static site at the root + a Python serverless function in `/api`**. The React app is *already built* into `assets/` — Vercel does not need to run a Node build at deploy time.

The configuration is explicit on purpose:

- **Root `package.json`** is intentionally minimal (no `scripts`, no `dependencies`). It exists only so Vercel's build pipeline can parse it cleanly and conclude there is nothing to build at the root.
- **`vercel.json`** sets `framework`, `buildCommand`, and `installCommand` all to `null`. This disables Vercel's framework auto-detection, which would otherwise try to install Node dependencies it doesn't need.
- **`.vercelignore`** keeps `_frontend/` out of the deploy bundle entirely — its `package.json` would otherwise confuse build detection, and the source isn't needed in production since `assets/` is already built.
- **`requirements.txt`** + **`runtime.txt`** at the root are how Vercel discovers the Python function in `/api/index.py`.

If you ever see a Vercel error like:

```
/vercel/path0/package.json: Unexpected token 'i', "import { u"... is not valid JSON
```

it means JSX source code was accidentally pasted into the root `package.json`. Restore this repo's root `package.json` (the minimal one), commit, push, redeploy.

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

The fresh `index.html` and `assets/` overwrite the root copies, and the next deploy ships the new build.

## Environment Variables

| Variable            | Where                       | Description                  |
|---------------------|-----------------------------|------------------------------|
| `ANTHROPIC_API_KEY` | Vercel + `.env` for local   | Anthropic API key (required) |

## License

MIT — see [LICENSE](LICENSE)
