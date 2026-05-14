#!/usr/bin/env bash
# VibeHub — One-command deploy script
# Usage: bash deploy.sh
# Prerequisites: Node.js 20+, npm, Vercel account

set -e

echo "╔══════════════════════════════════════════╗"
echo "║        VibeHub Deploy Script             ║"
echo "╚══════════════════════════════════════════╝"

cd "$(dirname "$0")"

# 1. Verify env
echo ""
echo "[1/5] Checking environment..."
if [ ! -f .env ]; then
    echo "  ⚠  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "  ✏️  Edit .env with your Supabase credentials before deploying."
fi

# 2. Install dependencies
echo "[2/5] Installing dependencies..."
npm install --silent 2>/dev/null

# 3. Build
echo "[3/5] Building production bundle..."
npm run build
echo "  ✓ Build complete"

# 4. Deploy to Vercel
echo "[4/5] Deploying to Vercel..."
echo "  (If this is your first deploy, a browser will open for login.)"
echo ""

# Check if vercel is logged in
npx vercel whoami 2>/dev/null || {
    echo "  → Run 'npx vercel login' in a separate terminal to authenticate."
    echo "  → Then re-run this script."
    echo "  → Or set VERCEL_TOKEN and run: npx vercel --token \$VERCEL_TOKEN --prod"
    exit 1
}

npx vercel --prod

echo ""
echo "[5/5] Done!"
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Post-deploy checklist:                  ║"
echo "║  1. Set VITE_SUPABASE_URL in Vercel      ║"
echo "║  2. Set VITE_SUPABASE_ANON_KEY in Vercel ║"
echo "║  3. Redeploy: npx vercel --prod          ║"
echo "║  4. Apply SQL migration in Supabase      ║"
echo "║  5. Enable Email auth in Supabase        ║"
echo "╚══════════════════════════════════════════╝"
