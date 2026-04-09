#!/bin/bash
# Environment setup for Pérez Dental Agent
# Adds required env vars to ~/.openclaw/.env

echo "🔐 Setting up environment variables..."

# Admin password for Dra. Martínez authentication
if ! grep -q "ADMIN_PASSWORD" ~/.openclaw/.env 2>/dev/null; then
  echo 'ADMIN_PASSWORD=colmillo2026' >> ~/.openclaw/.env
  echo "✅ ADMIN_PASSWORD added to ~/.openclaw/.env"
else
  echo "⚠️  ADMIN_PASSWORD already exists in .env — skipping"
fi

echo ""
echo "✅ Environment setup complete."
echo "⚠️  Remember to change the default password if using in production!"
