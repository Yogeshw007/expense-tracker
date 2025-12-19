#!/bin/bash

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"

echo "=========================================="
echo "📊 DATABASE SUMMARY"
echo "=========================================="
echo ""

# Get stats
echo "📈 Overall Stats:"
curl -s "$BACKEND_URL/api/analytics/stats" | python3 -m json.tool
echo ""

# Get all categories
echo "📁 Categories:"
curl -s "$BACKEND_URL/api/categories" | python3 -c "
import sys, json
categories = json.load(sys.stdin)
print(f'Total: {len(categories)} categories\n')
for cat in categories:
    print(f'  {cat[\"id\"]:2d}. {cat[\"name\"]:20s} - ₹{cat[\"monthlyLimit\"]:,.0f}')
"
echo ""

# Get all expenses with totals
echo "💰 Expenses:"
curl -s "$BACKEND_URL/api/expenses" | python3 -c "
import sys, json
expenses = json.load(sys.stdin)
print(f'Total: {len(expenses)} expenses\n')

# Group by category
from collections import defaultdict
by_category = defaultdict(list)
for exp in expenses:
    by_category[exp['categoryName']].append(exp)

for cat_name, exps in sorted(by_category.items()):
    total = sum(e['amount'] for e in exps)
    print(f'\n  {cat_name}:')
    for exp in exps:
        print(f'    - {exp[\"date\"]} | ₹{exp[\"amount\"]:,.0f} | {exp[\"description\"]}')
    print(f'    Total: ₹{total:,.0f}')

# Grand total
grand_total = sum(e['amount'] for e in expenses)
print(f'\n  GRAND TOTAL: ₹{grand_total:,.0f}')
"
echo ""

echo "=========================================="
echo "✅ SUMMARY COMPLETE"
echo "=========================================="
