#!/bin/bash
# Simhachalam setup script for Linux/macOS
set -e

# Check for Node.js and npm
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Please install Node.js 18+ and rerun this script."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Please install npm and rerun this script."
  exit 1
fi

# Install dependencies
npm install

# Create .env.local if missing
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example. Please fill in your API keys."
fi

# Install critters if missing (for optimizeCss)
if ! npm list critters >/dev/null 2>&1; then
  npm install critters
fi

# Build project
npm run build

echo "\nSetup complete! Edit .env.local with your credentials, then run: npm run dev"
