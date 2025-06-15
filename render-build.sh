#!/usr/bin/env bash

# Exit on error
set -o errexit

# Create Puppeteer cache directory if it doesn't exist
export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

# Optional: If you have a build step for your app
# npm run build