#!/bin/bash

# Seed Data Script for Expense Tracker
# This script populates the backend with sample categories and expenses

API_URL="https://expense-tracker-backend-bxuv.onrender.com/api"

echo "🌱 Seeding Expense Tracker Database..."
echo "======================================"
echo ""

# Step 1: Create Categories
echo "📁 Creating Categories..."

# Food Category
FOOD_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food",
    "monthlyLimit": 15000,
    "color": "#FF6B6B",
    "icon": "utensils"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Food category created (ID: $FOOD_ID)"

# Transport Category
TRANSPORT_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transport",
    "monthlyLimit": 8000,
    "color": "#4ECDC4",
    "icon": "car"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Transport category created (ID: $TRANSPORT_ID)"

# Shopping Category
SHOPPING_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shopping",
    "monthlyLimit": 10000,
    "color": "#95E1D3",
    "icon": "shopping-bag"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Shopping category created (ID: $SHOPPING_ID)"

# Entertainment Category
ENTERTAINMENT_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Entertainment",
    "monthlyLimit": 5000,
    "color": "#F38181",
    "icon": "film"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Entertainment category created (ID: $ENTERTAINMENT_ID)"

# Bills Category
BILLS_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bills",
    "monthlyLimit": 12000,
    "color": "#AA96DA",
    "icon": "file-invoice-dollar"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Bills category created (ID: $BILLS_ID)"

# Health Category
HEALTH_ID=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Health",
    "monthlyLimit": 7000,
    "color": "#FCBAD3",
    "icon": "heartbeat"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Health category created (ID: $HEALTH_ID)"

echo ""
echo "💰 Creating Sample Expenses..."

# Food Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $FOOD_ID},
    \"amount\": 450,
    \"description\": \"Lunch at restaurant\",
    \"date\": \"2025-12-15\"
  }" > /dev/null
echo "✅ Added: Lunch at restaurant - ₹450"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $FOOD_ID},
    \"amount\": 2500,
    \"description\": \"Weekly groceries\",
    \"date\": \"2025-12-12\"
  }" > /dev/null
echo "✅ Added: Weekly groceries - ₹2500"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $FOOD_ID},
    \"amount\": 180,
    \"description\": \"Coffee and snacks\",
    \"date\": \"2025-12-18\"
  }" > /dev/null
echo "✅ Added: Coffee and snacks - ₹180"

# Transport Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $TRANSPORT_ID},
    \"amount\": 3500,
    \"description\": \"Petrol for car\",
    \"date\": \"2025-12-10\"
  }" > /dev/null
echo "✅ Added: Petrol for car - ₹3500"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $TRANSPORT_ID},
    \"amount\": 250,
    \"description\": \"Uber to office\",
    \"date\": \"2025-12-16\"
  }" > /dev/null
echo "✅ Added: Uber to office - ₹250"

# Shopping Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $SHOPPING_ID},
    \"amount\": 1200,
    \"description\": \"New shirt\",
    \"date\": \"2025-12-14\"
  }" > /dev/null
echo "✅ Added: New shirt - ₹1200"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $SHOPPING_ID},
    \"amount\": 3500,
    \"description\": \"Electronics - Mouse and Keyboard\",
    \"date\": \"2025-12-08\"
  }" > /dev/null
echo "✅ Added: Electronics - ₹3500"

# Entertainment Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $ENTERTAINMENT_ID},
    \"amount\": 800,
    \"description\": \"Movie tickets\",
    \"date\": \"2025-12-13\"
  }" > /dev/null
echo "✅ Added: Movie tickets - ₹800"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $ENTERTAINMENT_ID},
    \"amount\": 1500,
    \"description\": \"Netflix and Spotify subscription\",
    \"date\": \"2025-12-01\"
  }" > /dev/null
echo "✅ Added: Subscriptions - ₹1500"

# Bills Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $BILLS_ID},
    \"amount\": 2500,
    \"description\": \"Electricity bill\",
    \"date\": \"2025-12-05\"
  }" > /dev/null
echo "✅ Added: Electricity bill - ₹2500"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $BILLS_ID},
    \"amount\": 1200,
    \"description\": \"Internet bill\",
    \"date\": \"2025-12-07\"
  }" > /dev/null
echo "✅ Added: Internet bill - ₹1200"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $BILLS_ID},
    \"amount\": 500,
    \"description\": \"Mobile recharge\",
    \"date\": \"2025-12-11\"
  }" > /dev/null
echo "✅ Added: Mobile recharge - ₹500"

# Health Expenses
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $HEALTH_ID},
    \"amount\": 1500,
    \"description\": \"Doctor consultation\",
    \"date\": \"2025-12-09\"
  }" > /dev/null
echo "✅ Added: Doctor consultation - ₹1500"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $HEALTH_ID},
    \"amount\": 850,
    \"description\": \"Medicines\",
    \"date\": \"2025-12-17\"
  }" > /dev/null
echo "✅ Added: Medicines - ₹850"

curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d "{
    \"category\": {\"id\": $HEALTH_ID},
    \"amount\": 2000,
    \"description\": \"Gym membership\",
    \"date\": \"2025-12-01\"
  }" > /dev/null
echo "✅ Added: Gym membership - ₹2000"

echo ""
echo "✨ Database seeding completed!"
echo ""
echo "📊 Summary:"
echo "  - 6 Categories created"
echo "  - 15 Sample expenses added"
echo "  - Total expenses: ₹22,930"
echo ""
echo "🌐 Visit your backend: $API_URL/expenses"
echo "🎉 Your expense tracker is ready to use!"

