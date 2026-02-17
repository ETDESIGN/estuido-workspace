#!/bin/bash
# Vercel Auto-Deploy Script for Cost Analytics Dashboard

PROJECT_NAME="estudio-cost-analytics"
BUILD_DIR="/home/e/.openclaw/workspace/dashboards/cost-analytics-v2"

cd "$BUILD_DIR"

echo "🚀 Deploying to Vercel..."

# Check if project exists
if ! vercel projects list 2>/dev/null | grep -q "$PROJECT_NAME"; then
  echo "⚠️ Project not found. Linking new project..."
  vercel link --yes --project "$PROJECT_NAME"
fi

# Deploy to production
echo "📦 Building and deploying..."
vercel --prod --yes

echo "✅ Deployment complete!"
echo "🌐 Check: https://$PROJECT_NAME.vercel.app"
