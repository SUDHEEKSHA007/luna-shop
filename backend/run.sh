#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Luna Accessories Python API on http://127.0.0.1:8000..."
./venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000

