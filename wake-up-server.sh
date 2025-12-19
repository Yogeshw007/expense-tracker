#!/bin/bash

# Wake Up Server Script
# This script pings your backend server to wake it up from sleep

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Wake Up Backend Server Script       ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

echo -e "${YELLOW}🔌 Backend URL: ${BACKEND_URL}${NC}"
echo ""

# Function to check server status
check_server() {
    local url=$1
    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1)
    echo "$response"
}

# Function to ping server
ping_server() {
    local endpoint=$1
    local attempt=$2
    local total=$3
    
    echo -e "${BLUE}📡 Attempt ${attempt}/${total}: Pinging ${endpoint}...${NC}"
    
    response=$(curl -s -w "\n%{http_code}" --max-time 30 "${BACKEND_URL}${endpoint}" 2>&1)
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Success! Server responded with HTTP 200${NC}"
        return 0
    else
        echo -e "${YELLOW}⏳ Server returned HTTP ${http_code} (still waking up...)${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🚀 Starting wake-up sequence...${NC}"
echo ""

# Ping 1: Categories endpoint
ping_server "/api/categories" 1 3
sleep 3

# Ping 2: Analytics stats endpoint
ping_server "/api/analytics/stats" 2 3
sleep 3

# Ping 3: Final verification
if ping_server "/api/categories" 3 3; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ SERVER IS UP AND RUNNING!        ║${NC}"
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo ""
    
    # Test and display some data
    echo -e "${BLUE}📊 Fetching server stats...${NC}"
    stats=$(curl -s "${BACKEND_URL}/api/analytics/stats" 2>&1)
    
    if [ $? -eq 0 ]; then
        echo "$stats" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'  📁 Total Categories: {data.get(\"totalCategories\", 0)}')
    print(f'  💰 Total Budget: ₹{data.get(\"totalBudget\", 0):,.0f}')
    print(f'  📝 Total Expenses: {data.get(\"totalExpenses\", 0)}')
except:
    print('  ℹ️  Stats not available yet')
" 2>/dev/null || echo "  ℹ️  Stats not available yet"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Your backend is ready to use!${NC}"
    echo -e "${BLUE}🌐 You can now access your frontend at:${NC}"
    echo -e "${BLUE}   https://expense-tracker-frontend-pgju.onrender.com${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ⚠️  SERVER IS STILL STARTING...     ║${NC}"
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo ""
    echo -e "${YELLOW}💡 The server is waking up but needs more time.${NC}"
    echo -e "${YELLOW}   This is normal for Render's free tier.${NC}"
    echo ""
    echo -e "${BLUE}🔄 What to do:${NC}"
    echo -e "   1. Wait 30-60 seconds"
    echo -e "   2. Run this script again: ${GREEN}./wake-up-server.sh${NC}"
    echo -e "   3. Or refresh your frontend page"
    echo ""
    echo -e "${BLUE}💡 Tip: Keep this script running in background to prevent sleep:${NC}"
    echo -e "   ${GREEN}watch -n 300 ./wake-up-server.sh${NC} (pings every 5 minutes)"
    echo ""
    exit 1
fi

