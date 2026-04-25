#!/bin/bash
# DWRM — direct Vercel deploy, bypasses GitHub entirely
# Run from inside the extracted dwrm/ folder

set -e

echo ">>> DWRM direct deploy"
echo ""

# Sanity: are we in the right folder?
if [ ! -f "vercel.json" ] || [ ! -f "index.html" ] || [ ! -d "api" ]; then
  echo "ERROR: run this from inside the extracted dwrm/ folder."
  echo "Expected files: vercel.json, index.html, api/"
  exit 1
fi

# Install Vercel CLI if missing
if ! command -v vercel &> /dev/null; then
  echo ">>> Installing Vercel CLI..."
  npm install -g vercel
fi

# Sanity: confirm no junk at root
if [ -f "package.json" ]; then
  echo "WARN: package.json found at root — removing (belongs in _frontend/)"
  rm package.json package-lock.json 2>/dev/null || true
fi

echo ""
echo ">>> Files Vercel will deploy:"
ls -1 | grep -v '^_'
echo ""

echo ">>> Logging in to Vercel (opens browser if needed)..."
vercel login

echo ""
echo ">>> Setting ANTHROPIC_API_KEY..."
echo "Enter your Anthropic API key (starts with sk-ant-):"
read -r ANTHROPIC_KEY
vercel env add ANTHROPIC_API_KEY production <<< "$ANTHROPIC_KEY"

echo ""
echo ">>> Deploying to production..."
vercel --prod --yes

echo ""
echo ">>> Done. Your site is live."
