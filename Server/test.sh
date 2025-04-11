#!/bin/bash

# Exit on any error
set -e

# Function to cleanup
cleanup() {
    echo "Cleaning up..."
    docker stop investment-test 2>/dev/null || true
    docker rm investment-test 2>/dev/null || true
}

# Set up cleanup on script exit
trap cleanup EXIT

echo "Building Docker image..."
docker build -t investment-ai-server .

echo "Starting Docker container..."
docker run -d \
    -p 10000:10000 \
    -e PORT=10000 \
    --env-file .env \
    --name investment-test \
    investment-ai-server

echo "Waiting for server to start..."
sleep 5

echo "Checking container logs..."
docker logs investment-test

echo "Checking if server is listening on correct port..."
docker exec investment-test netstat -tulpn | grep LISTEN || true

echo "Testing health endpoint..."
curl -v http://localhost:10000/api/health
echo ""

echo "Checking container status..."
docker ps -a | grep investment-test

if docker ps | grep -q investment-test; then
    echo "Container is running"
    response=$(curl -s --retry 3 --retry-delay 1 http://localhost:10000/api/health)
    echo "Response: $response"
    
    if [[ $response == *"ok"* ]]; then
        echo "Test successful!"
        exit 0
    else
        echo "Test failed - unexpected response"
        docker logs investment-test
        exit 1
    fi
else
    echo "Container is not running"
    docker logs investment-test
    exit 1
fi 