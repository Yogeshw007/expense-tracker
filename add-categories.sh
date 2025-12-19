#!/bin/bash

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo "=========================================="
echo "📦 ADDING YOUR 5 CATEGORIES"
echo "=========================================="
echo ""

# First, delete the test category
echo "🗑️  Deleting test category..."
curl -s -X DELETE "$BACKEND_URL/api/categories/1"
echo "✅ Test category deleted"
echo ""

# Add Category 1: Broadband & OTT
echo "📡 Adding: Broadband & OTT (₹700)..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Broadband & OTT","monthlyLimit":700}')
echo "Response: $RESPONSE"
echo ""

# Add Category 2: Fuel
echo "⛽ Adding: Fuel (₹2,000)..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fuel","monthlyLimit":2000}')
echo "Response: $RESPONSE"
echo ""

# Add Category 3: House Rent
echo "🏠 Adding: House Rent (₹12,000)..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"House Rent","monthlyLimit":12000}')
echo "Response: $RESPONSE"
echo ""

# Add Category 4: Entertainment
echo "🎬 Adding: Entertainment (₹1,000)..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Entertainment","monthlyLimit":1000}')
echo "Response: $RESPONSE"
echo ""

# Add Category 5: Food
echo "🍔 Adding: Food (₹1,000)..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","monthlyLimit":1000}')
echo "Response: $RESPONSE"
echo ""

echo "=========================================="
echo "✅ ALL CATEGORIES ADDED!"
echo "=========================================="
echo ""

# Get final stats
echo "📊 Final Database Stats:"
STATS=$(curl -s "$BACKEND_URL/api/analytics/stats")
echo "$STATS" | python3 -m json.tool
echo ""

# List all categories
echo "📋 All Categories:"
CATEGORIES=$(curl -s "$BACKEND_URL/api/categories")
echo "$CATEGORIES" | python3 -m json.tool
echo ""

echo "=========================================="
echo "🎉 SETUP COMPLETE!"
echo "=========================================="
