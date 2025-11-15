#!/bin/bash

echo "Starting Real Estate CRM..."

echo ""
echo "Starting Backend Server..."
python app.py &
BACKEND_PID=$!

echo ""
echo "Waiting for backend to start..."
sleep 5

echo ""
echo "Starting Frontend Server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
