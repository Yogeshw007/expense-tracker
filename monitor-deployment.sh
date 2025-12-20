#!/bin/bash

# Monitor Render deployment by checking backend API
# This script will check every 30 seconds for up to 10 minutes

BACKEND_URL="https://expense-tracker-backend-bxuv.onrender.com"
MAX_ATTEMPTS=20  # 20 attempts × 30 seconds = 10 minutes
ATTEMPT=0
LAST_STATUS=""

echo "=========================================="
echo "🔍 MONITORING RENDER DEPLOYMENT"
echo "=========================================="
echo "Backend URL: $BACKEND_URL"
echo "Max wait time: 10 minutes"
echo "Checking every 30 seconds..."
echo ""
echo "Press Ctrl+C to stop monitoring"
echo "=========================================="
echo ""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    ELAPSED=$((ATTEMPT * 30))
    MINUTES=$((ELAPSED / 60))
    SECONDS=$((ELAPSED % 60))
    
    echo "[$MINUTES:$(printf "%02d" $SECONDS)] Attempt $ATTEMPT/$MAX_ATTEMPTS - Checking backend..."
    
    # Try to connect to the health endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BACKEND_URL/api/categories" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo ""
        echo "=========================================="
        echo "✅ DEPLOYMENT SUCCESSFUL!"
        echo "=========================================="
        echo "Backend is responding with HTTP 200"
        echo "Time taken: $MINUTES minutes $SECONDS seconds"
        echo ""
        
        # Test the API
        echo "Testing API endpoints..."
        echo ""
        
        echo "📊 Categories:"
        curl -s "$BACKEND_URL/api/categories" | python3 -m json.tool 2>/dev/null || echo "Could not parse JSON"
        echo ""
        
        echo "=========================================="
        echo "🎉 BACKEND IS LIVE AND WORKING!"
        echo "=========================================="
        echo "Backend URL: $BACKEND_URL"
        echo "Frontend: http://localhost:8000"
        echo ""
        echo "You can now use your expense tracker!"
        echo "=========================================="
        exit 0
        
    elif [ "$HTTP_CODE" = "503" ] || [ "$HTTP_CODE" = "000" ]; then
        if [ "$LAST_STATUS" != "deploying" ]; then
            echo "   ⏳ Backend is deploying or starting up..."
            LAST_STATUS="deploying"
        else
            echo "   ⏳ Still deploying..."
        fi
        
    elif [ "$HTTP_CODE" = "502" ] || [ "$HTTP_CODE" = "504" ]; then
        if [ "$LAST_STATUS" != "error" ]; then
            echo "   ⚠️  Backend returned error $HTTP_CODE - might be crashing"
            LAST_STATUS="error"
        else
            echo "   ⚠️  Still getting error $HTTP_CODE"
        fi
        
    else
        echo "   ❓ Unexpected status: HTTP $HTTP_CODE"
        LAST_STATUS="unknown"
    fi
    
    # Wait 30 seconds before next attempt
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        sleep 30
    fi
done

echo ""
echo "=========================================="
echo "❌ DEPLOYMENT TIMEOUT"
echo "=========================================="
echo "Backend did not respond after 10 minutes"
echo ""
echo "This likely means the deployment failed."
echo ""
echo "Please check Render dashboard for logs:"
echo "https://dashboard.render.com/"
echo ""
echo "Look for these errors in the logs:"
echo "  - SCRAM authentication errors"
echo "  - Database connection failures"
echo "  - Build failures"
echo "=========================================="
exit 1

