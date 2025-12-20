#!/bin/bash

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo "=========================================="
echo "📝 ADDING SAMPLE EXPENSES"
echo "=========================================="
echo ""

# Category IDs:
# 1 = Broadband & OTT (₹700)
# 2 = Fuel (₹2,000)
# 3 = House Rent (₹12,000)
# 4 = Entertainment (₹1,000)
# 5 = Food (₹1,000)

# Broadband & OTT Expenses
echo "📡 Adding Broadband & OTT expenses..."
curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":1},"amount":199,"description":"Netflix subscription","date":"2025-12-01"}' > /dev/null
echo "✅ Netflix subscription - ₹199"

curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":1},"amount":499,"description":"Broadband monthly bill","date":"2025-12-05"}' > /dev/null
echo "✅ Broadband bill - ₹499"
echo ""

# Fuel Expenses
echo "⛽ Adding Fuel expenses..."
curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":2},"amount":800,"description":"Petrol for bike","date":"2025-12-10"}' > /dev/null
echo "✅ Petrol - ₹800"

curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":2},"amount":750,"description":"Petrol refill","date":"2025-12-15"}' > /dev/null
echo "✅ Petrol refill - ₹750"
echo ""

# House Rent
echo "🏠 Adding House Rent..."
curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":3},"amount":12000,"description":"Monthly rent - December","date":"2025-12-01"}' > /dev/null
echo "✅ Monthly rent - ₹12,000"
echo ""

# Entertainment Expenses
echo "🎬 Adding Entertainment expenses..."
curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":4},"amount":500,"description":"Movie tickets","date":"2025-12-12"}' > /dev/null
echo "✅ Movie tickets - ₹500"

curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":4},"amount":299,"description":"Amazon Prime subscription","date":"2025-12-01"}' > /dev/null
echo "✅ Amazon Prime - ₹299"
echo ""

# Food Expenses
echo "🍔 Adding Food expenses..."
curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":5},"amount":350,"description":"Lunch at restaurant","date":"2025-12-18"}' > /dev/null
echo "✅ Restaurant lunch - ₹350"

curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":5},"amount":450,"description":"Dinner with friends","date":"2025-12-19"}' > /dev/null
echo "✅ Dinner - ₹450"

curl -s -X POST "$BACKEND_URL/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":5},"amount":150,"description":"Coffee and snacks","date":"2025-12-19"}' > /dev/null
echo "✅ Coffee & snacks - ₹150"
echo ""

echo "=========================================="
echo "✅ ALL SAMPLE EXPENSES ADDED!"
echo "=========================================="
echo ""

# Get final stats
echo "📊 Updated Database Stats:"
STATS=$(curl -s "$BACKEND_URL/api/analytics/stats")
echo "$STATS" | python3 -m json.tool
echo ""

# Get all expenses
echo "📋 All Expenses:"
EXPENSES=$(curl -s "$BACKEND_URL/api/expenses")
echo "$EXPENSES" | python3 -m json.tool | head -50
echo ""

echo "=========================================="
echo "🎉 SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- 5 Categories created"
echo "- 10 Sample expenses added"
echo "- Total Budget: ₹16,700"
echo "- Total Spent: Check stats above"
echo ""
echo "Next steps:"
echo "1. Open your frontend to view the dashboard"
echo "2. Check analytics page for charts"
echo "3. Add more expenses as needed"
echo ""

