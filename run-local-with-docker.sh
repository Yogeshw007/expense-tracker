#!/bin/bash

echo "=========================================="
echo "🚀 STARTING EXPENSE TRACKER LOCALLY"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo ""
    echo "Please install Docker Desktop from:"
    echo "https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Stop and remove existing container if it exists
echo "🧹 Cleaning up old containers..."
docker stop expense-tracker-backend 2>/dev/null
docker rm expense-tracker-backend 2>/dev/null
echo ""

# Build the Docker image
echo "🔨 Building Docker image..."
cd backend
docker build -t expense-tracker-backend:local .
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi
cd ..
echo "✅ Docker image built successfully"
echo ""

# Run the container with H2 database (local mode)
echo "🚀 Starting backend server..."
docker run -d \
  --name expense-tracker-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  -v "$(pwd)/backend/data:/app/data" \
  expense-tracker-backend:local

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container!"
    exit 1
fi

echo "✅ Backend server started!"
echo ""

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is responding
for i in {1..30}; do
    if curl -s http://localhost:8080/api/categories > /dev/null 2>&1; then
        echo "✅ Server is UP and responding!"
        echo ""
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

echo "=========================================="
echo "✅ EXPENSE TRACKER IS RUNNING!"
echo "=========================================="
echo ""
echo "📊 Backend API: http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo "   JDBC URL: jdbc:h2:file:./data/expensetracker"
echo "   Username: sa"
echo "   Password: (leave blank)"
echo ""
echo "📋 Useful Commands:"
echo "   View logs:    docker logs -f expense-tracker-backend"
echo "   Stop server:  docker stop expense-tracker-backend"
echo "   Restart:      docker restart expense-tracker-backend"
echo ""
echo "🌐 Open frontend:"
echo "   cd frontend && python3 -m http.server 8000"
echo "   Then open: http://localhost:8000"
echo ""
echo "=========================================="

