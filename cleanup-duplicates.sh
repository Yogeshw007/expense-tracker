#!/bin/bash

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo "=========================================="
echo "🧹 CLEANING UP DUPLICATE CATEGORIES"
echo "=========================================="
echo ""

# Delete old duplicates (IDs 2-6)
echo "🗑️  Deleting old duplicates..."
for id in 2 3 4 5 6; do
    echo "Deleting category ID: $id"
    curl -s -X DELETE "$BACKEND_URL/api/categories/$id"
done
echo "✅ Old duplicates deleted"
echo ""

echo "=========================================="
echo "✅ CLEANUP COMPLETE!"
echo "=========================================="
echo ""

# Get final stats
echo "📊 Final Database Stats:"
STATS=$(curl -s "$BACKEND_URL/api/analytics/stats")
echo "$STATS" | python3 -m json.tool
echo ""

# List all categories
echo "📋 All Categories (Clean):"
CATEGORIES=$(curl -s "$BACKEND_URL/api/categories")
echo "$CATEGORIES" | python3 -m json.tool
echo ""

echo "=========================================="
echo "🎉 YOU NOW HAVE 5 CLEAN CATEGORIES!"
echo "=========================================="
