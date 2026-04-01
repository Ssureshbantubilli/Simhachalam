@echo off
REM Simhachalam setup script for Windows

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js 18+ and rerun this script.
  exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo npm is not installed. Please install npm and rerun this script.
  exit /b 1
)

REM Install dependencies
npm install

REM Create .env.local if missing
if not exist .env.local (
  copy .env.example .env.local
  echo Created .env.local from .env.example. Please fill in your API keys.
)

REM Install critters if missing
npm list critters >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  npm install critters
)

REM Build project
npm run build

echo.
echo Setup complete! Edit .env.local with your credentials, then run: npm run dev
