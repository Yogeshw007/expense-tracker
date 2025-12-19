#!/bin/bash

# Test Database Connection Script
# This script tests if the backend is connected to Neon database

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo "=========================================="
echo "🧪 TESTING DATABASE CONNECTION"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if backend is up
echo "📡 Test 1: Checking if backend is up..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/categories")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Backend is UP (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Backend is DOWN or starting (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}⏳ Wait 30 seconds and try again...${NC}"
    exit 1
fi
echo ""

# Test 2: Get current stats
echo "📊 Test 2: Getting current database stats..."
STATS=$(curl -s "$BACKEND_URL/api/analytics/stats")
echo "Response: $STATS"
echo ""

# Test 3: Create a test category
echo "🆕 Test 3: Creating test category..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Category","monthlyLimit":1000}')
echo "Response: $RESPONSE"
echo ""

# Test 4: Get all categories
echo "📋 Test 4: Getting all categories..."
CATEGORIES=$(curl -s "$BACKEND_URL/api/categories")
echo "Response: $CATEGORIES"
echo ""

# Test 5: Count categories
echo "🔢 Test 5: Counting categories..."
COUNT=$(echo "$CATEGORIES" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
echo "Total categories: $COUNT"
echo ""

if [ "$COUNT" -gt 0 ]; then
    echo -e "${GREEN}=========================================="
    echo "✅ DATABASE CONNECTION SUCCESSFUL!"
    echo "==========================================${NC}"
    echo ""
    echo "Your Neon database is connected and working!"
    echo "Categories stored: $COUNT"
else
    echo -e "${RED}=========================================="
    echo "❌ DATABASE MIGHT NOT BE CONNECTED"
    echo "==========================================${NC}"
    echo ""
    echo "Possible issues:"
    echo "1. Backend is still starting (wait 1-2 minutes)"
    echo "2. Database connection failed (check Render logs)"
    echo "3. Tables not created yet (check Neon SQL editor)"
fi
echo ""

# Test 6: Get updated stats
echo "📊 Test 6: Getting updated stats..."
STATS=$(curl -s "$BACKEND_URL/api/analytics/stats")
echo "Response: $STATS"
echo ""

echo "=========================================="
echo "🏁 TEST COMPLETE"
echo "=========================================="

