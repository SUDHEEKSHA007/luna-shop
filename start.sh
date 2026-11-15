#!/bin/bash
# Luna Accessories - Full Stack Dev Runner
echo "=================================================="
echo "  ✦ LUNA ACCESSORIES - FULL STACK DEV RUNNER ✦"
echo "=================================================="

# Function to kill child processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Python Backend
echo "1. Starting Python FastAPI Backend on http://127.0.0.1:8000..."
cd backend
./venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start Next.js Frontend
echo "2. Starting Next.js Frontend on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🚀 Services are up and running!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://127.0.0.1:8000"
echo "   - API Docs (Swagger): http://127.0.0.1:8000/docs"
echo "   - Demo Account: demo@luna.com / luna123"
echo "Press Ctrl+C to stop all servers."
echo "=================================================="

wait

