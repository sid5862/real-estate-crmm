#!/bin/bash

echo "Starting Real Estate CRM Server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    exit 1
fi

# Check if MySQL is running
echo "Checking MySQL connection..."
python3 -c "import mysql.connector; mysql.connector.connect(host='localhost', user='root', password='root')" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Warning: MySQL connection failed. Make sure MySQL is running."
    echo "Continuing anyway..."
fi

# Kill any existing Python processes on port 5000
echo "Checking for existing processes on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Start the Flask server
echo "Starting Flask server..."
echo "Server will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python3 app.py
