#!/bin/bash

# 🤖 Agentic AI Crop Health System - Quick Start Script

echo "🚀 Starting Agentic AI Crop Health System..."
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "farmercrophealthbackend/agentic_health.py" ]; then
    echo "❌ Please run this script from the AgriHelp root directory."
    exit 1
fi

# Navigate to the agentic backend directory
cd farmercrophealthbackend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt
pip install -r requirements_agentic.txt

# Check if model files exist
if [ ! -f "plantvillage_weights_v22.pt" ]; then
    echo "⚠️  Warning: Model file not found. Please ensure plantvillage_weights_v22.pt is in the farmercrophealthbackend directory."
fi

# Check if classes.json exists
if [ ! -f "classes.json" ]; then
    echo "⚠️  Warning: classes.json not found. Please ensure classes.json is in the farmercrophealthbackend directory."
fi

# Start the agentic AI system
echo "🤖 Starting Agentic AI Crop Health System on port 5003..."
echo "📊 Available endpoints:"
echo "   - POST /agentic_predict - Enhanced prediction with agentic AI"
echo "   - GET  /agentic_status - System status"
echo "   - POST /agentic_learn - Provide feedback for learning"
echo "   - GET  /agentic_performance - Performance metrics"
echo ""
echo "🔧 Original system still available at http://localhost:5002"
echo "🤖 Agentic system available at http://localhost:5003"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=============================================="

# Start the agentic health server
python agentic_health.py 