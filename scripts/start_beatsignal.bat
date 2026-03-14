@echo off
title BeatSignal Launcher

echo Starting BeatSignal...

echo.
echo Starting Backend Server...
start cmd /k "cd backend && uvicorn main:app --reload"

timeout /t 3 > nul

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

timeout /t 5 > nul

echo Opening BeatSignal in browser...
start http://localhost:3000

echo.
echo BeatSignal is running!
pause